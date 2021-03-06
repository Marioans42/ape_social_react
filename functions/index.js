const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require("../key/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-d5cf7.firebaseio.com"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
 });

 exports.getScreams = functions.https.onRequest((req, res) => {
    admin.firestore().collection('screams')
        .get()
        .orderBy('createdAt', 'desc')
        .then(data => {
            let screams = []
            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            })
            return res.json(screams);
        })
        .catch((err) => console.error(err));
 })

 exports.createScream = functions.https.onRequest((req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    }

    admin.firestore()
        .collection('scream')
        .add(newScream)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully` })
        })
        .catch((err) => {
            res.status(500).json({ error: `Something went wrong`})
            console.error(err)
        })
 })