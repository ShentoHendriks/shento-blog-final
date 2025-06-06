"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { codeToHtml } from "shiki";
import { CustomSlider } from "./CustomSlider";

// Constants
const THEME = "catppuccin-frappe";
const BUTTON_STYLES = {
  base: "px-2 py-1 text-xs rounded border transition-all duration-200",
  copy: "opacity-0 group-hover:opacity-100 active:scale-95 font-mono",
  variant: {
    success: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
    default: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
  },
};

// Utilities
const utils = {
  getInitialValue: (opt) =>
    opt.default ??
    opt.min ??
    opt.options?.[0]?.value ??
    opt.options?.[0] ??
    "#000000",
  formatClassName: (name) => {
    // If a specific targetClass is provided, use it
    if (name && name.trim() !== "") {
      return name.replace(/^\./, "");
    }
    // Otherwise, use the provided elementName
    return name?.replace(/^\./, "") || "element";
  },
  normalizeOption: (opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  getOptionValue: (opt) => (typeof opt === "string" ? opt : opt.value),
  getOptionLabel: (opt) =>
    typeof opt === "string" ? opt : opt.label || opt.value,
};

// Hooks
const useHighlightedCode = (code) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!code) return setHtml("");

    codeToHtml(code, { lang: "css", theme: THEME })
      .then(setHtml)
      .catch(() =>
        setHtml(
          `<pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`
        )
      );
  }, [code]);

  return html;
};

const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  return {
    copied,
    copy: useCallback(async (text) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, []),
  };
};

