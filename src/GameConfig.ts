/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import AutoMove from "./AutoMove"
import StartPanel from "./StartPanel"
import Player from "./Player"
import GameManager from "./GameManager"
import GamePanel from "./GamePanel"
import PausePanel from "./PausePanel"
import GameOverPanel from "./GameOverPanel"
import Car from "./Car"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1080;
    static height:number=1920;
    static scaleMode:string="showall";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Main.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("AutoMove.ts",AutoMove);
        reg("StartPanel.ts",StartPanel);
        reg("Player.ts",Player);
        reg("GameManager.ts",GameManager);
        reg("GamePanel.ts",GamePanel);
        reg("PausePanel.ts",PausePanel);
        reg("GameOverPanel.ts",GameOverPanel);
        reg("Car.ts",Car);
    }
}
GameConfig.init();