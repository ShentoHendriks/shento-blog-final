"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";

export function Steps({ children }) {
  return <div className="flex flex-col gap-12 md:gap-16">{children}</div>;
}

export function Step({ asideContent, step, title, children }) {
  // 1. Renamed `children` to `asideContent`. 2. Added `children` for MDX content (was `content`).
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 items-start">
      <div className="lg:col-span-5 flex flex-col">
        <div className="flex items-start">
          <div className="text-3xl sm:text-4xl font-mono text-gray-400 dark:text-gray-500 mr-3 sm:mr-4 pt-px">
            [{String(step).padStart(2, "0")}]
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {children && ( // Was `content`, now `children`. MDX content will be rendered here.
              <div className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-7 mt-4 lg:mt-0">
        {asideContent} {/* Was `children`, now `asideContent` */}
      </div>
    </div>
  );
}
