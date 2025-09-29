import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ThemeToggle } from "./ThemeToggle";
import { GraduationCap, Mail, User } from "lucide-react";

export default function StudentChatbot() {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  // refs
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
   const inputRef = useRef<HTMLInputElement | null>(null);

  // auto-scroll when messages change
 useEffect(() => {
  if (!scrollAreaRef.current) return;

  const scrollEl = scrollAreaRef.current;
  const anchor = scrollEl.querySelector("#scroll-anchor");
  if (anchor) {
    anchor.scrollIntoView({ behavior: "smooth", block: "end" });
  } else {
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }
}, [messages]);


  // SAFE listener for option buttons
  useEffect(() => {
    const handler = (e: any) => {
      const value = e.detail;
      // If user clicked "faq" we want user to type — show prompt & focus
      if (value === "faq" || value === "general_query") {
        // make sure email exists
        if (!studentEmail || !studentEmail.trim()) {
          setMessages((prev) => [
            ...prev,
            {
              id: `missing-email-${Date.now()}`,
              sender: "bot",
              type: "error",
              title: "Missing email",
              message:
                "Please enter your email in the start form first 👇\nThen click the button again.",
            },
          ]);
          return;
        }
        // show bot prompting user to type question
        setMessages((prev) => [
          ...prev,
          {
            id: `faq-prompt-${Date.now()}`,
            sender: "bot",
            type: "text",
            title: "💬 Ask a question",
            message: "Please type your question and press Enter — I'll search the FAQ for you.",
          },
        ]);
        setTimeout(() => inputRef.current?.focus(), 80);
        return;
      }

      // For other options, require email
      if (!studentEmail || !studentEmail.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            id: `missing-email-${Date.now()}`,
            sender: "bot",
            type: "error",
            title: "Missing email",
            message:
              "Please enter your email in the start form first 👇\nThen click the button again.",
          },
        ]);
        return;
      }
      setTimeout(() => {
  const el = scrollAreaRef.current;
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}, 100);


      // forward to normal send pipeline
      handleSendMessage(value);
    };

    window.addEventListener("sendMessage", handler);
    return () => window.removeEventListener("sendMessage", handler);
  }, [studentEmail]); // re-register when email changes

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail) {
      alert("Please enter both name and email to start the chat.");
      return;
    }
    setIsChatStarted(true);

    setMessages([
      {
        id: "welcome",
        type: "options",
        sender: "bot",
        title: `Hi ${studentName}! 👋`,
        message: "I'm here to help you — choose one:",
        // options: [
        //   { label: "📚 Attendance", value: "attendance" },
        //   { label: "🧾 Assessments", value: "assessment" },
        //   { label: "💡 General Query", value: "faq" },
        // ],
        options: [
  { label: "📚 Attendance", value: "attendance_menu" },
  { label: "🧾 Assessments", value: "assessment_menu" },
  { label: "💡 General Query", value: "faq_menu" },
],

      },
    ]);

    // focus input after UI updates
    setTimeout(() => inputRef.current?.focus(), 180);
  };

  // core send function (used by typing or button click)
  const handleSendMessage = async (text: string) => {
    if (!text) return;

    // Show user message (human-friendly text for special tokens)
    const displayText = text.startsWith("assessment_")
      ? text.replace("_", " ").replace("assessment", "Assessment ")
      : text.replace(/_/g, " ");

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "user", type: "text", message: displayText },
    ]);

    // typing indicator
    // setMessages((prev) => [
    //   ...prev,
    //   { id: `t-${Date.now()}`, sender: "bot", type: "text", message: "✍️ Zuvy Buddy is typing..." },
    // ]);

    // typing indicator with gif
// setMessages((prev) => [
//   ...prev,
//   { 
//     id: `t-${Date.now()}`, 
//     sender: "bot", 
//     type: "typing", 
//     message: "\public\video (4).mp4" // path to your gif
//   },
// ]);
// setMessages((prev) => [
//   ...prev,
//   {
//     id: `t-${Date.now()}`,
//     sender: "bot",
//     type: "typing",
//     message: "\Chat.mp4", // ✅ correct path
//   },
// ]);
setMessages((prev) => [
  ...prev,
  {
    id: `t-${Date.now()}`,
    sender: "bot",
    type: "typing",
    message: "/Chat.mp4", // ✅ correct path (keep in public/)
  },
]);




    // ensure scroll to bottom after adding user msg
    setTimeout(() => {
      const el = scrollAreaRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 50);

    try {
      const res = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: studentName, email: studentEmail, text }),
      });
      const data = await res.json();

      // remove typing
      setMessages((prev) => prev.filter((m) => !(`${m.id}`.startsWith("t-"))));
      // append bot structured reply
      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, sender: "bot", ...data },
      ]);

      // if backend returned options and it's 'assessment' options, focus not needed
      // if backend returned type "options" and one of them is 'faq', you still let user click and type
      setTimeout(() => inputRef.current?.focus(), 180);
    } catch (err) {
      console.error("Error sending chat:", err);
      setMessages((prev) => prev.filter((m) => !(`${m.id}`.startsWith("t-"))));
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, sender: "bot", type: "error", message: "⚠️ Something went wrong." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-2xl mx-auto rounded-2xl shadow-lg border border-border bg-background">
      {!isChatStarted ? (
        <form onSubmit={handleStartChat} className="flex flex-col justify-center items-center flex-1 p-8 gap-6">
          <div className="flex items-center gap-3 mb-4">
            {/* <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div> */}
            {/* <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full overflow-hidden">
            <img src="\robot_circular_format.png" alt="Zuvy Logo" className="w-10 h-10 object-contain" />
            </div> */}
            <div className="flex items-center justify-center">
            <img
            src="\robot_circular_format-modified.png"
            alt="Zuvy Logo"
            className="w-10 h-10 bg-transparent rounded-sm dark:filter dark:invert"
             />
</div>

            <h2 className="text-2xl font-bold">Welcome to Zuvy Buddy 🎓</h2>
          </div>

          <p className="text-muted-foreground text-center max-w-sm">Enter details to start chatting.</p>

          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full pl-10 border p-3 rounded-xl bg-background text-foreground"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full pl-10 border p-3 rounded-xl bg-background text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={!studentName || !studentEmail}
              className="bg-primary text-primary-foreground p-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              Start Chat
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="bg-card border-b border-border rounded-t-2xl p-6 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div> */}
                    <div className="flex items-center justify-center">
            <img
            src="robot_circular_format-modified.png"
            alt="Zuvy Logo"
            className="w-14 h-14 object-contain"
             />
</div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Zuvy Buddy</h1>
                <p className="text-sm text-muted-foreground">Your academic assistant</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

       <Card className="flex-1 flex flex-col border-x border-border rounded-none">
  <div className="flex-1 relative">
    <div
      ref={scrollAreaRef}
      className="absolute inset-0 p-4 overflow-y-auto scroll-smooth space-y-3"
      style={{ maxHeight: "calc(85vh - 180px)" }} // Adjusts height below header
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} isBot={msg.sender === "bot"} />
      ))}
      <div id="scroll-anchor" />
    </div>
  </div>


  <div className="p-3 border-t">
    <ChatInput onSendMessage={handleSendMessage} ref={inputRef} />
  </div>
</Card>

        </>
      )}
    </div>
  );
}
