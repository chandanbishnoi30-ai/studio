'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function NotesView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
        <CardDescription>A place to jot down your thoughts and ideas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4 bg-secondary/50">
          <p>welcome my name is chandan bishnoi</p>
        </div>
      </CardContent>
    </Card>
  );
}
