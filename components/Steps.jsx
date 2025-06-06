"use client";

import { Children, cloneElement, isValidElement } from "react";

export function Steps({ children, width = "800px", vertical }) {
  const steps = Children.toArray(children);

  // Use a custom CSS variable that we can reference in Tailwind
  const style = width ? { "--custom-width": width } : {};

  return (
    <div
      className={`steps mt-8 mb-4 flow-root ${
        width
          ? "lg:w-[calc(var(--custom-width)_-_2em)] lg:max-w-[calc(100vw_-_2em)] lg:mx-auto lg:relative lg:left-1/2 lg:-translate-x-1/2"
          : ""
      }
      ${vertical && "!w-full !max-w-full !lg:w-full !lg:max-w-full"}
        `}
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

export function Step({ stepNumber, title, children, vertical }) {
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
    <div
      className={`step grid grid-cols-1 lg:gap-6 mb-6 ${
        vertical ? "lg:grid-cols-1" : "lg:grid-cols-[350px_1fr]"
      }`}
    >
      {/* Left column: Number, Title, Description */}
      <div className="">
        <div className="flex lg:items-start flex-col lg:flex-row gap-3 lg:gap-5">
          <div className="flex flex-start font-semibold text-primary lg:mt-0.5">
            {stepNumber?.toString().padStart(2, "0")}
          </div>
          <p className="font-semibold mt-0.5">{title}</p>
        </div>
        <div className="text-gray-600">{description}</div>
      </div>

      {/* Right column: Tabs with code */}
      {tabs && (
        <div className="lg:ml-0 lg:max-w-full overflow-x-auto">{tabs}</div>
      )}
    </div>
  );
}
