"use client";

import { useEffect, useState, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isProfileComplete } from "@/app/actions/user";
import { UserCircle, ArrowRight } from "lucide-react";

function ProfileCheckContent() {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkProfile() {
      if (isLoaded && user && pathname !== "/profile/complete") {
        const complete = await isProfileComplete();
        if (!complete) {
          setIsOpen(true);
        }
      }
    }
    checkProfile();
  }, [isLoaded, user, pathname]);

  const handleCompleteProfile = () => {
    setIsOpen(false);
    router.push("/profile/complete");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-2 border-blue-50 dark:border-gray-800">
        <DialogHeader className="flex flex-col items-center gap-4 pt-4">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <UserCircle className="w-12 h-12" />
          </div>
          <DialogTitle className="text-2xl font-black text-center text-gray-900 dark:text-white uppercase tracking-tight">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription className="text-center text-base font-medium text-gray-500 dark:text-gray-400 px-4">
            Welcome to RAITE! To start registering for competitions, you need to provide your school and classification first.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center pt-6 pb-4">
          <Button
            onClick={handleCompleteProfile}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            Complete Profile Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfileCheckModal() {
  return (
    <Suspense fallback={null}>
      <ProfileCheckContent />
    </Suspense>
  );
}
