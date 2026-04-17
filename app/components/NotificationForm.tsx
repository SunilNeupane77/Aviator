"use client";

import { useState } from "react";
import { Bell, Phone, CheckCircle2, AlertCircle } from "lucide-react";

interface NotificationFormProps {
  flightNumber: string;
}

export default function NotificationForm({ flightNumber }: NotificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setStatus("loading");
    
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          flightNumber: flightNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("You are subscribed! We'll text you updates.");
        setPhoneNumber("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-in w-full h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <Bell className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">SMS Updates</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Get real-time texts about delays, gate changes, and boarding times for flight <strong className="text-slate-900 dark:text-white">{flightNumber}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center mb-4">
          <Phone className="w-5 h-5 absolute left-4 text-slate-400" />
          <input
            type="tel"
            className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder-slate-400"
            placeholder="+1 (555) 000-0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={status === "loading" || status === "success"}
          />
        </div>
        
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-4 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || status === "success" || !phoneNumber.trim()}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
        >
          {status === "loading" ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : status === "success" ? (
            "Subscribed"
          ) : (
            "Subscribe via SMS"
          )}
        </button>
      </form>
    </div>
  );
}
