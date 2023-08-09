import { _decorator, Component, Node, Sprite, Label, Color, CircleCollider2D, RigidBody2D, UITransform, SpriteFrame, Vec2} from 'cc';
import { SETTING } from '../core/gameSetting';
import { DataManager } from '../core/global';
import Utils from '../core/utils';
const { ccclass, property } = _decorator;

@ccclass('baseBallPrefab')
export class baseBallPrefab extends Component {
    @property(SpriteFrame)
    spFrame: SpriteFrame[] = [];

    @property(Label)
    labelText: Label;

    protected bg: Node;
    public radius: number;
    protected ballType: SETTING.BALL_TYPE;
    protected ballRigid: RigidBody2D;
    protected ballcollider: CircleCollider2D;
    protected ballTrans: UITransform;
    protected bgTrans: UITransform;
    protected bgSprite: Sprite;


    protected expanSpeed: number = 0;
    protected distance: number = 0;
    private dRadius: number = 0;
    initCompoent() {
        this.bg = this.node.getChildByName('bg');
        this.ballcollider = this.node.getComponent(CircleCollider2D);
        this.ballTrans = this.node.getComponent(UITransform);
        this.ballRigid = this.node.getComponent(RigidBody2D);
        this.bgTrans = this.bg?.getComponent(UITransform);
        this.bgSprite = this.bg?.getComponent(Sprite);
    }

    protected initAttribute(info: SETTING.BALL_INFO) {
        this.ballType = info.type;
        this.dRadius = info.radius;
        this.node.setPosition(info.position.x, info.position.y, 1);

        if(info.velocity) {
            this.setVolocity(info.velocity);
        }
        this.setPhysicalSetting();
        this.setRaduius(info.radius);
        this.changeSpframe(info.color);
    }

    private setPhysicalSetting() {
        this.ballRigid.allowSleep = false;
        this.ballRigid.gravityScale = 0;
        this.ballRigid.fixedRotation = true;
        this.ballRigid.linearDamping = DataManager.linerDamping;
    }

    public changeSpframe(i: number) {
        this.bgSprite.spriteFrame = this.spFrame[i];
    }

    public setColor(color: Color): void {
        this.bgSprite.color.set(color);
    }

    protected changeVelocity(): void {
        let node = this.node;
        let vX = this.ballRigid.linearVelocity.x,
            vY = this.ballRigid.linearVelocity.y;
        let pX = node.position.x,
            pY = node.position.y;

        let cell_speed = Math.sqrt( Math.pow(vX, 2) + Math.pow(vY, 2) );
        let angle_from_origin = Utils.angleForVector(pX, pY);
        let veloc_ang = Utils.angleForVector(vX, vY);
        let new_veloc_ang = Math.PI + angle_from_origin + (angle_from_origin - veloc_ang);
        this.setVolocity(new Vec2(cell_speed * Math.cos(new_veloc_ang) , cell_speed * Math.sin(new_veloc_ang)))
    }

    private setVolocity(v: Vec2) {
        this.ballRigid.linearVelocity = v;
    }

    protected transferMass(r1, r2, distance): void {
		let bigger = r1;
		let smaller = r2;
		if (r2 > r1) {
			bigger = r2;
			smaller = r1;
		}
		
		let overlap = (smaller + bigger - distance) / (2 * smaller);
		if (overlap > 1.5) overlap = 1.5;
		overlap *= overlap;
		this.expanSpeed = overlap * smaller * smaller / (2 * this.radius);
        // this.expanSpeed < DataManager.minAbsorbSpeed && (this.expanSpeed = DataManager.minAbsorbSpeed);
	}

    protected changeradius(val: number):void {
        this.dRadius = val;
    }

    private setRaduius(r: number): void {
        this.radius = r;
        this.ballTrans.width = this.ballTrans.height = r * 2;
        this.bgTrans.width = this.bgTrans.height = r * 2;

        this.ballcollider.radius = r;
        this.ballcollider.apply();
    }

    protected updateBase(deltaTime: number) {
        if(this.dRadius !== this.radius) {
            let change = this.dRadius - this.radius;
            change = Math.abs(change) < 0.1 ? change : change * deltaTime * 3;
            this.setRaduius(this.radius + change);
        }
    }
}

