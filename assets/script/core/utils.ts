import { SETTING } from "./gameSetting";
import { DataManager } from "./global";
interface position {
    x: number;
    y: number;
}
const Utils =  {
    initLog(...args): void {
        console.log('<------  ', args.join(', '), '  ------>');
    },
    log(...args): void {
        console.log(args.join(', '));
    },

    caculateDistance(self: position, target: position = {x:0, y:0}): number {
        return Math.sqrt(Math.pow(self.x - target.x, 2) + Math.pow(self.y - target.y, 2))
    },

    angleForVector(x, y): number {
        var ang = Math.atan(y/x);
        if (x < 0) ang += Math.PI;
        else if (y < 0) ang += 2 * Math.PI;
        return ang;
    },

    setSettingByLevel(level: SETTING.GAME_LEVEL): void {
        DataManager.wallRadius = SETTING.WALL_RADIUS_GROUP[level];
        DataManager.obsSetting = {...SETTING.OBSTACLE_GROUP[level]};
        DataManager.playerSetting = {...SETTING.PLAYER_GROUP[level]};
        DataManager.maxOrthoHeight = DataManager.wallRadius + 400;
    },

    getObstacleColor(self: number, player: number): SETTING.BALL_COLOR {
        if(self > player) {
            return SETTING.BALL_COLOR.RADIUS_ERROR;
        } else if((player - self) < 2) {
            return SETTING.BALL_COLOR.RADIUS_WARNING;
        } else {
            return SETTING.BALL_COLOR.RADIUS_NORMAL
        }
    },
}
export default Utils;