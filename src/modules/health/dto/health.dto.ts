export interface HealthResponseDto {
  success: true;
  message: string;
  data: {
    status: "ok";
    timestamp: string;
    uptime: number;
  };
}
