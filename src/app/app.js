import {Application, Assets, Container} from "pixi.js";
import {manifest} from "../manifest";
import {GamePreloaderMediator} from "../modules/preloader/mediator";
import {PreloaderView} from "../modules/preloader/view";
import {GameMediator} from "./mediator";
import {SoundsManager} from "../utils/soundsManager";
import {AssetLoader} from "../utils/loader";
import {BgView} from "../modules/bg/bgView";
import {BgMediator} from "../modules/bg/bgMediator";
import {FirstMediator} from "../modules/firstScreen/firstMediator";
import {FirstView} from "../modules/firstScreen/firstView";
import {GameFieldMediator} from "../modules/gameField/gameFieldMediator";
import {GameFieldView} from "../modules/gameField/gameFieldView";

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

        this.registerFirstScreen();
        this.registerBg();
        this.registerGameField()
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

    registerFirstScreen() {
        const mediator = new FirstMediator();
        const parent = new Container();
        this.stage.addChild(parent);
        mediator.initView(FirstView, parent);
    }

    registerBg() {
        const mediator = new BgMediator();
        const parent = new Container();
        this.stage.addChild(parent);
        mediator.initView(BgView, parent);
    }

    registerGameField() {
        const mediator = new GameFieldMediator();
        const parent = new Container();
        this.stage.addChild(parent);
        mediator.initView(GameFieldView, parent);
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
