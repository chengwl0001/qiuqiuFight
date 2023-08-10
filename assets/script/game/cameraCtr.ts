import { _decorator, Component, Camera, Vec3, Node, tween } from 'cc';
import Utils from '../core/utils';
import { DataManager } from '../core/global';
const { ccclass, property } = _decorator;

@ccclass('cameraCtr')
export class cameraCtr extends Component {
    private cameraCom: Camera;
    private targetNode: Node;

    private isMax: boolean = false;
    public initCamera(): void {
        Utils.initLog('init camera');
        this.cameraCom = this.node.getComponent(Camera);
    }

    public startGame(): void {
        this.node.position = new Vec3(0, 0, 1);
        this.cameraCom.orthoHeight = DataManager.cameraOrthoHeight;
    }

    public setTargetNode(n: Node | null): void {
        this.targetNode = n;
    }

    public resetTargetNode() {
        this.targetNode = null;
    }

    public setCameraHeight(dif: number): void {
        if(this.cameraCom.orthoHeight >= DataManager.maxOrthoHeight) return;
        let orthoHeight = this.cameraCom.orthoHeight * (1 + 0.2 * (dif > 0 ? 1 : -1));
        orthoHeight = Math.min(DataManager.maxOrthoHeight, Math.max(orthoHeight, DataManager.minOrthoHeight));
        tween(this.cameraCom).to(
            DataManager.cameraTweenDuration, { orthoHeight: orthoHeight }
        ).start();
    }

    update(deltaTime: number) {
        if(this.targetNode)
            this.node.position = this.targetNode.position;
    }
}