// Components
const Button = ({
  onClick,
  children,
  variant = "default",
  className = "",
  ...props
}) => (
  <button
    onClick={onClick}
    className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.variant[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

const ControlInput = ({ option, value, onChange }) => {
  const inputs = {
    color: () => (
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 cursor-pointer"
      />
    ),
    slider: () => (
      <CustomSlider
        opt={option}
        values={{ [option.name]: value }}
        update={onChange}
      />
    ),
    select: () => (
      <div className="flex gap-2 flex-wrap">
        {option.options.map(utils.normalizeOption).map((opt) => {
          const optValue = utils.getOptionValue(opt);
          const isActive = value === optValue;
          return (
            <button
              key={optValue}
              onClick={() => onChange(optValue)}
              className={`px-3 py-1 rounded transition-colors ${
                isActive
                  ? "bg-white text-[#293056]"
                  : "text-white bg-[#293056] hover:text-white hover:bg-[#3a4170]"
              }`}
            >
              {utils.getOptionLabel(opt)}
            </button>
          );
        })}
      </div>
    ),
    dropdown: () => (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1 rounded text-[#293056] border border-[#d5d9eb46]"
      >
        {option.options.map(utils.normalizeOption).map((opt) => {
          const optValue = utils.getOptionValue(opt);
          return (
            <option key={optValue} value={optValue}>
              {utils.getOptionLabel(opt)}
            </option>
          );
        })}
      </select>
    ),
  };

  return inputs[option.type]?.() || null;
};

const CodeDisplay = ({ code }) => {
  const html = useHighlightedCode(code);
  const { copied, copy } = useClipboard();

  return (
    <div className="relative rounded overflow-hidden w-full code-playground border border-[#d5d9eb46] group">
      <Button
        onClick={() => copy(code)}
        variant={copied ? "success" : "default"}
        className={`absolute top-2 right-2 ${BUTTON_STYLES.copy}`}
        aria-label={copied ? "Code copied" : "Copy code"}
      >
        {copied ? "Copied!" : "Copy"}
      </Button>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
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
      {options.map((opt) => (
        <div
          key={opt.name}
          className="flex md:items-center md:flex-row flex-col gap-2"
        >
          <label className="mr-4 min-w-[120px]">{opt.label || opt.name}:</label>
          <ControlInput
            option={opt}
            value={values[opt.name]}
            onChange={(value) => onValueChange(opt.name, value)}
          />
          {opt.description && (
            <span className="text-sm text-gray-400 ml-2">
              {opt.description}
            </span>
          )}
        </div>
      ))}
      <div className="absolute -top-5 right-0 z-10 group-hover:opacity-100">
        <Button
          onClick={handleReset}
          variant={resetting ? "success" : "default"}
        >
          {resetting ? "Reset!" : "Reset to defaults"}
        </Button>
      </div>
    </div>
  );
};

// CSS Generation
const generateCSS = (options, values, elementName, cssVariableScope) => {
  const cssVars = [];
  const rules = {};

  options.forEach((opt) => {
    const value = values[opt.name];
    const selectedOption = opt.options
      ?.map(utils.normalizeOption)
      .find((o) => utils.getOptionValue(o) === value);

    const properties = selectedOption?.properties ||
      opt.properties || [{ property: opt.property, unit: opt.unit }];

    properties.forEach(({ property, value: propValue, unit }) => {
      if (!property) return;

      const finalValue = `${propValue ?? value}${unit || ""}`;

      if (property.startsWith("--")) {
        cssVars.push(`  ${property}: ${finalValue};`);
      } else {
        // Prefer targetClass if provided, otherwise use elementName
        const target = opt.targetClass
          ? utils.formatClassName(opt.targetClass)
          : elementName;

        rules[target] = rules[target] || [];
        rules[target].push(`  ${property}: ${finalValue};`);
      }
    });
  });

  const cssVarBlock = cssVars.length
    ? `${cssVariableScope} {\n${cssVars.join("\n")}\n}\n\n`
    : "";

  const rulesBlock = Object.entries(rules)
    .map(([cls, props]) => `.${cls} {\n${props.join("\n")}\n}`)
    .join("\n\n");

  return (cssVarBlock + rulesBlock).trim();
};

// Main Component
export const InteractivePlayground = ({
  children,
  options = [],
  elementName = "element",
  customCSS = "",
  generatedCSS: providedCSS = "",
  layout = "vertical",
  width,
  cssVariableScope = ":root",
  hideCustomCSS = false,
}) => {
  const [values, setValues] = useState(() =>
    options.reduce(
      (acc, opt) => ({
        ...acc,
        [opt.name]: utils.getInitialValue(opt),
      }),
      {}
    )
  );

  useEffect(() => {
    setValues(
      options.reduce(
        (acc, opt) => ({
          ...acc,
          [opt.name]: utils.getInitialValue(opt),
        }),
        {}
      )
    );
  }, [options]);

  const displayCSS = useMemo(() => {
    const generated =
      providedCSS ||
      generateCSS(options, values, elementName, cssVariableScope);
    return customCSS && !hideCustomCSS && generated
      ? `${customCSS.trim()}\n\n${generated}`
      : generated || customCSS;
  }, [
    options,
    values,
    elementName,
    customCSS,
    providedCSS,
    cssVariableScope,
    hideCustomCSS,
  ]);

  const appliedCSS = useMemo(
    () =>
      hideCustomCSS && customCSS && displayCSS
        ? `${customCSS.trim()}\n\n${displayCSS}`
        : displayCSS,
    [displayCSS, customCSS, hideCustomCSS]
  );

  const isHorizontal = layout === "horizontal";
  const containerStyle = width
    ? {
        width: `calc(${width} - 2em)`,
        maxWidth: "calc(100vw - 2em)",
        margin: "2rem auto",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {};

  return (
    <div
      className="my-[2rem] p-6 bg-[#293056] rounded-md space-y-6"
      style={containerStyle}
    >
      {options.length > 0 && (
        <ControlPanel
          options={options}
          values={values}
          onValueChange={(name, value) =>
            setValues((prev) => ({ ...prev, [name]: value }))
          }
          onReset={() =>
            setValues(
              options.reduce(
                (acc, opt) => ({
                  ...acc,
                  [opt.name]: utils.getInitialValue(opt),
                }),
                {}
              )
            )
          }
        />
      )}

      <div
        className={`flex gap-4 ${
          isHorizontal ? "md:flex-row" : ""
        } flex-col-reverse`}
      >
        {displayCSS && (
          <div
            className={
              isHorizontal ? "lg:flex md:min-w-[350px]" : "w-full lg:mb-0"
            }
          >
            <CodeDisplay code={displayCSS} />
          </div>
        )}

        <div className={isHorizontal ? "lg:flex-1" : "w-full"}>
          <div className="p-6 rounded-md playground-output border border-[#d5d9eb46]">
            {appliedCSS && <style>{appliedCSS}</style>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
