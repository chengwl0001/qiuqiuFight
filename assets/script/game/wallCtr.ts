import { _decorator, Component, Node, UITransform, Sprite, Graphics, Color } from 'cc';
import { DataManager } from '../core/global';
import Utils from '../core/utils';
const { ccclass, property } = _decorator;

@ccclass('wallCtr')
export class wallCtr extends Component {
    private ctx: Graphics;

    public initWall(): void {
        Utils.initLog('init wall');
        this.ctx = this.getComponent(Graphics);
    }

    public startGame(): void {
        this.node.active = true;
        this.setWallByCtx();
    }

    private setWallByCtx(): void {
		this.ctx.fillColor = new Color('#1D40B5');
        this.ctx.strokeColor = new Color('#2450E4');
        this.ctx.lineWidth = 3;

        this.ctx.clear();
        
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, DataManager.wallRadius, 0, Math.PI * 2, true);
        this.ctx.close();
        this.ctx.fill();
        this.ctx.stroke();
    }

    public endGame(): void {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}

