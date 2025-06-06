export default function Callout({ children, type = "info" }) {
  const typeStyles = {
    danger: {
      bg: "bg-[#FEE4E2]",
    },
    warning: {
      bg: "bg-[#FEF0C7]",
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
      className={`rounded-md ${styles.bg} ${styles.text} px-6 py-4 my-4 callout text-sm`}
    >
      {children}
    </div>
  );
}
