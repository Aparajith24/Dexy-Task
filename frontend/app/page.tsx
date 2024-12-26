"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function DexyTask() {
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setOutput(data.message);
      setLoading(false);
      alert(data.message);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error executing code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Dexy Task</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="w-full px-4 py-2 rounded-md h-32 resize-none"
          />
          <Button type="submit" className="w-full hover:cursor-pointer">
            {loading ? <Loader2 className="animate-spin"/> : <p>Send Message</p>}
          </Button>
        </div>
      </form>
    </div>
  );
}
