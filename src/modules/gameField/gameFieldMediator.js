import {BaseMediator} from "../../utils/mediator";
import {GameFieldNotification} from "./gameFieldNotification";

export class GameFieldMediator extends BaseMediator {
    constructor() {
        super();
        this.catchOutNotification()
    }

    catchOutNotification() {
        this.subscribeToNotification(GameFieldNotification.SHOW_GAME_FIELD, () => {
            this.view.showField()
        })
    }
}