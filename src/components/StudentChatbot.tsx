// import React, { useState, useRef, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import ChatMessage from "./ChatMessage";
// import ChatInput from "./ChatInput";
// import { ThemeToggle } from "./ThemeToggle";
// import { GraduationCap, Mail, User } from "lucide-react";

// export default function StudentChatbot() {
//   const [studentName, setStudentName] = useState("");
//   const [studentEmail, setStudentEmail] = useState("");
//   const [isChatStarted, setIsChatStarted] = useState(false);
//   const [messages, setMessages] = useState<any[]>([]);

//   // refs
//   const scrollAreaRef = useRef<HTMLDivElement | null>(null);
//    const inputRef = useRef<HTMLInputElement | null>(null);

//   // auto-scroll when messages change
//  useEffect(() => {
//   if (!scrollAreaRef.current) return;

//   const scrollEl = scrollAreaRef.current;
//   const anchor = scrollEl.querySelector("#scroll-anchor");
//   if (anchor) {
//     anchor.scrollIntoView({ behavior: "smooth", block: "end" });
//   } else {
//     scrollEl.scrollTop = scrollEl.scrollHeight;
//   }
// }, [messages]);


//   // SAFE listener for option buttons
//   useEffect(() => {
//     const handler = (e: any) => {
//       const value = e.detail;
//       // If user clicked "faq" we want user to type — show prompt & focus
//       if (value === "faq" || value === "general_query") {
//         // make sure email exists
//         if (!studentEmail || !studentEmail.trim()) {
//           setMessages((prev) => [
//             ...prev,
//             {
//               id: `missing-email-${Date.now()}`,
//               sender: "bot",
//               type: "error",
//               title: "Missing email",
//               message:
//                 "Please enter your email in the start form first 👇\nThen click the button again.",
//             },
//           ]);
//           return;
//         }
//         // show bot prompting user to type question
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `faq-prompt-${Date.now()}`,
//             sender: "bot",
//             type: "text",
//             title: "💬 Ask a question",
//             message: "Please type your question and press Enter — I'll search the FAQ for you.",
//           },
//         ]);
//         setTimeout(() => inputRef.current?.focus(), 80);
//         return;
//       }

//       // For other options, require email
//       if (!studentEmail || !studentEmail.trim()) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `missing-email-${Date.now()}`,
//             sender: "bot",
//             type: "error",
//             title: "Missing email",
//             message:
//               "Please enter your email in the start form first 👇\nThen click the button again.",
//           },
//         ]);
//         return;
//       }
//       setTimeout(() => {
//   const el = scrollAreaRef.current;
//   if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
// }, 100);


//       // forward to normal send pipeline
//       handleSendMessage(value);
//     };

//     window.addEventListener("sendMessage", handler);
//     return () => window.removeEventListener("sendMessage", handler);
//   }, [studentEmail]); // re-register when email changes

//   const handleStartChat = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!studentName || !studentEmail) {
//       alert("Please enter both name and email to start the chat.");
//       return;
//     }
//     setIsChatStarted(true);

//     setMessages([
//       {
//         id: "welcome",
//         type: "options",
//         sender: "bot",
//         title: `Hi ${studentName}! 👋`,
//         message: "I'm here to help you — choose one:",
//         // options: [
//         //   { label: "📚 Attendance", value: "attendance" },
//         //   { label: "🧾 Assessments", value: "assessment" },
//         //   { label: "💡 General Query", value: "faq" },
//         // ],
//         options: [
//   { label: "📚 Attendance", value: "attendance_menu" },
//   { label: "🧾 Assessments", value: "assessment_menu" },
//   { label: "💡 General Query", value: "faq_menu" },
// ],

//       },
//     ]);

//     // focus input after UI updates
//     setTimeout(() => inputRef.current?.focus(), 180);
//   };

//   // core send function (used by typing or button click)
//   const handleSendMessage = async (text: string) => {
//     if (!text) return;

//     // Show user message (human-friendly text for special tokens)
//     const displayText = text.startsWith("assessment_")
//       ? text.replace("_", " ").replace("assessment", "Assessment ")
//       : text.replace(/_/g, " ");

//     setMessages((prev) => [
//       ...prev,
//       { id: `u-${Date.now()}`, sender: "user", type: "text", message: displayText },
//     ]);

//     // typing indicator
//     // setMessages((prev) => [
//     //   ...prev,
//     //   { id: `t-${Date.now()}`, sender: "bot", type: "text", message: "✍️ Zuvy Buddy is typing..." },
//     // ]);

//     // typing indicator with gif
// // setMessages((prev) => [
// //   ...prev,
// //   { 
// //     id: `t-${Date.now()}`, 
// //     sender: "bot", 
// //     type: "typing", 
// //     message: "\public\video (4).mp4" // path to your gif
// //   },
// // ]);
// // setMessages((prev) => [
// //   ...prev,
// //   {
// //     id: `t-${Date.now()}`,
// //     sender: "bot",
// //     type: "typing",
// //     message: "\Chat.mp4", // ✅ correct path
// //   },
// // ]);
// setMessages((prev) => [
//   ...prev,
//   {
//     id: `t-${Date.now()}`,
//     sender: "bot",
//     type: "typing",
//     message: "/Chat.mp4", // ✅ correct path (keep in public/)
//   },
// ]);




//     // ensure scroll to bottom after adding user msg
//     setTimeout(() => {
//       const el = scrollAreaRef.current;
//       if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
//     }, 50);

//     try {
//       // const res = await fetch("http://localhost:5000/query", {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/query`, {

//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: studentName, email: studentEmail, text }),
//       });
//       const data = await res.json();

//       // remove typing
//       setMessages((prev) => prev.filter((m) => !(`${m.id}`.startsWith("t-"))));
//       // append bot structured reply
//       setMessages((prev) => [
//         ...prev,
//         { id: `b-${Date.now()}`, sender: "bot", ...data },
//       ]);

//       // if backend returned options and it's 'assessment' options, focus not needed
//       // if backend returned type "options" and one of them is 'faq', you still let user click and type
//       setTimeout(() => inputRef.current?.focus(), 180);
//     } catch (err) {
//       console.error("Error sending chat:", err);
//       setMessages((prev) => prev.filter((m) => !(`${m.id}`.startsWith("t-"))));
//       setMessages((prev) => [
//         ...prev,
//         { id: `err-${Date.now()}`, sender: "bot", type: "error", message: "⚠️ Something went wrong." },
//       ]);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[85vh] max-w-2xl mx-auto rounded-2xl shadow-lg border border-border bg-background">
//       {!isChatStarted ? (
//         <form onSubmit={handleStartChat} className="flex flex-col justify-center items-center flex-1 p-8 gap-6">
//           <div className="flex items-center gap-3 mb-4">
//             {/* <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full">
//               <GraduationCap className="w-7 h-7 text-primary" />
//             </div> */}
//             {/* <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full overflow-hidden">
//             <img src="\robot_circular_format.png" alt="Zuvy Logo" className="w-10 h-10 object-contain" />
//             </div> */}
//             <div className="flex items-center justify-center">
//             <img
//             src="\robot_circular_format-modified.png"
//             alt="Zuvy Logo"
//             className="w-10 h-10 bg-transparent rounded-sm dark:filter dark:invert"
//              />
// </div>

//             <h2 className="text-2xl font-bold">Welcome to Zuvy Buddy 🎓</h2>
//           </div>

//           <p className="text-muted-foreground text-center max-w-sm">Enter details to start chatting.</p>

