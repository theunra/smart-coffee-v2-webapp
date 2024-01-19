<script>
  import {onMount} from 'svelte';
    import Chart from 'chart.js/auto';
    
    let data = [20, 10, 30, 40];
    let labels = ['a', 'b', 'c', 'd'];
    let x = 0;

    const api_url = '/data';
    const GetData = async () => {
        const response = await fetch(`${api_url}?` + new URLSearchParams({tracker : x}), {
        method : 'GET',
          });
        const datas = await response.json();
        console.log(datas);
        let vals = datas.payload.map((d) => d.val);
        let ts = datas.payload.map((d) => d.id);

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
    
    let ctx;
    let canvas;
    let chart;

    let f = 2;

    $: if (chart) {
        console.log("x is changed");
        chart.data.datasets[0].data = data;
        chart.data.labels = labels;
        chart.update();
      }

    onMount(async () => {
        chart = new Chart(ctx, {
            type: 'line',
            data : {
                labels : labels,
                datasets: [
                      {            
                        label : 'ok',
                        data : data,
                      },
                  ]
              },
          });
      });

</script>

<h1>Smart Coffee Roaster Dashboard</h1>
<button on:click={GetData}>get</button>
<button on:click={InsertData}>insert</button>
<h2>tracker {x}</h2>
<div width=400 height=200>
  <canvas id="mychart" bind:this={ctx} width={200} height={50}></canvas>
</div>

<style>
  /*
  canvas {
    width : 400;
    height: 400;
    background-color: red;
  }*/
</style>
