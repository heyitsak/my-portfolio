interface SectionHeadingProps {
  children: React.ReactNode;
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-12 relative inline-block">
      {children}
      <span className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
    </h2>
  );
}
