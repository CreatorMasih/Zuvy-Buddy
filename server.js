import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import Fuse from "fuse.js";

const app = express(); 
const PORT = process.env.PORT || 5000;


// Student chat history script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfPh0XkA1rcZslA0-i_tuF6Rv6vy5tCGlWTvX5vh1qpLfztlDuqRFhKt0wrb_5WETB0Q/exec";

// FAQ script
const FAQ_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYdUpTc8uIBT4vLzOQUG7bu2FcQ9Lb-czyrpsq2acNRNF-2L0jooXRlQGbeVWQDp5_0A/exec";
let faqData = [];

// Attendance script
const ATTENDANCE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrpSXko924OWmzSFx9gOef4mZgVEgKmZ6RuoZq4rPUplLWeCOjp2Uxg_PJf71Ejms8Bw/exec";
// const ATTENDANCE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNtYqt8JcBaZfi2z0vLZLnoqru9k52aH6CBqA1_If95wdEQw-5_LDEyUPtGUs2y0uaGw/exec";


// Assessment script (returns one assessment row when given assessmentNo)
const ASSESSMENT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3T84K5jPFc38Gs6RE8nYFXmAK93iWSLF5wfAmxjQikgTZYjsgmXmcoDrIpUOF229aig/exec";

async function loadFAQ() {
  try {
    const res = await fetch(FAQ_SCRIPT_URL);
    const data = await res.json();
    faqData = data.faqs || [];
    console.log(`✅ FAQ loaded: ${faqData.length} entries`);
  } catch (err) {
    console.error("❌ Failed to load FAQ:", err);
    faqData = [];
  }
}
loadFAQ();

app.use(cors());
app.use(bodyParser.json());

// Helper: fetch assessment row (returns data or null)
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

// Helper: fetch attendance row (returns json or null)
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

// detect intent/command robustly
function detectCommand(text = "") {
  if (!text) return "";

  const q = text.toString().toLowerCase().trim();

  // If user sends explicit command tokens, return them directly
  // Accept "attendance_percentage", "assessment_2", "mailto:...", etc.
  if (q.startsWith("attendance_") || q.startsWith("assessment_") || q.startsWith("mailto:") || q.startsWith("faq")) {
    return q;
  }

  // Natural language mappings (simple)
  if (/\battendance\b/.test(q) && !/\bpercent\b|\bpresent\b|\babsent\b|\d+\b/.test(q)) {
    return "attendance_menu";
  }
  if (/\bpercent\b|\bpercentage\b|\battendance %\b/.test(q)) return "attendance_percentage";
  if (/\bpresent\b|\battended\b|\bpresent classes\b/.test(q)) return "attendance_present";
  if (/\babsent\b|\bmiss(ed)?\b|\bmissed classes\b/.test(q)) return "attendance_absent";
  if (/\babsent dates\b|\babsent_date\b/.test(q)) return "attendance_absent_dates";
  if (/\bpresent dates\b|\bpresent_date\b/.test(q)) return "attendance_present_dates";

  if (/\bassessment\b/.test(q) && !/\b\d+\b/.test(q)) return "assessment_menu";
  // capture "assessment 2" or "assessment no 3"
  const m = q.match(/\bassessment\s*(no\.?|number|\s)?\s*(\d{1,2})\b/);
  if (m && m[2]) {
    return `assessment_${Number(m[2])}`;
  }
  const m2 = q.match(/\b(\d{1,2})\b/); // if just a number, assume assessment number (only if context suggests)
  // don't auto-return numeric alone — keep safe; only if it has 'assessment' anywhere earlier we matched

  // fallback: treat as FAQ/natural query
  return "faq_query";
}

// Get available assessments for email (1..30). returns array of numbers found (parallel)
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
//     name: get(["Name", "Student Name", "Full Name"]) || "Unknown Student",
//     qualified: get(["Qualified", "Result", "Status"]) || "N/A",
//     percentage:
//       get([
//         "Percentage",
//         "Percentage (%)",
//         "Percentage (%) ",
//         "Attendance (%)",
//         "Attendance (%) ",
//       ]) || "N/A",
//     codingScore: get(["Coding Score", "Coding", "CodingScore"]) || "N/A",
//     mcqScore: get(["MCQ Score", "MCQ", "MCQScore"]) || "N/A",
//     tabChanged:
//       get(["Tab Changed", "TabChanged", "tabChanged", "Tab Changed "]) ?? 0,
//     copyPasted:
//       get(["Copy Pasted", "CopyPasted", "copyPasted", "Copy Pasted "]) ?? 0,
//     assessmentNo: get(["Assessment No", "Assessment", "AssessmentNo"]) || "N/A",
//     raw,
//   };
// }
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
    name:
      get(["Name", "Student Name", "Full Name", "name"]) || "Unknown Student",
    qualified:
      get(["Qualified", "Result", "Status", "qualified"]) || "N/A",
    percentage:
      get([
        "Percentage",
        "Percentage (%)",
        "Attendance (%)",
        "percentage",
        "Percentage (%) ",
      ]) || "N/A",
    codingScore:
      get(["Coding Score", "Coding", "codingScore", "CodingScore"]) || "N/A",
    mcqScore:
      get(["MCQ Score", "MCQ", "mcqScore", "MCQScore"]) || "N/A",
    tabChanged:
      get(["Tab Changed", "TabChanged", "tabChanged"]) ?? 0,
    copyPasted:
      get(["Copy Pasted", "CopyPasted", "copyPasted"]) ?? 0,
    assessmentNo:
      get(["Assessment No", "Assessment", "AssessmentNo"]) || "N/A",
    raw,
  };
}





