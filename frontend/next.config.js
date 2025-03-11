// next.config.js
module.exports = {
    webpack: (config) => {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
      
      return config;
    },
    // Add this to handle PDF.js worker
    async headers() {
      return [
        {
          source: '/pdf.worker.js',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  };