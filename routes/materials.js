var express = require('express');
var router = express.Router();
var Material = require('../db/models/material');
var User = require('../db/models/users');
var Hierarchy = require('../db/models/hierarchy');
var sequelizeObj = require('../db/sequelize');
var sequelize = sequelizeObj.sequelize;
var Op = sequelizeObj.op;

User.belongsTo(Hierarchy,{foreignKey:'hierarchy_id'});

router.get('/', function(req, res, next) {
    Material.findAll({})
  .then(materials=>{
    res.json(materials);
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

router.get('/user/:user_id', function(req, res, next) {

    /*
   select * from materials m  
where m.hierarchy_id in( 
  select id from hierarchy
  where (lft>=4 AND rgt<=5) OR (lft<4 AND rgt>5)
)
    */
    return User.findOne({include:[Hierarchy],where:{id:req.params.user_id}})
    .then(user=>{
        if(!user || user === null)
            throw new Error('Not found.');
        var lft = user.Hierarchy.lft;
        var rgt = user.Hierarchy.rgt;
        return Hierarchy.findAll({where:{[Op.or]:[
            {[Op.and]:{lft:{[Op.gte]:lft},rgt:{[Op.lte]:rgt}}},
            {[Op.and]:{lft:{[Op.lt]:lft},rgt:{[Op.gt]:rgt}}},            
        ]}})
        
    })
    .then(hierarchies=>{
        return Material.findAll({where:{hierarchy_id:{[Op.in]:hierarchies.map(item=>{return item.id;})}}});
    })
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
