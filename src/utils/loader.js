import { Assets, Texture } from "pixi.js";
import {
    AtlasAttachmentLoader,
    SkeletonJson,
    SpineTexture,
    TextureAtlas,
} from "@esotericsoftware/spine-pixi-v8";

export class AssetLoader {
    constructor() {
        this.spineCache = new Map();
    }

    async loadPreloaderAssets(manifest) {
        await Assets.init({ manifest: this._buildAssetsManifest(manifest) });

        const preloaderBundle = manifest.bundles.find(b => b.name === "preloaderAssets");
        if (!preloaderBundle) return;

        await Assets.loadBundle("preloaderAssets");

        if (preloaderBundle.spineAssets) {
            for (const [key, config] of Object.entries(preloaderBundle.spineAssets)) {
                await this.loadSingleSpineAsset(key, config);
            }
        }
    }

    async loadAssets(manifest) {
        await Assets.init({ manifest: this._buildAssetsManifest(manifest) });
        const gameBundle = manifest.bundles.find(b => b.name === "gameAssets");
        if (!gameBundle) return;

        const spineEntries = Object.entries(gameBundle.spineAssets || {});
        const imageEntries = Object.entries(gameBundle.assetsImg || {});

        const total = spineEntries.length + imageEntries.length;
        let loaded = 0;

        for (const [key, config] of imageEntries) {
            await Assets.load(key);
            loaded++;
            this._updateProgress(loaded, total);
        }

        for (const [key, config] of spineEntries) {
            await this.loadSingleSpineAsset(key, config);
            loaded++;
            this._updateProgress(loaded, total);
        }
    }

    async loadSingleSpineAsset(key, config) {
        const jsonUrl = config.json;
        const basePath = jsonUrl.substring(0, jsonUrl.lastIndexOf("/"));
        const baseName = jsonUrl.split("/").pop().replace(".json", "");
        const atlasUrl = `${basePath}/${baseName}.atlas`;

        const atlasText = await (await fetch(atlasUrl)).text();
        const atlas = new TextureAtlas(atlasText);

        const textureMap = {};

        for (const page of atlas.pages) {
            const imagePath = `${basePath}/${page.name}`;
            const rawImage = await Assets.load(imagePath);
            const texture = rawImage instanceof Texture ? rawImage : Texture.from(rawImage);
            textureMap[page.name] = new SpineTexture(texture.baseTexture);
        }

        for (const page of atlas.pages) {
            const spineTexture = textureMap[page.name];
            if (!spineTexture) {
                console.warn(`Texture for page "${page.name}" not found`);
                continue;
            }
            page.setTexture(spineTexture);
        }

        const rawJson = await (await fetch(jsonUrl)).json();
        const attachmentLoader = new AtlasAttachmentLoader(atlas);
        const jsonParser = new SkeletonJson(attachmentLoader);
        jsonParser.scale = 1;
        const skeletonData = jsonParser.readSkeletonData(rawJson);

        this.spineCache.set(key, skeletonData);
    }

    getSpineData(key) {
        return this.spineCache.get(key);
    }

    _updateProgress(loaded, total) {
        const percent = (loaded / total) * 100;
    }

    // 🛠️ Метод для трансформації вашого кастомного маніфеста в той, який розуміє Pixi Assets
    _buildAssetsManifest(originalManifest) {
        const bundles = originalManifest.bundles.map(bundle => {
            const assets = {};

            if (bundle.assetsImg) {
                for (const [key, asset] of Object.entries(bundle.assetsImg)) {
                    assets[key] = { src: asset.src };
                }
            }

            return {
                name: bundle.name,
                assets
            };
        });

        return { bundles };
    }
}
