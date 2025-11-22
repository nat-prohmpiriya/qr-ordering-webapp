import { Session } from 'next-auth';

/**
 * Check if user has owner role
 */
export function isOwner(session: Session | null): boolean {
  return session?.user?.role === 'owner';
}

/**
 * Check if user has staff role
 */
export function isStaff(session: Session | null): boolean {
  return session?.user?.role === 'staff';
}

/**
 * Check if user can access a specific branch
 * - Owner can access all branches
 * - Staff can only access their assigned branch
 */
export function canAccessBranch(
  session: Session | null,
  branchId: string
): boolean {
  if (!session) return false;

  // Owner can access all branches
  if (isOwner(session)) return true;

  // Staff can only access their assigned branch
  if (isStaff(session)) {
    return session.user.branchId === branchId;
  }

  return false;
}

/**
 * Check if user can manage menu items
 * Only owner can manage menu items
 */
export function canManageMenu(session: Session | null): boolean {
  return isOwner(session);
}

/**
 * Check if user can manage users
 * Only owner can manage users
 */
export function canManageUsers(session: Session | null): boolean {
  return isOwner(session);
}

/**
 * Check if user can manage branches
 * Only owner can manage branches
 */
export function canManageBranches(session: Session | null): boolean {
  return isOwner(session);
}

/**
 * Check if user can view reports
 * - Owner can view all reports
 * - Staff can only view reports for their branch
 */
export function canViewReports(session: Session | null): boolean {
  if (!session) return false;
  return isOwner(session) || isStaff(session);
}

/**
 * Check if user can manage orders
 * Both owner and staff can manage orders
 */
export function canManageOrders(session: Session | null): boolean {
  if (!session) return false;
  return isOwner(session) || isStaff(session);
}

/**
 * Get accessible branch IDs for user
 * - Owner: all branches
 * - Staff: only their assigned branch
 */
export function getAccessibleBranchIds(
  session: Session | null,
  allBranchIds?: string[]
): string[] | 'all' {
  if (!session) return [];

  // Owner can access all branches
  if (isOwner(session)) {
    return 'all';
  }

  // Staff can only access their assigned branch
  if (isStaff(session) && session.user.branchId) {
    return [session.user.branchId];
  }

  return [];
}

/**
 * Filter query by user's accessible branches
 * Used in database queries to limit results based on user role
 */
export function getBranchFilter(session: Session | null): object | null {
  if (!session) return null;

  // Owner can see all branches (no filter)
  if (isOwner(session)) {
    return {};
  }

  // Staff can only see their branch
  if (isStaff(session) && session.user.branchId) {
    return { branchId: session.user.branchId };
  }

  // No access
  return { branchId: null }; // This will match nothing
}

/**
 * Validate branch access and throw error if unauthorized
 */
export function requireBranchAccess(
  session: Session | null,
  branchId: string
): void {
  if (!canAccessBranch(session, branchId)) {
    throw new Error('Unauthorized: You do not have access to this branch');
  }
}

/**
 * Validate owner role and throw error if unauthorized
 */
export function requireOwner(session: Session | null): void {
  if (!isOwner(session)) {
    throw new Error('Unauthorized: Owner access required');
  }
}
