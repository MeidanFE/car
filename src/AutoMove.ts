export default class AutoMove extends Laya.Script {
  private moveSpeed: number = 20;

  constructor() {
    super();
  }

  onAwake() {
    Laya.timer.frameLoop(1, this, this.frameLoop);
  }

  frameLoop() {
    const self = this.owner as Laya.Sprite;

    self.y += this.moveSpeed;

    if (self.y > 1920) {
      self.y = -1920;
    }
  }
}
