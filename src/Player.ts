import Car from "./Car";

export default class Player extends Laya.Script {
  private rig: Laya.RigidBody;

  /** @prop {name:playerMinX, tips:"最小边距", type:number, default:200} */
  public playerMinX: number = 200;
  /** @prop {name:playerMaxX, tips:"最大边距", type:number, default:1780} */
  public playerMaxX: number = 880;

  private isStartGame = false;
  private initXArr = [260, 450, 640, 820];

  constructor() {
    super();
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
  // x  450
  // y  1360
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
      //   console.log("左边");
      force = -1;
    } else {
      force = 1;
      //   console.log("右边");
    }
    this.rig.linearVelocity = { x: force * 6, y: 0 };
    Laya.Tween.to(this.owner, { rotation: force * 25 }, 100);
  }

  mouseUp() {
    this.rig.linearVelocity = { x: 0, y: 0 };
    Laya.Tween.to(this.owner, { rotation: 0 }, 100);
  }

  onUpdate() {
    let self = this.owner as Laya.Sprite;
    if (self.x < this.playerMinX) {
      self.x = this.playerMinX;
    }

    if (self.x > this.playerMaxX) {
      self.x = this.playerMaxX;
    }
  }

  onTriggerEnter(other: Laya.ColliderBase) {
    if (other.label == "Car") {
      Laya.SoundManager.playSound("Sounds/CarCrash.ogg", 1);
      // 游戏结束
      this.isStartGame = false;
      Laya.stage.event("GameOver");
    }

    if (other.label == "Coin") {
      Laya.SoundManager.playSound("Sounds/Bonus.ogg", 1);
      // 获得金币
      other.owner.removeSelf();
      other.owner.getComponent(Car).recover();

      // 加分TODO
      Laya.stage.event("AddScore", 10);
    }
  }

  /**
   * 获取范围内随机数
   * @param min 最小值
   * @param max 最大值
   */
  getRandom(min: number, max: number) {
    var value = Math.random() * (max - min);
    value = Math.round(value);
    return min + value;
  }

  Reset() {
    let self = this.owner as Laya.Sprite;
    const idx = this.getRandom(0, this.initXArr.length - 1);
    self.pos(this.initXArr[idx], 1360);
  }
}
