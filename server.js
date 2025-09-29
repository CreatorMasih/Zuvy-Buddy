// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import fetch from "node-fetch";
// import Fuse from "fuse.js";

// const app = express();
// const PORT = 5000;

// // Student chat history script
// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfPh0XkA1rcZslA0-i_tuF6Rv6vy5tCGlWTvX5vh1qpLfztlDuqRFhKt0wrb_5WETB0Q/exec";

// // FAQ script (NEW)
// // const FAQ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3UBwE_qVYeMzGto2-RibAsMI0b6ieIuJ_rPq__8cMuW-NcAC0aagCGuZQRfA6qLoaaw/exec";
// const FAQ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYdUpTc8uIBT4vLzOQUG7bu2FcQ9Lb-czyrpsq2acNRNF-2L0jooXRlQGbeVWQDp5_0A/exec";
// let faqData = [];

// //const ATTENDANCE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby899r3KdxdVhJixrc6HPmZAKBpKaBM63mrfcu50Twf62BJ0WET4-2zHiVCfZgxtOPszg/exec"; 

// const ATTENDANCE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrpSXko924OWmzSFx9gOef4mZgVEgKmZ6RuoZq4rPUplLWeCOjp2Uxg_PJf71Ejms8Bw/exec";


// const ASSESSMENT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3T84K5jPFc38Gs6RE8nYFXmAK93iWSLF5wfAmxjQikgTZYjsgmXmcoDrIpUOF229aig/exec";

// // Load FAQ data from Google Sheet
// async function loadFAQ() {
//   try {
//     const res = await fetch(FAQ_SCRIPT_URL);
//     const data = await res.json();
//     faqData = data.faqs || [];
//     console.log(`✅ FAQ loaded: ${faqData.length} entries`);
  
//   } catch (error) {
//     console.error("❌ Failed to load FAQ data:", error);
//   }
// }

// async function fetchAssessment(email, assessmentNo = 1) {
//   try {
//     const url = `${ASSESSMENT_SCRIPT_URL}?email=${encodeURIComponent(email)}&assessmentNo=${assessmentNo}`;
//     console.log(`📡 Fetching assessment data from: ${url}`);

//     const res = await fetch(url);
//     const data = await res.json();

//     if (!data || data.status !== "success") return null;

//     return data.data;
//   } catch (err) {
//     console.error("❌ Failed to fetch assessment:", err);
//     return null;
//   }
// }

// // Call this function once when server starts
// loadFAQ();

// app.use(cors());
// app.use(bodyParser.json());

// // app.post("/query", async (req, res) => {
// //   const { name, email, text } = req.body;

// //   console.log(`📩 Message from ${name} (${email}): ${text}`);

// //   // Search in FAQ
// //   let reply = "I am processing your request...";
// //   if (faqData.length > 0) {
// //     const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });
// //     const result = fuse.search(text);

// //     if (result.length > 0) {
// //       reply = result[0].item.answer;
// //     } else {
// //       reply = "Sorry, I couldn't find an answer for that. Please contact support.";
// //     }
// //   }

// //   // Save chat history (as before)
// //   try {
// //     await fetch(GOOGLE_SCRIPT_URL, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         name,
// //         email,
// //         query: text,
// //         response: reply,
// //       }),
// //     });
// //     console.log("✅ Data sent to Google Sheets!");
// //   } catch (error) {
// //     console.error("❌ Failed to send to Google Sheets:", error);
// //   }

// //   res.json({
// //     reply,
// //     timestamp: new Date().toISOString(),
// //   });
// // });

// app.post("/query", async (req, res) => {
//    const { name, email, text } = req.body;

//   console.log(`📩 Message from ${name} (${email}): ${text}`);

//   let reply = "Hmm... let me check that for you 🤔";

//   // Normalize once
// const q = text.toLowerCase();

