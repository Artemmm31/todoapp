export interface Todo {
    id: number;
    title: string;
    description: string,
    dueDate: string,
    location: string,
    isCompleted: boolean;
    createdAt?: string;
}