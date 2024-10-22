/**
 * getImgFromUrl
 *
 * @param base64
 */
export async function getImgFromUrl(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      resolve(img);
    };
  });
}
