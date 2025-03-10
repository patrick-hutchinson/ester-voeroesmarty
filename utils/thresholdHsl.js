import rgbToHsl from "./rgbToHsl";

const thresholdHsl = (pixels, lower, upper) => {
    let d = pixels.data;
    let createTest = function(lower, upper) {
        return lower <= upper ?
            function(v) {
                return lower <= v && v <= upper;
            } :
            function(v) {
                return lower <= v || v <= upper;
            };
    }
    let h = createTest(lower[0], upper[0]);
    let s = createTest(lower[1], upper[1]);
    let l = createTest(lower[2], upper[2]);

    for (let i = 0; i < d.length; i += 4) {
        let hsl = rgbToHsl(d[i], d[i + 1], d[i + 2]);
        if (!h(hsl[0]) || !s(hsl[1]) || !l(hsl[2])) {
            d[i + 3] = 0;
        }
    }
}

export default thresholdHsl;