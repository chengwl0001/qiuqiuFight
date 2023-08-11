import { _decorator, Component, Camera, Vec3, Node, tween } from 'cc';
import Utils from '../core/utils';
import { DataManager } from '../core/global';
import { SETTING } from '../core/gameSetting';
const { ccclass, property } = _decorator;

@ccclass('cameraCtr')
export class cameraCtr extends Component {
    @property(Node)
    scaleBg: Node;

    private cameraCom: Camera;
    private targetNode: Node;
    private targetOH: number;

    private isTween: boolean = false;

    private minOrthoHeight: number = 0;
    private maxOrthoHeight: number = 0;

    public initCamera(): void {
        Utils.initLog('init camera');
        this.cameraCom = this.node.getComponent(Camera);
        this.targetOH = this.cameraCom.orthoHeight;
    }

    public startGame(): void {
        this.node.setPosition(0, 0);
        this.minOrthoHeight = DataManager.playerSetting.radius / DataManager.playerRatioInCanvas;
        this.maxOrthoHeight = DataManager.wallRadius  + 100;
    }

    public endGame(): void {
        this.resetTargetNode();
    }

    public setTargetNode(n: Node | null): void {
        this.targetNode = n;
    }

    private resetTargetNode() {
        this.targetNode = null;
    }

    public changeCameraHeight(dif: number, type: SETTING.CAMERA_CHANGE_TYPE = SETTING.CAMERA_CHANGE_TYPE.BY_TWEEN): void {
        let current = this.cameraCom.orthoHeight;
        if(dif > 0 && current >= this.maxOrthoHeight) return;
        if(dif < 0 && current <= this.minOrthoHeight) return;

        if(type === SETTING.CAMERA_CHANGE_TYPE.BY_TWEEN) {
            let orthoHeight = this.compareTargetHeight(current * (1 + 0.2 * (dif > 0 ? 1 : -1)));
            this.startHeightTween(orthoHeight);
        } else if(type === SETTING.CAMERA_CHANGE_TYPE.BY_DIF) {
            if((dif < 0 && this.targetOH > current) || (dif > 0 && this.targetOH < current)) {
                this.targetOH = current;
            }
            this.targetOH = this.compareTargetHeight(this.targetOH + Math.sign(dif) * 10);
        }
    }

    private compareTargetHeight(height: number): number {
        return  Math.min(this.maxOrthoHeight, Math.max(height, this.minOrthoHeight))
    }

    private startHeightTween(orthoHeight: number, duration ?: number): void {
        if(this.isTween) return;
        tween(this.cameraCom).to(
            duration || DataManager.cameraTweenDuration,
            { orthoHeight: orthoHeight },
            { onComplete: () => { this.isTween = false; this.targetOH = orthoHeight }}
        ).start();
        this.isTween = true;
    }

    private setOrthoHeight(dif: number): void {
        this.cameraCom.orthoHeight += dif;
    }

    private moveToTarget(): void {
        if(this.targetNode) {
            this.node.position = this.targetNode.position;
        }
    }

    update(deltaTime: number) {
        this.moveToTarget();
        let dif = this.targetOH - this.cameraCom.orthoHeight;
        if(!this.isTween && dif !== 0) {
            if(Math.abs(dif) < 1) this.setOrthoHeight(dif);
            else this.setOrthoHeight(dif * deltaTime * 2);
        }
    }
}