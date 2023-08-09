import { _decorator, Component, PhysicsSystem2D, Vec2 } from 'cc';
import { main } from './main';
const { ccclass } = _decorator;

@ccclass('phyiscalCtr')
export class phyiscalCtr extends Component {

    private gameCtr: main;
    private phySystem: PhysicsSystem2D;
    public initPhyCtr(gameCtr: main): void {
        this.gameCtr = gameCtr;
        this.phySystem = PhysicsSystem2D.instance;
    }

    public setPhyiscal(): void {
        this.phySystem.gravity = new Vec2();
        // 物理步长，默认 fixedTimeStep 是 1/60
        this.phySystem.fixedTimeStep = 1/60;

        // 每次更新物理系统处理速度的迭代次数，默认为 10
        this.phySystem.velocityIterations = 8;

        // 每次更新物理系统处理位置的迭代次数，默认为 10
        this.phySystem.positionIterations = 10;
    }
}

