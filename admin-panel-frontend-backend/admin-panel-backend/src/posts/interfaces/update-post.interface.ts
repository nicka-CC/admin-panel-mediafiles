export interface UpdatePostInterface {
  title?: string;
  announcement?: string;
  text?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH';
  visibility?: boolean;
  category_id?: number;
}
