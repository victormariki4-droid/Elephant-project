import clsx from 'clsx';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export default function Badge({ variant = 'info', children, className }: BadgeProps) {
  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  );
}
