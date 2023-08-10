import { _decorator, Component, Input, EventTouch, Vec2, Vec3, view } from 'cc';
import { obstacleCtr } from './obstacleCtr';
import { playerCtr } from './playerCtr';
import { wallCtr } from './wallCtr';
import { cameraCtr } from './cameraCtr';
import { SETTING } from '../core/gameSetting';
import Utils from '../core/utils';
import { DataManager } from '../core/global';
import { phyiscalCtr } from './phyiscalCtr';

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

    private inputEvent: Input;
    private phyiscalCtr: phyiscalCtr;
    start() {
        Utils.initLog('main start');
        DataManager.canvasSize = view.getVisibleSizeInPixel();
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
        this.inputEvent = new Input();
    }

    private gameStart(): void {
        Utils.initLog('game start');
        Utils.setSettingByLevel(DataManager.gameLevel);

        DataManager.gameStatus = SETTING.GAME_STATUS.GAMING;
        this.obstacleCtr?.startGame();
        this.wallCtr?.startGame();
        this.playerCtr?.startGame();
        this.cameraCtr.startGame();
        this.inputEvent.on(Input.EventType.TOUCH_START, this.touchStart, this);
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

        this.obstacleCtr?.endGame();
        this.inputEvent.off(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    private touchStart(event: EventTouch): void {
        if(DataManager.gameStatus === SETTING.GAME_STATUS.GAMING) {
            this.playerCtr.clickEvent(event.touch.getLocation())
        }
    }

    update(deltaTime: number) {
        
    }
}

