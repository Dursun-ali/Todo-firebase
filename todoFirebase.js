const firebaseConfig = {
  apiKey: "AIzaSyBBUZAK8fWnIxlA_kiKTihIx7ZFKJYvdLk",
  authDomain: "todofirebase-dd260.firebaseapp.com",
  projectId: "todofirebase-dd260",
  storageBucket: "todofirebase-dd260.appspot.com",
  messagingSenderId: "638031899967",
  appId: "1:638031899967:web:f4d692973059dc973e378a",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
