/**
 * get target width
 * @param expectWidth
 * @param lastWidth
 * @param transitionRate
 */

export default function getTargetRate(
  expectWidth: number,
  lastWidth: number,
  transitionRate: number,
) {
  if (!transitionRate || !lastWidth) {
    return expectWidth;
  }
  let targetWidth;
  if (expectWidth > lastWidth) {
    // 变大
    const maxWidth = lastWidth * (1 + transitionRate);
    targetWidth = expectWidth > maxWidth ? maxWidth : expectWidth;
  } else {
    // 变小
    const minWidth = lastWidth * (1 - transitionRate);
    targetWidth = expectWidth < minWidth ? minWidth : expectWidth;
  }
  // console.log('zz -> ', expectWidth, lastWidth, transitionRate, '->', targetWidth);
  return targetWidth;
}
