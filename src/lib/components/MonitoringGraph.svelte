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

    export let enoseGraphData = new EnoseGraphData();
    export let graphDataType;
    export let graphId;
  
    /*
    for(let i = 0; i < 1000; i++) {
        enoseGraphData.labelData.push(i);
    }

    console.log(enoseGraphData);
    */

    $: if (chart) {
        const chargeIdx = enoseGraphData.roastLampIdx.charge;
        const lightIdx = enoseGraphData.roastLampIdx.light;
        
        let graphDatas; 
        if(graphDataType == 'raw') graphDatas = enoseGraphData.rawData.serialize();
        else graphDatas = enoseGraphData.ppmData.serialize();

        const labels = enoseGraphData.labelData;
        
        for(let i = 0; i < chart.data.datasets.length; i++){
            chart.data.datasets[i].data = graphDatas[i];
        }
        
        chart.data.labels = labels;
        
        lightLineMarker.linePos = lightIdx;
        chargeLineMarker.linePos = chargeIdx;

        chart.config.plugins[0] = lightLineMarker;
        chart.config.plugins[1] = chargeLineMarker;
        
        chart.update();
    }

    const CreateSensorGraphs = () => {
        lightLineMarker = new LineMarker().CreateLineMarker("preheatLineMarker", "blue");
        chargeLineMarker = new LineMarker().CreateLineMarker("chargeLineMarker", "green");

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
                ],
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
                        },
                    },
                },
            }
        }

        let chartDatasets;
        if(graphDataType == 'raw') chartDatasets = ['adc_mq135', 'adc_mq136', 'adc_mq137', 'adc_mq138'];
        else chartDatasets = ['mq135_co'];

        const chartDatasetsOption = chartDatasets.map((label) => ({            
            label : label,
            tension : 0.3,
            data : [],
        }));

        const rawChartOptions = createChartOptions([], chartDatasetsOption);

        chart = new Chart(ctx, rawChartOptions);
    }

    onMount(async () => {
        CreateSensorGraphs();
    });
</script>

<canvas id={graphId} bind:this={ctx} width={700} height={200}></canvas>

<style>

</style>
