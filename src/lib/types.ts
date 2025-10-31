export type Assignment = {
  id: string;
  name: string;
  dueDate: string; // ISO string
  isCompleted: boolean;
};

export type Course = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  assignments: Assignment[];
};
