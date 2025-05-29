"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { codeToHtml } from "shiki";
import { CustomSlider } from "./CustomSlider";

const HIGHLIGHT_COLOR = "#949292";
const THEME = "catppuccin-frappe";
const BUTTON_STYLES = {
  base: "px-2 py-1 text-xs rounded border transition-all duration-200",
  copy: "opacity-0 group-hover:opacity-100 active:scale-95 font-mono",
  variant: {
    success: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
    default: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
  },
};

const utils = {
  getInitialValue: (opt) =>
    opt.default ??
    opt.min ??
    opt.options?.[0]?.value ??
    opt.options?.[0] ??
    "#000000",
  formatClassName: (name) =>
    name && name.trim() !== ""
      ? name.replace(/^\./, "")
      : name?.replace(/^\./, "") || "element",
  normalizeOption: (opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  getOptionValue: (opt) => (typeof opt === "string" ? opt : opt.value),
  getOptionLabel: (opt) =>
    typeof opt === "string" ? opt : opt.label || opt.value,
};

const useHighlightedLines = () => {
  const [highlightedLines, setHighlightedLines] = useState(new Set());
  const timeoutsRef = useRef({});

  const highlightLine = useCallback((lineNumber) => {
    setHighlightedLines((prev) => {
      const next = new Set(prev);
      next.add(lineNumber);
      return next;
    });
    clearTimeout(timeoutsRef.current[lineNumber]);
    timeoutsRef.current[lineNumber] = setTimeout(() => {
      setHighlightedLines((prev) => {
        const next = new Set(prev);
        next.delete(lineNumber);
        return next;
      });
      delete timeoutsRef.current[lineNumber];
    }, 2000);
  }, []);

  const clearAll = useCallback(() => {
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};
    setHighlightedLines(new Set());
  }, []);

  useEffect(
    () => () => Object.values(timeoutsRef.current).forEach(clearTimeout),
    []
  );

  return { highlightedLines, highlightLine, clearAll };
};

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
  const copy = useCallback(async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);
  return { copied, copy };
};

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
    {...props}>
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
          const val = utils.getOptionValue(opt);
          const active = value === val;
          return (
            <button
              key={val}
              onClick={() => onChange(val)}
              className={`px-3 py-1 rounded transition-colors ${
                active
                  ? "bg-white text-[#293056]"
                  : "text-white bg-[#293056] hover:text-white hover:bg-[#3a4170]"
              }`}>
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
        className="px-3 py-1 rounded text-[#293056] border border-[#d5d9eb46]">
        {option.options.map(utils.normalizeOption).map((opt) => {
          const val = utils.getOptionValue(opt);
          return (
            <option
              key={val}
              value={val}>
              {utils.getOptionLabel(opt)}
            </option>
          );
        })}
      </select>
    ),
  };
  return inputs[option.type]?.() || null;
};

