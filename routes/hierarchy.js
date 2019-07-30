var express = require('express');
var router = express.Router();
var Hierarchy = require('../db/models/hierarchy');
var sequelizeObj = require('../db/sequelize');
var sequelize = sequelizeObj.sequelize;
const Sequelize = require('sequelize') ;
const Op = Sequelize.Op;
const types = {'root':'Producer','Producer':'Division','Division':'Retailer','Retailer':null};

router.get('/', function(req, res, next) {
    Hierarchy.findAll({})
    .then(hierarchies=>{
      res.json(hierarchies);
    })
    .catch(err=>{
      res.json({status:-1,message:err.message});
    })
  });
  
  router.get('/:id', function(req, res, next) {
    Hierarchy.findOne({where:{id:req.params.id}})
    .then(hierarchy=>{
      res.json(hierarchy);
    })
    .catch(err=>{
      res.json({status:-1,message:err.message});
    })
  });

  // PRODUCER > DIVISION > RETAILERS
  // req.body.parent_id
  router.post('/', function(req, res, next) {
    return sequelize.transaction(t=>{
        var lft;
        var rgt;
        var type;
        if(!req.body.parent_id)
            throw new Error('Information missing.')
        
        return Hierarchy.findOne({where:{id:req.body.parent_id},transaction:t})
        .then(hierarchy=>{
            if(!hierarchy) 
                throw new Error('Hierarchy not found.')
            if(types[hierarchy.type] === null)
                throw new Error(`Can't create child node. Last level.`)
            lft = hierarchy.lft;
            rgt = hierarchy.rgt;
            type = types[hierarchy.type];
            return Hierarchy.update(
                {rgt:sequelize.literal('`rgt`+2')},
                {where:{rgt:{[Op.gte]:rgt}},transaction:t}
            );
        })
        .then(results=>{
            
            return Hierarchy.update(
                {lft:sequelize.literal('`lft`+2')},
                {where:{lft:{[Op.gt]:rgt}},transaction:t}
            );
        })
        .then(results=>{
            return Hierarchy.create({type:type,lft:rgt,rgt:rgt+1},{transaction:t})
        })
    })
    .then(results=>{
        res.json({status:0,message:'Created.'});
    })
    .catch(err=>{
      res.json({status:-1,message:err.message});
    })
  });

  router.delete('/:id', function(req, res, next) {
      return sequelize.transaction(t=>{
          var rgt;
          var lft;
          return Hierarchy.findOne({where:{id:req.params.id},transaction:t})
          .then(hierarchy=>{
              if(!hierarchy)
                throw new Error('Not found.');
              lft = hierarchy.lft;
              rgt = hierarchy.rgt;

              return Hierarchy.destroy({transaction:t,where:{lft:{[Op.and]:{lft:{[Op.gt]:lft},rgt:{[Op.lt]:rgt}}}}})
              .then(results=>{
                return hierarchy.destroy({transaction:t});
              })

              
          })
          .then(results=>{
            return Hierarchy.update(
                {lft:sequelize.literal('`lft`-2'),rgt:sequelize.literal('`rgt`-2')},
                {where:{[Op.and]:{lft:{[Op.gte]:rgt},rgt:{[Op.gte]:rgt}}},transaction:t}
            );
          })
      })
      .then(results=>{
        res.json({status:0,message:'Deleted.'});
    })
    .catch(err=>{
      res.json({status:-1,message:err.message});
    })
  });


module.exports = router;