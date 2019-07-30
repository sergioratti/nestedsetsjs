const sequelize = require('../sequelize').sequelize;
const Sequelize = require('sequelize');

module.exports = sequelize.define('Hierarchy', {
        type: {type:Sequelize.TEXT,allowNull:false},
        lft:{type:Sequelize.INTEGER, allowNull:false},
        rgt:{type:Sequelize.INTEGER, allowNull:false}
    },
    {
      freezeTableName:true,
      tableName:'hierarchy', 
      timestamps:false
    }
)