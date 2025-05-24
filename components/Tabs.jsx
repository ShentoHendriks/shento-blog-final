"use client";

import { useState } from "react";

export function Tabs({ children, defaultTab = 0, variant = "default" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Fix: Ensure children is always an array
  const childrenArray = Array.isArray(children) ? children : [children];

  const tabs = childrenArray.map((child, index) => ({
    title: child.props.title,
    icon: child.props.icon,
    content: child.props.children,
    index,
  }));

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

      <div className="tab-content">{tabs[activeTab]?.content}</div>
    </div>
  );
}

export function TabPanel({ title, icon, children }) {
  return <div>{children}</div>;
}
