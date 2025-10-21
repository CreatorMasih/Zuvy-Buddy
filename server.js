// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import fetch from "node-fetch";
// import Fuse from "fuse.js";

// const app = express(); 
// const PORT = process.env.PORT || 5000;


// // Student chat history script
// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfPh0XkA1rcZslA0-i_tuF6Rv6vy5tCGlWTvX5vh1qpLfztlDuqRFhKt0wrb_5WETB0Q/exec";

// // FAQ script
// const FAQ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYdUpTc8uIBT4vLzOQUG7bu2FcQ9Lb-czyrpsq2acNRNF-2L0jooXRlQGbeVWQDp5_0A/exec";
// let faqData = [];

// // Attendance script
// const ATTENDANCE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrpSXko924OWmzSFx9gOef4mZgVEgKmZ6RuoZq4rPUplLWeCOjp2Uxg_PJf71Ejms8Bw/exec";
// // const ATTENDANCE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNtYqt8JcBaZfi2z0vLZLnoqru9k52aH6CBqA1_If95wdEQw-5_LDEyUPtGUs2y0uaGw/exec";


// // Assessment script (returns one assessment row when given assessmentNo)
// const ASSESSMENT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3T84K5jPFc38Gs6RE8nYFXmAK93iWSLF5wfAmxjQikgTZYjsgmXmcoDrIpUOF229aig/exec";

// async function loadFAQ() {
//   try {
//     const res = await fetch(FAQ_SCRIPT_URL);
//     const data = await res.json();
//     faqData = data.faqs || [];
//     console.log(`✅ FAQ loaded: ${faqData.length} entries`);
//   } catch (err) {
//     console.error("❌ Failed to load FAQ:", err);
//     faqData = [];
//   }
// }
// loadFAQ();

// app.use(cors());
// app.use(bodyParser.json());

// // Helper: fetch assessment row (returns data or null)
// async function fetchAssessment(email, assessmentNo = 1) {
//   try {
//     const url = `${ASSESSMENT_SCRIPT_URL}?email=${encodeURIComponent(email)}&assessmentNo=${assessmentNo}`;
//     console.log(`📡 Fetching assessment ${assessmentNo} from: ${url}`);
//     const res = await fetch(url);
//     const json = await res.json();
//     console.log(`📥 Assessment ${assessmentNo} raw response:`, JSON.stringify(json).slice(0, 1000));
//     if (!json || json.status !== "success") return null;
//     return json.data;
//   } catch (err) {
//     console.error("❌ Failed to fetch assessment:", err);
//     return null;
//   }
// }

// // Helper: fetch attendance row (returns json or null)
// async function fetchAttendance(email) {
//   try {
//     const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
//     console.log(`📡 Fetching attendance from: ${url}`);
//     const res = await fetch(url);
//     const json = await res.json();
//     console.log("📥 Attendance raw response:", JSON.stringify(json).slice(0, 1000));
//     if (!json || json.status !== "success") return null;
//     return json.data;
//   } catch (err) {
//     console.error("❌ Failed to fetch attendance:", err);
//     return null;
//   }
// }

// // detect intent/command robustly
// function detectCommand(text = "") {
//   if (!text) return "";

//   const q = text.toString().toLowerCase().trim();

//   // If user sends explicit command tokens, return them directly
//   // Accept "attendance_percentage", "assessment_2", "mailto:...", etc.
//   if (q.startsWith("attendance_") || q.startsWith("assessment_") || q.startsWith("mailto:") || q.startsWith("faq")) {
//     return q;
//   }

//   // Natural language mappings (simple)
//   if (/\battendance\b/.test(q) && !/\bpercent\b|\bpresent\b|\babsent\b|\d+\b/.test(q)) {
//     return "attendance_menu";
//   }
//   if (/\bpercent\b|\bpercentage\b|\battendance %\b/.test(q)) return "attendance_percentage";
//   if (/\bpresent\b|\battended\b|\bpresent classes\b/.test(q)) return "attendance_present";
//   if (/\babsent\b|\bmiss(ed)?\b|\bmissed classes\b/.test(q)) return "attendance_absent";
//   if (/\babsent dates\b|\babsent_date\b/.test(q)) return "attendance_absent_dates";
//   if (/\bpresent dates\b|\bpresent_date\b/.test(q)) return "attendance_present_dates";

//   if (/\bassessment\b/.test(q) && !/\b\d+\b/.test(q)) return "assessment_menu";
//   // capture "assessment 2" or "assessment no 3"
//   const m = q.match(/\bassessment\s*(no\.?|number|\s)?\s*(\d{1,2})\b/);
//   if (m && m[2]) {
//     return `assessment_${Number(m[2])}`;
//   }
//   const m2 = q.match(/\b(\d{1,2})\b/); // if just a number, assume assessment number (only if context suggests)
//   // don't auto-return numeric alone — keep safe; only if it has 'assessment' anywhere earlier we matched

//   // fallback: treat as FAQ/natural query
//   return "faq_query";
// }

// // Get available assessments for email (1..30). returns array of numbers found (parallel)
// async function getAvailableAssessments(email, limit = 30) {
//   try {
//     const requests = [];
//     for (let i = 1; i <= limit; i++) {
//       requests.push(fetchAssessment(email, i));
//     }
//     const results = await Promise.allSettled(requests);
//     const available = [];
//     results.forEach((r, idx) => {
//       if (r.status === "fulfilled" && r.value) {
//         available.push(idx + 1);
//       }
//     });
//     console.log("ℹ️ available assessments for", email, ":", available);
//     return available;
//   } catch (err) {
//     console.error("❌ Error while getting available assessments:", err);
//     return [];
//   }
// }


// // function normalizeAssessmentData(raw) {
// //   if (!raw) return raw;

// //   const get = (keys) => {
// //     for (const k of keys) {
// //       if (Object.prototype.hasOwnProperty.call(raw, k)) {
// //         const v = raw[k];
// //         if (v !== undefined && v !== null && v !== "") return v;
// //       }
// //     }
// //     return null;
// //   };

// //   return {
// //     name: get(["Name", "Student Name", "Full Name"]) || "Unknown Student",
// //     qualified: get(["Qualified", "Result", "Status"]) || "N/A",
// //     percentage:
// //       get([
// //         "Percentage",
// //         "Percentage (%)",
// //         "Percentage (%) ",
// //         "Attendance (%)",
// //         "Attendance (%) ",
// //       ]) || "N/A",
// //     codingScore: get(["Coding Score", "Coding", "CodingScore"]) || "N/A",
// //     mcqScore: get(["MCQ Score", "MCQ", "MCQScore"]) || "N/A",
// //     tabChanged:
// //       get(["Tab Changed", "TabChanged", "tabChanged", "Tab Changed "]) ?? 0,
// //     copyPasted:
// //       get(["Copy Pasted", "CopyPasted", "copyPasted", "Copy Pasted "]) ?? 0,
// //     assessmentNo: get(["Assessment No", "Assessment", "AssessmentNo"]) || "N/A",
// //     raw,
// //   };
// // }
// function normalizeAssessmentData(raw) {
//   if (!raw) return raw;

