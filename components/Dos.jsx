export default function Dos({ children, dos = false, donts = false }) {
  return (
    <div className="flex gap-3 items-center dos my-2">
      <img
        className="!my-0 border-none w-5 h-5"
        src={`${dos ? "icons/success.svg" : ""} ${
          donts ? "icons/danger.svg" : ""
        }`}
      />
      <div>{children}</div>
    </div>
  );
}
