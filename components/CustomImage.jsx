// components/CustomImage.js
import Image from "next/image";
import path from "path";
import fs from "fs";

const CustomImage = ({ src, alt, width, height, ...props }) => {
  // Normalize the source path
  const normalizedSrc = src.startsWith("/")
    ? src
    : `${src.startsWith("assets/") ? "/" : "/assets/"}${src}`;

  // Check if the image exists in the public folder
  const fullPublicPath = path.join(
    process.cwd(),
    "public",
    normalizedSrc.replace(/^\//, "")
  );
  const imageExists = fs.existsSync(fullPublicPath);

  // If it's an external image
  if (src.startsWith("http")) {
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={width || 1500}
        height={height || 1500}
        className="mx-auto my-4 rounded-lg object-contain"
        unoptimized={!(width && height)}
        {...props}
      />
    );
  }

  // If it's a local image and exists
  if (imageExists) {
    try {
      return (
        <Image
          src={normalizedSrc}
          alt={alt || ""}
          width={width || 1500}
          height={height || 1500}
          className="mx-auto my-4 rounded-lg object-contain"
          {...props}
        />
      );
    } catch (error) {
      console.error(`Image optimization failed for ${normalizedSrc}`, error);
    }
  }

  // Fallback to regular img if optimization fails
  return (
    <div className="relative">
      <img
        src={normalizedSrc}
        alt={alt || ""}
        {...props}
        className="mx-auto my-4 rounded-lg"
      />
      <small className="block text-center text-red-500">
        Image optimization failed
      </small>
    </div>
  );
};

export default CustomImage;
