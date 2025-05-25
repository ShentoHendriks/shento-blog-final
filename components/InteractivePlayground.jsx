"use client";

import React, { useState, useMemo, useEffect } from "react";
import { codeToHtml } from "shiki";
import { CustomSlider } from "./CustomSlider";

// Constants
const THEME = "catppuccin-frappe";
const COLORS = {
  primary: "#293056",
  secondary: "#D5D9EB",
  text: "white",
};

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
              ? `bg-${COLORS.text} text-[#293056]`
              : `text-${COLORS.text} bg-[${COLORS.primary}]`
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
        <label className="mr-4 min-w-[120px]">
          {option.label || option.name}:
        </label>
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
}) => {
  const [values, setValues] = useState(() =>
    options.reduce(
      (acc, opt) => ({ ...acc, [opt.name]: getInitialValue(opt) }),
      {}
    )
  );

  const generatedCSS = useMemo(() => {
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

    // Generate CSS rules
    return Object.entries(groupedProperties)
      .map(([className, properties]) => {
        const rules = properties
          .map(
            ({ property, value, unit }) =>
              `  ${formatCSSProperty(property, value, unit)}`
          )
          .join("\n");

        return `.${className} {\n${rules}\n}`;
      })
      .join("\n\n");
  }, [options, values, elementName]);

  const handleValueChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`mx-auto my-[2em] p-6 bg-[#293056] rounded-md space-y-6`}>
      {options.length > 0 && (
        <ControlPanel
          options={options}
          values={values}
          onValueChange={handleValueChange}
        />
      )}

      <div className="space-y-6">
        <CodeDisplay code={generatedCSS} />

        <div>
          <span className="text-white mb-4 block font-mono">Output:</span>
          <div
            className={`p-6 rounded-md playground-output border border-[#d5d9eb46]`}>
            <style>{generatedCSS}</style>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
