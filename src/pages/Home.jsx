import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  // Hero image carousel
  const heroImages = ["/hero.jpg", "/hero2.jpg", "/hero3.jpg"];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-28 bg-background text-foreground transition-colors duration-500">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[700px] transition-all duration-1000"
        style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
      >
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg animate-fadeIn text-primary-foreground">
            Welcome to Semayawi Hotel
          </h1>
          <p className="mt-4 text-xl md:text-2xl drop-shadow-md max-w-2xl animate-fadeIn delay-200 text-primary-foreground/90">
            Experience luxury, comfort, and convenience in the heart of Debre
            Berhan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fadeIn delay-400">
            <Button size="lg" asChild variant="default">
              <Link to="/rooms">Book a Room</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">View Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "🛏️ Comfortable Rooms",
            desc: "Spacious modern rooms with free Wi-Fi, flat-screen TVs, and cozy bedding.",
          },
          {
            title: "🍽️ Restaurant & Cafe",
            desc: "Delight in gourmet meals, fresh coffee, and local dishes served daily.",
          },
          {
            title: "🎉 Event Hall",
            desc: "Ideal for weddings, conferences, and social events with full service.",
          },
        ].map((item) => (
          <Card
            key={item.title}
            className="hover:shadow-2xl transition-all duration-300 border border-border rounded-xl bg-card"
          >
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>{item.desc}</CardContent>
          </Card>
        ))}
      </section>

      {/* Popular Rooms Section */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Our Popular Rooms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/371051287.jpg?k=0cf386306e47d379f3486bf2374499beed53b3ef5ddb6c0c108acec88dae8e8f&o=&hp=1",
              name: "Deluxe Room",
              desc: "Comfortable deluxe room with city view.",
              price: 80,
            },
            {
              img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/370253859.jpg?k=47464b2f220676d9bb3575fd97f1e017b6ac187c93a02fa956e8655f705e7830&o=&hp=1",
              name: "Executive Suite",
              desc: "Luxurious suite with living area and premium amenities.",
              price: 150,
            },
            {
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS20_9KxlSj0Qidm4ejMAeem_XdhZi1pCQvTg&s",
              name: "Standard Room",
              desc: "Cozy and affordable room for solo travelers.",
              price: 50,
            },
          ].map((room) => (
            <Card
              key={room.name}
              className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl border border-border bg-card"
            >
              <img
                src={room.img}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <CardContent>
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p className="text-foreground/80 mt-2">{room.desc}</p>
                <p className="mt-2 font-bold text-lg text-primary">
                  Price: ${room.price}/night
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted py-20 transition-colors">
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

      {/* Newsletter / Call to Action */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stay Updated with Semayawi Hotel
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            Subscribe to our newsletter for the latest offers and news.
          </p>

          {/* Input + Button Group */}
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
    </div>
  );
}
