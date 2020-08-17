
const model = {}


model.register = (dataRegister) => {
    var db = firebase.firestore();
    db.collection("users").doc().set({
        name: dataRegister.nickName,
        email: dataRegister.email,
        password: dataRegister.password
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

}

