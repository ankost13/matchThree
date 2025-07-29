import {BaseMediator} from "../../utils/mediator";
import {FirstMediator} from "../firstScreen/firstMediator";

export class BgMediator extends BaseMediator {
    constructor() {
        super();
        this.catchInNotification()
    }

    catchInNotification() {
        this.subscribeToNotification(FirstMediator.START_GAME, () => {
            this.view.mainBgContainer.visible = true
        })
    }
}