// // Attendance percentage
// if (q.includes("attendance") || q.includes("percent")) {
//   try {
//     const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
//     const resp = await fetch(url);
//     const json = await resp.json();

//     if (json.status === "success") {
//       const d = json.data;
//       reply = `Hi ${d.name || name}, your attendance is ${d.computedPercentage}% (${d.attendanceCount}/${d.totalClasses}).`;
//     } else {
//       reply = `Sorry ${name}, I couldn't find your attendance record.`;
//     }
//   } catch (err) {
//     console.error("Attendance API failed:", err);
//     reply = `I couldn't fetch attendance right now — please try again later.`;
//   }

//   return res.json({ reply, timestamp: new Date().toISOString() });
// }

// // Why low attendance
// if (q.includes("why") && q.includes("low")) {
//   try {
//     const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
//     const resp = await fetch(url);
//     const json = await resp.json();

//     if (json.status === "success") {
//       const d = json.data;
//       reply = `Hi ${d.name || name}, your attendance is ${d.computedPercentage}% because you missed ${d.absentDates?.length || 0} classes.`;
//     } else {
//       reply = `Sorry ${name}, I couldn't get the details.`;
//     }
//   } catch (err) {
//     console.error("Attendance detail fetch failed:", err);
//     reply = `Couldn't fetch attendance breakdown right now.`;
//   }

//   return res.json({ reply, timestamp: new Date().toISOString() });
// }

// // Missed classes
// // if (q.includes("miss") || q.includes("absent") || q.includes("class")) {
// //   try {
// //     const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
// //     const resp = await fetch(url);
// //     const json = await resp.json();

// //     if (json.status === "success" && json.data.absentDates) {
// //       const absents = json.data.absentDates;
// //       const firstFew = absents.slice(0, 5).join(", ");
// //       reply = `You missed ${absents.length} classes. Here are some dates: ${firstFew}${absents.length > 5 ? " ..." : ""}`;
// //     } else {
// //       reply = `I couldn't find any missed classes for you.`;
// //     }
// //   } catch (err) {
// //     console.error("Missed classes fetch failed:", err);
// //     reply = `Couldn't fetch missed classes right now.`;
// //   }

// //   return res.json({ reply, timestamp: new Date().toISOString() });
// // }
// // Missed classes in table format
// if (q.includes("miss") || q.includes("absent") || q.includes("class")) {
//   try {
//     const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
//     const resp = await fetch(url);
//     const json = await resp.json();

//     if (json.status === "success" && json.data.absentDates) {
//       const absents = json.data.absentDates;

//       // Format table rows
//     //   const rows = absents.slice(0, 5).map(dateStr => {
//     //     const d = new Date(dateStr);
//     //     const day = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
//     //     const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
//     //     return `${day.padEnd(12)} | ${weekday}`;
//     //   });

//     //   reply = `📅 You missed ${absents.length} classes:\n\nDate         | Day\n-------------|---------\n${rows.join("\n")}${absents.length > 5 ? `\n...and ${absents.length - 5} more` : ""}`;
//     // } else {
//     //   reply = `I couldn't find any missed classes for you.`;
//   const rows = absents.map(dateStr => {
//   const d = new Date(dateStr);
//   const day = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
//   const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
//   return `${day.padEnd(12)} | ${weekday}`;
// });

// reply = `📅 You missed ${absents.length} classes:\n\nDate         | Day\n-------------|-----------\n${rows.join("\n")}`;

//     }
//   } catch (err) {
//     console.error("Missed classes fetch failed:", err);
//     reply = `Couldn't fetch missed classes right now.`;
//   }

//   return res.json({ reply, timestamp: new Date().toISOString() });
// }


// // 🆕 Attendance Check
// // if (text.toLowerCase().includes("attendance")) {
// //   try {
// //     const response = await fetch(`${GOOGLE_SCRIPT_URL}?attendance=true&email=${encodeURIComponent(email)}`);
// //     const data = await response.json();

