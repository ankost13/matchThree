import {Spine} from "@esotericsoftware/spine-pixi-v8";

export class SpineCustom extends Spine {
    constructor(spineData) {
        super(window.loader.getSpineData(spineData.spineData));

        this.scale.set(spineData?.scale || 1)
        if (spineData?.position) {
            this.position.x = spineData.position.x || 0
            this.position.y = spineData.position.y || 0
        }
        spineData.parent.addChild(this)
    }

    playAnimation(trackIndex, animationName, loop = true) {
        this.state?.setAnimation(trackIndex, animationName, loop);
    }

    playAnimationSync(skeleton, trackIndex, animationName) {
        return new Promise((resolve) => {
            const trackEntry = skeleton.state.setAnimation(trackIndex, animationName, false);
            trackEntry.listener = {
                complete: () => {
                    resolve();
                }
            };
        });
    }

    setSkinByName(skinName) {
        if (this.skeleton?.setSkin) {
            this.skeleton.setSkinByName(skinName);
            this.skeleton.setSlotsToSetupPose();
        }
    }

    getTrackIndexAnimationName(trackIndex) {
        return this.state?.getCurrent(trackIndex)?.animation?.name;
    }

    stopAnimation(index, moveToSetupPose = true) {
        this.state.clearListenerNotifications();
        this.state.clearListeners();
        this.state.listeners = [];
        if (moveToSetupPose) {
            this.skeleton.setToSetupPose();
        }
        this.state.clearTrack(index);
        this.state.setEmptyAnimation(index, 0);
        this.state.tracks = [];
    }

    addContainerToSlot(nameSlot, container) {
        this.addSlotObject(nameSlot, container)
    }

    addSpineEventListener(eventName) {
        return new Promise((resolve, reject) => {
            if (!this.state.events.find((event) => event.data.name === eventName)) {
                reject(`Event ${eventName} does not exist in spine`)
            }
            const listener = {
                event: (entry, event) => {
                    if (event.data.name === eventName) {
                        resolve()
                    }
                }
            };
            this.state.addListener(listener)
        })
    }
}