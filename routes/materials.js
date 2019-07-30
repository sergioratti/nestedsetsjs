var express = require('express');
var router = express.Router();
var Material = require('../db/models/material');
var User = require('../db/models/users');
var sequelizeObj = require('../db/sequelize');
var sequelize = sequelizeObj.sequelize;

router.get('/', function(req, res, next) {
    Material.findAll({})
  .then(materials=>{
    res.json(materials);
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

router.get('/:id', function(req, res, next) {
  Material.findOne({where:{id:req.params.id}})
  .then(material=>{
    res.json(material);
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

router.post('/',function(req, res, next){
  return sequelize.transaction(t=>{
    if(!req.body.code || !req.body.hierarchy_id)
      throw new Error('Information missing.');
    return Material.create({
      code:req.body.code,
      hierarchy_id:req.body.hierarchy_id
    },{transaction:t})
  })
  .then(results=>{
    res.json({status:0,message:'Created.'});
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

router.put('/:id',function(req, res, next){
  return sequelize.transaction(t=>{
    return Material.findOne({where:{id:req.params.id},transaction:t})
    .then(material=>{
      if(!material || material === null)
        throw new Error('Material not found.');
      
      return material.update(req.body,{transaction:t})
    })
  })
  .then(results=>{
    res.json({status:0,message:'Created.'});
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

router.put('/:id',function(req, res, next){
  return sequelize.transaction(t=>{
    return Material.destroy({where:{id:req.params.id},transaction:t})
  })
  .then(results=>{
    res.json({status:0,message:'Created.'});
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

module.exports = router;
