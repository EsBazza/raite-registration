"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Trash2, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Simple markdown formatting (bold only)
const formatMessageText = (text: string) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const withBold = text.replace(boldRegex, "<strong>$1</strong>");
  return withBold.replace(/\n/g, "<br />");
};

// Quick chips (FAQ items) - horizontally scrollable
const QUICK_CHIPS = [
  "How to register as a coach?",
  "Registration fees and deadlines",
  "List all competitions",
  "AI policy",
  "E-sports photo requirements",
  "When and where is RAITE 2026?",
  "Can I join multiple competitions?",
  "What is the point system?",
];

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, clearError, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: "👋 Hello! I'm the **RAITE Assistant**. I can help you with event details or guide you through using this website. What would you like to know?" }],
      },
    ],
    onError: (err) => {
      console.error("Chat Error:", err);
      setErrorMsg(err.message || "An unexpected error occurred. Please check your connection or API key.");
    },
  });

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";
  const isLoading = isStreaming || isSubmitted;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, status, errorMsg, scrollToBottom]);

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: "welcome-new",
        role: "assistant",
        parts: [{ type: "text", text: "👋 Conversation cleared. How can I help you with RAITE 2026?" }],
      },
    ]);
    setErrorMsg(null);
  }, [setMessages]);

  const retryLastMessage = useCallback(() => {
    const userMessages = messages.filter(m => m.role === "user");
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1];
    const lastUserText = lastUserMsg.parts?.find((p: any) => p.type === "text")?.text;
    if (lastUserText) {
      sendMessage({ text: lastUserText });
    }
  }, [messages, sendMessage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setInput("");
    setErrorMsg(null);
    try {
      await sendMessage({ text: currentInput });
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send message");
    }
  };

  const handleQuickChip = async (text: string) => {
    if (isLoading) return;
    setErrorMsg(null);
    try {
      await sendMessage({ text });
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send message");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 shadow-md bg-white hover:bg-gray-50 border border-gray-200 transition-all"
              aria-label="Open chat assistant"
            >
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-[90vw] sm:w-[420px] md:w-[450px]"
          >
            <Card className="border border-gray-200 shadow-xl bg-white rounded-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
              {/* Header */}
              <CardHeader className="bg-white border-b border-gray-100 p-4 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/RAITE.png"
                      alt="RAITE Logo"
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <div className="relative w-6 h-6">
                    <Image
                      src="/psite.png"
                      alt="PSITE Logo"
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    RAITE Assistant
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearConversation}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden p-0 bg-white min-h-0">
                <div
                  className="h-full px-4 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
                  ref={scrollRef}
                  aria-live="polite"
                >
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const textPart = msg.parts?.find((p: any) => p.type === "text");
                      const rawText = textPart?.text || "";
                      const formattedHtml = formatMessageText(rawText);
                      return (
                        <div
                          key={msg.id}
                          className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                              msg.role === "user"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-gray-800 text-white"
                            )}
                          >
                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div
                            className={cn(
                              "p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] shadow-sm",
                              msg.role === "user"
                                ? "bg-gray-800 text-white rounded-tr-none"
                                : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                            )}
                          >
                            <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
                          </div>
                        </div>
                      );
                    })}
                    {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                      <div className="flex gap-3 items-center">
                        <div className="bg-gray-800 w-7 h-7 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          </div>
                        </div>
                      </div>
                    )}
                    {errorMsg && (
                      <div className="flex flex-col items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs text-center mx-2">
                        <p className="font-bold">⚠️ Error</p>
                        <p>{errorMsg}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] border-red-300 text-red-600"
                            onClick={() => setErrorMsg(null)}
                          >
                            Dismiss
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] border-red-300 text-red-600"
                            onClick={retryLastMessage}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" /> Retry
                          </Button>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </CardContent>

              {/* Footer with FAQ chips */}
              <CardFooter className="p-4 bg-white border-t border-gray-100 flex flex-col gap-3 shrink-0">
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                  <div className="flex gap-2 min-w-max pb-1">
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleQuickChip(chip)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1.5 rounded-full border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about RAITE 2026..."
                    className="flex-1 rounded-xl border-gray-300 bg-white focus-visible:ring-gray-400"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="rounded-xl bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
                <p className="text-[10px] text-gray-400 text-center">
                  AI may make mistakes. Verify important details with official channels.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}