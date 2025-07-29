import {View} from "../../utils/view";
import {SpineCustom} from "../../utils/spine";
import {Assets, Container, Sprite} from "pixi.js";

export class FirstView extends View {
    static START_GAME = "FirstView.START_GAME"

    constructor(parent, resizeData) {
        super(parent, resizeData);
        this.addBgContainer()
    }

    addBgContainer() {
        this.bgContainer = new Container();
        this.addChild(this.bgContainer);

        this.addBg();
        this.addSpine();
        this.addButton()
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
        this.bgContainer.addChild(bg)
    }

    addSpine() {
        const spine = new SpineCustom({
            spineData: "spineboy",
            scale: .85,
            parent: this.bgContainer,
            position: {
                x: this.size.width * 0.45,
                y: this.size.height * 0.7,
            }
        })

        spine.playAnimation(0, "animation", true)
    }

    addButton() {
        this.button = new Sprite({
            texture: Assets.get("button"),
            anchor: 0.5,
            position: {
                x: this.size.width * .9,
                y: this.size.height * .5,
            },
            interactive: true,
        })
        this.bgContainer.addChild(this.button)
        this.setButtonsLogic()
    }

    setButtonsLogic() {
        this.button.cursor = "pointer"

        this.button.on("pointerover", () => {
            this.button.texture = Assets.get("button_pointer")
        });

        this.button.on("pointerout", () => {
            this.button.texture = Assets.get("button")
        });

        this.button.on("pointerdown", () => {
            this.button.texture = Assets.get("button_on")
        });

        this.button.on("pointerup", () => {
            this.notifyToMediator(FirstView.START_GAME)
        });
    }

    setInvisibleContainer() {
        this.bgContainer.visible = false
    }

    onResize(size) {
        super.onResize(size);
    }

}