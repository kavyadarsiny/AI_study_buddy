const { askGemini } = require("../utils/gemini");

// Smart programming & academic fallback response generator
const getFallbackChatResponse = (message, language = "") => {
  const msgLower = message.toLowerCase();
  const langLower = (language || "").toLowerCase();

  // Python
  if (msgLower.includes("python") || langLower.includes("python") || msgLower.includes("def ") || msgLower.includes("list comprehension")) {
    return `🐍 **Python Programming Tutor**\n\nPython is a high-level, interpreted programming language known for its clear syntax and readability!\n\n\`\`\`python\n# Simple Python Function Example\ndef greet_student(name):\n    return f"Hello, {name}! Welcome to Python programming."\n\n# Call function\nprint(greet_student("Learner"))\n\`\`\`\n\n💡 **Key Takeaways:**\n- **Indentation matters:** Python uses indentation (spaces) to define code blocks.\n- **Dynamic typing:** You don't need to declare variable types explicitly.\n- **Rich ecosystem:** Ideal for Data Science, AI/ML, Web Dev (Django/Flask), and Automation!`;
  }

  // JavaScript / Node / React
  if (msgLower.includes("javascript") || msgLower.includes("js") || langLower.includes("javascript") || msgLower.includes("async") || msgLower.includes("promise") || msgLower.includes("react")) {
    return `⚡ **JavaScript Programming Tutor**\n\nJavaScript is the primary programming language of the web, supporting event-driven, asynchronous execution!\n\n\`\`\`javascript\n// Asynchronous Fetch Example in JavaScript\nasync function fetchStudyMaterial(topic) {\n  try {\n    const response = await fetch(\`/api/explain?topic=\${topic}\`);\n    const data = await response.json();\n    console.log("Topic Breakdown:", data);\n  } catch (error) {\n    console.error("Error fetching material:", error);\n  }\n}\n\`\`\`\n\n💡 **Key Concepts:**\n- **Event Loop & Asynchrony:** Promises & \`async/await\` handle non-blocking tasks.\n- **DOM Manipulation:** Interacting with dynamic browser interfaces.\n- **Full-Stack:** Runs in browsers and on servers via Node.js!`;
  }

  // C++ / C
  if (msgLower.includes("c++") || msgLower.includes("cpp") || langLower.includes("c++") || msgLower.includes("pointer") || msgLower.includes("cout")) {
    return `💻 **C++ Programming Tutor**\n\nC++ is a fast, compiled, object-oriented computer language widely used in system programming, game engines, and competitive coding!\n\n\`\`\`cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int score = 100;\n    int* ptr = &score; // Pointer pointing to memory address of score\n    \n    cout << "Value of score: " << score << endl;\n    cout << "Memory Address: " << ptr << endl;\n    return 0;\n}\n\`\`\`\n\n💡 **Key Concepts:**\n- **Pointers & Memory:** Direct manipulation of system memory locations.\n- **Object-Oriented (OOP):** Classes, Inheritance, Polymorphism, and Encapsulation.\n- **Standard Template Library (STL):** Vectors, Maps, Sets, and Algorithms.`;
  }

  // Java
  if (msgLower.includes("java") || langLower.includes("java")) {
    return `☕ **Java Programming Tutor**\n\nJava is a strongly-typed, object-oriented language that runs on the Java Virtual Machine (JVM) under the philosophy "Write Once, Run Anywhere".\n\n\`\`\`java\npublic class StudyBuddy {\n    public static void main(String[] args) {\n        String topic = "Data Structures";\n        System.out.println("Studying: " + topic);\n    }\n}\n\`\`\`\n\n💡 **Key Concepts:**\n- **Strict OOP:** Everything revolves around classes and objects.\n- **Garbage Collection:** Automatic memory management.\n- **Platform Independence:** Compiled byte-code runs on any system with a JVM.`;
  }

  // SQL & Databases
  if (msgLower.includes("sql") || msgLower.includes("database") || msgLower.includes("select") || msgLower.includes("join")) {
    return `📊 **SQL & Database Queries**\n\nSQL (Structured Query Language) is used to store, query, and manage data in relational database management systems.\n\n\`\`\`sql\n-- Retrieve top students with high scores\nSELECT student_id, name, total_score \nFROM students \nWHERE total_score >= 90 \nORDER BY total_score DESC;\n\`\`\`\n\n💡 **Key Operations:**\n- **CRUD:** Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE).\n- **Joins:** Combining tables using \`INNER JOIN\`, \`LEFT JOIN\`.`;
  }

  // Data Structures & Algorithms
  if (msgLower.includes("recursion") || msgLower.includes("tree") || msgLower.includes("array") || msgLower.includes("stack") || msgLower.includes("queue") || msgLower.includes("binary search") || msgLower.includes("algorithm")) {
    return `🌳 **Data Structures & Algorithms**\n\nData structures organize computer data efficiently so algorithms can process information rapidly.\n\n\`\`\`python\n# Binary Search Algorithm in Python O(log N)\ndef binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\`\`\`\n\n💡 **Key Takeaways:**\n- **Time Complexity:** Measured in Big-O notation (e.g. O(1), O(log N), O(N)).\n- **Common Structures:** Arrays, Linked Lists, Stacks, Queues, Hash Tables, Binary Trees, Graphs.`;
  }

  // General Science / Academic Fallbacks
  if (msgLower.includes("photosynthesis")) {
    return `🌱 **Photosynthesis Explained Simply**\n\nPhotosynthesis is how plants turn sunlight into food! Think of a plant leaf as a tiny solar-powered kitchen:\n\n1. **Ingredients:** Sunlight ☀️ + Water 💧 + Carbon Dioxide 🌬️\n2. **Cooking Process:** Chlorophyll (green pigment) captures energy from sunlight.\n3. **Result:** Glucose (sugar food 🍎) + Oxygen 💨 released for us to breathe!\n\n💡 *Formula:* 6CO₂ + 6H₂O + Light ➔ C₆H₁₂O₆ + 6O₂`;
  }
  if (msgLower.includes("calculus") || msgLower.includes("derivative")) {
    return `📐 **Understanding Derivatives**\n\nA derivative measures how fast something is changing at a single exact moment! Think of your car speed:\n\n- Your **average speed** is total distance over total time.\n- Your **instantaneous speed** on the speedometer at 2:15 PM is the **derivative** of distance with respect to time!`;
  }
  if (msgLower.includes("quiz")) {
    return `🧠 **Ready for Practice!**\n\nHead over to our **Quiz Arena** tab above to generate interactive tests on any topic or computer programming language with instant step-by-step answer explanations!`;
  }

  return `✨ **StudyBuddy Tutor Response**\n\nGreat question! Let's break down "${message}":\n\n1. **Core Concept:** Focus on understanding the basic principle before memorizing syntax or formulas.\n2. **Code & Practical Application:** Write small code snippets or draw diagram steps to build confidence.\n3. **Quick Action:** Try generating a quiz or flashcards to test your understanding!`;
};

