<script>
  import {onMount} from 'svelte';
    import Chart from 'chart.js/auto';
    
    let data = [20, 10, 30, 40];
    let labels = ['a', 'b', 'c', 'd'];
    let x = 3;
    let lightIdx = 0;
    let isDeviceActive = false;

    const api_url = '/data';
    const GetData = async () => {
        const response = await fetch(`${api_url}?` + new URLSearchParams({
            tracker : x, 
            get_raw_data : true,
          }), {
              method : 'GET',
            });
        
        const status = await response.status;

        if(status != 200){
            //failed
            if(status == 504) {
                //timeout
                await GetData(); // retry
              }
            else{
                console.log(response);
              }
          }
        const datas = await response.json();
        console.log(datas);
        let vals = datas.payload.enose_raw_datas.map((d) => d.adc_mq135);
        let ts = datas.payload.enose_raw_datas.map((d) => d.time.split("T")[1]);

        data = vals;
        labels = ts;
        x = datas.tracker;

        await GetData();
      }

    const InsertData = async () => {
        const response = await fetch(`${api_url}`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
              },
            body: JSON.stringify({val : 15}),
          });
        const status = await response.json();
        console.log(status);
      }

    const url_device_api = "/device";
    
    const GetIsDeviceActive = async () => {
        const response = await fetch(`${url_device_api}?` + new URLSearchParams({
            param : "isDeviceActive",
          }), {
            method: 'GET',
            });       
        
        const resp_data = await response.json();

        isDeviceActive = resp_data.payload.isDeviceActive;

        console.log("device active : ", isDeviceActive);
        setTimeout(()=>{
            GetIsDeviceActive();
          }, 1000);
      }
    
    const SendStartRoast = async () => {
        const response = await fetch(`${url_device_api}`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
              },
            body: JSON.stringify({param : "start-roast"}),
          });
        const status = await response.json();
        console.log(status);
      }


    let ctx;
    let ctx1;
    let chart;
    let chart1;
    let lineMarker;

    let f = 2;

    $: if (chart) {
        console.log("x is changed");
        chart.data.datasets[0].data = data;
        chart.data.labels = labels;
        
        lineMarker.linePos = lightIdx;
        if(lightIdx % 2 == 0) lineMarker.isShow = false;
        else lineMarker.isShow = true;
        chart.config.plugins[0] = lineMarker;
        
        console.log(chart.config.plugins);

        console.log(chart.data.datasets);
        
        chart.update();
      }
        lineMarker = {
            id: 'lineMarker',
            linePos: 0,
            isShow: true,
            beforeDatasetsDraw: (chart, args, plugins) => {
                const {ctx, chartArea : {top, bottom}, scales: { x }} = chart;
               
                ctx.save();

                if(!lineMarker.isShow) return;
                ctx.beginPath();
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 3;
                ctx.moveTo(x.getPixelForValue(lineMarker.linePos), top);
                ctx.lineTo(x.getPixelForValue(lineMarker.linePos), bottom);
                ctx.stroke();

              },
          }


    onMount(async () => {
        chart = new Chart(ctx, {
            type: 'line',
            data : {
                labels : labels,
                datasets: [
                      {            
                        label : 'mq135',
                        tension : 0.3,
                        data : data,
                      },
                  ]
              },
            plugins: [lineMarker],
            options:{
              animation: {
                  duration: 0,
                }
              }
          });

        chart1 = new Chart(ctx1, {
            type: 'line',
            data : {
                labels : labels,
                datasets: [
                      {            
                        label : 'mq135',
                        tension : 0.3,
                        data : data,
                      },
                  ]
              },
           // plugins: [lineMarker],
          });
        console.log("mounted"); 
        GetData();
        GetIsDeviceActive();
      });

    const onClickStartSetup = async () => {
        if(!isDeviceActive) {
            console.log("device is offline");
            return;
          }
        await SendStartRoast();
        const infocard = document.getElementById("info-card");
        const setupcard = document.getElementById("setup-card");
        infocard.hidden = false;
        setupcard.hidden = true;
      }
</script>

<div class="container-fluid row text-center p-3 rounded-4 main-back min-vh-100">
  <div class="col-1">
    <div class="row">
      <!--<img class="img-fluid logo-img rounded-start" src="/smartcoffeelogo.png"/>-->
      <div class="col">logo</div>
    </div>
    <div class="row">
      <div class="col fs-6 rounded-start mt-1 pt-2 pb-2 main-container">Dashboard</div>
    </div>
  </div>
