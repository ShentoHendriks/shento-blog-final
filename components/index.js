import Button from "@/components/Button";
import { CodeTabs, CodeTab } from "./CodeTabs";
import Callout from "./Callout";
import { InteractivePlayground } from "./InteractivePlayground";
import { FileStructure, File } from "./FileStructure";
import CustomImage from "./CustomImage";
import { Steps, Step } from "./Steps";
import Dos from "./Dos";
import { Tabs, Tab } from "./Tabs";

const components = {
  Button,
  CodeTabs,
  CodeTab,
  Callout,
  InteractivePlayground,
  FileStructure,
  File,
  Steps,
  Step,
  CustomImage,
  Dos,
  Tabs,
  Tab,
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
