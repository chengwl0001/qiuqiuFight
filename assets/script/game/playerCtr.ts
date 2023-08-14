import { _decorator, Vec2, Node, instantiate, Vec3, Layers } from 'cc';
import { obstacleCtr } from './obstacleCtr';
import { main } from './main';
import { playerPrefab } from '../prefab/playerPrefab'; 
import { SETTING } from '../core/gameSetting';
import Utils from '../core/utils';
import { DataManager } from '../core/global';

const { ccclass, menu, property } = _decorator;

@ccclass('playerCtr')
@menu('Game/playerCtr')
export class playerCtr extends obstacleCtr {
    private playerBall: Node;
    private playerCom: playerPrefab;
    private gameCtr: main;
    private viewCenter: Vec2;

    public initPlayer(gameCtr: main): void {
        Utils.initLog('init player');

        this.gameCtr = gameCtr;
        this.viewCenter = new Vec2(DataManager.canvasPixelSize.width / 2, DataManager.canvasPixelSize.height / 2);

        if(!this.playerBall) {
            this.playerBall = instantiate(this.ball);
            this.playerBall.layer = Layers.BitMask.UI_3D;
        }

        this.playerCom = this.playerBall.getComponent(playerPrefab);
        this.playerCom.init(this);
    }

    public startGame() {
        this.gameCtr.cameraCtr.setTargetNode(this.playerBall);
        this.setPlayerByLevel();
    }

    public endGame(): void {
        this.playerCom.recycleSelf();
    }

    public clickEvent(point: Vec2): void {
        let dir = new Vec2(this.viewCenter.x - point.x, this.viewCenter.y - point.y);
        this.impulseBall(dir.normalize())
    }

    private impulseBall(dir: Vec2): void {
        if(!this.playerBall.active) return;

        let v = dir.clone();
        let pRadius = this.playerCom.radius;

        v.multiplyScalar(DataManager.pushVelocity);
        this.playerCom.setImpulse(v);

        let changeMass = pRadius * pRadius * Math.PI * DataManager.lossPercent;
        let nodePos = this.playerCom.node.position;
        let selfChangeRadius = changeMass / (2 * Math.PI * pRadius);

        this.playerCom.changeradius(pRadius - selfChangeRadius);

        let newRadius = Math.sqrt(changeMass / Math.PI);
        let v2 = dir.clone().multiplyScalar(pRadius + newRadius + 0.5);
        let pos = new Vec3(nodePos.x - v2.x, nodePos.y - v2.y, 1);

        newRadius = newRadius < DataManager.minRaduis ? DataManager.minRaduis : newRadius;
        dir.multiplyScalar(DataManager.buttetVelocity);
        this.gameCtr.obstacleCtr.setBullet(pos, newRadius, new Vec2(-dir.x, -dir.y))
    }

    private setPlayerByLevel() {
        this.playerCom.startActive({
            type: SETTING.BALL_TYPE.PLAYER,
            radius: DataManager.playerSetting.radius,
            color: SETTING.BALL_COLOR.RADIUS_NORMAL,
            position: new Vec3()
        })
        this.baseNode?.addChild(this.playerBall);
    }

    public changeCameraHeight(dif: number): void {
        this.gameCtr.cameraCtr.changeCameraHeight(-dif * 3);
    }

    update(deltaTime: number) {
    }
}

