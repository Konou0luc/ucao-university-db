import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./infrastructure/logger/logger";

app.listen(env.PORT, () => {
  logger.info(`University API running on http://localhost:${env.PORT}`);
  logger.info(`Swagger docs: http://localhost:${env.PORT}/api/docs`);
});
