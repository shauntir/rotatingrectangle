window.onload = () => {
    var numberToGenerate: number = 3;
    var button = <HTMLButtonElement>document.getElementById('generateButton');
    var numberToGenerateSelect = <HTMLSelectElement>document.getElementById('numberGeneratorSelect');
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
    }

    appRunner.setCanvasWidth();
};

class AppRunner {
    private _inputCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('inputCanvas');
    private _outputCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('outputCanvas');

    runSimulation(numberToGenerate: number) {
        var storageProvider = new StorageProvider.LocalStorageWrapper();

        var blockBuilder = new Block.BlockBuilder(this._inputCanvas, this._outputCanvas, storageProvider);
        blockBuilder.buildRandomBlocks(numberToGenerate);

        var blockBreaker = new Block.BlockBreaker(storageProvider.retrieveBlocks(), this._inputCanvas.clientHeight);
        var newBlocks = blockBreaker.sliceBlocks();

        blockBuilder.buildCustomBlocks(newBlocks);
        storageProvider.storeBlocks(newBlocks);
    }

    setCanvasWidth() {
        var inputWidth = document.getElementById("inputCanvasContainer").offsetWidth;
        var outputWidth = document.getElementById("outputCanvasContainer").offsetWidth;

        this._inputCanvas.width = (90 / 100) * inputWidth;
        this._outputCanvas.width = (90 / 100) * outputWidth;
    }
}