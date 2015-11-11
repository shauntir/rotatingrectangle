module Block {
    export interface BlockBreakerInterface {
        sliceBlocks();
    }

    export class BlockBreaker implements BlockBreakerInterface {
        private _blocks: BlockDimensionModel[];
        private _slicedBlocks: BlockDimensionModel[];
        private _maxHeight: number;

        constructor(blocks: BlockDimensionModel[], maxHeight: number) {
            this._blocks = blocks;
            this._maxHeight = maxHeight;
        }

        sliceBlocks() {
            this._slicedBlocks = new Array<BlockDimensionModel>();
            var lastHeight = 0;
            var clonedBlocks = this._blocks.slice();

            clonedBlocks.sort((item1, item2) => {
                return BlockDimensionModel.sortByHeightAscending(item1, item2);
            });

            var counter = 0;
            clonedBlocks.forEach(item => {
                //Build corresponding surrounding blocks for current block
                var backwardsBlocksArray = this.buildCorrespondingBlocksArrayReverse(item);
                var compatibleBlocks = backwardsBlocksArray.concat(this.buildCorrespondingBlocksArrayForwards(item));

                compatibleBlocks.push(item);
                compatibleBlocks.sort((item1, item2) => { return BlockDimensionModel.sortByIdAscending(item1, item2); });

                //Build my block vertically
                var block = new BlockDimensionModel();
                block.id = counter + 1;

                block.xCoordinate = compatibleBlocks[0].xCoordinate;
                block.width = compatibleBlocks[compatibleBlocks.length - 1].xCoordinate - block.xCoordinate + compatibleBlocks[compatibleBlocks.length - 1].width;

                block.height = item.height - lastHeight;
                lastHeight = item.height;
                block.yCoordinate = this._maxHeight - lastHeight;

                this._slicedBlocks.push(block);
                counter++;
            });

            //Adjust heights of blocks where higher blocks don't touch the next lowest block
            this.adjustHeights();

            return this._slicedBlocks;
        }

        //Go through all blocks and find adjust the heights for the "floating" blocks
        private adjustHeights() {
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
                    } else if (isCollinearOverlap) {
                        //Add the height for my floating blocks
                        currentBlock.height = currentBlock.height + (blockPosY - innerBlockPosY);
                        break;
                    }
                }
            }

            return this._slicedBlocks;
        }

        //Adapted from: http://stackoverflow.com/questions/15726825/find-overlap-between-collinear-lines
        private isCollinearOverlappingLines(upperBlock: BlockDimensionModel, bottomBlock: BlockDimensionModel) {
            var isCollinearOverlap = ((bottomBlock.xCoordinate + bottomBlock.width) - upperBlock.xCoordinate >= 0
                && (upperBlock.xCoordinate + upperBlock.width) - bottomBlock.xCoordinate >= 0);

            return isCollinearOverlap;
        }

        //Get array of blocks that are larger in height for corresponding block object in a forwards direction
        private buildCorrespondingBlocksArrayForwards(block: BlockDimensionModel) {
            var returnArray = new Array<BlockDimensionModel>();
            var sizeOfArray = this._blocks.length;

            for (var i = block.id; i < sizeOfArray; i++) {
                if (this._blocks[i].height >= block.height) {
                    returnArray.push(this._blocks[i]);
                } else {
                    break;
                }
            }
            return returnArray;
        }

        //Get array of blocks that are larger in height for corresponding block object in a backwards direction
        private buildCorrespondingBlocksArrayReverse(block: BlockDimensionModel) {
            var returnArray = new Array<BlockDimensionModel>();

            for (var i = block.id - 2; i >= 0; i--) {
                if (block.height <= this._blocks[i].height) {
                    returnArray.push(this._blocks[i]);
                } else {
                    break;
                }
            }
            return returnArray;
        }
    }
} 