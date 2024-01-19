import {Sequelize, DataTypes} from 'sequelize';

export const sequelize = new Sequelize('postgres://smart-coffee:smartroaster@localhost:5432/smart-coffee');

try {
  await sequelize.authenticate();
  console.log(`Connection has been established with smart-coffee db`);
}
catch (err){
  console.error('Connection to smart-coffee db failed');
}

export const EnoseData = sequelize.define("enose_data", {
  val: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

sequelize.sync();
