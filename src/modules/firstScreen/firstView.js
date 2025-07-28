import {View} from "../../utils/view";
import {SpineCustom} from "../../utils/spine";
import {Assets, Sprite} from "pixi.js";

export class FirstView extends View {
    constructor(parent, resizeData) {
        super(parent, resizeData);
        this.addBg();
        this.addTest();
    }

    addBg() {
        const bg = new Sprite({
            container: this,
            texture: Assets.get("bg"),
            alpha: 1,
            anchor: 0.5,
            scale: 1.3,
            position: {
                x: this.size.width / 2,
                y: this.size.height * .4,
            }
        })
        this.addChild(bg)
    }

    addTest() {
        const spine = new SpineCustom({
            spineData: "spineboy",
            scale: .85,
            parent: this,
            position: {
                x: this.size.width * 0.45,
                y: this.size.height * 0.7,
            }
        })

        spine.playAnimation(0, "animation", true)
    }

}