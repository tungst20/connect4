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
<div class="tutorial"> 
</div>
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
<div class="tutorial"> 
</div>
</div>
`

components.playScreen = `
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
  <div class="game-info" id="game-info"></div>
  <div id="game-board"></div>
  <div id="test"> <button class="button-below" onclick=view.startFinding() id="find-match"> Find Match </button> </div>
</div>

<div class="rival-profile">
  <div class="text-rival"> RIVAL </div>

  <div class="player" id="rival-name"> Name: ? </div>
  <div id="rival-score"> Score: ? </div>
  <div id="rival-rank"> Rank: ? </div>
</div>


</div>

<div class="leaderboard">
<button id='log-out'> Log Out </button>

  <h2>Leaderboard </h2> 
  <div class="rank"> Rank </div>
  <div class="name"> Name </div>
  <div id="score"> Score </div> 
</div>

</div>
`