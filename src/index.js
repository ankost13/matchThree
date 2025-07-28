import {App} from "./app/app";

const app = new App
await app.init({
    background: '#123',
    width: window.innerWidth,
    height: window.innerHeight,
    // resolution: window.devicePixelRatio || 1,
    autoResize: true,
    resizeTo: window,
});

document.body.appendChild(app.canvas);
globalThis.__PIXI_APP__ = app;