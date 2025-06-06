"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createSearchIndex, searchPosts } from "@/lib/search";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function BlogWithSearch({ posts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  // Initialize search index when component mounts
  useEffect(() => {
    createSearchIndex(posts);
  }, [posts]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const results = searchPosts(searchQuery);
    setFilteredPosts(results);
  }, [searchQuery, posts]);

  return (
    <>
      {/* Search Input */}
      <div className="my-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-[#9AA2D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-[#9AA2D4]"
        />
      </div>

      <h2 className="mb-4">
        {searchQuery
          ? `Search Results (${filteredPosts.length})`
          : "Latest articles"}
      </h2>

      <div className="flex flex-col gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(({ slug, data }) => (
            <article key={slug}>
              <h3 className="my-[1rem]">
                <Link href={`/${slug}`}>{data.title}</Link>
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.categories
                  .sort((a, b) => a.localeCompare(b))
                  .map((c, index) => (
                    <div
                      className="px-2 py-0.5 bg-[#293056] text-sm text-white flex w-fit rounded-md"
                      key={index}
                    >
                      {c}
                    </div>
                  ))}
              </div>
              <p className="my-[1rem] text-slate-500">
                <Link href={`/${slug}`}>
                  {data.description.split(" ").slice(0, 30).join(" ")}
                  {data.description.split(" ").length > 30 ? "..." : ""}
                </Link>
              </p>
              <p className="text-slate-400">{formatDate(data.date)}</p>
            </article>
          ))
        ) : (
          <p className="my-8">No articles found matching "{searchQuery}"</p>
        )}
      </div>
    </>
  );
}
