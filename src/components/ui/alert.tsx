import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        warning:
          "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100 [&>svg]:text-yellow-600",
        danger:
          "border-red-500/50 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100 [&>svg]:text-red-600",
        success:
          "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100 [&>svg]:text-green-600",
        primary:
          "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertVariant = "default" | "warning" | "danger" | "success" | "primary";

const iconMap: Record<AlertVariant, typeof Info> = {
  default: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  success: CheckCircle,
  primary: Info,
};

export interface AlertProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "title">,
    VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  color?: AlertVariant;
}

function Alert({
  className,
  color,
  variant,
  title,
  description,
  children,
  ...props
}: AlertProps) {
  const effectiveVariant = color ?? variant ?? "default";
  const Icon = iconMap[effectiveVariant];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant: effectiveVariant }), className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <div>
        {title && <h5 className="mb-1 font-medium leading-none">{title}</h5>}
        {description && (
          <div className="text-sm [&_p]:leading-relaxed">{description}</div>
        )}
        {children}
      </div>
    </div>
  );
}
Alert.displayName = "Alert";

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}
AlertTitle.displayName = "AlertTitle";

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
