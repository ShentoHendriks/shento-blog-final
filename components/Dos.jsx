export default function Dos({ children, dos = false, donts = false }) {
  return (
    <div className="flex gap-3 items-start dos my-2">
      <img
        className="!my-0 border-none w-5 h-5 relative top-[2px]"
        src={`${dos ? "icons/success.svg" : ""} ${
          donts ? "icons/danger.svg" : ""
        }`}
      />
      <div>{children}</div>
    </div>
  );
}
