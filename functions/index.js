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

//
exports.saveFileName = functions.storage.object().onFinalize(async object => {
	let divider = object.name.lastIndexOf('/');

	let filename = object.name.substring(divider + 1);
	let ext = object.name.substring(object.name.lastIndexOf('.'));
	let uploadDate = new Date(Date.now());
	let uuid = object.name.substring(0, divider);

	if (ext === '.obj') {
		return admin
			.firestore()
			.collection('metadata')
			.doc(uuid)
			.set(
				{
					OBJname: filename,
					timestamp: uploadDate,
					simComplete: false
				},
				{ merge: true }
			);
	} else if (ext === '.mtl') {
		return admin
			.firestore()
			.collection('metadata')
			.doc(uuid)
			.set(
				{
					MTLname: filename,
					timestamp: uploadDate,
					simComplete: false
				},
				{ merge: true }
			);
	} else if (ext === '.png') {
		if (filename.includes('_top')) {
			return admin
				.firestore()
				.collection('metadata')
				.doc(uuid)
				.set(
					{
						PNGnames: {
							top: filename
						},
						simComplete: true
					},
					{ merge: true }
				);
		} else if (filename.includes('_bottom')) {
			return admin
				.firestore()
				.collection('metadata')
				.doc(uuid)
				.set(
					{
						PNGnames: {
							bottom: filename
						},
						simComplete: true
					},
					{ merge: true }
				);
		} else if (filename.includes('_hand')) {
			return admin
				.firestore()
				.collection('metadata')
				.doc(uuid)
				.set(
					{
						PNGnames: {
							hand: filename
						},
						simComplete: true
					},
					{ merge: true }
				);
		}
	}
});
