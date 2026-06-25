"use client";

import { useState } from "react";
import { updateCompetitionWinners } from "@/app/actions/ranking";
import { updateSystemSetting } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Trophy, Calendar, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompetitionWinnersForm({ 
  initialWinners, 
  schools,
  currentYear
}: { 
  initialWinners?: any[], 
  schools: any[],
  currentYear: string
}) {
  const router = useRouter();
  const [winners, setWinners] = useState(
    initialWinners?.length ? initialWinners : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingYear, setIsChangingYear] = useState(false);
  const [newYear, setNewYear] = useState(currentYear);
  const [isUpdatingYear, setIsUpdatingYear] = useState(false);

  const isCustomSchool = (val: string) => {
    if (!val) return false;
    if (val === "Others") return true;
    return !schools.some(s => s.name === val);
  };

  const addRow = () => {
    setWinners([...winners, { competitionName: "", champion: "", firstRunnerUp: "", secondRunnerUp: "" }]);
  };

  const removeRow = (index: number) => {
    setWinners(winners.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newWinners = [...winners];
    newWinners[index] = { ...newWinners[index], [field]: value };
    setWinners(newWinners);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Filter out completely empty rows
    const winnersToSave = winners.filter(w => w.competitionName.trim() !== "");
    
    const result = await updateCompetitionWinners(winnersToSave);
    if (result.success) {
      toast.success("Competition winners updated!");
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleYearSubmit = async () => {
    if (!newYear.trim()) return;
    setIsUpdatingYear(true);
    const result = await updateSystemSetting("WINNERS_YEAR", newYear);
    if (result.success) {
      toast.success(`Year updated to ${newYear}`);
      setIsChangingYear(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update year");
    }
    setIsUpdatingYear(false);
  };

  return (
    <Card className="w-full shadow-2xl shadow-blue-900/5 border-border/50 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
        <CardTitle className="text-lg font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Champions Registry ({currentYear})
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {isChangingYear ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 w-full sm:w-auto">
              <Input 
                value={newYear} 
                onChange={(e) => setNewYear(e.target.value)}
                className="flex-1 sm:w-24 h-9 rounded-xl font-bold"
                placeholder="Year"
                autoFocus
              />
              <Button size="sm" onClick={handleYearSubmit} disabled={isUpdatingYear} className="h-9 w-9 rounded-xl p-0 bg-green-600 hover:bg-green-700 shrink-0">
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setIsChangingYear(false); setNewYear(currentYear); }} className="h-9 w-9 rounded-xl p-0 shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsChangingYear(true)} className="flex-1 sm:flex-none items-center gap-2 rounded-xl font-bold border-accent/20 hover:bg-accent/5 hover:text-accent transition-all h-9">
              <Calendar className="w-4 h-4" /> <span className="text-[10px] sm:text-xs">Change Year</span>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={addRow} className="flex-1 sm:flex-none items-center gap-2 rounded-xl font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all h-9">
            <Plus className="w-4 h-4" /> <span className="text-[10px] sm:text-xs">Add Competition</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Header for Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 dark:bg-secondary/30 rounded-2xl border border-border/40">
              <div className="col-span-3 font-black text-muted-foreground uppercase text-[10px] tracking-widest">Competition</div>
              <div className="col-span-3 font-black text-muted-foreground uppercase text-[10px] tracking-widest">Champion</div>
              <div className="col-span-3 font-black text-muted-foreground uppercase text-[10px] tracking-widest">1st Runner Up</div>
              <div className="col-span-2 font-black text-muted-foreground uppercase text-[10px] tracking-widest">2nd Runner Up</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-3">
              {winners.map((winner, index) => (
                <div key={index} className="relative bg-white dark:bg-gray-900/50 p-4 md:p-2 md:px-6 rounded-[1.5rem] md:rounded-2xl border border-border/50 md:border-transparent md:hover:bg-muted/30 transition-all group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Mobile Label */}
                    <div className="md:hidden flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Entry #{index + 1}</span>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeRow(index)} 
                        className="text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="md:col-span-3">
                      <label className="md:hidden text-[9px] font-black uppercase text-gray-400 mb-1 block">Competition Name</label>
                      <Input 
                        placeholder="e.g., Programming" 
                        value={winner.competitionName}
                        onChange={(e) => handleChange(index, "competitionName", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 md:bg-transparent border-gray-100 dark:border-gray-700 md:border-transparent focus:border-primary/30 h-10 md:h-9 rounded-xl md:rounded-lg text-sm md:text-xs font-bold"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="md:hidden text-[9px] font-black uppercase text-gray-400 mb-1 block">Champion</label>
                      <Select value={isCustomSchool(winner.champion) ? "Others" : winner.champion} onValueChange={(v) => handleChange(index, "champion", v)}>
                        <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 md:bg-transparent border-gray-100 dark:border-gray-700 md:border-transparent focus:ring-0 h-10 md:h-9 rounded-xl md:rounded-lg text-xs font-bold overflow-hidden justify-between">
                          <SelectValue placeholder="Select Champion" className="truncate text-left flex-1 min-w-0 pr-2">
                            {isCustomSchool(winner.champion) ? (winner.champion === "Others" ? "Others" : winner.champion) : (winner.champion || "Select Champion")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {schools.map((school) => (
                            <SelectItem key={school.name} value={school.name} className="text-xs">
                              {school.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="Others" className="text-xs">
                            Others
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {isCustomSchool(winner.champion) && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                          <Input
                            placeholder="Type school name"
                            value={winner.champion === "Others" ? "" : winner.champion}
                            onChange={(e) => handleChange(index, "champion", e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 md:bg-transparent border-gray-150 dark:border-gray-700 md:border-transparent focus:border-primary/30 h-10 md:h-9 rounded-xl md:rounded-lg text-sm md:text-xs font-bold w-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <label className="md:hidden text-[9px] font-black uppercase text-gray-400 mb-1 block">1st Runner Up</label>
                      <Select value={isCustomSchool(winner.firstRunnerUp) ? "Others" : winner.firstRunnerUp} onValueChange={(v) => handleChange(index, "firstRunnerUp", v)}>
                        <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 md:bg-transparent border-gray-100 dark:border-gray-700 md:border-transparent focus:ring-0 h-10 md:h-9 rounded-xl md:rounded-lg text-xs font-bold overflow-hidden justify-between">
                          <SelectValue placeholder="Select 1st Runner Up" className="truncate text-left flex-1 min-w-0 pr-2">
                            {isCustomSchool(winner.firstRunnerUp) ? (winner.firstRunnerUp === "Others" ? "Others" : winner.firstRunnerUp) : (winner.firstRunnerUp || "Select 1st Runner Up")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {schools.map((school) => (
                            <SelectItem key={school.name} value={school.name} className="text-xs">
                              {school.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="Others" className="text-xs">
                            Others
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {isCustomSchool(winner.firstRunnerUp) && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                          <Input
                            placeholder="Type school name"
                            value={winner.firstRunnerUp === "Others" ? "" : winner.firstRunnerUp}
                            onChange={(e) => handleChange(index, "firstRunnerUp", e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 md:bg-transparent border-gray-150 dark:border-gray-700 md:border-transparent focus:border-primary/30 h-10 md:h-9 rounded-xl md:rounded-lg text-sm md:text-xs font-bold w-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="md:hidden text-[9px] font-black uppercase text-gray-400 mb-1 block">2nd Runner Up</label>
                      <Select value={isCustomSchool(winner.secondRunnerUp) ? "Others" : winner.secondRunnerUp} onValueChange={(v) => handleChange(index, "secondRunnerUp", v)}>
                        <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 md:bg-transparent border-gray-100 dark:border-gray-700 md:border-transparent focus:ring-0 h-10 md:h-9 rounded-xl md:rounded-lg text-xs font-bold overflow-hidden justify-between">
                          <SelectValue placeholder="Select 2nd Runner Up" className="truncate text-left flex-1 min-w-0 pr-2">
                            {isCustomSchool(winner.secondRunnerUp) ? (winner.secondRunnerUp === "Others" ? "Others" : winner.secondRunnerUp) : (winner.secondRunnerUp || "Select 2nd Runner Up")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {schools.map((school) => (
                            <SelectItem key={school.name} value={school.name} className="text-xs">
                              {school.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="Others" className="text-xs">
                            Others
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {isCustomSchool(winner.secondRunnerUp) && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                          <Input
                            placeholder="Type school name"
                            value={winner.secondRunnerUp === "Others" ? "" : winner.secondRunnerUp}
                            onChange={(e) => handleChange(index, "secondRunnerUp", e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 md:bg-transparent border-gray-150 dark:border-gray-700 md:border-transparent focus:border-primary/30 h-10 md:h-9 rounded-xl md:rounded-lg text-sm md:text-xs font-bold w-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="hidden md:flex md:col-span-1 justify-end">
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeRow(index)} 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {winners.length === 0 && (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border/50 rounded-[2rem] bg-muted/10">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p className="font-black uppercase tracking-widest text-sm mb-1">No data recorded</p>
              <p className="text-xs">Click "Add Competition" to start documenting the winners.</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            {winners.length > 0 && (
              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto px-12 rounded-2xl font-black uppercase tracking-widest h-14 shadow-lg shadow-primary/20">
                {isSubmitting ? "Saving Registry..." : "Confirm & Save Results"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