/**
 * Main Query Endpoint
 * Accepts body: { name, email, text }
 * text can be normal user question OR a command token (like "attendance_percentage" or "assessment_2")
 */
// function getAttendanceFollowupButtons(exclude = "") {
//   const all = [
//     { label: "📈 What is my attendance?", value: "attendance_percentage" },
//     { label: "📉 Why is my attendance low?", value: "attendance_reason" },
//     { label: "✅ Show present dates", value: "attendance_present_dates" },
//     { label: "❌ Show absent dates", value: "attendance_absent_dates" },
//   ];
//   return all.filter((btn) => btn.value !== exclude);
// }
function getAttendanceFollowupButtons(exclude = "") {
  const all = [
    { label: "📈 What is my attendance?", value: "attendance_percentage" },
    { label: "📉 Why is my attendance low?", value: "attendance_reason" },
    // { label: "✅ Show present dates", value: "attendance_present_dates" },
    { label: "❌ Show absent dates", value: "attendance_absent_dates" },
  ];
  return all.filter((btn) => btn.value !== exclude);
}


app.post("/query", async (req, res) => {
  const { name = "Student", email = "", text = "" } = req.body || {};
  console.log(`\n📩 Incoming - ${name} (${email}):`, text);

  const cmd = detectCommand(text);
  console.log("🔎 Detected command:", cmd);

  // default fallback response
  let response = {
    type: "text",
    title: "🤔 Bot Reply",
    message: "Hmm... let me check that for you!",
  };

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

    // ---------- Assessment details ----------
    if (cmd.startsWith("assessment_")) {
      const parts = cmd.split("_");
      const num = parseInt(parts[1], 10);
      if (isNaN(num)) {
        response = { type: "text", title: "🧾 Assessment", message: "Please select a valid assessment number." };
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

      const norm = normalizeAssessmentData(raw);

      response = {
        type: "assessment",
        title: `📊 Assessment ${num} Report`,
        message: `Here are your details:`,
        data: {
  name: norm.name,
  qualified: norm.qualified,
  percentage: norm.percentage,
  codingScore: norm.codingScore,
  mcqScore: norm.mcqScore,
  tabChanged: norm.tabChanged,
  copyPasted: norm.copyPasted,
  assessmentNo: num,
  raw: norm.raw,
},

      };
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
// ---------- FAQ Section ----------
if (cmd === "faq_menu") {
  if (!faqData || faqData.length === 0) {
    return res.json({
      type: "text",
      title: "💡 General Queries",
      message: "Sorry, FAQ data is not loaded yet. Please try again later.",
    });
  }

  // 🔹 Convert all FAQs into clickable options
  const faqOptions = faqData.map((f, i) => ({
    label: f.question,
    value: `faq_${i}`,
  }));

  // 🔹 Add “My query is not listed” option at end
  faqOptions.push({
    label: "🔍 My query is not listed",
    value: "faq_not_listed",
  });

  // 🔹 Response showing all FAQs
  const response = {
    type: "options",
    title: "💡 General Queries",
    message: "Here are some frequently asked questions 👇",
    options: faqOptions,
  };

  // Save interaction in sheet
  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, query: text, response }),
  });

  return res.json(response);
}

// ---------- Handle clicking a FAQ ----------
if (cmd.startsWith("faq_")) {
  // If "My query is not listed"
  if (cmd === "faq_not_listed") {
    return res.json({
      type: "faq",
      title: "📧 Need More Help?",
      message:
        "No problem! You can email your query to **join-zuvy@navgurukul.org**. Our support team will get back to you soon.",
      options: [
        { label: "📧 Email Now", value: "mailto:join-zuvy@navgurukul.org" },
        { label: "🔙 Back to FAQs", value: "faq_menu" },
      ],
    });
  }

  // Otherwise, it's a specific FAQ like faq_0, faq_1...
  const index = parseInt(cmd.split("_")[1], 10);
  if (!isNaN(index) && faqData[index]) {
    const faq = faqData[index];
    return res.json({
      type: "faq",
      title: `💡 ${faq.question}`,
      message: faq.answer,
      options: [
        { label: "🔙 Back to FAQs", value: "faq_menu" },
        { label: "📧 Still need help", value: "faq_not_listed" },
      ],
    });
  }
}

// ---------- Fuzzy search for typed query ----------
if (faqData.length > 0 && cmd === "faq_query") {
  const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });
  const results = fuse.search(text);

  if (results.length > 0) {
    response = {
      type: "faq",
      title: `💡 ${results[0].item.question}`,
      message: results[0].item.answer,
      options: [
        { label: "🔙 Back to FAQs", value: "faq_menu" },
        { label: "📧 Still need help", value: "faq_not_listed" },
      ],
    };
  } else {
    response = {
      type: "faq",
      title: "😅 Not Found",
      message:
        "I couldn't find an exact answer. You can email your query to **join-zuvy@navgurukul.org** 📧",
      options: [
        { label: "📧 Email Now", value: "mailto:join-zuvy@navgurukul.org" },
        { label: "🔙 Back to FAQs", value: "faq_menu" },
      ],
    };
  }

  return res.json(response);
}

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

    return res.json(response);
  } catch (err) {
    console.error("❌ Error in /query:", err);
    return res.json({ type: "error", title: "Server Error", message: "Something went wrong, try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot API running at http://localhost:${PORT}`);
});
