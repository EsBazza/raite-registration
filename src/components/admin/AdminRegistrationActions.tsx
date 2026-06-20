"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateRegistrationStatus } from "@/app/actions/registrations";
import { RegistrationStatus } from "@prisma/client";
import { toast } from "sonner";

interface AdminRegistrationActionsProps {
  registrationId: string;
  currentStatus: RegistrationStatus;
}

export default function AdminRegistrationActions({
  registrationId,
  currentStatus
}: AdminRegistrationActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");

  const handleStatusUpdate = async (status: RegistrationStatus, reviewComment?: string) => {
    setIsUpdating(true);
    const toastId = toast.loading(`Updating registration status...`);
    try {
      const result = await updateRegistrationStatus({ 
        id: registrationId, 
        status, 
        comment: reviewComment 
      });
      if (result.success) {
        toast.success(`Registration status updated successfully`, { id: toastId });
        setIsReviewOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:self-center self-start shrink-0 w-full sm:w-auto">
      {currentStatus !== "APPROVED" && (
        <Button
          onClick={() => handleStatusUpdate("APPROVED")}
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold gap-2 px-5 h-11 shadow-lg shadow-green-600/10"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          Approve Registration
        </Button>
      )}

      {currentStatus !== "REJECTED" && (
        <Button
          onClick={() => {
            setComment("");
            setIsReviewOpen(true);
          }}
          disabled={isUpdating}
          variant="outline"
          className="border-yellow-250 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-750 dark:border-yellow-800 dark:text-yellow-450 dark:hover:bg-yellow-950/20 rounded-xl font-bold gap-2 px-5 h-11"
        >
          <AlertCircle className="h-4 w-4" />
          Flag for Review
        </Button>
      )}

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="rounded-3xl border-gray-100 dark:border-gray-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Flag for Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50 flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
              <p className="text-sm text-yellow-750 dark:text-yellow-300 font-medium">
                Please specify what needs to be reviewed or corrected in this registration. This comment will be visible to the participant.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500">Review Comments</label>
              <Textarea 
                placeholder="e.g., Missing valid ID, Incorrect documentation, please re-upload..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="rounded-xl border-gray-200 min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsReviewOpen(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={() => {
                  if (!comment.trim()) {
                    toast.error("Please provide a reason for review request");
                    return;
                  }
                  handleStatusUpdate("REJECTED", comment);
                }}
                disabled={isUpdating}
                className="rounded-xl font-bold gap-2 bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/10"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Send for Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
