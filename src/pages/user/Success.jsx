import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Success() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <Card className="w-full max-w-md text-center shadow-lg border border-border bg-card">
        <CardHeader>
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-foreground">
            🎉 እንኳን ደስ አላች!
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-muted-foreground mb-6">
            የክፍል ቦታ ማስያዝዎ ስኬታማ ነበር። እርስዎን ለማስተናገድ በጉጉት እንጠብቃለን!
          </p>

          <Link to="/myrooms">
            <Button className="w-full">ወደ ክፍሎቼ ሂድ</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