// //     if (data.error) {
// //       reply = `Sorry ${name}, I could not find your attendance record.`;
// //     } else {
// //       reply = `Hi ${name}, you have attended ${data.attendanceCount}/${data.totalClasses} classes (${data.percentage}%).`;
// //     }

// //     return res.json({ reply, timestamp: new Date().toISOString() });
// //   } catch (err) {
// //     console.error("Attendance check failed:", err);
// //     reply = `Sorry ${name}, I couldn't fetch your attendance right now.`;
// //     return res.json({ reply, timestamp: new Date().toISOString() });
// //   }
// // }

// // // 🆕 Attendance Low Reason
// // if (text.toLowerCase().includes("why") && text.toLowerCase().includes("low")) {
// //   try {
// //     const response = await fetch(`${GOOGLE_SCRIPT_URL1}?attendance=true&email=${encodeURIComponent(email)}`);
// //     const data = await response.json();

// //     if (data.details) {
// //       const absents = data.details.filter(d => !d.present);
// //       reply = `You have been absent on ${absents.length} days: ${absents.map(d => d.date).join(", ")}`;
// //     } else {
// //       reply = "I couldn't fetch your attendance details.";
// //     }

// //     return res.json({ reply, timestamp: new Date().toISOString() });
// //   } catch (err) {
// //     console.error("Attendance detail check failed:", err);
// //     reply = `Couldn't fetch your attendance breakdown right now.`;
// //     return res.json({ reply, timestamp: new Date().toISOString() });
// //   }
// // }
// // check for attendance request
// if (text.toLowerCase().includes("attendance")) {
//   try {
//     const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
//     const resp = await fetch(url);
//     const json = await resp.json();

//     if (json.status === "success") {
//       const d = json.data;
//       reply = `Hi ${d.name || name}, your attendance is ${d.computedPercentage}% (${d.attendanceCount}/${d.totalClasses}).`;
//     } else {
//       reply = `Sorry ${name}, I couldn't find your attendance record.`;
//     }
//   } catch (err) {
//     console.error("Attendance API failed:", err);
//     reply = `I couldn't fetch attendance right now — please try again later.`;
//   }

//   return res.json({ reply, timestamp: new Date().toISOString() });
// }

// // if user asks "why low"
// // if (text.toLowerCase().includes("why") && text.toLowerCase().includes("low")) {
// //   try {
// //     const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
// //     const resp = await fetch(url);
// //     const json = await resp.json();

// //     if (json.status === "success") {
// //       const d = json.data;
// //       if (d.absentDates && d.absentDates.length > 0) {
// //         reply = `You were absent on ${d.absentDates.length} days: ${d.absentDates.join(", ")}.`;
// //       } else {
// //         reply = `You don't have any recorded absences or I couldn't find them.`;
// //       }
// //     } else {
// //       reply = `Sorry ${name}, I couldn't get the details.`;
// //     }
// //   } catch (err) {
// //     console.error("Attendance detail fetch failed:", err);
// //     reply = `Couldn't fetch attendance breakdown right now.`;
// //   }

// //   return res.json({ reply, timestamp: new Date().toISOString() });
// // }

 
//   if (faqData.length > 0) {
//     const fuse = new Fuse(faqData, {
//       keys: ["question"],
//       threshold: 0.4,
//       includeScore: true,
//     });

//     const results = fuse.search(text);

//     if (results.length > 0) {
//       const bestMatch = results[0];
//       if (bestMatch.score < 0.3) {
//         reply = bestMatch.item.answer;
//       } else {
//         reply = `I'm not fully sure 🤔 but here's what I found:\n\n${bestMatch.item.answer}`;
//       }
//     } else {
//       reply = `I couldn't find an exact answer 😅. Can you try asking in a different way?`;
//     }
//   }
//   // Detect Assessment Queries (NLP/Fuzzy)
// if (q.includes("assessment") || q.includes("score") || q.includes("result")) {
//   let assessmentNo = 1;