//           <div className="w-full max-w-sm flex flex-col gap-4">
//             <div className="relative">
//               <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={studentName}
//                 onChange={(e) => setStudentName(e.target.value)}
//                 className="w-full pl-10 border p-3 rounded-xl bg-background text-foreground"
//               />
//             </div>

//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={studentEmail}
//                 onChange={(e) => setStudentEmail(e.target.value)}
//                 className="w-full pl-10 border p-3 rounded-xl bg-background text-foreground"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={!studentName || !studentEmail}
//               className="bg-primary text-primary-foreground p-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
//             >
//               Start Chat
//             </button>
//           </div>
//         </form>
//       ) : (
//         <>
//           <div className="bg-card border-b border-border rounded-t-2xl p-6 shadow-sm flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               {/* <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
//                 <GraduationCap className="w-6 h-6 text-primary" />
//               </div> */}
//                     <div className="flex items-center justify-center">
//             <img
//             src="robot_circular_format-modified.png"
//             alt="Zuvy Logo"
//             className="w-14 h-14 object-contain"
//              />
// </div>
//               <div>
//                 <h1 className="text-xl font-bold text-foreground">Zuvy Buddy</h1>
//                 <p className="text-sm text-muted-foreground">Your academic assistant</p>
//               </div>
//             </div>
//             <ThemeToggle />
//           </div>

//        <Card className="flex-1 flex flex-col border-x border-border rounded-none">
//   <div className="flex-1 relative">
//     <div
//       ref={scrollAreaRef}
//       className="absolute inset-0 p-4 overflow-y-auto scroll-smooth space-y-3"
//       style={{ maxHeight: "calc(85vh - 180px)" }} // Adjusts height below header
//     >
//       {messages.map((msg) => (
//         <ChatMessage key={msg.id} message={msg} isBot={msg.sender === "bot"} />
//       ))}
//       <div id="scroll-anchor" />
//     </div>
//   </div>


//   <div className="p-3 border-t">
//     <ChatInput onSendMessage={handleSendMessage} ref={inputRef} />
//   </div>
// </Card>

//         </>
//       )}
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Mail, User, Mic, Volume2, VolumeX } from "lucide-react";
// import ChatMessage from "./ChatMessage";
// import ChatInput from "./ChatInput";
// import { ThemeToggle } from "./ThemeToggle";

// export default function StudentChatbot() {
//   // 🎯 States
//   const [studentName, setStudentName] = useState("");
//   const [studentEmail, setStudentEmail] = useState("");
//   const [isChatStarted, setIsChatStarted] = useState<
//     false | "student" | "learner" | "business" | "partner"
//   >(false);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [listening, setListening] = useState(false);
//   const [speakingEnabled, setSpeakingEnabled] = useState(true);

//   const scrollAreaRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const recognitionRef = useRef<any>(null);

//   // 🧭 Auto scroll
//   useEffect(() => {
//     if (!scrollAreaRef.current) return;
//     const el = scrollAreaRef.current;
//     el.scrollTop = el.scrollHeight;
//   }, [messages]);

//   // 🧠 Text-to-Speech (bot voice)
//   const speak = (text: string) => {
//     if (!speakingEnabled || !text) return;
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.rate = 1;
//     utter.pitch = 1;
//     utter.lang = "en-IN";
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utter);
//   };

//   // 🎙️ Voice Input (speech → text)
//   const toggleListening = () => {
//     if (listening) {
//       recognitionRef.current?.stop();
//       setListening(false);
//       return;
//     }

//     const SpeechRecognition =
//       (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }

//     const rec = new SpeechRecognition();
//     rec.lang = "en-IN";
//     rec.interimResults = false;
//     rec.maxAlternatives = 1;

//     rec.onresult = (e: any) => {
//       const transcript = e.results[0][0].transcript;
//       handleSendMessage(transcript);
//     };

//     rec.onend = () => setListening(false);
//     recognitionRef.current = rec;
//     rec.start();
//     setListening(true);
//   };

//   // 💬 Option click handler
//   useEffect(() => {
//     const handler = (e: any) => {
//       const value = e.detail;

//       // ✅ Only student needs email check
//       if (isChatStarted === "student" && (!studentEmail || !studentEmail.trim())) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `missing-${Date.now()}`,
//             sender: "bot",
//             type: "error",
//             title: "Missing Email",
//             message: "⚠️ Please start chat with your email first.",
//           },
//         ]);
//         return;
//       }

//       // 🧠 FAQ menu click
//       if (value.startsWith("faq_menu_")) {
//         handleSendMessage(value);
//         return;
//       }

//       // 💡 Ask anything
//       if (value === "faq" || value === "faq_query") {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `faq-${Date.now()}`,
//             sender: "bot",
//             type: "text",
//             title: "💡 Ask a question",
//             message:
//               "You can ask anything about Bootcamps, LMS or Partnerships. Type below 👇",
//           },
//         ]);
//         setTimeout(() => inputRef.current?.focus(), 100);
//         return;
//       }

//       handleSendMessage(value);
//     };

//     window.addEventListener("sendMessage", handler);
//     return () => window.removeEventListener("sendMessage", handler);
//   }, [studentEmail, isChatStarted]);

//   // 🎓 Start chat for learner
//   const handleStartChat = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!studentName || !studentEmail) {
//       alert("Please enter both name and email.");
//       return;
//     }
//     setIsChatStarted("student");
//     setMessages([
//       {
//         id: "welcome",
//         sender: "bot",
//         type: "options",
//         title: `Hi ${studentName}! 👋`,
//         message: "Welcome back! Choose an option 👇",
//         options: [
//           { label: "📚 Attendance", value: "attendance_menu" },
//           { label: "🧾 Assessments", value: "assessment_menu" },
//           { label: "💡 FAQs", value: "faq_menu_Existing Learner" },
//         ],
//       },
//     ]);
//   };

//   // 🛰️ Send message to backend
//   const handleSendMessage = async (text: string) => {
//     if (!text) return;
//     setMessages((prev) => [
//       ...prev,
//       { id: `u-${Date.now()}`, sender: "user", type: "text", message: text },
//       { id: `t-${Date.now()}`, sender: "bot", type: "typing", message: "/Chat.mp4" },
//     ]);

//     try {
//       const res = await fetch("http://localhost:5000/query", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: studentName || "Visitor",
//           email: studentEmail || "",
//           text,
//         }),
//       });
//       const data = await res.json();

//       // 🧹 remove typing + add bot reply
//       setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));
//       setMessages((prev) => [
//         ...prev,
//         { id: `b-${Date.now()}`, sender: "bot", ...data },
//       ]);

//       // 🗣️ Speak reply
//       if (data.voiceText) speak(data.voiceText);
//       else speak(data.message);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `err-${Date.now()}`,
//           sender: "bot",
//           type: "error",
//           message:
//             "⚠️ Something went wrong. Try again or email join-zuvy@navgurukul.org",
//         },
//       ]);
//       speak("Something went wrong. Please try again later.");
//     }
//   };

//   // 🌟 Save lead
//   async function saveLeadToServer(name: string, email: string) {
//     const res = await fetch("http://localhost:5000/save-lead", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, source: "chatbot" }),
//     });
//     if (!res.ok) throw new Error("Failed to save lead");
//     return res.json();
//   }

//   // 🌱 Inline lead form
//   const lastBot = messages.slice().reverse().find((m) => m.sender === "bot");
//   const showLeadInline = lastBot && lastBot.type === "lead_form";

