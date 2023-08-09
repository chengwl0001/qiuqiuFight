import { _decorator, Vec2, Node, instantiate, Vec3 } from 'cc';
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
        this.viewCenter = new Vec2(DataManager.canvasSize.width / 2, DataManager.canvasSize.height / 2);

        if(!this.playerBall) {
            this.playerBall = instantiate(this.ball);
        }

        this.playerCom = this.playerBall.getComponent(playerPrefab);
        this.playerCom.init(this);
    }

    public startGame() {
        this.gameCtr.cameraCtr.setTargetNode(this.playerBall);
        this.setPlayerByLevel();
    }

    public clickEvent(point: Vec2): void {
        let dir = new Vec2(this.viewCenter.x - point.x, this.viewCenter.y - point.y);
        this.impulseBall(dir.normalize())
    }

    private impulseBall(dir: Vec2): void {
        if(!this.playerBall.active) return;

        let pRadius = this.playerCom.radius;
        let changeMass = pRadius * pRadius * Math.PI;
        let nodePos = this.playerCom.node.position;

        let v = dir.multiplyScalar(changeMass).multiplyScalar(DataManager.impulseFactor);

        changeMass *= DataManager.impulseFactor;
        changeMass = Math.sqrt(changeMass / Math.PI);
        console.log(changeMass)

        let v2 = dir.multiplyScalar(pRadius + 1);
        let pos = new Vec3(nodePos.x + v2.x, nodePos.y + v2.y, 1);

        this.playerCom.setImpulse(v);
        this.gameCtr.obstacleCtr.setBullet(pos, changeMass, v) 
    }

    private setPlayerByLevel() {
        this.playerCom.startActive({
            type: SETTING.BALL_TYPE.PLAYER,
            radius: 10,
            color: SETTING.BALL_COLOR.RADIUS_NORMAL,
            position: { x: 0, y: 0 }
        })
        this.baseNode?.addChild(this.playerBall);
    }

    public changeCameraHeight(): void {
        this.gameCtr.cameraCtr.setCameraHeight(100);
    }

    public recyclePlayer(): void {
        this.playerBall.active = false;
        this.playerBall.removeFromParent();
    }

    update(deltaTime: number) {
        
    }
}

