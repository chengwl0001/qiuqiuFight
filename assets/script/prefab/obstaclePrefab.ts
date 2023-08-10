import { _decorator, Contact2DType, IPhysics2DContact, CircleCollider2D, Vec2, Vec3, Node } from 'cc';
import { baseBallPrefab } from './baseBallPrefab';
import { obstacleCtr } from '../game/obstacleCtr';
import { SETTING } from '../core/gameSetting';
import { DataManager } from '../core/global';
import Utils from '../core/utils';

const { ccclass, menu, property } = _decorator;

@ccclass('obstaclePrefab')
@menu('Prefab/obstaclePrefab')
export class obstaclePrefab extends baseBallPrefab {
    private oCtr: obstacleCtr;
    init(oCtr: obstacleCtr) {
        this.oCtr = oCtr;
        this.initCompoent();
    }

    private velocity: Vec2;
    private baseRate: number = 0.1;
    private obsStatus: SETTING.OBSTACLE_STATUS = SETTING.OBSTACLE_STATUS.NOTHING;

    public startActive(info: SETTING.BALL_INFO): void {
        
        this.initAttribute(info);
        if(!info.velocity) {
            this.velocity = new Vec2(
                Math.random() * this.baseRate - this.baseRate / 2,
                Math.random() * this.baseRate - this.baseRate / 2
            )
            this.initBallStatus();
        }
        this.ballcollider.on(Contact2DType.STAY_CONTACT, this.onStayContact, this);
        this.ballcollider.on(Contact2DType.END_CONTACT, this.onEndontact, this);
        this.node.active = true;
        this.ballRigid.enabled = true;
    }

    public endActive(): void {
        this.node.active = false;
        this.ballRigid.enabled = false;

        this.ballcollider.off(Contact2DType.STAY_CONTACT, this.onStayContact, this);
        this.ballcollider.off(Contact2DType.END_CONTACT, this.onEndontact, this);
    }

    private initBallStatus() {
        this.ballRigid.linearVelocity = new Vec2(this.velocity.x , this.velocity.y);
    }

    private onStayContact(selfCollider: CircleCollider2D, otherCollider: CircleCollider2D, contact: IPhysics2DContact | null): void {
        let selfPosition: Vec2 = selfCollider.worldPosition;
        let otherPosition: Vec2 = otherCollider.worldPosition;
        let distance = Utils.caculateDistance(selfPosition, otherPosition);

        if(selfCollider.radius <= otherCollider.radius) {
            this.obsStatus = SETTING.OBSTACLE_STATUS.ABSORBED;
        } else if(selfCollider.radius > otherCollider.radius) {
            this.obsStatus = SETTING.OBSTACLE_STATUS.ABSORB;
        }

        this.transferMass(selfCollider.radius, otherCollider.radius, distance);
        this.changeradius(this.radius + this.expanSpeed * this.obsStatus);
    }
    private onEndontact(): void {
        this.expanSpeed = 0;
        this.obsStatus = SETTING.OBSTACLE_STATUS.NOTHING;
        this.changeradius(this.radius);
    }

    private recycleSelf(): void {
        this.oCtr.recycleObstacle(this);
    }

    update(deltaTime: number) {
        if(!this.node.active) return;
        if(this.radius < DataManager.minRaduis) {
            this.recycleSelf();
            return;
        }
        this.distance = Utils.caculateDistance(this.node.position) + this.radius;
        if((this.distance > DataManager.wallRadius)) {
            this.changeVelocity();
        }
        this.updateBase(deltaTime);
    }
}