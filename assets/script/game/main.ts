import Utils from '../core/utils';
import { uiCtr } from './uiCtr';
import { wallCtr } from './wallCtr';
import { SETTING } from '../core/gameSetting';
import { clickCtr } from './clickCtr';
import { cameraCtr } from './cameraCtr';
import { playerCtr } from './playerCtr';
import { obstacleCtr } from './obstacleCtr';
import { phyiscalCtr } from './phyiscalCtr';
import { DataManager, EventManager } from '../core/global';
import { _decorator, Component, view, director, Slider } from 'cc';

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

    @property(uiCtr)
    public uiCtr: uiCtr;

    private phyiscalCtr: phyiscalCtr;
    private clickCtr: clickCtr;
    start() {
        Utils.initLog('main start');
        DataManager.canvasPixelSize = view.getVisibleSizeInPixel();
        DataManager.canvasSize = view.getVisibleSize();
        this.controlInit();
        // setTimeout(() => {
        //     this.gameStart();
        // },1000)

    }

    private controlInit(): void {
        this.uiCtr.init();
        this.cameraCtr?.initCamera();
        this.obstacleCtr?.initObs();
        this.wallCtr?.initWall();
        this.playerCtr?.initPlayer(this);
        this.phyiscalCtr = new phyiscalCtr(this);
        this.clickCtr = new clickCtr(this);
        this.gameStart();
    }

    private gameStart(): void {
        Utils.initLog('game start');
        DataManager.gameLevel = SETTING.GAME_LEVEL.LEVEL_1;
        Utils.setSettingByLevel(DataManager.gameLevel);

        EventManager.once(SETTING.GAME_STATUS_TYPE.GAME_LOSE, this.gameLose, this);
        EventManager.once(SETTING.GAME_STATUS_TYPE.GAME_WIN, this.gameWin, this);

        DataManager.gameStatus = SETTING.GAME_STATUS.GAMING;
        this.uiCtr.startGame();
        this.obstacleCtr?.startGame();
        this.wallCtr?.startGame();
        this.playerCtr?.startGame();
        this.cameraCtr.startGame();
        this.clickCtr?.startGame();
        this.phyiscalCtr?.setPhyiscal();
    }

    public gamePause(): void {
        DataManager.gameStatus = SETTING.GAME_STATUS.PAUSE;
        this.phyiscalCtr?.pausePhysical();
        this.uiCtr.pauseGame();
    }

    public gameRestart(): void {
        DataManager.gameStatus = SETTING.GAME_STATUS.GAMING;
        this.phyiscalCtr?.startPhysical();
        this.uiCtr.startGame();
    }

    private gameLose(): void {
        Utils.initLog('game lose');
        this.uiCtr.loseGame();
        this.gameOver();
    }

    private gameWin(): void {
        Utils.initLog('game win');
        this.uiCtr.winGame();
        this.gameOver();
    }

    private gameOver(): void {
        DataManager.gameStatus = SETTING.GAME_STATUS.OVER;

        this.playerCtr?.endGame();
        this.obstacleCtr?.endGame();
        this.clickCtr?.endGame();
        this.cameraCtr?.endGame();
    }

    public changePhysicalSpeed(event: Slider): void {
        console.log(event.progress)
    }

    public backHome(): void {
        director.loadScene('home');
    }

    update(deltaTime: number) {
    }
}

