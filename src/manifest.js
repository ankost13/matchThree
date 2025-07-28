export const manifest = {
    bundles: [
        {
            name: "gameAssets",
            assetsImg: {
                test: {src: "./assets/img/icon.png"},
                bg: {src: "./assets/img/bg.png"},
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