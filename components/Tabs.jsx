"use client";

import { useState, useEffect, useRef } from "react";

export function Tabs({ children, defaultTab = 0, variant = "default" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const contentRef = useRef(null);

  const childrenArray = Array.isArray(children) ? children : [children];

  const tabs = childrenArray.map((child, index) => ({
    title: child.props.title,
    icon: child.props.icon,
    content: child.props.children,
    index,
  }));

  useEffect(() => {
    if (!contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      // Skip if buttons already exist
      if (pre.querySelector("[data-copy-button]")) return;

      // Ensure wrapper exists
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

      // Create button container
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "absolute top-2 right-2 flex space-x-2 z-10";

      // Copy button logic (remains the same)
      const copyButton = document.createElement("button");
      copyButton.setAttribute("data-copy-button", "true");
      copyButton.className = `
        px-2 py-1 text-xs z-10
        bg-gray-100 text-gray-700 border border-gray-300 rounded
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        hover:bg-gray-200 active:scale-95
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

      // Expand/Collapse for long code blocks
      if (isTooLong) {
        // Create a container specifically for managing expand/collapse
        const preContainer = document.createElement("div");
        preContainer.className = "relative code-expand-container";

        // Gradient overlay
        const gradientOverlay = document.createElement("div");
        gradientOverlay.className = `
          absolute bottom-0 left-0 right-0 h-32 
          bg-gradient-to-t from-[#293056] via-[#293056]/90 to-[#293056]/0
          pointer-events-none z-[5]
        `;

        // Replace pre's parent with our new container
        pre.parentElement.insertBefore(preContainer, pre);
        preContainer.appendChild(pre);
        preContainer.appendChild(gradientOverlay);

        // Expand button
        const expandButton = document.createElement("button");
        expandButton.setAttribute("data-expand-button", "true");
        expandButton.className = `
          px-2 py-1 text-xs z-10
          bg-gray-100 text-gray-700 border border-gray-300 rounded
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          hover:bg-gray-200 active:scale-95
        `;
        expandButton.innerHTML = "Expand";

        // Manage expand state with data attributes
        pre.setAttribute("data-expanded", "false");
        pre.style.maxHeight = "400px";
        pre.style.overflow = "hidden";

        expandButton.onclick = () => {
          const isCurrentlyExpanded =
            pre.getAttribute("data-expanded") === "true";

          if (isCurrentlyExpanded) {
            // Collapse
            pre.style.maxHeight = "400px";
            pre.style.overflow = "hidden";
            gradientOverlay.classList.remove("hidden");
            expandButton.innerHTML = "Expand";
            pre.setAttribute("data-expanded", "false");
          } else {
            // Expand
            pre.style.maxHeight = `${pre.scrollHeight}px`;
            pre.style.overflow = "auto";
            gradientOverlay.classList.add("hidden");
            expandButton.innerHTML = "Collapse";
            pre.setAttribute("data-expanded", "true");
          }
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
  }, [activeTab]);

  return (
    <div className={`tabs-container tabs-${variant}`}>
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}>
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.title}
          </button>
        ))}
      </div>

      <div
        className="tab-content"
        ref={contentRef}>
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export function TabPanel({ title, icon, children }) {
  return <div>{children}</div>;
}
