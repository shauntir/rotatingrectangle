module Block {
    export class BlockDimensionModel {
        width: number;
        height: number;
        xCoordinate: number;
        yCoordinate: number;
        id: number;

        static sortByHeightAscending(item1: BlockDimensionModel, item2: BlockDimensionModel) {
            if (item2.height < item1.height) {
                return 1;
            }
            if (item1.height < item2.height) {
                return -1;
            }

            return 0;
        }

        static sortByIdAscending(item1: BlockDimensionModel, item2: BlockDimensionModel) {
            if (item2.id < item1.id) {
                return 1;
            }
            if (item1.id < item2.id) {
                return -1;
            }

            return 0;
        }

        static sortByIdDescending(item1: BlockDimensionModel, item2: BlockDimensionModel) {
            if (item2.id > item1.id) {
                return 1;
            }
            if (item1.id > item2.id) {
                return -1;
            }

            return 0;
        }
    }
} 