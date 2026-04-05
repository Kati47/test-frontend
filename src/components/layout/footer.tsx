export function Footer() {
  return (
    <footer className="relative border-t border-[#2C4A86]/15 bg-gradient-to-r from-[#2C4A86]/[0.04] via-[#fcfbf7] to-[#E63B44]/[0.06]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#2C4A86] via-[#FFFFFF] to-[#E63B44]" />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-4 text-xs tracking-[0.08em] text-[#2C4A86]/80">
        <p>
          © 2026 <span className="text-[#2C4A86]">Zenith</span> <span className="text-[#E63B44]">Assurance</span> · All rights reserved
        </p>
      </div>
    </footer>
  );
}
