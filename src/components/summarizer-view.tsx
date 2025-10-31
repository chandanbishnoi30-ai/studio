'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { summarizeLearningMaterial } from '@/app/actions';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function SummarizerView() {
  const { toast } = useToast();
  const [material, setMaterial] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!material.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please paste some text, or a link to summarize.',
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const result = await summarizeLearningMaterial({ material });
      setSummary(result.summary);
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'The AI could not summarize the material. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Enter Material to Summarize</CardTitle>
          <CardDescription>
            Paste your learning material (text or a URL) below. The AI will provide a concise summary.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <Textarea
            placeholder="Paste your text or URL here..."
            className="flex-1 text-base"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleSummarize} disabled={isLoading} className="mt-4 w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-amber-400" />
            AI-Generated Summary
          </CardTitle>
          <CardDescription>Key concepts and main points from your material.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          {summary && !isLoading && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{summary}</p>
            </div>
          )}
          {!summary && !isLoading && (
            <div className="text-center text-muted-foreground py-16">
              <p>Your summary will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
