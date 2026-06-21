import Image from "next/image";

export function BrandedLoading({
  message = "Loading your workspace",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F8FB] px-4">
      <div className="text-center">
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#D7E4EE] border-t-[#37B8D8]" />
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white p-2 shadow-lg shadow-[#0F2F57]/10">
            <Image
              src="/Nanjil.png"
              alt="Nanjil MEP Service"
              width={96}
              height={44}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
        <p className="mt-5 text-sm font-semibold text-[#12355B]">{message}</p>
        <p className="mt-1 text-xs text-slate-500">
          Please wait a moment
        </p>
      </div>
    </div>
  );
}
