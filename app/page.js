import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Home() {
  const posts = fs
    .readdirSync("posts")
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const { data } = matter(fs.readFileSync(`posts/${file}`, "utf8"));
      return { slug, data };
    })
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

  return (
    <div className="container mx-auto p-4">
      <h1>My Blog!</h1>
    <p>Hey, I'm Shento. A full-stack developer who's also interested in design.</p>
    <p>This tech blog acts as my personal resource, but perhaps you might find something useful.

I write tutorials for both web developers and designers, keeping things accessible and straightforward. My code examples are intentionally minimal—just the essentials—so you can easily customize and build upon them for your own projects.</p>
    <h2 className="mb-0">Latest posts</h2>
      <div className="flex flex-col gap-2">
        {posts.map(({ slug, data }) => (
          <article key={slug}>
            <h3>
              <Link
              href={`/${slug}`}>
              {data.title}
            </Link>
          </h3>
            
            <p>{formatDate(data.date)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
