export type TaskLogAction = 
  | 'created' 
  | 'updated' 
  | 'completed' 
  | 'uncompleted' 
  | 'deleted'
  | 'attachment_added'
  | 'attachment_removed'
  | 'location_updated';

export interface TaskLogEntry {
  id: string;
  taskId: number;
  taskTitle: string;
  action: TaskLogAction;
  timestamp: string;
  details?: string;
  previousValue?: any;
  newValue?: any;
}

export interface TaskLog {
  entries: TaskLogEntry[];
}
