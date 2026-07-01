import clsx from 'clsx';
import { type LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: LucideIcon;
  children: React.ReactNode;
}

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200',
};

export default function Button({ variant = 'primary', icon: Icon, children, className, ...props }: ButtonProps) {
  return (
    <button className={clsx(variants[variant], className)} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
