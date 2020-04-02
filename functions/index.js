const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var admin = require('firebase-admin');

var serviceAccount = require('./google-services.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://sd1-backend.firebaseio.com'
});

exports.saveFileName = functions.storage.object().onFinalize(async object => {
	let start = object.name.lastIndexOf('/') + 1;

	let filename = object.name.substring(start, object.name.length);
	let uploadDate = new Date(Date.now());

	return admin
		.firestore()
		.collection('metadata')
		.doc()
		.set({
			date: uploadDate,
			name: filename
		});
});
