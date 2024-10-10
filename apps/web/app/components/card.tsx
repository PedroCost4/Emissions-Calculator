import { cn } from "@repo/ui/lib/utils";
import type { ReactNode } from "react";
import { BarLoader } from "react-spinners";

type CardProps = {
  description: string;
  title: string;
  value?: string;
  unit?: string;
  children?: ReactNode;
  loading?: boolean;
  className?: string;
};

export function Card({
  description,
  title,
  value,
  unit,
  children,
  loading,
  className,
}: CardProps) {
  return (
    <div className={cn("flex gap-6 border rounded-lg w-full p-8 h-full", className)}>
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <span className="font-medium text-lg">{title}</span>
          <span className="text-stone-400 font-normal text-sm ">{description}</span>
        </div>
        {loading && <BarLoader color="#4fd1c5"/>}
        {unit && value && !loading && <div className="flex flex-col gap-2 text-right">
          <span className="font-semibold text-4xl">{value}</span>
          <span className="text-stone-400 font-normal text-sm">{unit}</span>
        </div>}
      </div>
      {children}
    </div>
  );
}
