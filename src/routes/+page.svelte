<script>
  import {onMount} from 'svelte';
  import {GetIsDeviceActive, GetRoastSession, SendStartRoast, SendStopRoast, SendCreateSession, SendFinishSession, deviceAbortController} from '$lib/api/device.js';
  import {GetData, GetDataAbort} from '$lib/api/data.js';
  import RoastStatusLamp from '$lib/components/RoastStatusLamp.svelte';
  import ControlPanel from '$lib/components/ControlPanel.svelte';
  import MonitoringGraph from '$lib/components/MonitoringGraph.svelte';
  import {EnoseGraphData, processEnoseGraphData, EnoseRawData} from '$lib/digest/enose-data.js';

  let showSession;

  let roastSession;
  let roast;

  const graphLabels = [];
  
  for(let i = 0; i< 1000; i++){
      graphLabels.push(i);
  }

  let currentRoastStatus = -1;
  
  let isDeviceActive = false;

  let rawEnoseGraphData = new EnoseGraphData();
  rawEnoseGraphData.labelData = graphLabels;
  rawEnoseGraphData.sensorData = new EnoseRawData();
  rawEnoseGraphData.labels = new EnoseRawData().getLabels();
  
  onMount(async () => {
    CheckSession();
    PollEnoseData();
    PollIsDeviceActive();
  });

  const PollEnoseData = async () => {
    const roastId = roastSession != null ? roastSession.roastId : -1; 
      if(roastId == -1 || roastId == null){
          console.log("no roastId, wait for session");
          await new Promise(r => setTimeout(r, 1000));
          PollEnoseData();
          return;
        }
    let datas = await GetData({
        tracker : rawEnoseGraphData.dataTracker,
        roastId : roastId,
    });

    console.log(datas, roastId);
    if(!datas){
        PollEnoseData();
        return;
    }

    if(datas.status == 504){
        PollEnoseData();
        return;
    }//PERLU FORMAT RESPONSE YANG JELAS JING, NTARAN
     
    const data = processEnoseGraphData(datas);
    rawEnoseGraphData.sensorData.adc_mq135 = data.rawData.adc_mq135;
    rawEnoseGraphData.sensorData.adc_mq136 = data.rawData.adc_mq136;
    rawEnoseGraphData.sensorData.adc_mq137 = data.rawData.adc_mq137;
    rawEnoseGraphData.sensorData.adc_mq138 = data.rawData.adc_mq138;
    rawEnoseGraphData.sensorData.adc_mq2   = data.rawData.adc_mq2;
    rawEnoseGraphData.sensorData.adc_mq3   = data.rawData.adc_mq3;
    rawEnoseGraphData.sensorData.adc_tgs822  = data.rawData.adc_tgs822;
    rawEnoseGraphData.sensorData.adc_tgs2620 = data.rawData.adc_tgs2620;
    rawEnoseGraphData.dataTracker = data.dataTracker;
    rawEnoseGraphData.roastLampIdx = data.roastLampIdx;
    currentRoastStatus = data.currentRoastStatus;

    PollEnoseData();
  }

  const PollIsDeviceActive = async () => {
    const res = await GetIsDeviceActive();
    if(res.status == 200){
      isDeviceActive = res.payload.isDeviceActive;
      console.log("device active : " ,isDeviceActive);
    }
      //setTimeout(()=> {PollIsDeviceActive();}, 2000);
      await new Promise(r => setTimeout(r, 2000));
      PollIsDeviceActive();
  }

  const CheckSession = async () => {
    const res = await GetRoastSession();
    console.log(res);
    if(res.status == 200){
      roastSession = res.payload.roastSession;
      roast = res.payload.roast;
      showSession(true);
    }
  }

  async function onClickCreateSession(param){
    console.log(param);    
    const resp = await SendCreateSession(param);
    console.log(resp);
   if(resp && resp.status == 200){
      roastSession = resp.payload.roastSession;
      roast = resp.payload.roast;
      showSession(true);
    }
  }

  async function onClickFinishSession(param){
    console.log(param);    
    const resp = await SendFinishSession(param);
    console.log(resp);
    if(resp && resp.status == 200){
      roastSession = resp.payload.roastSession;
      showSession(false);
      GetDataAbort.abort(); //cancel get data poll
    }
  }

  async function onClickStartRoast(param){
    if(!isDeviceActive) {
      console.log("device is offline");
      return;
    }
    await SendStartRoast();
  }

  async function onClickStopRoast(param){
    if(!isDeviceActive) {
      console.log("device is offline");
      return;
    }
    await SendStopRoast();
  }
</script>

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
            <div class="row">
              <MonitoringGraph graphId="raw-chart" enoseGraphData="{rawEnoseGraphData}"/>
            </div>          
            <div class="row">
              <MonitoringGraph graphId="ppm-chart" enoseGraphData="{rawEnoseGraphData}"/>
            </div> 
            <RoastStatusLamp currentRoastStatus="{currentRoastStatus}"/>
          </div>
        </div>
        <ControlPanel 
          bind:showSession="{showSession}"
          onClickCreateSession="{onClickCreateSession}"
          onClickFinishSession="{onClickFinishSession}"
          onClickStartRoast="{onClickStartRoast}"
          onClickStopRoast="{onClickStopRoast}"
          isDeviceActive="{isDeviceActive}"
          roast="{roast}"
          roastSession="{roastSession}"
          />
      </div>
    </div>
  </div>

<!--
<button on:click={()=>{
        GetDataAbort.abort();
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

  .graph-container {
    height : 200;
    width : 100%;
  }
  
  .logo-img{
    #margin-right: 2px;
    #border: 5px solid white;
    #border-radius: 10%;
    #background-color: white;
  }

</style>
