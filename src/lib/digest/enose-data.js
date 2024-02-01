export const RoastStatus = Object.freeze({
  PREHEAT : 0,
  CHARGE  : 1,
  LIGHT   : 2,
  MEDIUM  : 3,
  DARK    : 4,
})

export class EnoseRawData {
  adc_mq135    = [];
  adc_mq136    = [];
  adc_mq137    = [];
  adc_mq138    = [];
  adc_mq2      = [];
  adc_mq3      = [];
  adc_tgs822   = [];
  adc_tgs2620  = [];

  serialize(){
    return [
      this.adc_mq135, 
      this.adc_mq136, 
      this.adc_mq137, 
      this.adc_mq138,
      this.adc_mq2,
      this.adc_mq3,
      this.adc_tgs822,
      this.adc_tgs2620,
    ];
  }

  getLabels(){
    return [
      'adc_mq135', 'adc_mq136', 'adc_mq137', 'adc_mq138', 
      'adc_mq2', 'adc_mq3', 'adc_tgs822', 'adc_tgs2620'
    ];
  }
}

export class EnosePpmData {
  mq135_co            = [];
  mq135_alcohol       = [];
  mq135_co2           = [];
  mq135_toluen        = [];
  mq135_nh4           = [];
  mq135_aceton        = [];
  
  mq136_co            = [];
  mq136_nh4           = [];
  mq136_h2s           = [];

  mq137_co            = [];
  mq137_ethanol       = [];
  mq137_nh3           = [];
  
  mq138_benzene       = [];
  mq138_hexane        = [];
  mq138_co            = [];
  mq138_alcohol       = [];
  mq138_propane       = [];
  
  mq2_h2              = [];
  mq2_lpg             = [];
  mq2_co              = [];
  mq2_alcohol         = [];
  mq2_propane         = [];
  
  mq3_lpg             = [];
  mq3_ch4             = [];
  mq3_co              = [];
  mq3_alcohol         = [];
  mq3_benzene         = [];
  mq3_hexane          = [];
  
  tgs822_methane      = [];
  tgs822_co           = [];
  tgs822_isobutane    = [];
  tgs822_hexane       = [];
  tgs822_benzene      = [];
  tgs822_ethanol      = [];
  tgs822_acetone      = [];
  
  tgs2620_methane     = [];
  tgs2620_co          = [];
  tgs2620_isobutane   = [];
  tgs2620_h2          = [];
  tgs2620_ethanol     = [];
  
  serialize(){
    return [
      this.mq135_co,
      this.mq135_alcohol,
      this.mq135_co2,
      this.mq135_toluen,
      this.mq135_nh4,
      this.mq135_aceton,
      
      this.mq136_co,
      this.mq136_nh4,
      this.mq136_h2s,

      this.mq137_co,
      this.mq137_ethanol,
      this.mq137_nh3,
      
      this.mq138_benzene,
      this.mq138_hexane,
      this.mq138_co,
      this.mq138_alcohol,
      this.mq138_propane,
      
      this.mq2_h2,
      this.mq2_lpg,
      this.mq2_co,
      this.mq2_alcohol,
      this.mq2_propane,
      
      this.mq3_lpg,
      this.mq3_ch4,
      this.mq3_co,
      this.mq3_alcohol,
      this.mq3_benzene,
      this.mq3_hexane,
      
      this.tgs822_methane,
      this.tgs822_co,
      this.tgs822_isobutane,
      this.tgs822_hexane,
      this.tgs822_benzene,
      this.tgs822_ethanol,
      this.tgs822_acetone,
      
      this.tgs2620_methane,
      this.tgs2620_co,
      this.tgs2620_isobutane,
      this.tgs2620_h2,
      this.tgs2620_ethanol,
    ];
  }

  getLabels({mq135 = false, mq136 = false, mq137 = false, mq138 = false, mq2 = false, mq3 = false, tgs822 = false, tgs2620 = false}){
    const labels = [];
    if(mq135) {
      labels.push(...["mq135_co", "mq135_alcohol", "mq135_co2", "mq135_toluen", "mq135_nh4", "mq135_aceton"]);
    }
    if(mq136) {
      labels.push(...["mq136_co", "mq136_nh4", "mq136_h2s"]);
    }
    if(mq137){
      labels.push(...["mq137_co", "mq137_ethanol", "mq137_nh3"]);
    } 
    if(mq138){
      labels.push(...["mq138_benzene", "mq138_hexane", "mq138_co", "mq138_alcohol", "mq138_propane"]);
    } 
    if(mq2){
      labels.push(...["mq2_h2", "mq2_lpg", "mq2_co", "mq2_alcohol", "mq2_propane"]);
    } 
    if(mq3){
      labels.push(...["mq3_lpg", "mq3_ch4", "mq3_co", "mq3_alcohol", "mq3_benzene", "mq3_hexane"]);
    } 
    if(tgs822){
      labels.push(...["tgs822_methane", "tgs822_co", "tgs822_isobutane", "tgs822_hexane", "tgs822_benzene", "tgs822_ethanol", "tgs822_acetone"]);
    } 
    if(tgs2620){
      labels.push(...["tgs2620_methane", "tgs2620_co", "tgs2620_isobutane", "tgs2620_h2", "tgs2620_ethanol"]);
    }

    return labels;
  }
}

class RoastLampIdx {
  charge = -1;
  light = -1;
  medium = -1;
  dark = -1;
}

export class EnoseGraphData {
    id = "";
    sensorData = null;
    labelData = [];
    labels = [];
    currentRoastStatus = 0;
    roastLampIdx = new RoastLampIdx();
    dataTracker = -1;
}

export function processEnoseGraphData(datas){
  const adc_mq135 = datas.payload.enose_raw_datas.map((d) => d.adc_mq135);
  const adc_mq136 = datas.payload.enose_raw_datas.map((d) => d.adc_mq136);
  const adc_mq137 = datas.payload.enose_raw_datas.map((d) => d.adc_mq137);
  const adc_mq138 = datas.payload.enose_raw_datas.map((d) => d.adc_mq138);
  
  const roastStatus = datas.payload.enose_raw_datas.map((d) => d.roastStatus);
  const currentRoastStatus = roastStatus[roastStatus.length - 1];
  
  const roastLampIdx = {};

  roastLampIdx.charge = -1;
  roastLampIdx.light = -1;

  for(let k = 0; k < roastStatus.length; k++){
    if(roastStatus[k] == RoastStatus.CHARGE) {//first charge found
      roastLampIdx.charge = k;
      break;
    }
  }

  for(let k = roastLampIdx.charge; k < roastStatus.length; k++){
    if(roastStatus[k] == RoastStatus.LIGHT) {//first light found
      roastLampIdx.light = k;
      break;
    }
  }
  
  //let ts = datas.payload.enose_rawData.map((d) => d.time.split("T")[1]);

  //labels = ts;
  
  const dataTracker = datas.tracker;

  return {
    rawData :{
      adc_mq135 : adc_mq135,
      adc_mq136 : adc_mq136,
      adc_mq137 : adc_mq137,
      adc_mq138 : adc_mq138,
    },
    ppmData :{

    },
    roastLampIdx : roastLampIdx,
    dataTracker : dataTracker,
    currentRoastStatus : currentRoastStatus,
    roastStatus : roastStatus,
  };
}
