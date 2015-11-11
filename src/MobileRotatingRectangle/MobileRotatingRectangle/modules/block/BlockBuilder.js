var Block;
(function (Block) {
    var BlockBuilder = (function () {
        function BlockBuilder(inputCanvas, outputCanvas, storageProvider) {
            this._inputCanvasElement = inputCanvas;
            this._outputCanvasElement = outputCanvas;
            this._storageProvider = storageProvider;
        }
        BlockBuilder.prototype.buildRandomBlocks = function (numberOfBlocks) {
            this.generateBlockSet(numberOfBlocks);
            this.writeRandomBlocksToStorageProvider();
            var storedBlocks = this._storageProvider.retrieveBlocks();
            var context = this._inputCanvasElement.getContext("2d");
            context.clearRect(0, 0, this._inputCanvasElement.width, this._inputCanvasElement.height);
            this.drawBlocks(context, storedBlocks);
        };
        BlockBuilder.prototype.buildCustomBlocks = function (blocks) {
            var context = this._outputCanvasElement.getContext("2d");
            context.clearRect(0, 0, this._outputCanvasElement.width, this._outputCanvasElement.height);
            this.drawBlocks(context, blocks);
        };
        BlockBuilder.prototype.writeRandomBlocksToStorageProvider = function () {
            this._storageProvider.storeBlocks(this._randomBlocks);
        };
        BlockBuilder.prototype.drawBlocks = function (canvasContext, blocks) {
            blocks.forEach(function (item) {
                canvasContext.beginPath();
                canvasContext.rect(item.xCoordinate, item.yCoordinate, item.width, item.height);
                canvasContext.stroke();
                canvasContext.closePath();
            });
        };
        BlockBuilder.prototype.generateBlockSet = function (numberOfBlocks) {
            var blockDimensionGenerator = new Block.RandomBlockDimensionGenerator(this._inputCanvasElement.clientWidth, this._inputCanvasElement.height);
            this._randomBlocks = blockDimensionGenerator.generateRandomSet(numberOfBlocks);
        };
        return BlockBuilder;
    })();
    Block.BlockBuilder = BlockBuilder;
})(Block || (Block = {}));
