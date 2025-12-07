import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const heroImages = ["/hero.jpg", "/hero2.jpg", "/hero3.jpg"];
  const [currentImage, setCurrentImage] = useState(0);
  const { user } = useSelector((state) => state.user);

  const isAdmin = user?.role === "admin";
  const isReception = user?.role === "reception";
  const isCustomer = user?.role === "customer";

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
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 ">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg animate-fadeIn text-blue-500/70">
            እንኳን ወደ ሰማያዊ ሆቴል በደህና መጡ
          </h1>
          <p className="mt-4 text-xl md:text-2xl drop-shadow-md max-w-2xl animate-fadeIn delay-200 text-blue-400/60">
            በደብረ ብርሃን ልብ ውስጥ የቅንጦት፣ የምቾት እና የአጠቃቀም ምቾት ይለማመዱ።s
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fadeIn delay-400">
            {isAdmin && (
              <Button asChild size="lg">
                <Link to="/dashboard">የአስተዳዳሪ ዳሽቦርድ</Link>
              </Button>
            )}
            {isReception && (
              <Button asChild size="lg">
                <Link to="/reception">የመቀበያ ፓነል</Link>
              </Button>
            )}
            {isCustomer && (
              <Button asChild size="lg">
                <Link to="/rooms">አሁኑኑ ቦታ ያስይዙ</Link>
              </Button>
            )}
            {user ? (
              <></>
            ) : (
              <Button asChild size="lg">
                <Link to="/login">ግባ</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "🛏️ ምቹ ክፍሎች",
            desc: "ሰፊ ዘመናዊ ክፍሎች ከነፃ ዋይፋይ፣ ጠፍጣፋ ስክሪን ቲቪዎች እና ምቹ የአልጋ ልብሶች ጋር።",
          },
          {
            title: "🍽️ ምግብ ቤት እና ካፌ",
            desc: "በየቀኑ በሚቀርቡ ጣፋጭ ምግቦች፣ ትኩስ ቡና እና የአካባቢ ምግቦች ይደሰቱ።",
          },
          {
            title: "🎉የዝግጅት አዳራሽ",
            desc: "ለሠርግ፣ ለኮንፈረንሶች እና ለማህበራዊ ዝግጅቶች በሙሉ አገልግሎት ተስማሚ.",
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
    </div>
  );
}
