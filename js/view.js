const view = {}

view.componentName = undefined;
view.haveComponent = true;

view.setActiveScreen = (screenName) => {
    switch (screenName) {
        case 'loginScreen': {
            document.getElementById('init').innerHTML = components.loginScreen; 
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
            document.getElementById('login-text-button').addEventListener('click',() => {
                view.setActiveScreen('loginScreen');
                sessionStorage.userScreen = "login";
            })
            const registerForm = document.getElementById('register-form');
            document.getElementById('register-form').addEventListener('submit', (event)=>{
                event.preventDefault();
                const dataRegister = {
                    nickName: registerForm.nickName.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value,
                }
                model.register(dataRegister);
            })
            break;
        }
        
        case 'playScreen': {
            
            
            // document.getElementById('game-info').innerHTML = 'loading...'
            document.getElementById('init').innerHTML = components.playScreen;
            view.createBoardGame();
            document.getElementById('log-out').addEventListener('click',()=>{
                view.setActiveScreen('loginScreen');
                sessionStorage.userScreen = "login";

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
            // Hiển thị đối thủ lên màn chơi
            view.componentName = model.userData[i].name;
            document.getElementById('player2').innerHTML = view.componentName;
            // Update status: component_name sau đó duyệt để Update lại User Data
            model.updateUserStatus(view.componentName, model.processUserData)
            // Push thông in cặp đấu của mình và đối thủ lên Firestore
            await model.updateUserPlaying();
           
            await model.processPlayingData();
            // for (let i=0; i<model.playingData.length; i++){
            //     if (localStorage.name == model.playingData[i].player1) {
            //         model.playingData.id = model.playingData[i].id
            //         break;
            //     }
            // }
            // model.playingData.id
            document.getElementById('game-info').innerHTML = ''
            document.getElementById('test').innerHTML = 'hi'
        
            break;
        } else {
            view.haveComponent = false;  
        }
    }      
    if (!view.haveComponent){
    // Lắng nghe thay đổi ở Playing để lấy thông tin đối thủ đã Match được mình
        model.listenPlayingChange();
        view.haveComponent = true;
    } 
}





