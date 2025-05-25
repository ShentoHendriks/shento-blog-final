"use client";

import React, { useState, useMemo, useEffect } from "react";
import { codeToHtml } from "shiki";
import { CustomSlider } from "./CustomSlider";

// Constants
const THEME = "catppuccin-frappe";
// Utility functions
const getInitialValue = (option) =>
  option.default ?? option.min ?? option.options?.[0] ?? "#000000";

const formatClassName = (className) =>
  className?.replace(/^\./, "") || "element";

const formatCSSProperty = (property, value, unit = "") =>
  `${property}: ${value}${unit};`;

// Sub-components
const ColorPicker = ({ value, onChange }) => (
  <input
    type="color"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-10 w-10 cursor-pointer"
  />
);

const SelectButtons = ({ options, value, onChange }) => (
  <div className="flex gap-2">
    {options.map((option) => (
      <button
        key={option}
        onClick={() => onChange(option)}
        className={`
          px-3 py-1 rounded transition-colors
          ${
            value === option
              ? `bg-white text-[#293056]`
              : `text-white bg-[#293056]`
          }
        `}>
        {option}
      </button>
    ))}
  </div>
);

const ControlInput = ({ option, value, onChange }) => {
  const controls = {
    slider: () => (
      <CustomSlider
        opt={option}
        values={{ [option.name]: value }}
        update={onChange}
      />
    ),
    color: () => (
      <ColorPicker
        value={value}
        onChange={onChange}
      />
    ),
    select: () => (
      <SelectButtons
        options={option.options}
        value={value}
        onChange={onChange}
      />
    ),
  };

  return controls[option.type]?.() || null;
};

const ControlPanel = ({ options, values, onValueChange }) => (
  <div className="text-white font-mono space-y-4">
    {options.map((option) => (
      <div
        key={option.name}
        className="flex md:items-center md:flex-row flex-col">
        <label className="mr-4">{option.label || option.name}:</label>
        <ControlInput
          option={option}
          value={values[option.name]}
          onChange={(value) => onValueChange(option.name, value)}
        />
      </div>
    ))}
  </div>
);

const CodeDisplay = ({ code }) => {
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const html = await codeToHtml(code, { lang: "css", theme: THEME });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(`<pre>${code}</pre>`);
      }
    };

    highlightCode();
  }, [code]);

  return (
    <div
      className="rounded overflow-hidden code-playground border border-[#d5d9eb46]"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
};

// Main component
export const InteractivePlayground = ({
  children,
  options = [],
  elementName = "element",
  customCSS = "", // Custom CSS prop
  generatedCSS: providedGeneratedCSS = "", // New prop to override generated CSS
  layout = "vertical", // New prop for layout: "vertical" | "horizontal"
  width, // New prop for custom width
}) => {
  const [values, setValues] = useState(() =>
    options.reduce(
      (acc, opt) => ({ ...acc, [opt.name]: getInitialValue(opt) }),
      {}
    )
  );

  const generatedCSS = useMemo(() => {
    // If providedGeneratedCSS is given, use it directly
    if (providedGeneratedCSS) {
      return providedGeneratedCSS;
    }

    // Otherwise, generate CSS from options
    // Group properties by target class
    const groupedProperties = options.reduce((acc, opt) => {
      const targetClass = formatClassName(opt.targetClass) || elementName;

      if (!acc[targetClass]) {
        acc[targetClass] = [];
      }

      acc[targetClass].push({
        property: opt.property,
        value: values[opt.name],
        unit: opt.unit,
      });

      return acc;
    }, {});

    // Generate CSS rules only if there are options
    const dynamicCSS =
      options.length > 0
        ? Object.entries(groupedProperties)
            .map(([className, properties]) => {
              const rules = properties
                .map(
                  ({ property, value, unit }) =>
                    `  ${formatCSSProperty(property, value, unit)}`
                )
                .join("\n");

              return `.${className} {\n${rules}\n}`;
            })
            .join("\n\n")
        : "";

    // Handle custom CSS combining
    if (!customCSS && !dynamicCSS) return "";

    if (customCSS && dynamicCSS) {
      // Ensure proper spacing between custom and dynamic CSS
      return `${customCSS.trim()}\n\n${dynamicCSS}`;
    }

    return customCSS || dynamicCSS;
  }, [options, values, elementName, customCSS, providedGeneratedCSS]);

  const handleValueChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const isHorizontal = layout === "horizontal";

  // Container styles for custom width
  const containerStyle = width
    ? {
        width: width,
        maxWidth: "100vw",
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {};

  return (
    <div
      className={`my-[3em] p-6 bg-[#293056] rounded-md space-y-6`}
      style={containerStyle}>
      {options.length > 0 && (
        <ControlPanel
          options={options}
          values={values}
          onValueChange={handleValueChange}
        />
      )}

      <div
        className={`${
          isHorizontal ? "lg:flex lg:gap-6" : ""
        } space-y-6 lg:space-y-0`}>
        {generatedCSS && (
          <div className={isHorizontal ? "lg:flex-1" : "mb-6"}>
            <CodeDisplay code={generatedCSS} />
          </div>
        )}

        <div className={isHorizontal ? "lg:flex-1" : ""}>
          <div
            className={`p-6 rounded-md playground-output border border-[#d5d9eb46]`}>
            {generatedCSS && <style>{generatedCSS}</style>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
