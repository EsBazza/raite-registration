import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/lib/data/users";
import { Trophy } from "lucide-react";
import { Suspense } from "react";
import { Role } from "@prisma/client";
import { SubAdminSidebar } from "@/components/sub-admin/SubAdminSidebar";

async function SubAdminNavContainer() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);

  if (!user || user.role !== Role.SUB_ADMIN) {
    redirect("/");
  }

  const navLinks = [
    { href: "/sub-admin/competitions", label: "My Competitions", icon: Trophy },
  ];

  const userData = {
    name: user.name,
    role: user.role,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 border-r dark:border-gray-800 bg-white dark:bg-gray-900 flex-col h-full shadow-2xl shadow-blue-600/5 overflow-hidden z-40 sticky top-0">
        <SubAdminSidebar user={userData} />
      </aside>
    </>
  );
}

export default function SubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-64px)] bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      <Suspense fallback={<div className="hidden lg:flex w-80 bg-muted animate-pulse" />}>
        <SubAdminNavContainer />
      </Suspense>

      <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 scroll-smooth">
        <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
