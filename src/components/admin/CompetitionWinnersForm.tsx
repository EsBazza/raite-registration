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
    <Card className="w-full shadow-2xl shadow-blue-900/5 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Champions Registry ({currentYear})
        </CardTitle>
        <div className="flex items-center gap-2">
          {isChangingYear ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
              <Input 
                value={newYear} 
                onChange={(e) => setNewYear(e.target.value)}
                className="w-24 h-9 rounded-xl font-bold"
                placeholder="Year"
                autoFocus
              />
              <Button size="sm" onClick={handleYearSubmit} disabled={isUpdatingYear} className="h-9 w-9 rounded-xl p-0 bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setIsChangingYear(false); setNewYear(currentYear); }} className="h-9 w-9 rounded-xl p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsChangingYear(true)} className="flex items-center gap-2 rounded-xl font-bold border-accent/20 hover:bg-accent/5 hover:text-accent transition-all">
              <Calendar className="w-4 h-4" /> Change Year
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={addRow} className="flex items-center gap-2 rounded-xl font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
            <Plus className="w-4 h-4" /> Add Competition
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted/20 dark:bg-secondary/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 dark:bg-secondary/30">
                    <th className="py-3 px-2 font-black text-muted-foreground uppercase text-[9px] tracking-widest w-1/4">Competition</th>
                    <th className="py-3 px-2 font-black text-muted-foreground uppercase text-[9px] tracking-widest w-1/4">Champion</th>
                    <th className="py-3 px-2 font-black text-muted-foreground uppercase text-[9px] tracking-widest w-1/4">1st Runner Up</th>
                    <th className="py-3 px-2 font-black text-muted-foreground uppercase text-[9px] tracking-widest w-1/4">2nd Runner Up</th>
                    <th className="py-3 px-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((winner, index) => (
                    <tr key={index} className="border-t border-border/40 hover:bg-card/50 transition-colors">
                      <td className="py-2 px-2">
                        <Input 
                          placeholder="Comp. Name" 
                          value={winner.competitionName}
                          onChange={(e) => handleChange(index, "competitionName", e.target.value)}
                          className="bg-transparent border-transparent focus:border-primary/30 h-9 rounded-lg text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Select value={winner.champion} onValueChange={(v) => handleChange(index, "champion", v)}>
                          <SelectTrigger className="bg-transparent border-transparent focus:ring-0 h-9 rounded-lg text-[10px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {schools.map((school) => (
                              <SelectItem key={school.name} value={school.name} className="text-xs">
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-2">
                        <Select value={winner.firstRunnerUp} onValueChange={(v) => handleChange(index, "firstRunnerUp", v)}>
                          <SelectTrigger className="bg-transparent border-transparent focus:ring-0 h-9 rounded-lg text-[10px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {schools.map((school) => (
                              <SelectItem key={school.name} value={school.name} className="text-xs">
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-2">
                        <Select value={winner.secondRunnerUp} onValueChange={(v) => handleChange(index, "secondRunnerUp", v)}>
                          <SelectTrigger className="bg-transparent border-transparent focus:ring-0 h-9 rounded-lg text-[10px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {schools.map((school) => (
                              <SelectItem key={school.name} value={school.name} className="text-xs">
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-2">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeRow(index)} 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all h-8 w-8"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
