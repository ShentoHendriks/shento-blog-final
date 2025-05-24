import fs from "fs";
import matter from "gray-matter";
import BlogWithSearch from './BlogWithSearch';

function getPosts() {
  return fs
    .readdirSync("posts")
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const { data } = matter(fs.readFileSync(`posts/${file}`, "utf8"));
      return { slug, data };
    })
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}

export default function Home() {
  const posts = getPosts();

  return (
    <div className="container mx-auto p-4">
      <h1>My Blog!</h1>
      <p>Hey, I'm Shento. A full-stack developer who's also interested in design.</p>
      <p>This tech blog acts as my personal resource, but perhaps you might find something useful.

I write tutorials for both web developers and designers, keeping things accessible and straightforward. My code examples are intentionally minimal—just the essentials—so you can easily customize and build upon them for your own projects.</p>
      
      <BlogWithSearch posts={posts} />
    </div>
  );
}