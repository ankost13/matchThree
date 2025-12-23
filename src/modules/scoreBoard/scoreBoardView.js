import {View} from "../../utils/view.js";
import {Assets, BitmapText, Container, Sprite} from "pixi.js";
import gsap from "gsap";

export class ScoreBoardView extends View {

    constructor(parent, resizeData) {
        super(parent, resizeData);
        this.createBoardContainer()
        this.addScoreBoard()
    }
    
    createBoardContainer() {
        this.boardContainer = new Container()
        this.boardContainer.position.set(this.size.width * .2, this.size.height * .15)
        this.boardContainer.visible = false
        this.addChild(this.boardContainer)
    }

    addScoreBoard() {
        this.scoreBoard = new Sprite ({
            texture: Assets.get("bgField"),
            alpha: .35,
            anchor: 0.5,
            scale: {
                x: 0.5,
                y: 0.4,
            },
        })
        this.boardContainer.addChild(this.scoreBoard)
        this.addDefaultText()
    }

    addDefaultText(){
        this.defaultText = new BitmapText({
            text: "YOUR SCORE:",
            style: {
                fontFamily: 'Desyrel',
                fontSize: 30,
                fill: "#FFF5EE"
            },
            anchor: 0.5,
        });
        this.defaultText.position.y = this.scoreBoard.height * -0.25;
        this.boardContainer.addChild(this.defaultText);
        this.createScoreText()
        this.createProgressText()
        this.createRuleSign()
    }

    createScoreText() {
        this.scoreText = new BitmapText({
            text: "",
            style: {
                fontFamily: 'Desyrel',
                fontSize: 30,
                fill: "#FFF5EE"
            },
            anchor: 0.5,
        });
        this.boardContainer.addChild(this.scoreText);
    }

    updateScoreValue(value) {
        this.scoreText.text = value
    }

    createProgressText() {
        this.progressText = new BitmapText({
            text: "",
            style: {
                fontFamily: 'Desyrel',
                fontSize: 35,
                fill: "#FFF5EE"
            },
            x: 80,
            anchor: 0.5,
            alpha: 0,
        });
        this.boardContainer.addChild(this.progressText);
    }

    progressAnim(valueText) {
        if (valueText > 0) {
            this.progressText.text = "+" + valueText
            this.progressText.style.fill = "#ADFF2F"
        } else {
            this.progressText.text = valueText
            this.progressText.style.fill = "#FFA07A"
        }

        let tl = gsap.timeline();
        const duration = 1
        tl.to(this.progressText, {
            alpha: 1,
            duration: duration,
            ease: "sine.inOut",
        });
        tl.to(this.progressText, {
            alpha: 0,
            duration: duration,
            ease: "sine.inOut",
        });
    }

    createRuleSign() {
        this.ruleSign = new BitmapText({
            text: "?",
            style: {
                fontFamily: 'Desyrel',
                fontSize: 35,
                fill: "#FFF5EE"
            },
            x: -120,
            y: 80,
            anchor: 0.5,
            interactive: true,
        });
        this.boardContainer.addChild(this.ruleSign);
        this.createRuleBoard()
        this.setInteractiveOnRuleSign()
    }

    setInteractiveOnRuleSign() {
        this.ruleSign.cursor = "pointer"

        this.ruleSign.on("pointerover", () => {
            this.showRule()
        });

        this.ruleSign.on("pointerout", () => {
            this.hideRule()
        });
    }

    createRuleBoard() {
        this.ruleBoard = new Sprite ({
            texture: Assets.get("bgField"),
            alpha: .44,
            anchor: 0.5,
            scale: {
                x: 0.5,
                y: 0.25,
            },
            y: 210,
            visible: false,
        })
        this.boardContainer.addChild(this.ruleBoard)
        this.createRuleText()
    }

    createRuleText() {
        this.ruleText = new BitmapText({
            text: "You will receive 10 points for each symbol in a formed line, if the move does not result in a formed line, the number of points is reduced by 20",
            style: {
                fontFamily: 'Desyrel',
                fontSize: 20,
                fill: "#FFF5EE",
                wordWrap: true,
                wordWrapWidth: 250,
            },
            y: 210,
            anchor: 0.5,
            visible: false,
        });
        this.boardContainer.addChild(this.ruleText)
    }

    showRule() {
        this.ruleBoard.visible = true
        this.ruleText.visible = true
    }

    hideRule() {
        this.ruleBoard.visible = false
        this.ruleText.visible = false
    }

}