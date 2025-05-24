export default function Callout({ children }) {
  return (
    <div className="rounded-md border border-[#D5D9EB] px-6 py-3 my-16">
      <p className="font-bold">Good to know!</p>
      {children}
    </div>
  );
}
