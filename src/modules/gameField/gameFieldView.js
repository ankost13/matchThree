import {View} from "../../utils/view";
import {Assets, Container, Graphics, Sprite} from "pixi.js";
import {randomInteger, setAnimationTimeoutSync} from "../../utils/helperFunction";
import {Symbol} from "./symbol";
import gsap from 'gsap';

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
            scale: 1.52,
            position: {
                x: this.symbolSize * (this.sizeField / 2 - .5),
                y: this.symbolSize * (this.sizeField / 2 - .5),
            },
        })
        const bgMask = new Graphics()
            .beginFill(0xffffff)
            .rect((-this.symbolSize)/ 2, (-this.symbolSize)/ 2, bgField.width, bgField.height)
            .endFill();
        this.fieldContainer.addChild(bgField)
        this.fieldContainer.addChild(bgMask)
        this.fieldContainer.mask = bgMask
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
                            await this.checkEqualSymbolInLine([i,j])
                            await this.checkEqualSymbolInRow([i,j])
                            await this.checkEqualSymbolInLine(this.previousLocation)
                            await this.checkEqualSymbolInRow(this.previousLocation)
                            if (!this.isNumberLine) {
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

    async checkEqualSymbolInLine(location){
        const matched = this.checkEqualSymbolInVertical(location)
        if(matched) {
            for (const item of matched) {
                this.fallSymbol(item);
                await setAnimationTimeoutSync(0.05);
            }
            this.isNumberLine ++
        }
    }

    async checkEqualSymbolInRow(location){
        const matched = this.checkEqualSymbolHorisontal(location)
        if (matched) {
            const maxCol = Math.max(...matched.map(item => item[1]))
            this.fallSymbol([matched[0][0], maxCol], matched.length)
            this.isNumberLine ++
        }
    }

    checkEqualSymbolHorisontal(location) {
        const row = location[0];
        const col = location[1];

        const targetLabel = this.symbolsCollect[row][col].texture.label;

        let matched = [[row, col]];

        // Перевіряємо вліво
        let c = col - 1;
        while (c >= 0 && this.symbolsCollect[row][c].texture.label === targetLabel) {
            matched.push([row, c]);
            c--;
        }

        // Перевіряємо вправо
        c = col + 1;
        while (c < this.symbolsCollect[row].length && this.symbolsCollect[row][c].texture.label === targetLabel) {
            matched.push([row, c]);
            c++;
        }

        // Якщо менше трьох — нічого не робимо
        if (matched.length < 3) return false;

        // Якщо три або більше — очищаємо всі
        for (let [r, c] of matched) {
            this.symbolsCollect[r][c].texture = Assets.get("ampty");
        }
        return matched;
    }

    checkEqualSymbolInVertical(location) {
        const row = location[0];
        const col = location[1];

        const targetLabel = this.symbolsCollect[row][col].texture.label;

        let matched = [[row, col]];

        // Перевіряємо вверх
        let r = row - 1;
        while (r >= 0 && this.symbolsCollect[r][col].texture.label === targetLabel) {
            matched.push([r, col]);
            r--;
        }

        // Перевіряємо вниз
        r = row + 1;
        while (r < this.symbolsCollect.length && this.symbolsCollect[r][col].texture.label === targetLabel) {
            matched.push([r, col]);
            r++;
        }

        // Якщо менше трьох — нічого не робимо
        if (matched.length < 3) return false;

        // Якщо три або більше — очищаємо всі
        for (let [r, c] of matched) {
            this.symbolsCollect[r][c].texture = Assets.get("ampty");
        }

        return matched;
    }

    async fallSymbol(location, numberFollingSymbols = 1) {
        const x = location[0]
        let y = location[1]

        while (y >= numberFollingSymbols - 1) {
            if (y !== numberFollingSymbols - 1) {
                await Promise.all([
                    this.symbolsCollect[x][y].moveTo(this.symbolsCollect[x][y - numberFollingSymbols].position, this.symbolsCollect[x][y - numberFollingSymbols].texture.label),
                    this.symbolsCollect[x][y - numberFollingSymbols].moveTo(this.symbolsCollect[x][y].position, this.symbolsCollect[x][y].texture.label)
                ])
            } else {
                this.newFallingSymbol(x, numberFollingSymbols)
            }
            y--
        }
    }

    newFallingSymbol(locationX, numberFollingSymbols) {
        const textureSymbol = ["S1.png", "S2.png", "S3.png", "S4.png", "S5.png", "S6.png", "S7.png", "S8.png"]
        let currentTexture = ""
        let currentPosition = []

        if (numberFollingSymbols === 1){
            currentTexture = textureSymbol[randomInteger(0, 7)]
            currentPosition = [this.symbolsCollect[locationX][0].position.x, this.symbolsCollect[locationX][0].position.y]
            this.follingAnimOfNewsymbols(locationX, 0, currentPosition[0], currentPosition[1], currentTexture)
        } else {
            for (let i = 0; i < numberFollingSymbols; i++){
                currentTexture = textureSymbol[randomInteger(0, 7)]
                currentPosition = [this.symbolsCollect[locationX][i].position.x, this.symbolsCollect[locationX][i].position.y]
                this.follingAnimOfNewsymbols(locationX, i, currentPosition[0], currentPosition[1], currentTexture)
            }
        }
    }

    follingAnimOfNewsymbols(locX, locY, posX, posY, texture) {
        this.symbolsCollect[locX][locY].position.set(posX, -this.symbolSize)
        this.symbolsCollect[locX][locY].texture  = Assets.get(texture)

        let tl = gsap.timeline();
        const duration = .5
        // Спочатку "вільне падіння" з прискоренням
        tl.to(this.symbolsCollect[locX][locY], {
            x: posX,
            y: posY,
            duration: duration,
            ease: "power2.in" // прискорення вниз
        });

        // Потім легкий відскок після удару
        tl.to(this.symbolsCollect[locX][locY], {
            y: posY - 30,
            duration: 0.3,
            ease: "power2.out"
        });
        tl.to(this.symbolsCollect[locX][locY], {
            y: posY,
            duration: 0.2,
            ease: "bounce.out"
        });
    }

    onResize(size) {
        super.onResize(size);
    }
}