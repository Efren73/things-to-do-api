var express = require('express');
var router = express.Router();
const admin = require ('firebase-admin')
const db = require('../firebase')

//Get tours of one tour operator
router.get('/all-tours/:idTourOperator', async (req, res, next) => {
  const {idTourOperator} = req.params;
  const toursRef = db.collection("TOUR");
  const snapshot = await toursRef.where('tourOperator', '==', idTourOperator).where('deletedAt', '==', null).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    res.send("No doc")
  }
  else{
    const list = snapshot.docs
    let array = [];
    list.map((element) =>{
        array.push({id: element.id, ...element.data()})
    })

    res.send(array)
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
    res.send(doc.data())
  }
});

/* CREATE TOUR --------------------------------------- */
router.post("/create-tour/:idTourOperator", async(req, res, next) => {
  
  const {idTourOperator} = req.params;
  const tourOperatorRef = db.collection("TOUR_OPERATOR").doc(idTourOperator)
  const doc =await tourOperatorRef.get();
  if(!doc.exists){
    console.log("No doc")
    res.send('No document of tour operator')
  }
  else{
    console.log("tour operador extraido con exito")
  }

  const data = {
    tourOperator: doc.id,
    tourOperatorCountry: doc.data().country,
    tourOperatorName: doc.data().fullName,
    basicInformation: {
      tourName: 'Experience name',
      duration: {
        hours: '',
        minutes: ''
      }
    },
    deletedAt: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    percentage: 0,
    completedTour: false,
  };

  try {
    // Agrega nuevo documento y deja que firestore cree la clave
    const newTour = await db.collection('TOUR').add(data);

    const newTourId = {
      id: newTour.id
    }
    console.log("Hello", typeof(newTour.id))
    return res.send(newTourId);
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

      const tourRef2 = db.collection('TOUR').doc(idTour);
      const doc2 = await tourRef2.get();

      let size = 0;
      document = doc2.data()
      document.basicInformation !== undefined ?  size += Object.keys(document.basicInformation).length : size;
      document.intinerary !== undefined ?  size += Object.keys(document.intinerary).length : size;
      document.childrenPolicy !== undefined ? size += 1 : size;
      document.cancellationPolicy !== undefined ? size += 1 : size;
      if(document.accessibility !== undefined){
        if(document.accessibility.assistance !== undefined){
          document.accessibility.assistance.map((value)=>{
            if(value.answer != ""){
              size += 1;
            }
          })
        }
    
        if(document.accessibility.transportation !== undefined){
          document.accessibility.transportation.map((value)=>{
            if(value.answer != ""){
              size += 1;
            }
          })
        }
    
        if(document.accessibility.places !== undefined){
          document.accessibility.places.map((value)=>{
            if(value.answer != ""){
              size += 1;
            }
          })
        }
    
        if(document.accessibility.restrooms !== undefined){
          document.accessibility.restrooms.map((value)=>{
            if(value.answer != ""){
              size += 1;
            }
          })
        }
    
        if(document.accessibility.equipment !== undefined){
          document.accessibility.equipment.map((value)=>{
            if(value.answer != ""){
              size += 1;
            }
          })
        }
      }
      
      console.log("Final size", size)
      const percentage = parseInt((size / 42) *100);

      const changePercentage = await tourRef.update({
        percentage: percentage
      });

      const tourRef3 = db.collection('TOUR').doc(idTour);
      const doc3 = await tourRef2.get();

      return res.send(doc3.data());
  }} catch(err) {
    next(err);
  }
});

/*ELIMINAR EL TOUR*/
router.put("/delete-tour/:idTour", async (req, res, next) => {
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
      //const tour = await db.collection('TOUR').doc(idTour).update(body);

      // Actualiza la fecha de actualización
      const updatedAt = await tourRef.update({
        ...body,
        deletedAt: admin.firestore.FieldValue.serverTimestamp()
      }
        
      );

      const tourRef2 = db.collection('TOUR').doc(idTour);
      const doc2 = await tourRef2.get();
      return res.send(doc2.data());
  }} catch(err) {
    next(err);
  }
})

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