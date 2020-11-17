(function () {
  'use strict';

  class AutoMove extends Laya.Script {
      constructor() {
          super();
          this.moveSpeed = 20;
      }
      onAwake() {
          Laya.timer.frameLoop(1, this, this.frameLoop);
      }
      frameLoop() {
          const self = this.owner;
          self.y += this.moveSpeed;
          if (self.y > 1920) {
              self.y = -1920;
          }
      }
  }

  class StartPanel extends Laya.Script {
      constructor() {
          super();
          this.btn_Play = null;
          this.btn_AudioOn = null;
          this.btn_AudioOff = null;
      }
      onAwake() {
          this.btn_Play.on(Laya.Event.CLICK, this, this.btnPlayClick);
          this.btn_AudioOn.on(Laya.Event.CLICK, this, this.btnAudioOnClick);
          this.btn_AudioOff.on(Laya.Event.CLICK, this, this.btnAudioOffClick);
          Laya.stage.on("Mute", this, this.IsMute);
      }
      btnPlayClick() {
          this.owner.visible = false;
          Laya.stage.event("StartGame");
          Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
      }
      btnAudioOnClick() {
          this.btn_AudioOff.visible = true;
          this.btn_AudioOn.visible = false;
          Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
          Laya.SoundManager.muted = true;
          Laya.stage.event("Mute", true);
      }
      btnAudioOffClick() {
          this.btn_AudioOff.visible = false;
          this.btn_AudioOn.visible = true;
          Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
          Laya.SoundManager.muted = false;
          Laya.stage.event("Mute", false);
      }
      HomeButtonClick() {
          this.owner.visible = true;
      }
      IsMute(value) {
          if (value) {
              this.owner.getChildByName("btn_AudioOn").visible = false;
              this.owner.getChildByName("btn_AudioOff").visible = true;
          }
          else {
              this.owner.getChildByName("btn_AudioOn").visible = true;
              this.owner.getChildByName("btn_AudioOff").visible = false;
          }
      }
  }

  class Car extends Laya.Script {
      constructor() {
          super();
          this.speed = 15;
      }
      Init(sign) {
          this.sign = sign;
      }
      onAwake() {
          Laya.timer.frameLoop(1, this, this.frameLoop);
      }
      frameLoop() {
          this.owner.y += this.speed;
      }
      onTriggerExit(other) {
          if (other.label == "BottomCollider") {
              this.owner.removeSelf();
              this.recover();
          }
      }
      recover() {
          Laya.Pool.recover(this.sign, this.owner);
      }
  }

  class Player extends Laya.Script {
      constructor() {
          super();
          this.playerMinX = 200;
          this.playerMaxX = 880;
          this.isStartGame = false;
          this.initXArr = [260, 450, 640, 820];
      }
      onAwake() {
          Laya.SoundManager.playMusic("Sounds/FutureWorld_Dark_Loop_03.ogg", 0);
          Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
          Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
          this.rig = this.owner.getComponent(Laya.RigidBody);
          Laya.stage.on("StartGame", this, function () {
              this.isStartGame = true;
          });
          Laya.stage.on("Pause", this, function () {
              this.isStartGame = false;
          });
          this.Reset();
      }
      mouseDown() {
          if (!this.isStartGame) {
              return;
          }
          if (Laya.stage.mouseY <= 500) {
              return;
          }
          const mouseX = Laya.stage.mouseX;
          let force = 0;
          if (mouseX < Laya.stage.width / 2) {
              force = -1;
          }
          else {
              force = 1;
          }
          this.rig.linearVelocity = { x: force * 6, y: 0 };
          Laya.Tween.to(this.owner, { rotation: force * 25 }, 100);
      }
      mouseUp() {
          this.rig.linearVelocity = { x: 0, y: 0 };
          Laya.Tween.to(this.owner, { rotation: 0 }, 100);
      }
      onUpdate() {
          let self = this.owner;
          if (self.x < this.playerMinX) {
              self.x = this.playerMinX;
          }
          if (self.x > this.playerMaxX) {
              self.x = this.playerMaxX;
          }
      }
      onTriggerEnter(other) {
          if (other.label == "Car") {
              Laya.SoundManager.playSound("Sounds/CarCrash.ogg", 1);
              this.isStartGame = false;
              Laya.stage.event("GameOver");
          }
          if (other.label == "Coin") {
              Laya.SoundManager.playSound("Sounds/Bonus.ogg", 1);
              other.owner.removeSelf();
              other.owner.getComponent(Car).recover();
              Laya.stage.event("AddScore", 10);
          }
      }
      getRandom(min, max) {
          var value = Math.random() * (max - min);
          value = Math.round(value);
          return min + value;
      }
      Reset() {
          let self = this.owner;
          const idx = this.getRandom(0, this.initXArr.length - 1);
          self.pos(this.initXArr[idx], 1360);
      }
  }

  class GameManager extends Laya.Script {
      constructor() {
          super();
          this.carPrefabArr = [];
          this.spawnCarArr = [];
          this.isStartGame = false;
      }
      onAwake() {
          Laya.stage.on("StartGame", this, () => {
              this.isStartGame = true;
          });
          Laya.stage.on("GameOver", this, this.gameOver);
          this.loadCarPrefab();
      }
      loadCarPrefab() {
          const pathArr = [
              "prefab/Car_01.json",
              "prefab/Car_02.json",
              "prefab/Car_03.json",
              "prefab/Car_04.json",
              "prefab/Car_05.json",
              "prefab/Car_05.json",
              "prefab/Coin.json",
          ];
          const infoArr = [];
          for (let i = 0; i < pathArr.length; i++) {
              infoArr.push({ url: pathArr[i], type: Laya.Loader.PREFAB });
          }
          Laya.loader.load(infoArr, Laya.Handler.create(this, function () {
              for (let i = 0; i < pathArr.length; i++) {
                  this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
              }
              this.ranTime = this.getRandom(500, 1000);
              Laya.timer.loop(this.ranTime, this, function () {
                  this.spawn();
                  this.ranTime = this.getRandom(500, 1000);
              });
          }));
      }
      spawn() {
          if (!this.isStartGame)
              return;
          const arrX = [260, 450, 640, 820];
          const y = -300;
          const index = this.getRandom(0, arrX.length - 1);
          const x = arrX[index];
          this.typeIndex = this.getRandom(0, this.carPrefabArr.length - 1);
          const car = Laya.Pool.getItemByCreateFun(this.typeIndex.toString(), function () {
              return this.carPrefabArr[this.typeIndex].create();
          }, this);
          Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
          this.spawnCarArr.push(car);
          car.pos(x, y);
          car.getComponent(Car).Init(this.typeIndex.toString());
      }
      gameOver() {
          this.isStartGame = false;
          for (let i = 0; i < this.spawnCarArr.length; i++) {
              const car = this.spawnCarArr[i];
              car.removeSelf();
          }
      }
      getRandom(min, max) {
          let value = Math.random() * (max - min);
          value = Math.round(value);
          return min + value;
      }
      HomeButtonClick() {
          this.gameOver();
      }
      RestartButtonClick() {
          for (let i = 0; i < this.spawnCarArr.length; i++) {
              const car = this.spawnCarArr[i];
              car.removeSelf();
          }
      }
  }

  class GamePanel extends Laya.Script {
      constructor() {
          super();
          this.txt_Best = null;
          this.txt_Last = null;
          this.txt_Score = null;
          this.btn_Pause = null;
          this.score = 0;
      }
      onAwake() {
          this.txt_Best = this.owner.getChildByName("txt_best");
          this.txt_Last = this.owner.getChildByName("txt_last");
          this.txt_Score = this.owner.getChildByName("txt_score");
          this.btn_Pause = this.owner.getChildByName("btn_Pause");
          this.btn_Pause.on(Laya.Event.CLICK, this, this.pauseBtnClick);
          Laya.loader.load("font.ttf", Laya.Handler.create(this, this.onFontLoad), null, Laya.Loader.TTF);
          this.owner.visible = false;
          Laya.stage.on("StartGame", this, function () {
              this.owner.visible = true;
              this.Init();
          });
          Laya.timer.loop(300, this, this.AddScore);
          Laya.stage.on("AddScore", this, this.AddScore);
          Laya.stage.on("GameOver", this, function () {
              this.owner.visible = false;
          });
      }
      Init() {
          this.txt_Last.text = "Last:" + Laya.LocalStorage.getItem("LastScore");
          this.txt_Best.text = "Best:" + Laya.LocalStorage.getItem("BestScore");
          this.txt_Score.text = "0";
          this.score = 0;
      }
      onFontLoad(font) {
          console.log(font);
          this.txt_Best.font = font.fontName;
          this.txt_Last.font = font.fontName;
          this.txt_Score.font = font.fontName;
      }
      AddScore(score = 1) {
          if (this.owner.visible == false) {
              return;
          }
          this.score += score;
          this.txt_Score.text = this.score.toString();
      }
      pauseBtnClick() {
          Laya.timer.pause();
          Laya.stage.event("Pause");
          this.owner.visible = false;
          Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
      }
  }

  class PausePanel extends Laya.Script {
      constructor() {
          super();
      }
      onAwake() {
          Laya.loader.load("font.ttf", Laya.Handler.create(this, this.onFontLoad), null, Laya.Loader.TTF);
          this.owner
              .getChildByName("btn_Home")
              .on(Laya.Event.CLICK, this, function () {
              Laya.timer.resume();
              this.owner.visible = false;
              this.owner.parent
                  .getChildByName("StartPanel")
                  .getComponent(StartPanel)
                  .HomeButtonClick();
              this.owner.parent.getComponent(GameManager).HomeButtonClick();
          });
          this.owner
              .getChildByName("btn_Close")
              .on(Laya.Event.CLICK, this, function () {
              Laya.timer.resume();
              Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
              this.owner.visible = false;
              this.owner.parent.getChildByName("GamePanel").visible = true;
          });
          this.owner
              .getChildByName("btn_Restart")
              .on(Laya.Event.CLICK, this, function () {
              Laya.timer.resume();
              Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
              this.owner.visible = false;
              this.owner.parent.getComponent(GameManager).RestartButtonClick();
              Laya.stage.event("StartGame");
              this.owner.parent.getChildByName("player").getComponent(Player).Reset();
          });
          this.owner
              .getChildByName("btn_AudioOn")
              .on(Laya.Event.CLICK, this, function () {
              this.owner.getChildByName("btn_AudioOn").visible = false;
              this.owner.getChildByName("btn_AudioOff").visible = true;
              Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
              Laya.SoundManager.muted = true;
              Laya.stage.event("Mute", true);
          });
          this.owner
              .getChildByName("btn_AudioOff")
              .on(Laya.Event.CLICK, this, function () {
              this.owner.getChildByName("btn_AudioOn").visible = true;
              this.owner.getChildByName("btn_AudioOff").visible = false;
              Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
              Laya.SoundManager.muted = false;
              Laya.stage.event("Mute", false);
          });
          Laya.stage.on("Pause", this, function () {
              Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
              this.owner.visible = true;
          });
          Laya.stage.on("Mute", this, this.IsMute);
      }
      IsMute(value) {
          if (value) {
              this.owner.getChildByName("btn_AudioOn").visible = false;
              this.owner.getChildByName("btn_AudioOff").visible = true;
          }
          else {
              this.owner.getChildByName("btn_AudioOn").visible = true;
              this.owner.getChildByName("btn_AudioOff").visible = false;
          }
      }
      onFontLoad(font) {
          this.owner.getChildByName("txt_Pause").font = font.fontName;
      }
  }

  class GameOverPanel extends Laya.Script {
      constructor() {
          super();
          this.txt_Score = null;
          this.txt_HighScore = null;
      }
      onAwake() {
          this.txt_Score = this.owner.getChildByName("txt_GameOverScore");
          this.txt_HighScore = this.owner.getChildByName("txt_HighScore");
          Laya.loader.load("font.ttf", Laya.Handler.create(this, (font) => {
              this.owner.getChildByName("txt_GameOver").font =
                  font.fontName;
              this.txt_Score.font = font.fontName;
              this.txt_HighScore.font = font.fontName;
          }), null, Laya.Loader.TTF);
          this.owner.getChildByName("btn_Home").on(Laya.Event.CLICK, this, function () {
              Laya.timer.resume();
              Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
              let self = this.owner;
              self.visible = false;
              self.parent
                  .getChildByName("StartPanel")
                  .getComponent(StartPanel)
                  .HomeButtonClick();
              self.parent.getComponent(GameManager).HomeButtonClick();
              self.parent.getChildByName("player").getComponent(Player).Reset();
          });
          this.owner
              .getChildByName("btn_Reset")
              .on(Laya.Event.CLICK, this, function () {
              Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
              Laya.timer.resume();
              this.owner.visible = false;
              this.owner.parent.getComponent(GameManager).RestartButtonClick();
              Laya.stage.event("StartGame");
              this.owner.parent.getChildByName("player").getComponent(Player).Reset();
          });
          Laya.stage.on("GameOver", this, this.gameOver);
      }
      gameOver() {
          this.owner.visible = true;
          const currentScore = this.owner.parent
              .getChildByName("GamePanel")
              .getComponent(GamePanel).score;
          this.txt_Score.text = "Score:" + currentScore;
          const hightScore = Number(Laya.LocalStorage.getItem("BestScore"));
          if (currentScore > hightScore) {
              Laya.LocalStorage.setItem("BestScore", currentScore);
              this.txt_HighScore.text = "HightScore:" + currentScore;
          }
          else {
              this.txt_HighScore.text = "HightScore:" + hightScore;
          }
          Laya.LocalStorage.setItem("LastScore", currentScore);
      }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("AutoMove.ts", AutoMove);
          reg("StartPanel.ts", StartPanel);
          reg("Player.ts", Player);
          reg("GameManager.ts", GameManager);
          reg("GamePanel.ts", GamePanel);
          reg("PausePanel.ts", PausePanel);
          reg("GameOverPanel.ts", GameOverPanel);
          reg("Car.ts", Car);
      }
  }
  GameConfig.width = 1080;
  GameConfig.height = 1920;
  GameConfig.scaleMode = "showall";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "top";
  GameConfig.alignH = "left";
  GameConfig.startScene = "Main.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  class Main {
      constructor() {
          if (window["Laya3D"])
              Laya3D.init(GameConfig.width, GameConfig.height);
          else
              Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
          Laya["Physics"] && Laya["Physics"].enable();
          Laya["DebugPanel"] && Laya["DebugPanel"].enable();
          Laya.stage.scaleMode = GameConfig.scaleMode;
          Laya.stage.screenMode = GameConfig.screenMode;
          Laya.stage.alignV = GameConfig.alignV;
          Laya.stage.alignH = GameConfig.alignH;
          Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
          if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
              Laya.enableDebugPanel();
          if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
              Laya["PhysicsDebugDraw"].enable();
          if (GameConfig.stat)
              Laya.Stat.show();
          Laya.alertGlobalError(true);
          Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
      }
      onVersionLoaded() {
          Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
      }
      onConfigLoaded() {
          GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
      }
  }
  new Main();

}());
