import {View} from "../../utils/view";
import {SpineCustom} from "../../utils/spine";
import {Assets, Container, Sprite} from "pixi.js";

export class BgView extends View {
    constructor(parent, resizeData) {
        super(parent, resizeData);
        this.addMainBgContainer()
        this.mainBgContainer.visible = false
    }

    addMainBgContainer() {
        this.mainBgContainer = new Container();
        this.addChild(this.mainBgContainer);

        this.addBg();
        this.addSpine();
    }

    addBg() {
        const bg = new Sprite({
            texture: Assets.get("bg"),
            alpha: 1,
            anchor: 0.5,
            scale: 1.3,
            position: {
                x: this.size.width / 2,
                y: this.size.height * .4,
            }
        })
        this.mainBgContainer.addChild(bg)
    }

    addSpine() {
        const spine = new SpineCustom({
            spineData: "spineboy",
            scale: .45,
            parent: this.mainBgContainer,
            position: {
                x: this.size.width * 0.15,
                y: this.size.height * 0.7,
            }
        })

        spine.playAnimation(0, "animation", true)
    }

}