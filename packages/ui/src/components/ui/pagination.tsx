import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

type PaginationCountProps = {
  total: number;
  pageSize: number;
  sizes: number[];
  // eslint-disable-next-line no-unused-vars
  onSizeChange: (value: number) => void;
};

function PaginationSize({
  pageSize,
  total,
  sizes,
  onSizeChange,
}: PaginationCountProps) {
  return (
    <div className="flex items-center gap-2 max-md:justify-center">
      <p className="text-sm text-slate-700">Mostrando {total}</p>
      <p className="text-nowrap text-sm text-slate-700">de</p>
      <Select
        onValueChange={(value) => {
          onSizeChange(Number(value));
        }}
        defaultValue={`${pageSize}`}
      >
        <SelectTrigger className="w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sizes?.map((size) => (
            <SelectItem key={size} value={`${size}`}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface PaginationNavigationProps {
  // eslint-disable-next-line no-unused-vars
  onPageChange: (value: number) => void;
  pages: number[];
  page: number;
}

export function PaginationNavigation({
  onPageChange,
  pages,
  page,
}: PaginationNavigationProps) {
  const hasPrevious = page !== 1;
  const hasNext = page !== pages.length && pages.length !== 0;

  return (
    <div className="flex gap-2 max-md:justify-between">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrevious}
        onClick={() => {
          onPageChange(page - 1);
        }}
      >
        <ChevronLeft /> <p className="max-md:hidden">Anterior</p>
      </Button>
      <Select
        onValueChange={(value) => {
          onPageChange(Number(value));
        }}
        defaultValue={`${page}`}
        value={`${page}`}
      >
        <SelectTrigger className="w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pages?.map((page) => (
            <SelectItem key={page} value={`${page}`}>
              {page}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        disabled={!hasNext}
        onClick={() => {
          onPageChange(page + 1);
        }}
      >
        <p className="max-md:hidden">Próximo</p>
        <ChevronRight />
      </Button>
    </div>
  );
}

export { PaginationSize };
