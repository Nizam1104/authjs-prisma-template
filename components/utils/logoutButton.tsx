"use client"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
    const router = useRouter()

    const handleSignOut = async function() {
        await signOut()
        router.push('/login')
    }

  return (
    <Button onClick={handleSignOut}>
      Logout
    </Button>
  );
}
