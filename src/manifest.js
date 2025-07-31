export const manifest = {
    bundles: [
        {
            name: "gameAssets",
            assetsImg: {
                bg: {src: "/src/assets/img/bg.png"},
                buttons: {src: "/src/assets/img/buttons.json"},
                symbols: {src: "/src/assets/img/symbols/symbols.json"},
                bgField: {src: "/src/assets/img/symbols/bg.png"},
            },

            spineAssets: {
                spineboy: {
                    type: "spine",
                    json: "/src/assets/spine/windmill/windmill-ess.json"
                },
            }
        }
    ]
}