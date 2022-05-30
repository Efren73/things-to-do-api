const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY)

module.exports = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore();

module.exports = db;