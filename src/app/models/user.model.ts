export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

const roleCounts: Record<UserRole, number> = {
    Admin: 0,
    Editor: 0,
    Viewer: 0,
  };