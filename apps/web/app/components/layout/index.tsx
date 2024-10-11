"use client";

import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { AlertCircle, CheckCircle2, ChevronUp, Cloud, X } from "lucide-react";
import type { ReactNode } from "react";
import toast, { resolveValue, Toaster } from "react-hot-toast";
import { Logo } from "./logo";

type LayoutProps = {
  children: ReactNode;
  topBar?: ReactNode;
  bottomBar?: ReactNode;
  removeTopBar?: boolean;
  removeBottomBar?: boolean;
  className?: string;
};

export function Layout({
  children,
  bottomBar,
  topBar,
  removeBottomBar = false,
  removeTopBar = false,
  className,
}: LayoutProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <Toaster
        position="bottom-center"
        containerStyle={{
          position: "absolute",
        }}
        toastOptions={{
          duration: 2500,
          error: {
            className: "text-red-600 bg-red-50 border border-red-200",
          },
          success: {
            className: "text-green-700 bg-green-50 border border-green-200",
          },
        }}
      >
        {(t) => (
          <div
            data-open={t.visible}
            className={cn(
              "data-[open=true]:animate-in data-[open=false]:animate-out data-[open=true]:zoom-in-95 data-[open=true]:fade-in-0 data-[open=false]:fade-out-0 data-[open=false]:zoom-out-95 fill-mode-forwards flex size-fit items-center justify-between gap-2 rounded-lg p-6 text-sm shadow-lg",
              t.className,
            )}
          >
            {t.type === "success" && (
              <div>
                <CheckCircle2 size={16} />
              </div>
            )}
            {t.type === "error" && (
              <div>
                <AlertCircle size={16} />
              </div>
            )}
            {resolveValue(t.message, t)}
            <Button
              onClick={() => toast.dismiss(t.id)}
              variant="icon"
              size="icon"
              className="text-inherit"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}
      </Toaster>
      <div className="flex w-full h-fit py-4 px-10 justify-between items-center bg-foreground gap-20 z-50 top-0 left-0 sticky">
        <Logo />
        <div className="flex gap-2 text-accent-foreground items-center mr-auto">
          <Cloud size={24} />
          <span className="text-accent font-semibold text-xl">
            GHG Protocol
          </span>
          <ChevronUp size={24} />
        </div>
      </div>
      <div className="h-full w-full flex flex-col">
        {!removeTopBar && <div className="min-h-11 w-full">{topBar}</div>}
        <div className={className}>
          {children}
        </div>
        {!removeBottomBar && <div className="min-h-20 ">{bottomBar}</div>}
      </div>
    </div>
  );
}
