import { _decorator, Component, Camera, Vec2, Node, tween } from 'cc';
import Utils from '../core/utils';
import { DataManager } from '../core/global';
const { ccclass, property } = _decorator;

@ccclass('cameraCtr')
export class cameraCtr extends Component {
    private cameraCom: Camera;
    private targetNode: Node;

    public initCamera(): void {
        Utils.initLog('init camera');
        this.cameraCom = this.node.getComponent(Camera);
    }

    public setTargetNode(n: Node | null): void {
        this.targetNode = n;
    }

    public resetTargetNode() {
        this.targetNode = null;
    }

    public setCameraHeight(height: number): void {
        tween(this.cameraCom).to(
            DataManager.cameraTweenDuration, { orthoHeight: height }
        ).start();
    }

    update(deltaTime: number) {
        if(this.targetNode)
            this.node.position = this.targetNode.position;
    }
}