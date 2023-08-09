import { _decorator, Component, Node, UITransform, Sprite } from 'cc';
import { DataManager } from '../core/global';
import Utils from '../core/utils';
const { ccclass, property } = _decorator;

@ccclass('wallCtr')
export class wallCtr extends Component {
    @property(Node)
    spFrame: Node;

    private wallTrans: UITransform;
    private wallSprite: Sprite;

    initWall(): void {
        Utils.initLog('init wall');
        this.wallTrans = this.spFrame.getComponent(UITransform);
        this.wallSprite = this.spFrame.getComponent(Sprite);
    }

    setWallRaduis(): void {
        this.wallTrans.width = this.wallTrans.height = DataManager.wallRadius * 2;
    }

    update(deltaTime: number) {
        
    }
}

