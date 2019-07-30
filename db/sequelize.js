const Sequelize = require('sequelize') ;
const dbConfig = require('./db.json')[process.env.NODE_ENV || 'development'];

var options = dbConfig.options;

const Op = Sequelize.Op;

options['define'] ={
    hooks: {
        beforeFind: (data) => {
          if(data.ctx){
            var accessrights = data.ctx.user.accessrights;
          }
        }
    }
}

// options['operatorsAliases'] = operatorsAliases;

var sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USERNAME, dbConfig.DB_PASSWORD, options);

module.exports = {sequelize:sequelize,op:Op} ;