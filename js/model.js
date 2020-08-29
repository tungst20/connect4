
const model = {}

model.componentIndex = undefined
model.userIndex = undefined
model.rankIndex = undefined
model.rankData = undefined
model.userData = undefined
model.playingData = undefined
model.playingDocumentId = undefined
model.scoreArray = undefined
model.rankArray = undefined
firstMove = undefined
model.newRankArray = undefined
model.rankUser = undefined

model.register = (dataRegister) => {
    var db = firebase.firestore();
    db.collection("users").doc().set({
        name: dataRegister.nickName,
        // email: dataRegister.email,
        password: dataRegister.password,
        status: 'off',
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    db.collection("rank").doc().set({
        name: dataRegister.nickName,
        score: 0,
        rank: 0
    })
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
        await model.processPlayingData()

        for (let i=0; i<model.playingData.length; i++){
            if (localStorage.name == model.playingData[i].player2 ){
                
                view.componentName = model.playingData[i].player1
                document.getElementById('player2').innerHTML = view.componentName

                model.updateUserStatus(view.componentName, model.processUserData)

                document.getElementById('game-info').innerHTML = ''
                // document.getElementById('test').innerHTML = 'Wait Player'
                break;
            }
        }

        await model.createMatchRecordWait()
        await controller.processMove()

        await model.processMatchRecordData()
        await model.componentIndexProcess()

        firstMove = await model.matchRecordData[model.componentIndex].whoFirst

        document.getElementById('game-info').innerHTML = `${firstMove} Move First`

    })

}

model.deleteMatchRecord = async(callBack) => {
    await callBack();
    for (let i=0; i<model.matchRecordData.length; i++){
        if(localStorage.name == model.matchRecordData[i].player) {
            const docToDelete = model.matchRecordData[i].id
            await firebase.firestore().collection('matchRecord').doc(docToDelete).delete() 
            break;
        }}
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

// Tạo match record cho user match direct
model.createMatchRecordDirect = async () => {
    if ((Math.random() >= 0.5) == true) {
        firstMove = view.componentName
    } else {
        firstMove = localStorage.name
    }

    const matchRecord = {
        player: localStorage.name,
        moves: {
            cell: 0,
            color: "aa",
            countMove: 0
        },
        winner: 'none',
        whoFirst: firstMove
        }
    firebase.firestore().collection('matchRecord').add(matchRecord)
    document.getElementById('game-info').innerHTML = `${firstMove} Move First`
    await model.processMatchRecordData()
    await model.componentIndexProcess()
}  

// Tạo Match Record cho User match đợi
model.createMatchRecordWait = async () => {
    const matchRecord = {
        player: localStorage.name,
        moves: {
            cell: 0,
            color: "aa",
            countMove: 0
        },
        winner: 'none',
        
        }
    firebase.firestore().collection('matchRecord').add(matchRecord)
    await model.processMatchRecordData()
    await model.componentIndexProcess()
}  

model.processMatchRecordData = async()=> {
    const response =  await firebase.firestore().collection('matchRecord').get()
    model.matchRecordData = await getDataFromDocs(response.docs)  
    
}

// Tìm đến vị trí dữ liệu đối thủ
model.componentIndexProcess = () => {   
    for (let i = 0; i<model.matchRecordData.length; i++) {
        if (view.componentName == model.matchRecordData[i].player) {
            // controller.winner = model.matchRecordData[i].winner;
            model.componentIndex =  i;
            break;
        }
    }
}

model.userIndexProcess = () => {   
    for (let i = 0; i<model.matchRecordData.length; i++) {
        if (localStorage.name == model.matchRecordData[i].player) {
            // controller.winner = model.matchRecordData[i].winner;
            model.userIndex = i;
            break;
        }
    }
}

model.processPlayingData = async()=> {
    const response =  await firebase.firestore().collection('playing').get()
    model.playingData = await getDataFromDocs(response.docs)
}

model.updateMove = async(data)=> {
    const moveToUpdate = {
        // moves: firebase.firestore.FieldValue.arrayUnion(data)
        moves: data
    }
    await model.processMatchRecordData()

    await model.userIndexProcess()
    

    // for (let i=0; i<model.matchRecordData.length; i++){
    //     if (localStorage.name == model.matchRecordData[i].players[0] || localStorage.name == model.matchRecordData[i].players[1] ) {
            updateMoveId = model.matchRecordData[model.userIndex].id
    //         break;
    //     }
    // }
    await firebase.firestore().collection('matchRecord').doc(updateMoveId).update(moveToUpdate)
}


model.updateWinner = async()=> {
    const winner = {
        winner: localStorage.name
    }
    await firebase.firestore().collection('matchRecord').doc(updateMoveId).update(winner)
}



model.rankIndexProcess = async() => {   
    const response =  await firebase.firestore().collection('rank').get()
    model.rankData = await getDataFromDocs(response.docs)  
    console.log(model.rankData)
    for (let i = 0; i<model.rankData.length; i++) {
        if (localStorage.name == model.rankData[i].name) {
            model.rankIndex = i
            rankId = model.rankData[model.rankIndex].id
            scoreUser = model.rankData[model.rankIndex].score
            console.log(rankId)
            console.log(scoreUser)
            // console.log(model.rankData)
            // model.scoreArray = model.rankData.map(x => Number(x.score))
            // console.log(model.scoreArray)
            // model.rankArray = model.scoreArray.sort(function(a, b){return b - a});
            // console.log(model.rankArray)
            // setTimeout(() => {
            model.rankData.sort((a, b) => (a.score < b.score) ? 1 : -1)
            for (let i=0; i<model.rankData.length; i++) {
                if (localStorage.name == model.rankData[i].name){
                    model.rankUser = i+1
                    break
                }
            
            }
                
            // }, 5000);
            break;
        }
    }
}


model.updateScoreRank = async(callBack)=> {
    await callBack()
    console.log(`rank=${model.rankUser}`)

    const userScore = {
        score: Number(localStorage.score),
        rank: model.rankUser
        }
    
    await firebase.firestore().collection('rank').doc(rankId).update(userScore)
}

model.listenRankChange = async() => {
    let isFirstRun = true
    await firebase.firestore().collection('rank').onSnapshot(async() => {     
        if(isFirstRun) {
            isFirstRun = false
            return
        }
        await model.updateScoreRank(model.rankIndexProcess)
    })
}