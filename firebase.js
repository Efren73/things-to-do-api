const admin = require('firebase-admin');
const env = process.env.SERVICE_ACCOUNT_KEY
const serviceAccount = JSON.parse(env);

module.exports = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

})

const db = admin.firestore();

module.exports = db;