import Link from "next/link";

export default function NavBar() {
  return (
    <header>
      <nav className="mx-auto container p-4 flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
