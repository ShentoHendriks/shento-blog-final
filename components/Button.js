"use client";

export default function Button({ children, message }) {
  return <button onClick={() => alert(message)}>{children}</button>;
}
