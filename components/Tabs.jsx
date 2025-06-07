"use client";

import React, { useState } from "react";

export function Tabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Convert children to array to handle single child
  const tabs = React.Children.toArray(children);

  return (
    <div className="tabs my-4">
      {/* Tab Headers */}
      <div className="flex gap-6 border-b border-gray-blue-100 pb-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`cursor-pointer ${
              activeTab === index
                ? "active font-bold underline underline-offset-14"
                : "hover:underline hover:underline-offset-14"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.props.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-4">{tabs[activeTab]}</div>
    </div>
  );
}

export function Tab({ children, title }) {
  return <div className="tab">{children}</div>;
}
