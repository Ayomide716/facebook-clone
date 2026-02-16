import { User } from './types';

// Fallback user just in case specific UI components render before AuthContext resolves
// In a production app, you might handle this with a global loading spinner
export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random";

export const EMPTY_USER: User = {
  id: '',
  name: 'Guest',
  avatar: DEFAULT_AVATAR,
  email: '',
  friends: []
};