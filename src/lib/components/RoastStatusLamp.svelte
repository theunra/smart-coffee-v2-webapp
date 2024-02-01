<script>
  import {RoastStatus} from '$lib/digest/enose-data.js';
  
  export let currentRoastStatus = 0;

  let lastLampId = "";

  $: {
    let lampId = "";

    switch(currentRoastStatus){
      case RoastStatus.PREHEAT:
        lampId = "preheat";
        break;
      case RoastStatus.CHARGE:
        lampId = "charge";
        break;
      case RoastStatus.LIGHT:
        lampId = "light";
        break;
      case RoastStatus.MEDIUM:
        lampId = "medium";
        break;
      case RoastStatus.DARK:
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
</script>

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

<style>
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
</style>