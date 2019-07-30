var express = require('express');
var router = express.Router();
var User = require('../db/models/user');
var sequelize = require('../db/sequelize');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll({})
  .then(users=>{
    res.json(users);
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

router.post('/',function(req, res, next){
  return sequelize.transaction(t=>{
    if(!req.body.name || !req.body.hierarchy_id)
      throw new Error('Information missing.');
    return User.create({
      name:req.body.name,
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
    return User.findOne({where:{id:req.params.id},transaction:t})
    .then(user=>{
      if(!user || user === null)
        throw new Error('User not found.');
      
      return user.update(req.body,{transaction:t})
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
    return User.destroy({where:{id:req.params.id},transaction:t})
  })
  .then(results=>{
    res.json({status:0,message:'Created.'});
  })
  .catch(err=>{
    res.json({status:-1,message:err.message});
  })
});

module.exports = router;
