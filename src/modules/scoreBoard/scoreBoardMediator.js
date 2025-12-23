import {BaseMediator} from "../../utils/mediator.js";
import {ScoreBoardNotification} from "./ScoreBoardNotification.js";

export class ScoreBoardMediator extends BaseMediator {
    constructor() {
        super();
        this.catchOutNotification()
    }

    catchOutNotification() {
        this.subscribeToNotification(ScoreBoardNotification.UPDATE_SCORE, (data) => {
            this.view.progressAnim(data.currentWin * 10)
            this.view.updateScoreValue(data.generalWin * 10)
        })
        this.subscribeToNotification(ScoreBoardNotification.SHOW_SCORE_BOARD, () => {
            this.view.boardContainer.visible = true
        })
    }

}