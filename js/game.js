
function init()
{
  console.log('in init');

  var ratio = 1920 / 1080;

  // const Application = new PIXI.Application;
  let app = new PIXI.Application({
      resize:window,
      width:1920,
      height:1080,
      transparent:false,
      antialias: true,
      autoResize: true,
      //resolution: window.devicePixelRatio,
      resolution:1,
      willReadFrequently:true
  });

  // app.renderer.backgroundColor = 0x23395D;
  app.renderer.autoDensity = true;
  app.renderer.resize(1920,1080)
  //document.body.appendChild(app.view);
  document.getElementById('game-div').appendChild(app.view);

  let gameWidth = app.screen.width;
  let gameHeight = app.screen.height;
  let centerX = app.screen.width/2;
  let centerY = app.screen.height/2;

  let moveButton = false;

  // title
  let style = new PIXI.TextStyle({
      fontFamily: "ARCO",
      fill: "#FFFFFF",
      fontSize: 80,
      fontWeight: "bold",
      align:"center",
      dropShadow:true,
      dropShadowBlur:0,
      stroke:"#FFFFFF",
      strokeThickness:0,
  });

  // buttons text
  let style1 = new PIXI.TextStyle({
      fontFamily: "ARCO",
      fill: "#FFFFFF",
      fontSize: 40,
      fontWeight: "bold",
      align:"center",
      dropShadow:true,
      dropShadowBlur:0,
      stroke:"#FFFFFF",
      strokeThickness:0,
  });

  //player and ai score
  let style2 = new PIXI.TextStyle({
      fontFamily: "Roboto-Regular",
      fill: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
      align:"center",
      dropShadow:true,
      dropShadowBlur:0,
      stroke:"#FFFFFF",
      strokeThickness:0,
  });

  // won lost draw
  let style3 = new PIXI.TextStyle({
      fontFamily: "ARCO",
      fill: "#FF3611",
      fontSize: 60,
      fontWeight: "bold",
      align:"center",
      dropShadow:true,
      dropShadowBlur:0,
      stroke:"#2F40F3",
      strokeThickness:2,
  });


  let buttonWidth = 350;
  let buttonHeight  = 120;
  let buttonRadius = 30;

  let playButtonX = centerX - buttonWidth/2;
  let playButtonY = centerY + 150;

  let bWidth = buttonWidth;
  let bHeight  = buttonHeight;
  let bRadius = buttonRadius;

  let bX = playButtonX;
  let bY = playButtonY;

  let previousChosenPlayer = [];
  let previousChosenComputer = [];
  let playerChosen = [];
  let options = ["rock","paper","scissors"];
  let computerChosen = [];
  let computerSprites = [];

  let rockOption;
  let paperOption;
  let scissorsOption;

  let handSpeed = 8;
  let gravity = 0.1; //0.1
  let r = 0.1;
  let score = 0;
  let scoreCom = 0;

  let textsArr = [];

  let textChoose = undefined;
  let resultElem = undefined;
  let optionSelected = false;

  let isPlayButtonRemoved = false;
  let isHandsMoved = false;
  let shakeSpeed = -20;
  let shakeDistance = 150;
  let shakeCount = 0;
  let maxShakes = 2;
  let stopShake = false;

  addSounds();

  setScreen();

  function setScreen()
  {
    let bg = PIXI.Sprite.from('./Assets/bg.png');
    bg.position.set(0,0);
    app.stage.addChild(bg);
  }

  async function addSounds()
  {
    const bgmusic = await PIXI.sound.Sound.from({
      url: './Assets/Audio/african.mp3',
      loop : true,
    });
    bgmusic.play();

    PIXI.sound.add('lost', './Assets/Audio/gamelost.mp3');
    PIXI.sound.add('won', './Assets/Audio/winner.mp3');

  }

  // Writing a text :

  const gameTitle = new PIXI.Text(" JACK EN POY ! ", style);
  gameTitle.anchor.set(0.5);
  gameTitle.x = centerX;
  gameTitle.y = 50;
  app.stage.addChild(gameTitle);

  gameTitle.scale.x = 0.5;
  gameTitle.scale.y = 0.5;

  // Let's draw the button :

  let playButton = new PIXI.Graphics();
  playButton.beginFill(0x3e494b);
  playButton.lineStyle(4, 0x0, .3);
  playButton.drawRoundedRect(
      playButtonX,
      playButtonY,
      buttonWidth,
      buttonHeight,
      buttonRadius
  );
  playButton.endFill();

  // The text in the button :
  const text2 = new PIXI.Text("SELECT HAND", style1)
  text2.x = playButtonX + buttonWidth/2 - text2.width/2+5;
  text2.y = playButtonY + buttonHeight/2 - text2.height/2;
  app.stage.addChild(playButton);
  app.stage.addChild(text2);

  function createHandOptions()
  {
    var cX = centerX;
    var ypos = centerY+10;
    var dx = 400;

    // Let's make our three sprites here :
    // Rock :
    rockOption = PIXI.Sprite.from('./Assets/rock.png');
    rockOption.anchor.set(0.5);
    app.stage.addChild(rockOption);
    rockOption.width = 80;
    rockOption.height = 150;
    rockOption.position.set(cX-dx,ypos);
    rockOption.alpha = 0;

    // Paper :
    paperOption = PIXI.Sprite.from('./Assets/paper.png');
    paperOption.anchor.set(0.5);
    app.stage.addChild(paperOption);
    paperOption.width = 80;
    paperOption.height = 150;
    paperOption.position.set(cX,ypos);
    paperOption.alpha = 0;

    // Scissors :
    scissorsOption = PIXI.Sprite.from('./Assets/scissors.png');
    scissorsOption.anchor.set(0.5);
    app.stage.addChild(scissorsOption);
    scissorsOption.width = 80;
    scissorsOption.height = 150;
    scissorsOption.position.set(cX+dx,ypos);
    scissorsOption.alpha = 0;

  }

  // Our score :
  let scoreElem = new PIXI.Text(`Your Score : ${score}`, style2);
  scoreElem.x = 10;
  scoreElem.y = 10;
  app.stage.addChild(scoreElem);

  // Computer's score :
  let scoreComputer = new PIXI.Text(`AI Score : ${scoreCom}`, style2);
  scoreComputer.x = gameWidth - scoreComputer.width - 10;
  scoreComputer.y = 10;
  app.stage.addChild(scoreComputer);

  // Let's draw our restart button :
  // Let's draw the button :

  let restartButton = new PIXI.Graphics();
  restartButton.beginFill(0x3e494b);
  restartButton.lineStyle(4, 0x0, .3);
  restartButton.drawRoundedRect(
      bX,
      bY,
      bWidth,
      bHeight,
      bRadius
  );
  restartButton.endFill();
  // The text in the button :
  const text3 = new PIXI.Text("Restart", style1);
  text3.x  = bX + bWidth/2 - text3.width/2;
  text3.y  = bY + bHeight/2 - text3.height/2;

  // Our animation loop :
  app.ticker.add((delta) => {

      if(gameTitle !== undefined) {

        if(gameTitle.scale.x < 1)
        {
          gameTitle.scale.x += 0.02;
          gameTitle.scale.y += 0.02;
          gameTitle.y += 0.5;
        }

      }

      if(resultElem !== undefined && resultElem.visible === true)
      {
        if(resultElem.scale.x < 1)
        {
          resultElem.scale.x += 0.05;
          resultElem.scale.y += 0.05;
          resultElem.y -= 0.2;
        }
      }

      if(moveButton){

          if(isPlayButtonRemoved === false)
          {
            playButton.y += gravity;
            text2.y += gravity;
            gravity += 0.5;
          }

          if(optionSelected === true)
          {
            if(rockOption.alpha > 0) {
              rockOption.alpha -= 0.05;
              rockOption.y += 1;
            }
            if(paperOption.alpha > 0) {
              paperOption.alpha -= 0.05;
              paperOption.y += 1;
            }
            if(scissorsOption.alpha > 0) {
              scissorsOption.alpha -= 0.05;
              scissorsOption.y += 1;
            }

          }
          else {

            if(rockOption && rockOption.alpha < 1) {
              rockOption.alpha += 0.05;
              rockOption.y -= 1;
            }
            if(paperOption && paperOption.alpha < 1) {
              paperOption.alpha += 0.05;
              paperOption.y -= 1;
            }
            if(scissorsOption && scissorsOption.alpha < 1) {
              scissorsOption.alpha += 0.05;
              scissorsOption.y -= 1;
            }

          }
      }
      // When the button gets below the canvas remove it from the screen :
      if(playButton.y >= gameHeight && isPlayButtonRemoved === false) {

        isPlayButtonRemoved = true;

          app.stage.removeChild(playButton);

          textChoose = new PIXI.Text("Choose one !", style1)
          textChoose.x = centerX-textChoose.width/2;
          textChoose.y = playButtonY;
          app.stage.addChild(textChoose);
      }
      for(let everyObj of playerChosen){
          app.stage.addChild(everyObj);
          if((everyObj.rotation > 1.8 || everyObj.rotation < -0.2 )){
              r = -r;
          }
      }
      if(isHandsMoved === false)
      {
        for(let i = 0; i < computerSprites.length; i++){
            if(computerSprites[i].x > centerX+300){
                computerSprites[i].x -= handSpeed;
            }
            if(computerSprites[i].x <= centerX+300) {
              isHandsMoved = true;
            }
        }

        for(let i = 0; i < playerChosen.length; i++){
            if(playerChosen[i].x < centerX-300){
                playerChosen[i].x += handSpeed;
            }
            if(playerChosen[i].x >= centerX-300) {
              isHandsMoved = true;

            }

            if(isHandsMoved === true)
            {
              showRestartButton();
              showResult();
            }
        }

        handSpeed += 0.05;

      }

      if(isHandsMoved === true)
      {

        for(let i = 0; i < computerSprites.length; i++)
        {
            let c_hand = computerSprites[i];
            let p_hand = playerChosen[i];

            if(Math.round(c_hand.y) <= centerY-shakeDistance) {
              shakeSpeed = Math.abs(shakeSpeed);
              shakeCount++;
            }
            else if(Math.round(c_hand.y) >= centerY+shakeDistance) {
              shakeSpeed = -Math.abs(shakeSpeed);
            }

            c_hand.y += shakeSpeed;
            p_hand.y += shakeSpeed;

            if(shakeCount >= maxShakes)
            {
              stopShake = true;
              shakeSpeed = 0;
            }

            if(stopShake === true)
            {
              if(c_hand.y < centerY)
              {
                c_hand.y += 20;
                p_hand.y += 20;
              }

            }

        }

      }

      for(let i = 0; i < previousChosenPlayer.length; i++){
              // previousChosenPlayer[i].x -= 10
      }
      for(let i = 0; i < previousChosenComputer.length; i++){
          // previousChosenComputer[i].x += 10
      }
      app.stage.children.forEach(function(child){
          if(child.d){
              child.destroy(true);
          }
      });
  });

  resize();                               // Interactiveness here :

  let i = 0;
  let j = 0;
  let k = 0;

  function onRockClick()
  {
    hideHandOptions();

    // Chossing a random option for our computer :
    let randomOption = options[Math.floor(Math.random() * options.length)];
    let comOption = addComputerOption(randomOption);

    // Displaying what our player chose :
    let rock = addPlayerHand('./Assets/Player/rock-player.png');

    if(randomOption == "rock") {
      console.log("This is draw !!!");
      addResultTxt("Draw",'draw');
    }
    else if(randomOption == "scissors"){
        addResultTxt("You Won !!!",'won');
    }
    else if(randomOption == "paper"){
        addResultTxt("You Lost !!!",'lost');
    }

    if(i > 0){
        // previousChosenPlayer.push(rock);
        // previousChosenComputer.push(comOption);
    }

    if(k <= 0){
    }
    i++;

  }
  function onPaperClick()
  {
    hideHandOptions();

    // Chossing a random option for our computer :
    let randomOption = options[Math.floor(Math.random() * options.length)];
    let comOption = addComputerOption(randomOption);
    let paper = addPlayerHand('./Assets/Player/paper-player.png');

    if(randomOption == "rock") {
        addResultTxt("You Won !!!",'won');
    }
    else if(randomOption == "scissors") {
        addResultTxt("You Lost !!!",'lost');
    }
    else if(randomOption == "paper") {
        app.stage.addChild(text2);
        console.log("This is draw !!!");
        addResultTxt("Draw",'draw');
    }

    if(j > 0) {
        // previousChosenPlayer.push(paper);
        // previousChosenComputer.push(comOption);
    }

    if(k <= 0){
    }

    j++;

    //app.stage.addChild(paper);
  }
  function onScissorsClick()
  {
    hideHandOptions();

    // Chossing a random option for our computer :
    let randomOption = options[Math.floor(Math.random() * options.length)];
    let comOption = addComputerOption(randomOption);
    let scissors = addPlayerHand('./Assets/Player/scissors-player.png');

    if(randomOption == "rock") {
        addResultTxt("You Lost !!!",'lost');
    }
    else if(randomOption == "scissors") {
        app.stage.addChild(text2);
        console.log("This is draw !!!");
        addResultTxt("Draw",'draw');
    }
    else if(randomOption == "paper") {
        addResultTxt("You Won !!!",'won');
    }
    if(k > 0){
        // previousChosenPlayer.push(scissors);
        // previousChosenComputer.push(comOption);
    }

    if(k <= 0){
    }

    k++;
  }

  /*----------------------------------------------------------------------------*/

  addButtonEvents();
  function addPlayerHand(str)
  {
    let playerHand = PIXI.Sprite.from(str);
    playerHand.anchor.set(0.5);
    playerHand.width = 150;
    playerHand.height = 80;
    // playerHand.d = true;
    playerHand.position.set(-100,centerY);
    // playerHand.rotation -= 10.5;
    // To move the player sprite :
    playerChosen.push(playerHand);

    for(let i = 0; i < previousChosenPlayer.length; i++){
        app.stage.removeChild(previousChosenPlayer[i]);
        // previousChosenPlayer[i].destroy(true);
    }

    previousChosenPlayer.push(playerHand);
    return playerHand;
  }
  function addComputerOption(randomOption)
  {
    computerChosen.push(randomOption);
    // Displaying what our computer chose :
    let comOption = PIXI.Sprite.from(`./Assets/Computer/${randomOption}-computer.png`);
    comOption.anchor.set(0.5);
    comOption.width = 150;
    comOption.height = 80
    comOption.position.set(gameWidth + 100,centerY);
    // For moving the computer computerSprites;
    computerSprites.push(comOption);
    app.stage.addChild(comOption);

    for(let i = 0; i < previousChosenComputer.length; i++){
        app.stage.removeChild(previousChosenComputer[i]);
    }

    previousChosenComputer.push(comOption);

    return comOption;
  }

  function addResultTxt(str,winType='')
  {
    console.log(str);

    for(let i = 0; i < textsArr.length; i++) {
        app.stage.removeChild(textsArr[i]);
    }

    resultElem = new PIXI.Text(str, style3);
    resultElem.anchor.set(0.5);
    resultElem.x = centerX;
    resultElem.y = centerY-150;
    textsArr.push(resultElem);
    app.stage.addChild(resultElem);

    resultElem.visible = false;

    if(winType === 'won') {

      PIXI.sound.play('won');
      score++;
      scoreElem.text = `Your Score : ${score}`;
    }
    else if(winType === 'lost') {

      PIXI.sound.play('lost');
      scoreCom++;
      scoreComputer.text = `AI Score : ${scoreCom}`;
    }

  }
  function showResult()
  {
    resultElem.visible = true;
    resultElem.scale.x = 0.5;
    resultElem.scale.y = 0.5;
  }
  function showRestartButton()
  {
    app.stage.addChild(restartButton);
    app.stage.addChild(text3);
  }
  function addButtonEvents()
  {
    playButton.interactive = true;
    playButton.cursor = 'pointer';
    playButton.on("pointerdown",function () {

        moveButton = true;
        createHandOptions();
        addHandEvents();
    });

    // Restarting the game :
    // First the making the restart button interactive :
    restartButton.interactive = true;
    restartButton.cursor = 'pointer';
    restartButton.on("pointerdown",function (){
        console.log("Reload the game !!!")
        location.reload();
    });
  }
  function addHandEvents()
  {
    rockOption.interactive = true;
    paperOption.interactive = true;
    scissorsOption.interactive = true;

    rockOption.cursor = 'pointer';
    paperOption.cursor = 'pointer';
    scissorsOption.cursor = 'pointer';

    rockOption.on("pointerdown",onRockClick);
    paperOption.on("pointerdown",onPaperClick);
    scissorsOption.on("pointerdown",onScissorsClick);
  }
  function hideHandOptions()
  {
    textChoose.visible = false;
    optionSelected = true;

    rockOption.interactive = false;
    paperOption.interactive =  false;
    scissorsOption.interactive = false;

    //rockOption.visible = false;
    //paperOption.visible = false;
    //scissorsOption.visible = false;
  }

  function resize()
  {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }

    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = h + 'px';

    let hGap = window.innerHeight - h;
    app.renderer.view.style.marginTop = hGap/2 + 'px';

  }

  window.addEventListener('resize', resize);

} /*init*/
