import TeamForm from "@/components/registration/TeamForm";

export default function Step2Page() {
  return (
    <div className="space-y-6">
      <div className="mt-6">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Step 2: Team Information</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Tell us who is participating.</p>
      </div>
      
      <TeamForm />
    </div>
  );
}
