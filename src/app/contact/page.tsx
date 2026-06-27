"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Send, ArrowLeft, Trophy, CreditCard, CalendarDays } from "lucide-react";
import Link from "next/link";
import DecorativeLayout from "@/components/layout/DecorativeLayout";
import { useState, useActionState, useEffect } from "react";
import { sendContactEmail, type ContactFormState } from "../actions/contact";
import { toast } from "sonner";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.932-1.956 1.887v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

type Contact = {
  name: string;
  role?: string;
  mobile?: string;
  email?: string;
  emailAlt?: string;
  facebook?: string;
};

type Section = {
  icon: React.ElementType;
  title: string;
  color: string;        // Tailwind border-l color
  iconColor: string;    // icon + label color
  contacts: Contact[];
};

const sections: Section[] = [
  {
    icon: Trophy,
    title: "Competition Related Concerns",
    color: "border-blue-500",
    iconColor: "text-blue-500",
    contacts: [
      { name: "Mr. Mark Anthony D. Madalipay", role: "Competition Chair, RAITE 2026", mobile: "09060664860", email: "markanthony.madalipay@ua.edu.ph" },
      { name: "Mr. Kenneth V. Bautista, MSCS", role: "Competition Co-Chair, RAITE 2026", mobile: "09951980360", email: "bautista.kenneth@gordoncollege.edu.ph" },
    ],
  },
  {
    icon: CreditCard,
    title: "Payment / Fees Related Concerns",
    color: "border-emerald-500",
    iconColor: "text-emerald-500",
    contacts: [
      { name: "Eugene S. Perez, MIT", mobile: "0991-351-5007", email: "eugene.perez@bulsu.edu.ph", facebook: "https://www.facebook.com/eugeneDnapster" },
    ],
  },
  {
    icon: CalendarDays,
    title: "RAITE Event Related Concerns",
    color: "border-violet-500",
    iconColor: "text-violet-500",
    contacts: [
      { name: "RAITE Secretariat", email: "psitecl.raite@gmail.com", emailAlt: "psiteregion3@gmail.com" },
      { name: "Jenice Anne Marie B. Visperas, MIT", role: "RAITE Chair", mobile: "09626607645", email: "visperas.jeniceannemarie@auf.edu.ph" },
      { name: "George M. Granados, MM, MIT", role: "RAITE Co-Chair", mobile: "09175481233", email: "gmgranados@spcf.edu.ph" },
    ],
  },
];

