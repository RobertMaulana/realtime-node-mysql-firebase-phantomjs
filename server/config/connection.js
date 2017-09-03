const Sequelize = require('sequelize');

sequelize = new Sequelize('pasarpolis', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

sequelize.authenticate().then(function(errors) { console.log(errors) });

module.exports = sequelize;
