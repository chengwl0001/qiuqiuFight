import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { SETTING } from '../core/gameSetting';
import { DataManager } from '../core/global';
const { ccclass, property } = _decorator;

@ccclass('switchButton')
export class switchButton extends Component {
    @property(Node)
    onBg: Node;

    @property(Node)
    offBg: Node;

    @property(Node)
    circleBg: Node;

    private status: SETTING.SWITCH_STATUS;

    public initStatus(status: SETTING.SWITCH_STATUS): void {
        if(status === SETTING.SWITCH_STATUS.OFF) {
            this.switchOff(false);
        } else if(status === SETTING.SWITCH_STATUS.ON) {
            this.switchOn(false);
        }
    }

    public clickChange(): SETTING.SWITCH_STATUS {
        if(this.status === SETTING.SWITCH_STATUS.OFF) {
            this.switchOn();
        } else if(this.status === SETTING.SWITCH_STATUS.ON) {
            this.switchOff();
        }

        return this.status;
    }
    
    public getStatus(): SETTING.SWITCH_STATUS {
        return this.status;
    }

    private switchOn(showTween: boolean = true): void {
        this.status = SETTING.SWITCH_STATUS.ON;
        this.onBg.active = true;
        this.offBg.active = false;
        if(showTween) {
            tween(this.circleBg).to(
                DataManager.switchButtonDuration,
                { position: new Vec3(56, 0, 0) },
            ).start();
        } else {
            this.circleBg.setPosition(56, 0);
        }
    }
    private switchOff(showTween: boolean = true): void {
        this.status = SETTING.SWITCH_STATUS.OFF;
        this.onBg.active = false;
        this.offBg.active = true;
        if(showTween) {
            tween(this.circleBg).to(
                DataManager.switchButtonDuration,
                { position: new Vec3(-57, 0, 0) },
            ).start();
        } else {
            this.circleBg.setPosition(-57, 0);
        }
    }
}

