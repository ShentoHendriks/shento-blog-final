"use client";

import { useState, useEffect, useRef } from "react";

export function CodeTabs({ children, defaultTab = 0, variant = "default" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [expandedBlocks, setExpandedBlocks] = useState(new Set());
  const contentRef = useRef(null);

  // Reset expanded blocks when component mounts or route changes
  useEffect(() => {
    setExpandedBlocks(new Set());
  }, []); // Empty dependency array ensures this runs on mount

  const childrenArray = Array.isArray(children) ? children : [children];

  const tabs = childrenArray.map((child, index) => ({
    title: child.props.title == null ? "Missing title" : child.props.title,
    icon: child.props.icon,
    content: child.props.children,
    index,
  }));

  useEffect(() => {
    if (!contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll("pre");

    codeBlocks.forEach((pre, blockIndex) => {
      if (pre.querySelector("[data-copy-button]")) return;

      const blockId = `code-block-${activeTab}-${blockIndex}`;
      pre.setAttribute("data-block-id", blockId);

      let wrapper = pre.parentElement;
      if (!wrapper.classList.contains("code-block-wrapper")) {
        wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper relative group";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      pre.classList.add("overflow-x-auto");

      const code = pre.querySelector("code") || pre;
      const lines = code.textContent.split("\n");
      const isTooLong = lines.length > 20;

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "absolute top-2 right-2 flex space-x-2 z-10";

      // Copy button logic
      const copyButton = document.createElement("button");
      copyButton.setAttribute("data-copy-button", "true");
      copyButton.className = `
        px-2 py-1 text-xs z-10
        bg-gray-100 text-gray-700 border border-gray-300 rounded
        opacity-0 group-hover:opacity-100 transition-all duration-75
        hover:bg-gray-200 active:scale-95
        min-w-[60px] text-center 
      `;
      copyButton.innerHTML = "Copy";

      copyButton.onclick = async () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent;
        try {
          await navigator.clipboard.writeText(code);
          copyButton.innerHTML = "Copied!";
          copyButton.classList.remove(
            "bg-gray-100",
            "text-gray-700",
            "border-gray-300"
          );
          copyButton.classList.add(
            "bg-green-100",
            "text-green-700",
            "border-green-300"
          );

          setTimeout(() => {
            copyButton.innerHTML = "Copy";
            copyButton.classList.remove(
              "bg-green-100",
              "text-green-700",
              "border-green-300"
            );
            copyButton.classList.add(
              "bg-gray-100",
              "text-gray-700",
              "border-gray-300"
            );
          }, 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      };

      if (isTooLong) {
        const preContainer = document.createElement("div");
        preContainer.className = "relative code-expand-container";

        const gradientOverlay = document.createElement("div");
        gradientOverlay.className = `
          absolute inset-0 pointer-events-none z-[5] transition-opacity duration-75 rounded-[inherit]
          bg-gradient-to-b from-transparent from-0% via-transparent via-60% to-white to-100%
          dark:to-black
        `;
        gradientOverlay.style.background = `
          linear-gradient(
            to bottom,
            transparent 0%,
            transparent 70%,
            rgba(255, 255, 255, 1) 100%
          )
        `;

        pre.parentElement.insertBefore(preContainer, pre);
        preContainer.appendChild(pre);
        preContainer.appendChild(gradientOverlay);

        const isExpanded = expandedBlocks.has(blockId);

        pre.style.cssText = `
          max-height: ${isExpanded ? pre.scrollHeight + "px" : "750px"};
          overflow: ${isExpanded ? "auto" : "hidden"};
          position: relative;
          transition: max-height 150ms ease-out;
        `;

        gradientOverlay.style.opacity = isExpanded ? "0" : "1";

        // Expand button
        const expandButton = document.createElement("button");
        expandButton.setAttribute("data-expand-button", "true");
        expandButton.className = `
          px-2 py-1 text-xs z-10
          bg-gray-100 text-gray-700 border border-gray-300 rounded
          opacity-0 group-hover:opacity-100 transition-all duration-75
          hover:bg-gray-200 active:scale-95
        `;
        expandButton.innerHTML = isExpanded ? "Collapse" : "Expand";

        expandButton.onclick = () => {
          setExpandedBlocks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(blockId)) {
              newSet.delete(blockId);
              // Collapse
              pre.style.maxHeight = "750px";
              pre.style.overflow = "hidden";
              gradientOverlay.style.opacity = "1";
              expandButton.innerHTML = "Expand";
            } else {
              newSet.add(blockId);
              // Expand
              pre.style.maxHeight = `${pre.scrollHeight}px`;
              pre.style.overflow = "auto";
              gradientOverlay.style.opacity = "0";
              expandButton.innerHTML = "Collapse";
            }
            return newSet;
          });
        };

        // Add buttons to container
        buttonContainer.appendChild(expandButton);
      }

      // Add copy button
      buttonContainer.appendChild(copyButton);

      // Append button container
      wrapper.appendChild(buttonContainer);
    });

    // Cleanup function
    return () => {
      const wrappers = contentRef.current?.querySelectorAll(
        ".code-block-wrapper"
      );
      wrappers?.forEach((wrapper) => {
        const pre = wrapper.querySelector("pre");
        if (pre && wrapper.parentNode) {
          wrapper.parentNode.insertBefore(pre, wrapper);
          wrapper.remove();
        }
      });
    };
  }, [activeTab, expandedBlocks]);

  return (
    <div className={`tabs-container tabs-${variant}`}>
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.title}
          </button>
        ))}
      </div>

      <div className="tab-content" ref={contentRef}>
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export function CodeTab({ title, icon, children }) {
  return <div>{children}</div>;
}
