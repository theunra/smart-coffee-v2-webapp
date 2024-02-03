<script>

</script>

<svelte:head>
  <title>Smart Coffee Roaster Dashboard</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" 
        crossorigin="anonymous">
</svelte:head>

<main>
  <div class="container-fluid row text-center p-3 rounded-4 main-back min-vh-100">
    <div class="col-1 ">
      <div class="row">
        <!--<img class="img-fluid logo-img rounded-start" src="/smartcoffeelogo.png"/>-->
        <div class="col">logo</div>
      </div>
      <div class="row">
        <div class="col fs-6 rounded-start mt-1 pt-2 pb-2 main-container">Dashboard</div>
      </div>
    </div>
    <slot/>
  </div> 
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</main>

<footer>
</footer>