//   return (
//    <div className="flex flex-col h-[85vh] max-w-2xl mx-auto rounded-3xl shadow-2xl border border-gray-200 bg-white/60 backdrop-blur-lg transition-all duration-300 hover:shadow-3xl">

//       {/* 🚀 Start Screen */}
//       {!isChatStarted && (
//         // <div className="flex flex-col justify-center items-center flex-1 p-8 gap-6">
//         <div className="flex flex-col justify-center items-center flex-1 p-10 gap-8 animate-fade-in">
//           <img
//             src="\robot_transparent_background.png"
//             alt="Zuvy Logo"
//             className="w-20 h-20 animate-bounce-slow"
//           />
//           <h2 className="text-2xl font-bold text-center">Welcome to Zuvy Buddy</h2>
//           <p className="text-muted-foreground text-center max-w-sm">
//             How can I help you today? 👇
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
//             <button
//               onClick={() => setIsChatStarted("student")}
//               className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"

//             >
//               🎓 I’m an Existing Learner
//             </button>
//             <button
//               onClick={() => {
//                 setIsChatStarted("learner");
//                 setMessages([
//                   {
//                     id: "bootcamp",
//                     sender: "bot",
//                     type: "options",
//                     title: "💻 Explore Zuvy Bootcamps",
//                     message:
//                       "Hands-on programs in Full-Stack & DSA with placement support 👇",
//                     options: [
//                       { label: "📘 Bootcamp FAQs", value: "faq_menu_Explore Bootcamps" },
//                       { label: "📧 Contact Us", value: "faq_menu_All" },
//                     ],
//                   },
//                 ]);
//               }}
//               // className="bg-green-600 text-white p-3 rounded-xl hover:opacity-90 transition"
//               className="bg-gradient-to-r from-green-500 to-emerald-400 p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"

//             >
//               💻 I want to Explore Bootcamps
//             </button>
//             <button
//               onClick={() => {
//                 setIsChatStarted("business");
//                 setMessages([
//                   {
//                     id: "business",
//                     sender: "bot",
//                     type: "options",
//                     title: "🏢 LMS Solutions",
//                     message:
//                       "Custom LMS for Businesses, NGOs & Community Programs 👇",
//                     options: [
//                       { label: "📘 LMS FAQs", value: "faq_menu_LMS Solutions" },
//                       { label: "📧 Contact Us", value: "faq_menu_All" },
//                     ],
//                   },
//                 ]);
//               }}
//               // className="bg-blue-600 text-white p-3 rounded-xl hover:opacity-90 transition"
//               className="bg-gradient-to-r from-sky-500 to-cyan-400 p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"

//             >
//               🏢 I’m Exploring LMS Solutions
//             </button>
//             <button
//               onClick={() => {
//                 setIsChatStarted("partner");
//                 setMessages([
//                   {
//                     id: "partner",
//                     sender: "bot",
//                     type: "options",
//                     title: "🤝 Partnerships",
//                     message:
//                       "For CSR Partners, Employers & Impact Collaborations 👇",
//                     options: [
//                       { label: "📘 Partnership FAQs", value: "faq_menu_Partnerships" },
//                       { label: "📧 Contact Us", value: "faq_menu_All" },
//                     ],
//                   },
//                 ]);
//               }}
//               // className="bg-amber-500 text-white p-3 rounded-xl hover:opacity-90 transition"
//               // className="bg-gradient-to-r from-amber-400 to-yellow-500 p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
// className="bg-gradient-to-r from-green-300 to-green-400 p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"

//             >
//               🤝 I’m Interested in Partnerships
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 🧍 Student Login Form */}
//       {isChatStarted === "student" && !messages.length && (
//         <form
//           onSubmit={handleStartChat}
//           className="flex flex-col justify-center items-center flex-1 p-8 gap-6"
//         >
//           <img
//             src="\robot_transparent_background.png"
//             alt="Zuvy Logo"
//             className="w-10 h-10"
//           />
//           <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
//           <p className="text-muted-foreground text-center max-w-sm">
//             Enter your details to continue.
//           </p>

//           <div className="w-full max-w-sm flex flex-col gap-4">
//             <div className="relative">
//               <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={studentName}
//                 onChange={(e) => setStudentName(e.target.value)}
//                 className="w-full pl-10 border p-3 rounded-xl"
//               />
//             </div>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={studentEmail}
//                 onChange={(e) => setStudentEmail(e.target.value)}
//                 className="w-full pl-10 border p-3 rounded-xl"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={!studentName || !studentEmail}
//               className="bg-primary text-white p-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
//             >
//               Start Chat
//             </button>
//           </div>
//         </form>
//       )}

//       {/* 💬 Chat UI */}
//       {isChatStarted && messages.length > 0 && (
//         <>
//           <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-gray-200 rounded-t-3xl p-4 flex justify-between items-center backdrop-blur-md">

//             <div className="flex items-center gap-3">
//               <img
//                 src="\robot_transparent_background.png"
//                 alt="Zuvy Logo"
//                 className="w-10 h-10 object-contain"
//               />
//               <div>
//                 <h1 className="text-lg font-bold">Zuvy Buddy</h1>
//                 <p className="text-xs text-muted-foreground">Your AI Assistant</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleListening}
//                 className={`p-2 rounded-full ${
//                   listening ? "bg-red-500 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 <Mic size={18} />
//               </button>
//               <button
//   onClick={toggleListening}
//   className={`p-2 rounded-full transition-all duration-300 ${
//     listening
//       ? "bg-red-500 text-white shadow-md scale-110"
//       : "bg-gray-100 hover:bg-gray-200"
//   }`}
// >

//                 {speakingEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
//               </button>
//               <ThemeToggle />
//             </div>
//           </div>

//           {/* <Card className="flex-1 flex flex-col border-x border-border rounded-none"> */}
//           <Card className="flex-1 flex flex-col border-x border-gray-100 rounded-none bg-white/50 backdrop-blur-sm">

//             <div
//               ref={scrollAreaRef}
//               className="flex-1 overflow-y-auto p-4 space-y-3"
//               style={{ maxHeight: "calc(85vh - 180px)" }}
//             >
//               {messages.map((msg) => (
//                 <ChatMessage
//                   key={msg.id}
//                   message={msg}
//                   isBot={msg.sender === "bot"}
//                 />
//               ))}
//               <div id="scroll-anchor" />
//             </div>

//             {/* Inline Lead Form */}
//             {showLeadInline && (
//               <div className="p-3 border-t bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
//                 <form
//                   onSubmit={async (e) => {
//                     e.preventDefault();
//                     const form = e.target as HTMLFormElement;
//                     const fname = (form.elements.namedItem("visitor_name") as HTMLInputElement)
//                       .value;
//                     const femail = (form.elements.namedItem("visitor_email") as HTMLInputElement)
//                       .value;
//                     if (!fname || !femail) {
//                       alert("Please enter both name and email.");
//                       return;
//                     }
//                     await saveLeadToServer(fname, femail);
//                     setMessages((prev) => [
//                       ...prev,
//                       {
//                         id: `lead-saved-${Date.now()}`,
//                         sender: "bot",
//                         type: "text",
//                         message:
//                           "🎉 Thanks! Your details are saved. You can reach us at join-zuvy@navgurukul.org",
//                       },
//                     ]);
//                     form.reset();
//                   }}
//                 >
//                   <div className="flex gap-2">
//                     <input
//                       name="visitor_name"
//                       placeholder="Your name"
//                       className="flex-1 p-2 rounded-md border"
//                     />
//                     <input
//                       name="visitor_email"
//                       placeholder="Your email"
//                       type="email"
//                       className="flex-1 p-2 rounded-md border"
//                     />
//                     <button className="px-3 py-2 bg-primary text-white rounded-md">
//                       Save
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             <div className="p-3 border-t">
//               <ChatInput onSendMessage={handleSendMessage} ref={inputRef} />
//             </div>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Mail, User, Mic, Volume2, VolumeX } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ThemeToggle } from "./ThemeToggle";

