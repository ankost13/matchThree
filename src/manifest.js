export const manifest = {
    bundles: [
        {
            name: "gameAssets",
            assetsImg: {
                test: {src: "./assets/img/icon.png"},
                bg: {src: "./assets/img/bg.png"},
                buttons: {src: "./assets/img/buttons.json"},
                symbols: {src: "./assets/img/symbols/symbols.json"},
                bgField: {src: "./assets/img/symbols/bg.jpg"},
            },

            spineAssets: {
                spineboy: {
                    type: "spine",
                    json: "./assets/spine/windmill/windmill-ess.json"
                },
            }
        }
    ]
}