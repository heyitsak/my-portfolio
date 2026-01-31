interface SectionHeadingProps {
  children: React.ReactNode;
  gradient?: boolean;
}

export function SectionHeading({ children, gradient = false }: SectionHeadingProps) {
  return (
    <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-12 relative inline-block group cursor-default">
      <span
        className={
          gradient
            ? 'text-gradient inline-block transition-all duration-300'
            : 'text-theme'
        }
      >
        {children}
      </span>
      <span className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full group-hover:w-20 transition-all duration-300" />
    </h2>
  );
}
