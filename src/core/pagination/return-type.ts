export interface ReturnModel<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}