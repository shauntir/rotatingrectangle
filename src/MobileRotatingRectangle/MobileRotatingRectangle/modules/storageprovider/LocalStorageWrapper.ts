module StorageProvider {

    export interface LocalStorageWrapperInterface {
        storeBlocks(blocks: Block.BlockDimensionModel[]);
        retrieveBlocks();
    }

    export class LocalStorageWrapper implements LocalStorageWrapperInterface {
        private _storage: Storage;
        private _key: string;

        constructor() {
            this._storage = localStorage;
            this._key = "blocks";
        }

        storeBlocks(blocks: Block.BlockDimensionModel[]) {
            var blocksToJsonString = JSON.stringify(blocks);
            this._storage.setItem(this._key, blocksToJsonString);
        }

        retrieveBlocks() {
            var blocks = this._storage.getItem(this._key);
            return <Block.BlockDimensionModel[]>JSON.parse(blocks);
        }
    }
}