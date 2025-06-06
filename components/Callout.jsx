export default function Callout({ children, type = "info" }) {
  const typeStyles = {
    danger: {
      bg: "bg-[#FEE4E2]",
    },
    warning: {
      bg: "bg-[#FFE8C5]",
    },
    success: {
      bg: "bg-[#DCFAE6]",
    },
    info: {
      bg: "bg-[#EAECF5]",
    },
  };

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`rounded-md ${styles.bg} ${type} px-5 py-5 my-4 callout text-sm`}
    >
      <div className="flex items-center gap-3">
        <img
          className="border-none !mt-2 w-4 h-4 fill-[#891910]"
          src={`icons/${type}.svg`}
        />
        <p
          className={`!my-0 !-mt-2 font-bold capitalize ${
            type == "danger" && "text-[#891910]"
          }
           ${type == "warning" && "text-[#67430D]"}
            ${type == "success" && "text-[#115828]"}`}
        >
          {type}
        </p>
      </div>
      <div
        className={`${type == "danger" && "text-[#891910]"}
      ${type == "warning" && "text-[#67430D]"}
      ${type == "success" && "text-[#115828]"}
      `}
      >
        {children}
      </div>
    </div>
  );
}
