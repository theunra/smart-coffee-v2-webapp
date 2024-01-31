class EnoseRawData {
  adc_mq135 = [];
  adc_mq136 = [];
  adc_mq137 = [];
  adc_mq138 = [];

  serialize(){
    return [
      this.adc_mq135, 
      this.adc_mq136, 
      this.adc_mq137, 
      this.adc_mq138,
    ]
  }
}

class EnosePpmData {
  ppm = [];
}

class RoastLampIdx {
  charge = -1;
  light = -1;
  medium = -1;
  dark = -1;
}

export class EnoseGraphData {
    rawData = new EnoseRawData();
    ppmData = new EnosePpmData();
    labelData = [];
    currentRoastStatus = 0;
    roastLampIdx = new RoastLampIdx();
    dataTracker = -1;
}

export function processEnoseGraphData(datas, enoseGraphData){
    enoseGraphData.rawData.adc_mq135 = datas.payload.enose_rawData.map((d) => d.adc_mq135);
    enoseGraphData.rawData.roastStatus = datas.payload.enose_rawData.map((d) => d.roastStatus);
    enoseGraphData.currentRoastStatus = enoseGraphData.rawData.roastStatus[enoseGraphData.rawData.roastStatus.length - 1];
    
    enoseGraphData.roastLampIdx.chargeIdx = -1;
    enoseGraphData.roastLampIdx.lightIdx = -1;

    for(let k = 0; k < enoseGraphData.rawData.roastStatus.length; k++){
      if(enoseGraphData.rawData.roastStatus[k] == 1) {//first charge found
        enoseGraphData.roastLampIdx.chargeIdx = k;
        break;
      }
    }

    for(let k = enoseGraphData.roastLampIdx.chargeIdx; k < enoseGraphData.rawData.roastStatus.length; k++){
      if(enoseGraphData.rawData.roastStatus[k] == 2) {//first light found
        enoseGraphData.roastLampIdx.lightIdx = k;
        break;
      }
    }
    
    //let ts = datas.payload.enose_rawData.map((d) => d.time.split("T")[1]);

    //labels = ts;
    
    enoseGraphData.dataTracker = datas.tracker;
}