<div class="col main-container p-3 ps-5 rounded-4">
  <div class="row mt-4 align-items-start" style="height: 10vh">
    <div class="col text-start">
      <div class="fw-bold fs-3">Dashboard Monitoring</div>
      <div class="fs-5">Smart Coffee Roaster Realtime Monitoring System</div>
    </div>
  </div>
  <div class="row content-container me-3 rounded-4">
    <div class="row">
      <div class="col text-start ps-4 pt-4">
        <div class="fw-bolder fs-5">Monitoring Graph</div>
      </div>
      <div class="col">
      </div>
    </div>
    <div class="row p-4">
      <div class="col">
        <div class="row">
          <div class="row" width=400 height=200>
            <canvas id="mychart" bind:this={ctx} width={700} height={200}></canvas>
          </div>          
          <div class="row" width=400 height=200>
            <canvas id="mychart1" bind:this={ctx1} width={700} height={200}></canvas>
          </div> 
 
         <div class="row p-2">
            <div class="col fw-bold p-2 m-2 rounded-3 lamp-off">
              PREHEAT
            </div>
            <div class="col fw-bold p-2 m-2 rounded-3 lamp-charge">
              CHARGE
            </div>
            <div class="col fw-bold p-2 m-2 rounded-3 lamp-off">
              LIGHT
            </div>
            <div class="col fw-bold p-2 m-2 rounded-3 lamp-off">
              MEDIUM
            </div>
            <div class="col fw-bold p-2 m-2 rounded-3 lamp-off">
              DARK
            </div>
          </div>          
       </div>
      </div>
      <div id="setup-card" class="col-4">
        <div class="row content-container rounded-4 p-4">
          <div class="row">
            <div class="fw-bold mb-4">Start a new Roasting</div>
            <div class="row mb-2">
              <div class="col">Bean Type</div>
              <div class="col">
                <select name="bean-type" id="bean-type">
                  <option value="arabica">Arabica</option>
                  <option value="robusta">Robusta</option>
                </select>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col">Roast Level</div>
              <div class="col">
                <select name="roast-level" id="roast-level">
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div> 
            <div class="row">
              <div class="col"></div>
              <div class="col fs-5 fw-bold mt-4 card-button" on:click={onClickStartSetup}>START</div>
              <div class="col"></div>
            </div>
          </div>
        </div>
        <div class="row content-container rounded-4 p-4 mt-3">
          <div class="col">
            <div class="row">
              <div class="fw-bold">Other Info</div>
              <div class="row">
                <div class="col">Device Active</div>
                <div class="col">{isDeviceActive}</div>
            </div>
            </div>
          </div>
        </div>
 
      </div>
      <div id="info-card" class="col-4" hidden>
        <div class="row content-container rounded-4 p-4">
          <div class="row">
            <div class="fw-bold">Roast Info</div>
            <div class="row">
              <div class="col">Bean Type</div>
              <div class="col">Arabica</div>
            </div>
            <div class="row">
              <div class="col">Roast Level</div>
              <div class="col">Light</div>
            </div>
            <div class="row">
              <div class="col">Time Elapsed</div>
              <div class="col">00:12:42</div>
            </div>
          </div>
        </div>        
        <div class="row content-container rounded-4 p-4 mt-3">
          <div class="col">
            <div class="row">
              <div class="fw-bold">Other Info</div>
              <div class="row">
                <div class="col">Device Active</div>
                <div class="col">{isDeviceActive}</div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

<!--<button on:click={()=>{lightIdx = lightIdx + 1;}}>p</button>-->
<style>
  /*
  canvas {
    width : 400;
    height: 400;
    background-color: red;
  }*/
  .bg-red {
    background-color: red;
  }

  .bg-blue {
    background-color: blue;
  }

  .main-back{
    #background: rgb(255,185,216) !important;
    background: radial-gradient(circle, rgba(255,185,216,0.7852914847579657) 0%, rgba(196,234,255,0.5612018489036239) 100%);
  }

  .main-container {
    background-color: rgba(255, 255, 255, 0.6);
  }

  .content-container {
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: 2px 10px 10px rgb(203 203 203);
  }
  
  .logo-img{
    #margin-right: 2px;
    #border: 5px solid white;
    #border-radius: 10%;
    #background-color: white;
  }

  .lamp-charge {
    color: white;
    background: rgb(200,249,88);
    background: linear-gradient(90deg, rgba(200,249,88,1) 0%, rgba(39,255,52,0.880529579996061) 23%, rgba(39,255,52,0.8721262186515231) 83%, rgba(200,249,88,1) 100%);
  }

  .lamp-off {
    color: white;
    background: rgb(112,112,112);
    background: linear-gradient(90deg, rgba(112,112,112,1) 0%, rgba(159,159,159,0.880529579996061) 23%, rgba(142,142,142,0.8721262186515231) 83%, rgba(131,131,131,1) 100%);

  }

  .card-button {
    color: white;
    background: green;
    border-radius: 20px;
  }

  .card-button:hover{
    color: black;
    background: greenyellow;
    cursor: pointer;
  }

</style>
