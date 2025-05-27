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

  // Add copy buttons to code blocks when tab changes
  useEffect(() => {
    if (!contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      // Skip if copy button already exists
      if (pre.querySelector("[data-copy-button]")) return;

      // Create a wrapper div if it doesn't exist
      if (!pre.parentElement.classList.contains("code-block-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper relative group";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      // Ensure pre has overflow-x-auto for horizontal scrolling
      pre.classList.add("overflow-x-auto");

      const copyButton = document.createElement("button");
      copyButton.setAttribute("data-copy-button", "true");
      copyButton.className = `
        absolute top-2 right-2 px-2 py-1 text-xs z-10
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

      // Append button to the wrapper, not the pre element
      pre.parentElement.appendChild(copyButton);
    });

    // Cleanup function to remove wrappers when component unmounts
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
