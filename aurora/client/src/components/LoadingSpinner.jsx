import React from "react";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-space-cyan/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-space-cyan rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-transparent border-t-space-purple rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
      </div>
      <p className="text-slate-400 font-space text-sm tracking-widest animate-pulse">{text}</p>
    </div>
  );
}
