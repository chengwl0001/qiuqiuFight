import { SETTING } from "./gameSetting";
export default class GameMgr {
    private gPhysicSpeed         : SETTING.GAME_SPEED       = SETTING.GAME_SPEED.SPEED_1;
    private gMusic               : SETTING.GAME_BGM         = SETTING.GAME_BGM.OPEN; //BGM
    private gCanvasSize          : SIZE_2D;

    private gGameStatus          : SETTING.GAME_STATUS      = SETTING.GAME_STATUS.LOADING;
    private gGameLevel           : SETTING.GAME_LEVEL       = SETTING.GAME_LEVEL.LEVEL_1;
    private gWallRadius          : SETTING.WALL_RADIUS      = SETTING.WALL_RADIUS.WALL_LEVEL_1;
    private gObsSetting          : SETTING.OBSTACLE_SETTING = SETTING.OBSTACLE_GROUP[0];
    private gPlayerSetting       : SETTING.PLAYER_SETTING   = SETTING.PLAYER_GROUP[0];

    private gLinerDamping        : number                   = 0.15;
    private gImpulseFactor       : number                   = 0.5;

    private gLossPercent         : number                   = 1/50;

    private gAbsorbCalibration   : number                   = 1;
    private gMinRaduis           : number                   = 1.5;
    private gMinAbsorbSpeed      : number                   = 0.1;

    private gCameraTweenDuration : number                   = 1;

    private static _Inst: GameMgr;

    public static Inst() {
        if (!this._Inst) {
            this._Inst = new GameMgr();
        }
        return this._Inst;
    }

    get bgm() { return this.gMusic };
    set bgm(val: SETTING.GAME_BGM) { this.gMusic = val };

    get canvasSize() { return this.gCanvasSize };
    set canvasSize(val: SIZE_2D) { this.gCanvasSize = val };

    get gameLevel() { return this.gGameLevel };
    set gameLevel(val: SETTING.GAME_LEVEL) { this.gGameLevel = val };

    get wallRadius() { return this.gWallRadius };
    set wallRadius(val: SETTING.WALL_RADIUS) { this.gWallRadius = val };

    get obsSetting() { return this.gObsSetting };
    set obsSetting(val: SETTING.OBSTACLE_SETTING) { this.gObsSetting = val };

    get playerSetting() { return this.gPlayerSetting };
    set playerSetting(val: SETTING.PLAYER_SETTING) { this.gPlayerSetting = val };

    get gameStatus() { return this.gGameStatus };
    set gameStatus(val: SETTING.GAME_STATUS) { this.gGameStatus = val };

    get linerDamping() { return this.gLinerDamping };
    get impulseFactor() { return this.gImpulseFactor };
    get lossPercent() { return this.gLossPercent };

    get absorbCalibration() { return this.gAbsorbCalibration };
    get minRaduis() { return this.gMinRaduis };
    get minAbsorbSpeed() { return this.gMinAbsorbSpeed };
    get cameraTweenDuration() { return this.gCameraTweenDuration };

}

interface SIZE_2D {
    width: number;
    height: number;
}