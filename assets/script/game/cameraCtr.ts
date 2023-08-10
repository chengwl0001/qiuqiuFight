import { _decorator, Component, Camera, Vec3, Node, tween } from 'cc';
import Utils from '../core/utils';
import { DataManager } from '../core/global';
import { SETTING } from '../core/gameSetting';
const { ccclass, property } = _decorator;

@ccclass('cameraCtr')
export class cameraCtr extends Component {
    private cameraCom: Camera;
    private targetNode: Node;

    private targetOH: number = 0;
    private isTween: boolean = false;
    private isMax: boolean = false;
    public initCamera(): void {
        Utils.initLog('init camera');
        this.cameraCom = this.node.getComponent(Camera);
    }

    public startGame(): void {
        this.node.position = new Vec3(0, 0, 1);
        this.cameraCom.orthoHeight = DataManager.cameraOrthoHeight;
        this.targetOH = DataManager.cameraOrthoHeight;
    }

    public setTargetNode(n: Node | null): void {
        this.targetNode = n;
    }

    public resetTargetNode() {
        this.targetNode = null;
    }

    public changeCameraHeight(dif: number, type: SETTING.CAMERA_CHANGE_TYPE = SETTING.CAMERA_CHANGE_TYPE.BY_TWEEN): void {
        let current = this.cameraCom.orthoHeight;
        if(dif > 0 && current >= DataManager.maxOrthoHeight) return;
        if(dif < 0 && current <= DataManager.minOrthoHeight) return;

        if(type === SETTING.CAMERA_CHANGE_TYPE.BY_TWEEN) {
            let orthoHeight = current * (1 + 0.2 * (dif > 0 ? 1 : -1));
            orthoHeight = Math.min(DataManager.maxOrthoHeight, Math.max(orthoHeight, DataManager.minOrthoHeight));
            this.startScaleTween(orthoHeight);
        } else if(type === SETTING.CAMERA_CHANGE_TYPE.BY_DIF) {
            if((dif < 0 && this.targetOH > current) || (dif > 0 && this.targetOH < current)) {
                this.targetOH = current;
            }
            this.targetOH += dif;
            this.targetOH = Math.min(DataManager.maxOrthoHeight, Math.max(this.targetOH, DataManager.minOrthoHeight));
        }
    }

    private startScaleTween(orthoHeight: number, duration ?: number): void {
        if(this.isTween) return;
        tween(this.cameraCom).to(
            duration || DataManager.cameraTweenDuration,
            { orthoHeight: orthoHeight },
            { onComplete: () => { this.isTween = false; this.targetOH = orthoHeight }}
        ).start();
        this.isTween = true;
    }

    public setOrthoHeight(dif: number): void {
        this.cameraCom.orthoHeight += dif;
    }

    update(deltaTime: number) {
        if(this.targetNode) this.node.position = this.targetNode.position;
        let dif = this.targetOH - this.cameraCom.orthoHeight;
        if(!this.isTween && dif !== 0) {
            if(Math.abs(dif) < 1) this.setOrthoHeight(dif);
            else this.setOrthoHeight(dif * deltaTime * 2);
        }
    }
}