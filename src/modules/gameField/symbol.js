import {Assets, Sprite} from "pixi.js";
import gsap from 'gsap';

export class Symbol extends Sprite {
    constructor(data) {
        super(data);
        this.id = data.id;
        this.location = data.location // {x, y}
    }

    moveTo(position, newTexture) {
        return new Promise((resolve) => {
            const startPos = this.position
            gsap.timeline()
                .to(this, {
                    duration: .5,
                    x: position.x,
                    y: position.y,
                })
                .to(this, {
                    duration: 0,
                    x: startPos.x,
                    y: startPos.y,
                    onComplete: () => {
                        this.texture = Assets.get(newTexture)
                        resolve()
                    }
                })
        })
    }

    destroyMe() {
        gsap.timeline()
            .to(this.scale, {
                duration: .1,
                x: 1.2,
                y: 1.2
            })
            .to(this.scale, {
                duration: .1,
                x: 1,
                y: 1,
                onComplete: () => {
                    this.destroy()
                }
            })
    }
}