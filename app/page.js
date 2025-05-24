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
      <h1 className="text-4xl mb-4">Blog</h1>
      <div className="flex flex-col gap-2">
        {posts.map(({ slug, data }) => (
          <article key={slug}>
            <Link
              className="font-bold"
              href={`/${slug}`}>
              {data.title}
            </Link>
            <p className="text-gray-400">{formatDate(data.date)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
