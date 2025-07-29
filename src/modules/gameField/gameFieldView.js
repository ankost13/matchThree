import {View} from "../../utils/view";
import {Assets, Container, Sprite} from "pixi.js";
import {randomInteger} from "../../utils/helperFunction";

export class GameFieldView extends View {

    constructor(parent, resizeData) {
        super(parent, resizeData);
        this.createFieldContainer()

        this.symbolsCollect = []
        this.sizeField = 7
        this.symbolSize = 130
    }

    createFieldContainer() {
        this.fieldContainer = new Container()
        this.fieldContainer.position.set(this.size.width * .35, this.size.height * .15)
        this.addChild(this.fieldContainer)
        this.fieldContainer.visible = false
    }

    showField() {
        this.fieldContainer.visible = true
        this.createBgForField()
        this.createSymbol()
    }

    createBgForField() {
        const bgField = new Sprite ({
            texture: Assets.get("bgField"),
            alpha: .3,
            anchor: 0.5,
            scale: 1.5,
            position: {
                x: this.symbolSize * (this.sizeField / 2 - .5),
                y: this.symbolSize * (this.sizeField / 2 - .5),
            },
        })
        this.fieldContainer.addChild(bgField)
    }

    createSymbol() {
        const textureSymbol = ["S1.png", "S2.png", "S3.png", "S4.png", "S5.png", "S6.png", "S7.png", "S8.png"]
        for (let i = 0; i < this.sizeField; i++) {
            for (let j = 0; j < this.sizeField; j++) {
                const symbol = new Sprite ({
                    texture: Assets.get(textureSymbol[randomInteger(0, 7)]),
                    alpha: 1,
                    anchor: 0.5,
                    scale: 1,
                    position: {
                        x: i * this.symbolSize,
                        y: j * this.symbolSize,
                    },
                })
                this.fieldContainer.addChild(symbol)
                this.symbolsCollect.push(symbol)
            }
        }
    }



    onResize(size) {
        super.onResize(size);
    }
}