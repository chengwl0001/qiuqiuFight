import { Vec2, Vec3 } from "cc";

export namespace SETTING {
    //<===================================> Debug <===================================>
    export const LOG = (mes: any, ...opts: any) => {
        console.log("[SV LOG] >>> ", mes, ...opts);
    };
    export const ERR = (mes: any, ...opts: any) => {
        console.error("[SV ERR] >>> ", mes, ...opts);
    };
    export const WARN = (mes: any, ...opts: any) => {
        console.warn("[SV WARN] >>> ", mes, ...opts);
    };
    //<===================================> Enum <===================================>
    export enum GAME_STATUS {
        LOADING,
        READY,
        GAMING,
        PAUSE,
        OVER
    }
    export enum GAME_BGM {
        CLOSE,
        OPEN,
    }
    export enum BALL_TYPE {
        OBSTACLE  = 'obstacle',
        PLAYER    = 'player',
        BULLET    = 'bullet',
        FIRE_BALL = 'fire_ball',
    }
    export enum BALL_COLOR {
        RADIUS_NORMAL,
        RADIUS_WARNING,
        RADIUS_ERROR,
    }
    export enum OBSTACLE_MAX_RADIUS {
        OBSTACLE_SIZE_1 = 20,
        OBSTACLE_SIZE_2 = 40,
        OBSTACLE_SIZE_3 = 80,
        OBSTACLE_SIZE_4 = 120,
    }
    export enum GAME_LEVEL {
        LEVEL_1,
        LEVEL_2,
        LEVEL_3,
        LEVEL_4,
        LEVEL_5,
        LEVEL_6,
    }
    export enum OBSTACLE_NUM_BY_LEVEL {
        MAX_NUM_1 = 10,
        MAX_NUM_2 = 70,
        MAX_NUM_3 = 90,
        MAX_NUM_4 = 110,
        MAX_NUM_5 = 130,
        MAX_NUM_6 = 150,
    }
    export enum OBSTACLE_STATUS {
        ABSORBED = -1,
        NOTHING,
        ABSORB,
    }
    export enum PLAYER_STATUS {
        ABSORBED = -1,
        NOTHING,
        ABSORB,
    }
    export enum WALL_RADIUS {
        WALL_LEVEL_1 = 800,
        WALL_LEVEL_2 = 1000,
        WALL_LEVEL_3 = 1200,
        WALL_LEVEL_4 = 1400,
        WALL_LEVEL_5 = 1400,
        WALL_LEVEL_6 = 1400,
    }
    export enum GAME_SPEED {
        SPEED_1 = 1,
        SPEED_2 = 1.25,
        SPEED_3 = 1.5,
        SPEED_4 = 2,
    }

    //<===================================> Const <===================================>
    export const OBSTACLE_GROUP: OBSTACLE_SETTING[] = [
        { total: 80,  sRaduis: 30, sPercent: 0.6,  nRaduis: 60, nPercent: 0.3, lRaduis: 100 },
        { total: 100, sRaduis: 30, sPercent: 0.55, nRaduis: 60, nPercent: 0.3, lRaduis: 100 },
        { total: 120, sRaduis: 30, sPercent: 0.5,  nRaduis: 60, nPercent: 0.3, lRaduis: 100 },
        { total: 140, sRaduis: 30, sPercent: 0.45, nRaduis: 60, nPercent: 0.3, lRaduis: 100 },
        { total: 180, sRaduis: 30, sPercent: 0.4,  nRaduis: 60, nPercent: 0.3, lRaduis: 100 },
        { total: 200, sRaduis: 30, sPercent: 0.4,  nRaduis: 60, nPercent: 0.3, lRaduis: 100 },
    ]
    export const PLAYER_GROUP: PLAYER_SETTING[] = [
        { radius: 10, status: PLAYER_STATUS.NOTHING },
        { radius: 10, status: PLAYER_STATUS.NOTHING },
        { radius: 10, status: PLAYER_STATUS.NOTHING },
        { radius: 10, status: PLAYER_STATUS.NOTHING },
        { radius: 10, status: PLAYER_STATUS.NOTHING },
        { radius: 10, status: PLAYER_STATUS.NOTHING },
    ]
    export const WALL_RADIUS_GROUP: WALL_RADIUS[] = [
        WALL_RADIUS.WALL_LEVEL_1,
        WALL_RADIUS.WALL_LEVEL_2,
        WALL_RADIUS.WALL_LEVEL_3,
        WALL_RADIUS.WALL_LEVEL_4,
        WALL_RADIUS.WALL_LEVEL_5,
        WALL_RADIUS.WALL_LEVEL_6,
    ]
    //<===================================> type <===================================>
    export interface BALL_INFO {
        type      : BALL_TYPE,
        radius    : number,
        color     : BALL_COLOR,
        position  : Vec3,
        velocity ?: Vec2,
    }

    export type OBSTACLE_SETTING = {
        readonly total       : number;
        readonly sRaduis     : number;
        readonly sPercent    : number;
        readonly nRaduis     : number;
        readonly nPercent    : number;
        readonly lRaduis     : number;
    }

    export interface PLAYER_SETTING {
        radius      : number,
        status     ?: SETTING.PLAYER_STATUS,
    }

    export type LEVEL_SETTING = {
        obstacleSetting   : OBSTACLE_SETTING;
        wallRadius        : WALL_RADIUS;
    }
    interface VEC2 {
        x: number
        y: number
    }
}