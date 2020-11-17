export default class GamePanel extends Laya.Script {
  private txt_Best: Laya.Text = null;
  private txt_Last: Laya.Text = null;
  private txt_Score: Laya.Text = null;
  private btn_Pause: Laya.Button = null;

  private score: number = 0;

  constructor() {
    super();
  }

  onAwake() {
    this.txt_Best = this.owner.getChildByName("txt_best") as Laya.Text;
    this.txt_Last = this.owner.getChildByName("txt_last") as Laya.Text;
    this.txt_Score = this.owner.getChildByName("txt_score") as Laya.Text;
    this.btn_Pause = this.owner.getChildByName("btn_Pause") as Laya.Button;
    this.btn_Pause.on(Laya.Event.CLICK, this, this.pauseBtnClick);

    Laya.loader.load(
      "font.ttf",
      Laya.Handler.create(this, this.onFontLoad),
      null,
      Laya.Loader.TTF
    );

    (this.owner as Laya.Sprite).visible = false;
    Laya.stage.on("StartGame", this, function () {
      this.owner.visible = true;
      this.Init();
    });

    Laya.timer.loop(300, this, this.AddScore);
    Laya.stage.on("AddScore", this, this.AddScore);
    Laya.stage.on("GameOver", this, function () {
      (this.owner as Laya.Sprite).visible = false;
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
    if ((this.owner as Laya.Sprite).visible == false) {
      return;
    }
    this.score += score;
    this.txt_Score.text = this.score.toString();
  }

  pauseBtnClick() {
    Laya.timer.pause();
    Laya.stage.event("Pause");
    (this.owner as Laya.Sprite).visible = false;
    Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
  }
}