export default function StudentChatbot() {
  // 🎯 States
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isChatStarted, setIsChatStarted] = useState<
    false | "student" | "learner" | "business" | "partner"
  >(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [listening, setListening] = useState(false);
  const [speakingEnabled, setSpeakingEnabled] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // 🧭 Auto scroll
  useEffect(() => {
    if (!scrollAreaRef.current) return;
    const el = scrollAreaRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages]);
  // 🔊 Load available voices on page load
useEffect(() => {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}, []);


  // 🧠 Text-to-Speech (bot voice)
 // 🧠 Text-to-Speech (Improved voice)
const speak = (text: string) => {
  if (!speakingEnabled || !text) return;

  // 🧹 Remove emojis and non-speech-friendly chars
  const cleanText = text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uFE0F)/g,
    ""
  );

  const utter = new SpeechSynthesisUtterance(cleanText.trim());
  utter.rate = 0.95; // Slightly slower for clarity
  utter.pitch = 1;
  utter.lang = "en-IN";

  // 🎙️ Prefer Indian Male voice if available
  const voices = window.speechSynthesis.getVoices();
  const indianMaleVoice =
    voices.find((v) =>
      /India/i.test(v.name) && /Male/i.test(v.name)
    ) ||
    voices.find((v) =>
      /Google हिन्दी|Google Indian English/i.test(v.name)
    ) ||
    voices.find((v) => /en-IN/i.test(v.lang));

  if (indianMaleVoice) utter.voice = indianMaleVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
};


  // 🎙️ Voice Input (speech → text)
  // const toggleListening = () => {
  //   if (listening) {
  //     recognitionRef.current?.stop();
  //     setListening(false);
  //     return;
  //   }

  //   const SpeechRecognition =
  //     (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  //   if (!SpeechRecognition) {
  //     alert("Speech recognition not supported in this browser.");
  //     return;
  //   }

  //   const rec = new SpeechRecognition();
  //   rec.lang = "en-IN";
  //   rec.interimResults = false;
  //   rec.maxAlternatives = 1;

  //   rec.onresult = (e: any) => {
  //     const transcript = e.results[0][0].transcript;
  //     handleSendMessage(transcript);
  //   };

  //   rec.onend = () => setListening(false);
  //   recognitionRef.current = rec;
  //   rec.start();
  //   setListening(true);
  // };

  // 🎙️ Voice Input (speech → text)
const toggleListening = () => {
  if (listening) {
    recognitionRef.current?.stop();
    setListening(false);
    return;
  }

  // 📢 Play tudung sound when mic starts
  const startSound = new Audio("/tudung.mp3");
  startSound.play().catch(() => {});

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const rec = new SpeechRecognition();
  rec.lang = "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onresult = (e: any) => {
    const transcript = e.results[0][0].transcript;
    handleSendMessage(transcript);
  };

  rec.onend = () => setListening(false);
  recognitionRef.current = rec;
  rec.start();
  setListening(true);
};


//   // 💬 Option click handler
//   useEffect(() => {
//     const handler = (e: any) => {
//       const value = e.detail;

//       // ✅ Only student needs email check
//       if (isChatStarted === "student" && (!studentEmail || !studentEmail.trim())) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `missing-${Date.now()}`,
//             sender: "bot",
//             type: "error",
//             title: "Missing Email",
//             message: "⚠️ Please start chat with your email first.",
//           },
//         ]);
//         return;
//       }

//       // 🧠 FAQ menu click
//      // 📧 Contact Us — custom handler
// if (value === "faq_menu_All" || value.toLowerCase().includes("contact")) {
//   const contactMsg = {
//     id: `contact-${Date.now()}`,
//     sender: "bot",
//     type: "text",
//     title: "Get in Touch 💌",
//     message: `

//       <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 rounded-xl p-4 shadow-sm'>
//   <div class='text-base font-semibold flex items-center gap-2'>
//     💌 We’d love to hear from you!
//   </div>
//   <p class='text-[14px] text-gray-600 dark:text-gray-300'>
//     Our support team will respond within a few hours. Click below to reach us directly:
//   </p>
//   <a
//     href="mailto:join-zuvy@navgurukul.org"
//     class='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all focus:outline-none focus:ring-2 focus:ring-green-300'
//   >
//     📩 Email Our Team
//     <span class="text-xs opacity-90">join-zuvy@navgurukul.org</span>
//   </a>
// </div>

//     `,
//   };
//   setMessages((prev) => [...prev, contactMsg]);

//   if (speakingEnabled)
//     speak("You can reach our team anytime at join zuvy at nav gurukul dot org.");
//   return; // 🚫 stop here — don’t call backend
// }

// // 🧠 FAQ menu click
// if (value.startsWith("faq_menu_")) {
//   handleSendMessage(value);
//   return;
// }
// // 🎥 LMS Role Selection (Student, Admin, Instructor, or Others)
// // if (value && value.startsWith("lms_role_")) {
// //   let videoId = "";
// //   let roleLabel = "";

// //   switch (value) {
// //     case "lms_role_student":
// //       roleLabel = "Students";
// //       videoId = "slc6uL_ESoo"; // 🧩 YouTube video ID for Student
// //       break;
// //     case "lms_role_admin":
// //       roleLabel = "Admins";
// //       videoId = "rqzI4ZFLqXo"; // 🧩 YouTube video ID for Admin
// //       break;
// //     case "lms_role_instructor":
// //       roleLabel = "Instructors";
// //       videoId = "brmzOPxnHgE"; // 🧩 YouTube video ID for Instructor
// //       break;
// //     case "lms_role_other":
// //       // 💌 Contact Message
// //       const contactMsg = {
// //         id: `contact-${Date.now()}`,
// //         sender: "bot",
// //         type: "text",
// //         title: "💌 Want to Explore Something Else?",
// //         message: `
// //           <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm'>
// //             <div class='text-base font-semibold'>🪄 We'd love to hear your use case!</div>
// //             <p class='text-sm text-gray-600 dark:text-gray-300'>
// //               Drop us an email and our team will connect with you 💚
// //             </p>
// //             <a
// //               href="mailto:join-zuvy@navgurukul.org?subject=Exploring%20Other%20LMS%20Solutions"
// //               class='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all'
// //             >
// //               📩 Email Our Team
// //             </a>
// //           </div>
// //         `,
// //       };
// //       setMessages((prev) => [...prev, contactMsg]);
// //       if (speakingEnabled)
// //         speak("You can email our team at join zuvy at nav gurukul dot org to explore other LMS options.");
// //       return;
// //   }

// //   if (!videoId) return;

// //   const embedUrl = `https://www.youtube.com/embed/${videoId}`;
// //   const youtubeUrl = `https://youtu.be/${videoId}`;

