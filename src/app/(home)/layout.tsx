import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchUserProfile } from "./_fetch";
import { UserProfile } from "./_types";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  let userData: UserProfile | null = null;
  console.log("session2:", session);
  if (session?.user?.id) {
    userData = await fetchUserProfile();
  }

  const user = userData || null;

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
