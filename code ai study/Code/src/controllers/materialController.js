const fs = require("fs");
const Material = require("../models/Material");
const { askGemini } = require("../utils/gemini");

// Helper: read uploaded file text
const readFileText = (filePath) => fs.readFileSync(filePath, "utf-8");

// POST /api/materials/upload
const uploadMaterial = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { title } = req.body;
  const content = readFileText(req.file.path);

  const material = await Material.create({
    user: req.user.userId,
    title: title || req.file.originalname,
    content,
    filename: req.file.originalname,
  });

  // Clean up file from disk after reading
  fs.unlinkSync(req.file.path);

  res.status(201).json({ message: "Material uploaded", material });
};

// GET /api/materials
const getMaterials = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user.userId };
  const materials = await Material.find(filter).select("-content -flashcards -quiz -studyPlan").sort("-createdAt");
  res.json(materials);
};

// GET /api/materials/:id
const getMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  // Students can only access their own
  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(material);
};

// DELETE /api/materials/:id
const deleteMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  await material.deleteOne();
  res.json({ message: "Deleted" });
};

// POST /api/materials/:id/summarize
const summarize = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  const prompt = `Summarize the following study material clearly and concisely in bullet points:\n\n${material.content}`;
  let summary = await askGemini(prompt);

  if (!summary) {
    const lines = material.content.split("\n").filter(l => l.trim().length > 0);
    summary = `📌 **Study Material Summary for "${material.title}"**\n\n` + 
      (lines.slice(0, 5).map(l => `• ${l.slice(0, 120)}`).join("\n") || `• Key concepts and definitions for ${material.title}`);
  }

  material.summary = summary;
  await material.save();

  res.json({ summary });
};

// POST /api/materials/:id/flashcards
const generateFlashcards = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  const count = req.body.count || 5;

  const prompt = `
Create ${count} flashcards from the study material below.
Return ONLY valid JSON in this format, no extra text:
[{"question": "...", "answer": "..."}]

Study material:
${material.content}
`;

  const raw = await askGemini(prompt);
  let flashcards = null;

  if (raw) {
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      flashcards = JSON.parse(clean);
    } catch (e) {
      console.warn("Flashcard JSON parse error:", e.message);
    }
  }

  if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
    const lines = material.content.split(/[\.\n]/).filter(s => s.trim().length > 15);
    flashcards = [
      {
        question: `What is the core focus of ${material.title}?`,
        answer: lines[0] ? lines[0].trim() : `Mastering ${material.title} concepts and fundamentals.`
      },
      {
        question: `What is a key principle covered in ${material.title}?`,
        answer: lines[1] ? lines[1].trim() : "Understanding key terms and practical execution steps."
      },
      {
        question: `How can you test your knowledge of ${material.title}?`,
        answer: "By solving practice questions, writing code snippets, and reviewing flashcards."
      }
    ];
  }

  material.flashcards = flashcards;
  await material.save();

  res.json({ flashcards });
};

// POST /api/materials/:id/quiz
const generateQuiz = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  const count = req.body.count || 5;

  const prompt = `
Create ${count} multiple choice quiz questions from the study material below.
Return ONLY valid JSON in this format, no extra text:
[{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]

Study material:
${material.content}
`;

  const raw = await askGemini(prompt);
  let quiz = null;

  if (raw) {
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      quiz = JSON.parse(clean);
    } catch (e) {
      console.warn("Quiz JSON parse error:", e.message);
    }
  }

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    quiz = [
      {
        question: `What is the main topic covered in ${material.title}?`,
        options: [
          `Understanding concepts of ${material.title}`,
          `Unrelated historical events`,
          `Pure guessing with no logical foundation`,
          `None of the above`
        ],
        answer: `Understanding concepts of ${material.title}`,
        explanation: `This study material specifically covers ${material.title}.`
      },
      {
        question: `Why is revising ${material.title} important?`,
        options: [
          "It improves comprehension, memory retention, and practical skill",
          "It has no relevance to exams or real-world use",
          "It is only required for advanced research",
          "It takes away practice time"
        ],
        answer: "It improves comprehension, memory retention, and practical skill",
        explanation: "Consistent revision reinforces core concepts and long-term memory."
      }
    ];
  }

  material.quiz = quiz;
  await material.save();

  res.json({ quiz });
};

// POST /api/materials/:id/study-plan
const generateStudyPlan = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: "Not found" });

  const { goal, hoursPerDay, days } = req.body;

  const prompt = `
You are a study planner. Based on the study material below, create a personalized ${days || 7}-day study plan.
Student's goal: ${goal || "Understand and retain the material"}
Available study time: ${hoursPerDay || 2} hours per day.

Return a clear day-by-day schedule with topics and activities.

Study material:
${material.content}
`;

  let studyPlan = await askGemini(prompt);

  if (!studyPlan) {
    const totalDays = days || 7;
    studyPlan = `📅 **${totalDays}-Day Actionable Study Plan for "${material.title}"**\n\n` +
      `🎯 **Goal:** ${goal || "Master core concepts and ace exams"}\n` +
      `⏱️ **Daily Commitment:** ${hoursPerDay || 2} hours/day\n\n` +
      `- **Day 1:** Read through key sections of ${material.title}, highlight core definitions.\n` +
      `- **Day 2:** Solve sample practice problems & write out explanations.\n` +
      `- **Day 3:** Generate and review Flashcards for memory retention.\n` +
      `- **Day 4-5:** Work on practical exercises & computer code/formula applications.\n` +
      `- **Day 6:** Take the interactive Quiz Arena test to measure speed.\n` +
      `- **Day 7:** Final revision of tricky topics and flashcard recap!`;
  }

  material.studyPlan = studyPlan;
  await material.save();

  res.json({ studyPlan });
};

module.exports = {
  uploadMaterial,
  getMaterials,
  getMaterial,
  deleteMaterial,
  summarize,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
};
