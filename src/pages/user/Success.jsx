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
            🎉 Congratulations!
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-muted-foreground mb-6">
            Your room reservation was successful. We look forward to hosting
            you!
          </p>

          <Link to="/myrooms">
            <Button className="w-full">Go to My Rooms</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
