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
    initCompoent() {
        this.bg = this.node.getChildByName('bg');
        this.ballcollider = this.node.getComponent(CircleCollider2D);
        this.ballTrans = this.node.getComponent(UITransform);
        this.ballRigid = this.node.getComponent(RigidBody2D);
        this.bgTrans = this.bg?.getComponent(UITransform);
        this.bgSprite = this.bg?.getComponent(Sprite);
    }

    protected initAttribute(info: SETTING.BALL_INFO) {
        this.setPhysicalSetting();
        this.ballType = info.type;
        this.node.setPosition(info.position.x, info.position.y, 1);
        this.changeradius(info.radius);
        this.changeSpframe(info.color);
    }

    private setPhysicalSetting() {
        this.ballRigid.allowSleep = false;
        this.ballRigid.gravityScale = 0;
        this.ballRigid.fixedRotation = true;
        this.ballRigid.linearDamping = DataManager.linerDamping;
    }

    protected changeSpframe(i: number) {
        this.bgSprite.spriteFrame = this.spFrame[i];
    }

    protected setColor(color: Color): void {
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
        this.ballRigid.linearVelocity = new Vec2(cell_speed * Math.cos(new_veloc_ang) , cell_speed * Math.sin(new_veloc_ang));
    }

    protected transferMass(r1, r2, distance): void {
		let bigger = r1;
		let smaller = r2;
		if (r2 > r1) {
			bigger = r2;
			smaller = r1;
		}
		
		let overlap = (smaller + bigger - distance) / (2 * smaller);
		if (overlap > 1) overlap = 1;
		overlap *= overlap;
		this.expanSpeed = overlap * smaller * smaller * DataManager.absorbCalibration / (2 * this.radius);
        // this.expanSpeed < DataManager.minAbsorbSpeed && (this.expanSpeed = DataManager.minAbsorbSpeed);
	}

    protected changeradius(r: number):void {
        this.radius = r;
        this.ballTrans.width = this.ballTrans.height = r * 2;
        this.bgTrans.width = this.bgTrans.height = r * 2;

        this.ballcollider.radius = r;
        this.ballcollider.apply();

        // this.labelText.fontSize = Math.floor(r / 5 + 5);
        // this.labelText.string = (Math.floor(r * 100) / 100).toString();
    }
    update(deltaTime: number) {
    }
}

