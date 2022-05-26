var express = require('express');
var router = express.Router();

const admin = require ('firebase-admin')
const db = require('../firebase')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const cityRef = db.collection('TOUR').doc('LwCvn4yfT91Y4ekEaGlh');
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }
res.send('respond with a resource');
});

/* CREATE TOUR -------------------------------------------------- */
router.get("/create-tour", async(req, res, next) => {
  try {
    const data = {
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

    // Agrega nuevo documento y deja que firestore cree la clave
    const newTour = await db.collection('PET_OWNER').add(data);
    res.send("ok");

  } catch (error) {
    next();
  }
});

/* UPDATE TOUR -------------------------------------------------- */
router.update("update-tour", async(req, res, next) => {
  try {
    const data = req.body;


  }
});

module.exports = router;