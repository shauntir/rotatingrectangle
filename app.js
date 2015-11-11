var Block;
(function (Block) {
    var BlockDimensionModel = (function () {
        function BlockDimensionModel() {
        }
        BlockDimensionModel.sortByHeightAscending = function (item1, item2) {
            if (item2.height < item1.height) {
                return 1;
            }
            if (item1.height < item2.height) {
                return -1;
            }
            return 0;
        };
        BlockDimensionModel.sortByIdAscending = function (item1, item2) {
            if (item2.id < item1.id) {
                return 1;
            }
            if (item1.id < item2.id) {
                return -1;
            }
            return 0;
        };
        BlockDimensionModel.sortByIdDescending = function (item1, item2) {
            if (item2.id > item1.id) {
                return 1;
            }
            if (item1.id > item2.id) {
                return -1;
            }
            return 0;
        };
        return BlockDimensionModel;
    })();
    Block.BlockDimensionModel = BlockDimensionModel;
})(Block || (Block = {}));
var Block;
(function (Block) {
    var RandomBlockDimensionGenerator = (function () {
        function RandomBlockDimensionGenerator(availableWidth, availableHeight) {
            this._blocksArray = new Array();
            this._lastXCoordinate = 0;
            this._availableWidth = availableWidth;
            this._availableHeight = availableHeight;
        }
        RandomBlockDimensionGenerator.prototype.generateRandomSet = function (numberOfBlocks) {
            this._numberOfBlocks = numberOfBlocks;
            this._minWidth = 60 / 100 * Math.floor(this._availableWidth / (this._numberOfBlocks));
            this._maxWidth = 135 / 100 * Math.floor(this._availableWidth / (this._numberOfBlocks));
            this._minHeight = 10 / 100 * this._availableHeight;
            this.recursivelyBuildBlockArray(numberOfBlocks);
            return this._blocksArray;
        };
        RandomBlockDimensionGenerator.prototype.buildBlock = function (blockId, isLastIteration) {
            var block = new Block.BlockDimensionModel();
            block.id = this._numberOfBlocks - blockId + 1;
            //Set height and width
            block.height = Math.floor(Math.random() * (this._availableHeight - this._minHeight) + this._minHeight);
            var currentAvailableWidth = this._maxWidth;
            block.width = Math.floor(Math.random() * (currentAvailableWidth - this._minWidth) + this._minWidth);
            if (isLastIteration) {
                block.width = this._availableWidth;
            }
            this._availableWidth -= block.width;
            //Set coordinates
            block.yCoordinate = this._availableHeight - block.height;
            block.xCoordinate = this._lastXCoordinate;
            this._lastXCoordinate += block.width;
            this._blocksArray.push(block);
        };
        //Recursively generate set of block
        RandomBlockDimensionGenerator.prototype.recursivelyBuildBlockArray = function (numberOfBlocks) {
            if (numberOfBlocks > 0) {
                if (numberOfBlocks === 1) {
                    this.buildBlock(numberOfBlocks, true);
                }
                else {
                    this.buildBlock(numberOfBlocks, false);
                }
                return this.recursivelyBuildBlockArray(numberOfBlocks - 1);
            }
            else {
                return numberOfBlocks;
            }
        };
        return RandomBlockDimensionGenerator;
    })();
    Block.RandomBlockDimensionGenerator = RandomBlockDimensionGenerator;
})(Block || (Block = {}));
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
            //Force reading of blocks back from local storage. This is bad practice and uncessary as the class
            //already has a reference (dependancy), holding an array of blocks which can be easily untilised.
            //See commented out code below the following code for actual best practice. This was done as requested in the requirements document.
            blocks.forEach(function (item) {
                canvasContext.beginPath();
                canvasContext.rect(item.xCoordinate, item.yCoordinate, item.width, item.height);
                canvasContext.stroke();
                canvasContext.closePath();
            });
            //this._blocks.forEach(item => {
            //    context.rect(item.xCoordinate, item.yCoordinate, item.width, item.height);
            //    context.stroke();
            //});            
        };
        BlockBuilder.prototype.generateBlockSet = function (numberOfBlocks) {
            var blockDimensionGenerator = new Block.RandomBlockDimensionGenerator(this._inputCanvasElement.clientWidth, this._inputCanvasElement.height);
            this._randomBlocks = blockDimensionGenerator.generateRandomSet(numberOfBlocks);
        };
        return BlockBuilder;
    })();
    Block.BlockBuilder = BlockBuilder;
})(Block || (Block = {}));
var Block;
(function (Block) {
    var BlockBreaker = (function () {
        function BlockBreaker(blocks, maxHeight) {
            this._blocks = blocks;
            this._maxHeight = maxHeight;
        }
        BlockBreaker.prototype.sliceBlocks = function () {
            var _this = this;
            this._slicedBlocks = new Array();
            var lastHeight = 0;
            var clonedBlocks = this._blocks.slice();
            clonedBlocks.sort(function (item1, item2) {
                return Block.BlockDimensionModel.sortByHeightAscending(item1, item2);
            });
            var counter = 0;
            clonedBlocks.forEach(function (item) {
                //Build corresponding surrounding blocks for current block
                var backwardsBlocksArray = _this.buildCorrespondingBlocksArrayReverse(item);
                var compatibleBlocks = backwardsBlocksArray.concat(_this.buildCorrespondingBlocksArrayForwards(item));
                compatibleBlocks.push(item);
                compatibleBlocks.sort(function (item1, item2) { return Block.BlockDimensionModel.sortByIdAscending(item1, item2); });
                //Build my block vertically
                var block = new Block.BlockDimensionModel();
                block.id = counter + 1;
                block.xCoordinate = compatibleBlocks[0].xCoordinate;
                block.width = compatibleBlocks[compatibleBlocks.length - 1].xCoordinate - block.xCoordinate + compatibleBlocks[compatibleBlocks.length - 1].width;
                block.height = item.height - lastHeight;
                lastHeight = item.height;
                block.yCoordinate = _this._maxHeight - lastHeight;
                _this._slicedBlocks.push(block);
                counter++;
            });
            //Adjust heights of blocks where higher blocks don't touch the next lowest block
            this.adjustHeights();
            return this._slicedBlocks;
        };
        //Go through all blocks and find adjust the heights for the "floating" blocks
        BlockBreaker.prototype.adjustHeights = function () {
            for (var i = 1; i < this._slicedBlocks.length; i++) {
                var currentBlock = this._slicedBlocks[i];
                for (var j = this._slicedBlocks[i].id - 1; j > 0; j--) {
                    var bottomBlock = this._slicedBlocks[j - 1];
                    var blockPosY = (this._maxHeight - currentBlock.yCoordinate - currentBlock.height);
                    var innerBlockPosY = (this._maxHeight - bottomBlock.yCoordinate);
                    //Do my blocks overlap over the x axis?
                    var isCollinearOverlap = this.isCollinearOverlappingLines(currentBlock, bottomBlock);
                    //Do my blocks touch over the x axis and height?
                    var doBlocksTouch = (blockPosY === innerBlockPosY) && isCollinearOverlap;
                    if (doBlocksTouch) {
                        break;
                    }
                    else if (isCollinearOverlap) {
                        //Add the height for my floating blocks
                        currentBlock.height = currentBlock.height + (blockPosY - innerBlockPosY);
                        break;
                    }
                }
            }
            return this._slicedBlocks;
        };
        //Adapted from: http://stackoverflow.com/questions/15726825/find-overlap-between-collinear-lines
        BlockBreaker.prototype.isCollinearOverlappingLines = function (upperBlock, bottomBlock) {
            var isCollinearOverlap = ((bottomBlock.xCoordinate + bottomBlock.width) - upperBlock.xCoordinate >= 0
                && (upperBlock.xCoordinate + upperBlock.width) - bottomBlock.xCoordinate >= 0);
            return isCollinearOverlap;
        };
        //Get array of blocks that are larger in height for corresponding block object in a forwards direction
        BlockBreaker.prototype.buildCorrespondingBlocksArrayForwards = function (block) {
            var returnArray = new Array();
            var sizeOfArray = this._blocks.length;
            for (var i = block.id; i < sizeOfArray; i++) {
                if (this._blocks[i].height >= block.height) {
                    returnArray.push(this._blocks[i]);
                }
                else {
                    break;
                }
            }
            return returnArray;
        };
        //Get array of blocks that are larger in height for corresponding block object in a backwards direction
        BlockBreaker.prototype.buildCorrespondingBlocksArrayReverse = function (block) {
            var returnArray = new Array();
            for (var i = block.id - 2; i >= 0; i--) {
                if (block.height <= this._blocks[i].height) {
                    returnArray.push(this._blocks[i]);
                }
                else {
                    break;
                }
            }
            return returnArray;
        };
        return BlockBreaker;
    })();
    Block.BlockBreaker = BlockBreaker;
})(Block || (Block = {}));
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
/// <reference path="modules/block/models/BlockDimensionModel.ts" /> 
/// <reference path="modules/block/RandomBlockDimensionGenerator.ts" /> 
/// <reference path="modules/block/BlockBuilder.ts" /> 
/// <reference path="modules/block/BlockBreaker.ts" />
/// <reference path="modules/storageprovider/LocalStorageWrapper.ts" />  
window.onload = function () {
    var numberToGenerate = 3;
    var button = document.getElementById('generateButton');
    var numberToGenerateSelect = document.getElementById('numberGeneratorSelect');
    var appRunner = new AppRunner();
    for (var i = 3; i <= 30; i++) {
        var option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = i.toString();
        numberToGenerateSelect.appendChild(option);
    }
    button.onclick = function () {
        numberToGenerate = parseInt(numberToGenerateSelect.value);
        appRunner.runSimulation(numberToGenerate);
    };
    appRunner.setCanvasWidth();
};
var AppRunner = (function () {
    function AppRunner() {
        this._inputCanvas = document.getElementById('inputCanvas');
        this._outputCanvas = document.getElementById('outputCanvas');
    }
    AppRunner.prototype.runSimulation = function (numberToGenerate) {
        var storageProvider = new StorageProvider.LocalStorageWrapper();
        var blockBuilder = new Block.BlockBuilder(this._inputCanvas, this._outputCanvas, storageProvider);
        blockBuilder.buildRandomBlocks(numberToGenerate);
        var blockBreaker = new Block.BlockBreaker(storageProvider.retrieveBlocks(), this._inputCanvas.clientHeight);
        var newBlocks = blockBreaker.sliceBlocks();
        blockBuilder.buildCustomBlocks(newBlocks);
        storageProvider.storeBlocks(newBlocks);
    };
    AppRunner.prototype.setCanvasWidth = function () {
        var inputWidth = document.getElementById("inputCanvasContainer").offsetWidth;
        var outputWidth = document.getElementById("outputCanvasContainer").offsetWidth;
        this._inputCanvas.width = (90 / 100) * inputWidth;
        this._outputCanvas.width = (90 / 100) * outputWidth;
    };
    return AppRunner;
})();
//# sourceMappingURL=app.js.map