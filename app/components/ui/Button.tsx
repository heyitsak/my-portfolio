'use client';

import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'coffee' | 'ghost';

interface BaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    relative overflow-hidden px-8 py-4
    bg-indigo-600 hover:bg-indigo-500
    text-white font-medium rounded-lg
    transition-all duration-300 ease-out
    hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.5)]
    active:translate-y-0 active:scale-[0.98]
  `,
  secondary: `
    relative px-8 py-4
    text-gray-300 font-medium
    transition-all duration-300 ease-out
    hover:text-white
    after:content-[''] after:absolute after:bottom-3 after:left-8 after:right-8
    after:h-[2px] after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500
    after:scale-x-0 after:origin-right after:transition-transform after:duration-300
    hover:after:scale-x-100 hover:after:origin-left
  `,
  coffee: `
    inline-flex items-center gap-3 px-6 py-4
    bg-[#FFDD00] hover:bg-[#FFED4E]
    text-black font-medium rounded-lg
    transition-all duration-300 ease-out
    hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_40px_-10px_rgba(255,221,0,0.4)]
    active:translate-y-0 active:scale-[0.98]
  `,
  ghost: `
    relative text-gray-500 hover:text-gray-300
    transition-colors duration-300
    after:content-[''] after:absolute after:bottom-0 after:left-0
    after:w-full after:h-px after:bg-current
    after:scale-x-0 after:origin-right after:transition-transform after:duration-300
    hover:after:scale-x-100 hover:after:origin-left
  `,
};

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = variantStyles[variant];
  const combinedClassName = `${baseStyles} ${className}`.trim();

  if ('href' in props && props.href) {
    return (
      <a className={combinedClassName} {...props}>
        {variant === 'primary' && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
        )}
        <span className="relative">{children}</span>
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
