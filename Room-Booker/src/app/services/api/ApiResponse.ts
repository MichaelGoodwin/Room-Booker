export class ApiResponse {
  success: boolean;
  message: string;
  errors: Array<string>;
  redirectTo: string;
  data: any; // Any data the API returns is attached here
}
