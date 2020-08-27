
const model = {}

model.userData = undefined;
model.playingData = undefined;
model.playingDocumentId = undefined;

model.register = (dataRegister) => {
    var db = firebase.firestore();
    db.collection("users").doc().set({
        name: dataRegister.nickName,
        email: dataRegister.email,
        password: dataRegister.password,
        status: 'off'
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}

getDataFromDoc = (doc) => {
    const x = doc.data();
    x.id = doc.id
    return x
} 

getDataFromDocs = (docs) => {
    return docs.map(item => getDataFromDoc(item))
}

//  Xử lý thông tin qua mảng Users
model.processUserData = async()=> {
    const response =  await firebase.firestore().collection('users').get()
    model.userData = await getDataFromDocs(response.docs)  
}

model.login = async(dataLogin)=>{
    for (let index=0; index < model.userData.length; index++) {
        if (model.userData[index].name == dataLogin.nickName && model.userData[index].password == dataLogin.password) {
            localStorage.name =  model.userData[index].name; 
            sessionStorage.userScreen = "play";
            view.setActiveScreen('playScreen');
        }else {
            console.log('please input your Id again')
        }
    }
}

model.updateUserStatus = async(userStatus, callBack) => {
    const userToUpdate = {
        status: userStatus
    }
    for (let x = 0; x < model.userData.length; x++) { 
        if (localStorage.name == model.userData[x].name) {
           await firebase.firestore().collection('users').doc(model.userData[x].id).update(userToUpdate)
        }
    } 
    await callBack();
}


model.processPlayingData = async()=> {
    const response =  await firebase.firestore().collection('playing').get()
    model.playingData = await getDataFromDocs(response.docs)
}

model.listenPlayingChange = async() => {
    let isFirstRun = true
    await firebase.firestore().collection('playing').where('player2','==',`${localStorage.name}`).onSnapshot(async() => {     
        if(isFirstRun) {
            isFirstRun = false
            return
        }
        console.log('playing change')

        await model.processPlayingData()

        for (let i=0; i<model.playingData.length; i++){
            if (localStorage.name == model.playingData[i].player2 ){
                

                view.componentName = model.playingData[i].player1
                document.getElementById('player2').innerHTML = view.componentName

                model.updateUserStatus(view.componentName, model.processUserData)

                document.getElementById('game-info').innerHTML = ''
                document.getElementById('test').innerHTML = 'hello'
                break;
            }
        }
        model.createMatchRecord()
        
    })

}

var index = undefined

model.deleteMatchRecord = async(callBack) => {
    await callBack();
    for (let i=0; i<model.matchRecordData.length; i++){
        console.log(i)
        index = i;
        break;
        
        // console.log(model.matchRecordData[i].players[0])
        // model.matchRecordData[i].players[0]
        // if(localStorage.name == model.matchRecordData[i].players[0] || localStorage.name == model.matchRecordData[i].players[1]) {
        //     const docToDelete = model.matchRecordData[i].id
        //     await firebase.firestore().collection('matchRecord').doc(docToDelete).delete() 
        // }
    }
    console.log(model.matchRecordData[index]);
    console.log(model.matchRecordData[index].winner)
    console.log(model.matchRecordData[index].players)
    console.log(model.matchRecordData[index].moves)
}


model.deletePlaying= async(callBack) => {
    await callBack();
    for (let i=0; i<model.playingData.length; i++){
        if(localStorage.name == model.playingData[i].player1 || localStorage.name == model.playingData[i].player2) {
            const docToDelete = model.playingData[i].id
            await firebase.firestore().collection('playing').doc(docToDelete).delete() 
        }
    }
}



model.listenUserChange = async() => {
    // let isFirstRun = true
    await firebase.firestore().collection('users').onSnapshot(() => {
        // if(isFirstRun) {
        //     isFirstRun = false
        //     return
        // }
        console.log('user change')
        test1(model.browseFindingUser)
    })
}

model.updateUserPlaying = async()=>{
    const userPlaying = {
        player1: localStorage.name,
        player2: view.componentName,
    }
    // callBack()
    await firebase.firestore().collection('playing').add(userPlaying)
}

model.createMatchRecord = () => {
    const matchRecord = {
        players: [view.componentName, localStorage.name],
        moves: [{
            cell: 1,
            color: "aa"
        }],
        winner: 'none',
        countMove: 0
            }
    firebase.firestore().collection('matchRecord').add(matchRecord)
}  

model.processMatchRecordData = async()=> {
    const response =  await firebase.firestore().collection('matchRecord').get()
    model.matchRecordData = await getDataFromDocs(response.docs)  
    
}


model.processPlayingData = async()=> {
    const response =  await firebase.firestore().collection('playing').get()
    model.playingData = await getDataFromDocs(response.docs)
}


model.updateMove = async(data)=> {
    const moveToUpdate = {
        moves: firebase.firestore.FieldValue.arrayUnion(data)
    }
    await model.processMatchRecordData()
    for (let i=0; i<model.matchRecordData.length; i++){
        if (localStorage.name == model.matchRecordData[i].player1 || localStorage.name == model.matchRecordData[i].player2 ) {
            updateMoveId = model.matchRecordData[i].id
            break;
        }
    }
 
    await firebase.firestore().collection('matchRecord').doc(updateMoveId).update(moveToUpdate)
}
