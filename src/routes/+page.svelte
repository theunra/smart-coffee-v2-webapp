<script>
    import {onMount} from 'svelte';
    import Chart from 'chart.js/auto';
    import OtherInfoCard from '$lib/components/OtherInfoCard.svelte';
    
    class LineMarker{
      CreateLineMarker(id, color){
        const lineMarker = {
          id: id,
          linePos: -1,
          isShow: false,
          beforeDatasetsDraw: (chart, args, plugins) => {
              const {ctx, chartArea : {top, bottom}, scales: { x }} = chart;
              
              ctx.save();

              if(!lineMarker.isShow) return;
              ctx.beginPath();
              ctx.strokeStyle = color;
              ctx.lineWidth = 3;
              ctx.moveTo(x.getPixelForValue(lineMarker.linePos), top);
              ctx.lineTo(x.getPixelForValue(lineMarker.linePos), bottom);
              ctx.stroke();
            },
        };  
        return lineMarker;
      }
    }

    let ctx;
    let ctx1;
    let chart;
    let chart1;

    let chargeLineMarker;
    let lightLineMarker;
    let mediumLineMarker;
    let darkLineMarker;

    let raw_datas = {
        adc_mq135 : [],
        roastStatus : [],
      };

    let ppm_datas = {
        mq135_co : [],
      };

    let labels = [];

    for(let i = 0; i < 1000; i++){
        labels.push(i);
      }

    let currentRoastStatus = -1;

    let dataTracker = 3;
    let chargeIdx = -1;
    let lightIdx = -1;
    let isDeviceActive = false;

    const url_data_api = '/data';
    const url_device_api = "/device";

    const GetData = async () => {
        const response = await fetch(`${url_data_api}?` + new URLSearchParams({
            tracker : dataTracker, 
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
        raw_datas.adc_mq135 = datas.payload.enose_raw_datas.map((d) => d.adc_mq135);
        raw_datas.roastStatus = datas.payload.enose_raw_datas.map((d) => d.roastStatus);
        currentRoastStatus = raw_datas.roastStatus[raw_datas.roastStatus.length - 1];
        
        chargeIdx = -1;
        lightIdx = -1;

        for(let k = 0; k < raw_datas.roastStatus.length; k++){
            if(raw_datas.roastStatus[k] == 1) {//first light found
                chargeIdx = k;
                break;
              }
          }

        for(let k = chargeIdx; k < raw_datas.roastStatus.length; k++){
            if(raw_datas.roastStatus[k] == 2) {//first light found
                lightIdx = k;
                break;
              }
          }
        
        //let ts = datas.payload.enose_raw_datas.map((d) => d.time.split("T")[1]);

        //labels = ts;
        
        dataTracker = datas.tracker;

        await GetData();
      }

    const InsertData = async () => {
        const response = await fetch(`${url_data_api}`, {
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
    
    let lastLampId = "";

    $: {
        let lampId = "";

        switch(currentRoastStatus){
            case 0:
              lampId = "preheat";
              break;
            case 1:
              lampId = "charge";
              break;
            case 2:
              lampId = "light";
              break;
            case 3:
              lampId = "medium";
              break;
            case 4:
              lampId = "dark";
              break;
            default:
              break;
          }
        
        if(lampId != ""){
            const lamp = document.getElementById("lamp-" + lampId);
            console.log(lamp.className);
            lamp.className = lamp.className.replace("lamp-off", "");

            if(lastLampId != ""){
                const lastLamp = document.getElementById("lamp-" + lastLampId);
                console.log(lastLamp.className);
                lastLamp.className = lastLamp.className + " lamp-off";
                console.log(lastLamp.className);
              }
            lastLampId = lampId;
          }
      }

    $: if (chart) {
        console.log("x is changed");
        chart.data.datasets[0].data = raw_datas.adc_mq135;
        chart.data.labels = labels;
        
        lightLineMarker.linePos = lightIdx;
        if(lightIdx == -1) lightLineMarker.isShow = false;
        else lightLineMarker.isShow = true;
        chart.config.plugins[0] = lightLineMarker;
        
        chargeLineMarker.linePos = chargeIdx;
        if(chargeIdx == -1) chargeLineMarker.isShow = false;
        else chargeLineMarker.isShow = true;
        chart.config.plugins[1] = chargeLineMarker;
        
        console.log(chart.config.plugins);

        console.log(chart.data.datasets);
        
        chart.update();
      }
      
    

    const CreateSensorGraphs = () => {
      chart = new Chart(ctx, {
        type: 'line',
        data : {
            labels : labels,
            datasets: [
                  {            
                    label : 'mq135',
                    tension : 0.3,
                    data : raw_datas.adc_mq135,
                  },
              ]
          },
        plugins: [lightLineMarker, chargeLineMarker],
        options:{
          animation: {
              duration: 0,
            },
            elements: {
                point: {
                    radius : 0,
                  },
              },
            scale : {
                y : {
                    max : 40000,
                    min : 0,
                  }
              }
          },
      });

      chart1 = new Chart(ctx1, {
        type: 'line',
        data : {
            labels : labels,
            datasets: [
                  {            
                    label : 'mq135 co',
                    tension : 0.3,
                    data : ppm_datas.mq135_co,
                  },
              ]
          },
        // plugins: [lightLineMarker],
        });
    }
    
    lightLineMarker = new LineMarker().CreateLineMarker("preheatLineMarker", "blue");
    chargeLineMarker = new LineMarker().CreateLineMarker("chargeLineMarker", "green");

    onMount(async () => {
        CreateSensorGraphs();
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
            <div id="lamp-preheat" class="col fw-bold p-2 m-2 rounded-3 lamp-preheat lamp-off">
              PREHEAT
            </div>
            <div id="lamp-charge" class="col fw-bold p-2 m-2 rounded-3 lamp-charge lamp-off">
              CHARGE
            </div>
            <div id="lamp-light" class="col fw-bold p-2 m-2 rounded-3 lamp-light lamp-off">
              LIGHT
            </div>
            <div id="lamp-medium" class="col fw-bold p-2 m-2 rounded-3 lamp-medium lamp-off">
              MEDIUM
            </div>
            <div id="lamp-dark" class="col fw-bold p-2 m-2 rounded-3 lamp-dark lamp-off">
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
        <!-- <div class="row content-container rounded-4 p-4 mt-3">
          <div class="col">
            <div class="row">
              <div class="fw-bold">Other Info</div>
              <div class="row">
                <div class="col">Device Active</div>
                <div class="col">{isDeviceActive}</div>
            </div>
            </div>
          </div>
        </div> -->
        <OtherInfoCard/>
      </div>
      <div id="info-card" class="col-4" hidden> <!--Info Card-->
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
      </div><!--//Info Card-->
    </div>
  </div>
</div>
</div>

<!--
<button on:click={()=>{
        currentRoastStatus = currentRoastStatus + 1;
        if(currentRoastStatus > 4) currentRoastStatus = 0;
        }}>
        p
</button>
-->
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

  .lamp-preheat {
    color: white;
    background: rgb(200,249,88);
    background: linear-gradient(90deg, rgba(200,249,88,1) 0%, rgba(39,255,52,0.880529579996061) 23%, rgba(39,255,52,0.8721262186515231) 83%, rgba(200,249,88,1) 100%);
  }

  .lamp-light {
    color: white;
    background: rgb(200,249,88);
    background: linear-gradient(90deg, rgba(200,249,88,1) 0%, rgba(39,255,52,0.880529579996061) 23%, rgba(39,255,52,0.8721262186515231) 83%, rgba(200,249,88,1) 100%);
  }

  .lamp-medium {
    color: white;
    background: rgb(200,249,88);
    background: linear-gradient(90deg, rgba(200,249,88,1) 0%, rgba(39,255,52,0.880529579996061) 23%, rgba(39,255,52,0.8721262186515231) 83%, rgba(200,249,88,1) 100%);
  }

  .lamp-dark {
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
