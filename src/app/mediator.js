import {BaseMediator} from "../utils/mediator";
import {PreloaderNotification} from "../modules/preloader/notification";

export class GameMediator extends BaseMediator {
    resourcesLoaded() {
        this.sendNotification(PreloaderNotification.HIDE_PRELOADER)
    }
}