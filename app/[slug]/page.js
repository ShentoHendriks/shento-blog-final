import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import fs from "fs";
import components from "@/components";
import rehypeShiki from "@shikijs/rehype";
import Image from "next/image";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default async function Post({ params }) {
  const { slug } = await params; // Await params here
  const { data, content } = matter(
    fs.readFileSync(`posts/${slug}.mdx`, "utf8")
  );

  return (
    <article className="container mx-auto p-4 pt-16 article">
      <div className="flex flex-wrap gap-1">
        {data.categories
          .sort((a, b) => a.localeCompare(b))
          .map((c, index) => (
            <div
              className="text-sm opacity-70 px-2 py-0.5 flex w-fit rounded-md"
              key={index}
            >
              {c}
            </div>
          ))}
      </div>
      <h1 className="mt-4">{data.title}</h1>
      <p className="text-xl max-w-[600px] description">{data.description}</p>
      <div className="flex gap-2.5 items-center text-sm mb-20">
        <Image
          className="w-8 h-8 rounded-full !my-0"
          width={100}
          height={100}
          src="/shento-image.png"
          alt="Image of Shento Hendriks"
        />
        <p className="opacity-70">By Shento Hendriks</p>
        <p className="opacity-70">•</p>
        <time className="opacity-70" datetime={formatDate(data.date)}>
          {formatDate(data.date)}
        </time>
      </div>
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
