export default function Callout({ children }) {
  return (
    <div className="rounded-md border border-[#D5D9EB] px-6 py-4 my-[2em] callout">
      <p className="font-bold">Good to know!</p>
      {children}
    </div>
  );
}
