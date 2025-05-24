import Link from "next/link";

export default function NavBar() {
  return (
    <header>
      <nav className="mx-auto container p-4 flex gap-4 justify-between tracking-tight">
        <Link href="/">Shento Hendriks’s Blog© </Link>
        <div className="flex gap-4">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