// //   const videoMsg = {
// //     id: `video-${Date.now()}`,
// //     sender: "bot",
// //     type: "text",
// //     title: `🎥 LMS Demo for ${roleLabel}`,
// //     message: `
// //       <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm'>
// //         <iframe
// //           width="100%"
// //           height="200"
// //           src="${embedUrl}"
// //           frameborder="0"
// //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //           allowfullscreen
// //           class="rounded-lg shadow-md"
// //         ></iframe>
// //         <p class='text-sm text-gray-600 dark:text-gray-300'>
// //           Learn more about LMS features for ${roleLabel}.
// //         </p>
// //         <div class='flex gap-3'>
// //           <a
// //             href="${youtubeUrl}"
// //             target="_blank"
// //             class='px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm shadow hover:shadow-lg hover:scale-[1.03] transition-all'
// //           >
// //             ▶️ Watch on YouTube
// //           </a>
// //           <a
// //             href="mailto:join-zuvy@navgurukul.org?subject=Interested%20in%20LMS%20for%20${encodeURIComponent(roleLabel)}"
// //             class='px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow hover:shadow-lg hover:scale-[1.03] transition-all'
// //           >
// //             💌 Contact Us
// //           </a>
// //         </div>
// //       </div>
// //     `,
// //   };

// //   setMessages((prev) => [...prev, videoMsg]);
// //   if (speakingEnabled)
// //     speak(`Here’s an overview of the LMS for ${roleLabel}.`);
// //   return;
// // }
// // 🎥 LMS Role Selection (Student, Admin, Instructor, or Others)
// if (value && value.startsWith("lms_role_")) {
//   let videoId = "";
//   let roleLabel = "";

//   switch (value) {
//     case "lms_role_student":
//       roleLabel = "Students";
//       videoId = "slc6uL_ESoo"; // 🧩 YouTube video ID for Student
//       break;
//     case "lms_role_admin":
//       roleLabel = "Admins";
//       videoId = "rqzI4ZFLqXo"; // 🧩 YouTube video ID for Admin
//       break;
//     case "lms_role_instructor":
//       roleLabel = "Instructors";
//       videoId = "brmzOPxnHgE"; // 🧩 YouTube video ID for Instructor
//       break;
//     case "lms_role_other":
//       const contactMsg = {
//         id: `contact-${Date.now()}`,
//         sender: "bot",
//         type: "text",
//         title: "💌 Want to Explore Something Else?",
//         message: `
//           <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm'>
//             <div class='text-base font-semibold'>🪄 We'd love to hear your use case!</div>
//             <p class='text-sm text-gray-600 dark:text-gray-300'>
//               Drop us an email and our team will connect with you 💚
//             </p>
//             <a
//               href="mailto:join-zuvy@navgurukul.org?subject=Exploring%20Other%20LMS%20Solutions"
//               class='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all'
//             >
//               📩 Email Our Team
//             </a>
//           </div>
//         `,
//       };
//       setMessages((prev) => [...prev, contactMsg]);
//       if (speakingEnabled)
//         speak("You can email our team at join zuvy at nav gurukul dot org to explore other LMS options.");
//       return; // ✅ end for 'others'
//   }

//   if (!videoId) return;

//   const embedUrl = `https://www.youtube.com/embed/${videoId}`;
//   const youtubeUrl = `https://youtu.be/${videoId}`;

//   const videoMsg = {
//     id: `video-${Date.now()}`,
//     sender: "bot",
//     type: "text",
//     title: `🎥 LMS Demo for ${roleLabel}`,
//     message: `
//       <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm'>
//         <iframe
//           width="100%"
//           height="200"
//           src="${embedUrl}"
//           frameborder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowfullscreen
//           class="rounded-lg shadow-md"
//         ></iframe>
//         <p class='text-sm text-gray-600 dark:text-gray-300'>
//           Learn more about LMS features for ${roleLabel}.
//         </p>
//         <div class='flex gap-3'>
//           <a
//             href="${youtubeUrl}"
//             target="_blank"
//             class='px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm shadow hover:shadow-lg hover:scale-[1.03] transition-all'
//           >
//             ▶️ Watch on YouTube
//           </a>
//           <a
//             href="mailto:join-zuvy@navgurukul.org?subject=Interested%20in%20LMS%20for%20${encodeURIComponent(roleLabel)}"
//             class='px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow hover:shadow-lg hover:scale-[1.03] transition-all'
//           >
//             💌 Contact Us
//           </a>
//         </div>
//       </div>
//     `,
//   };

//   setMessages((prev) => [...prev, videoMsg]);
//   if (speakingEnabled)
//     speak(`Here’s an overview of the LMS for ${roleLabel}.`);

//   return; // ✅ close LMS block
// } // 👈 this closing bracket is critical!


//       // 💡 Ask anything
//       if (value === "faq" || value === "faq_query") {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `faq-${Date.now()}`,
//             sender: "bot",
//             type: "text",
//             title: "💡 Ask a question",
//             message:
//               "You can ask anything about Bootcamps, LMS or Partnerships. Type below 👇",
//           },
//         ]);
//         setTimeout(() => inputRef.current?.focus(), 100);
//         return;
//       }

//       handleSendMessage(value);
//     };

