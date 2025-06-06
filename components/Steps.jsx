"use client";

import { Children, cloneElement, isValidElement } from "react";

export function Steps({ children }) {
  const steps = Children.toArray(children);

  return (
    <div className="my-4">
      {steps.map((step, index) =>
        isValidElement(step)
          ? cloneElement(step, { stepNumber: index + 1 })
          : step
      )}
    </div>
  );
}

export function Step({ stepNumber, title, children }) {
  return (
    <div className={`step grid grid-cols-[45px_1fr] mb-8`}>
      <div className="relative">
        <div>
          <div className="number font-bold bg-gray-blue-100 rounded-full justify-center items-center flex w-8 h-8">
            {stepNumber?.toString()}
          </div>
          <div className="number-line absolute left-[35%] h-full w-[1px] bg-gray-blue-100"></div>
        </div>
      </div>
      <div>
        <p className="font-semibold mt-0.5 text-gray-blue-800">{title}</p>
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
