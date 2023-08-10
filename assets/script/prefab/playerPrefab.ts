import { _decorator, Contact2DType, CircleCollider2D, IPhysics2DContact, Vec2 } from 'cc';
import { baseBallPrefab } from './baseBallPrefab';
import { SETTING } from '../core/gameSetting';
import { playerCtr } from '../game/playerCtr';
import { DataManager } from '../core/global';
import Utils from '../core/utils';

const { ccclass, menu, property } = _decorator;

@ccclass('playerPrefab')
@menu('Prefab/playerPrefab')
export class playerPrefab extends baseBallPrefab {

    private pCtr: playerCtr;
    private pStatus: SETTING.PLAYER_STATUS = SETTING.PLAYER_STATUS.NOTHING;
    private lastChangeRadius: number;

    init(pCtr: playerCtr) {
        this.pCtr = pCtr;
        this.initCompoent();
    }

    public startActive(info: SETTING.BALL_INFO): void {
        this.node.active = true;
        this.ballcollider.on(Contact2DType.STAY_CONTACT, this.onStayContact, this);

        this.initAttribute(info);
        this.ballcollider.on(Contact2DType.STAY_CONTACT, this.onStayContact, this);
        this.ballcollider.on(Contact2DType.END_CONTACT, this.onEndontact, this);
        this.lastChangeRadius = this.radius;
        this.node.active = true;
        this.ballRigid.enabled = true;
        // this.ballRigid.linearVelocity = new Vec2(Math.random() * 10 - 5 , Math.random() * 10 - 5);
    }

    public endActive(): void {
        this.node.active = false;
        this.ballRigid.enabled = false;
        this.ballcollider.off(Contact2DType.STAY_CONTACT, this.onStayContact, this);
        this.ballcollider.off(Contact2DType.END_CONTACT, this.onEndontact, this);
        this.recycleSelf();
    }

    private onStayContact(selfCollider: CircleCollider2D, otherCollider: CircleCollider2D, contact: IPhysics2DContact | null): void {
        let selfPosition: Vec2 = selfCollider.worldPosition;
        let otherPosition: Vec2 = otherCollider.worldPosition;
        let distance = Utils.caculateDistance(selfPosition, otherPosition);

        if(selfCollider.radius <= otherCollider.radius) {
            this.pStatus = SETTING.PLAYER_STATUS.ABSORBED;
        } else if(selfCollider.radius > otherCollider.radius) {
            this.pStatus = SETTING.PLAYER_STATUS.ABSORB;
        }
        DataManager.playerSetting.status = this.pStatus;
        this.transferMass(selfCollider.radius, otherCollider.radius, distance);
        this.changeradius(this.radius + this.expanSpeed * this.pStatus);
    }
    private onEndontact(): void {
        this.expanSpeed = 0;
        this.pStatus = SETTING.PLAYER_STATUS.NOTHING;
        this.changeradius(this.radius);
        DataManager.playerSetting.status = this.pStatus;
    }

    public setImpulse(impulse: Vec2): void {
        let cur = this.ballRigid.linearVelocity;
        this.ballRigid.linearVelocity = new Vec2(cur.x + impulse.x, cur.y + impulse.y);
        // this.ballRigid.applyLinearImpulseToCenter(impulse, true);
    }

    protected recycleSelf(): void {
        this.node.active = false;
        this.pStatus = SETTING.PLAYER_STATUS.NOTHING;
        DataManager.playerSetting.status = this.pStatus;
    }

    private changeCamera(): void {
        let dif = this.radius - this.lastChangeRadius;

        if(dif < 0 && dif > -10) return;

        if(dif < DataManager.radiusChangeCamera) return;
        this.pCtr.changeCameraHeight(dif);

        this.lastChangeRadius = this.radius;
    }

    update(deltaTime: number) {
        if(!this.node.active) return;
        if(this.radius < DataManager.minRaduis) {
            this.recycleSelf();
            return;
        }
        this.distance = Utils.caculateDistance(this.node.position) + this.radius;
        if((this.distance >= DataManager.wallRadius)) {
            this.changeVelocity();
        }

        this.changeCamera();
        this.updateBase(deltaTime);
        DataManager.playerSetting.radius = this.radius;
    }
}