//     window.addEventListener("sendMessage", handler);
//     return () => window.removeEventListener("sendMessage", handler);
//   }, [studentEmail, isChatStarted]);
useEffect(() => {
  const handler = (e: any) => {
    const value = e.detail;

    // ✅ Only student needs email check
    if (isChatStarted === "student" && (!studentEmail || !studentEmail.trim())) {
      setMessages((prev) => [
        ...prev,
        {
          id: `missing-${Date.now()}`,
          sender: "bot",
          type: "error",
          title: "Missing Email",
          message: "⚠️ Please start chat with your email first.",
        },
      ]);
      return;
    }

    // 🥇 1️⃣ CONTACT US — top priority
    if (value === "faq_menu_All" || value.toLowerCase().includes("contact")) {
      const contactMsg = {
        id: `contact-${Date.now()}`,
        sender: "bot",
        type: "text",
        title: "Get in Touch 💌",
        message: `
          <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 rounded-xl p-4 shadow-sm'>
            <div class='text-base font-semibold flex items-center gap-2'>
              💌 We’d love to hear from you!
            </div>
            <p class='text-[14px] text-gray-600 dark:text-gray-300'>
              Our support team will respond within a few hours. Click below to reach us directly:
            </p>
            <a
              href="mailto:join-zuvy@navgurukul.org"
              class='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all focus:outline-none focus:ring-2 focus:ring-green-300'
            >
              📩 Email Our Team
              <span class="text-xs opacity-90">join-zuvy@navgurukul.org</span>
            </a>
          </div>
        `,
      };
      setMessages((prev) => [...prev, contactMsg]);
      if (speakingEnabled)
        speak("You can reach our team anytime at join zuvy at nav gurukul dot org.");
      return; // stop here
    }

    // 🥈 2️⃣ LMS ROLE HANDLING
    if (value && value.startsWith("lms_role_")) {
      let videoId = "";
      let roleLabel = "";

      switch (value) {
        case "lms_role_student":
          roleLabel = "Students";
          videoId = "slc6uL_ESoo";
          break;
        case "lms_role_admin":
          roleLabel = "Admins";
          videoId = "rqzI4ZFLqXo";
          break;
        case "lms_role_instructor":
          roleLabel = "Instructors";
          videoId = "brmzOPxnHgE";
          break;
        case "lms_role_other":
          const contactMsg = {
            id: `contact-${Date.now()}`,
            sender: "bot",
            type: "text",
            title: "💌 Want to Explore Something Else?",
            message: `
              <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm'>
                <div class='text-base font-semibold'>🪄 We'd love to hear your use case!</div>
                <p class='text-sm text-gray-600 dark:text-gray-300'>
                  Drop us an email and our team will connect with you 💚
                </p>

                <a
                  href="mailto:join-zuvy@navgurukul.org?subject=Exploring%20Other%20LMS%20Solutions"
                  class='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all'
                >
                  📩 Email Our Team
                </a>
              </div>
            `,
          };
          setMessages((prev) => [...prev, contactMsg]);
          if (speakingEnabled)
            speak("You can email our team at join zuvy at nav gurukul dot org to explore other LMS options.");
          return;
      }

      if (!videoId) return;

      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const youtubeUrl = `https://youtu.be/${videoId}`;

      const videoMsg = {
        id: `video-${Date.now()}`,
        sender: "bot",
        type: "text",
        title: `🎥 LMS Demo for ${roleLabel}`,
        message: `
        <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-green-200 dark:border-gray-700 rounded-xl p-4 shadow-sm'>

          <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm'>
            <iframe
              width="100%"
              height="200"
              src="${embedUrl}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="rounded-lg shadow-md"
            ></iframe>
           <div class='text-center w-full'>
  <p class='text-[15px] font-medium text-gray-800 dark:text-gray-100 mt-2'>
    Explore the best features of Zuvy LMS — designed specially for <span class='text-green-600 dark:text-green-400 font-semibold'>${roleLabel}</span> 🚀
  </p>
</div>

<div class='flex flex-wrap justify-center gap-3 mt-4 w-full'>
  <a
    href="${youtubeUrl}"
    target="_blank"
    class='flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300'
  >
    <span class="text-base">▶️</span>
    <span>Watch on YouTube</span>
  </a>
  <a
    href="mailto:join-zuvy@navgurukul.org?subject=Interested%20in%20LMS%20for%20${encodeURIComponent(roleLabel)}"
    class='flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300'
  >
    <span class="text-base">💌</span>
    <span>Contact Us</span>
  </a>
</div>

  

          </div>
        `,
      };

      setMessages((prev) => [...prev, videoMsg]);
      if (speakingEnabled)
        speak(`Here’s an overview of the LMS for ${roleLabel}.`);
      return;
    }

    // 🥉 3️⃣ FAQ MENUS (Bootcamps, Partnerships, Learners)
    if (value.startsWith("faq_menu_")) {
      handleSendMessage(value);
      return;
    }
    // 💬 If user clicks “Anything else?”
if (value === "show_more_faqs") {
  const remaining = (window as any)._remainingFAQs || [];

  if (remaining.length === 0) {
    setMessages((prev) => [
      ...prev,
      {
        id: `no-more-${Date.now()}`,
        sender: "bot",
        type: "text",
        message: "That’s all for now! You can ask another question anytime 💬",
      },
    ]);
    return;
  }

  setMessages((prev) => [
    ...prev,
    {
      id: `more-${Date.now()}`,
      sender: "bot",
      type: "options",
      title: "More FAQs for you 👇",
      message: "Here are more helpful questions:",
      options: remaining,
    },
  ]);

  // 🧹 Clear memory after showing
  (window as any)._remainingFAQs = [];
  return;
}


    // 🏁 4️⃣ ASK ANYTHING — generic fallback
    if (value === "faq" || value === "faq_query") {
      setMessages((prev) => [
        ...prev,
        {
          id: `faq-${Date.now()}`,
          sender: "bot",
          type: "text",
          title: "💡 Ask a question",
          message:
            "You can ask anything about Bootcamps, LMS or Partnerships. Type below 👇",
        },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    // 🚀 DEFAULT fallback
    handleSendMessage(value);
  };

  window.addEventListener("sendMessage", handler);
  return () => window.removeEventListener("sendMessage", handler);
}, [studentEmail, isChatStarted]);


  // 🎓 Start chat for learner
  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail) {
      alert("Please enter both name and email.");
      return;
    }
    setIsChatStarted("student");
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        type: "options",
        title: `Hi ${studentName}! 👋`,
        message: "Welcome back! Choose an option 👇",
        options: [
          { label: "📚 Attendance", value: "attendance_menu" },
          { label: "🧾 Assessments", value: "assessment_menu" },
          { label: "💡 FAQs", value: "faq_menu_Existing Learner" },
        ],
      },
    ]);
  };

  // 🛰️ Send message to backend
//   const handleSendMessage = async (text: string) => {
//     if (!text) return;
//     setMessages((prev) => [
//       ...prev,
//       { id: `u-${Date.now()}`, sender: "user", type: "text", message: text },
//       { id: `t-${Date.now()}`, sender: "bot", type: "typing", message: "/Chat.mp4" },
//     ]);

//     try {
//       const res = await fetch("http://localhost:5000/query", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: studentName || "Visitor",
//           email: studentEmail || "",
//           text,
//         }),
//       });
//       const data = await res.json();
//       // 🚫 If backend returned "Not Found", blank, or error — stop it right here
// if (
//   !data?.message ||
//   data.message.trim() === "" ||
//   data.message.toLowerCase().includes("not found")
// ) {
//   data.message = ""; // blank it so nothing shows
// }

// setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));

// // 🧠 Check what backend replied
// const botMsg = (data?.message || "").trim().toLowerCase();

// // ❌ If backend said "not found" or empty
// // if (!botMsg || botMsg.includes("not found")) {
// //   const friendlyMessage = {
// //     id: `fallback-${Date.now()}`,
// //     sender: "bot",
// //     type: "text",
// //     title: "We’re here to help!",
// //     message: `
// //       <div class="text-[15px] leading-relaxed">
// //         I couldn’t find an answer to that just now 🤔<br />
// //         But no worries — our team is here for you! 💚<br /><br />
// //         You can reach us anytime at 
// //         <a href="mailto:join-zuvy@navgurukul.org"
// //            class="text-green-600 font-semibold underline hover:text-green-700 transition">
// //            join-zuvy@navgurukul.org
// //         </a> 💌
// //       </div>
// //     `,
// //   };

// //   // 👇 Add this message in chat
// //   setMessages((prev) => [...prev, friendlyMessage]);

// //   // 🎙️ Voice output
// //   if (speakingEnabled)
// //     speak(
// //       "I couldn’t find an answer right now, but no worries — our team is here for you. You can reach us anytime at join zuvy at nav gurukul dot org."
// //     );

// //   return; // 🚫 Stop here
// // }
// if (!botMsg || botMsg.includes("not found")) {
//   const friendlyMessage = {
//     id: `fallback-${Date.now()}`,
//     sender: "bot",
//     type: "text",
//     title: "We’re here to help!",
//     message:
//       "I couldn’t find an answer to that just now 🤔 But no worries — our team is here for you! 💚 You can reach us anytime at join-zuvy@navgurukul.org 💌",
//   };

//   setMessages((prev) => [...prev, friendlyMessage]);
//   if (speakingEnabled)
//     speak(
//       "I couldn’t find an answer right now, but no worries — our team is here for you. You can reach us anytime at join zuvy at nav gurukul dot org."
//     );
//   return;
// }


// // ✅ Otherwise show normal bot message
// // setMessages((prev) => [
// //   ...prev,
// //   { id: `b-${Date.now()}`, sender: "bot", ...data },
// // ]);
// // ✅ Show normal bot message only if message is valid
// if (data.message && !data.message.toLowerCase().includes("not found")) {
//   setMessages((prev) => [
//     ...prev,
//     { id: `b-${Date.now()}`, sender: "bot", ...data },
//   ]);

//   if (speakingEnabled) {
//     if (data.voiceText) speak(data.voiceText);
//     else speak(data.message);
//   }
// }


// if (speakingEnabled) {
//   if (data.voiceText) speak(data.voiceText);
//   else speak(data.message);
// }


