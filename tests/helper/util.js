/**
 * Capture a stream that cannot be read from by monkey-patching the `write`
 * method. Typically only necessary for a standard stream like `process.stdout`
 * or `process.stderr`.
 *
 * @param {WritableStream} stream the stream to capture
 * @param {object} options whether to pass the written data through to the
 * default `write` method or swallow it. Defaults to `true`.
 * @returns {object} an object with a single function `stopCapture` which
 * reverts the `write` method back to its default and returns data captured
 * since capture was started.
 */
const startCapture = (stream, options = { swallow: true }) => {
  const defaultWrite = stream.write;
  const chunks = [];

  stream.write = ((write) => {
    // cannot be an arrow function
    return function (chunk, encoding, callback) {
      chunks.push(chunk);
      if (!options.swallow) {
        return write.apply(stream, arguments);
      }
    };
  })(defaultWrite);

  return {
    stopCapture: () => {
      stream.write = defaultWrite;
      return chunks.join("");
    },
  };
};

/**
 * @param {string} params params in the format key="value" delimited by
 * whitespace
 */
const parseParams = (params) => {
  return params.split(/\s+/).reduce((parsedParams, param) => {
    const [key, quotedValue] = param.split("=");
    return {
      ...parsedParams,
      [key]: quotedValue.replace(/\"/g, ""),
    };
  }, {});
};

export { startCapture, parseParams };
