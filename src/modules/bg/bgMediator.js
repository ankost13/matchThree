import {BaseMediator} from "../../utils/mediator";
import {FirstMediator} from "../firstScreen/firstMediator";
import {GameFieldNotification} from "../gameField/gameFieldNotification";

export class BgMediator extends BaseMediator {
    constructor() {
        super();
        this.catchInNotification()
    }

    catchInNotification() {
        this.subscribeToNotification(FirstMediator.START_GAME, () => {
            this.view.mainBgContainer.visible = true
            this.sendNotification(GameFieldNotification.SHOW_GAME_FIELD)
        })
    }
}