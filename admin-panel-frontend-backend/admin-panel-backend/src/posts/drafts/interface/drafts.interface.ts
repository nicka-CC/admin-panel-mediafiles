import { User } from 'src/users/user.model';
import { PostsCategory } from 'src/posts/categories/category.model';

export interface ProcessData {
  user: User;
  category: PostsCategory | undefined;
}