// POST /api/chat
const chat = async (req, res) => {
  const { message, context, language } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ message: "A message is required" });
  }

  const langContext = language ? `Target Computer / Programming Language: ${language}` : "";

  const prompt = `
You are StudyBuddy, a friendly, encouraging, and highly knowledgeable AI tutor for computer programming languages (Python, JavaScript, C++, Java, SQL, HTML/CSS, Data Structures) and general academic subjects.
Explain concepts clearly, provide well-commented code snippets with appropriate syntax highlighting formatting, use bullet points, and provide practical analogies.

Learner Question:
${message.trim()}

${langContext}

Context / Subject Note:
${typeof context === "string" && context.trim() ? context.trim() : "Computer Science & General Learning"}
`;

  let reply = await askGemini(prompt);
  if (!reply) {
    reply = getFallbackChatResponse(message, language);
  }

  res.json({ reply });
};

// POST /api/chat/explain
const explainTopic = async (req, res) => {
  const { topic, style, language } = req.body;

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({ message: "Topic is required" });
  }

  const modeStyle = style || "eli5";
  const langContext = language ? `in the context of computer language "${language}"` : "";

  const prompt = `
You are an expert computer science and academic educator. Explain the topic "${topic.trim()}" ${langContext} in the style "${modeStyle}".
Format your response strictly as valid JSON with NO markdown code blocks surrounding the output JSON itself, using this exact JSON structure:
{
  "title": "${topic.trim()}",
  "summary": "Short 2-sentence breakdown explaining the core computer science or subject concept.",
  "explanation": "Detailed step-by-step breakdown with code snippets or clear procedural steps where applicable.",
  "analogy": "A memorable real-world analogy",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "memoryTrick": "A fun memory trick or mnemonic for quick recall"
}
`;

  let raw = await askGemini(prompt);
  let parsed = null;

  if (raw) {
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      console.warn("JSON parse error on explainTopic output:", e.message);
    }
  }

  if (!parsed) {
    const isProg = topic.toLowerCase().includes("python") || topic.toLowerCase().includes("code") || topic.toLowerCase().includes("java") || topic.toLowerCase().includes("c++") || (language && language !== "General");
    
    parsed = {
      title: `${topic.trim()}${language ? ` (${language})` : ''}`,
      summary: `Here is a clear breakdown of ${topic.trim()} tailored for computer science students.`,
      explanation: isProg
        ? `**1. What is it?** ${topic.trim()} is an essential computer science building block. Mastering its syntax and control flow enables you to write clean, bug-free applications.\n\n**2. How it works:** When executed, the runtime evaluates instructions sequentially, maintaining state in memory variables and handling input/output data.\n\n**3. Best Practices:** Use clean variable names, handle edge cases, and test with small inputs before deploying to production.`
        : `**1. What is it?** ${topic.trim()} is a fundamental concept in your studies. Understanding it step-by-step makes assignments and exam prep straightforward!\n\n**2. Key Mechanism:** Break it down into smaller components, observe how each element interacts, and apply it to practical examples.`,
      analogy: `Think of ${topic.trim()} like building with LEGO blocks—each line of code or principle connects logically to create a complete system.`,
      keyPoints: [
        "Master the syntax and basic principles first",
        "Practice by writing real code snippets or solving problems",
        "Test yourself with practice quizzes to reinforce memory"
      ],
      memoryTrick: `Remember **CODE**: Concept, Organize, Develop, Evaluate!`
    };
  }

  res.json(parsed);
};

