import { Navbar } from "./_components/navbar";
import { homeContent } from "./_content";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar
        logo={homeContent.nav.logo}
        links={homeContent.nav.links}
        cta={homeContent.nav.cta}
      />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
