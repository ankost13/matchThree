import { Howl } from 'howler';

let instance = null;

export class SoundsManager {

    loadSounds(soundsData) {
        return new Promise((resolve) => {
            this.sounds = [];
            let downloadSounds = 0;
            if (!soundsData) resolve();

            soundsData.forEach((item) => {
                const sound = new Howl({
                    ...item,
                    onload: () => {
                        downloadSounds++;
                        if (downloadSounds === soundsData.length) {
                            resolve();
                        }
                    }
                });
                sound.name = item.name;
                this.sounds.push(sound);
            });
        })

    }

    static getInstance() {
        if (instance === null) {
            instance =  new SoundsManager();
        }

        return instance;
    }

    play(soundName, volume) {
        let sound = null;
        this.sounds.forEach( el=> {
            if (el.name === soundName) {
                sound = el
            }
        })

        if (sound) {
            sound.play();
            if (volume) {
                sound.volume(volume);
            }
        } else {
            console.error(`Звук "${soundName}" не знайдено.`);
        }
    }

}
