export interface TodoAttachment {
    id: string;
    name: string;
    uri: string;
    type: 'image' | 'pdf' | 'document' | 'other';
    size?: number;
}

export interface TodoLocation {
    address: string;
    latitude?: number;
    longitude?: number;
    isFromGeolocation?: boolean;
}

export interface Todo {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    location: TodoLocation;
    attachments: TodoAttachment[];
    isCompleted: boolean;
    createdAt?: string;
    notificationId?: string;
}