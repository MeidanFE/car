import GameManager from "./GameManager";
import GamePanel from "./GamePanel";
import Player from "./Player";
import StartPanel from "./StartPanel";

export default class GameOverPanel extends Laya.Script {
  private txt_Score: Laya.Text = null;
  private txt_HighScore: Laya.Text = null;

  constructor() {
    super();
  }

  onAwake() {
    this.txt_Score = this.owner.getChildByName(
      "txt_GameOverScore"
    ) as Laya.Text;

    this.txt_HighScore = this.owner.getChildByName(
      "txt_HighScore"
    ) as Laya.Text;
    Laya.loader.load(
      "font.ttf",
      Laya.Handler.create(this, (font) => {
        (this.owner.getChildByName("txt_GameOver") as Laya.Text).font =
          font.fontName;
        this.txt_Score.font = font.fontName;
        this.txt_HighScore.font = font.fontName;
      }),
      null,
      Laya.Loader.TTF
    );

    (this.owner.getChildByName("btn_Home") as Laya.Button).on(
      Laya.Event.CLICK,
      this,
      function () {
        Laya.timer.resume();
        Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
        let self = this.owner as Laya.Sprite;
        self.visible = false;
        self.parent
          .getChildByName("StartPanel")
          .getComponent(StartPanel)
          .HomeButtonClick();
        self.parent.getComponent(GameManager).HomeButtonClick();
        self.parent.getChildByName("player").getComponent(Player).Reset();
      }
    );

    this.owner
      .getChildByName("btn_Reset")
      .on(Laya.Event.CLICK, this, function () {
        Laya.SoundManager.playSound("Sounds/ButtonClick.ogg", 1);
        Laya.timer.resume();
        (this.owner as Laya.Sprite).visible = false;
        this.owner.parent.getComponent(GameManager).RestartButtonClick();
        Laya.stage.event("StartGame");
        this.owner.parent.getChildByName("player").getComponent(Player).Reset();
      });

    Laya.stage.on("GameOver", this, this.gameOver);
  }

  gameOver() {
    (this.owner as Laya.Sprite).visible = true;
    const currentScore = this.owner.parent
      .getChildByName("GamePanel")
      .getComponent(GamePanel).score;

    this.txt_Score.text = "Score:" + currentScore;
    const hightScore = Number(Laya.LocalStorage.getItem("BestScore"));
    if (currentScore > hightScore) {
      Laya.LocalStorage.setItem("BestScore", currentScore);
      this.txt_HighScore.text = "HightScore:" + currentScore;
    } else {
      this.txt_HighScore.text = "HightScore:" + hightScore;
    }

    Laya.LocalStorage.setItem("LastScore", currentScore);
  }
}
