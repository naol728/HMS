import React from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { subscribenewsletter } from "@/api/newsletter";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../ui/input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: subscribenewsletter,
    mutationKey: ["subscribenewsletter"],
    onSuccess: () => {
      toast.success("sucessfully subscribed to newsletter");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return (
    <section className="bg-primary text-primary-foreground py-16 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          ከሰማያዊ ሆቴል ጋር ወቅታዊ መረጃ ያግኙ
        </h2>
        <p className="text-lg md:text-xl opacity-90">
          ለቅርብ ጊዜ ቅናሾች እና ዜናዎች ለጋዜጣችን ይመዝገቡ።
        </p>

        <div className="flex flex-col  sm:flex-row items-center justify-center w-full">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-auto flex-1 px-4 py-3 rounded-md sm:rounded-r-none border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition"
          />
          <Button
            variant="secondary"
            className="w-full sm:w-auto px-6 py-3 rounded-md sm:rounded-l-none mt-4 sm:mt-0"
            onClick={() => mutate(email)}
            disable={isPending}
          >
            ሰብስክራይብ
          </Button>
        </div>
      </div>
    </section>
  );
}
