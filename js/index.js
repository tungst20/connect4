

const init = () => {
  var firebaseConfig = {
    apiKey: "AIzaSyBny0HUCq8xIaCkussUTEiEF3xHKIjq3Qg",
    authDomain: "connec-4.firebaseapp.com",
    databaseURL: "https://connec-4.firebaseio.com",
    projectId: "connec-4",
    storageBucket: "connec-4.appspot.com",
    messagingSenderId: "206654619607",
    appId: "1:206654619607:web:bd2540282a28d657945592",
    measurementId: "G-R13FR9TX0R"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  view.setActiveScreen('loginScreen');
  // var db = firebase.firestore();
  
 
}


window.onload = init;
var db = firebase.firestore();


