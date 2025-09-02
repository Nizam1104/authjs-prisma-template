"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("login");

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "register" || modeParam === "login") {
      setMode(modeParam);
    } else {
      setMode("login"); // Default mode
    }
  }, [searchParams]);

  const handleSignin = async () => {
    await signIn('google');
  };

  const toggleMode = (newMode: string) => {
    setMode(newMode);
    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set('mode', newMode);
    router.push(url.pathname + url.search, { scroll: false });
  };

  const isLoginMode = mode === "login";

  return (
    <AuthLayout>
      <Card className="hover:scale-[1.01]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLoginMode ? "Welcome Back!" : "Create Account"}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {isLoginMode 
              ? "Sign in to your account" 
              : "Sign up for a new account"
            }
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={handleSignin}
          >
            <FcGoogle className="h-5 w-5" />
            {isLoginMode ? "Sign in with Google" : "Sign up with Google"}
          </Button>

          {/* Toggle Mode Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLoginMode ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => toggleMode("register")}
                  className="text-blue-600 hover:underline font-medium cursor-pointer bg-transparent border-none"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => toggleMode("login")}
                  className="text-blue-600 hover:underline font-medium cursor-pointer bg-transparent border-none"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
