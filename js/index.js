const init = async() => {
  var firebaseConfig = {
    apiKey: "AIzaSyA20LiJ6YBKiNoPI4z5ttzocPEZj-fp5sk",
    authDomain: "inarow-e328f.firebaseapp.com",
    databaseURL: "https://inarow-e328f.firebaseio.com",
    projectId: "inarow-e328f",
    storageBucket: "inarow-e328f.appspot.com",
    messagingSenderId: "826861462784",
    appId: "1:826861462784:web:306e4d01ef857680efbfe5"
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