//   const get = (keys) => {
//     for (const k of keys) {
//       if (Object.prototype.hasOwnProperty.call(raw, k)) {
//         const v = raw[k];
//         if (v !== undefined && v !== null && v !== "") return v;
//       }
//     }
//     return null;
//   };

//   return {
//     name:
//       get(["Name", "Student Name", "Full Name", "name"]) || "Unknown Student",
//     qualified:
//       get(["Qualified", "Result", "Status", "qualified"]) || "N/A",
//     percentage:
//       get([
//         "Percentage",
//         "Percentage (%)",
//         "Attendance (%)",
//         "percentage",
//         "Percentage (%) ",
//       ]) || "N/A",
//     codingScore:
//       get(["Coding Score", "Coding", "codingScore", "CodingScore"]) || "N/A",
//     mcqScore:
//       get(["MCQ Score", "MCQ", "mcqScore", "MCQScore"]) || "N/A",
//     tabChanged:
//       get(["Tab Changed", "TabChanged", "tabChanged"]) ?? 0,
//     copyPasted:
//       get(["Copy Pasted", "CopyPasted", "copyPasted"]) ?? 0,
//     assessmentNo:
//       get(["Assessment No", "Assessment", "AssessmentNo"]) || "N/A",
//     raw,
//   };
// }





// /**
//  * Main Query Endpoint
//  * Accepts body: { name, email, text }
//  * text can be normal user question OR a command token (like "attendance_percentage" or "assessment_2")
//  */
// // function getAttendanceFollowupButtons(exclude = "") {
// //   const all = [
// //     { label: "📈 What is my attendance?", value: "attendance_percentage" },
// //     { label: "📉 Why is my attendance low?", value: "attendance_reason" },
// //     { label: "✅ Show present dates", value: "attendance_present_dates" },
// //     { label: "❌ Show absent dates", value: "attendance_absent_dates" },
// //   ];
// //   return all.filter((btn) => btn.value !== exclude);
// // }
// function getAttendanceFollowupButtons(exclude = "") {
//   const all = [
//     { label: "📈 What is my attendance?", value: "attendance_percentage" },
//     { label: "📉 Why is my attendance low?", value: "attendance_reason" },
//     // { label: "✅ Show present dates", value: "attendance_present_dates" },
//     { label: "❌ Show absent dates", value: "attendance_absent_dates" },
//   ];
//   return all.filter((btn) => btn.value !== exclude);
// }


// app.post("/query", async (req, res) => {
//   const { name = "Student", email = "", text = "" } = req.body || {};
//   console.log(`\n📩 Incoming - ${name} (${email}):`, text);

//   const cmd = detectCommand(text);
//   console.log("🔎 Detected command:", cmd);

//   // default fallback response
//   let response = {
//     type: "text",
//     title: "🤔 Bot Reply",
//     message: "Hmm... let me check that for you!",
//   };

//   try {
//     // ---------- Attendance menu ----------

// if (cmd === "attendance_menu") {
//   // Step 1: Intro Message
//   response = {
//     type: "text",
//     title: "🧾 Attendance Query",
//     message: "Here are your attendance options 👇",
//   };

//   await fetch(GOOGLE_SCRIPT_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, query: text, response }),
//   });

//   // Step 2: Show all question buttons
//   response = {
//     type: "options",
//     title: "📅 Attendance Menu",
//     message: "Choose what you want to check:",
//     options: [
//       { label: "📈 What is my attendance?", value: "attendance_percentage" },
//       { label: "📉 Why is my attendance low?", value: "attendance_reason" },
//       // { label: "✅ Show present dates", value: "attendance_present_dates" },
//       { label: "❌ Show absent dates", value: "attendance_absent_dates" },
//     ],
//   };
//   return res.json(response);
// }

// if (cmd.startsWith("attendance_")) {
//   const attendance = await fetchAttendance(email);
//   if (!attendance) {
//     response = {
//       type: "text",
//       title: "📅 Attendance",
//       message: `Sorry ${name}, I couldn't find your attendance data right now.`,
//     };
//     return res.json(response);
//   }

//   // ✅ Date formatter
//   const formatDate = (dateStr) => {
//     try {
//       const d = new Date(dateStr);
//       return d.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         weekday: "short",
//       });
//     } catch {
//       return dateStr;
//     }
//   };

//   // ✅ Handle multiple key names
//   const presentDatesRaw =
//     attendance.presentDates ||
//     attendance.present ||
//     attendance["Present Dates"] ||
//     attendance["Present_Date"] ||
//     [];
//   const absentDatesRaw =
//     attendance.absentDates ||
//     attendance.absents ||
//     attendance["Absent Dates"] ||
//     attendance["Absent_Date"] ||
//     [];

//   const presentDates = presentDatesRaw.map(formatDate);
//   const absentDates = absentDatesRaw.map(formatDate);

//   const total = attendance.totalClasses ?? attendance.total ?? 0;
//   const present = attendance.attendanceCount ?? attendance.presentCount ?? 0;
//   const percent = attendance.computedPercentage ?? attendance.percentage ?? "N/A";
//   const absent = total - present;

//   // 🎯 All buttons (consistent)
//   const followupOptions = [
//     { label: "📈 What is my attendance?", value: "attendance_percentage" },
//     { label: "📉 Why is my attendance low?", value: "attendance_reason" },
//     // { label: "✅ Show present dates", value: "attendance_present_dates" },
  
//     { label: "❌ Show absent dates", value: "attendance_absent_dates" },
//   ];

//   // 📈 Attendance %
//   if (cmd === "attendance_percentage") {
//     response = {
//       type: "attendance",
//       title: "📈 Attendance Overview",
//       message: `Your attendance is **${percent}%** (${present}/${total} classes attended).`,
//       // options: followupOptions,
//       options: getAttendanceFollowupButtons(cmd), 
//     };
//     return res.json(response);
//   }

//   // 📉 Why is my attendance low?
//   if (cmd === "attendance_reason") {
//     response = {
//       type: "attendance",
//       title: "📉 Attendance Reason",
//       message: `Your attendance is low because you missed **${absent} days** out of ${total}.`,
//       // options: followupOptions,
//       options: getAttendanceFollowupButtons(cmd), 
//     };
//     return res.json(response);
//   }

//   // ✅ Present Dates (numbered list)
//   if (cmd === "attendance_present_dates") {
//     const list = presentDates.map((d, i) => `${i + 1}. ${d}`).join("\n");
//     response = {
//       type: "attendance",
//       title: "✅ Present Dates",
//       message: presentDates.length
//         ? `You were present on:\n${list}`
//         : "No present dates found.",
//       // options: followupOptions,
//       options: getAttendanceFollowupButtons(cmd), 
//     };
//     return res.json(response);
//   }

//   // ❌ Absent Dates (numbered list)
//   if (cmd === "attendance_absent_dates") {
//     const list = absentDates.map((d, i) => `${i + 1}. ${d}`).join("\n");
//     response = {
//       type: "attendance",
//       title: "❌ Absent Dates",
//       message: absentDates.length
//         ? `You were absent on:\n${list}`
//         : "No absent dates found.",
//       // options: followupOptions,
//       options: getAttendanceFollowupButtons(cmd), 
//     };
//     return res.json(response);
//   }

