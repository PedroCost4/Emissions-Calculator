import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { cn } from "@repo/ui/lib/utils";
import { Providers } from "./components/layout/providers";
import { Suspense } from "react";
const archivo = Archivo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zaya",
  description: "Take care of the environment you care about.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={cn(archivo.className, "h-screen max-w-screen")}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
