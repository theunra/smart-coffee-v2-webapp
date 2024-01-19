const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('postgres://smart-coffee:smartroaster@localhost:5432/smart-coffee');

try {
  await sequelize.authenticate();
  console.log(`Connection has been established with smart-coffee db`);
}
catch (err){
  console.error('Connection to smart-coffee db failed');
}

export default sequelize;
