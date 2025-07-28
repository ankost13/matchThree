import {Container, Graphics,} from "pixi.js";
import {View} from "../../utils/view";
import gsap from 'gsap';

export class PreloaderView extends View {
    constructor(parent) {
        super(parent);
        this.createBg()

        this.createConfig();
        this.createCirclePreloadProgress();
    }

    createBg() {
        const width = Math.max(window.innerWidth, window.innerHeight);
        this.blackBg = new Graphics();
        this.blackBg.beginFill(0x123);
        this.blackBg.drawRect(0, 0, width, width);
        this.blackBg.endFill();
        this.addChild(this.blackBg);
        this.blackBg.alpha = 1;
    }

    createConfig() {
        this.numDots = 12;          // Кількість точок
        this.radius = 150;           // Радіус кола обертання
        this.dotRadius = 20;         // Радіус кожної точки
        this.colors = [0x3498DB, 0x2ECC71, 0xE74C3C, 0x9B59B6, 0xF39C12];
    }

    createCirclePreloadProgress() {
        this.createLoaderContainer();
        this.playAllLoaderAnimation();
        this.playDotsAnimation();
    }

    playDotsAnimation() {
        this.dots.forEach((dot, i) => {
            gsap.to(dot.scale, {
                x: 1.5,
                y: 1.5,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.1
            });
        });
    }

    playAllLoaderAnimation() {
        gsap.to(this.loaderContainer, {
            rotation: Math.PI * 2,
            duration: 2,
            repeat: -1,
            ease: "linear"
        });
    }

    createLoaderContainer() {
        this.loaderContainer = new Container();
        this.loaderContainer.x = window.innerWidth / 2;
        this.loaderContainer.y = window.innerHeight / 2;
        this.addChild(this.loaderContainer);
        this.dots = [];
        for (let i = 0; i < this.numDots; i++) {
            const dot = new Graphics();
            dot.beginFill(this.colors[i % this.colors.length]);
            dot.drawCircle(0, 0, this.dotRadius);
            dot.endFill();
            const angle = (i / this.numDots) * Math.PI * 2;
            dot.x = Math.cos(angle) * this.radius;
            dot.y = Math.sin(angle) * this.radius;
            this.loaderContainer.addChild(dot);
            this.dots.push(dot);
        }
    }

    hide() {
        gsap.to(this, {
            duration: .3,
            alpha: 0,
            onComplete: () => {
                const parent = this.parent;
                this.parent.removeChild(this);
                parent.destroy({children: true});
            }
        })
    }

}
