// next-webpack.config.js
module.exports = (config) => {
  config.module.rules.push({
    test: /\.worker\.ts$/,
    use: { loader: 'worker-loader' },
  });
  config.externals = config.externals || [];
  config.externals.push('onnxruntime-node');
  return config;
};