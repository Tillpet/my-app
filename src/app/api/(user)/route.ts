import { apiResponse } from "@/lib/api-response";
import logger from "@/lib/logger";

export async function GET() {
  try {
    logger.warn("user root route called, should use /api/user/profile");
    return apiResponse.notFound("Use /api/user/profile route");
  } catch (error) {
    logger.error({ err: error }, "user root route error");
    return apiResponse.error();
  }
}