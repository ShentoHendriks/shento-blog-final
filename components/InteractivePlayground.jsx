"use client";

import React, { useState, useMemo, useEffect } from "react";
import { codeToHtml } from "shiki";
import { CustomSlider } from "./CustomSlider";

export const InteractivePlayground = ({
  children,
  options = [],
  elementName = "element",
}) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const [values, setValues] = useState(() =>
    options.reduce(
      (acc, opt) => ({
        ...acc,
        [opt.name]: opt.default || opt.min || opt.options?.[0] || "#000000",
      }),
      {}
    )
  );

  // Generate properly formatted CSS
  const generatedCSS = useMemo(() => {
    // Group properties by target class
    const groupedProperties = options.reduce((acc, opt) => {
      const targetClass = opt.targetClass?.replace(/^\./, "") || elementName;
      if (!acc[targetClass]) {
        acc[targetClass] = [];
      }
      acc[targetClass].push({
        property: opt.property,
        value: `${values[opt.name]}${opt.unit || ""}`,
      });
      return acc;
    }, {});

    // Format CSS with proper indentation
    return Object.entries(groupedProperties)
      .map(([className, properties]) => {
        const propertiesString = properties
          .map(({ property, value }) => `  ${property}: ${value};`)
          .join("\n");
        return `.${className} {\n${propertiesString}\n}`;
      })
      .join("\n\n");
  }, [options, values, elementName]);

  // Highlight code with Shiki
  useEffect(() => {
    async function highlightCode() {
      try {
        const html = await codeToHtml(generatedCSS, {
          lang: "css",
          theme: "catppuccin-frappe", // or any theme you prefer
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(`<pre>${generatedCSS}</pre>`);
      }
    }

    highlightCode();
  }, [generatedCSS]);

  const renderControl = (opt) => {
    const update = (value) =>
      setValues((prev) => ({ ...prev, [opt.name]: value }));

    const controls = {
      slider: () => (
        <CustomSlider
          opt={opt}
          values={values}
          update={update}
        />
      ),
      color: () => (
        <input
          type="color"
          value={values[opt.name]}
          onChange={(e) => update(e.target.value)}
          className="h-10 w-10 border rounded"
        />
      ),
      select: () => (
        <div className="flex gap-2">
          {opt.options.map((option) => (
            <button
              key={option}
              onClick={() => update(option)}
              className={`px-3 py-1 rounded ${
                values[opt.name] === option
                  ? "bg-white text-[#293056]"
                  : "text-white bg-[#293056]"
              }`}>
              {option}
            </button>
          ))}
        </div>
      ),
    };

    return controls[opt.type]();
  };

  return (
    <div className="mx-auto p-6 bg-[#293056] rounded-md space-y-4">
      {options.length > 0 && (
        <div className="text-white font-mono">
          {options.map((opt) => (
            <div
              key={opt.name}
              className="flex items-center mb-8">
              <label className="mr-4">{opt.label || opt.name}:</label>
              {renderControl(opt)}
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-1 gap-8">
        <div
          className="rounded overflow-hidden code-playground border border-[#D5D9EB]"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <div>
          <span className="text-white mb-4 block font-mono">Output: </span>
          <div className="p-6 rounded-md playground-output border border-[#D5D9EB">
            <style>{generatedCSS}</style>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
