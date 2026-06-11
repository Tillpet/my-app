import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/api-response";
import logger from "@/lib/logger";

export async function GET() {
  logger.info("api(/user/profile/route) start");
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      logger.warn("profile request without auth");
      return apiResponse.unauthorized();
    }

    logger.info({ userId: session.user.id }, "profile request");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      logger.warn({ userId: session.user.id }, "profile not found");
      return apiResponse.notFound("用户不存在");
    }

    return apiResponse.success(user);
  } catch (error) {
    logger.error({ err: error }, "profile error");
    return apiResponse.error();
  }
}