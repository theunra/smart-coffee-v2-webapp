<script>
    import {onMount} from 'svelte';
    import {GetIsDeviceActive, SendStartRoast} from '$lib/api/device.js';
    import {GetData} from '$lib/api/data.js';
    import RoastStatusLamp from '$lib/components/RoastStatusLamp.svelte';
    import ControlPanel from '$lib/components/ControlPanel.svelte';
    import MonitoringGraph from '$lib/components/MonitoringGraph.svelte';
    import {EnoseGraphData, processEnoseGraphData} from '$lib/digest/enose-data.js';


    let currentRoastStatus = -1;
    
    let isDeviceActive = false;

    let enoseGraphData = new EnoseGraphData();

    onMount(async () => {
        GetIsDeviceActive();
        PollEnoseData();

        for(let i = 0; i< 1000; i++){
            enoseGraphData.labelData.push(i);
        }

      });

    const PollEnoseData = async () => {
        let datas = await GetData(enoseGraphData.dataTracker);
       
        const {rawData} = processEnoseGraphData(datas);
        enoseGraphData.rawData.adc_mq135 = rawData.adc_mq135;

        PollEnoseData();
      }


    const onClickStartSetup = async (param) => {
      console.log(param);
      if(!isDeviceActive) {
          console.log("device is offline");
          return;
        }
      await SendStartRoast();
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
              <MonitoringGraph graphId="raw-chart" graphDataType="raw" enoseGraphData="{enoseGraphData}"/>
            </div>          
            <div class="row" width=400 height=200>
              <MonitoringGraph graphId="ppm-chart" graphDataType="ppm" enoseGraphData="{enoseGraphData}"/>
            </div> 
            <RoastStatusLamp currentRoastStatus="{currentRoastStatus}"/>
          </div>
        </div>
        <ControlPanel 
          onClickStartSetup="{onClickStartSetup}"
          />
      </div>
    </div>
  </div>
</div>


<!-- <button on:click={()=>{
        currentRoastStatus = currentRoastStatus + 1;
        if(currentRoastStatus > 4) currentRoastStatus = 0;
        }}>
        p
</button> -->

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

  .main-back {
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

</style>
