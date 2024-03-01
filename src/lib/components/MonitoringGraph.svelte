<script>
    import {onMount} from 'svelte';
    import Chart from 'chart.js/auto';
    import {EnoseGraphData} from '$lib/digest/enose-data.js';
    import LineMarker from '$lib/components/LineMarker.js';
    
    let ctx;
    let chart;
    
    let chargeLineMarker;
    let lightLineMarker;
    let mediumLineMarker;
    let darkLineMarker;

    export let enoseGraphData;
    export let graphId;

    $: if (chart) {
        const chargeIdx = enoseGraphData.roastLampIdx.charge;
        const lightIdx = enoseGraphData.roastLampIdx.light;
        const mediumIdx = enoseGraphData.roastLampIdx.medium;
        const darkIdx = enoseGraphData.roastLampIdx.dark;
        
        let graphDatas = enoseGraphData.sensorData.serialize(); 

        const labels = enoseGraphData.labelData;
        
        for(let i = 0; i < chart.data.datasets.length; i++){
            chart.data.datasets[i].data = graphDatas[i];
        }
        
        chart.data.labels = labels;
        
        chargeLineMarker.linePos = chargeIdx;
        lightLineMarker.linePos = lightIdx;
        mediumLineMarker.linePos = mediumIdx;
        darkLineMarker.linePos = darkIdx;

        chart.config.plugins[0] = chargeLineMarker;
        chart.config.plugins[1] = lightLineMarker;
        chart.config.plugins[2] = mediumLineMarker;
        chart.config.plugins[3] = darkLineMarker;
        
        chart.update();
    }

    const CreateSensorGraphs = () => {
        chargeLineMarker = new LineMarker().CreateLineMarker("chargeLineMarker", "green");
        lightLineMarker = new LineMarker().CreateLineMarker("preheatLineMarker", "#FFC107");
        mediumLineMarker = new LineMarker().CreateLineMarker("chargeLineMarker", "#A27A20");
        darkLineMarker = new LineMarker().CreateLineMarker("chargeLineMarker", "saddlebrown");

        function createChartOptions(labels, datasets) {
            return {
                type: 'line',
                data : {
                    labels : labels,
                    datasets: datasets,
                },
                plugins: [
                    lightLineMarker, 
                    chargeLineMarker,
                    mediumLineMarker,
                    darkLineMarker,
                ],
                options:{
                responsive: true,
                    maintainAspectRatio: false,
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
                        },
                    },
                },
            }
        }

        let chartDatasets = enoseGraphData.labels;

        const chartDatasetsOption = chartDatasets.map((label) => ({            
            label : label,
            tension : 0.3,
            data : [],
        }));

        const rawChartOptions = createChartOptions([], chartDatasetsOption);

        chart = new Chart(ctx, rawChartOptions);
    }

    let height = 200;
    let expand_text = "Expand";

    onMount(async () => {
        CreateSensorGraphs();
    });

</script>
<div class="p" id="pp">
  <canvas id={graphId} class="graph" height={height} width=700 bind:this={ctx}></canvas>
</div>

<button hidden on:click={()=>{
        const cc = document.getElementById("pp");
        cc.style.height = "50vh";
        expand_text = "Expand";
       
        }}>{expand_text}</button>
<style>
  .p{
    height : 50vh;
    width : 100%;
  }
</style>