//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `err-${Date.now()}`,
//           sender: "bot",
//           type: "error",
//           message:
//             "⚠️ Something went wrong. Try again or email join-zuvy@navgurukul.org",
//         },
//       ]);
//       speak("Something went wrong. Please try again later.");
//     }
//   };
// const handleSendMessage = async (text: string) => {
//   if (!text) return;

//   // Show user message + typing animation
//   setMessages((prev) => [
//     ...prev,
//     { id: `u-${Date.now()}`, sender: "user", type: "text", message: text },
//     { id: `t-${Date.now()}`, sender: "bot", type: "typing", message: "/Chat.mp4" },
//   ]);

//   try {
//     const res = await fetch("http://localhost:5000/query", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: studentName || "Visitor",
//         email: studentEmail || "",
//         text,
//       }),
//     });

//     const data = await res.json();
//     const botMsg = (data?.message || data?.voiceText || "").trim().toLowerCase();

//     // Remove typing bubble
//     setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));

//     // 🧠 Handle Not Found or Blank Message
//     // if (!botMsg || botMsg.includes("not found") || botMsg === "sorry") {
//     //   const fallbackMsg = {
//     //     id: `fallback-${Date.now()}`,
//     //     sender: "bot",
//     //     type: "text",
//     //     title: "We’re here to help!",
//     //     message:
//     //       "I couldn’t find an answer right now 🤔 But no worries — our team is here for you 💚 You can reach us anytime at join-zuvy@navgurukul.org 💌",
//     //   };
//     //   setMessages((prev) => [...prev, fallbackMsg]);

//     //   if (speakingEnabled) {
//     //     speak(
//     //       "I couldn’t find an answer right now, but no worries — our team is here for you. You can reach us anytime at join zuvy at nav gurukul dot org."
//     //     );
//     //   }
//     //   return;
//     // }
//     // 🧠 Handle Not Found or Blank Message
// if (!botMsg || botMsg.includes("not found") || botMsg === "sorry") {
//   const fallbackMsg = {
//     id: `fallback-${Date.now()}`,
//     sender: "bot",
//     type: "text",
//     title: "We’re here to help!",
//     message: `
//       <div class="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100">
//         <div>🤖 Hmm... I couldn’t find an exact answer to that right now.</div>
//         <div>No worries — our support team is always happy to help! 💚</div>
//         <button
//           onclick="window.location.href='mailto:join-zuvy@navgurukul.org'"
//           class="inline-block w-fit self-start px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
//         >
//           📩 Contact Support
//         </button>
//       </div>
//     `,
//   };
//   setMessages((prev) => [...prev, fallbackMsg]);

//   if (speakingEnabled) {
//     speak(
//       "Hmm, I couldn’t find an exact answer right now. But don’t worry — our support team is always ready to help you!"
//     );
//   }
//   return;
// }


//     // ✅ Show Normal Bot Message
//     const cleanMessage = data.message || data.voiceText || "I'm here to help!";
//     setMessages((prev) => [
//       ...prev,
//       { id: `b-${Date.now()}`, sender: "bot", type: "text", message: cleanMessage },
//     ]);

