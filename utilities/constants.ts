// Type for tree
export type DataNode = {
  id: number;
  name: string;
  description: string;
  children: DataNode[];
  tasks: any;
  available_tasks?: any;
  parent?: any;
  tags?: Array<any>;
}
  
export type TreeNode = {
  id: number;
  title: string;
  description: string;
  subtitle?: string;
  children?: TreeNode[];
  parent?: number;
  parentId?: number;
  tasks: any;
  available_tasks?: any;
  tags?: Array<any>;
}

export const apiDomain = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://open-united-backend.herokuapp.com";
export const RICHTEXT_EDITOR_WIDTH = 1000;
