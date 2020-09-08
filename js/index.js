const init = async() => {
  var firebaseConfig = {
    apiKey: "AIzaSyBnAotSClRNedGrVwqJMpq88RV6PKDm39M",
    authDomain: "in-a-row-a137b.firebaseapp.com",
    databaseURL: "https://in-a-row-a137b.firebaseio.com",
    projectId: "in-a-row-a137b",
    storageBucket: "in-a-row-a137b.appspot.com",
    messagingSenderId: "327514781514",
    appId: "1:327514781514:web:bd552b27c7eabd9c68b3b3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  console.log('run this')
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
