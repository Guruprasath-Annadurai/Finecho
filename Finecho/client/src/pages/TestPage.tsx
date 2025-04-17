import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This is a minimal test page to verify rendering works
const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            FinEcho Test Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            This is a simple test page to verify rendering is working correctly.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Link href="/demo">
              <Button className="w-full">
                Go to Demo Mode
              </Button>
            </Link>
            
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;