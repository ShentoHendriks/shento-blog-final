"use client";

import React, { useState, useMemo, useEffect } from "react";
import { codeToHtml } from "shiki";
import { CustomSlider } from "./CustomSlider";

// Constants
const THEME = "catppuccin-frappe";

// Utility functions
const getInitialValue = (option) =>
  option.default ??
  option.min ??
  option.options?.[0]?.value ??
  option.options?.[0] ??
  "#000000";

const formatClassName = (className) =>
  className?.replace(/^\./, "") || "element";

// Helper function to normalize options
const normalizeOptions = (options) => {
  return options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });
};

// Helper function to get option value
const getOptionValue = (option) => {
  return typeof option === "string" ? option : option.value;
};

// Helper function to get option label
const getOptionLabel = (option) => {
  return typeof option === "string" ? option : option.label || option.value;
};

// Sub-components
const ColorPicker = ({ value, onChange }) => (
  <input
    type="color"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-10 w-10 cursor-pointer"
  />
);

const SelectButtons = ({ options, value, onChange }) => {
  const normalizedOptions = normalizeOptions(options);

  return (
    <div className="flex gap-2 flex-wrap">
      {normalizedOptions.map((option) => {
        const optionValue = getOptionValue(option);
        const optionLabel = getOptionLabel(option);

        return (
          <button
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={`
              px-3 py-1 rounded transition-colors
              ${
                value === optionValue
                  ? `bg-white text-[#293056]`
                  : `text-white bg-[#293056]`
              }
            `}>
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
};

const SelectDropdown = ({ options, value, onChange }) => {
  const normalizedOptions = normalizeOptions(options);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-1 rounded text-[#293056] border border-[#d5d9eb46]">
      {normalizedOptions.map((option) => {
        const optionValue = getOptionValue(option);
        const optionLabel = getOptionLabel(option);

        return (
          <option
            key={optionValue}
            value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
};

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
    dropdown: () => (
      <SelectDropdown
        options={option.options}
        value={value}
        onChange={onChange}
      />
    ),
  };

  return controls[option.type]?.() || null;
};

const CodeDisplay = ({ code }) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const highlightCode = async () => {
      if (!code) {
        setHighlightedCode("");
        return;
      }
      try {
        const html = await codeToHtml(code, { lang: "css", theme: THEME });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(
          `<pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`
        );
      }
    };

    highlightCode();
  }, [code]);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="relative rounded overflow-hidden w-full code-playground border border-[#d5d9eb46] group">
      <button
        onClick={handleCopy}
        className={`
          absolute top-2 right-2 px-2 py-1 text-xs
          rounded border transition-all duration-200
          opacity-0 group-hover:opacity-100
          active:scale-95 font-mono
          ${
            copied
              ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }
        `}
        aria-label={
          copied ? "Code copied to clipboard" : "Copy code to clipboard"
        }>
        {copied ? "Copied!" : "Copy"}
      </button>
      <div
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        className="shiki-container"
      />
    </div>
  );
};

const ControlPanel = ({ options, values, onValueChange, onReset }) => {
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    onReset();
    setResetting(true);
    setTimeout(() => setResetting(false), 2000);
  };

  return (
    <div className="relative group text-white font-mono space-y-4 pt-2 pr-16">
      {options.map((option) => (
        <div
          key={option.name}
          className="flex md:items-center md:flex-row flex-col gap-2">
          <label className="mr-4 min-w-[120px]">
            {option.label || option.name}:
          </label>
          <ControlInput
            option={option}
            value={values[option.name]}
            onChange={(value) => onValueChange(option.name, value)}
          />
          {option.description && (
            <span className="text-sm text-gray-400 ml-2">
              {option.description}
            </span>
          )}
        </div>
      ))}
      <button
        onClick={handleReset}
        className={`
          absolute -top-5 right-0 z-10 px-2 py-1 text-xs 
          rounded border transition-all duration-200
           group-hover:opacity-100
     
          ${
            resetting
              ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }
        `}
        aria-label={
          resetting ? "Defaults have been reset" : "Reset to defaults"
        }>
        {resetting ? "Reset!" : "Reset to defaults"}
      </button>
    </div>
  );
};

// Main component
export const InteractivePlayground = ({
  children,
  options = [],
  elementName = "element",
  customCSS = "",
  generatedCSS: providedGeneratedCSS = "",
  layout = "vertical",
  width,
  cssVariableScope = ":root",
  hideCustomCSS = false,
}) => {
  const [values, setValues] = useState(() =>
    options.reduce(
      (acc, opt) => ({ ...acc, [opt.name]: getInitialValue(opt) }),
      {}
    )
  );

  useEffect(() => {
    setValues(
      options.reduce(
        (acc, opt) => ({ ...acc, [opt.name]: getInitialValue(opt) }),
        {}
      )
    );
  }, [options]);

  const displayCSS = useMemo(() => {
    if (providedGeneratedCSS) {
      return providedGeneratedCSS;
    }
    const cssVariables = [];
    const regularProperties = {};
    options.forEach((opt) => {
      const value = values[opt.name];
      let selectedOption = null;
      if (opt.options && (opt.type === "select" || opt.type === "dropdown")) {
        const normalizedOptions = normalizeOptions(opt.options);
        selectedOption = normalizedOptions.find(
          (option) => getOptionValue(option) === value
        );
      }
      if (selectedOption && selectedOption.properties) {
        selectedOption.properties.forEach(
          ({ property, value: propValue, unit }) => {
            const targetClass = formatClassName(opt.targetClass) || elementName;
            if (!regularProperties[targetClass]) {
              regularProperties[targetClass] = [];
            }
            regularProperties[targetClass].push({
              property: property,
              value: propValue,
              unit: unit || "",
            });
          }
        );
      } else {
        const properties = opt.properties || [
          { property: opt.property, unit: opt.unit },
        ];
        properties.forEach(({ property, unit }) => {
          if (!property) return;
          const formattedValue = unit ? `${value}${unit}` : value;
          if (property.startsWith("--")) {
            cssVariables.push({
              property: property,
              value: formattedValue,
            });
          } else {
            const targetClass = formatClassName(opt.targetClass) || elementName;
            if (!regularProperties[targetClass]) {
              regularProperties[targetClass] = [];
            }
            regularProperties[targetClass].push({
              property: property,
              value: value,
              unit: unit || "",
            });
          }
        });
      }
    });
    let css = "";
    if (cssVariables.length > 0) {
      const variableRules = cssVariables
        .map(({ property, value }) => `  ${property}: ${value};`)
        .join("\n");
      css += `${cssVariableScope} {\n${variableRules}\n}\n\n`;
    }
    if (Object.keys(regularProperties).length > 0) {
      const regularCSS = Object.entries(regularProperties)
        .map(([className, properties]) => {
          const rules = properties
            .map(
              ({ property, value, unit }) => `  ${property}: ${value}${unit};`
            )
            .join("\n");
          return `.${className} {\n${rules}\n}`;
        })
        .join("\n\n");
      css += regularCSS;
    }
    if (customCSS && !hideCustomCSS) {
      css = css ? `${customCSS.trim()}\n\n${css.trim()}` : customCSS;
    }
    return css.trim();
  }, [
    options,
    values,
    elementName,
    customCSS,
    providedGeneratedCSS,
    cssVariableScope,
    hideCustomCSS,
  ]);

  const appliedCSS = useMemo(() => {
    if (hideCustomCSS && customCSS) {
      if (displayCSS) {
        return `${customCSS.trim()}\n\n${displayCSS}`;
      }
      return customCSS.trim();
    }
    return displayCSS;
  }, [displayCSS, customCSS, hideCustomCSS]);

  const handleValueChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetToDefaults = () => {
    const defaultValues = options.reduce(
      (acc, opt) => ({ ...acc, [opt.name]: getInitialValue(opt) }),
      {}
    );
    setValues(defaultValues);
  };

  const isHorizontal = layout === "horizontal";

  const containerStyle = width
    ? {
        width: `calc(${width} - 2em)`,
        maxWidth: "calc(100vw - 2em)",
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
          onReset={handleResetToDefaults}
        />
      )}

      <div
        className={`${
          isHorizontal ? "md:flex-row flex-col-reverse" : "flex-col-reverse"
        } flex gap-4`}>
        {displayCSS && (
          <div
            className={
              isHorizontal ? "lg:flex lg:min-w-[350px]" : "w-full lg:mb-0"
            }>
            <CodeDisplay code={displayCSS} />
          </div>
        )}

        <div className={isHorizontal ? "lg:flex-1" : "w-full"}>
          <div
            className={`p-6 rounded-md playground-output border border-[#d5d9eb46]`}>
            {appliedCSS && <style>{appliedCSS}</style>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
