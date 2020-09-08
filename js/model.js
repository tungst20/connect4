
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
    if (dataRegister.nickName == '') {
        document.getElementById('nickname-error').innerText = 'Please input your nick name'
    } else {
        document.getElementById('nickname-error').innerText = ''
    }
    if(dataRegister.password == '') {
        document.getElementById('password-error').innerText = 'Please input your password'
    } else {
        document.getElementById('password-error').innerText = ''
    } 
    if (dataRegister.nickName != '' && dataRegister.password != '' ) {
        var db = firebase.firestore();
        db.collection("users").doc().set({
            name: dataRegister.nickName,
            // email: dataRegister.email,
            password: dataRegister.password,
            status: 'off',
        })
        .then(function() {
            console.log("Document successfully written!");
            document.getElementsByClassName('welcome')[0].innerHTML = ''

            document.getElementById('register-form').innerHTML = `Welcome, <span style="color:blue"> ${dataRegister.nickName} </span> <br>
            Please click <span id="login-text-button2"> Login </span> to play game
            `
            document.getElementById('login-text-button2').addEventListener('click',() => {
                view.setActiveScreen('loginScreen');
                sessionStorage.userScreen = "login";
            })
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            alert('Please reload page and register again')
        });
    
        db.collection("rank").doc().set({
            name: dataRegister.nickName,
            score: 0,
            rank: 0
        })
    }

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
    if (dataLogin.nickName == '') {
        document.getElementById('nickname-error').innerText = 'Please input your nick name'
    } else {
        document.getElementById('nickname-error').innerText = ''
    }
    if(dataLogin.password == '') {
        document.getElementById('password-error').innerText = 'Please input your password'
    } else {
        document.getElementById('password-error').innerText = ''
    }
    if (dataLogin.nickName != '' && dataLogin.password != '') {
        for (let index=0; index < model.userData.length; index++) {
            if (model.userData[index].name == dataLogin.nickName && model.userData[index].password == dataLogin.password) {
                localStorage.name =  model.userData[index].name; 
                sessionStorage.userScreen = "play";
                view.setActiveScreen('playScreen');
                break
            }else if (model.userData[index].name == dataLogin.nickName && model.userData[index].password != dataLogin.password){
                document.getElementById('password-error').innerText = 'Wrong password, please input again'
            }else if (model.userData[index].name != dataLogin.nickName && model.userData[index].password == dataLogin.password) {
                document.getElementById('nickname-error').innerText = 'Wrong nick name, please input again'
            }else if (model.userData[index].name != dataLogin.nickName && model.userData[index].password != dataLogin.password) {
                document.getElementById('nickname-error').innerText = 'Wrong nick name, please input again'
                document.getElementById('password-error').innerText = 'Wrong password, please input again'
            }
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
                
                view.competitorName = model.playingData[i].player1
                document.getElementById('rival-name').innerHTML = view.competitorName

                model.updateUserStatus(view.competitorName, model.processUserData)

                document.getElementById('game-info').innerHTML = ''
                sessionStorage.typePlayer = 'wait'
                break;
            }
        }

        await model.createMatchRecordWait()
        await controller.processMove()

        await model.processMatchRecordData()
        await model.componentIndexProcess()

        firstMove = await model.matchRecordData[model.componentIndex].whoFirst

        if (localStorage.name == firstMove) {
            document.getElementById('game-info').innerHTML = `You move first`
        } else {
            document.getElementById('game-info').innerHTML = `${firstMove} move first`
        }

        await model.rankIndexProcess()

        for (let i = 0; i<model.rankData.length; i++) {
            if (view.competitorName == model.rankData[i].name) {
                document.getElementById('rival-score').innerHTML = `score: ${model.rankData[i].score}`
                document.getElementById('rival-rank').innerHTML = `rank: ${model.rankData[i].rank}`
        break
            }
        }

        document.getElementById('below-zone').innerHTML = ''
    })
}