//   // fallback
//   response = {
//     type: "text",
//     title: "📅 Attendance",
//     message: "Please choose what you want to check.",
//     options: followupOptions,
//   };
//   return res.json(response);
// }


//     // ---------- Assessment menu (show available assessments from sheet) ----------
//     // if (cmd === "assessment_menu") {
//     //   // discover available assessments (1..30) in parallel
//     //   const available = await getAvailableAssessments(email, 30);
//     if (cmd === "assessment_menu") {
//   // Step 1: Bot says line
//   response = {
//     type: "text",
//     title: "🧾 Assessment Query",
//     message: "What is my assessment?",
//   };
//   await fetch(GOOGLE_SCRIPT_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, query: text, response }),
//   });

//   // Step 2: Now fetch assessments
//   const available = await getAvailableAssessments(email, 30);

//       if (!available || available.length === 0) {
//         response = {
//           type: "text",
//           title: "🧾 Assessments",
//           message: "Sorry, I couldn't find any assessments for your account yet.",
//         };
//         return res.json(response);
//       }

//       const options = available.map((n) => ({ label: `Assessment ${n}`, value: `assessment_${n}` }));
//       response = {
//         type: "options",
//         title: "🧾 Assessments",
//         message: "Which assessment do you want to check?",
//         options,
//         maxAssessment: Math.max(...available),
//       };
//       return res.json(response);
//     }

//     // ---------- Assessment details ----------
//     if (cmd.startsWith("assessment_")) {
//       const parts = cmd.split("_");
//       const num = parseInt(parts[1], 10);
//       if (isNaN(num)) {
//         response = { type: "text", title: "🧾 Assessment", message: "Please select a valid assessment number." };
//         return res.json(response);
//       }

//       const raw = await fetchAssessment(email, num);
//       if (!raw) {
//         response = {
//           type: "text",
//           title: "🧾 Assessment",
//           message: `Arre bhai! Assessment ${num} abhi tak hua hi nahi 😅. Try a smaller number.`,
//         };
//         return res.json(response);
//       }

//       const norm = normalizeAssessmentData(raw);

//       response = {
//         type: "assessment",
//         title: `📊 Assessment ${num} Report`,
//         message: `Here are your details:`,
//         data: {
//   name: norm.name,
//   qualified: norm.qualified,
//   percentage: norm.percentage,
//   codingScore: norm.codingScore,
//   mcqScore: norm.mcqScore,
//   tabChanged: norm.tabChanged,
//   copyPasted: norm.copyPasted,
//   assessmentNo: num,
//   raw: norm.raw,
// },

//       };
//       return res.json(response);
//     }

// //     // ---------- FAQ search (fallback) ----------
// //     if (cmd === "faq_menu") {
// //   response = {
// //     type: "options",
// //     title: "💡 General Queries",
// //     message: "Choose a query or type your own:",
// //     options: [
// //       { label: "How to join a class?", value: "faq_how_to_join_class" },
// //       { label: "How to check my course progress?", value: "faq_course_progress" },
// //       { label: "Who to contact for technical issues?", value: "faq_contact_support" },
// //       { label: "📧 Email support", value: "mailto:join-zuvy@navgurukul.org" },
// //       { label: "🔍 Type your own query", value: "faq" },
// //     ],
// //   };
// //   return res.json(response);
// // }

// //     if (faqData.length > 0) {
// //       // If the detected command is "faq_query" or default, do fuzzy search
// //       const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });
// //       const results = fuse.search(text);

// //       if (results.length > 0) {
// //         response = {
// //           type: "faq",
// //           title: "💡 Answer",
// //           message: results[0].item.answer,
// //         };
// //       } else {
// //         response = {
// //           type: "faq",
// //           title: "😅 Not Found",
// //           message: "I couldn't find an exact answer.",
// //           options: [{ label: "📧 join-zuvy@navgurukul.org", value: "mailto:join-zuvy@navgurukul.org" }],
// //         };
// //       }
// //     }
// // ---------- FAQ Section ----------
// if (cmd === "faq_menu") {
//   if (!faqData || faqData.length === 0) {
//     return res.json({
//       type: "text",
//       title: "💡 General Queries",
//       message: "Sorry, FAQ data is not loaded yet. Please try again later.",
//     });
//   }

//   // 🔹 Convert all FAQs into clickable options
//   const faqOptions = faqData.map((f, i) => ({
//     label: f.question,
//     value: `faq_${i}`,
//   }));

//   // 🔹 Add “My query is not listed” option at end
//   faqOptions.push({
//     label: "🔍 My query is not listed",
//     value: "faq_not_listed",
//   });

//   // 🔹 Response showing all FAQs
//   const response = {
//     type: "options",
//     title: "💡 General Queries",
//     message: "Here are some frequently asked questions 👇",
//     options: faqOptions,
//   };

//   // Save interaction in sheet
//   await fetch(GOOGLE_SCRIPT_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, query: text, response }),
//   });

//   return res.json(response);
// }

// // ---------- Handle clicking a FAQ ----------
// if (cmd.startsWith("faq_")) {
//   // If "My query is not listed"
//   if (cmd === "faq_not_listed") {
//     return res.json({
//       type: "faq",
//       title: "📧 Need More Help?",
//       message:
//         "No problem! You can email your query to **join-zuvy@navgurukul.org**. Our support team will get back to you soon.",
//       options: [
//         { label: "📧 Email Now", value: "mailto:join-zuvy@navgurukul.org" },
//         { label: "🔙 Back to FAQs", value: "faq_menu" },
//       ],
//     });
//   }

//   // Otherwise, it's a specific FAQ like faq_0, faq_1...
//   const index = parseInt(cmd.split("_")[1], 10);
//   if (!isNaN(index) && faqData[index]) {
//     const faq = faqData[index];
//     return res.json({
//       type: "faq",
//       title: `💡 ${faq.question}`,
//       message: faq.answer,
//       options: [
//         { label: "🔙 Back to FAQs", value: "faq_menu" },
//         { label: "📧 Still need help", value: "faq_not_listed" },
//       ],
//     });
//   }
// }

// // ---------- Fuzzy search for typed query ----------
// if (faqData.length > 0 && cmd === "faq_query") {
//   const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });
//   const results = fuse.search(text);

//   if (results.length > 0) {
//     response = {
//       type: "faq",
//       title: `💡 ${results[0].item.question}`,
//       message: results[0].item.answer,
//       options: [
//         { label: "🔙 Back to FAQs", value: "faq_menu" },
//         { label: "📧 Still need help", value: "faq_not_listed" },
//       ],
//     };
//   } else {
//     response = {
//       type: "faq",
//       title: "😅 Not Found",
//       message:
//         "I couldn't find an exact answer. You can email your query to **join-zuvy@navgurukul.org** 📧",
//       options: [
//         { label: "📧 Email Now", value: "mailto:join-zuvy@navgurukul.org" },
//         { label: "🔙 Back to FAQs", value: "faq_menu" },
//       ],
//     };
//   }

//   return res.json(response);
// }

