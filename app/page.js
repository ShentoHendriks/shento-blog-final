import fs from "fs";
import Link from "next/link";

export default function Home() {
  const posts = fs.readdirSync("posts").map((f) => f.replace(".mdx", ""));

  return (
    <div>
      <h1>My Blog</h1>
      {posts.map((post) => (
        <div key={post}>
          <Link href={`/${post}`}>{post}</Link>
        </div>
      ))}
    </div>
  );
}
