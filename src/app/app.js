import {Application, Assets, Container} from "pixi.js";
import {manifest} from "../manifest";
import {GamePreloaderMediator} from "../modules/preloader/mediator";
import {PreloaderView} from "../modules/preloader/view";
import {GameMediator} from "./mediator";
import {SoundsManager} from "../utils/soundsManager";
import {AssetLoader} from "../utils/loader";
import {BgView} from "../modules/bg/bgView";
import {BgMediator} from "../modules/bg/bgMediator";

export class App extends Application {

    constructor(data) {
        super(data)

        this.initGame();
    }

    async initGame() {
        this.registerPreloader();

        await this.initSounds();
        await this.loadAssets();

        this.gameMediator = new GameMediator();
        this.gameMediator.resourcesLoaded();

        this.registerBg();
    }

    async loadAssets() {
        const loader = new AssetLoader()
        window.loader = loader;
        //await loader.loadPreloaderAssets(manifest);
        await loader.loadAssets(manifest);
    }

    registerPreloader() {
        const mediator = new GamePreloaderMediator();
        const parent = new Container();
        this.stage.addChild(parent);
        mediator.initView(PreloaderView, parent);
    }

    registerBg() {
        const mediator = new BgMediator();
        const parent = new Container();
        this.stage.addChild(parent);
        mediator.initView(BgView, parent);
    }


    async initSounds() {
        const sounds = [
            {
                name: "backgroundSound",
                src: "assets/sounds/backgroundSound.mp3",
                volume: 0.01,
                loop: true,
            },
            // {
            //     name: "win",
            //     src: "assets/sounds/win.mp3",
            //     volume: 0.1,
            // },
        ];
        const soundsManager = SoundsManager.getInstance()
        await soundsManager.loadSounds(sounds);
    }
}
