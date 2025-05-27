import Button from "@/components/Button";
import { Tabs, TabPanel } from "./Tabs";
import Callout from "./Callout";
import { InteractivePlayground } from "./InteractivePlayground";
import {FileStructure, File} from "./FileStructure";

const components = {
  Button,
  Tabs,
  TabPanel,
  Callout,
  InteractivePlayground,
  FileStructure,
  File,
  // Add custom link component
  a: ({ href, children, ...props }) => {
    // Check if it's an external link
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
    
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
};

export default components;