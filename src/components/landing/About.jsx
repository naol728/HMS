import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  const services = [
    {
      title: "🛏️ Comfortable Rooms",
      desc: "Spacious rooms with modern design, free Wi-Fi, and premium bedding.",
    },
    {
      title: "🍽️ Restaurant & Cafe",
      desc: "Enjoy Ethiopian and international dishes prepared by top chefs.",
    },
    {
      title: "🏊 Swimming Pool & Spa",
      desc: "Relax in our pool and enjoy a full spa experience.",
    },
    {
      title: "🎉 Event & Conference Hall",
      desc: "Host weddings, meetings, and events in our fully equipped hall.",
    },
    {
      title: "🚗 Free Parking & Shuttle",
      desc: "Secure parking and shuttle services for your convenience.",
    },
    {
      title: "💻 Business Center",
      desc: "Workstations, printing, and fast internet for business travelers.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12" id="about">
      {/* Intro */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Semayawi Hotel</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Located in the heart of Debre Berhan, Semayawi Hotel offers a blend of
          modern luxury and Ethiopian hospitality. Our mission is to make every
          stay comfortable, memorable, and affordable.
        </p>
      </section>

      {/* Services */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
              className="hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