//     // Save chat history: store the full response object for easy debugging later
//     try {
//       await fetch(GOOGLE_SCRIPT_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, query: text, response }),
//       });
//       console.log("✅ Chat saved to sheet");
//     } catch (err) {
//       console.error("❌ Failed saving chat:", err);
//     }

//     return res.json(response);
//   } catch (err) {
//     console.error("❌ Error in /query:", err);
//     return res.json({ type: "error", title: "Server Error", message: "Something went wrong, try again later." });
//   }
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
const PORT = process.env.PORT || 5000;

// ------------------------ SCRIPT URLS ------------------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfPh0XkA1rcZslA0-i_tuF6Rv6vy5tCGlWTvX5vh1qpLfztlDuqRFhKt0wrb_5WETB0Q/exec";
const FAQ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYdUpTc8uIBT4vLzOQUG7bu2FcQ9Lb-czyrpsq2acNRNF-2L0jooXRlQGbeVWQDp5_0A/exec";
const ATTENDANCE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrpSXko924OWmzSFx9gOef4mZgVEgKmZ6RuoZq4rPUplLWeCOjp2Uxg_PJf71Ejms8Bw/exec";
const ASSESSMENT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3T84K5jPFc38Gs6RE8nYFXmAK93iWSLF5wfAmxjQikgTZYjsgmXmcoDrIpUOF229aig/exec";
const MASTER_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZ1LGE85wi6SOKqlO-I2UspSx1R39J9Jj6bdlAmpepdx3PF8TH5rCmdXsyo1IAtTYxxg/exec";

// 🌐 GEMINI FALLBACK - for smart answers when FAQ not found
const GEMINI_API_KEY = "AIzaSyD_sV-rUyBbQDw7ACCiWIEgHyqxJLRLnC4";

async function getGeminiResponse(query) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [
        {
          parts: [
            {
              text: `You are the official Zuvy AI assistant of NavGurukul.
Always answer with verified facts about Zuvy, Bootcamp, LMS, Partnerships, or Students.
Keep answers short, clear, and friendly.

User asked: ${query}`,
            },
          ],
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t find any information on that right now.";

    return text;
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    return "I’m facing a technical issue. Please try again later.";
  }
}

// ------------------------ LOAD FAQ DATA ------------------------
// let faqData = [];
// async function loadFAQ() {
//   try {
//     const res = await fetch(FAQ_SCRIPT_URL);
//     const data = await res.json();
//     faqData = data.faqs || [];
//     console.log(`✅ FAQ loaded: ${faqData.length} entries`);
//   } catch (err) {
//     console.error("❌ Failed to load FAQ:", err);
//     faqData = [];
//   }
// }
// loadFAQ();
// let faqData = [];

// async function loadFAQ() {
//   try {
//     const res = await fetch(MASTER_SCRIPT_URL);
//     const data = await res.json();
//   //  faqData = (data.faqs || []).filter((f) => f.Visible?.toLowerCase() === "yes");
//   faqData = (data.items || []).filter((f) => String(f.Visible || "").toLowerCase() === "yes");

//      console.log(`✅ FAQ loaded: ${faqData.length} visible entries`);
//   } catch (err) {
//     console.error("❌ Failed to load FAQ:", err);
//     faqData = [];
//   }
// }
// loadFAQ();

let faqData = [];

async function loadFAQ() {
  try {
    const res = await fetch(MASTER_SCRIPT_URL);
    const data = await res.json();

    // Handle any possible structure (items, data, faqs, sheetData)
    const allFaqs =
      data.items ||
      data.data ||
      data.faqs ||
      data.sheetData ||
      data ||
      [];

    faqData = allFaqs.filter((f) => {
      const visible = String(f.Visible || "").toLowerCase();
      return visible === "yes" || visible === "true" || visible === "y";
    });

    console.log(`✅ FAQ loaded successfully: ${faqData.length} entries`);
    if (faqData.length === 0) console.log("⚠️ Warning: FAQ sheet might be empty or wrong key name.");
  } catch (err) {
    console.error("❌ Failed to load FAQ:", err);
    faqData = [];
  }
}

loadFAQ();


app.use(cors());
app.use(bodyParser.json());

// ------------------------ LEAD SOURCES ------------------------
const leadSources = {
  "faq_menu|Bootcamps": "Bootcamp Lead",
  "faq_menu|LMS Solutions": "LMS Lead",
  "faq_menu|Partnerships": "Partnership Lead",
  "faq_menu|Existing Learner": "Existing Learner",
};

// ------------------------ SAVE LEAD FUNCTION ------------------------
async function saveLead({ name, email, source, text }) {
  try {
    if (!email || !source) {
      console.warn("⚠️ Skipping lead save, missing email/source");
      return;
    }
    const res = await fetch(MASTER_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save_lead",
        name,
        email,
        source,
        query: text,
        timestamp: new Date().toISOString(),
      }),
    });
    const json = await res.json();
    if (json.ok) console.log("✅ Lead saved:", email, source);
    else console.error("❌ Failed to save lead:", json.error);
  } catch (err) {
    console.error("❌ Error saving lead:", err);
  }
}

// ------------------------ FETCH HELPERS ------------------------
async function fetchAssessment(email, assessmentNo = 1) {
  try {
    const url = `${ASSESSMENT_SCRIPT_URL}?email=${encodeURIComponent(email)}&assessmentNo=${assessmentNo}`;
    console.log(`📡 Fetching assessment ${assessmentNo} from: ${url}`);
    const res = await fetch(url);
    const json = await res.json();
    console.log(`📥 Assessment ${assessmentNo} raw response:`, JSON.stringify(json).slice(0, 1000));
    if (!json || json.status !== "success") return null;
    return json.data;
  } catch (err) {
    console.error("❌ Failed to fetch assessment:", err);
    return null;
  }
}

