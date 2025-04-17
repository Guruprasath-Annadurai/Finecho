import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

const Profile = () => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    
    try {
      // In a real app, you would update the user profile in Firebase here
      // For now we'll just show a success toast
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/login");
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully."
      });
    } catch (error) {
      console.error("Logout error:", error);
      
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Profile Avatar */}
                <div className="flex flex-col items-center space-y-2 mb-4">
                  <Avatar className="w-24 h-24">
                    {user?.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                    ) : null}
                    <AvatarFallback className="text-xl">
                      {getInitials(user?.displayName || user?.email?.split('@')[0] || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-500">
                    {user?.email}
                  </span>
                </div>
                
                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Notification Settings would go here */}
              <div className="text-sm text-gray-500">
                <p>Account created: {user?.metadata?.creationTime || "Unknown"}</p>
                <p>Last sign in: {user?.metadata?.lastSignInTime || "Unknown"}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/dashboard")}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;