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
            block.height = Math.floor(Math.random() * (this._availableHeight - this._minHeight) + this._minHeight);
            var currentAvailableWidth = this._maxWidth;
            block.width = Math.floor(Math.random() * (currentAvailableWidth - this._minWidth) + this._minWidth);
            if (isLastIteration) {
                block.width = this._availableWidth;
            }
            this._availableWidth -= block.width;
            block.yCoordinate = this._availableHeight - block.height;
            block.xCoordinate = this._lastXCoordinate;
            this._lastXCoordinate += block.width;
            this._blocksArray.push(block);
        };
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
