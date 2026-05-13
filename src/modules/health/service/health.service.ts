import { HealthRepository } from "../repository/health.repository";
export class HealthService { constructor(private readonly repo: HealthRepository) {} getStatus(){ return { status: "ok" as const, timestamp: new Date().toISOString(), uptime: this.repo.getUptime() }; } }