async function fetchAttendance(email) {
  try {
    const url = `${ATTENDANCE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
    console.log(`📡 Fetching attendance from: ${url}`);
    const res = await fetch(url);
    const json = await res.json();
    console.log("📥 Attendance raw response:", JSON.stringify(json).slice(0, 1000));
    if (!json || json.status !== "success") return null;
    return json.data;
  } catch (err) {
    console.error("❌ Failed to fetch attendance:", err);
    return null;
  }
}
async function getAvailableAssessments(email, limit = 30) {
  try {
    const requests = [];
    for (let i = 1; i <= limit; i++) {
      requests.push(fetchAssessment(email, i));
    }
    const results = await Promise.allSettled(requests);

    const available = [];
    results.forEach((r, idx) => {
      if (r.status === "fulfilled" && r.value) {
        available.push(idx + 1);
      }
    });

    console.log("ℹ️ available assessments for", email, ":", available);
    return available;
  } catch (err) {
    console.error("❌ Error while getting available assessments:", err);
    return [];
  }
}

// ------------------------ DETECT COMMAND ------------------------
function detectCommand(text = "") {
  if (!text) return "";
  const q = text.toString().toLowerCase().trim();

  if (q.startsWith("attendance_") || q.startsWith("assessment_") || q.startsWith("mailto:") || q.startsWith("faq")) {
    return q;
  }

  if (/\battendance\b/.test(q) && !/\bpercent\b|\bpresent\b|\babsent\b|\d+\b/.test(q)) return "attendance_menu";
  if (/\bpercent\b|\bpercentage\b|\battendance %\b/.test(q)) return "attendance_percentage";
  if (/\bpresent\b|\battended\b|\bpresent classes\b/.test(q)) return "attendance_present";
  if (/\babsent\b|\bmiss(ed)?\b|\bmissed classes\b/.test(q)) return "attendance_absent";
  if (/\babsent dates\b|\babsent_date\b/.test(q)) return "attendance_absent_dates";
  if (/\bpresent dates\b|\bpresent_date\b/.test(q)) return "attendance_present_dates";
  if (/\bassessment\b/.test(q) && !/\b\d+\b/.test(q)) return "assessment_menu";

  const m = q.match(/\bassessment\s*(no\.?|number|\s)?\s*(\d{1,2})\b/);
  if (m && m[2]) return `assessment_${Number(m[2])}`;
  return "faq_query";
}
// ------------------------ DETECT CATEGORY ------------------------
function detectCategory(text = "") {
  const q = text.toLowerCase();
  if (q.includes("attendance") || q.includes("absent") || q.includes("present"))
    return "Attendance";
  if (q.includes("assessment") || q.includes("test") || q.includes("exam"))
    return "Assessment";
  if (q.includes("bootcamp") || q.includes("course") || q.includes("join") || q.includes("fees"))
    return "Bootcamp";
  if (q.includes("lms") || q.includes("dashboard") || q.includes("portal"))
    return "LMS Solutions";
  if (q.includes("partner") || q.includes("collab") || q.includes("csr"))
    return "Partnerships";
  return "General";
}


// ------------------------ NORMALIZE DATA ------------------------
function normalizeAssessmentData(raw) {
  if (!raw) return raw;
  const get = (keys) => {
    for (const k of keys) {
      if (Object.prototype.hasOwnProperty.call(raw, k)) {
        const v = raw[k];
        if (v !== undefined && v !== null && v !== "") return v;
      }
    }
    return null;
  };
  return {
    name: get(["Name", "Student Name", "Full Name", "name"]) || "Unknown Student",
    qualified: get(["Qualified", "Result", "Status", "qualified"]) || "N/A",
    percentage: get(["Percentage", "Percentage (%)", "Attendance (%)", "percentage"]) || "N/A",
    codingScore: get(["Coding Score", "Coding", "codingScore"]) || "N/A",
    mcqScore: get(["MCQ Score", "MCQ", "mcqScore"]) || "N/A",
    tabChanged: get(["Tab Changed", "TabChanged", "tabChanged"]) ?? 0,
    copyPasted: get(["Copy Pasted", "CopyPasted", "copyPasted"]) ?? 0,
    assessmentNo: get(["Assessment No", "Assessment", "AssessmentNo"]) || "N/A",
    raw,
  };
}

function getAttendanceFollowupButtons(exclude = "") {
  const all = [
    { label: "📈 What is my attendance?", value: "attendance_percentage" },
    { label: "📉 Why is my attendance low?", value: "attendance_reason" },
    { label: "❌ Show absent dates", value: "attendance_absent_dates" },
  ];
  return all.filter((btn) => btn.value !== exclude);
}

// ------------------------ MAIN QUERY HANDLER ------------------------
app.post("/query", async (req, res) => {
  const { name = "Student", email = "", text = "" } = req.body || {};
  console.log(`\n📩 Incoming - ${name} (${email}):`, text);

  const cmd = detectCommand(text);
  console.log("🔎 Detected command:", cmd);

  // 🎯 Lead Source Logic
  let leadSource = null;
  if (leadSources[cmd]) leadSource = leadSources[cmd];

  if (leadSource && (!email || email.trim() === "")) {
    return res.json({
      type: "form",
      title: "📧 Please share your email",
      message: `To explore ${leadSource}, please provide your email address 👇`,
      fields: [
        { label: "Full Name", type: "text", name: "name", required: true },
        { label: "Email", type: "email", name: "email", required: true },
      ],
      submitLabel: "Submit",
    });
  }
  if (leadSource && email && email.trim() !== "") {
    await saveLead({ name, email, source: leadSource, text });
  }

  let response = { type: "text", title: "🤔 Bot Reply", message: "Hmm... let me check that for you!" };


  try {
    // ---------- Attendance menu ----------

if (cmd === "attendance_menu") {
  // Step 1: Intro Message
  response = {
    type: "text",
    title: "🧾 Attendance Query",
    message: "Here are your attendance options 👇",
  };

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, query: text, response }),
  });

  // Step 2: Show all question buttons
  response = {
    type: "options",
    title: "📅 Attendance Menu",
    message: "Choose what you want to check:",
    options: [
      { label: "📈 What is my attendance?", value: "attendance_percentage" },
      { label: "📉 Why is my attendance low?", value: "attendance_reason" },
      // { label: "✅ Show present dates", value: "attendance_present_dates" },
      { label: "❌ Show absent dates", value: "attendance_absent_dates" },
    ],
  };
  return res.json(response);
}

if (cmd.startsWith("attendance_")) {
  const attendance = await fetchAttendance(email);
  if (!attendance) {
    response = {
      type: "text",
      title: "📅 Attendance",
      message: `Sorry ${name}, I couldn't find your attendance data right now.`,
    };
    return res.json(response);
  }

  // ✅ Date formatter
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        weekday: "short",
      });
    } catch {
      return dateStr;
    }
  };

  // ✅ Handle multiple key names
  const presentDatesRaw =
    attendance.presentDates ||
    attendance.present ||
    attendance["Present Dates"] ||
    attendance["Present_Date"] ||
    [];
  const absentDatesRaw =
    attendance.absentDates ||
    attendance.absents ||
    attendance["Absent Dates"] ||
    attendance["Absent_Date"] ||
    [];

  const presentDates = presentDatesRaw.map(formatDate);
  const absentDates = absentDatesRaw.map(formatDate);

  const total = attendance.totalClasses ?? attendance.total ?? 0;
  const present = attendance.attendanceCount ?? attendance.presentCount ?? 0;
  const percent = attendance.computedPercentage ?? attendance.percentage ?? "N/A";
  const absent = total - present;

  // 🎯 All buttons (consistent)
  const followupOptions = [
    { label: "📈 What is my attendance?", value: "attendance_percentage" },
    { label: "📉 Why is my attendance low?", value: "attendance_reason" },
    // { label: "✅ Show present dates", value: "attendance_present_dates" },
  
    { label: "❌ Show absent dates", value: "attendance_absent_dates" },
  ];

  // 📈 Attendance %
  if (cmd === "attendance_percentage") {
    response = {
      type: "attendance",
      title: "📈 Attendance Overview",
      message: `Your attendance is **${percent}%** (${present}/${total} classes attended).`,
      // options: followupOptions,
      options: getAttendanceFollowupButtons(cmd), 
    };
    return res.json(response);
  }

  // 📉 Why is my attendance low?
  if (cmd === "attendance_reason") {
    response = {
      type: "attendance",
      title: "📉 Attendance Reason",
      message: `Your attendance is low because you missed **${absent} days** out of ${total}.`,
      // options: followupOptions,
      options: getAttendanceFollowupButtons(cmd), 
    };
    return res.json(response);
  }

  // ✅ Present Dates (numbered list)
  if (cmd === "attendance_present_dates") {
    const list = presentDates.map((d, i) => `${i + 1}. ${d}`).join("\n");
    response = {
      type: "attendance",
      title: "✅ Present Dates",
      message: presentDates.length
        ? `You were present on:\n${list}`
        : "No present dates found.",
      // options: followupOptions,
      options: getAttendanceFollowupButtons(cmd), 
    };
    return res.json(response);
  }

  // ❌ Absent Dates (numbered list)
  if (cmd === "attendance_absent_dates") {
    const list = absentDates.map((d, i) => `${i + 1}. ${d}`).join("\n");
    response = {
      type: "attendance",
      title: "❌ Absent Dates",
      message: absentDates.length
        ? `You were absent on:\n${list}`
        : "No absent dates found.",
      // options: followupOptions,
      options: getAttendanceFollowupButtons(cmd), 
    };
    return res.json(response);
  }

  // fallback
  response = {
    type: "text",
    title: "📅 Attendance",
    message: "Please choose what you want to check.",
    options: followupOptions,
  };
  return res.json(response);
}


    // ---------- Assessment menu (show available assessments from sheet) ----------
    // if (cmd === "assessment_menu") {
    //   // discover available assessments (1..30) in parallel
    //   const available = await getAvailableAssessments(email, 30);
    if (cmd === "assessment_menu") {
  // Step 1: Bot says line
  response = {
    type: "text",
    title: "🧾 Assessment Query",
    message: "What is my assessment?",
  };
  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, query: text, response }),
  });

  // Step 2: Now fetch assessments
  const available = await getAvailableAssessments(email, 30);

      if (!available || available.length === 0) {
        response = {
          type: "text",
          title: "🧾 Assessments",
          message: "Sorry, I couldn't find any assessments for your account yet.",
        };
        return res.json(response);
      }

      const options = available.map((n) => ({ label: `Assessment ${n}`, value: `assessment_${n}` }));
      response = {
        type: "options",
        title: "🧾 Assessments",
        message: "Which assessment do you want to check?",
        options,
        maxAssessment: Math.max(...available),
      };
      return res.json(response);
    }

