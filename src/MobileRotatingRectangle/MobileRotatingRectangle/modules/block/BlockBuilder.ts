module Block {
    export interface BlockBuilderInterface {
        buildRandomBlocks(numberOfBlocks: number);
        buildCustomBlocks(blocks: BlockDimensionModel[]);
    }

    export class BlockBuilder implements BlockBuilderInterface {
        private _inputCanvasElement: HTMLCanvasElement;
        private _outputCanvasElement: HTMLCanvasElement;
        private _randomBlocks: BlockDimensionModel[];
        private _storageProvider: StorageProvider.LocalStorageWrapper;

        constructor(inputCanvas: HTMLCanvasElement, outputCanvas: HTMLCanvasElement, storageProvider: StorageProvider.LocalStorageWrapper) {
            this._inputCanvasElement = inputCanvas;
            this._outputCanvasElement = outputCanvas;
            this._storageProvider = storageProvider;
        }

        buildRandomBlocks(numberOfBlocks: number) {
            this.generateBlockSet(numberOfBlocks);

            this.writeRandomBlocksToStorageProvider();

            var storedBlocks = this._storageProvider.retrieveBlocks();
            var context = this._inputCanvasElement.getContext("2d");
            context.clearRect(0, 0, this._inputCanvasElement.width, this._inputCanvasElement.height);

            this.drawBlocks(context, storedBlocks);
        }

        buildCustomBlocks(blocks: BlockDimensionModel[]) {
            var context = this._outputCanvasElement.getContext("2d");
            context.clearRect(0, 0, this._outputCanvasElement.width, this._outputCanvasElement.height);

            this.drawBlocks(context, blocks);
        }

        private writeRandomBlocksToStorageProvider() {
            this._storageProvider.storeBlocks(this._randomBlocks);
        }

        private drawBlocks(canvasContext: CanvasRenderingContext2D, blocks: BlockDimensionModel[]) {
            //Force reading of blocks back from local storage. This is bad practice and uncessary as the class
            //already has a reference (dependancy), holding an array of blocks which can be easily untilised.
            //See commented out code below the following code for actual best practice. This was done as requested in the requirements document.
            blocks.forEach(item => {
                canvasContext.beginPath();
                canvasContext.rect(item.xCoordinate, item.yCoordinate, item.width, item.height);
                canvasContext.stroke();
                canvasContext.closePath();
            });     

            //this._blocks.forEach(item => {
            //    context.rect(item.xCoordinate, item.yCoordinate, item.width, item.height);
            //    context.stroke();
            //});            
        }

        private generateBlockSet(numberOfBlocks: number) {
            var blockDimensionGenerator = new RandomBlockDimensionGenerator(this._inputCanvasElement.clientWidth, this._inputCanvasElement.height);
            this._randomBlocks = blockDimensionGenerator.generateRandomSet(numberOfBlocks);
        }
    }
} 