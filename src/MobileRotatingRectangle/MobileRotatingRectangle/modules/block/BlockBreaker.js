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
                var backwardsBlocksArray = _this.buildCorrespondingBlocksArrayReverse(item);
                var compatibleBlocks = backwardsBlocksArray.concat(_this.buildCorrespondingBlocksArrayForwards(item));
                compatibleBlocks.push(item);
                compatibleBlocks.sort(function (item1, item2) { return Block.BlockDimensionModel.sortByIdAscending(item1, item2); });
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
            this.adjustHeights();
            return this._slicedBlocks;
        };
        BlockBreaker.prototype.adjustHeights = function () {
            for (var i = 1; i < this._slicedBlocks.length; i++) {
                var currentBlock = this._slicedBlocks[i];
                for (var j = this._slicedBlocks[i].id - 1; j > 0; j--) {
                    var bottomBlock = this._slicedBlocks[j - 1];
                    var blockPosY = (this._maxHeight - currentBlock.yCoordinate - currentBlock.height);
                    var innerBlockPosY = (this._maxHeight - bottomBlock.yCoordinate);
                    var isCollinearOverlap = this.isCollinearOverlappingLines(currentBlock, bottomBlock);
                    var doBlocksTouch = (blockPosY === innerBlockPosY) && isCollinearOverlap;
                    if (doBlocksTouch) {
                        break;
                    }
                    else if (isCollinearOverlap) {
                        currentBlock.height = currentBlock.height + (blockPosY - innerBlockPosY);
                        break;
                    }
                }
            }
            return this._slicedBlocks;
        };
        BlockBreaker.prototype.isCollinearOverlappingLines = function (upperBlock, bottomBlock) {
            var isCollinearOverlap = ((bottomBlock.xCoordinate + bottomBlock.width) - upperBlock.xCoordinate >= 0
                && (upperBlock.xCoordinate + upperBlock.width) - bottomBlock.xCoordinate >= 0);
            return isCollinearOverlap;
        };
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
