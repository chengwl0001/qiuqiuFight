import { _decorator, Component, Input, EventTouch, EventMouse } from 'cc';
import { main } from './main';
import { DataManager } from '../core/global';
import { SETTING } from '../core/gameSetting';
const { ccclass, property } = _decorator;

@ccclass('clickCtr')
export class clickCtr extends Component {
    private gameCtr: main;
    private inputEvent: Input;

    constructor(gameCtr: main) {
        super();
        this.gameCtr = gameCtr;
        this.inputEvent = new Input();
    }
    public startGame(): void {
        this.inputEvent.on(Input.EventType.TOUCH_START, this.click, this);
        this.inputEvent.on(Input.EventType.MOUSE_WHEEL, this.wheel, this);
    }

    public endGame(): void {
        this.inputEvent.off(Input.EventType.TOUCH_START, this.click, this);
        this.inputEvent.off(Input.EventType.MOUSE_WHEEL, this.wheel, this);
    }

    private click(event: EventTouch): void {
        if(DataManager.gameStatus === SETTING.GAME_STATUS.GAMING) {
            this.gameCtr.playerCtr.clickEvent(event.touch.getLocation());
        }
    }

    private wheel(event: EventMouse): void {
        this.gameCtr.cameraCtr.changeCameraHeight(event.getScrollY() / 40, SETTING.CAMERA_CHANGE_TYPE.BY_DIF);
    }
}

