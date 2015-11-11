var StorageProvider;
(function (StorageProvider) {
    var LocalStorageWrapper = (function () {
        function LocalStorageWrapper() {
            this._storage = localStorage;
            this._key = "blocks";
        }
        LocalStorageWrapper.prototype.storeBlocks = function (blocks) {
            var blocksToJsonString = JSON.stringify(blocks);
            this._storage.setItem(this._key, blocksToJsonString);
        };
        LocalStorageWrapper.prototype.retrieveBlocks = function () {
            var blocks = this._storage.getItem(this._key);
            return JSON.parse(blocks);
        };
        return LocalStorageWrapper;
    })();
    StorageProvider.LocalStorageWrapper = LocalStorageWrapper;
})(StorageProvider || (StorageProvider = {}));
