interface SectionHeadingProps {
  children: React.ReactNode;
  gradient?: boolean;
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className="w-full flex justify-center mb-12">
      <h2 className="relative inline-block group cursor-default">
        <span className="text-2xl md:text-3xl lg:text-4xl font-bold font-display bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-yellow-400 group-hover:via-rose-500 group-hover:to-violet-600">
          {children}
        </span>
        {/* Decorative underline */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full group-hover:w-24 transition-all duration-300" />
      </h2>
    </div>
  );
}
