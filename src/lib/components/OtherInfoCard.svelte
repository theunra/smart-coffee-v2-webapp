<script>
    export let isDeviceActive = false;
</script>
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

<style>
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