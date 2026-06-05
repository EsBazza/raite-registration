import ReviewStep from "@/components/registration/ReviewStep";

export default function Step3Page() {
  return (
    <div className="space-y-6">
      <div className="mt-6">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Step 3: Final Review</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Please double-check all information before submitting.</p>
      </div>
      
      <ReviewStep />
    </div>
  );
}
