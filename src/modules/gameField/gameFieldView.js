import {View} from "../../utils/view";
import {Assets, Container, Sprite} from "pixi.js";
import {randomInteger, setAnimationTimeoutSync} from "../../utils/helperFunction";
import {Symbol} from "./symbol";

export class GameFieldView extends View {

    constructor(parent, resizeData) {
        super(parent, resizeData);
        this.createFieldContainer()

        this.symbolsCollect = []
        this.sizeField = 7
        this.symbolSize = 130
        this.numberOfChouseSymbol = 0
        this.previousLocation = []
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
            this.symbolsCollect[i] = []
            for (let j = 0; j < this.sizeField; j++) {
                const currentTexture = textureSymbol[randomInteger(0, 7)]
                const posX = i * this.symbolSize
                const posY = j * this.symbolSize

                const symbol = new Symbol ({
                    texture: Assets.get(currentTexture),
                    alpha: 1,
                    anchor: 0.5,
                    scale: 1,
                    position: {
                        x: posX,
                        y: posY,
                    },
                    location: {x: i, y: j},
                    interactive: true,
                })
                this.fieldContainer.addChild(symbol)

                this.symbolsCollect[i][j] = symbol
            }
        }
        this.addSymbolsLogic()
    }

    async switchSymbol(locationFirst, locationSecond) {
        const locationFirstX = locationFirst[0]
        const locationFirstY = locationFirst[1]
        const locationSecondX = locationSecond[0]
        const locationSecondY = locationSecond[1]
        const tempSymbol = this.symbolsCollect[locationFirstX][locationFirstY]

        this.symbolsCollect[locationFirstX][locationFirstY].moveTo(this.symbolsCollect[locationSecondX][locationSecondY].position, this.symbolsCollect[locationSecondX][locationSecondY].texture.label)
        this.symbolsCollect[locationSecondX][locationSecondY].moveTo(tempSymbol.position, tempSymbol.texture.label)
    }

    addSymbolsLogic() {

        for (let i = 0; i < this.sizeField; i++) {
            for (let j = 0; j < this.sizeField; j++) {
                const currentSymbol = this.symbolsCollect[i][j]

                currentSymbol.cursor = "pointer"

                currentSymbol.on("pointerover", () => {
                    const currentTexture = this.symbolsCollect[i][j].texture.label[0] + this.symbolsCollect[i][j].texture.label[1]
                    currentSymbol.texture = Assets.get(currentTexture + "_pointer.png")
                });

                currentSymbol.on("pointerout", () => {
                    const currentTexture = this.symbolsCollect[i][j].texture.label[0] + this.symbolsCollect[i][j].texture.label[1]
                    currentSymbol.texture = Assets.get(currentTexture + ".png")
                });

                currentSymbol.on("pointerdown", () => {
                    const currentTexture = this.symbolsCollect[i][j].texture.label[0] + this.symbolsCollect[i][j].texture.label[1]
                    currentSymbol.texture = Assets.get(currentTexture + ".png")
                });

                currentSymbol.on("pointerup", () => {
                    this.numberOfChouseSymbol += 1
                    if (this.numberOfChouseSymbol === 1) {
                        this.previousLocation = [i,j]
                    } else if (this.numberOfChouseSymbol === 2) {
                        this.switchSymbol(this.previousLocation, [i,j])
                        this.numberOfChouseSymbol = 0
                    }

                });
            }
        }
    }


    onResize(size) {
        super.onResize(size);
    }
}