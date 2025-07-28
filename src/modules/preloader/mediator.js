import {BaseMediator} from "../../utils/mediator";
import {setAnimationTimeoutSync} from "../../utils/helperFunction";
import {PreloaderNotification} from "./notification";

export class GamePreloaderMediator extends BaseMediator {

    constructor() {
        super();

        this.notificationOutside();
    }

    async notificationOutside() {
        this.subscribeToNotification(PreloaderNotification.HIDE_PRELOADER, async (data) => {
            await setAnimationTimeoutSync(1);
            this.view.hide();
        });
    }
}