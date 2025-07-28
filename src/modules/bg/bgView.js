import {View} from "../../utils/view";
import {SpineCustom} from "../../utils/spine";

export class BgView extends View {
    constructor(parent, resizeData) {
        super(parent, resizeData);
        this.addTest();
    }

    addTest() {
        const spine = new SpineCustom({
            spineData: "spineboy",
            scale: 1,
            parent: this,
            position: {
                x: 500,
                y: 500,
            }
        })

        spine.playAnimation(0, "Win", true)
    }

}