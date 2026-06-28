"use client";

import {
  SectionPageSlider,
  useResponsiveItemsPerPage,
} from "@/components/section-page-slider";

type DonorMember = {
  id: number;
  name: string;
  profileImage: string | null;
};

type DonorShowcaseSliderProps = {
  donors: DonorMember[];
};

export function DonorShowcaseSlider({ donors }: DonorShowcaseSliderProps) {
  const itemsPerPage = useResponsiveItemsPerPage(
    [
      { minWidth: 1024, count: 10 },
      { minWidth: 768, count: 8 },
      { minWidth: 640, count: 6 },
    ],
    4,
  );

  return (
    <SectionPageSlider
      items={donors}
      itemsPerPage={itemsPerPage}
      getItemKey={(donor) => donor.id}
      ariaLabel="Donor members"
      pageClassName="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 md:gap-6 lg:grid-cols-5"
      renderItem={(donor) => (
        <article className="flex flex-col items-center text-center">
          <div className="flex aspect-[5/4] w-full items-center justify-center rounded-bl-[2rem] rounded-tr-xl border border-slate-100 bg-white p-3 shadow-sm transition duration-300 hover:border-emerald-100 hover:shadow-md sm:p-4">
            {donor.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={donor.profileImage}
                alt=""
                className="max-h-full max-w-full rounded-bl-[1.25rem] rounded-tr-lg object-contain"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-bl-[1.25rem] rounded-tr-lg bg-gradient-to-br from-emerald-100 to-sky-100 text-2xl font-bold text-emerald-800 sm:h-20 sm:w-20">
                {donor.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <p className="mt-3 line-clamp-2 text-xs font-semibold text-neutral-800">
            {donor.name}
          </p>
        </article>
      )}
    />
  );
}