//   // Try to extract number (e.g. "assessment 2 score")
//   const match = q.match(/\b(\d+)\b/);
//   if (match) assessmentNo = Number(match[1]);

//   const assessData = await fetchAssessment(email, assessmentNo);

//   if (!assessData) {
//     reply = `Sorry ${name}, I couldn't find your Assessment ${assessmentNo} record.`;
//   } else {
//     reply = `📊 *Assessment ${assessmentNo} Report* for ${assessData.Name}:\n\n` +
//       `✅ Qualified: ${assessData.Qualified}\n` +
//       // `📅 Attendance: **${assessData["Attendance (%)"]}%**\n` +
//       `📈 Percentage: ${assessData["Percentage (%) "]}%\n` +
//       `💻 Coding Score: ${assessData["Coding Score"]}\n` +
//       `📝 MCQ Score: ${assessData["MCQ Score"]}\n` +
//       `⏱️ Tab Changes: ${assessData["Tab Changed"]}\n` +
//       `📋 Copy-Paste Count: ${assessData["Copy Pasted"]}`;
//   }

//   return res.json({ reply, timestamp: new Date().toISOString() });
// }


//   // Save chat history
//   try {
//     await fetch(GOOGLE_SCRIPT_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name,
//         email,
//         query: text,
//         response: reply,
//       }),
//     });
//     console.log("✅ Chat saved");
//   } catch (error) {
//     console.error("❌ Failed to save:", error);
//   }

//   res.json({
//     reply,
//     timestamp: new Date().toISOString(),
//   });
// });


// app.listen(PORT, () => {
//   console.log(`✅ Chatbot API running at http://localhost:${PORT}`);
// });
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import Fuse from "fuse.js";

const app = express();
const PORT = 5000;

// ✅ Google Apps Script URLs
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxfPh0XkA1rcZslA0-i_tuF6Rv6vy5tCGlWTvX5vh1qpLfztlDuqRFhKt0wrb_5WETB0Q/exec";
const ATTENDANCE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyrpSXko924OWmzSFx9gOef4mZgVEgKmZ6RuoZq4rPUplLWeCOjp2Uxg_PJf71Ejms8Bw/exec";
const ASSESSMENT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw3T84K5jPFc38Gs6RE8nYFXmAK93iWSLF5wfAmxjQikgTZYjsgmXmcoDrIpUOF229aig/exec";
const FAQ_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzYdUpTc8uIBT4vLzOQUG7bu2FcQ9Lb-czyrpsq2acNRNF-2L0jooXRlQGbeVWQDp5_0A/exec"; // ⚡ Replace with your FAQ Sheet URL

app.use(cors());
app.use(bodyParser.json());

/* =============== HELPERS =============== */

// ✅ Fetch Attendance Data
async function fetchAttendance(email) {
  try {
    const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
    console.log(`📡 Fetching attendance from: ${url}`);
    const res = await fetch(url);
    const json = await res.json();
    console.log("📥 Attendance:", JSON.stringify(json).slice(0, 400));
    return json.status === "success" ? json.data : null;
  } catch (err) {
    console.error("❌ Attendance fetch error:", err);
    return null;
  }
}

// ✅ Fetch Assessment Data
async function fetchAssessment(email, assessmentNo = 1) {
  try {
    const url = `${ASSESSMENT_SCRIPT_URL}?email=${encodeURIComponent(
      email
    )}&assessmentNo=${assessmentNo}`;
    console.log(`📡 Fetching assessment ${assessmentNo}: ${url}`);
    const res = await fetch(url);
    const json = await res.json();
    console.log("📥 Assessment:", JSON.stringify(json).slice(0, 400));
    return json.status === "success" ? json.data : null;
  } catch (err) {
    console.error("❌ Assessment fetch error:", err);
    return null;
  }
}

