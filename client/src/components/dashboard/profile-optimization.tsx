import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { 
  Camera, 
  FileText, 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  User,
  MapPin,
  Clock,
  Target
} from "lucide-react";

interface ProfileOptimizationProps {
  userId: string;
}

interface OptimizationTip {
  category: 'photos' | 'bio' | 'timing' | 'behavior';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  implemented: boolean;
  action: string;
}

export function ProfileOptimization({ userId }: ProfileOptimizationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const optimizationTips: OptimizationTip[] = [
    {
      category: 'photos',
      priority: 'high',
      title: 'Add variety to photo angles',
      description: 'Photos from different angles increase matches by 34%',
      impact: '+34% matches',
      implemented: false,
      action: 'Upload photos showing face, full body, and activity shots'
    },
    {
      category: 'photos',
      priority: 'high', 
      title: 'Use photos with pets or activities',
      description: 'Action and pet photos boost engagement significantly',
      impact: '+27% likes',
      implemented: false,
      action: 'Add photos showing hobbies, pets, or group activities'
    },
    {
      category: 'bio',
      priority: 'medium',
      title: 'Include conversation starters',
      description: 'Bios with questions or interests get more messages',
      impact: '+19% messages',
      implemented: false,
      action: 'Add a question or mention specific interests'
    },
    {
      category: 'timing',
      priority: 'high',
      title: 'Be active during peak hours',
      description: 'Activity between 8-10 PM increases visibility',
      impact: '+42% views',
      implemented: true,
      action: 'Use the app during 8-10 PM on weekdays'
    },
    {
      category: 'behavior',
      priority: 'medium',
      title: 'Optimize swipe selectivity',
      description: 'Right-swiping 30-40% maintains good ELO score',
      impact: '+15% quality',
      implemented: true,
      action: 'Be selective with likes to maintain algorithm ranking'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tips', icon: Target, count: optimizationTips.length },
    { id: 'photos', name: 'Photos', icon: Camera, count: optimizationTips.filter(t => t.category === 'photos').length },
    { id: 'bio', name: 'Bio', icon: FileText, count: optimizationTips.filter(t => t.category === 'bio').length },
    { id: 'timing', name: 'Timing', icon: Clock, count: optimizationTips.filter(t => t.category === 'timing').length },
    { id: 'behavior', name: 'Behavior', icon: User, count: optimizationTips.filter(t => t.category === 'behavior').length }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Star;
      case 'low': return CheckCircle;
      default: return Star;
    }
  };

  const filteredTips = selectedCategory === 'all' 
    ? optimizationTips 
    : optimizationTips.filter(tip => tip.category === selectedCategory);

  const implementedCount = optimizationTips.filter(tip => tip.implemented).length;
  const completionRate = Math.round((implementedCount / optimizationTips.length) * 100);

  const markAsImplemented = useMutation({
    mutationFn: async (tipTitle: string) => {
      // In a real app, this would update the backend
      return Promise.resolve();
    },
    onSuccess: () => {
      toast({
        title: "Progress Saved",
        description: "Your optimization progress has been updated",
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Profile Score Overview */}
      <Card className="bg-gradient-to-br from-tinder-primary/10 to-tinder-secondary/10 border border-tinder-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tinder-primary" />
              Profile Optimization Score
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-tinder-primary">{completionRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completionRate} className="h-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold">{implementedCount}/{optimizationTips.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tips Implemented</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-green-600">+47%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Expected Match Increase</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Profile Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Tips */}
      <div className="space-y-4">
        {filteredTips.map((tip, index) => {
          const PriorityIcon = getPriorityIcon(tip.priority);
          
          return (
            <Card 
              key={index} 
              className={`transition-all duration-300 hover:shadow-lg ${
                tip.implemented 
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      tip.category === 'photos' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      tip.category === 'bio' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      tip.category === 'timing' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {tip.category === 'photos' && <Camera className="h-5 w-5 text-blue-600" />}
                      {tip.category === 'bio' && <FileText className="h-5 w-5 text-purple-600" />}
                      {tip.category === 'timing' && <Clock className="h-5 w-5 text-orange-600" />}
                      {tip.category === 'behavior' && <User className="h-5 w-5 text-gray-600" />}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
                        <Badge className={getPriorityColor(tip.priority)}>
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {tip.priority.toUpperCase()}
                        </Badge>
                        {tip.implemented && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            IMPLEMENTED
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tip.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-tinder-primary">{tip.impact}</div>
                    <div className="text-xs text-gray-500">Expected Impact</div>
                  </div>
                </div>
                
                {!tip.implemented && (
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      onClick={() => markAsImplemented.mutate(tip.title)}
                      className="bg-gradient-to-r from-tinder-primary to-tinder-secondary text-white hover:scale-105 transition-transform"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Done
                    </Button>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Enhancement */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Zap className="h-5 w-5" />
            AI Profile Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Our AI analyzes thousands of successful Tinder profiles to provide personalized recommendations.
            Upload your current photos for advanced analysis and optimization suggestions.
          </p>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform">
              <Camera className="mr-2 h-4 w-4" />
              Analyze My Photos
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Optimize Bio Text
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}