import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Testimonials() {
  return (
    <section className="bg-muted py-20 transition-colors" id="testimonial">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
        እንግዶቻችን የሚሉት
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            text: "አስደናቂ ቆይታ! ሰራተኞቹ በጣም አቀባበል አድርገውላቸዋል፤ ክፍሎቹም ምንም እንከን የለሽ ናቸው።",
            name: "Hana T/Hana",
          },
          {
            text: "ሬስቶራንቱ ምርጥ የአካባቢ ምግቦችን ያቀርባል። በጣም እመክራለሁ!",
            name: "Abenezer A",
          },
          {
            text: "ቦታ ማስያዝ በጣም ቀላል እና ምቹ ነበር። እዚህ እንደገና እቆያለሁ።",
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
