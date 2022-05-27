var express = require('express');
var router = express.Router();
const admin = require ('firebase-admin')
const db = require('../firebase')

//Get tours of one tour operator
router.get('/all-tours/:idTourOperator', async (req, res, next) => {
  const {idTourOperator} = req.params;
  const toursRef = db.collection("TOUR");
  const snapshot = await toursRef.where('tourOperator', '==', idTourOperator).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    res.send("No doc")
  }
  else{
    snapshot.forEach((doc) => {
      if(!doc.data().deletedAt){
        console.log(doc.id, "=>", doc.data());
      }
    });
    res.send('Well Done')
  }
});

//Get 1 tour info
router.get('/one-tour/:idTour', async function(req, res, next) {
  const {idTour} = req.params;
  const tourRef = db.collection('TOUR').doc(idTour);
  const doc = await tourRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }
res.send(doc.data());
});

//Get tour operator info
router.get('/info/:idTourOperator', async function(req, res, next){
  const {idTourOperator} = req.params;
  const tourOperatorRef = db.collection("TOUR_OPERATOR").doc(idTourOperator)
  const doc =await tourOperatorRef.get();
  if(!doc.exists){
    console.log("No doc")
    res.send('No document')
  }
  else{
    console.log(doc.id, "=", doc.data())
    res.send('Well Done')
  }
});

module.exports = router;