import {BaseMediator} from "../../utils/mediator";
import {FirstView} from "./firstView";

export class FirstMediator extends BaseMediator {
    static START_GAME = "FirstMediator.START_GAME"

    constructor() {
        super();
        this.catchInNotification()
    }

    catchInNotification() {
        this.subscribeToNotification(FirstView.START_GAME, () => {
            this.view.setInvisibleContainer()
            this.sendNotification(FirstMediator.START_GAME)
        })
    }
}