const CodeDisplay = ({ code, highlightedLines }) => {
  const html = useHighlightedCode(code);
  const { copied, copy } = useClipboard();
  const containerRef = useRef(null);

  const processedHtml = useMemo(() => {
    if (!html) return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const pre = doc.querySelector("pre");
    if (!pre) return html;
    const lines = pre.innerHTML.split("\n");
    pre.innerHTML = lines
      .map((l, i) => `<span class="code-line" data-line="${i}">${l}</span>`)
      .join("\n");
    return doc.body.innerHTML;
  }, [html]);

  useEffect(() => {
    if (!containerRef.current) return;
    const raf = requestAnimationFrame(() => {
      containerRef.current.querySelectorAll(".code-line").forEach((el) => {
        const i = Number(el.dataset.line);
        el.classList.toggle("highlight-line", highlightedLines.has(i));
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [highlightedLines]);

  const hexToRgba = (hex, a) =>
    `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(
      hex.slice(3, 5),
      16
    )},${parseInt(hex.slice(5, 7), 16)},${a})`;

  return (
    <div className="relative rounded overflow-hidden w-full code-playground border border-[#d5d9eb46] group">
      <style>{`
        .code-line{display:inline-block;width:100%;transition:background-color .3s ease-out;border-radius:3px}
        .highlight-line{background-color:${hexToRgba(
          HIGHLIGHT_COLOR,
          0.3
        )};animation:highlight-fade 1.5s ease-out}
        @keyframes highlight-fade{
          0%{background-color:${hexToRgba(HIGHLIGHT_COLOR, 0.5)}}
          100%{background-color:${hexToRgba(HIGHLIGHT_COLOR, 0)}}
        }
      `}</style>
      <Button
        onClick={() => copy(code)}
        variant={copied ? "success" : "default"}
        className={`absolute top-2 right-2 ${BUTTON_STYLES.copy}`}
        aria-label={copied ? "Code copied" : "Copy code"}>
        {copied ? "Copied!" : "Copy"}
      </Button>
      <div
        ref={containerRef}
        className="shiki-container"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
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
          className="flex md:items-center md:flex-row flex-col gap-2">
          <label className="mr-4 min-w-[120px]">{opt.label || opt.name}:</label>
          <ControlInput
            option={opt}
            value={values[opt.name]}
            onChange={(v) => onValueChange(opt.name, v)}
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
          variant={resetting ? "success" : "default"}>
          {resetting ? "Reset!" : "Reset to defaults"}
        </Button>
      </div>
    </div>
  );
};

const generateCSS = (options, values, elementName, cssVariableScope) => {
  const cssVars = [];
  const rules = {};
  options.forEach((opt) => {
    const value = values[opt.name];
    const sel = opt.options
      ?.map(utils.normalizeOption)
      .find((o) => utils.getOptionValue(o) === value);
    const props = sel?.properties ||
      opt.properties || [{ property: opt.property, unit: opt.unit }];
    props.forEach(({ property, value: pv, unit }) => {
      if (!property) return;
      const final = `${pv ?? value}${unit || ""}`;
      if (property.startsWith("--")) cssVars.push(`  ${property}: ${final};`);
      else {
        const tgt = opt.targetClass
          ? utils.formatClassName(opt.targetClass)
          : elementName;
        rules[tgt] = rules[tgt] || [];
        rules[tgt].push(`  ${property}: ${final};`);
      }
    });
  });
  const varBlock = cssVars.length
    ? `${cssVariableScope} {\n${cssVars.join("\n")}\n}\n\n`
    : "";
  const rulesBlock = Object.entries(rules)
    .map(([cls, ps]) => `.${cls} {\n${ps.join("\n")}\n}`)
    .join("\n\n");
  return (varBlock + rulesBlock).trim();
};

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
      (acc, opt) => ({ ...acc, [opt.name]: utils.getInitialValue(opt) }),
      {}
    )
  );
  const { highlightedLines, highlightLine, clearAll } = useHighlightedLines();
  const [previousCSS, setPreviousCSS] = useState("");

  useEffect(() => {
    setValues(
      options.reduce(
        (acc, opt) => ({ ...acc, [opt.name]: utils.getInitialValue(opt) }),
        {}
      )
    );
  }, [options]);

  const displayCSS = useMemo(() => {
    const gen =
      providedCSS ||
      generateCSS(options, values, elementName, cssVariableScope);
    return customCSS && !hideCustomCSS && gen
      ? `${customCSS.trim()}\n\n${gen}`
      : gen || customCSS;
  }, [
    options,
    values,
    elementName,
    customCSS,
    providedCSS,
    cssVariableScope,
    hideCustomCSS,
  ]);

  useEffect(() => {
    if (previousCSS && displayCSS !== previousCSS) {
      const prevLines = previousCSS.split("\n");
      const currLines = displayCSS.split("\n");
      currLines.forEach((line, i) => {
        const p = prevLines[i] || "";
        const lc = line.trim();
        const lp = p.trim();
        const rx = /^\s*([a-zA-Z-]+)\s*:\s*(.+);?\s*$/;
        const m1 = line.match(rx);
        const m2 = p.match(rx);
        if (lc && lc !== lp && m1 && (!m2 || m1[1] === m2[1])) highlightLine(i);
      });
    }
    setPreviousCSS(displayCSS);
  }, [displayCSS, highlightLine, previousCSS]);

  const handleValueChange = useCallback(
    (name, value) => {
      clearAll();
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    [clearAll]
  );

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
        margin: "3em auto",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {};

  return (
    <div
      className="my-[3em] p-6 bg-[#293056] rounded-md space-y-6"
      style={containerStyle}>
      {options.length > 0 && (
        <ControlPanel
          options={options}
          values={values}
          onValueChange={handleValueChange}
          onReset={() => {
            clearAll();
            setValues(
              options.reduce(
                (acc, opt) => ({
                  ...acc,
                  [opt.name]: utils.getInitialValue(opt),
                }),
                {}
              )
            );
          }}
        />
      )}
      <div
        className={`flex gap-4 ${
          isHorizontal ? "md:flex-row" : ""
        } flex-col-reverse`}>
        {displayCSS && (
          <div
            className={
              isHorizontal ? "lg:flex lg:min-w-[350px]" : "w-full lg:mb-0"
            }>
            <CodeDisplay
              code={displayCSS}
              highlightedLines={highlightedLines}
            />
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
