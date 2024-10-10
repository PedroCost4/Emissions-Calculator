import { usePathname, useSearchParams, useRouter } from "next/navigation";

type UsePaginationArgs = {
  take?: number;
  skip?: number;
};

export const usePagination = (
  initialValues?: UsePaginationArgs,
  paramPrefix?: string,
) => {
  const paginationParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const skipParam = `${paramPrefix ? paramPrefix + "-" : ""}skip`;
  const takeParam = `${paramPrefix ? paramPrefix + "-" : ""}take`;

  const currSkip = Number(
    paginationParams.get(skipParam) ?? initialValues?.skip ?? 0,
  );
  const currTake = Number(
    paginationParams.get(takeParam) ?? initialValues?.take ?? 10,
  );

  const getTotalPages = (total: number) => {
    return Math.ceil(total / currTake);
  };
  const getCurrentPage = () => Math.ceil(currSkip / currTake) + 1;

  const set = (skip?: number, take?: number) => {
    const params = new URLSearchParams(paginationParams);
    const currentPage = getCurrentPage();

    if (take && currentPage !== 1) {
      skip = 0;
    }

    params.set(skipParam, String(skip ?? currSkip));
    params.set(takeParam, String(take ?? currTake));

    router.push(`${pathname}?${params.toString()}`);
  };

  return { skip: currSkip, take: currTake, set, getCurrentPage, getTotalPages };
};