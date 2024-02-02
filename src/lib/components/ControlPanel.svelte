<script>
  import OtherInfoCard from '$lib/components/OtherInfoCard.svelte';

  export let onClickCreateSession = (param)=>{};
  export let onClickFinishSession = (param)=>{};
  export let onClickStartRoast = (param)=>{};
  export let onClickStopRoast = (param)=>{};
  export const showSession = (isShow)=>{__intoSession(isShow);}
  export let isDeviceActive = false;
  export let isSession = false;
  
  export let roast = {
    beanType : '-',
    startTime : '-',
    level : '-',
  };

  let beanType = '-';
  let roastLevel = '-';

  export let roastSession = {

  };

  //ntar pindah
  const roastBeanTypeList = ["arabica", "robusta"];
  const roastLevelList = ["light", "medium", "dark"];

  $: if(roast){
    if(roast.beanType != '-') beanType = roastBeanTypeList[roast.beanType];
    if(roast.level != '-') roastLevel = roastLevelList[roast.level];
  }

  let __timeElapsed = "-";
  let __timeKeeper;

  function doubleToTimeString(num){
    const min = parseInt(num / 60);
    const sec = parseInt(((num / 60) - min) * 60);

    return `${min} min ${sec} sec`;
  }

    
  function __getSelection(id) {
    const doc = document.getElementById(id)
    const sel = doc.options[doc.selectedIndex].value;
    return sel;
  }

  function __onClickCreateSession() {
    let param = {};
    
    param.beanType = __getSelection("bean-type");
    param.roastLevel = __getSelection("roast-level");

    onClickCreateSession(param);
  };

  function __onClickFinishSession() {
    onClickFinishSession();
  };

  function __onClickStartRoast(){
    onClickStartRoast();
  };

  function __onClickStopRoast(){
    onClickStopRoast();
  };

  function __intoSession(isShow) {
    const infocard = document.getElementById("info-card");
    const setupcard = document.getElementById("setup-card");
    infocard.hidden = !isShow;
    setupcard.hidden = isShow;

    if(__timeKeeper) clearInterval(__timeKeeper);
    
    if(isShow){
      isSession = true;
      __timeKeeper = setInterval(()=>{
        if(roast && roast.startTime){
          const startTime = roast.startTime;
          __timeElapsed = new Date().getTime() - new Date(startTime).getTime();
          __timeElapsed /= (1000);
          __timeElapsed = doubleToTimeString(__timeElapsed);
        }
      }, 1000);
    }
    else {
      isSession = false;
    }

  }
  
  function __hide() {
      const infocard = document.getElementById("info-card");
      const setupcard = document.getElementById("setup-card");
      infocard.hidden = true;
      setupcard.hidden = true;
  }
</script>

<div id="setup-card" class="col-4">
    <div class="row content-container rounded-4 p-4">
      <div class="row">
        <div class="fw-bold mb-4">Start a new Roasting Session</div>
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
          <div class="col fs-5 fw-bold mt-4 card-button" on:click={__onClickCreateSession}>CREATE</div>
          <div class="col"></div>
        </div>
      </div>
    </div>
    <OtherInfoCard isDeviceActive="{isDeviceActive}"/>
    <button hidden on:click={()=>{__hide();}}>p</button>
  </div>
  <div id="info-card" class="col-4" hidden> <!--Info Card-->
    <div class="row content-container rounded-4 p-4">
      <div class="row">
        <div class="fw-bold">Roast Info</div>
        <div class="row">
          <div class="col">Bean Type</div>
          <div class="col">{beanType}</div>
        </div>
        <div class="row">
          <div class="col">Roast Level</div>
          <div class="col">{roastLevel}</div>
        </div>
        <div class="row">
          <div class="col">Time Elapsed</div>
          <div class="col">{__timeElapsed}</div>
        </div>
        <div class="row">
          <div class="col"></div>
          <div class="col fs-5 fw-bold mt-4 card-button" on:click={__onClickStartRoast}>START</div>
          <div class="col"></div>
        </div>
        <div class="row">
          <div class="col"></div>
          <div class="col fs-5 fw-bold mt-4 card-button" on:click={__onClickStopRoast}>STOP</div>
          <div class="col"></div>
        </div>
        <div class="row">
          <div class="col"></div>
          <div class="col fs-5 fw-bold mt-4 card-button" on:click={__onClickFinishSession}>FINISH</div>
          <div class="col"></div>
        </div>
      </div>
    </div>        
    <OtherInfoCard isDeviceActive="{isDeviceActive}"/>
</div><!--//Info Card-->
<style>
    .content-container {
        background-color: rgba(255, 255, 255, 0.6);
        box-shadow: 2px 10px 10px rgb(203 203 203);
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
