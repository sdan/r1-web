const nextConfig = {
  experimental: {
    workerThreads: true,
    webVitalsAttribution: ['CLS', 'LCP']
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.worker\.ts$/,
      use: { loader: 'worker-loader' }
    });

    // Add this to exclude onnxruntime-node
    config.externals = config.externals || [];
    config.externals.push('onnxruntime-node');

    return config
  }
};

export default nextConfig; 