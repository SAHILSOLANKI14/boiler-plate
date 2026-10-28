import type { ComponentPropsWithoutRef } from 'react';

import '../fontawesome/fontawesome.css';

export type FontAwesomeStyle = 'solid' | 'regular' | 'light' | 'brands';

export type FontAwesomeSize =
  | '2xs'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'xl'
  | '2xl'
  | '1x'
  | '2x'
  | '3x'
  | '4x'
  | '5x'
  | '6x'
  | '7x'
  | '8x'
  | '9x'
  | '10x';

const styleClass = {
  solid: 'fa-solid',
  regular: 'fa-regular',
  light: 'fa-light',
  brands: 'fa-brands',
} as const satisfies Record<FontAwesomeStyle, string>;

export type FontAwesomeIconProps = {
  icon: string;
  variant?: FontAwesomeStyle;
  size?: FontAwesomeSize;
  fixedWidth?: boolean;
  spin?: boolean;
  pulse?: boolean;
  title?: string;
} & Omit<ComponentPropsWithoutRef<'i'>, 'children'>;

function toIconClass(icon: string): string {
  const name = icon.trim().replace(/^fa-/, '');
  return `fa-${name}`;
}

export function FontAwesomeIcon({
  icon,
  variant = 'solid',
  size,
  fixedWidth = false,
  spin = false,
  pulse = false,
  title,
  className,
  ...rest
}: FontAwesomeIconProps) {
  const classNames = [
    styleClass[variant],
    toIconClass(icon),
    size && `fa-${size}`,
    fixedWidth && 'fa-fw',
    spin && 'fa-spin',
    pulse && 'fa-pulse',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <i
      {...rest}
      className={classNames}
      title={title}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    />
  );
}
