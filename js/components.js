const components = {}
components.loginScreen = `
<div class="left-side">
<h1>Connect 4 Online </h1>
<p>Don't have account. <span id="register-text-button"> Register </span></p>
</div>
<div class="right-side">
<div class="welcome">Welcome here!</div>
<form id="login-form">
    <input type="text" name="nickName" placeholder="Nick name"> <br> <br>
    <input type="password" name="password" placeholder="Password"> <br> <br>
    <button class="btn" type="submit"> Login </button>
</form>
</div>

`
components.registerScreen = `
<div class="left-side">
<h1>Connect 4 Online </h1>
</div>
<div class="right-side">
<div class="welcome">Welcome here!</div>
<form id="register-form">
    <input type="text" name="nickName" placeholder="Nick name"> <br> <br>
    <input type="text" name="email" placeholder="Email"> <br> <br>
    <input type="password" name="password" placeholder="Password"> <br> <br>
    <button class="btn" type="submit"> Register </button>
</form>
</div>

`

components.playScreen = `
<div class="game-play">

<div class="player1-zone"> 

  <div class="player"> Player 1 </div>
</div>

<div class="play-zone">
  <div class="game-info"></div>
  <div id="game-board"></div>
  <button class="buttton-below"> Find Match </button>
</div>

<div class="player2-zone">
  <div class="player"> Player 2 </div>
</div>

</div>
<div class="leaderboard">
  <h2>Leaderboard </h2> 
  <div class="rank"> Rank </div>
  <div class="name"> Name </div>
  <div class="score"> Score </div>
</div>
`