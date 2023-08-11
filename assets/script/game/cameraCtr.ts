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

    private isTween: boolean = false;

    private minScale: number = 0;
    private maxScale: number = 0;
    private targetScale: number = 0;
    public initCamera(): void {
        Utils.initLog('init camera');
        this.cameraCom = this.node.getComponent(Camera);
        this.targetScale = 1;
    }

    public startGame(): void {
        this.node.setPosition(0, 0);
        let scale = Math.sqrt(DataManager.canvasSize.height * DataManager.playerRatioInCanvas / DataManager.playerSetting.radius / 2);
        this.minScale = scale;
        this.maxScale = (DataManager.canvasSize.height - 140) / (DataManager.wallRadius * 2);
        this.targetScale = scale; 
        this.scaleBg.setScale(scale, scale);
    }

    public setTargetNode(n: Node | null): void {
        this.targetNode = n;
    }

    public resetTargetNode() {
        this.targetNode = null;
    }

    public changeCameraHeight(dif: number, type: SETTING.CAMERA_CHANGE_TYPE = SETTING.CAMERA_CHANGE_TYPE.BY_TWEEN): void {
        let current = this.scaleBg.scale.x;
        if(dif < 0 && current <= this.maxScale) return;
        if(dif > 0 && current >= this.minScale) return;

        if(type === SETTING.CAMERA_CHANGE_TYPE.BY_TWEEN) {
            this.startScaleTween(this.compareTargetScale(current + 0.1 * Math.sign(dif)));
        } else if(type === SETTING.CAMERA_CHANGE_TYPE.BY_DIF) {
            if((dif > 0 && this.targetScale < current) || (dif < 0 && this.targetScale > current)) {
                this.targetScale = current;
            }
            this.targetScale = this.compareTargetScale(this.targetScale + 0.1 * Math.sign(dif));
        }
    }

    private compareTargetScale(scale: number): number {
        return  Math.max(this.maxScale, Math.min(scale, this.minScale))
    }

    private startScaleTween(scale: number, duration ?: number): void {
        if(this.isTween) return;
        tween(this.scaleBg).to(
            duration || DataManager.cameraTweenDuration,
            { scale: new Vec3(scale, scale, 1) },
            { onComplete: () => { this.isTween = false; this.targetScale = scale }}
        ).start();
        this.isTween = true;
    }

    public setOrthoHeight(dif: number): void {
        this.cameraCom.orthoHeight += dif;
    }

    public setScale(dif: number): void {
        let current = this.scaleBg.scale.x;
        this.scaleBg.setScale(current + dif, current + dif);
    }

    public moveToTarget(): void {
        if(this.targetNode) {
            let targetP = this.targetNode.position;
            let scale = this.scaleBg.scale.x;
            this.scaleBg.setPosition(-targetP.x * scale, -targetP.y * scale);
        }
    }

    update(deltaTime: number) {
        this.moveToTarget();
        let dif = this.targetScale - this.scaleBg.scale.x;
        if(!this.isTween && dif !== 0) {
            if(Math.abs(dif) < 0.002) this.setScale(dif);
            else this.setScale(dif * deltaTime * 2);
        }
    }
}