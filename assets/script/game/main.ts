import { _decorator, Component, view, screen } from 'cc';
import { obstacleCtr } from './obstacleCtr';
import { playerCtr } from './playerCtr';
import { wallCtr } from './wallCtr';
import { cameraCtr } from './cameraCtr';
import { SETTING } from '../core/gameSetting';
import Utils from '../core/utils';
import { DataManager, EventManager } from '../core/global';
import { phyiscalCtr } from './phyiscalCtr';
import { clickCtr } from './clickCtr';

const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(obstacleCtr)
    public obstacleCtr: obstacleCtr;

    @property(playerCtr)
    public playerCtr: playerCtr;

    @property(wallCtr)
    public wallCtr: wallCtr;

    @property(cameraCtr)
    public cameraCtr: cameraCtr;

    private phyiscalCtr: phyiscalCtr;
    private clickCtr: clickCtr;
    start() {
        Utils.initLog('main start');
        DataManager.canvasPixelSize = view.getVisibleSizeInPixel();
        DataManager.canvasSize = view.getVisibleSize();
        this.controlInit();
        setTimeout(() => {
            this.gameStart();
        },1000)

    }

    private controlInit(): void {
        this.cameraCtr?.initCamera();
        this.obstacleCtr?.initObs();
        this.wallCtr?.initWall();
        this.playerCtr?.initPlayer(this);
        this.phyiscalCtr = new phyiscalCtr(this);
        this.clickCtr = new clickCtr(this);
    }

    private gameStart(): void {
        Utils.initLog('game start');
        DataManager.gameLevel = SETTING.GAME_LEVEL.LEVEL_1;
        Utils.setSettingByLevel(DataManager.gameLevel);

        EventManager.once(SETTING.GAME_EVENT_TYPE.GAME_OVER, this.gameOver, this);

        DataManager.gameStatus = SETTING.GAME_STATUS.GAMING;
        this.obstacleCtr?.startGame();
        this.wallCtr?.startGame();
        this.playerCtr?.startGame();
        this.cameraCtr.startGame();
        this.clickCtr?.startGame();
    }

    public gamePause(): void {
        DataManager.gameStatus = SETTING.GAME_STATUS.PAUSE;
        this.phyiscalCtr?.pausePhysical();
    }

    public gameRestart(): void {
        DataManager.gameStatus = SETTING.GAME_STATUS.GAMING;
        this.phyiscalCtr?.startPhysical();
    }

    public gameOver(): void {
        Utils.initLog('game over');
        DataManager.gameStatus = SETTING.GAME_STATUS.OVER;

        this.playerCtr?.endGame();
        this.obstacleCtr?.endGame();
        this.clickCtr?.endGame();
        this.cameraCtr?.endGame();
    }

    update(deltaTime: number) {
        
    }
}

