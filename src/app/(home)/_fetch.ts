import { api } from "@/lib/fetchwrapper";
import { UserProfile } from "@/app/(home)/_types";
import logger from "@/lib/logger";


export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await api.get<UserProfile>(`/api/user/profile`);
    return response;
  } catch (error) {
    logger.error({ err: error }, "Failed to fetch user profile");
    return null;
  }
}