function ContactSection({ section, delay, layout = "narrow" }: { section: Section; delay: number; layout?: "narrow" | "wide" }) {
  const Icon = section.icon;

  const borderTopColorMap: Record<string, string> = {
    "border-blue-500": "border-t-blue-500 dark:border-t-blue-400",
    "border-emerald-500": "border-t-emerald-500 dark:border-t-emerald-400",
    "border-violet-500": "border-t-violet-500 dark:border-t-violet-400",
  };
  const topColorClass = borderTopColorMap[section.color] || "border-t-primary";

  const isWideGrid = layout === "wide" && section.contacts.length >= 2;
  const colsCount = section.contacts.length >= 3 ? "sm:grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl border border-gray-200/60 dark:border-gray-850/60 border-t-4 ${topColorClass} bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-6 md:p-8 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] flex flex-col h-full w-full max-w-full overflow-hidden`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-150 dark:border-gray-800/80">
        <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 ${section.iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold uppercase tracking-wider text-gray-900 dark:text-gray-100">
          {section.title}
        </h3>
      </div>

      {/* Contacts List */}
      <div className={`gap-5 flex-grow grid grid-cols-1 ${
        isWideGrid ? colsCount : "flex flex-col space-y-5"
      }`}>
        {section.contacts.map((c, i) => (
          <div 
            key={i} 
            className={`flex flex-col justify-start ${
              isWideGrid 
                ? "p-5 rounded-xl bg-gray-50/40 dark:bg-gray-800/10 border border-gray-100/50 dark:border-gray-800/30" 
                : (i > 0 ? "pt-5 border-t border-gray-100 dark:border-gray-800/60" : "")
            }`}
          >
            <div>
              <h4 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug">{c.name}</h4>
              {c.role && (
                <p className="text-xs font-semibold text-primary/80 dark:text-primary/70 mt-1">
                  {c.role}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-2.5 mt-4 max-w-full overflow-hidden">
              {c.mobile && (
                <a 
                  href={`tel:${c.mobile}`} 
                  className="flex items-center gap-3 text-sm font-bold text-gray-855 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 transition-colors group w-full min-w-0 max-w-full"
                >
                  <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span className="break-all tracking-tight min-w-0">{c.mobile}</span>
                </a>
              )}
              {c.email && (
                <a 
                  href={`mailto:${c.email}`} 
                  className="flex items-center gap-3 text-sm font-bold text-gray-855 dark:text-gray-200 hover:text-primary dark:hover:text-emerald-400 transition-colors group w-full min-w-0 max-w-full"
                >
                  <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-colors shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span className="tracking-tight break-all min-w-0">{c.email}</span>
                </a>
              )}
              {c.emailAlt && (
                <a 
                  href={`mailto:${c.emailAlt}`} 
                  className="flex items-center gap-3 text-sm font-bold text-gray-855 dark:text-gray-200 hover:text-primary dark:hover:text-emerald-400 transition-colors group w-full min-w-0 max-w-full"
                >
                  <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-colors shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span className="tracking-tight break-all min-w-0">{c.emailAlt}</span>
                </a>
              )}
              {c.facebook && (
                <a 
                  href={c.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-sm font-bold text-gray-855 dark:text-gray-200 hover:text-primary dark:hover:text-red-400 transition-colors group w-full min-w-0 max-w-full"
                >
                  <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white dark:group-hover:bg-red-500 transition-colors shrink-0">
                    <FacebookIcon className="w-4 h-4" />
                  </span>
                  <span className="tracking-tight min-w-0">Facebook Profile</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const MESSAGE_LIMIT = 500;
  const initialState: ContactFormState = { success: false, message: "" };
  const [state, action, isPending] = useActionState(sendContactEmail, initialState);

  useEffect(() => {
    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
      if (state.success) setMessage("");
    }
  }, [state]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      <DecorativeLayout className="pt-24 pb-12 z-50 relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-50">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-2 border border-border"
              >
                Get in Touch
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none"
              >
                Let&apos;s build the{" "}
                <span className="text-primary underline decoration-accent decoration-4 underline-offset-4">Future together.</span>
              </motion.h1>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <Link href="/" className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-primary transition-colors whitespace-nowrap">
                <ArrowLeft className="mr-1.5 w-3.5 h-3.5" /> Back to Homepage
              </Link>
            </motion.div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch w-full max-w-full overflow-hidden">

            {/* LEFT: Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 flex flex-col h-full relative z-50 w-full max-w-full overflow-hidden"
            >
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Send us a Message</p>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Fill out the form below and our team will get back to you shortly.</p>
              </div>

              <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-6 md:p-8 shadow-sm flex flex-col flex-grow w-full max-w-full overflow-hidden">
                <form action={action} className="space-y-5 flex flex-col flex-grow justify-between">
                  <div className="space-y-5 flex-grow flex flex-col">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">First Name</Label>
                        <Input name="firstName" id="firstName" placeholder="Juan" className="h-12 rounded-xl text-sm border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-950/20 focus-visible:ring-2 focus-visible:ring-primary" required />
                        {state.errors?.firstName && <p className="text-destructive text-[10px]">{state.errors.firstName[0]}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Name</Label>
                        <Input name="lastName" id="lastName" placeholder="Dela Cruz" className="h-12 rounded-xl text-sm border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-950/20 focus-visible:ring-2 focus-visible:ring-primary" required />
                        {state.errors?.lastName && <p className="text-destructive text-[10px]">{state.errors.lastName[0]}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address</Label>
                      <Input name="email" id="email" type="email" placeholder="juan@university.edu.ph" className="h-12 rounded-xl text-sm border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-950/20 focus-visible:ring-2 focus-visible:ring-primary" required />
                      {state.errors?.email && <p className="text-destructive text-[10px]">{state.errors.email[0]}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</Label>
                      <Input name="subject" id="subject" placeholder="Membership Inquiry" className="h-12 rounded-xl text-sm border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-950/20 focus-visible:ring-2 focus-visible:ring-primary" required />
                      {state.errors?.subject && <p className="text-destructive text-[10px]">{state.errors.subject[0]}</p>}
                    </div>

                    <div className="space-y-2 flex-grow flex flex-col">
                      <div className="flex justify-between">
                        <Label htmlFor="message" className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Message</Label>
                        <span className={`text-[10px] font-bold ${message.length >= MESSAGE_LIMIT ? "text-destructive" : "text-gray-400"}`}>
                          {message.length}/{MESSAGE_LIMIT}
                        </span>
                      </div>
                      <Textarea
                        name="message" id="message"
                        placeholder="Tell us how we can help you..."
                        className="rounded-xl text-sm py-3 px-4 border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-950/20 focus-visible:ring-2 focus-visible:ring-primary resize-none flex-grow min-h-[140px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={MESSAGE_LIMIT}
                        required
                      />
                      {state.errors?.message && <p className="text-destructive text-[10px]">{state.errors.message[0]}</p>}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-[#002673] text-white rounded-xl text-sm font-black transition-all shadow-md shadow-primary/10 hover:shadow-lg active:scale-[0.98]" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Message"} <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </div>

              {/* Response Time Notice Card */}
              <div className="mt-6 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/30 dark:bg-gray-900/10 p-6 shadow-sm space-y-2 w-full max-w-full overflow-hidden">
                <p className="text-xs font-black uppercase tracking-wider text-primary">Response Time Notice</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                  We typically respond to inquiries within 24 to 48 business hours. For urgent concerns, please reach out to the respective committee members via mobile phone.
                </p>
              </div>
            </motion.div>

            {/* RIGHT: Contact Directory */}
            <div className="lg:col-span-8 space-y-6 relative z-50 w-full max-w-full overflow-hidden">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Direct Contacts</p>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Reach out directly to the committee members for immediate assistance.</p>
              </div>

              {/* Competition Related Concerns */}
              <div className="w-full">
                <ContactSection section={sections[0]} delay={0.3} layout="wide" />
              </div>

              {/* Event Related Concerns */}
              <div className="w-full">
                <ContactSection section={sections[2]} delay={0.4} layout="wide" />
              </div>

              {/* Payment Concerns */}
              <div className="w-full">
                <ContactSection section={sections[1]} delay={0.5} layout="wide" />
              </div>
            </div>

          </div>
        </div>
      </DecorativeLayout>

      <footer className="relative z-50 py-6 border-t border-gray-150 dark:border-gray-850">
        <div className="container mx-auto px-4 text-center" />
      </footer>
    </div>
  );
}
