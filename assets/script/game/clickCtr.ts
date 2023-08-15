import { _decorator, Component, Input, EventTouch, EventMouse } from 'cc';
import { main } from './main';
import { DataManager } from '../core/global';
import { SETTING } from '../core/gameSetting';
const { ccclass, property } = _decorator;

@ccclass('clickCtr')
export class clickCtr extends Component {
    private gameCtr: main;

    constructor(gameCtr: main) {
        super();
        this.gameCtr = gameCtr;
    }
    public startGame(): void {
        this.gameCtr.uiCtr.node.on(Input.EventType.TOUCH_START, this.click, this);
        this.gameCtr.uiCtr.node.on(Input.EventType.MOUSE_WHEEL, this.wheel, this);
    }

    public endGame(): void {
        this.gameCtr.uiCtr.node.off(Input.EventType.TOUCH_START, this.click, this);
        this.gameCtr.uiCtr.node.off(Input.EventType.MOUSE_WHEEL, this.wheel, this);
    }

    private click(event: EventTouch): void {
        if(DataManager.gameStatus === SETTING.GAME_STATUS.GAMING) {
            this.gameCtr.playerCtr.clickEvent(event.touch.getLocation());
        }
    }

    private wheel(event: EventMouse): void {
        this.gameCtr.cameraCtr.changeCameraHeight(-event.getScrollY() / 40, SETTING.CAMERA_CHANGE_TYPE.BY_DIF);
    }
}