//     // ---------- Assessment details ----------
//     if (cmd.startsWith("assessment_")) {
//       const parts = cmd.split("_");
//       const num = parseInt(parts[1], 10);
//       if (isNaN(num)) {
//         response = { type: "text", title: "🧾 Assessment", message: "Please select a valid assessment number." };
//         return res.json(response);
//       }

//       const raw = await fetchAssessment(email, num);
//       if (!raw) {
//         response = {
//           type: "text",
//           title: "🧾 Assessment",
//           message: `Arre bhai! Assessment ${num} abhi tak hua hi nahi 😅. Try a smaller number.`,
//         };
//         return res.json(response);
//       }

//       const norm = normalizeAssessmentData(raw);

//       response = {
//         type: "assessment",
//         title: `📊 Assessment ${num} Report`,
//         message: `Here are your details:`,
//         data: {
//   name: norm.name,
//   qualified: norm.qualified,
//   percentage: norm.percentage,
//   codingScore: norm.codingScore,
//   mcqScore: norm.mcqScore,
//   tabChanged: norm.tabChanged,
//   copyPasted: norm.copyPasted,
//   assessmentNo: num,
//   raw: norm.raw,
// },

//       };
//       return res.json(response);
//     }
// ---------- Assessment details ----------
if (cmd.startsWith("assessment_")) {
  const parts = cmd.split("_");
  const num = parseInt(parts[1], 10);
  if (isNaN(num)) {
    response = {
      type: "text",
      title: "🧾 Assessment",
      message: "Please select a valid assessment number.",
    };
    return res.json(response);
  }

  const raw = await fetchAssessment(email, num);
  if (!raw) {
    response = {
      type: "text",
      title: "🧾 Assessment",
      message: `Arre bhai! Assessment ${num} abhi tak hua hi nahi 😅. Try a smaller number.`,
    };
    return res.json(response);
  }

  // ✅ Normalize and extract data
  const norm = normalizeAssessmentData(raw);

  // ✅ Create formatted fields (table)
  const fields = [
    { name: "🧾 Assessment No", value: num },
    { name: "💻 Coding Score", value: norm.codingScore || "N/A" },
    { name: "🧠 MCQ Score", value: norm.mcqScore || "N/A" },
    {
      // name: "📊 Percentage",
      // value: norm.percentage && norm.percentage !== "N/A"
      //   ? `${norm.percentage}%`
      //   : "N/A",
      name: "📊 Percentage",
  value: (() => {
    let val = parseFloat(norm.percentage);
    if (isNaN(val)) return "N/A";
    if (val <= 1) val = val * 100; // Convert 0.98 → 98
    return `${val.toFixed(2)}%`;
  })(),
    },
    { name: "📋 Tab Changed", value: norm.tabChanged ?? 0 },
    { name: "📎 Copy Pasted", value: norm.copyPasted ?? 0 },
  ];

  // ✅ Send structured response
  response = {
    type: "table", // let frontend render a nice table
    title: `🧾 Assessment ${num} Report`,
    message: `${norm.name}\n${norm.qualified === true || norm.qualified === "Qualified"
      ? "✅ Qualified"
      : "❌ Not Qualified"
      }`,
    fields,
  };

  // ✅ Save chat in sheet
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, query: text, response }),
    });
    console.log("✅ Assessment saved to sheet");
  } catch (err) {
    console.error("❌ Failed saving assessment chat:", err);
  }

  return res.json(response);
}


//     // ---------- FAQ search (fallback) ----------
//     if (cmd === "faq_menu") {
//   response = {
//     type: "options",
//     title: "💡 General Queries",
//     message: "Choose a query or type your own:",
//     options: [
//       { label: "How to join a class?", value: "faq_how_to_join_class" },
//       { label: "How to check my course progress?", value: "faq_course_progress" },
//       { label: "Who to contact for technical issues?", value: "faq_contact_support" },
//       { label: "📧 Email support", value: "mailto:join-zuvy@navgurukul.org" },
//       { label: "🔍 Type your own query", value: "faq" },
//     ],
//   };
//   return res.json(response);
// }

//     if (faqData.length > 0) {
//       // If the detected command is "faq_query" or default, do fuzzy search
//       const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });
//       const results = fuse.search(text);

