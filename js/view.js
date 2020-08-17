const view = {}
view.setActiveScreen = (screenName) => {
    switch (screenName) {
        case 'loginScreen': {
            document.getElementById('init').innerHTML = components.loginScreen; 
            document.getElementById('register-text-button').addEventListener('click',() => {
                view.setActiveScreen('registerScreen');
            })

            document.getElementById('login-form').addEventListener('submit',() => {
                view.setActiveScreen('playScreen');
                createBoardGame();
                const dataLogin = {

                }         
            })

            break; 
        }
        case 'registerScreen': {
            document.getElementById('init').innerHTML = components.registerScreen;
            registerForm = document.getElementById('register-form');
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
            document.getElementById('init').innerHTML = components.playScreen;
            break;
        }
    }
}


// Vẽ bảng 7x6 trong màn Play Game
function createBoardGame() {
    for (var index=1; index < 43; index++) {
        var Div = document.getElementById("game-board");
        var h2 = document.createElement("DIV");
        h2.innerHTML = `<div onclick="cellTransform(${index})" class="cells" id="cell${index}"></div>`
        Div.appendChild(h2);
    }
}
