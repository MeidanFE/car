import GameManager from "./GameManager";
import Player from "./Player";
import StartPanel from "./StartPanel";

export default class PausePanel extends Laya.Script {
  constructor() {
    super();
  }

  onAwake() {
    Laya.loader.load(
      "font.ttf",
      Laya.Handler.create(this, this.onFontLoad),
      null,
      Laya.Loader.TTF
    );

    this.owner
      .getChildByName("btn_Home")
      .on(Laya.Event.CLICK, this, function () {
        Laya.timer.resume();
        (this.owner as Laya.Sprite).visible = false;
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
        (this.owner as Laya.Sprite).visible = false;
        // Laya.stage.event("StartGame");
        this.owner.parent.getChildByName("GamePanel").visible = true;
        this.owner.parent
          .getChildByName("Player")
          .getComponent(Player).isStartGame = true;
      });

    this.owner
      .getChildByName("btn_Restart")
      .on(Laya.Event.CLICK, this, function () {
        Laya.timer.resume();
        Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
        (this.owner as Laya.Sprite).visible = false;
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
      (this.owner as Laya.Sprite).visible = true;
    });

    Laya.stage.on("Mute", this, this.IsMute);
  }

  IsMute(value) {
    if (value) {
      (this.owner.getChildByName("btn_AudioOn") as Laya.Sprite).visible = false;
      (this.owner.getChildByName("btn_AudioOff") as Laya.Sprite).visible = true;
    } else {
      (this.owner.getChildByName("btn_AudioOn") as Laya.Sprite).visible = true;
      (this.owner.getChildByName(
        "btn_AudioOff"
      ) as Laya.Sprite).visible = false;
    }
  }

  onFontLoad(font) {
    (this.owner.getChildByName("txt_Pause") as Laya.Text).font = font.fontName;
  }
}
