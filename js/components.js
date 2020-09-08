const components = {}
components.loginScreen = `
<div class="above-side">
<div class="left-side">
    <img id = "game-title" src="../images/title.png" alt="4 In a Row Online" width="395" height="184">
    <p>Don't have account. <span id="register-text-button"> Register </span></p>
</div>

<div class="right-side">
    <div class="welcome">Please login your account</div>
    <form id="login-form">
        <div class="nickname-wrapper"> 
        <input type="text" name="nickName" placeholder="Nick name">  
        <div class="error" id = "nickname-error"> </div>
        </div>
        <div class="password-wrapper"> 
        <input type="password" name="password" placeholder="Password"> 
        <div class="error" id="password-error"> </div> 
        </div>
        
        <button class="btn" type="submit"> Login </button> 
    </form>
    
</div>
</div>

<div class="below-side">
<h4> Do you want to view <span id="text-tutorial"> Tutorial </span>  </h4>  
<div class="tutorial"> </div>
</div>

`
components.registerScreen = ` 
<div class="above-side">
<div class="left-side">
    <img id = "game-title" src="../images/title.png" alt="4 In a Row Online" width="395" height="184">
    <p>Have an account? <span id="login-text-button1"> Login </span></p>
</div>

<div class="right-side">
    <div class="welcome">Please register an account</div>
    <form id="register-form">
        <div class="nickname-wrapper"> 
        <input type="text" name="nickName" placeholder="Nick name"> 
        <div class="error" id = "nickname-error"> </div>
        </div>
        <div class="password-wrapper"> 
        <input type="password" name="password" placeholder="Password"> 
        <div class="error" id="password-error"> </div> 
        </div>
        
        <button class="btn" type="submit"> Register </button> 
    </form>
</div>
</div>
<div class="below-side">
<h4> Do you want to view <span id="text-tutorial"> Tutorial </span>  </h4>  
<div class="tutorial"> </div>
</div>
`

components.playScreen = `
<img id = "game-header" src="../images/title.png" alt="4 In a Row Online" width="320" height="140">
<div class="header-play"> 
<div id="game-info"></div>
</div>


<div id = init2> 
<div class="game-play">

<div class="your-profile"> 
  <div class="text-you"> YOU </div>
  <div id="circle-blue"> </div>
  <div id="your-name"> </div>
  <div id="your-score"> Score: 0 </div>
  <div id="your-rank"> Rank </div>
</div>

<div class="play-zone">
  <div id="game-board"></div>
  <div id="below-zone"> <button class="button-below" onclick=view.startFinding() id="find-match"> Find Match </button> </div>
</div>

<div class="rival-profile">
  <div class="text-rival"> RIVAL </div>
  <div id="circle-red"> </div>
  <div class="player" id="rival-name"> Name: ? </div>
  <div id="rival-score"> Score: ? </div>
  <div id="rival-rank"> Rank: ? </div>
</div>


</div>


<div class="leaderboard">

  <div id="text-leadeboard"> Leaderboard </div> 
  <div id="l-table">

  <div id="l-rank"> 
  <div id="text-rank"> Rank </div>
  <div class="rank-stt" id="l-rank1"> #1</div>
  <div class="rank-stt" id="l-rank2"> #2</div>
  <div class="rank-stt" id="l-rank3"> #3</div>
  <div class="rank-stt" id="l-rank4"> #4</div>
  <div class="rank-stt" id="l-rank5"> #5</div>
  <div class="rank-stt" id="l-rank6"> #6</div>
  <div class="rank-stt" id="l-rank7"> #7</div>
  <div class="rank-stt" id="l-rank8"> #8</div>
  <div class="rank-stt" id="l-rank9"> #9</div>
  <div class="rank-stt" id="l-rank10">#10 </div>
  </div>

  <div id="l-name"> 
  <div id="text-name"> Name </div>
  <div class="name-stt" id="l-name1"> </div>
  <div class="name-stt" id="l-name2"> </div>
  <div class="name-stt" id="l-name3"> </div>
  <div class="name-stt" id="l-name4"> </div>
  <div class="name-stt" id="l-name5"> </div>
  <div class="name-stt" id="l-name6"> </div>
  <div class="name-stt" id="l-name7"> </div>
  <div class="name-stt" id="l-name8"> </div>
  <div class="name-stt" id="l-name9"> </div>
  <div class="name-stt" id="l-name10"> </div>
  </div>

  <div id="l-score"> 
  <div id="text-score"> Score </div>
  <div class="score-stt" id="l-score1"> </div>
  <div class="score-stt" id="l-score2"> </div>
  <div class="score-stt" id="l-score3"> </div>
  <div class="score-stt" id="l-score4"> </div>
  <div class="score-stt" id="l-score5"> </div>
  <div class="score-stt" id="l-score6"> </div>
  <div class="score-stt" id="l-score7"> </div>
  <div class="score-stt" id="l-score8"> </div>
  <div class="score-stt" id="l-score9"> </div>
  <div class="score-stt" id="l-score10"> </div>
  </div>

  </div>
  <div> <button id='log-out'> Log Out </button> </div>
  

</div>

</div>
`