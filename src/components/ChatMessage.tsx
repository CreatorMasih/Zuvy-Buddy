import React from "react";
import { useTheme } from "next-themes"; // ✅ uncomment this line

/**
 * Safe getter that checks multiple possible keys and returns the first non-empty value.
 */
function safeGet(obj: any, keys: string[]) {
  if (!obj) return undefined;
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v !== undefined && v !== null && v !== "") return v;
    }
  }
  return undefined;
}

export default function ChatMessage({ message, isBot }: any) {
  // ✅ Add this inside the component
  const { theme } = useTheme();
  if (!message) return null;

  const type = message.type ?? "text";
  const title = message.title ?? "";
  const text = message.message ?? message.msg ?? message.text ?? "";

  // helper to dispatch option click
  const clickOption = (value: string) => {
    // if mailto open mail client
    if (value?.startsWith?.("mailto:")) {
      window.location.href = value;
      return;
    }
    window.dispatchEvent(new CustomEvent("sendMessage", { detail: value }));
  };

  // container classes
  const wrapper = isBot ? "items-start" : "items-end flex justify-end";

  // bubble styles
  const bubbleBase =
    "inline-block max-w-[86%] p-3 rounded-2xl break-words whitespace-pre-wrap";
  const botStyle =
    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700";
  const userStyle = "bg-green-600 text-white";

  return (
    <div className={`flex w-full ${wrapper} mb-2`}>
      <div className={isBot ? "mr-auto" : "ml-auto"}>
        {/* Title */}
        {title && (
          <div className="text-xs text-muted-foreground dark:text-gray-300 mb-1">
            {title}
          </div>
        )}

        {/* OPTIONS: buttons menu */}
        {type === "options" && (
          <div className={`${bubbleBase} ${botStyle}`}>
            <div className="mb-2 text-sm">{text}</div>
            <div className="flex flex-wrap gap-2">
              {(message.options ?? []).map((opt: any, i: number) => (
                <button
                  key={i}
                  onClick={() => clickOption(opt.value)}
                  className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700 transition"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {/* ATTENDANCE */}
{type === "attendance" && (
  <div className={`${bubbleBase} ${botStyle}`}>
    {/* Pretty formatted answer */}
    <div
      className="text-[15px] leading-relaxed"
      style={{ whiteSpace: "pre-line" }}
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // render **bold**
          .replace(/📈/g, "📈")
          .replace(/📉/g, "📉")
          .replace(/✅/g, "✅")
          .replace(/❌/g, "❌")
          .replace(/📊/g, "📊"),
      }}
    ></div>

    {/* Follow-up question buttons */}
    {Array.isArray(message.options) && message.options.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {message.options.map((opt: any, i: number) => (
          <button
            key={i}
            onClick={() => clickOption(opt.value)}
          //  className="px-3 py-1.5 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700 transition shadow-sm"
// className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-sm border border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 transition-all shadow-sm"
className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-sm border border-teal-200 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-100 dark:border-teal-700 dark:hover:bg-teal-800 transition-all shadow-sm"

>
            {opt.label}
          </button>
        ))}
      </div>
    )}
  </div>
)}

        {/* ASSESSMENT */}
        {/* {type === "assessment" && (
          <div className={`${bubbleBase} ${botStyle}`}>
            <div className="mb-2 text-sm">{text}</div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Qualified</div>
              <div>
                {safeGet(message.data, ["qualified", "Qualified"]) ?? "N/A"}
              </div>

              <div className="font-medium">Attendance (%)</div>
              <div>
                {safeGet(message.data, [
                  "percentage",
                  "Attendance (%)",
                  "Percentage (%) ",
                  "Percentage",
                ]) ?? "N/A"}
              </div>

              <div className="font-medium">Percentage</div>
              <div>
                {safeGet(message.data, [
                  "percentage",
                  "Percentage",
                  "Percentage (%) ",
                ]) ?? "N/A"}
              </div>

              <div className="font-medium">Coding Score</div>
              <div>
                {safeGet(message.data, ["codingScore", "Coding Score"]) ?? "N/A"}
              </div>

              <div className="font-medium">MCQ Score</div>
              <div>
                {safeGet(message.data, ["mcqScore", "MCQ Score"]) ?? "N/A"}
              </div>

              <div className="font-medium">Tab Changed</div>
              <div>
                {safeGet(message.data, ["tabChanged", "Tab Changed"]) ?? "N/A"}
              </div>

              <div className="font-medium">Copy Pasted</div>
              <div>
                {safeGet(message.data, ["copyPasted", "Copy Pasted"]) ?? "N/A"}
              </div>

              <div className="font-medium">Assessment No</div>
              <div>{safeGet(message.data, ["assessmentNo"]) ?? "N/A"}</div>
            </div>

            {Array.isArray(message.options) && message.options.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.options.slice(0, 8).map((opt: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => clickOption(opt.value)}
                    className="px-2 py-1 text-xs rounded bg-sky-600 text-white"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )} */}
{type === "assessment" && (
  // <div className={`${bubbleBase} ${botStyle}`}>
  //   {/* Title */}
  //   <div className="mb-3 text-base font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
  //     🧾 {text || "Assessment Summary"}
  //   </div>

  //   {/* Summary Card */}
  //   <div className="bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-800 rounded-xl p-3 mb-3">
  //     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
  //       <div className="text-gray-800 dark:text-gray-100 font-medium">
  //          {message.data?.name || "Unknown Student"}
  //       </div>

  //       {/* Qualified Badge */}
  //       {message.data?.qualified && (
  //         <div
  //           className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0 ${
  //             message.data.qualified.toString().toLowerCase().includes("yes")
  //               ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
  //               : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
  //           }`}
  //         >
  //           {message.data.qualified.toString().toLowerCase().includes("yes")
  //             ? "✅ Qualified"
  //             : "❌ Not Qualified"}
  //         </div>
  //       )}
  //     </div>
  //   </div>

  //   {/* Details Table */}
  //   <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
  //     <table className="w-full text-sm">
  //       <tbody>
  //         {[
  //           [
  //             "📊 Percentage",
  //             (() => {
  //               let val =
  //                 message.data?.percentage ||
  //                 message.data?.["Attendance (%)"] ||
  //                 message.data?.["Percentage (%) "] ||
  //                 message.data?.["Percentage"];
  //               if (typeof val === "string") val = parseFloat(val);
  //               if (!isNaN(val)) {
  //                 if (val <= 1) val = val * 100; // 0.85 → 85
  //                 return `${val.toFixed(2)}%`;
  //               }
  //               return "N/A";
  //             })(),
  //           ],
  //           ["Coding Score", message.data?.codingScore || "N/A"],
  //           ["MCQ Score", message.data?.mcqScore || "N/A"],
  //           ["Tab Changed", message.data?.tabChanged || "N/A"],
  //           ["Copy Pasted", message.data?.copyPasted || "N/A"],
  //           ["Assessment No", message.data?.assessmentNo || "N/A"],
  //         ]
  //           .filter(([_, value]) => value && value !== "N/A")
  //           .map(([label, value], i) => (
  //             <tr
  //               key={i}
  //               className="border-b border-gray-100 dark:border-gray-700 last:border-none"
  //             >
  //               <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-200">
  //                 {label}
  //               </td>
  //               <td className="py-2 px-3 text-right text-gray-800 dark:text-gray-100">
  //                 {value}
  //               </td>
  //             </tr>
  //           ))}
  //       </tbody>
  //     </table>
  //   </div>

  //   {/* Buttons */}
  //   {Array.isArray(message.options) && message.options.length > 0 && (
  //     <div className="mt-4 flex flex-wrap gap-2">
  //       {message.options.map((opt: any, i: number) => (
  //         <button
  //           key={i}
  //           onClick={() => clickOption(opt.value)}
  //           className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-sm border border-teal-200 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-100 dark:border-teal-700 dark:hover:bg-teal-800 transition-all shadow-sm"
  //         >
  //           {opt.label}
  //         </button>
  //       ))}
  //     </div>
  //   )}
  // </div>
  // <div className={`${bubbleBase} ${botStyle}`}>
  <div className={`w-full p-3 rounded-2xl ${botStyle}`}>

  {/* Title */}
  <div className="mb-3 text-base font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
    🧾 {text || "Assessment Summary"}
  </div>

  {/* Summary Card */}
  <div className="bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-800 rounded-xl p-3 mb-3">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="text-gray-800 dark:text-gray-100 font-medium">
        {message.data?.name || "Unknown Student"}
      </div>

      {/* Qualified Badge */}
      {message.data?.qualified && (
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0 ${
            message.data.qualified.toString().toLowerCase().includes("yes")
              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {message.data.qualified.toString().toLowerCase().includes("yes")
            ? "✅ Qualified"
            : "❌ Not Qualified"}
        </div>
      )}
    </div>
  </div>

  {/* Details Table */}
  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
    <table className="w-full text-sm">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="text-left px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">
            Field
          </th>
          <th className="text-right px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        {[
          [
            "📊 Percentage",
            (() => {
              let val =
                message.data?.percentage ||
                message.data?.["Attendance (%)"] ||
                message.data?.["Percentage (%) "] ||
                message.data?.["Percentage"];
              if (typeof val === "string") val = parseFloat(val);
              if (!isNaN(val)) {
                if (val <= 1) val = val * 100; // 0.85 → 85
                return `${val.toFixed(2)}%`;
              }
              return "N/A";
            })(),
          ],
          ["💻 Coding Score", message.data?.codingScore || "N/A"],
          ["🧠 MCQ Score", message.data?.mcqScore || "N/A"],
          [
            "📋 Tab Changed",
            Number(message.data?.tabChanged) > 0 ? (
              <span className="text-red-500 font-semibold">
                {message.data.tabChanged}
              </span>
            ) : (
              <span className="text-green-600 font-semibold">0</span>
            ),
          ],
          [
            "📎 Copy Pasted",
            Number(message.data?.copyPasted) > 0 ? (
              <span className="text-red-500 font-semibold">
                {message.data.copyPasted}
              </span>
            ) : (
              <span className="text-green-600 font-semibold">0</span>
            ),
          ],
          ["🧾 Assessment No", message.data?.assessmentNo || "N/A"],
        ]
          .filter(([_, value]) => value && value !== "N/A")
          .map(([label, value], i) => (
            <tr
              key={i}
              className="border-t border-gray-100 dark:border-gray-700 last:border-none"
            >
              <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-200">
                {label}
              </td>
              <td className="py-2 px-3 text-right text-gray-800 dark:text-gray-100">
                {value}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>

  {/* Buttons */}
  {Array.isArray(message.options) && message.options.length > 0 && (
    <div className="mt-4 flex flex-wrap gap-2">
      {message.options.map((opt: any, i: number) => (
        <button
          key={i}
          onClick={() => clickOption(opt.value)}
          className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-sm border border-teal-200 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-100 dark:border-teal-700 dark:hover:bg-teal-800 transition-all shadow-sm"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )}
</div>

)}

        {/* FAQ */}
        {type === "faq" && (
          <div className={`${bubbleBase} ${botStyle}`}>
            <div className="text-sm">{text}</div>
            {Array.isArray(message.options) && message.options.length > 0 && (
              <div className="mt-2">
                {message.options.map((opt: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => clickOption(opt.value)}
                    className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm mr-2"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

     {/* Typing Indicator (Responsive MP4) */}
{/* {type === "typing" && (
  <div className="flex justify-center py-3">
    <video
      src={text}
      autoPlay
      loop
      muted
      playsInline
      className="max-w-[300px] w-auto h-auto rounded-lg object-contain shadow-sm"
    />
  </div>
)} */}

{/* Typing Indicator (Responsive MP4 Clean Style)
{type === "typing" && (
  <div className="flex justify-center py-3">
    <video
      src={text}
      autoPlay
      loop
      muted
      playsInline
      className="max-w-[250px] sm:max-w-[300px] w-full h-auto object-cover rounded-xl border-none outline-none bg-transparent shadow-md"
      onError={(e) => console.error("Video load error:", e)}
    />
  </div>
)} */}


{/* Typing Indicator - Chatbot Style */}
{/* {type === "typing" && (
  <div
    className={`${bubbleBase} ${botStyle} flex items-center justify-center p-2 shadow-sm`}
    style={{
      backgroundColor: "rgba(255,255,255,0.8)", // subtle background for light mode
      backdropFilter: "blur(6px)", // smooth glass effect
    }}
  >
    <video
      src={text}
      autoPlay
      loop
      muted
      playsInline
      className="w-20 sm:w-24 h-auto object-cover rounded-lg border-none outline-none bg-transparent"
    />
  </div>
)} */}

{/* Typing Indicator (Responsive MP4 - Clean Style) */}
{/* {type === "typing" && (
  <div className="flex justify-center py-3">
    <video
      src={text}
      autoPlay
      loop
      muted
      playsInline
      className="max-w-[300px] w-auto h-auto object-contain rounded-xl border-none outline-none bg-transparent"
    />
  </div>
)} */}
{/* Typing Indicator - Transparent Chatbot Style */}
{/* {type === "typing" && (
  <div
    className="flex justify-center py-2"
  >
    <div
      className="flex items-center justify-center rounded-xl p-0.5 shadow-none backdrop-blur-sm bg-transparent"
      style={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <video
        src={text}
        autoPlay
        loop
        muted
        playsInline
        className="w-20 sm:w-24 h-auto object-contain rounded-lg border-none outline-none bg-transparent"
      />
    </div>
  </div>
)} */}

{type === "typing" && (
  <div className="flex justify-center py-2">
    <div
      className="flex items-center justify-center rounded-xl p-0.5 shadow-none backdrop-blur-sm bg-transparent"
      style={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <video
        src={text}
        autoPlay
        loop
        muted
        playsInline
        className="w-20 sm:w-24 h-auto object-contain rounded-lg border-none outline-none bg-transparent"
        style={{
          backgroundColor: "transparent",
          // 🎨 Smart blending based on theme
          mixBlendMode: theme === "dark" ? "screen" : "multiply",
          // 💡 Adjust glow / halo visibility
          filter: "brightness(1.1) contrast(1.2)",
        }}
        onError={(e) => console.error("Video load error:", e)}
      />
    </div>
  </div>
)}




        {/* Text / Error */}
        {(type === "text" || type === "error") && (
          <div
            className={`${bubbleBase} ${
              type === "error" ? "bg-red-50 text-red-700" : botStyle
            }`}
          >
            <div className="text-sm">{text}</div>
          </div>
        )}
      </div>
    </div>
  );
}
