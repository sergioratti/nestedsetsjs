const sequelize = require('../sequelize').sequelize;
const Sequelize = require('sequelize');

module.exports = sequelize.define('User', {
        name: {type:Sequelize.TEXT,allowNull:false},
        hierarchy_id:{type:Sequelize.INTEGER, allowNull:false}
    },
    {
      freezeTableName:true,
      tableName:'users', 
      timestamps:false
    }
)