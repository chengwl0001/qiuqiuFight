import { _decorator, Component, EventTouch, EventHandler, director, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('index')
export class index extends Component {

    start() {

    }

    public changeScence(target: EventTouch, scene: string): void {
        console.log('changeScence >>', scene);
        director.loadScene(scene);
    }

    update(deltaTime: number) {

    }
}

