controller = {}

controller.winner = undefined
countMove = 0
controller.cellNumber = undefined

winCheo = false
winDoc = false
winNgang = false

// Gán giá trị Null cho tất cả các ô
var cellValue = [];
for (let i=0; i <42;  i++ ) {
    cellValue[i] = null;
}




controller.processMove = async ()=> {
        let isRun = 0
    firebase.firestore().collection('matchRecord').where('player', '==',`${view.competitorName}`).onSnapshot(async() => {
        isRun += 1
        if (sessionStorage.typePlayer == 'direct'){
            if (isRun <=2){
                return
            }
        } else if (sessionStorage.typePlayer == 'wait') {
            if (isRun <=1) {
                return
            }
        }
        console.log('test1111')
        await model.processMatchRecordData()
        await model.componentIndexProcess()

        if (model.matchRecordData[model.componentIndex].winner == 'none') {
                countMove +=1
                cellNumber = await model.matchRecordData[model.componentIndex].moves.cell

                document.getElementById('game-info').innerHTML = `Your turn...`;

                // console.log(`nhan o so ${cellNumber}`)

                document.getElementById(`cell${cellNumber}`).outerHTML = `<div class="cells" id="cell-red"></div>`
                
                cellValue[cellNumber-1] = 'red'

                unsubscribe1()
                unsubscribe2()
                
        } else if (model.matchRecordData[model.componentIndex].winner == 'draw' ) {
            cellNumber = await model.matchRecordData[model.componentIndex].moves.cell

            document.getElementById(`cell${cellNumber}`).outerHTML = `<div class="cells" id="cell-red"></div>`
            cellValue[cellNumber-1] = 'red'

            document.getElementById('game-info').innerHTML = `YOU DRAW...+0 score`;

            document.getElementById('below-zone').innerHTML = 
            '<button class="button-below" onclick=view.resetGame() id="find-match"> Reset Game </button>'                    
            countMove = 43;
            model.updateScoreRank(model.rankIndexProcess)

        } 
        else {
                cellNumber = await model.matchRecordData[model.componentIndex].moves.cell
                console.log(`winner cellNumber = ${cellNumber}`)
                document.getElementById(`cell${cellNumber}`).outerHTML = `<div class="cells" id="cell-red"></div>`
                cellValue[cellNumber-1] = 'red'

                document.getElementById('game-info').innerHTML = `${view.competitorName} WIN...GAME OVER`;

                document.getElementById('below-zone').innerHTML = 
                '<button class="button-below" onclick=view.resetGame() id="find-match"> Reset Game </button>'                    
                countMove = 43;
                model.updateScoreRank(model.rankIndexProcess)
            }
    })
}

controller.cellTransform = async (index)=>{
    while (cellValue[index-1] == null && countMove<43) {
        index +=7;
        if (index > 42) {
                break;
        }  
    }

    if (countMove == 0) {
        if (localStorage.name == firstMove){
                console.log(`ố số ${index-7}`)
                document.getElementById(`cell${index-7}`).outerHTML = `<div class="cells" id="cell-blue"></div>`
                document.getElementById('game-info').innerHTML = `${view.competitorName} turn...`;
                cellValue[index-8] = 'blue'
                   
                // await checkWinNgang();
                // await checkWinDoc();
                // await checkWinCheo();
                // await checkDraw()
                countMove +=1

        } else {
            return
        }
    } else if (countMove != 0 ){
        if(localStorage.name == firstMove) {
            if (countMove % 2 == 0) {
                console.log(`ố số ${index-7}`)
                document.getElementById(`cell${index-7}`).outerHTML = `<div class="cells" id="cell-blue"></div>`
                // document.getElementsByClassName('game-info')[0].innerHTML = `${view.competitorName} turn...`;
                document.getElementById('game-info').innerHTML = `${view.competitorName} turn...`;
                cellValue[index-8] = 'blue'
                   
                await checkWinNgang();
                await checkWinDoc();
                await checkWinCheo();
                await checkDraw()
                countMove +=1
            } else {
                return
            }
        } else {
            if (countMove % 2 == 1) {
                console.log(`ố số ${index-7}`)
                document.getElementById(`cell${index-7}`).outerHTML = `<div class="cells" id="cell-blue"></div>`
                // document.getElementsByClassName('game-info')[0].innerHTML = `${view.competitorName} turn...`;
                document.getElementById('game-info').innerHTML = `${view.competitorName} turn...`;

                cellValue[index-8] = 'blue'
                   
                await checkWinNgang();
                await checkWinDoc();
                await checkWinCheo();
                await checkDraw()
                countMove +=1
            } else {
                return
            }
        }
    }


    const dataMove = {
        cell: index-7,
        color: cellValue[index-8],
        countMove: countMove
    };
    await model.updateMove(dataMove)
}




// Check Win trường hợp thắng Ngang
function checkWinNgang() {
    for (let j = 0; j<42; j++) {
        if (cellValue[j] != null) {
            if ((cellValue[j] == cellValue[j+1]) && (cellValue[j+1] == cellValue[j+2])
            && (cellValue[j+2] == cellValue[j+3]) &&  (j % 7 != 4)  &&  (j % 7 != 5)  &&  (j % 7 != 6)){
                if (cellValue[j]=='blue') {
                    winNgang = true
                    document.getElementById('game-info').innerHTML = `YOU WIN...+10 score`;

                    document.getElementById('below-zone').innerHTML = 
                    '<button class="button-below" onclick=view.resetGame() id="find-match"> Reset Game </button>'                    
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
                    winDoc = true
                    document.getElementById('game-info').innerHTML = `YOU WIN...+10 score`;
                    document.getElementById('below-zone').innerHTML = 
                    '<button class="button-below" onclick=view.resetGame() id="find-match"> Reset Game </button>'                    
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
                        winCheo = true
                        document.getElementById('game-info').innerHTML = `YOU WIN...+10 score`;
                        document.getElementById('below-zone').innerHTML = 
                        '<button class="button-below" onclick=view.resetGame() id="find-match"> Reset Game </button>'                    
                        countMove = 43;
                        model.updateWinner() 
                        localStorage.score = Number(localStorage.score) + 10
                        model.updateScoreRank(model.rankIndexProcess)
                    }              
                }
        }
    }
}

function checkDraw() {
    if (cellValue[0] != null && cellValue[1] != null && cellValue[2] != null && cellValue[3] != null && cellValue[4] != null 
        && cellValue[5] != null && cellValue[6] != null){
            if (winCheo == false && winDoc == false && winNgang == false){
                document.getElementById('game-info').innerHTML = `YOU DRAW...+0 score`;
                document.getElementById('below-zone').innerHTML = 
                '<button class="button-below" onclick=view.resetGame() id="find-match"> Reset Game </button>'                    
                countMove = 43;
                model.updateDraw() 
                localStorage.score = Number(localStorage.score)
                model.updateScoreRank(model.rankIndexProcess)

            }
        }
}


