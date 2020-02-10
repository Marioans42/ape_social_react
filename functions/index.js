const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyD9Q5ii-UIaCiDdaGq7huXnwgxc6iDlsGI",
    authDomain: "socialape-d5cf7.firebaseapp.com",
    databaseURL: "https://socialape-d5cf7.firebaseio.com",
    projectId: "socialape-d5cf7",
    storageBucket: "socialape-d5cf7.appspot.com",
    messagingSenderId: "389130564464",
    appId: "1:389130564464:web:f323dd61e4a1a034a5d5b5",
    measurementId: "G-F6Y9MT4TGV"
  };

const express = require('express');
const app = express();

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

app.get('/screams', (req,res) => {
    admin.firestore().collection('screams')
        .orderBy("createdAt","desc")
        .get()
        .then(data => {
            let screams = [];
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
});

app.post('/scream',(req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
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
 });

 exports.api = functions.https.onRequest(app);