module Block {
    export interface RandomBlockDimensionGeneratorInterface {
        generateRandomSet(numberOfBlocks: number);
    }

    export class RandomBlockDimensionGenerator implements RandomBlockDimensionGeneratorInterface {
        private _availableWidth: number;
        private _availableHeight: number;
        private _blocksArray: BlockDimensionModel[];
        private _lastXCoordinate: number;
        private _minHeight: number;
        private _minWidth: number;
        private _maxWidth: number;
        private _numberOfBlocks: number;

        constructor(availableWidth: number, availableHeight: number) {
            this._blocksArray = new Array<BlockDimensionModel>();
            this._lastXCoordinate = 0;

            this._availableWidth = availableWidth;
            this._availableHeight = availableHeight;
        }

        generateRandomSet(numberOfBlocks: number) {
            this._numberOfBlocks = numberOfBlocks;
            this._minWidth = 60 / 100 * Math.floor(this._availableWidth / (this._numberOfBlocks));
            this._maxWidth = 135 / 100 * Math.floor(this._availableWidth / (this._numberOfBlocks));
            this._minHeight = 10 / 100 * this._availableHeight;

            this.recursivelyBuildBlockArray(numberOfBlocks);
            return this._blocksArray;
        }

        private buildBlock(blockId: number, isLastIteration: boolean) {
            var block = new BlockDimensionModel();
            block.id = this._numberOfBlocks - blockId +1;
            
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
        }

        //Recursively generate set of block
        private recursivelyBuildBlockArray(numberOfBlocks) {
            if (numberOfBlocks > 0) {
                if (numberOfBlocks === 1) {
                    this.buildBlock(numberOfBlocks, true);
                } else {
                    this.buildBlock(numberOfBlocks, false);
                }

                return this.recursivelyBuildBlockArray(numberOfBlocks - 1);
            } else {
                return numberOfBlocks;
            }
        }
    }
} 