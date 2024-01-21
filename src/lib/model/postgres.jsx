import {Sequelize, DataTypes} from 'sequelize';

export const sequelize = new Sequelize('postgres://smart-coffee:smartroaster@localhost:5432/smart-coffee');

try {
  await sequelize.authenticate();
  console.log(`Connection has been established with smart-coffee db`);
}
catch (err){
  console.error('Connection to smart-coffee db failed');
}

/*
    adc_mq135   
    adc_mq136
    adc_mq137
    adc_mq138
    adc_mq2
    adc_mq3
    adc_tgs822
    adc_tgs2620
    temp
    humidity
*/

export const EnoseRawData = sequelize.define("enose_raw_datas", {
  adc_mq135: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adc_mq136: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adc_mq137: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
    adc_mq138: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adc_mq2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adc_mq3: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adc_tgs822: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adc_tgs2620: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temp: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  humidity: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export const EnosePPMData = sequelize.define("enose_ppm_datas", {
      mq135_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq135_alcohol : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq135_co2 : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq135_toluen : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq135_nh4 : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq135_aceton : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq136_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq136_nh4 : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq136_h2s : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq137_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq137_ethanol : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq137_nh3 : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq138_benzene : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq138_hexane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq138_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq138_alcohol : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq138_propane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq2_h2 : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq2_lpg : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq2_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq2_alcohol : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq2_propane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq3_lpg : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq3_ch4 : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq3_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq3_alcohol : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq3_benzene : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      mq3_hexane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs822_methane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs822_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs822_isobutane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs822_hexane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs822_benzene : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs822_ethanol : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs822_acetone : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs2620_methane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs2620_co : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs2620_isobutane : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs2620_h2 : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
      tgs2620_ethanol : {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
});



sequelize.sync();
