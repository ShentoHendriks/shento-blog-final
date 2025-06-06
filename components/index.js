import Button from "@/components/Button";
import { Tabs, TabPanel } from "./Tabs";
import Callout from "./Callout";
import { InteractivePlayground } from "./InteractivePlayground";
import { FileStructure, File } from "./FileStructure";
import CustomImage from "./CustomImage";
import { Steps, Step } from "./Steps";
import Dos from "./Dos";

const components = {
  Button,
  Tabs,
  TabPanel,
  Callout,
  InteractivePlayground,
  FileStructure,
  File,
  Steps,
  Step,
  CustomImage,
  Dos,
  // Add custom link component
  a: ({ href, children, ...props }) => {
    // Check if it's an external link
    const isExternal =
      href && (href.startsWith("http://") || href.startsWith("https://"));

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  img: CustomImage,
};

export default components;
