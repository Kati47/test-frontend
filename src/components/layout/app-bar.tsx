import Link from "next/link";
import Image from "next/image";

export function AppBar() {
  return (
    <header className="relative border-b border-[#BBBBD0]/70 bg-[#FDFCFD] shadow-[0_4px_12px_rgba(30,41,59,0.05)]">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#BBBBD0]/70" />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-3.5">
          <div className="overflow-hidden rounded-lg border border-[#BBBBD0]/70 bg-white shadow-[0_4px_12px_rgba(30,41,59,0.06)]">
            <Image
              src="/zenithh.png"
              alt="Zenith Assurance"
              width={56}
              height={56}
              className="h-14 w-14 object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-[1.05rem] font-semibold text-[#2B4B83]">
              Zenith Assurance <span className="text-[#E63B44]"></span>
            </p>
            <div className="mt-1 h-[2px] w-16 rounded-full bg-[#ED4A52]" />
          </div>
        </Link>

      
      </div>
    </header>
  );
}
