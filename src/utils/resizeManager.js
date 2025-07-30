let instance = null

export class ResizeManager {

    constructor() {
        this.listUI = [];
        this.onResize();
        const resizeEvent = new Event("resize");
        window.dispatchEvent(resizeEvent);
        this.preventPageZoom()
    }

    registerUI(view) {
        this.listUI.push(view);
    }

    static getInstance() {
        if (instance == null) {
            instance = new ResizeManager();
        }

        return instance;
    }

    onResize() {
        window.addEventListener("resize", (e) => {
            setTimeout( ()=> {
                this.resizeData = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    pixelRatio: window.innerWidth / window.innerHeight
                }
                this.listUI.forEach(ui => {
                    ui.onResize(this.resizeData);
                });
            }, 0)
        });

    }

    preventPageZoom() {
        window.addEventListener('wheel', (e)=> {
            if (e.ctrlKey) {
                e.preventDefault()
            }
        }, { passive: false })

        window.addEventListener('keydown', (e)=> {
            if (e.ctrlKey || e.metaKey) {
                const zoomKeys = ['+', '-', '=', '0']
                if (zoomKeys.includes(e.key)) {
                    e.preventDefault()
                }
                if ([187, 189, 48].includes(e.keyCode)) {
                    e.preventDefault()
                }
            }
        })

    }

    getResizeData() {
        return this.resizeData;
    }
}
