var express = require('express');
var router = express.Router();

const admin = require ('firebase-admin')
const db = require('../firebase')

//Get all tours that exists
router.get('/principal', async function(req, res, next) {
  const toursRef = db.collection('TOUR');
  const snapshot = await toursRef.get()

  if (snapshot.empty) {
    console.log("No matching documents.");
    res.send("No doc")
  }
  else{
    snapshot.forEach((doc) => {
      if(!doc.data().deletedAt)
      console.log(doc.id, "=>", doc.data());
    });
    res.send('Well Done')
  }
});

//Get one tour 
router.get('/one-tour/:idTour', async (req, res, next) =>{
  const {idTour} = req.params;
  const tourRef = db.collection('TOUR').doc(idTour)
  const doc = await tourRef.get();
  if(!doc.exists){
    console.log("No doc")
    res.send('No document')
  }
  else{
    console.log(doc.id, "=", doc.data())
    res.send('Well Done')
  }
})

//Get admin info
router.get('/info/:idAdmin', async function(req, res, next){
  const {idAdmin} = req.params;
  const adminRef = db.collection("ADMIN").doc(idAdmin)
  const doc =await adminRef.get();
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