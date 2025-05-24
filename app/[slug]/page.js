import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import fs from "fs";
import components from "@/components";
import rehypeShiki from "@shikijs/rehype";

export default async function Post({ params }) {
  const { slug } = await params; // Await params here
  const { data, content } = matter(
    fs.readFileSync(`posts/${slug}.mdx`, "utf8")
  );

  return (
    <article className="container mx-auto p-4 article">
      <h1>{data.title}</h1>
      <p className="text-xl max-w-[600px] description">{data.description}</p>
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypeShiki,
                {
                  theme: "catppuccin-frappe",
                },
              ],
            ],
          },
        }}
      />
    </article>
  );
}

export function generateStaticParams() {
  return fs.readdirSync("posts").map((f) => ({ slug: f.replace(".mdx", "") }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params; // Await params here too
  const { data } = matter(fs.readFileSync(`posts/${slug}.mdx`, "utf8"));

  return {
    title: data.title + " | Shento's Blog",
  };
}