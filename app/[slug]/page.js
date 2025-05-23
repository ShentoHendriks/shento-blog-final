import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import fs from "fs";
import components from "@/components";

export default function Post({ params }) {
  const { data, content } = matter(
    fs.readFileSync(`posts/${params.slug}.mdx`, "utf8")
  );

  return (
    <>
      <h1>{data.title}</h1>
      <MDXRemote
        source={content}
        components={components}
      />
    </>
  );
}

export function generateStaticParams() {
  return fs.readdirSync("posts").map((f) => ({ slug: f.replace(".mdx", "") }));
}
