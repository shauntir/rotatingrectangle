var BlockCreator;
(function (BlockCreator) {
    var BlockBuilder = (function () {
        function BlockBuilder(element) {
            this.canvasElement = element;
        }
        BlockBuilder.prototype.draw = function () {
            var context = this.canvasElement.getContext("2d");
            context.fillStyle = "#FF0000";
            console.log(this.canvasElement.clientWidth);
            console.log(this.canvasElement.clientHeight);
            var gen = new RandomRectangleDimensionGenerator(this.canvasElement.clientWidth, this.canvasElement.height);
            var rectangles = gen.generate();
            rectangles.forEach(function (item) {
                context.rect(item.xCoordinate, item.yCoordinate, item.width, item.height);
                context.stroke();
            });
            localStorage.setItem("data", JSON.stringify(rectangles));
        };
        return BlockBuilder;
    })();
    BlockCreator.BlockBuilder = BlockBuilder;
    var RandomRectangleDimensionGenerator = (function () {
        function RandomRectangleDimensionGenerator(availableWidth, availableHeight) {
            this.rectangleDimensions = new RectangleDimensionModel();
            this.rectangles = new Array();
            this.lastXCoordinate = 0;
            this._availableWidth = availableWidth;
            this._availableHeight = availableHeight;
        }
        RandomRectangleDimensionGenerator.prototype.generate = function () {
            this.recursiveFunction(5);
            return this.rectangles;
        };
        RandomRectangleDimensionGenerator.prototype.buildBlock = function (blockId, isLastIteration) {
            var block = new RectangleDimensionModel();
            block.id = blockId;
            var currentAvailableWidth = Math.floor(this._availableWidth / 2);
            block.height = Math.floor(Math.random() * this._availableHeight);
            block.width = Math.floor(Math.random() * currentAvailableWidth);
            if (isLastIteration) {
                block.width = this._availableWidth;
            }
            this._availableWidth -= block.width;
            block.yCoordinate = this._availableHeight - block.height;
            block.xCoordinate = this.lastXCoordinate;
            this.lastXCoordinate += block.width;
            this.rectangles.push(block);
        };
        RandomRectangleDimensionGenerator.prototype.recursiveFunction = function (numberOfBlocks) {
            if (numberOfBlocks > 0) {
                if (numberOfBlocks === 1) {
                    this.buildBlock(numberOfBlocks, true);
                }
                else {
                    this.buildBlock(numberOfBlocks, false);
                }
                return this.recursiveFunction(numberOfBlocks - 1);
            }
            else {
                return numberOfBlocks;
            }
        };
        return RandomRectangleDimensionGenerator;
    })();
    BlockCreator.RandomRectangleDimensionGenerator = RandomRectangleDimensionGenerator;
    var RectangleDimensionModel = (function () {
        function RectangleDimensionModel() {
        }
        return RectangleDimensionModel;
    })();
    BlockCreator.RectangleDimensionModel = RectangleDimensionModel;
})(BlockCreator || (BlockCreator = {}));
//# sourceMappingURL=BlockCreator.js.map