'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function TeacherInfoView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Information</CardTitle>
        <CardDescription>
          Information about your teachers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Here you will find information about the teachers.</p>
      </CardContent>
    </Card>
  );
}
