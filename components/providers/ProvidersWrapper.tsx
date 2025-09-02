"use client"

import { SessionProvider } from "next-auth/react";
import React from "react";
import AppInitialiser from "./AppInitialiser";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <SessionProvider
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        <AppInitialiser>
          {children}
        </AppInitialiser>
      </ThemeProvider>
    </SessionProvider>
  );
}
