// This is a modified version of https://github.com/kig/canvasfilters
// @authors: Ilmari Heikkinen, Andre Venancio
// @date: 30 June 2016
var CanvasFilters = CanvasFilters || {

  getCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },

  getPixels(img) {
    const c = CanvasFilters.getCanvas(img.width, img.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, c.width, c.height);
  },

  filterImage(filter, image) {
    const args = [CanvasFilters.getPixels(image)];
    let i = 0;
    for (i = 2; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return filter.apply(null, args);
  },

  grayscale(pixels, contrast, brightness) {
    // https://en.wikipedia.org/wiki/Relative_luminance
    const d = pixels.data;
    let i = 0;
    for (i = 0; i < d.length; i += 4) {
      const r = d[i + 0];
      const g = d[i + 1];
      const b = d[i + 2];
      const a = d[i + 3];
      let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      if (contrast && brightness) {
        v /= a;

        // Apply contrast.
        v = ((v - 0.5) * Math.max(contrast, 0)) + 0.5;

        // Apply brightness.
        v += brightness;

        // Return final pixel color.
        v *= a;
      }

      d[i + 0] = d[i + 1] = d[i + 2] = v;
    }
    return pixels;
  },

  threshold(pixels, threshold) {
    const d = pixels.data;
    let i = 0;
    for (i = 0; i < d.length; i += 4) {
      const r = d[i + 0];
      const g = d[i + 1];
      const b = d[i + 2];
      let v = 0;
      if ((r + g + b) > threshold) {
        v = 255;
      }
      d[i + 0] = d[i + 1] = d[i + 2] = v;
    }
    return pixels;
  },
};