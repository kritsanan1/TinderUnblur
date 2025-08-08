import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { Wand2, User, Eye, Heart } from "lucide-react";
import { Teaser } from "../../../../shared/schema";

interface TeaserUnblurProps {
  userId: string;
}

export function TeaserUnblur({ userId }: TeaserUnblurProps) {
  const [tinderToken, setTinderToken] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teasers = [], isLoading } = useQuery<Teaser[]>({
    queryKey: ["/api/teasers", userId],
  });

  const unblurMutation = useMutation({
    mutationFn: async () => {
      if (!tinderToken.trim()) {
        throw new Error("Please enter your Tinder token");
      }
      
      const response = await apiRequest("POST", "/api/teasers/unblur", {
        userId,
        tinderToken: tinderToken.trim(),
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/teasers", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities", userId] });
      toast({
        title: "Success!",
        description: `${data.count} teasers unblurred successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unblur teasers",
        variant: "destructive",
      });
    },
  });

  const unblurredCount = teasers.filter(t => t.isUnblurred).length;
  const totalCount = teasers.length;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-tinder-primary to-tinder-secondary p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Teaser Unblur</h2>
            <p className="text-pink-100">Reveal who liked your profile before matching</p>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter Tinder Token"
                value={tinderToken}
                onChange={(e) => setTinderToken(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-pink-100"
              />
            </div>
            <Button
              onClick={() => unblurMutation.mutate()}
              disabled={unblurMutation.isPending || !tinderToken.trim()}
              className="bg-white/20 hover:bg-white/30 text-white border-0 transition-all duration-300 backdrop-blur-sm w-full md:w-auto"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {unblurMutation.isPending ? "Unblurring..." : "Unblur All"}
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : teasers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Teasers Available</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your Tinder token to fetch and unblur teasers</p>
            <div className="max-w-md mx-auto space-y-3">
              <Label htmlFor="token-input" className="text-left block">Tinder API Token</Label>
              <Input
                id="token-input"
                type="password"
                placeholder="Enter your Tinder token"
                value={tinderToken}
                onChange={(e) => setTinderToken(e.target.value)}
              />
              <Button
                onClick={() => unblurMutation.mutate()}
                disabled={unblurMutation.isPending || !tinderToken.trim()}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {unblurMutation.isPending ? "Fetching..." : "Fetch Teasers"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {teasers.map((teaser) => (
                <TeaserCard key={teaser.id} teaser={teaser} />
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span>{unblurredCount}</span> of <span>{totalCount}</span> teasers unblurred
              </div>
              <div className="text-sm text-tinder-primary font-medium">
                Last updated: {teasers[0]?.createdAt ? new Date(teasers[0].createdAt).toLocaleString() : "Never"}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TeaserCard({ teaser }: { teaser: Teaser }) {
  const teaserData = teaser.teaserData as any;
  const user = teaserData?.user;
  const photo = user?.photos?.[0];

  return (
    <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer hover:scale-105 transition-all duration-300">
      {teaser.isUnblurred && photo ? (
        <img 
          src={photo.url} 
          alt={user.name || "Profile"} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
          <User className="text-4xl text-gray-500 dark:text-gray-400" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-white text-center">
          {teaser.isUnblurred ? (
            <>
              <Heart className="text-2xl mb-2 mx-auto" />
              <p className="text-sm font-medium">View Profile</p>
            </>
          ) : (
            <>
              <Eye className="text-2xl mb-2 mx-auto" />
              <p className="text-sm font-medium">Click to Unblur</p>
            </>
          )}
        </div>
      </div>
      
      <div className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-lg font-medium ${
        teaser.isUnblurred ? "bg-green-500" : "bg-tinder-primary"
      }`}>
        {teaser.isUnblurred ? "Unblurred" : "Blurred"}
      </div>
    </div>
  );
}
