module.exports = require("@next/mdx")()({
  pageExtensions: ["js", "jsx", "mdx"],
  images: {
    domains: [
      // Add domains for external images
      'example.com',
      'yourdomain.com',
      'localhost'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
});
