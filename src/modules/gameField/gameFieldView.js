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
        this.isNumberLine = 0
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

        await Promise.all([
            this.symbolsCollect[locationFirstX][locationFirstY].moveTo(this.symbolsCollect[locationSecondX][locationSecondY].position, this.symbolsCollect[locationSecondX][locationSecondY].texture.label),
            this.symbolsCollect[locationSecondX][locationSecondY].moveTo(tempSymbol.position, tempSymbol.texture.label)
        ])
        this.symbolsCollect[locationFirstX][locationFirstY].scale.set(1)
        this.symbolsCollect[locationFirstX][locationFirstY].interactive = true

        this.symbolsCollect[locationSecondX][locationSecondY].scale.set(1)
        this.symbolsCollect[locationSecondX][locationSecondY].interactive = true
    }

    addSymbolsLogic() {
        for (let i = 0; i < this.sizeField; i++) {
            for (let j = 0; j < this.sizeField; j++) {
                const currentSymbol = this.symbolsCollect[i][j]

                currentSymbol.cursor = "pointer"

                currentSymbol.on("pointerover", () => {
                    currentSymbol.scale = 1.3
                });

                currentSymbol.on("pointerout", () => {
                    currentSymbol.scale = 1
                });

                currentSymbol.on("pointerup", async () => {
                    currentSymbol.interactive = false
                    this.numberOfChouseSymbol += 1
                    if (this.numberOfChouseSymbol === 1) {
                        this.previousLocation = [i,j]
                    } else if (this.numberOfChouseSymbol === 2) {
                        if (this.checkNearSymbols(this.previousLocation, [i,j])) {
                           await this.switchSymbol(this.previousLocation, [i,j])
                            await this.checkLine([i,j])
                            await this.checkLine(this.previousLocation)
                            if (!this.isNumberLine) {
                                console.error("!!!NO!!! lines")
                                // ЯКЩО НЕМАЄ ЛІНІЇ МІНЯЄМ СИМВОЛИ НАЗАД
                                // await this.switchSymbol([i,j], this.previousLocation)
                            }
                        } else {
                            this.symbolsCollect[this.previousLocation[0]][this.previousLocation[1]].scale.set(1)
                            this.symbolsCollect[this.previousLocation[0]][this.previousLocation[1]].interactive = true

                            this.symbolsCollect[i][j].scale.set(1)
                            this.symbolsCollect[i][j].interactive = true
                        }
                        this.numberOfChouseSymbol = 0
                        this.isNumberLine = 0
                    }
                });
            }
        }
    }

    checkNearSymbols(previousLocation, currentLocation) {
        const prevX = previousLocation[0]
        const prevY = previousLocation[1]
        const nextX = currentLocation[0]
        const nextY = currentLocation[1]

        return Math.abs(prevX - nextX) + Math.abs(prevY - nextY) === 1;
    }

    checkLine(location) {
        const x = location[0]
        const y = location[1]

        if (x === 0) {
            this.checkEqualSymbolInLine([x, y], [x + 1, y], [x + 2, y])
        } else if (x === 1) {
            this.checkEqualSymbolInLine([x - 1, y], [x, y], [x + 1, y])
            this.checkEqualSymbolInLine([x, y], [x + 1, y], [x + 2, y])
        } else if (x === this.sizeField - 1) {
            // console.error("last row")
              this.checkEqualSymbolInLine([x - 2, y], [x - 1, y], [x, y])
        } else if (x === this.sizeField - 2) {
            // console.error("last last row")
            this.checkEqualSymbolInLine([x - 1, y], [x, y], [x + 1, y])
            this.checkEqualSymbolInLine([x - 2, y], [x - 1, y], [x, y])
        } else {
            this.checkEqualSymbolInLine([x - 1, y], [x, y], [x + 1, y])
            this.checkEqualSymbolInLine([x, y], [x + 1, y], [x + 2, y])
            this.checkEqualSymbolInLine([x - 2, y], [x - 1, y], [x, y])
        }

        if (y === 0) {
            this.checkEqualSymbolInRow([x, y], [x, y + 1], [x, y + 2])
        } else if (y === 1) {
            this.checkEqualSymbolInRow([x, y - 1], [x, y], [x, y + 1])
            this.checkEqualSymbolInRow([x, y], [x, y + 1], [x, y + 2])
        } else if (y === this.sizeField - 1) {
            // console.error("last line")
            this.checkEqualSymbolInRow([x, y - 2], [x, y - 1], [x, y])
        } else if (y === this.sizeField - 2) {
            // console.error("last last line")
            this.checkEqualSymbolInRow([x, y - 1], [x, y], [x, y + 1])
            this.checkEqualSymbolInRow([x, y - 2], [x, y - 1], [x, y])
        } else {
            this.checkEqualSymbolInRow([x, y - 1], [x, y], [x, y + 1])
            this.checkEqualSymbolInRow([x, y], [x, y + 1], [x, y + 2])
            this.checkEqualSymbolInRow([x, y - 2], [x, y - 1], [x, y])
        }
    }

    async checkEqualSymbolInLine(locationFirst, locationSecond, locationThird){
        if(this.checkEqualSymbol(locationFirst, locationSecond, locationThird)) {
            console.error("Line")
            this.fallSymbolWhenLine(locationFirst)
            await setAnimationTimeoutSync(.05)
            this.fallSymbolWhenLine(locationSecond)
            await setAnimationTimeoutSync(.05)
            this.fallSymbolWhenLine(locationThird)
            this.isNumberLine ++
        }
    }

    checkEqualSymbolInRow(locationFirst, locationSecond, locationThird){
        if (this.checkEqualSymbol(locationFirst, locationSecond, locationThird)) {
            console.error("Row")
            const locationLast = Math.max(locationFirst[1], locationSecond[1], locationThird[1])
            this.fallSymbolWhenRow(locationLast)
            // this.isNumberLine ++
        }
    }

    checkEqualSymbol(locationFirst, locationSecond, locationThird) {
        if ((this.symbolsCollect[locationFirst[0]][locationFirst[1]].texture.label === this.symbolsCollect[locationSecond[0]][locationSecond[1]].texture.label) && (this.symbolsCollect[locationThird[0]][locationThird[1]].texture.label === this.symbolsCollect[locationSecond[0]][locationSecond[1]].texture.label)) {
            this.symbolsCollect[locationFirst[0]][locationFirst[1]].texture = Assets.get("ampty")
            this.symbolsCollect[locationSecond[0]][locationSecond[1]].texture  = Assets.get("ampty")
            this.symbolsCollect[locationThird[0]][locationThird[1]].texture = Assets.get("ampty")
            return true;
        }
    }

    async fallSymbolWhenLine(location) {
        const x = location[0]
        let y = location[1]

        while (y >= 0) {
            if (y !== 0) {
                await Promise.all([
                    this.symbolsCollect[x][y].moveTo(this.symbolsCollect[x][y - 1].position, this.symbolsCollect[x][y - 1].texture.label),
                    this.symbolsCollect[x][y - 1].moveTo(this.symbolsCollect[x][y].position, this.symbolsCollect[x][y].texture.label)
                ])
            } else {
                this.newFallingSymbol(x)
            }
            y--
        }
    }

    fallSymbolWhenRow (location) {

    }

    newFallingSymbol(x) {
        console.error(x)
        const textureSymbol = ["S1.png", "S2.png", "S3.png", "S4.png", "S5.png", "S6.png", "S7.png", "S8.png"]
        const currentTexture = textureSymbol[randomInteger(0, 7)]
        // this.amptyLine[x].texture = Assets.get(currentTexture)
    }

    onResize(size) {
        super.onResize(size);
    }
}