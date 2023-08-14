import { _decorator, Component, EventTouch, director } from 'cc';
import { switchButton } from '../prefab/switchButton';
import { DataManager } from '../core/global';
const { ccclass, property } = _decorator;

@ccclass('setting')
export class setting extends Component {
    @property(switchButton)
    musicBtn: switchButton;

    start() {
        this.initBtnStatus();
    }

    private initBtnStatus(): void {
        this.musicBtn.initStatus(DataManager.bgm);
    }

    public clickMusicBtn(): void {
        DataManager.bgm = this.musicBtn.clickChange();
    }

    public changeScence(target: EventTouch, scene: string): void {
        console.log('changeScence >>', scene);
        director.loadScene(scene);
    }
}

