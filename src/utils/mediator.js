import {Proxy} from "../modules/proxy/proxy";
import {GLOBAL_EMITTER} from "./eventEmitter";
import {ResizeManager} from "./resizeManager";

export class BaseMediator {
    constructor() {
        this.initEmitter();
        this.initProxy();
    }

    initView(referenceConstructorUI, parent) {
        const resizeManager = ResizeManager.getInstance();
        this.view = new referenceConstructorUI(parent, resizeManager.getResizeData());
        ResizeManager.getInstance().registerUI(this.view);

        setTimeout(() => {
            const resizeEvent = new Event("resize");
            window.dispatchEvent(resizeEvent);
        })
    }

    initEmitter() {
        this.emitter = GLOBAL_EMITTER;
    }

    initProxy() {
        this.proxy = Proxy.getInstance();
    }

    sendNotification(notification, data) {
        this.emitter.emit(notification, data);
    }

    subscribeToNotification(notification, callback) {
        this.emitter.on(notification, (data) => {
            callback(data)
        });
    }
}

