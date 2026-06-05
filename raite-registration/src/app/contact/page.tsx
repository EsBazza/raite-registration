"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Globe,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our team is here to help with your inquiries.",
      value: "secretariat@psite-r3.org",
      href: "mailto:secretariat@psite-r3.org",
      color: "blue"
    },
    {
      icon: MessageSquare,
      title: "Social Media",
      description: "Reach out to us via our official channels.",
      value: "PSITE Region 3 Official",
      href: "https://facebook.com",
      color: "indigo"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Based in Central Luzon, Philippines.",
      value: "Region 3, Philippines",
      href: "#",
      color: "purple"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-blue-50/50 dark:bg-blue-900/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-indigo-50/50 dark:bg-indigo-900/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header */}
          <div className="max-w-3xl mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              Get in Touch
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-8 leading-[0.9]"
            >
              Let&apos;s build the <br />
              <span className="text-blue-600">Future together.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl"
            >
              Have questions about membership, events, or partnerships? We&apos;re here to support the IT education community in Region 3.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Contact Information & Form Side */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Form Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-none"
              >
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="first-name" className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">First Name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="Juan" 
                        className="h-14 rounded-2xl bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="last-name" className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Last Name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Dela Cruz" 
                        className="h-14 rounded-2xl bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="juan@university.edu.ph" 
                      className="h-14 rounded-2xl bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Membership Inquiry" 
                      className="h-14 rounded-2xl bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..." 
                      className="min-h-[160px] rounded-2xl bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 focus:ring-blue-600 focus:border-blue-600 py-4 resize-none"
                    />
                  </div>

                  <Button size="lg" className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-black shadow-xl shadow-blue-600/20 transition-all group">
                    Send Message
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              </motion.div>
            </div>

            {/* Info Channels Side */}
            <div className="lg:col-span-5 space-y-10 lg:pl-10">
              <div className="space-y-10">
                {contactMethods.map((method, i) => (
                  <motion.a
                    key={i}
                    href={method.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="group flex gap-6 p-2 items-start"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-${method.color}-50 dark:bg-${method.color}-900/20 flex items-center justify-center shrink-0 text-${method.color}-600 dark:text-${method.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-2 leading-relaxed">
                        {method.description}
                      </p>
                      <p className="text-gray-900 dark:text-white font-bold tracking-tight">
                        {method.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Follow Our Progress</h3>
                <div className="flex gap-4">
                  {[Globe, Mail, MessageSquare].map((Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Back to Home / Link */}
              <div className="pt-4">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to Homepage
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-10 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-gray-700">
            PSITE Region 3 &copy; 2024
          </p>
        </div>
      </footer>

    </div>
  );
}
