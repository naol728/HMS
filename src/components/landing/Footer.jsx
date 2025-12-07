import React from "react";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-10 text-center space-y-4 border-t border-border">
      <p>© 2025 ሰማያዊ ሆቴል ፣ ደብረ ብርሃን ፣ ኢትዮጵያ</p>
      <p>እውቂያ: +251 907203507 | ኢሜይል: info@semayawihotel.com</p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="hover:text-primary">
          ፌስቡክ
        </a>
        <a href="#" className="hover:text-primary">
          ትዊተር
        </a>
        <a href="#" className="hover:text-primary">
          ኢንስታግራም
        </a>
      </div>
    </footer>
  );
}
