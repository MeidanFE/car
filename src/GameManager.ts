import Car from "./Car";

export default class GameManager extends Laya.Script {
  private ranTime: number;

  private carPrefabArr: Laya.Prefab[] = [];
  private spawnCarArr: Laya.Node[] = [];
  private typeIndex: number;
  private isStartGame: boolean = false;

  constructor() {
    super();
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
    Laya.loader.load(
      infoArr,
      Laya.Handler.create(this, function () {
        for (let i = 0; i < pathArr.length; i++) {
          this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
        }

        this.ranTime = this.getRandom(500, 1000);
        Laya.timer.loop(this.ranTime, this, function () {
          this.spawn();
          this.ranTime = this.getRandom(500, 1000);
        });
      })
    );
  }

  spawn() {
    if (!this.isStartGame) return;
    const arrX = [260, 450, 640, 820];
    const y = -300;

    const index = this.getRandom(0, arrX.length - 1);
    const x = arrX[index];

    this.typeIndex = this.getRandom(0, this.carPrefabArr.length - 1);
    const car = Laya.Pool.getItemByCreateFun(
      this.typeIndex.toString(),
      function () {
        return this.carPrefabArr[this.typeIndex].create();
      },
      this
    ) as Laya.Sprite;
    Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
    this.spawnCarArr.push(car);
    car.pos(x, y);
    (car.getComponent(Car) as Car).Init(this.typeIndex.toString());
  }

  gameOver() {
    this.isStartGame = false;
    for (let i = 0; i < this.spawnCarArr.length; i++) {
      const car = this.spawnCarArr[i];
      car.removeSelf();
    }
  }

  /**
   * 获取范围内随机数
   * @param min 最小值
   * @param max 最大值
   */
  getRandom(min: number, max: number) {
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
