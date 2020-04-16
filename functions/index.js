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
	let divider = object.name.lastIndexOf('/');
	let filename = object.name.substring(divider + 1);
	let ext = filename.substring(filename.lastIndexOf('.'));
	let uuid = object.name.substring(0, divider);
	let uploadDate = new Date(Date.now());

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
	} else if (ext === '.png') {
		if (filename.includes('_out')) {
			return admin
				.firestore()
				.collection('metadata')
				.doc(uuid)
				.set(
					{
						outputName: filename,
						simComplete: true
					},
					{ merge: true }
				);
		} else {
			return admin
				.firestore()
				.collection('metadata')
				.doc(uuid)
				.set(
					{
						textureName: filename,
						simComplete: true
					},
					{ merge: true }
				);
		}
	}
});

exports.deleteFileName = functions.storage.object().onDelete(async object => {
	let FieldValue = admin.firestore.FieldValue;

	let divider = object.name.lastIndexOf('/');
	let filename = object.name.substring(object.name.lastIndexOf('/') + 1);
	let ext = filename.substring(filename.lastIndexOf('.'));
	let uuid = object.name.substring(0, divider);

	if (ext === '.obj') {
		return admin
			.firestore()
			.collection('metadata')
			.doc(uuid)
			.update({
				OBJname: FieldValue.delete()
			});
	} else if (ext === '.png') {
		if (filename.includes('_out')) {
			return admin
				.firestore()
				.collection('metadata')
				.doc(uuid)
				.update({
					outputName: FieldValue.delete()
				});
		} else {
			return admin
				.firestore()
				.collection('metadata')
				.doc(uuid)
				.update({
					textureName: FieldValue.delete()
				});
		}
	} else if (ext === '.mtl') {
		return admin
			.firestore()
			.collection('metadata')
			.doc(uuid)
			.update({
				MTLname: FieldValue.delete()
			});
	}
});
