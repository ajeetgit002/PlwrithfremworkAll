/**
 * Application Routes Constants
 * Defines all standard URL paths used across the application.
 */
export const Routes = {
  AUTH: {
    LOGIN: '/web/index.php/auth/login',
  },
  DASHBOARD: {
    INDEX: '/web/index.php/dashboard/index',
  },
  PIM: {
    VIEW_EMPLOYEE_LIST: '/web/index.php/pim/viewEmployeeList',
    ADD_EMPLOYEE: '/web/index.php/pim/addEmployee',
  },
  ADMIN: {
    VIEW_SYSTEM_USERS: '/web/index.php/admin/viewSystemUsers',
  },
} as const;
