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
    let x =[]
    snapshot.forEach((doc, index) => {
      if(!doc.data().hasOwnProperty("deletedAt")){
        console.log(doc.id, "=>", doc.data());
        x[index] = doc.data()
      }
    });
    console.log(x)
    res.send("Buena")
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
    res.send(doc.data())
  }
});

/* CREATE TOUR -------------------------------------------------- */
router.get("/create-tour", async(req, res, next) => {
  try {
    const data = {
       /*
      tourOperator:
      tourOperatorName:
      tourOperatorCountry:
      createdAt:*/
    };

    // Agrega nuevo documento y deja que firestore cree la clave
    const newTour = await db.collection('TOUR').add(data);
    res.send("ok");

  } catch (error) {
    next();
  }
});


/* CREATE TOUR OPERADOR ----------------------------------------- */
router.post("/create-tour-operador", async(req, res, next) => {
  try {
    const data = req.body;

    //   nuevo documento y deja que firestore cree la clave
    const newTour = await db.collection('TOUR_OPERATOR').add(data);
    res.send("ok");

  } catch (error) {
    next();
  }
});

/* UPDATE TOUR -------------------------------------------------- */
router.put('/update-tour/:idTour', async (req, res, next) => {
  const { idTour } = req.params;
  const { body } = req;
  
  try {
    const tourRef = db.collection('TOUR').doc(idTour);
    const doc = await tourRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        name: "Not found",
        message: "Sorry, el usuario que buscas no existe"
      })
    } else {
      console.log('Document data:', body);
      const tour = await db.collection('TOUR').doc(idTour).set(body);
      /*
      const timeUpdate = await tourRef.update({
        updatedAt: FieldValue.serverTimestamp()
      });*/
        return res.status(200).json({
          name: "Edicion exitosa",
          message: "Se realizo la edición exitosamente"
        })
  }} catch(err) {
    next(err);
  }
});

module.exports = router;