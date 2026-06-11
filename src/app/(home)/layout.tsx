import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { fetchUserProfile } from "./_fetch";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchUserProfile();

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
