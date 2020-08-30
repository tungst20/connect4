const view = {}

view.componentName = undefined;
view.haveComponent = false;

view.setActiveScreen = async(screenName) => {
    switch (screenName) {
        case 'loginScreen': {
            await model.processUserData()
            
            document.getElementById('init').innerHTML = components.loginScreen; 

            document.getElementById('text-tutorial').addEventListener('click',() => {
                document.getElementsByClassName('tutorial')[0].innerHTML = `
                <img id = "tutorial1" src="../images/tutorial-1.png" alt="tutorial 1" width="355" height="181">
                <img id = "tutorial2" src="../images/tutorial-2.png" alt="tutorial 2" width="355" height="181">
                `
            })
            
            document.getElementById('register-text-button').addEventListener('click',() => {
                view.setActiveScreen('registerScreen');
                sessionStorage.userScreen = "register";
            })

            const loginForm  = document.getElementById('login-form');
            document.getElementById('login-form').addEventListener('submit', (event)=>{
                    event.preventDefault();
                    const dataLogin = {
                        nickName: loginForm.nickName.value,
                        password: loginForm.password.value,    
                    }
            model.login(dataLogin)
            })       
            break; 
        }

        case 'registerScreen': {
            document.getElementById('init').innerHTML = components.registerScreen;

            document.getElementById('login-text-button1').addEventListener('click',() => {
                view.setActiveScreen('loginScreen');
                sessionStorage.userScreen = "login";
            })

            const registerForm = document.getElementById('register-form');
            document.getElementById('register-form').addEventListener('submit', (event)=>{
                event.preventDefault();
                const dataRegister = {
                    nickName: registerForm.nickName.value,
                    password: registerForm.password.value,
                }
                model.register(dataRegister);

            })
            break;
        }
        
        case 'playScreen': {
            // console.log(localStorage)
            // localStorage.score = 0
            
            // document.getElementById('game-info').innerHTML = 'loading...'
            document.getElementById('init').innerHTML = components.playScreen;
            document.getElementById('your-name').innerHTML = localStorage.name

            // await model.listenRankChange()
            // document.getElementById('score').innerHTML =  
            await model.rankIndexProcess()
           
            localStorage.score = Number(scoreUser)
            localStorage.rank = Number(model.rankUser)

            document.getElementById('your-score').innerHTML = `Score: ${localStorage.score}`
            document.getElementById('your-rank').innerHTML = `Rank: ${localStorage.rank}`
           
            view.createBoardGame();
            document.getElementById('log-out').addEventListener('click', async()=>{
                view.setActiveScreen('loginScreen');
                sessionStorage.userScreen = "login";
                await model.updateUserStatus("off", model.processUserData)
            })
            break;
        }
    }
}

// Vẽ bảng 7x6 trong màn Play Game
view.createBoardGame = ()=>{
    for (var index=1; index < 43; index++) {
        var Div = document.getElementById("game-board");
        var h2 = document.createElement("DIV");
        h2.innerHTML = `<div onclick="controller.cellTransform(${index})" class="cells" id="cell${index}"></div>`
        Div.appendChild(h2);
    }
}


view.cancelFinding =async()=> {
    await model.updateUserStatus("off", model.processUserData)

    document.getElementById('game-info').innerHTML = ''
    document.getElementById('cancel').outerHTML = '<button class="button-below" onclick=view.startFinding() id="find-match"> Find Match </button>'
    console.log(`status: ${view.userStatus}`)
}

view.startFinding = async() => {
    document.getElementById('game-info').innerHTML = 'Finding Opponent...'
    document.getElementById('find-match').outerHTML = '<button class="button-below" onclick=view.cancelFinding() id="cancel"> Cancel </button>'

    await model.updateUserStatus("finding", model.processUserData)
    
    view.browseFindingUser()

}


view.browseFindingUser = async() => {
    for (let i=0; i< model.userData.length; i++) {
        if (model.userData[i].status == 'finding' && model.userData[i].name != localStorage.name) {
            view.componentName = model.userData[i].name;
            document.getElementById('rival-name').innerHTML = view.componentName;
            model.updateUserStatus(view.componentName, model.processUserData)
            // Upload thông tin lên Playing
            await model.updateUserPlaying();
           
            await model.processPlayingData();

            document.getElementById('game-info').innerHTML = ''
            // document.getElementById('test').innerHTML = 'Direct Player'

            await controller.processMove()
            await model.createMatchRecordDirect()
            
            
            view.haveComponent = true
            break;
        }
    }
    
    if (!view.haveComponent){
        // Lắng nghe thay đổi ở collection "Playing" để câp nhật
        await model.listenPlayingChange();
        // Tạo match record     
    } 
}

view.playAgain = async() => {
    
}

