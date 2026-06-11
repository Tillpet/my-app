import { api } from "@/lib/fetchwrapper";
import { UserProfile } from "@/app/(home)/_types";
import logger from "@/lib/logger";

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const res = await api.get<UserProfile>("/api/user/profile");

  if (!res.success) {
    logger.error({ status: res.status, message: res.message }, "Failed to fetch user profile");
    return null;
  }

  return res.data;
}