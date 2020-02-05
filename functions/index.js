const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var admin = require("firebase-admin");

var serviceAccount = require("./google-services.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sd1-backend.firebaseio.com"
});

exports.saveFileName = functions.storage.object()
    .onFinalize((snapshot, context) => {
        // console.log(`Snapshot: ${snapshot}`);
        // console.log(`Context: ${context}`);
        // const data = snapshot.name;

        // return admin.firestore().collection('filenames').doc().set({ name: snapshot.name })
        return admin.database().ref('filenames').push(snapshot.name);
    });