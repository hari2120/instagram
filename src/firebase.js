import firebase from 'firebase'

const firebaseApp= firebase.initializeApp({
  apiKey: "AIzaSyCODPGiYjUsa8e2wf7rkQYCc8lhaMzr0KU",
  authDomain: "harigram-d620c.firebaseapp.com",
  projectId: "harigram-d620c",
  storageBucket: "harigram-d620c.appspot.com",
  messagingSenderId: "580665164162",
  appId: "1:580665164162:web:317c1e864a68ced74b0f9b",
  measurementId: "G-ZXFDHBMLVN"

});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }