import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link href="/login">Login</Link>
    </>
  );
}
