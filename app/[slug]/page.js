import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import fs from "fs";
import components from "@/components";
import rehypeShiki from "@shikijs/rehype";

export default function Post({ params }) {
  const { data, content } = matter(
    fs.readFileSync(`posts/${params.slug}.mdx`, "utf8")
  );

  return (
    <main className="container mx-auto p-4 article">
      <h1>{data.title}</h1>
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypeShiki,
                {
                  theme: "github-dark",
                },
              ],
            ],
          },
        }}
      />
    </main>
  );
}

export function generateStaticParams() {
  return fs.readdirSync("posts").map((f) => ({ slug: f.replace(".mdx", "") }));
}

export async function generateMetadata({ params }) {
  const { data } = matter(fs.readFileSync(`posts/${params.slug}.mdx`, "utf8"));

  return {
    title: data.title + " | Shento's Blog",
  };
}
