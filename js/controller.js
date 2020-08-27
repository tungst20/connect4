controller = {}

controller.winner = undefined;
// Gán giá trị Null cho tất cả các ô
var cellValue = [];
for (let i=0; i <42;  i++ ) {
    cellValue[i] = null;
}

// Số nước đi là chẵn or lẻ để xác định nước đi của Player nào
// var countMove = 1;

controller.processMove = async ()=> {
   // let isFirstRun = true
    firebase.firestore().collection('matchRecord').where('players', 'array-contains',`${localStorage.name}`).onSnapshot(async() => {
        // if(isFirstRun) {
        //     isFirstRun = false
        //     return
        // }
        await model.processMatchRecordData()
        
        await controller.winnerName()

        if (controller.winnerName == 'none') {
            

        }        
    })
}

controller.winnerName = () => {   
    for (let i = 0; i<model.playingData.length; i++) {
        if (localStorage.name == model.playingData.player1 || localStorage.name == model.playingData.player2) {
            controller.winner = model.playingData.winner;
            break;
        }
    }
}

controller.cellTransform = (index)=>{
    while (cellValue[index-1] == null) {
        index +=7;
        if (index > 42) {
            break;
        }  
    }
    document.getElementById(`cell${index-7}`).outerHTML = `<div class="cells" id="cell-red"></div>`
    document.getElementsByClassName('game-info')[0].innerHTML = 'Blue Turn...';
    cellValue[index-8] = localStorage.color
    checkWinNgang();
    checkWinDoc();
    checkWinCheo();

    const dataMove = {
        cell: index-7,
        color: cellValue[index-8]
    };
    model.updateMove(dataMove)

}


controller.checkWin = ()=> {

}
    // else if (countMove %2 == 0 && countMove < 43) {
    //     document.getElementById(`cell${index-7}`).outerHTML = `<div class="cells" id="cell-blue"></div>`
    //     cellValue[index-8] = 'blue'; 
    //     document.getElementsByClassName('game-info')[0].innerHTML = 'Red Turn...';
    // }


   
    
    // countMove++ ;


// Check Win trường hợp thắng Ngang
function checkWinNgang() {
    for (let j = 0; j<42; j++) {
        if (cellValue[j] != null) {
            if ((cellValue[j] == cellValue[j+1]) && (cellValue[j+1] == cellValue[j+2])
            && (cellValue[j+2] == cellValue[j+3]) &&  (j % 7 != 4)  &&  (j % 7 != 5)  &&  (j % 7 != 6)){
                if (cellValue[j]=='blue') {
                    document.getElementsByClassName('game-info')[0].innerHTML = 'Blue Win...';
                    countMove = 43;
                    
                } else {
                    document.getElementsByClassName('game-info')[0].innerHTML = 'Red Win..';
                    countMove = 43;  
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
                    document.getElementsByClassName('game-info')[0].innerHTML = 'Blue Win...';
                    countMove = 43;
                } else if (cellValue[x] == 'red') {
                    document.getElementsByClassName('game-info')[0].innerHTML = 'Red Win..';
                    countMove = 43;
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
                        document.getElementsByClassName('game-info')[0].innerHTML = 'Blue Win...';
                        countMove = 43;
                    } else if (cellValue[y] == 'red') {
                        document.getElementsByClassName('game-info')[0].innerHTML = 'Red Win..';
                        countMove = 43;
                    }
                    
                }
        }
    }
}