//       if (results.length > 0) {
//         response = {
//           type: "faq",
//           title: "💡 Answer",
//           message: results[0].item.answer,
//         };
//       } else {
//         response = {
//           type: "faq",
//           title: "😅 Not Found",
//           message: "I couldn't find an exact answer.",
//           options: [{ label: "📧 join-zuvy@navgurukul.org", value: "mailto:join-zuvy@navgurukul.org" }],
//         };
//       }
//     }
// 
// ---------- CATEGORY-BASED FAQ MENU ----------
if (cmd === "faq_menu") {
  // 🔹 Ask user which category they want
  return res.json({
    type: "options",
    title: "💬 Choose a Category",
    message: "Please select what you want to explore 👇",
    options: [
      { label: "🎓 Existing Learner", value: "faq_menu_Existing Learner" },
      { label: "💻 Explore Bootcamps", value: "faq_menu_Explore Bootcamps" },
      { label: "🏢 LMS Solutions", value: "faq_menu_LMS Solutions" },
      { label: "🤝 Partnerships", value: "faq_menu_Partnerships" },
      { label: "📞 Contact Us", value: "faq_menu_All" },
    ],
  });
}

if (text.startsWith("faq_menu_")) {
  const rawCategory = text.replace("faq_menu_", "").trim().toLowerCase();

  const categoryMap = {
    "existing learner": "Existing Learner",
    "explore bootcamps": "Bootcamp",
    "bootcamp": "Bootcamp",
    "bootcamps": "Bootcamp",
    "lms solutions": "LMS Solutions",
    "lms": "LMS Solutions",
    "partnerships": "Partnerships",
    "partnership": "Partnerships",
    "all": "All",
  };

  const normalizedCategory =
    categoryMap[rawCategory] ||
    rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

  console.log("📂 Category requested:", normalizedCategory);

  try {
    // ✅ Step 1: Fetch FAQs sheet data
    const faqUrl =
      "https://script.google.com/macros/s/AKfycbxZ1LGE85wi6SOKqlO-I2UspSx1R39J9Jj6bdlAmpepdx3PF8TH5rCmdXsyo1IAtTYxxg/exec"; // ⚠️ apna Apps Script WebApp URL daal
    const response = await fetch(faqUrl);
    const data = await response.json();

    // ✅ Step 2: Filter and sort
    const faqData = (data.items || [])
      .filter(
        (f) =>
          String(f.Visible || "").toLowerCase() === "yes" &&
          (normalizedCategory === "All" ||
            String(f.Category || "")
              .toLowerCase()
              .includes(normalizedCategory.toLowerCase()))
      )
      .sort(
        (a, b) => (parseInt(a.Priority) || 999) - (parseInt(b.Priority) || 999)
      );

    // ✅ Step 3: If no data found
    if (!faqData.length) {
      return res.json({
        type: "text",
        title: "🤔 No FAQs found",
        message: `Couldn't find FAQs for category: ${normalizedCategory}`,
      });
    }

    // ✅ Step 4: Create options
    const faqOptions = faqData.map((f) => ({
      label: f.Question,
      value: `faq_query_${f.Question}`,
    }));

    return res.json({
      type: "options",
      title: `📘 ${normalizedCategory} FAQs`,
      message: "Choose a question 👇",
      options: faqOptions,
    });
  } catch (err) {
    console.error("❌ Error fetching FAQs:", err);
    return res.json({
      type: "error",
      message:
        "⚠️ Couldn't fetch FAQs right now. Please try again or contact join-zuvy@navgurukul.org",
    });
  }
}


if (text.startsWith("faq_query_")) {
  const question = text.replace("faq_query_", "").trim().toLowerCase();
  console.log("🔎 Searching answer for:", question);

  try {
    // ✅ Use your already working FAQ script URL
    const faqUrl = MASTER_SCRIPT_URL;
    const response = await fetch(faqUrl);
    const data = await response.json();

    // 🧠 Handle multiple possible keys
    const allFaqs = data.items || data.data || data.faqs || data.sheetData || [];

    // ✅ Find the matching FAQ (by question text)
    const faqItem = allFaqs.find((f) => {
      const q = String(f.Question || "").trim().toLowerCase();
      return (
        q === question ||
        q.replace(/[^a-z0-9]/g, "") === question.replace(/[^a-z0-9]/g, "") // remove punctuation/spacing
      );
    });

    // if (!faqItem) {
    //   console.warn("⚠️ No match found for", question);
    //   return res.json({
    //     type: "text",
    //     title: "😅 Not Found",
    //     message:
    //       "Could not find that FAQ. Please email join-zuvy@navgurukul.org.",
    //   });
    // }
    if (!faqItem) {
  console.warn("⚠️ No match found for", question);
  return res.json({
    type: "text",
    title: "We’re here to help 💚",
    message: `
      I couldn’t find an answer to that just now 🤔<br />
      But no worries — our team is here for you! 💚<br /><br />
      You can reach us anytime at 
      <a href="mailto:join-zuvy@navgurukul.org"
         class="text-green-600 font-semibold underline hover:text-green-700 transition">
         join-zuvy@navgurukul.org
      </a> 💌
    `,
    options: [
      { label: "💡 Explore FAQs", value: "faq_menu" },
      { label: "📧 Email Support", value: "mailto:join-zuvy@navgurukul.org" },
    ],
  });
}

    // ✅ Found — show LongAnswer or ShortAnswer
    const answerText =
      (faqItem.LongAnswer || faqItem.ShortAnswer || "").trim() ||
      "No detailed answer available.";

    console.log("✅ FAQ Found:", faqItem.Question);

    return res.json({
      type: "text",
      title: `📖 ${faqItem.Question}`,
      message: answerText,
    });
  } catch (err) {
    console.error("❌ Error fetching FAQ answer:", err);
    return res.json({
      type: "error",
      message:
        "⚠️ Couldn't fetch FAQ answer. Please try again or email join-zuvy@navgurukul.org.",
    });
  }
}


// // ---------- Handle Clicking a Specific FAQ ----------
// if (cmd.startsWith("faq_")) {
//   // Example: faq_Explore Bootcamps_0 or faq_not_listed_Explore Bootcamps
//   if (cmd.includes("not_listed")) {
//     const category = cmd.replace("faq_not_listed_", "");
//     return res.json({
//       type: "faq",
//       title: "📧 Need More Help?",
//       message: `No worries! You can email your query to **join-zuvy@navgurukul.org**.\nOur team will get back to you soon.`,
//       options: [
//         { label: "📧 Email Now", value: "mailto:join-zuvy@navgurukul.org" },
//         { label: "🔙 Back to Categories", value: "faq_menu" },
//         { label: `🔙 Back to ${category} FAQs`, value: `faq_menu_${category}` },
//       ],
//     });
//   }

//   // Extract category and index
//   const parts = cmd.split("_");
//   const category = parts[1];
//   const index = parseInt(parts[2], 10);

//   const filtered = faqData
//     .filter(
//       (f) =>
//         f.Category &&
//         (f.Category.toLowerCase() === category.toLowerCase() ||
//           (category === "All" && f.Category.toLowerCase() === "all")) &&
//         f.Visible?.toLowerCase() === "yes"
//     )
//     .sort((a, b) => Number(a.Priority) - Number(b.Priority));

