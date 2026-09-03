/**
 * Sidebar Navigation Menu Constants
 * Strongly-typed names for all side navigation items in OrangeHRM.
 */
export const SidebarMenu = {
  ADMIN: 'Admin',
  PIM: 'PIM',
  LEAVE: 'Leave',
  TIME: 'Time',
  RECRUITMENT: 'Recruitment',
  MY_INFO: 'My Info',
  PERFORMANCE: 'Performance',
  DASHBOARD: 'Dashboard',
  DIRECTORY: 'Directory',
  MAINTENANCE: 'Maintenance',
  CLAIM: 'Claim',
  BUZZ: 'Buzz',
} as const;

export type SidebarMenuType = (typeof SidebarMenu)[keyof typeof SidebarMenu];
