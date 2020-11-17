export default class Car extends Laya.Script {
  /** @prop {name:speed, tips:"速度", type:Int, default:15}*/
  public speed: number = 15;

  private sign: string;

  constructor() {
    super();
  }

  Init(sign) {
    this.sign = sign;
  }

  onAwake() {
    Laya.timer.frameLoop(1, this, this.frameLoop);
  }

  frameLoop() {
    (this.owner as Laya.Sprite).y += this.speed;
  }

  onTriggerExit(other: Laya.ColliderBase) {
    if (other.label == "BottomCollider") {
      this.owner.removeSelf();
      this.recover();
    }
  }

  recover() {
    Laya.Pool.recover(this.sign, this.owner);
  }
}
