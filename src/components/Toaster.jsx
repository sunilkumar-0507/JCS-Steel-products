import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Toaster() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background shadow-xl animate-fade-up"
        >
          <CheckCircle2 className="h-4 w-4 text-accent" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
