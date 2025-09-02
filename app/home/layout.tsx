// "use client"

import PrimaryLayout from "@/components/layouts/PrimaryLayout";

// import { fetchPosts } from "@/actions/post";

// import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {

  // useEffect(() => {
  //   async function fetch() {
  //     const postsData = await fetchPosts()
  //   }

  //   fetch()
  // }, [])
  return (
    <PrimaryLayout>
      {children}
    </PrimaryLayout>
  );
}