// ✅ Fetch FAQ Answer (Fuzzy search handled by Apps Script)
async function fetchFAQAnswer(query) {
  try {
    const url = `${FAQ_SCRIPT_URL}?q=${encodeURIComponent(query)}`;
    console.log("📡 Fetching FAQ:", url);
    const res = await fetch(url);
    const json = await res.json();
    console.log("📥 FAQ Response:", JSON.stringify(json).slice(0, 300));
    return json.status === "success" ? json.data : null;
  } catch (err) {
    console.error("❌ FAQ Fetch Error:", err);
    return null;
  }
}

// ✅ Detect command
function detectCommand(text = "") {
  if (!text) return "";
  const q = text.toLowerCase().trim();

  if (
    q.startsWith("attendance_") ||
    q.startsWith("assessment_") ||
    q.startsWith("faq_") ||
    q.startsWith("mailto:")
  )
    return q;

  if (q.includes("attendance") && !/\bpercent|present|absent|\d+\b/.test(q))
    return "attendance_menu";
  if (/\bpercent|percentage\b/.test(q)) return "attendance_percentage";
  if (/\bpresent\b/.test(q)) return "attendance_present_dates";
  if (/\babsent\b/.test(q)) return "attendance_absent_dates";

  if (q.includes("assessment") && !/\d/.test(q)) return "assessment_menu";
  const m = q.match(/\bassessment\s*(no\.?|number)?\s*(\d{1,2})\b/);
  if (m?.[2]) return `assessment_${m[2]}`;

  return "faq_query";
}

// ✅ Normalize Assessment Data
function normalizeAssessmentData(raw) {
  const get = (keys) =>
    keys.map((k) => raw[k]).find((v) => v !== undefined && v !== null && v !== "");
  return {
    name: get(["Name", "Student Name", "Full Name"]) || "Unknown Student",
    qualified: get(["Qualified", "Result", "Status"]) || "N/A",
    percentage:
      get([
        "Percentage",
        "Percentage (%)",
        "Attendance (%)",
        "Percentage (%) ",
      ]) || "N/A",
    codingScore: get(["Coding Score", "Coding"]) || "N/A",
    mcqScore: get(["MCQ Score", "MCQ"]) || "N/A",
    tabChanged: get(["Tab Changed", "tabChanged"]) ?? 0,
    copyPasted: get(["Copy Pasted", "copyPasted"]) ?? 0,
    assessmentNo: get(["Assessment No", "Assessment"]) || "N/A",
  };
}

// ✅ Attendance follow-up buttons
function getAttendanceFollowupButtons(exclude = "") {
  const all = [
    { label: "📈 What is my attendance?", value: "attendance_percentage" },
    { label: "📉 Why is my attendance low?", value: "attendance_reason" },
    { label: "✅ Show present dates", value: "attendance_present_dates" },
    { label: "❌ Show absent dates", value: "attendance_absent_dates" },
  ];
  return all.filter((btn) => btn.value !== exclude);
}

/* =============== MAIN CHAT ENDPOINT =============== */