model.deleteMatchRecord = async(callBack) => {
    await callBack();
    for (let i=0; i<model.matchRecordData.length; i++){
        if(localStorage.name == model.matchRecordData[i].player) {
            const docToDelete = model.matchRecordData[i].id
            await firebase.firestore().collection('matchRecord').doc(docToDelete).delete() 
            // break;
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
        player2: view.competitorName,
    }
    // callBack()
    await firebase.firestore().collection('playing').add(userPlaying)
}

// Tạo match record cho user match direct
model.createMatchRecordDirect = async () => {
    if ((Math.random() >= 0.5) == true) {
        firstMove = view.competitorName
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

    if (localStorage.name == firstMove) {
        document.getElementById('game-info').innerHTML = `You move first`
    } else {
        document.getElementById('game-info').innerHTML = `${firstMove} move first`
    }
    
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
        if (view.competitorName == model.matchRecordData[i].player) {
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
        updateMoveId = model.matchRecordData[model.userIndex].id
    await firebase.firestore().collection('matchRecord').doc(updateMoveId).update(moveToUpdate)
}


model.updateWinner = async()=> {
    const winner = {
        winner: localStorage.name
    }
    await firebase.firestore().collection('matchRecord').doc(updateMoveId).update(winner)
}

model.updateDraw = async()=> {
    const winner = {
        winner: 'draw'
    }
    await firebase.firestore().collection('matchRecord').doc(updateMoveId).update(winner)
}


model.rankIndexProcess = async() => {   
    const response =  await firebase.firestore().collection('rank').get()
    model.rankData = await getDataFromDocs(response.docs)  
    for (let i = 0; i<model.rankData.length; i++) {
        if (localStorage.name == model.rankData[i].name) {
            model.rankIndex = i
            rankId = model.rankData[model.rankIndex].id
            scoreUser = model.rankData[model.rankIndex].score
            model.rankData.sort((a, b) => (a.score < b.score) ? 1 : -1)
            for (let i=0; i<model.rankData.length; i++) {
                if (localStorage.name == model.rankData[i].name){
                    model.rankUser = i+1
                    break
                }            
            }           
            break;
        }
    }
}


model.updateScoreRank = async(callBack)=> {
    
    const userScore = {
        score: Number(localStorage.score),
        rank: model.rankUser
    }
    await callBack()
    await firebase.firestore().collection('rank').doc(rankId).update(userScore)
    await callBack()
}


model.getLeaderboard = async(callBack) => {
    await callBack()
    for (let i = 0; i<model.rankData.length; i++) {
        if (i == 0) {
            document.getElementById('l-name1').innerHTML = model.rankData[i].name
            document.getElementById('l-score1').innerHTML = model.rankData[i].score
        }else if (i == 1) {
            document.getElementById('l-name2').innerHTML = model.rankData[i].name
            document.getElementById('l-score2').innerHTML = model.rankData[i].score
        }else if (i == 2) {
            document.getElementById('l-name3').innerHTML = model.rankData[i].name
            document.getElementById('l-score3').innerHTML = model.rankData[i].score
        }else if (i == 3) {
            document.getElementById('l-name4').innerHTML = model.rankData[i].name
            document.getElementById('l-score4').innerHTML = model.rankData[i].score
        }else if (i == 4) {
            document.getElementById('l-name5').innerHTML = model.rankData[i].name
            document.getElementById('l-score5').innerHTML = model.rankData[i].score
        }else if (i == 5) {
            document.getElementById('l-name6').innerHTML = model.rankData[i].name
            document.getElementById('l-score6').innerHTML = model.rankData[i].score
        }else if (i == 6) {
            document.getElementById('l-name7').innerHTML = model.rankData[i].name
            document.getElementById('l-score7').innerHTML = model.rankData[i].score
        }else if (i == 7) {
            document.getElementById('l-name8').innerHTML = model.rankData[i].name
            document.getElementById('l-score8').innerHTML = model.rankData[i].score
        }else if (i == 8) {
            document.getElementById('l-name9').innerHTML = model.rankData[i].name
            document.getElementById('l-score9').innerHTML = model.rankData[i].score
        }else if (i == 9) {
            document.getElementById('l-name10').innerHTML = model.rankData[i].name
            document.getElementById('l-score10').innerHTML = model.rankData[i].score
        }else{
            break
        }  
    }

}