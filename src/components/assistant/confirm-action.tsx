import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** A button that asks "tem certeza?" in large, plain words before an action that erases data. */
export function ConfirmAction({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  disabled,
  variant = "outline",
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  disabled?: boolean;
  variant?: "outline" | "destructive";
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={variant} size="xl" disabled={disabled}>
          {trigger}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl rounded-2xl border-2 p-7">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-xl text-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-3">
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "outline", size: "xl" }), "mt-0")}
          >
            Não, voltar
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive", size: "xl" })}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
