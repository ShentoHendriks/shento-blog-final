import fs from "fs";
import matter from "gray-matter";
import BlogWithSearch from "./BlogWithSearch";

function getPosts() {
  return fs
    .readdirSync("posts")
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const fileContent = fs.readFileSync(`posts/${file}`, "utf8");
      const { data, content } = matter(fileContent);
      return { slug, data, content };
    })
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}

export default function Home() {
  const posts = getPosts();
  return (
    <div className="container mx-auto p-4">
      <h1>Articles</h1>
      <BlogWithSearch posts={posts} />
    </div>
  );
}
