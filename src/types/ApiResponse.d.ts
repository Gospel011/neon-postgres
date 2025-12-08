interface ApiResponse<T = undefined> {
  status: "success" | "failed";
  message?: string;
  data?: T;
}
