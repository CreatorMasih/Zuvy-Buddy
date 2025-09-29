// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Send } from "lucide-react";
// // import { cn } from "@/lib/utils";

// // interface ChatInputProps {
// //   onSendMessage: (message: string) => void;
// //   disabled?: boolean;
// //   placeholder?: string;
// // }

// // const ChatInput = ({ 
// //   onSendMessage, 
// //   disabled = false, 
// //   placeholder = "Ask me about your attendance, scores, or schedules..." 
// // }: ChatInputProps) => {
// //   const [message, setMessage] = useState("");

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (message.trim() && !disabled) {
// //       onSendMessage(message.trim());
// //       setMessage("");
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="flex gap-3 p-4 bg-card rounded-t-2xl border-t border-border">
// //       <Input
// //         value={message}
// //         onChange={(e) => setMessage(e.target.value)}
// //         placeholder={placeholder}
// //         disabled={disabled}
// //         className={cn(
// //           "flex-1 bg-background border-border focus:ring-primary transition-all duration-200",
// //           "placeholder:text-muted-foreground"
// //         )}
// //       />
// //       <Button 
// //         type="submit" 
// //         disabled={!message.trim() || disabled}
// //         size="icon"
// //         className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md"
// //       >
// //         <Send className="h-4 w-4" />
// //       </Button>
// //     </form>
// //   );
// // };

// // export default ChatInput;
// import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

// type Props = { onSendMessage: (text: string) => void };

// const ChatInput = forwardRef(({ onSendMessage }: Props, ref) => {
//   const [value, setValue] = useState("");
//   const inputEl = useRef<HTMLInputElement | null>(null);

//   useImperativeHandle(ref, () => ({
//     focus: () => inputEl.current?.focus(),
//   }));

//   const send = () => {
//     const t = value.trim();
//     if (!t) return;
//     onSendMessage(t);
//     setValue("");
//   };

//   return (
//     <div className="flex gap-2 items-center">
//       <input
//         ref={inputEl}
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             send();
//           }
//         }}
//         placeholder="Type your message and press Enter..."
//         className="flex-1 border rounded-xl px-3 py-2 bg-background text-foreground"
//       />
//       <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Send</button>
//     </div>
//   );
// });

// export default ChatInput;


// ChatInput.tsx
import React, { forwardRef, useRef, useImperativeHandle, useState } from "react";

type Props = {
  onSendMessage: (text: string) => void;
};

// Forward the native HTMLInputElement ref to parent
const ChatInput = forwardRef<HTMLInputElement, Props>(({ onSendMessage }, ref) => {
  const [value, setValue] = useState("");
  const internalRef = useRef<HTMLInputElement | null>(null);

  // expose the internal input element to the parent via forwarded ref
  useImperativeHandle(ref, () => internalRef.current as HTMLInputElement | null, [internalRef.current]);

  const send = () => {
    const t = value.trim();
    if (!t) return;
    onSendMessage(t);
    setValue("");
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        ref={internalRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Type your message and press Enter..."
        className="flex-1 border rounded-xl px-3 py-2 bg-background text-foreground"
        aria-label="Chat input"
      />
      <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded-xl">
        Send
      </button>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
