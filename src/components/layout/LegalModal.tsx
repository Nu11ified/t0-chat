"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LegalModal({ type }: { type: "Terms" | "Privacy" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-primary">
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "Terms" ? "Terms of Service" : "Privacy Policy"}</DialogTitle>
        </DialogHeader>
        <div className="prose dark:prose-invert">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 