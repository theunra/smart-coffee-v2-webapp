<script>
    import OtherInfoCard from '$lib/components/OtherInfoCard.svelte';
    import RoastStatusLamp from '../lib/components/RoastStatusLamp.svelte';

    export let onClickStartSetup = (param)=>{};
    export const showSession = (isShow)=>{__intoSession(isShow);}
    export let isDeviceActive = false;
    export let isSession = false;
    export let beanType = "-";
    export let timeStart = "-";
    export let roastLevel = "-";

    let __timeElapsed = "-";

    function __getSelection(id) {
        const doc = document.getElementById(id)
        const sel = doc.options[doc.selectedIndex].value;
        return sel;
    }
    const __onClickStartSetup = ()=>{
        let param = {};
        
        param.beanType = __getSelection("bean-type");
        param.roastLevel = __getSelection("roast-level");

        onClickStartSetup(param);
    };

    const __intoSession = (isShow)=>{
        const infocard = document.getElementById("info-card");
        const setupcard = document.getElementById("setup-card");
        infocard.hidden = !isShow;
        setupcard.hidden = isShow;
    }

</script>

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
          <div class="col fs-5 fw-bold mt-4 card-button" on:click={__onClickStartSetup}>START</div>
          <div class="col"></div>
        </div>
      </div>
    </div>
    <OtherInfoCard isDeviceActive="{isDeviceActive}"/>
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