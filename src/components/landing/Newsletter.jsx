import React from "react";
import { Button } from "../ui/button";

export default function Newsletter() {
  return (
    <section className="bg-primary text-primary-foreground py-16 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Stay Updated with Semayawi Hotel
        </h2>
        <p className="text-lg md:text-xl opacity-90">
          Subscribe to our newsletter for the latest offers and news.
        </p>

        <div className="flex flex-col  sm:flex-row items-center justify-center w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 px-4 py-3 rounded-md sm:rounded-r-none border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition"
          />
          <Button
            variant="secondary"
            className="w-full sm:w-auto px-6 py-3 rounded-md sm:rounded-l-none mt-4 sm:mt-0"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}
