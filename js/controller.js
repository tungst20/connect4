controller = {}

controller.winner = undefined
countMove = 0
controller.cellNumber = undefined

controller.register = (data) =>{
    
}

// Gán giá trị Null cho tất cả các ô
var cellValue = [];
for (let i=0; i <42;  i++ ) {
    cellValue[i] = null;
}

// Số nước đi là chẵn or lẻ để xác định nước đi của Player nào
// var countMove = 1;

controller.processMove = async ()=> {
        let isRun = 0
    firebase.firestore().collection('matchRecord').where('player', '==',`${view.componentName}`).onSnapshot(async() => {
        console.log('111')
        isRun += 1

        console.log(`isRun=${isRun}`)
        if (document.getElementById('test').innerHTML == 'Direct Player'){
            if (isRun <=2){
                return
            }
        } else {
            if (isRun <=1) {
                return
            }
        }
        await model.processMatchRecordData()
        await model.componentIndexProcess()

        console.log(model.matchRecordData[model.componentIndex])
        if (model.matchRecordData[model.componentIndex].winner == 'none') {
                countMove +=1
                // console.log(`countMove Listen= ${countMove}`)
                cellNumber = await model.matchRecordData[model.componentIndex].moves.cell
                document.getElementById(`cell${cellNumber}`).outerHTML = `<div class="cells" id="cell-red"></div>`
                cellValue[cellNumber-1] = 'red'
                
            } else {
                document.getElementsByClassName('game-info')[0].innerHTML = `${view.componentName} Win...GAME OVER`;
                document.getElementById('cancel').outerHTML = 
                '<button class="button-below" onclick=view.playAgain() id="play-again"> Play Again </button> <button class="button-below" onclick=view.startFinding() id="find-match"> Find Match </button>'                    
                countMove = 43;
                model.updateScoreRank(model.rankIndexProcess)
            }
    })
}

controller.cellTransform = async (index)=>{
    console.log(`countMove transform=${countMove}`)
    // if (controller.countMove == 0 && localStorage.name != firstMove){
    //     return;
    // } else {

        while (cellValue[index-1] == null && countMove<43) {
            index +=7;
            if (index > 42) {
                break;
            }  
        }

        if (localStorage.name == firstMove){
            if (countMove % 2 == 0) {
                console.log(`ố số ${index-7}`)
                document.getElementById(`cell${index-7}`).outerHTML = `<div class="cells" id="cell-blue"></div>`
                document.getElementsByClassName('game-info')[0].innerHTML = `${view.componentName} turn...`;
                cellValue[index-8] = 'blue'
               
                await checkWinNgang();
                await checkWinDoc();
                await checkWinCheo();
                countMove +=1
            } else {
                return
            }
        } 
        else {
            console.log(`ố số ${index-7}`)
            document.getElementById(`cell${index-7}`).outerHTML = `<div class="cells" id="cell-blue"></div>`
            document.getElementsByClassName('game-info')[0].innerHTML = `${view.componentName} turn...`;
            cellValue[index-8] = 'blue'
            await checkWinNgang();
            await checkWinDoc();
            await checkWinCheo();
            countMove +=1
        }

        const dataMove = {
            cell: index-7,
            color: cellValue[index-8],
            countMove: countMove
        };
    
        await model.updateMove(dataMove)
        
    // }
}




// Check Win trường hợp thắng Ngang
function checkWinNgang() {
    for (let j = 0; j<42; j++) {
        if (cellValue[j] != null) {
            if ((cellValue[j] == cellValue[j+1]) && (cellValue[j+1] == cellValue[j+2])
            && (cellValue[j+2] == cellValue[j+3]) &&  (j % 7 != 4)  &&  (j % 7 != 5)  &&  (j % 7 != 6)){
                if (cellValue[j]=='blue') {
                    document.getElementsByClassName('game-info')[0].innerHTML = `${localStorage.name} Win...+10 Exp`;
                    document.getElementById('cancel').outerHTML = 
                    '<button class="button-below" onclick=view.playAgain() id="play-again"> Play Again </button> <button class="button-below" onclick=view.startFinding() id="find-match"> Find Match </button>'                    
                    countMove = 43;   
                    model.updateWinner()
                    localStorage.score = Number(localStorage.score) + 10
                    model.updateScoreRank(model.rankIndexProcess)
                }                
            } 
        }
    }
}


// Check Win trường hợp thắng Dọc
function checkWinDoc() {
    for (let x = 0; x<42; x++) {
        if (cellValue[x] != null) {
            if ((cellValue[x] == cellValue[x-7]) && (cellValue[x-7] == cellValue[x-14])
            && (cellValue[x-14] == cellValue[x-21])){
                if(cellValue[x] === 'blue') {
                    document.getElementsByClassName('game-info')[0].innerHTML = `${localStorage.name} Win...+10 Exp`;
                    document.getElementById('cancel').outerHTML = 
                    '<button class="button-below" onclick=view.playAgain() id="play-again"> Play Again </button> <button class="button-below" onclick=view.startFinding() id="find-match"> Find Match </button>'                    
                    countMove = 43;
                    model.updateWinner() 
                    localStorage.score = Number(localStorage.score) + 10
                    model.updateScoreRank(model.rankIndexProcess)
                }        
            } 
        }
    }
}

function checkWinCheo(){
    for (let y=0; y<42; y++) {
        if ((cellValue[y]) != null) {
            // console.log(cellValue[y] % 7 - 1);
                if (((cellValue[y] == cellValue[y+8]) && (cellValue[y+8] == cellValue[y+16]) && (cellValue[y+16] == cellValue[y+24])
                && (y % 7 == (y+8)%7 - 1) &&  ((y+8)%7 == (y+16)%7 - 1) && ((y+16)%7 == (y+24)%7 - 1))
                || ((cellValue[y] == cellValue[y+6]) && (cellValue[y+6] == cellValue[y+12]) && (cellValue[y+12] == cellValue[y+18])
                && ((y%7) == (y+6)%7 +1 ) && ((y+6)%7 == (y+12)%7 + 1)  && ((y+12)%7 == (y+18)%7 +1 ))) {
                    if (cellValue[y] == 'blue'){
                        document.getElementsByClassName('game-info')[0].innerHTML = `${localStorage.name} Win...+10 Exp`;
                        document.getElementById('cancel').outerHTML = 
                        '<button class="button-below" onclick=view.playAgain() id="play-again"> Play Again </button> <button class="button-below" onclick=view.startFinding() id="find-match"> Find Match </button>'                    
                        countMove = 43;
                        model.updateWinner() 
                        localStorage.score = Number(localStorage.score) + 10
                        model.updateScoreRank(model.rankIndexProcess)
                    }              
                }
        }
    }
}