// POST /api/chat/quiz
const generateTopicQuiz = async (req, res) => {
  const { topic, count, difficulty, language } = req.body;

  const quizTopic = topic && typeof topic === "string" ? topic.trim() : "Python Programming";
  const qCount = count || 5;
  const qDiff = difficulty || "Medium";
  const langContext = language ? `specifically focused on ${language} programming language` : "";

  const prompt = `
Create a ${qCount}-question multiple-choice quiz on "${quizTopic}" ${langContext} at ${qDiff} difficulty level for students.
Each question MUST have 4 options and a clear step-by-step explanation of why the correct answer is right.
Return ONLY valid JSON in this exact structure with NO extra markdown:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B",
    "explanation": "Detailed explanation of why Option B is correct and others are incorrect."
  }
]
`;

  let raw = await askGemini(prompt);
  let quiz = null;

  if (raw) {
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      quiz = JSON.parse(clean);
    } catch (e) {
      console.warn("JSON parse error on generateTopicQuiz:", e.message);
    }
  }

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    if (quizTopic.toLowerCase().includes("python") || (language && language.toLowerCase().includes("python"))) {
      quiz = [
        {
          question: "Which keyword is used to define a function in Python?",
          options: ["function", "def", "func", "define"],
          answer: "def",
          explanation: "In Python, the 'def' keyword is used to declare user-defined functions."
        },
        {
          question: "What is the output of print(type([])) in Python?",
          options: ["<class 'list'>", "<class 'array'>", "<class 'dict'>", "<class 'tuple'>"],
          answer: "<class 'list'>",
          explanation: "Square brackets [] in Python denote a list data structure."
        },
        {
          question: "Which data structure in Python stores key-value pairs?",
          options: ["Set", "List", "Dictionary", "Tuple"],
          answer: "Dictionary",
          explanation: "Python dictionaries (dict) store data as key-value pairs enclosed in curly braces {}."
        }
      ];
    } else if (quizTopic.toLowerCase().includes("javascript") || (language && language.toLowerCase().includes("javascript"))) {
      quiz = [
        {
          question: "Which keyword declares a block-scoped variable in modern JavaScript?",
          options: ["var", "let", "global", "dim"],
          answer: "let",
          explanation: "'let' and 'const' introduce block-level scoping in JavaScript ES6."
        },
        {
          question: "What does strict equality (===) check in JavaScript?",
          options: ["Value only", "Type only", "Both value and type", "Memory address"],
          answer: "Both value and type",
          explanation: "The === operator compares both data type and value without performing implicit type coercion."
        }
      ];
    } else {
      quiz = [
        {
          question: `What is the primary concept behind ${quizTopic}?`,
          options: [
            `It provides the fundamental mechanism used in ${quizTopic}`,
            `It is an outdated concept with no practical application`,
            `It only applies in advanced research labs`,
            `It requires no structure or rules`
          ],
          answer: `It provides the fundamental mechanism used in ${quizTopic}`,
          explanation: `Correct! ${quizTopic} provides essential foundations applied in software development and learning.`
        },
        {
          question: `Why is practicing ${quizTopic} code and concepts important?`,
          options: [
            "It builds concept clarity, logic speed, and hands-on skill",
            "It forces memorization without practical execution",
            "It is never tested in programming interviews",
            "It eliminates the need for testing"
          ],
          answer: "It builds concept clarity, logic speed, and hands-on skill",
          explanation: "Regular practice builds long-term retention and confidence when writing programs."
        }
      ];
    }
  }

  res.json({ topic: quizTopic, difficulty: qDiff, quiz });
};

module.exports = { chat, explainTopic, generateTopicQuiz };