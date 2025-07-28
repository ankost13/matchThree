import {Container} from "pixi.js";
import {GLOBAL_EMITTER} from "./eventEmitter";
import {SoundsManager} from "./soundsManager";

export class View extends Container {
    constructor(parent, resizeData) {
        super();
        this.size = resizeData;
        parent.addChild(this);

        this.initEmitter();
        this.initSoundsManager();
    }

    initEmitter() {
        this.emitter = GLOBAL_EMITTER;
    }

    notifyToMediator(notification, data) {
        this.emitter.emit(notification, data);
    }

    initSoundsManager() {
        this.soundsManager = SoundsManager.getInstance();
    }

    onResize(size) {
        this.size = size;
    }

    isLandscape() {
        return this.size.width > this.size.height
    }

    isMobile() {
        return /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    }
}
