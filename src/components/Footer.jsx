import React from "react";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-10 text-center space-y-4 border-t border-border">
      <p>© 2025 Semayawi Hotel, Debre Berhan, Ethiopia</p>
      <p>Contact: +251 907203507 | Email: info@semayawihotel.com</p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="hover:text-primary">
          Facebook
        </a>
        <a href="#" className="hover:text-primary">
          Twitter
        </a>
        <a href="#" className="hover:text-primary">
          Instagram
        </a>
      </div>
    </footer>
  );
}
