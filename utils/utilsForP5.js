function masking(imgS, imgP, progressValue) {
  const threshold = 255 - progressValue * 255;

  // Assuming imgS.pixels and imgP.pixels are Uint8ClampedArray or similar
  const pixelsLength = imgS.width * imgS.height * 4;
  for (let i = 0; i < pixelsLength; i += 4) {
      // Directly access and compute with current pixel data
      const r = imgS.pixels[i];
      const g = imgS.pixels[i + 1];
      const b = imgS.pixels[i + 2];

      // Simplify the conditional check and assignment
      const alphavalue = (r > threshold && g > threshold && b > threshold) ? 255 : 0;
      imgP.pixels[i + 3] = alphavalue;
  }
}


function grayscaleAndInvert(imgToProcess) {
    let imgCopy = imgToProcess.get();
    imgCopy.loadPixels();
    for (let i = 0; i < imgCopy.pixels.length; i += 4) {
        const grayscale = (imgCopy.pixels[i] + imgCopy.pixels[i + 1] + imgCopy.pixels[i + 2]) / 3;
        imgCopy.pixels[i] = 255 - grayscale; 
        imgCopy.pixels[i + 1] = 255 - grayscale; 
        imgCopy.pixels[i + 2] = 255 - grayscale; 
    }
    imgCopy.updatePixels();
    return imgCopy;
}

export { masking, grayscaleAndInvert };