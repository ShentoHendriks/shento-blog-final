"use client";

import { Children, cloneElement, isValidElement } from "react";

export function Steps({ children, width = "800px" }) {
  const steps = Children.toArray(children);

  // Use a custom CSS variable that we can reference in Tailwind
  const style = width ? { "--custom-width": width } : {};

  return (
    <div
      className={`my-12 ${
        width
          ? "lg:w-[calc(var(--custom-width)_-_2em)] lg:max-w-[calc(100vw_-_2em)] lg:mx-auto lg:relative lg:left-1/2 lg:-translate-x-1/2"
          : ""
      }`}
      style={style}
    >
      {steps.map((step, index) =>
        isValidElement(step)
          ? cloneElement(step, { stepNumber: index + 1 })
          : step
      )}
    </div>
  );
}

export function Step({ stepNumber, title, children }) {
  // Convert children to array and filter out empty elements
  const content = Children.toArray(children).filter((child) => {
    // Filter out empty text nodes
    if (typeof child === "string") return child.trim() !== "";
    return true;
  });

  // Find the last element - if it looks like Tabs, separate it
  const lastElement = content[content.length - 1];
  let description = content;
  let tabs = null;

  // Check if last element has TabPanel children (indicating it's a Tabs component)
  if (
    isValidElement(lastElement) &&
    lastElement.props &&
    lastElement.props.children
  ) {
    const childrenArray = Children.toArray(lastElement.props.children);
    const hasTabPanels = childrenArray.some(
      (child) => isValidElement(child) && child.props && "title" in child.props
    );

    if (hasTabPanels) {
      tabs = lastElement;
      description = content.slice(0, -1);
    }
  }

  return (
    <div className="step grid grid-cols-1 lg:grid-cols-[360px_1fr] lg:gap-6 mb-6">
      {/* Left column: Number, Title, Description */}
      <div className="">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {stepNumber?.toString().padStart(2, "0")}
          </div>
          <h3 className="text-lg font-semibold mt-0.5">{title}</h3>
        </div>
        <div className="text-gray-600 text-sm ml-11">{description}</div>
      </div>

      {/* Right column: Tabs with code */}
      {tabs && (
        <div className="lg:ml-0 lg:max-w-full overflow-x-auto mt-4">{tabs}</div>
      )}
    </div>
  );
}
