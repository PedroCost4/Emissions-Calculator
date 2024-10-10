import { usePagination } from "~/hooks/usePagination";
import {
  PaginationNavigation,
  PaginationSize,
} from "@repo/ui/components/ui/pagination";

interface ListPaginationProps {
  totalItems: number;
}

export function TablePagination({ totalItems }: ListPaginationProps) {
  const { take, set, getCurrentPage, getTotalPages } = usePagination();

  return (
    <div className="flex justify-between gap-8 max-md:flex-col-reverse">
      <PaginationSize
        pageSize={take}
        sizes={[10, 20, 30, 50]}
        total={totalItems}
        onSizeChange={(size) => {
          set(undefined, size);
        }}
      />
      <PaginationNavigation
        onPageChange={(page) => {
          set((page - 1) * take);
        }}
        pages={Array.from(
          { length: getTotalPages(totalItems) },
          (_, i) => i + 1,
        )}
        page={getCurrentPage()}
      />
    </div>
  );
}
