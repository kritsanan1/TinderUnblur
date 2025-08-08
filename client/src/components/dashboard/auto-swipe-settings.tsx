import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { UserPreferences } from "../../../../shared/schema";
import { Bot } from "lucide-react";

interface AutoSwipeSettingsProps {
  userId: string;
}

export function AutoSwipeSettings({ userId }: AutoSwipeSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences", userId],
  });

  const updatePreferences = useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      const response = await apiRequest("PATCH", `/api/preferences/${userId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences", userId] });
      toast({
        title: "Settings Updated",
        description: "Your auto-swipe preferences have been saved",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) return null;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Auto-Swipe</h2>
          <Switch
            checked={preferences.autoSwipeEnabled || false}
            onCheckedChange={(checked) => 
              updatePreferences.mutate({ autoSwipeEnabled: checked })
            }
          />
        </div>
        
        <div className="space-y-6">
          {/* Daily swipe limit */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              Daily swipe limit: {preferences.dailyLimit}
            </Label>
            <Slider
              value={[preferences.dailyLimit || 50]}
              onValueChange={([value]) => 
                updatePreferences.mutate({ dailyLimit: value })
              }
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
          
          {/* Swipe interval */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              Swipe interval: {preferences.swipeInterval}s
            </Label>
            <Slider
              value={[preferences.swipeInterval || 3]}
              onValueChange={([value]) => 
                updatePreferences.mutate({ swipeInterval: value })
              }
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          {/* Age range */}
          <div>
            <Label className="block text-sm font-medium mb-3">Age preferences</Label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                min={18}
                max={50}
                value={preferences.ageMin || 22}
                onChange={(e) => 
                  updatePreferences.mutate({ ageMin: parseInt(e.target.value) })
                }
                className="w-16"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="number"
                min={18}
                max={50}
                value={preferences.ageMax || 35}
                onChange={(e) => 
                  updatePreferences.mutate({ ageMax: parseInt(e.target.value) })
                }
                className="w-16"
              />
            </div>
          </div>
          
          {/* Smart filters */}
          <div>
            <Label className="block text-sm font-medium mb-3">Smart filters</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="verified"
                  checked={preferences.verifiedOnly || false}
                  onCheckedChange={(checked) => 
                    updatePreferences.mutate({ verifiedOnly: !!checked })
                  }
                />
                <Label htmlFor="verified" className="text-sm">Verified profiles only</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="quality"
                  checked={preferences.photoQuality || false}
                  onCheckedChange={(checked) => 
                    updatePreferences.mutate({ photoQuality: !!checked })
                  }
                />
                <Label htmlFor="quality" className="text-sm">High photo quality</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="bio"
                  checked={preferences.bioRequired || false}
                  onCheckedChange={(checked) => 
                    updatePreferences.mutate({ bioRequired: !!checked })
                  }
                />
                <Label htmlFor="bio" className="text-sm">Bio required</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-tinder-primary/10 to-tinder-secondary/10 rounded-xl border border-tinder-primary/20">
          <div className="flex items-center space-x-3">
            <Bot className="text-tinder-primary" />
            <div>
              <h4 className="text-sm font-medium text-tinder-primary">Auto-swipe Status</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {preferences.autoSwipeEnabled ? "Active - Next session: Tomorrow at 8:00 PM" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
