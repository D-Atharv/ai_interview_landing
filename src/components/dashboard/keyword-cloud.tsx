'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KeywordCloudProps {
  title: string;
  keywords: string[];
  variant: 'positive' | 'negative';
}

export function KeywordCloud({ title, keywords, variant }: KeywordCloudProps) {
  const badgeVariant = variant === 'positive' ? 'default' : 'destructive';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <Badge key={index} variant={badgeVariant} className="text-sm">
                {keyword}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No common keywords identified.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