app.post("/query", async (req, res) => {
  const { name = "Student", email = "", text = "" } = req.body;
  console.log(`\n📩 ${name} (${email}): ${text}`);

  const cmd = detectCommand(text);
  console.log("🔎 Command:", cmd);

  let response = { type: "text", message: "Hmm... let me check that for you!" };

  try {
    /* 📅 ATTENDANCE MENU */
    if (cmd === "attendance_menu") {
      response = {
        type: "options",
        title: "📅 Attendance Menu",
        message: "Choose what you want to check:",
        options: getAttendanceFollowupButtons(),
      };
      return res.json(response);
    }

    /* 📊 ATTENDANCE HANDLERS */
    if (cmd.startsWith("attendance_")) {
      const data = await fetchAttendance(email);
      if (!data)
        return res.json({
          type: "text",
          title: "📅 Attendance",
          message: "Sorry, I couldn’t find your attendance data.",
        });

      const total = data.totalClasses ?? 0;
      const present = data.attendanceCount ?? 0;
      const absent = total - present;
      const percent =
        data.computedPercentage ??
        data.percentage ??
        ((present / total) * 100).toFixed(2);

      const formatDates = (arr = []) =>
        arr.map((d, i) => `${i + 1}. ${new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`).join("\n");

      if (cmd === "attendance_percentage")
        return res.json({
          type: "attendance",
          title: "📈 Attendance Overview",
          message: `Your attendance is **${percent}%** (${present}/${total} classes).`,
          options: getAttendanceFollowupButtons(cmd),
        });

      if (cmd === "attendance_reason")
        return res.json({
          type: "attendance",
          title: "📉 Why is my attendance low?",
          message: `You missed **${absent} classes** out of ${total}.`,
          options: getAttendanceFollowupButtons(cmd),
        });

      if (cmd === "attendance_present_dates")
        return res.json({
          type: "attendance",
          title: "✅ Present Dates",
          message: formatDates(data.presentDates || []),
          options: getAttendanceFollowupButtons(cmd),
        });

      if (cmd === "attendance_absent_dates")
        return res.json({
          type: "attendance",
          title: "❌ Absent Dates",
          message: formatDates(data.absentDates || []),
          options: getAttendanceFollowupButtons(cmd),
        });
    }

    /* 🧾 ASSESSMENT MENU */
    if (cmd === "assessment_menu") {
      const available = [1, 2, 3, 4, 5]; // or dynamic check later
      response = {
        type: "options",
        title: "🧾 Assessments",
        message: "Which assessment do you want to check?",
        options: available.map((n) => ({
          label: `Assessment ${n}`,
          value: `assessment_${n}`,
        })),
      };
      return res.json(response);
    }

    /* 🧾 ASSESSMENT DETAIL */
    if (cmd.startsWith("assessment_")) {
      const num = parseInt(cmd.split("_")[1]);
      const raw = await fetchAssessment(email, num);
      if (!raw)
        return res.json({
          type: "text",
          title: "🧾 Assessment",
          message: `Assessment ${num} not found.`,
        });

      const norm = normalizeAssessmentData(raw);
      return res.json({
        type: "assessment",
        title: `📊 Assessment ${num}`,
        message: `Here are your details:`,
        data: norm,
      });
    }

    /* 💡 FAQ MENU */
    if (cmd === "faq_menu") {
      response = {
        type: "text",
        title: "💡 Ask a Query",
        message:
          "You can type your question (e.g. 'Why is my attendance low?' or 'What is Zuvy?') 👇",
      };
      return res.json(response);
    }

    /* 💬 FAQ SEARCH (Auto) */
    if (cmd.startsWith("faq") || cmd === "faq_query") {
      const faq = await fetchFAQAnswer(text);
      if (!faq)
        return res.json({
          type: "faq",
          title: "😅 Not Found",
          message: "I couldn’t find an exact match. Try rephrasing your question.",
          options: [
            { label: "🔁 Ask Another Query", value: "faq_menu" },
            { label: "📧 Contact Support", value: "mailto:join-zuvy@navgurukul.org" },
          ],
        });

      response = {
        type: "faq",
        title: `💡 ${faq.Question}`,
        message: faq.Answer,
        options: [
          { label: "🔁 Ask Another Query", value: "faq_menu" },
          { label: "🏠 Go Home", value: "start" },
        ],
      };
      return res.json(response);
    }

    return res.json(response);
  } catch (err) {
    console.error("❌ Error:", err);
    res.json({
      type: "error",
      title: "⚠️ Server Error",
      message: "Something went wrong. Try again later.",
    });
  }
});

/* 🚀 START SERVER */
app.listen(PORT, () =>
  console.log(`✅ Chatbot API running at http://localhost:${PORT}`)
);
