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
    res.send(doc.data());
  }
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

/* CREATE TOUR --------------------------------------- */
router.post("/create-tour", async(req, res, next) => {
  const data = req.body;

  try {
    // Agrega nuevo documento y deja que firestore cree la clave
    const newTour = await db.collection('TOUR').add(data);

    // Actualiza la fecha de creación
    const createdAt = await newTour.update({
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({
      name: "Creación exitosa",
      message: "Se realizo la creación del tour exitosamente"
    });
  } catch (error) {
    next(error);
  }
});

/* CREATE TOUR OPERADOR --------------------------------------- */
router.post("/create-tour-operator", async(req, res, next) => {
  const data = req.body; 
  try {
    // Agrega nuevo documento y deja que firestore cree la clave
    const newTour = await db.collection('TOUR_OPERATOR').add(data);

    // Actualiza la fecha de creación
    const createdAt = await newTour.update({
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(201).json({
      name: "Creación exitosa",
      message: "Se realizo la creación del tour operador exitosamente"
    });
  } catch(error) {
    next(error);
  }
});

/* UPDATE TOUR ----------------------------------------------- */
router.put('/update-tour/:idTour', async (req, res, next) => {
  const { idTour } = req.params;
  const { body } = req;
  
  try {
    // Confirmamos que existe
    const tourRef = db.collection('TOUR').doc(idTour);
    const doc = await tourRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        name: "Not found",
        message: "Sorry, el tour que buscas no existe"
      })
    } else {
      // Actualiza el documento
      const tour = await db.collection('TOUR').doc(idTour).update(body);

      // Actualiza la fecha de actualización
      const updatedAt = await tourRef.update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        name: "Edicion exitosa",
        message: "Se realizo la edición del tour exitosamente"
      });
  }} catch(err) {
    next(err);
  }
});

/* UPDATE TOUR OPERADOR ------------------------------------------------------- */
router.put('/update-tour-operator/:idTourOperator', async (req, res, next) => {
  const { idTourOperator } = req.params;
  const { body } = req;
  
  try {
    // Confirmamos que existe
    const tourOperatorRef = db.collection('TOUR_OPERATOR').doc(idTourOperator);
    const doc = await tourOperatorRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        name: "Not found",
        message: "Sorry, el tour operador que buscas no existe"
      })
    } else {
      // Actualiza el documento
      const tour = await db.collection('TOUR_OPERATOR').doc(idTourOperator).update(body);

      // Actualiza la fecha de actualización
      const updatedAt = await tourOperatorRef.update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        name: "Edicion exitosa",
        message: "Se realizo la edición del tour operador exitosamente"
      });
  }} catch(err) {
    next(err);
  }
});

module.exports = router;