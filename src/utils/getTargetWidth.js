/**
 * get target width
 * @param expectWidth
 * @param lastWidth
 * @param transitionRate
 */
export default function getTargetRate(expectWidth, lastWidth, transitionRate) {
    if (!transitionRate || !lastWidth) {
        return expectWidth;
    }
    var targetWidth;
    if (expectWidth > lastWidth) {
        // 变大
        var maxWidth = lastWidth * (1 + transitionRate);
        targetWidth = expectWidth > maxWidth ? maxWidth : expectWidth;
    }
    else {
        // 变小
        var minWidth = lastWidth * (1 - transitionRate);
        targetWidth = expectWidth < minWidth ? minWidth : expectWidth;
    }
    // console.log('zz -> ', expectWidth, lastWidth, transitionRate, '->', targetWidth);
    return targetWidth;
}