//   if (!isNaN(index) && filtered[index]) {
//     const faq = filtered[index];
//     return res.json({
//       type: "faq",
//       title: `💡 ${faq.Question}`,
//       message: `${faq.LongAnswer || faq.ShortAnswer || "No details available."}`,
//       options: [
//         { label: `🔙 Back to ${category} FAQs`, value: `faq_menu_${category}` },
//         { label: "📧 Still need help", value: `faq_not_listed_${category}` },
//       ],
//     });
//   }
// }
// 
// ---------- Handle Clicking a Specific FAQ ----------
if (cmd.startsWith("faq_")) {
  // Handle "not listed"
  if (cmd.includes("not_listed")) {
    const category = cmd.replace("faq_not_listed_", "");
    return res.json({
      type: "faq",
      title: "📧 Need More Help?",
      message: `No problem! You can email your query to **join-zuvy@navgurukul.org** and our team will reply soon.`,
      options: [
        { label: "📧 Email Now", value: "mailto:join-zuvy@navgurukul.org" },
        { label: "🔙 Back to Categories", value: "faq_menu" },
        { label: `🔙 Back to ${category} FAQs`, value: `faq_menu_${category}` },
      ],
    });
  }

  // Parse the category & index
  const parts = cmd.split("_");
  const category = parts[1];
  const index = parseInt(parts[2], 10);

  const filtered = faqData
    .filter((f) => {
      const cat = String(f.Category || "").trim().toLowerCase();
      const visible = String(f.Visible || "").trim().toLowerCase() === "yes";
      return visible && (
        cat === category.toLowerCase() ||
        cat.includes(category.toLowerCase()) ||
        category.toLowerCase().includes(cat)
      );
    })
    .sort((a, b) => Number(a.Priority || 9999) - Number(b.Priority || 9999));

  if (!isNaN(index) && filtered[index]) {
    const faq = filtered[index];
    return res.json({
      type: "faq",
      title: `💡 ${faq.Question}`,
      message: faq.LongAnswer || faq.ShortAnswer || "No details available.",
      options: [
        { label: `🔙 Back to ${category} FAQs`, value: `faq_menu_${category}` },
        { label: "📧 Still need help", value: `faq_not_listed_${category}` },
      ],
    });
  }

  // fallback
  return res.json({
    type: "faq",
    title: "😅 Not Found",
    message: `Could not find that FAQ. Please email join-zuvy@navgurukul.org.`,
    options: [{ label: "📧 Contact Support", value: "mailto:join-zuvy@navgurukul.org" }],
  });
}




// ---------- Fuzzy search for typed query ----------
// if (faqData.length > 0 && cmd === "faq_query") {
//   const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });
//   const results = fuse.search(text);

//   if (results.length > 0) {
//     response = {
//       type: "faq",
//       title: `💡 ${results[0].item.question}`,
//       message: results[0].item.answer,
//       options: [
//         { label: "🔙 Back to FAQs", value: "faq_menu" },
//         { label: "📧 Still need help", value: "faq_not_listed" },
//       ],
//     };
//   } else {
//     response = {
//       type: "faq",
//       title: "😅 Not Found",
//       message:
//         "I couldn't find an exact answer. You can email your query to **join-zuvy@navgurukul.org** 📧",
//       options: [
//         { label: "📧 Email Now", value: "mailto:join-zuvy@navgurukul.org" },
//         { label: "🔙 Back to FAQs", value: "faq_menu" },
//       ],
//     };
//   }

//   return res.json(response);
// }
// 💬 When user clicks a specific FAQ question



    // Save chat history: store the full response object for easy debugging later
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, query: text, response }),
      });
      console.log("✅ Chat saved to sheet");
    } catch (err) {
      console.error("❌ Failed saving chat:", err);
    }
   // ---------- SMART FAQ MATCHING WITH CATEGORY DETECTION ----------
if (cmd === "faq_query") {
  console.log("💬 Smart search for:", text);

  try {
    // 1️⃣ Detect category from text
    const category = detectCategory(text);
    console.log("📂 Detected category:", category);

    // 2️⃣ If it's assessment or attendance type → redirect
    if (["Attendance", "Assessment"].includes(category)) {
      return res.json({
        type: "text",
        title: `📋 ${category} Information`,
        message: `To check your ${category.toLowerCase()}, please start the chat using your registered email address so I can fetch your records.`,
        options: [
          { label: "🔙 Back to Menu", value: "faq_menu" },
          { label: "📧 Contact Support", value: "mailto:join-zuvy@navgurukul.org" },
        ],
      });
    }

    // 3️⃣ Load FAQ data if not loaded yet
    if (!faqData || faqData.length === 0) {
      console.warn("⚠️ FAQ data not loaded yet, reloading...");
      await loadFAQ();
    }

    // 4️⃣ Filter FAQs by detected category (or use all for General)
    const filteredFaqs =
      category === "General"
        ? faqData
        : faqData.filter((f) =>
            String(f.Category || "")
              .toLowerCase()
              .includes(category.toLowerCase())
          );

    console.log(`🔍 Searching within ${filteredFaqs.length} FAQs of ${category} category`);

    // 5️⃣ Use Fuse.js fuzzy search
    const fuse = new Fuse(filteredFaqs, {
      keys: ["Question", "ShortAnswer", "LongAnswer"],
      threshold: 0.4,
      includeScore: true,
    });

    const results = fuse.search(text);

    if (results.length > 0 && results[0].score < 0.5) {
      const best = results[0].item;
      console.log("✅ Match found:", best.Question);

      return res.json({
        type: "faq",
        title: `💡 ${best.Question}`,
        message:
          best.LongAnswer?.trim() ||
          best.ShortAnswer?.trim() ||
          "No detailed answer available.",
        options: [
          { label: "🔙 Back to FAQs", value: "faq_menu" },
          { label: "📧 Still need help", value: "faq_not_listed_All" },
        ],
      });
    }

    // 6️⃣ No good match found → temporary fallback (Gemini later)
    console.warn("⚠️ No FAQ match found for:", text);
    return res.json({
  type: "text",
  title: "We’re here to help 💚",
  message: `
    I couldn’t find an answer to that just now 🤔<br />
    But no worries — our team is here for you! 💚<br /><br />
    You can reach us anytime at 
    <a href="mailto:join-zuvy@navgurukul.org"
       class="text-green-600 font-semibold underline hover:text-green-700 transition">
       join-zuvy@navgurukul.org
    </a> 💌
  `,
  options: [
    { label: "💡 Explore FAQs", value: "faq_menu" },
    { label: "📧 Email Support", value: "mailto:join-zuvy@navgurukul.org" },
  ],
});

  } catch (err) {
    console.error("❌ Error in smart FAQ:", err);
    return res.json({
      type: "error",
      title: "Server Error",
      message: "Something went wrong while processing your question.",
    });
  }
}


// ---------- FINAL FALLBACK (Gemini) ----------
if (!response || (response.message === "Hmm... let me check that for you!")) {
  console.log("🧠 FAQ not found → Using Gemini fallback");

  const aiAnswer = await getGeminiResponse(text);

  response = {
    type: "ai",
    title: "🤖 Zuvy AI (Gemini)",
    message: aiAnswer,
  };

  return res.json(response);
}

    return res.json(response);
  } catch (err) {
    console.error("❌ Error in /query:", err);
    return res.json({ type: "error", title: "Server Error", message: "Something went wrong, try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot API running at http://localhost:${PORT}`);
});
