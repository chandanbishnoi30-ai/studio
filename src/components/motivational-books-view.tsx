'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function MotivationalBooksView() {
  const books = [
    { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey" },
    { title: "How to Win Friends and Influence People", author: "Dale Carnegie" },
    { title: "Think and Grow Rich", author: "Napoleon Hill" },
    { title: "The Power of Positive Thinking", author: "Norman Vincent Peale" },
    { title: "Man's Search for Meaning", author: "Viktor E. Frankl" },
    { title: "The Alchemist", author: "Paulo Coelho" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motivational Books</CardTitle>
        <CardDescription>
          A curated list of books to inspire and motivate you.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A highly recommended book for personal growth and motivation.
              </p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
