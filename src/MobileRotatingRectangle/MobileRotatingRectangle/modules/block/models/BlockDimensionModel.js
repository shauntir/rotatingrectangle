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
