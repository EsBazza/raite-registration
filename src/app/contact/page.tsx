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

function ContactSection({ section, delay }: { section: Section; delay: number }) {
  const Icon = section.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`border-l-2 pl-4 ${section.color}`}
    >
      {/* Section label */}
      <div className={`flex items-center gap-1.5 mb-3 ${section.iconColor}`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-black uppercase tracking-widest">{section.title}</span>
      </div>

      {/* Contacts */}
      <div className="space-y-3">
        {section.contacts.map((c, i) => (
          <div key={i} className={i > 0 ? "pt-3 border-t border-gray-100 dark:border-gray-800" : ""}>
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">{c.name}</p>
            {c.role && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 mb-1">{c.role}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
              {c.mobile && (
                <a href={`tel:${c.mobile}`} className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  <Phone className="w-2.5 h-2.5 shrink-0" />{c.mobile}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 hover:text-primary transition-colors break-all">
                  <Mail className="w-2.5 h-2.5 shrink-0" />{c.email}
                </a>
              )}
              {c.emailAlt && (
                <a href={`mailto:${c.emailAlt}`} className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 hover:text-primary transition-colors break-all">
                  <Mail className="w-2.5 h-2.5 shrink-0" />{c.emailAlt}
                </a>
              )}
              {c.facebook && (
                <a href={c.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                  <FacebookIcon className="w-2.5 h-2.5 shrink-0" />Facebook
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
      <DecorativeLayout className="pt-24 pb-12 z-10">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
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
                className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT: Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Send us a Message</p>
              <form action={action} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-[9px] font-black uppercase tracking-widest text-gray-400">First Name</Label>
                    <Input name="firstName" id="firstName" placeholder="Juan" className="h-9 rounded-lg text-sm" required />
                    {state.errors?.firstName && <p className="text-destructive text-[10px]">{state.errors.firstName[0]}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-[9px] font-black uppercase tracking-widest text-gray-400">Last Name</Label>
                    <Input name="lastName" id="lastName" placeholder="Dela Cruz" className="h-9 rounded-lg text-sm" required />
                    {state.errors?.lastName && <p className="text-destructive text-[10px]">{state.errors.lastName[0]}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                  <Input name="email" id="email" type="email" placeholder="juan@university.edu.ph" className="h-9 rounded-lg text-sm" required />
                  {state.errors?.email && <p className="text-destructive text-[10px]">{state.errors.email[0]}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="subject" className="text-[9px] font-black uppercase tracking-widest text-gray-400">Subject</Label>
                  <Input name="subject" id="subject" placeholder="Membership Inquiry" className="h-9 rounded-lg text-sm" required />
                  {state.errors?.subject && <p className="text-destructive text-[10px]">{state.errors.subject[0]}</p>}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="message" className="text-[9px] font-black uppercase tracking-widest text-gray-400">Message</Label>
                    <span className={`text-[9px] font-bold ${message.length >= MESSAGE_LIMIT ? "text-destructive" : "text-gray-400"}`}>
                      {message.length}/{MESSAGE_LIMIT}
                    </span>
                  </div>
                  <Textarea
                    name="message" id="message"
                    placeholder="Tell us how we can help you..."
                    className="min-h-[90px] rounded-lg text-sm py-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={MESSAGE_LIMIT}
                    required
                  />
                  {state.errors?.message && <p className="text-destructive text-[10px]">{state.errors.message[0]}</p>}
                </div>
                <Button type="submit" className="w-full h-10 bg-primary hover:bg-[#002673] text-white rounded-lg text-sm font-black transition-all" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Message"} <Send className="ml-2 w-3.5 h-3.5" />
                </Button>
              </form>
            </motion.div>

            {/* RIGHT: Contact Directory */}
            <div className="lg:col-span-7">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Direct Contacts</p>

              {/* Top row: Competition spans full, Payment sits right */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <ContactSection section={sections[0]} delay={0.3} />
                <ContactSection section={sections[1]} delay={0.4} />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

              {/* Bottom: Event spans full width (3 contacts) */}
              <ContactSection section={sections[2]} delay={0.5} />
            </div>

          </div>
        </div>
      </DecorativeLayout>

      <footer className="relative z-10 py-6 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center" />
      </footer>
    </div>
  );
}