//     if (speakingEnabled) speak(cleanMessage);
//   } catch (error) {
//     console.error(error);
//     setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: `err-${Date.now()}`,
//         sender: "bot",
//         type: "error",
//         message:
//           "⚠️ Something went wrong. Try again or email join-zuvy@navgurukul.org",
//       },
//     ]);
//     speak("Something went wrong. Please try again later.");
//   }
// };
const handleSendMessage = async (text: string) => {
  if (!text) return;

  // Show user message + typing animation
  setMessages((prev) => [
    ...prev,
    { id: `u-${Date.now()}`, sender: "user", type: "text", message: text },
    { id: `t-${Date.now()}`, sender: "bot", type: "typing", message: "/Chat.mp4" },
  ]);

  try {
    // const res = await fetch("http://localhost:5000/query", {
     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: studentName || "Visitor",
        email: studentEmail || "",
        text,
      }),
    });

    const data = await res.json();

    // remove typing
    setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));

    const botMsg = (data?.message || "").trim().toLowerCase();

    // 🧠 If no data or not found — fallback
    if (!botMsg || botMsg.includes("not found") || botMsg.includes("please email")) {
      const fallbackMsg = {
        id: `fallback-${Date.now()}`,
        sender: "bot",
        type: "text",
        title: "We’re here to help!",
        message: `

          <div class='flex flex-col items-start gap-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 rounded-xl p-4 shadow-sm'>
  <div class='text-base font-semibold flex items-center gap-2'>
    Hmm... I couldn’t find an exact answer to that right now.
  </div>
  <p class='text-[14px] text-gray-600 dark:text-gray-300'>
    But no worries — our support team is always happy to help you! 💚  
    Click below to reach us directly:
  </p>
  <a
    href="mailto:join-zuvy@navgurukul.org"
    class='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all focus:outline-none focus:ring-2 focus:ring-green-300'
  >
    📩 Contact Support Team
    <span class="text-xs opacity-90">join-zuvy@navgurukul.org</span>
  </a>
</div>

        `,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (speakingEnabled)
        speak("Hmm, I couldn’t find an exact answer right now. But no worries — our support team is happy to help you!");
      return;
    }

    // ✅ OTHERWISE: normal bot data
    // handle all structured message types from backend (faq, options, table, etc.)
    // const botResponse = {
    //   id: `b-${Date.now()}`,
    //   sender: "bot",
    //   type: data.type || "text",
    //   title: data.title || "",
    //   message: data.message || "",
    //   options: data.options || [],
    //   fields: data.fields || [],
    //   data: data.data || {},
    // };

    // setMessages((prev) => [...prev, botResponse]);
    // ✅ Otherwise: normal bot data (with limited FAQs)
if (Array.isArray(data.options) && data.options.length > 0) {
  // 🌟 Show only 3 FAQs first
  const firstThree = data.options.slice(0, 3);
  const remaining = data.options.slice(3);

  // 🧩 Add “Anything else?” button if more than 3
  const limitedOptions =
    remaining.length > 0
      ? [...firstThree, { label: "💬 Anything else?", value: "show_more_faqs" }]
      : firstThree;

  const botResponse = {
    id: `b-${Date.now()}`,
    sender: "bot",
    type: "options",
    title: data.title || "",
    message: data.message || "",
    options: limitedOptions,
  };

  setMessages((prev) => [...prev, botResponse]);

  // 🗣️ Voice output
  if (speakingEnabled) speak(data.voiceText || data.message);

  // 💡 Save remaining FAQs for later (optional memory)
  (window as any)._remainingFAQs = remaining;
} else {
  // 🔸 Normal text message
  const botResponse = {
    id: `b-${Date.now()}`,
    sender: "bot",
    type: data.type || "text",
    title: data.title || "",
    message: data.message || "",
  };
  setMessages((prev) => [...prev, botResponse]);
  if (speakingEnabled) speak(data.voiceText || data.message);
}


    if (speakingEnabled) speak(data.voiceText || data.message);
  } catch (err) {
    console.error(err);
    setMessages((prev) => prev.filter((m) => !`${m.id}`.startsWith("t-")));
    setMessages((prev) => [
      ...prev,
      {
        id: `err-${Date.now()}`,
        sender: "bot",
        type: "error",
        message:
          "⚠️ Something went wrong. Try again or email join-zuvy@navgurukul.org",
      },
    ]);
    speak("Something went wrong. Please try again later.");
  }
};

  // 🌟 Save lead
  async function saveLeadToServer(name: string, email: string) {
    const res = await fetch("http://localhost:5000/save-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, source: "chatbot" }),
    });
    if (!res.ok) throw new Error("Failed to save lead");
    return res.json();
  }

  // 🌱 Inline lead form
  const lastBot = messages.slice().reverse().find((m) => m.sender === "bot");
  const showLeadInline = lastBot && lastBot.type === "lead_form";

  return (
    <div className="flex flex-col h-[85vh] max-w-2xl mx-auto rounded-3xl shadow-2xl border border-border bg-card/60 backdrop-blur-lg transition-all duration-300 hover:shadow-[var(--shadow-xl)]">
      {/* 🚀 Start Screen */}
      {!isChatStarted && (
        <div className="flex flex-col justify-center items-center flex-1 p-10 gap-8 animate-fade-in">
          <img
            src="/robot_transparent_background.png"
            alt="Zuvy Logo"
            className="w-20 h-20 animate-slide-up object-contain"
          />
          <h2 className="text-2xl font-bold text-center">Welcome to Zuvy Buddy</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            How can I help you today? 👇
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            <button
              onClick={() => setIsChatStarted("student")}
              className="gradient-primary p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-[var(--shadow-glow)] transform hover:-translate-y-1 transition-all duration-300"
            >
              🎓 I'm an Existing Learner
            </button>
            <button
              onClick={() => {
                setIsChatStarted("learner");
                setMessages([
                  {
                    id: "bootcamp",
                    sender: "bot",
                    type: "options",
                    title: "💻 Explore Zuvy Bootcamps",
                    message:
                      "Hands-on programs in Full-Stack & DSA with placement support 👇",
                    options: [
                      { label: "📘 Bootcamp FAQs", value: "faq_menu_Explore Bootcamps" },
                      { label: "📧 Contact Us", value: "faq_menu_All" },
                    ],
                  },
                ]);
              }}
              className="gradient-success p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-[var(--shadow-glow)] transform hover:-translate-y-1 transition-all duration-300"
            >
              💻 I want to Explore Bootcamps
            </button>
            <button
  onClick={() => {
    setIsChatStarted("business");
    setMessages([
      {
        id: "business",
        sender: "bot",
        type: "options",
        title: "🏢 LMS Solutions",
        message: "Choose your role to explore LMS 👇",
        options: [
          { label: "🎓 As a Student", value: "lms_role_student" },
          { label: "🧑‍💼 As an Admin", value: "lms_role_admin" },
          { label: "👨‍🏫 As an Instructor", value: "lms_role_instructor" },
          { label: "🪄 Others / Want to Explore Something Else", value: "lms_role_other" },
        ],
      },
    ]);
  }}
  className="w-full text-left whitespace-normal break-words px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300"

  // className="bg-gradient-to-r from-sky-500 to-cyan-400 p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
>
  🏢 I'm Exploring LMS Solutions
</button>

               
 
            
            <button
              onClick={() => {
                setIsChatStarted("partner");
                setMessages([
                  {
                    id: "partner",
                    sender: "bot",
                    type: "options",
                    title: "🤝 Partnerships",
                    message:
                      "For CSR Partners, Employers & Impact Collaborations 👇",
                    options: [
    { label: "📘 Partnership FAQs", value: "faq_menu_Partnerships" },
    { label: "📧 Contact Us", value: "faq_menu_All" },
                  ]  },
                ]);
              }}
              className="bg-gradient-to-r from-primary/80 to-primary p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-[var(--shadow-glow)] transform hover:-translate-y-1 transition-all duration-300"
            >
              🤝 I'm Interested in Partnerships
            </button>
          </div>
        </div>
      )}

      {/* 🧍 Student Login Form */}
      {isChatStarted === "student" && !messages.length && (
        <form
          onSubmit={handleStartChat}
          className="flex flex-col justify-center items-center flex-1 p-8 gap-6"
        >
          <img
            src="/robot_transparent_background.png"
            alt="Zuvy Logo"
            className="w-10 h-10 object-contain"
          />
          <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Enter your details to continue.
          </p>

          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full pl-10 border border-input bg-background p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full pl-10 border border-input bg-background p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!studentName || !studentEmail}
              className="gradient-primary text-white p-3 rounded-xl hover:shadow-[var(--shadow-glow)] transition disabled:opacity-50"
            >
              Start Chat
            </button>
          </div>
        </form>
      )}

      {/* 💬 Chat UI */}
      {isChatStarted && messages.length > 0 && (
        <>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border rounded-t-3xl p-4 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <img
                src="/robot_transparent_background.png"
                alt="Zuvy Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold">Zuvy Buddy</h1>
                <p className="text-xs text-muted-foreground">Your AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all duration-300 ${
                  listening
                    ? "bg-destructive text-destructive-foreground shadow-md scale-110"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Mic size={18} />
              </button>
              <button
                onClick={() => setSpeakingEnabled(!speakingEnabled)}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-all duration-300"
              >
                {speakingEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <ThemeToggle />
            </div>
          </div>

          <Card className="flex-1 flex flex-col border-x border-border rounded-none bg-card/50 backdrop-blur-sm">
            <div
              ref={scrollAreaRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ maxHeight: "calc(85vh - 180px)" }}
            >
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isBot={msg.sender === "bot"}
                />
              ))}
              <div id="scroll-anchor" />
            </div>

            {/* Inline Lead Form */}
            {showLeadInline && (
              <div className="p-3 border-t bg-muted/20 rounded-lg mb-2">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const fname = (form.elements.namedItem("visitor_name") as HTMLInputElement)
                      .value;
                    const femail = (form.elements.namedItem("visitor_email") as HTMLInputElement)
                      .value;
                    if (!fname || !femail) {
                      alert("Please enter both name and email.");
                      return;
                    }
                    await saveLeadToServer(fname, femail);
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `lead-saved-${Date.now()}`,
                        sender: "bot",
                        type: "text",
                        message:
                          "🎉 Thanks! Your details are saved. You can reach us at join-zuvy@navgurukul.org",
                      },
                    ]);
                    form.reset();
                  }}
                >
                  <div className="flex gap-2">
                    <input
                      name="visitor_name"
                      placeholder="Your name"
                      className="flex-1 p-2 rounded-md border border-input bg-background"
                    />
                    <input
                      name="visitor_email"
                      placeholder="Your email"
                      type="email"
                      className="flex-1 p-2 rounded-md border border-input bg-background"
                    />
                    <button className="px-3 py-2 gradient-primary text-white rounded-md">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* <div className="p-3 border-t">
              <ChatInput onSendMessage={handleSendMessage} ref={inputRef} />
            </div> */}
            {/* 🎤 Bottom Control Bar */}
<div className="p-3 border-t flex items-center justify-between">
  <div className="flex items-center gap-3">
    {/* Mic Button */}
    <button
      onClick={toggleListening}
      className={`p-3 rounded-full transition-all duration-300 ${
        listening
          ? "bg-red-500 text-white animate-pulse shadow-md scale-110"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      <Mic size={20} />
    </button>

    {/* Mute / Unmute */}
    <button
      onClick={() => setSpeakingEnabled(!speakingEnabled)}
      className={`p-3 rounded-full transition-all duration-300 ${
        speakingEnabled
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-gray-300 text-gray-600"
      }`}
    >
      {speakingEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  </div>

  {/* Chat Input */}
  <div className="flex-1 ml-3">
    <ChatInput onSendMessage={handleSendMessage} ref={inputRef} />
  </div>
</div>

          </Card>
        </>
      )}
    </div>
  );
}
