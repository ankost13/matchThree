export const manifest = {
    bundles: [
        {
            name: "gameAssets",
            assetsImg: {
                test: {src: "./assets/img/icon.png"},
            },

            spineAssets: {
                spineboy: {
                    type: "spine",
                    json: "./assets/spine/test_task.json"
                },
            }
        }
    ]
}