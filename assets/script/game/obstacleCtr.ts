import { _decorator, Component, Node, NodePool, Prefab, instantiate, Vec2, Vec3 } from 'cc';
import { obstaclePrefab } from '../prefab/obstaclePrefab';
import { SETTING } from '../core/gameSetting';
import Utils from '../core/utils';
import { DataManager } from '../core/global';

const { ccclass, menu, property } = _decorator;

@ccclass('obstacleCtr')
@menu('Game/obstacleCtr')
export class obstacleCtr extends Component {

    @property(Prefab)
    ball: Prefab;

    @property(Node)
    baseNode: Node;

    protected obstaclePool: NodePool = new NodePool();
    protected obstacleList: obstaclePrefab[] = [];
    protected poolNum: number = 0;

    public initObs(): void {
        Utils.initLog('init obstacle');
        this.initObstaclePool(DataManager.obsSetting.total);
    }

    protected initObstaclePool(n: SETTING.OBSTACLE_NUM_BY_LEVEL): void {
        let poolSize = this.obstaclePool?.size();
        if(poolSize <= n) {
            for(let i = 0; i < (n - poolSize); i++) {
                this.obstaclePool.put(this.creatObstacleByPrefab());
            }
        }
    }

    protected creatObstacleByPrefab(): Node {
        let obsIns = instantiate(this.ball);
        obsIns.getComponent(obstaclePrefab).init(this);
        obsIns.name = this.poolNum.toString();
        this.poolNum++;
        return obsIns;
    }

    protected getObstacleByPool(): obstaclePrefab {
        if(this.obstaclePool.size() > 0) {
            return this.obstaclePool.get().getComponent(obstaclePrefab);
        } else {
            return this.creatObstacleByPrefab().getComponent(obstaclePrefab);
        }
    }

    public recycleObstacle(com: obstaclePrefab): void {
        com.node.active = false;
        com.node.removeFromParent();
        this.obstacleList.splice(this.obstacleList.indexOf(com), 1);
        this.obstaclePool.put(com.node);
    }

    public startGame() {
        this.setObsByNumber(DataManager.obsSetting.total);
    }

    public setObsByNumber(n: number = 0): void {
        const { sRaduis, sPercent, nRaduis, nPercent, lRaduis } = DataManager.obsSetting;
        for(let i = 0; i < n; i++) {
            const com = this.getObstacleByPool();
            let radius, baseRad, ang, x, y, r;

            if(i <= sPercent * n) { baseRad = sRaduis }
            else if(i <= (nPercent + sPercent) * n) { baseRad = nRaduis }
            else { baseRad = lRaduis };
           
            radius = DataManager.minRaduis + (Math.random() * baseRad);
            radius = Number(radius.toFixed(1));
            ang = Math.random() * 2 * Math.PI,
            r = Math.random() * (DataManager.wallRadius - DataManager.minRaduis * 2 - radius - radius),
            x = (n + radius + r) * Math.sin(ang),
            y = (n + radius + r) * Math.cos(ang);

            let info = {
                type : SETTING.BALL_TYPE.OBSTACLE,
                radius,
                color: Utils.getObstacleColor(radius, DataManager.playerSetting.radius),
                position : new Vec3(x, y, 1),
            }
            this.setObsStatus(com, info);
        }
    }

    public setBullet(pos: Vec3, radius: number, v: Vec2) {
        let bullet = this.getObstacleByPool();
        let status = {
            type: SETTING.BALL_TYPE.OBSTACLE,
            radius,
            color: SETTING.BALL_COLOR.RADIUS_NORMAL,
            position: pos,
            velocity: v,
        }
        this.setObsStatus(bullet, status);
    }

    protected setObsStatus(com: obstaclePrefab, status: SETTING.BALL_INFO) {
        com.startActive(status)
        this.obstacleList.push(com);
        this.baseNode?.addChild(com.node);
    }

    private changeGroupColor() {
        this.obstacleList.forEach(item => {
            item.changeSpframe(Utils.getObstacleColor(item.radius, DataManager.playerSetting.radius))
        })
    }

    // 重置
    public reset() {
        this.obstacleList.forEach( item => {
            this.recycleObstacle(item);
        })
        this.obstacleList = [];
    }

    update(deltaTime: number) {
        if(this.obstacleList.length > 0) {
            this.changeGroupColor();
        }
    }
}