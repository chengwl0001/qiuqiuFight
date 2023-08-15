import { _decorator, Component, Node } from 'cc';
import Utils from '../core/utils';
const { ccclass, property } = _decorator;

@ccclass('uiCtr')
export class uiCtr extends Component {
    private startUI: Node;
    private pauseUI: Node;
    private winUI: Node;
    private loseUI: Node;

    public init(): void {
        Utils.initLog('uiCtr init');
        this.startUI = this.node.getChildByName('gameStart');
        this.pauseUI = this.node.getChildByName('gamePause');
        this.winUI = this.node.getChildByName('gameWin');
        this.loseUI = this.node.getChildByName('gameLose');
    }

    public startGame(): void {
        this.startUI.active = true;
        this.pauseUI.active = false;
        this.winUI.active = false;
        this.loseUI.active = false;
    }

    public pauseGame(): void {
        this.startUI.active = false;
        this.pauseUI.active = true;
        this.winUI.active = false;
        this.loseUI.active = false;
    }

    public winGame(): void {
        this.startUI.active = false;
        this.pauseUI.active = false;
        this.winUI.active = true;
        this.loseUI.active = false;
    }

    public loseGame(): void {
        this.startUI.active = false;
        this.pauseUI.active = false;
        this.winUI.active = false;
        this.loseUI.active = true;
    }

    update(deltaTime: number) {
        
    }
}

