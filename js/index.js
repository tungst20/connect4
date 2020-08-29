const init = async() => {
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

  await model.processUserData()
  
  await model.deletePlaying(model.processPlayingData)
  await model.deleteMatchRecord(model.processMatchRecordData);

  model.updateUserStatus("off", model.processUserData)
  
  if (sessionStorage.userScreen == 'login' || sessionStorage.userScreen == undefined) {
    view.setActiveScreen('loginScreen');
    sessionStorage.setItem("userScreen", "login");
  } else if (sessionStorage.userScreen == 'register') {
    view.setActiveScreen('registerScreen');
  } else if (sessionStorage.userScreen == 'play') {
    view.setActiveScreen('playScreen');
  }

}

window.onload = init;


// Note: 1/ Kiểm tra thông in register/ login có đúng định dạng không
// 2. Kiểm tra trạng thái off/loading của user trong trường hợp đang fiding thì logout
