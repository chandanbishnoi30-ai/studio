'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotesView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you can take and manage your notes.</p>
      </CardContent>
    </Card>
  );
}
