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
        if(graphDataType == 'raw') chartDatasets = [
            'adc_mq135', 'adc_mq136', 'adc_mq137', 'adc_mq138', 
            'adc_mq2', 'adc_mq3', 'adc_tgs822', 'adc_tgs2620'
        ];
        else chartDatasets = [
            "mq135_co",          "mq135_alcohol",       "mq135_co2",        "mq135_toluen",     "mq135_nh4",        "mq135_aceton", 
            "mq136_co",          "mq136_nh4",           "mq136_h2s",        "mq137_co",         "mq137_ethanol",    "mq137_nh3", 
            "mq138_benzene",     "mq138_hexane",        "mq138_co",         "mq138_alcohol",    "mq138_propane",    "mq2_h2", 
            "mq2_lpg",           "mq2_co",              "mq2_alcohol",      "mq2_propane",      "mq3_lpg",          "mq3_ch4", 
            "mq3_co",            "mq3_alcohol",         "mq3_benzene",      "mq3_hexane",       "tgs822_methane",   "tgs822_co", 
            "tgs822_isobutane",  "tgs822_hexane",       "tgs822_benzene",   "tgs822_ethanol",   "tgs822_acetone",   "tgs2620_methane", 
            "tgs2620_co",        "tgs2620_isobutane",   "tgs2620_h2",       "tgs2620_ethanol"
        ];
        
        

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
