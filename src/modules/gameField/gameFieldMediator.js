import {BaseMediator} from "../../utils/mediator";
import {GameFieldNotification} from "./gameFieldNotification";
import {ScoreBoardNotification} from "../scoreBoard/ScoreBoardNotification.js";

export class GameFieldMediator extends BaseMediator {
    constructor() {
        super();
        this.catchOutNotification()
        this.catchInNotification()
    }

    catchOutNotification() {
        this.subscribeToNotification(GameFieldNotification.SHOW_GAME_FIELD, () => {
            this.view.showField()
            this.sendNotification(ScoreBoardNotification.SHOW_SCORE_BOARD)
        })
    }

    catchInNotification() {
        this.subscribeToNotification(GameFieldNotification.UPDATE_SCORE, (data) => {
            this.sendNotification(ScoreBoardNotification.UPDATE_SCORE, data)
        })
    }
}