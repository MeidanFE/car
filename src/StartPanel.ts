export default class StartPanel extends Laya.Script {
  /** @prop {name:btn_Play, tips:"开始按钮", type:Node, default:null} */
  public btn_Play: Laya.Sprite = null;
  /** @prop {name:btn_AudioOn, tips:"播放按钮", type:Node, default:null} */
  public btn_AudioOn: Laya.Sprite = null;
  /** @prop {name:btn_AudioOff, tips:"暂停按钮", type:Node, default:null} */
  public btn_AudioOff: Laya.Sprite = null;

  constructor() {
    super();
  }

  onAwake(): void {
    this.btn_Play.on(Laya.Event.CLICK, this, this.btnPlayClick);
    this.btn_AudioOn.on(Laya.Event.CLICK, this, this.btnAudioOnClick);
    this.btn_AudioOff.on(Laya.Event.CLICK, this, this.btnAudioOffClick);
    Laya.stage.on("Mute", this, this.IsMute);
  }

  btnPlayClick() {
    (this.owner as Laya.Sprite).visible = false;
    Laya.stage.event("StartGame");
    Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
    // console.log("btnPlayClick");
  }
  btnAudioOnClick() {
    this.btn_AudioOff.visible = true;
    this.btn_AudioOn.visible = false;
    Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
    Laya.SoundManager.muted = true;
    // console.log("btnAudioOnClick");
    Laya.stage.event("Mute", true);
  }
  btnAudioOffClick() {
    this.btn_AudioOff.visible = false;
    this.btn_AudioOn.visible = true;
    Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
    Laya.SoundManager.muted = false;
    // console.log("btnAudioOffClick");
    Laya.stage.event("Mute", false);
  }

  HomeButtonClick() {
    (this.owner as Laya.Sprite).visible = true;
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
}
