"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "./WizardProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RequirementsForm() {
  const { data, isReady, updateData } = useWizard();
  const router = useRouter();
  // Migration: If data.requirements is an object, extract studentId. If string, use as is.
  const initialLink = typeof data.requirements === 'string' 
    ? data.requirements 
    : (data.requirements?.studentId || "");
    
  const [studentIdLink, setStudentIdLink] = useState<string>(initialLink);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isReady && !data.eventId) {
      router.push("/register/step-1");
    } else if (isReady && (!data.members || data.members.length === 0)) {
      router.push("/register/step-2");
    }
  }, [isReady, data.eventId, data.members, router]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-bold">Loading your registration...</p>
      </div>
    );
  }

  const handleNext = () => {
    if (!studentIdLink) {
      setShowError(true);
      return;
    }
    router.push("/register/step-4");
  };

  const isFormValid = !!studentIdLink;

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className={cn(
          "p-6 border-2 rounded-[2rem] space-y-4 transition-all duration-300",
          showError ? "border-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40"
        )}>
          <div className="flex items-center justify-between">
            <Label className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
              Student ID / Proof of Enrollment (Google Drive Link)
            </Label>
            <Badge variant="outline" className="rounded-full px-3 py-1 border-blue-200 text-blue-600 bg-blue-50 font-bold uppercase text-[10px] tracking-widest">
              Required
            </Badge>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Please provide a Google Drive link to your Student ID or Proof of Enrollment. Ensure the file permissions are set to &quot;Anyone with the link can view&quot;.</p>
          
          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="https://drive.google.com/file/d/..."
                value={studentIdLink}
                onChange={(e) => {
                const val = e.target.value;
                setStudentIdLink(val);
                updateData({ requirements: { link: val } }); // Save as object
                }}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all font-medium"
              />
            </div>
            {studentIdLink && (
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>
          
          {showError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 text-sm font-bold pt-2"
            >
              <AlertCircle className="w-4 h-4" />
              This link is required to proceed
            </motion.div>
          )}
          
          {studentIdLink && (
            <p className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full inline-block">
              ✓ Link saved and ready
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t dark:border-gray-800">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/register/step-2")}
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full px-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Info
        </Button>
        <Button 
          onClick={handleNext} 
          className={cn(
            "rounded-full px-8 h-12 font-bold transition-all shadow-xl",
            isFormValid 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" 
              : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
          )}
        >
          Review Registration
        </Button>
      </div>
    </div>
  );
}
