var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var array = [];
function createArray(len) {
    var array = [];
    for (var i = 0; i < len; i++) {
        array.push(Math.floor(Math.random() * 100));
    }
    return array;
}
function visualizeArray(array) {
    var arrayDiv = document.getElementById("arrayDiv");
    arrayDiv.innerHTML = ""; // Fjern eventuelle eksisterende bokser
    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        var box = document.createElement("div");
        box.classList.add("box");
        box.style.height = "".concat(value, "px");
        arrayDiv.appendChild(box);
    }
}
function bubbleSort() {
    return new Promise(function (resolve) {
        var len = array.length;
        var swapped;
        var i = 0;
        var j = 0;
        var intervalId = setInterval(function () {
            if (i < len - 1) {
                if (array[j] > array[j + 1]) {
                    var temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    swapped = true;
                }
                j++;
                if (j >= len - i - 1) {
                    if (!swapped) {
                        clearInterval(intervalId);
                        resolve(array);
                    }
                    i++;
                    j = 0;
                    swapped = false;
                }
            }
            else {
                clearInterval(intervalId);
                resolve(array);
            }
            visualizeArray(array);
        }, 10); // Juster forsinkelsen etter behov
    });
}
function sortArray() {
    return __awaiter(this, void 0, void 0, function () {
        var sliderValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sliderValue = parseInt(slider.value);
                    array = createArray(sliderValue);
                    return [4 /*yield*/, bubbleSort()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    var slider = document.getElementById("slider");
    var sliderValue = parseInt(slider.value);
    array = createArray(sliderValue);
    visualizeArray(array);
}
var slider = document.getElementById("slider");
var sliderValueElement = document.getElementById("sliderValue");
slider.addEventListener("input", function () {
    var sliderValue = parseInt(slider.value);
    array = createArray(sliderValue);
    visualizeArray(array);
});
main();
