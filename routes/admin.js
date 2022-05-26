var express = require('express');
var router = express.Router();

const admin = require ('firebase-admin')
const db = require('../firebase')
/* GET users listing. */
router.get('/principal', async function(req, res, next) {
  const toursRef = db.collection('TOUR');
  const snapshot = await toursRef.get()
  if (snapshot.empty) {
    console.log("No matching documents.");
    res.send("No doc")
  }
  else{
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
    res.send('Well Done')
  }
});

module.exports = router;