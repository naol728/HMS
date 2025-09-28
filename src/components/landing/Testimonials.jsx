import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Testimonials() {
  return (
    <section className="bg-muted py-20 transition-colors" id="testimonial">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
        What Our Guests Say
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            text: "Amazing stay! The staff was very welcoming and the rooms are spotless.",
            name: "Hana T/Hana",
          },
          {
            text: "The restaurant serves the best local dishes. Highly recommend!",
            name: "Abenezer A",
          },
          {
            text: "Booking was super easy and convenient. Will stay here again.",
            name: "Meaza S",
          },
        ].map((feedback) => (
          <Card
            key={feedback.name}
            className="text-center border border-border rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card"
          >
            <CardContent>
              <p className="italic text-foreground/90">"{feedback.text}"</p>
              <h3 className="mt-4 font-bold">{feedback.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
