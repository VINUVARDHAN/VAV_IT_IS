const express = require('express');
const router = express.Router();
const userModels = require('./models');
const userUtil = require('./userUtil');
const utils = require('../utils');
const companyDetails = utils.company;

module.exports = (pool) => {
  router.get('/', (req, res) => {
    var data = {
      login : {
        model : userModels['usersLogin']
      },
      signup : {
        model : userModels['usersSignup']
      },
      baseURL : utils.urls.baseURL,
      company : companyDetails
    };
    res.render('LoginAndSignup', { data });
  });

  //USERS---------------------------------------------------------------------------------
  router.post('/users/login',async (req, res) => {
    try {
      var result = await userUtil.isValidUser(res,req, pool);
      if(result.isSuccess){
        result.redirect = utils.urls.baseURL+'vav/expenseTracker/index';
        res.status(200).send(result);
      }else{
        res.status(404).send({ error: result.message });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal server error" });
    }
  });
  router.post('/users', async (req, res) => {
    try {
      var result = await userUtil.createNewUser(req, res,pool);
      if(result.isSuccess){
        result.redirect = utils.urls.baseURL+'vav/expenseTracker/index';
        res.status(200).send(result);
      }else{
        res.status(404).send({ error: result.message });
      }
    } catch (err) {
      res.status(500).send({ error: "Internal server error" });
    }
  });
  //Apps---------------------------------------------------------------------------------
  var expenseTrackerRouter =  '/'+utils.apps.expenseTracker.id;
  var expenseTrackerRouterHandler = './apps/'+utils.apps.expenseTracker.folderName+'/'+utils.apps.expenseTracker.routerFileName;
  router.use(expenseTrackerRouter , require(expenseTrackerRouterHandler)(pool));
  return router;
};
