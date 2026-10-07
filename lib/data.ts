/**
 * All portfolio content lives here. Edit this file to make the site yours —
 * no component changes required.
 */

export const profile = {
  name: "Dhrubajyoti Ghosh",
  initials: "DG",
  /** Logo / profile picture shown as a circle (navbar, hero, footer). Favicon: app/icon.png. */
  avatar: "/avatar-dg.webp",
  /** Photo used by the jigsaw intro animation (components/Intro.tsx). */
  introImage: "/intro.webp",
  role: "Student and Researcher",
  /** "Currently" box in the hero card. */
  current: {
    title: "3rd Year Computer Science B.Sc. Student",
    org: "Ramakrishna Mission Vidyamandira",
  },
  /** Short form used in the hero card and footer. */
  location: "Belur, Howrah, India",
  /** Full location card in the Contact section. Clicking it opens Google Maps. */
  place: {
    name: "Ramakrishna Mission Vidyamandira",
    address: "J9J3+GPQ, Belur Math, Belur, Howrah, West Bengal 711202",
    // Decoded from the plus code J9J3+GPQ (7MJCJ9J3+GPQ).
    lat: 22.63134,
    lng: 88.35436,
  },
  /** IANA zone used for the live clock — see components/LocalTime.tsx. */
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  email: "dhrubajyotighosh379@gmail.com",
  // No CV yet: buttons show a "not uploaded yet" message. When it's ready, put the file in
  // /public (e.g. /public/resume.pdf) and set this to "/resume.pdf".
  resumeUrl: "",
  available: true,
  availabilityText: "Available for new opportunities",
  headline: {
    before: "Learning, researching, and building at the intersection of",
    skillOne: "code",
    middle: "and",
    skillTwo: "innovation",
    after: ".",
  },
  subheadline:
    "I'm a 3rd-year B.Sc. Computer Science student and researcher with a strong interest in Artificial Intelligence and emerging technologies. My research interests span Machine Learning, Deep Learning, Neural Networks, Federated Learning, Explainable AI (XAI), Large Language Models (LLMs), Agentic AI, and related areas. I enjoy exploring new technologies and working on research-driven projects, while looking forward to expanding my skills in software and web development.",
  currentFocus: "AI research — Machine Learning, Deep Learning, Federated Learning & Explainable AI (XAI)",
};

/* ------------------------------------------------------------------ */
/* Gallery (back of the profile card)                                  */
/* ------------------------------------------------------------------ */

/** `focus` is the CSS object-position of the faces, used wherever the photo has to be cropped (thumbnails). */
export type GalleryImage = { src: string; alt: string; caption?: string; focus?: string };

// Put image files in /public/gallery/ and list them here, e.g.
// { src: "/gallery/conference.webp", alt: "Presenting my poster", caption: "Poster session, 2025", focus: "50% 30%" }
export const gallery: GalleryImage[] = [
  { src: "/gallery/01-belur-math.webp", alt: "Belur Math temple under an evening sky", caption: "Belur Math" },
  {
    src: "/gallery/02-vidyamandira-campus.webp",
    alt: "Main building and garden path of Ramakrishna Mission Vidyamandira",
    caption: "Ramakrishna Mission Vidyamandira",
  },
  {
    src: "/gallery/03-ieee-instcon-nit-rourkela.webp",
    alt: "Dhrubajyoti holding a Certificate of Presentation at IEEE INSTCON 2026, NIT Rourkela",
    caption: "IEEE INSTCON 2026 · NIT Rourkela",
    focus: "72% 18%",
  },
  { src: "/gallery/04-portrait.webp", alt: "Portrait of Dhrubajyoti with arms crossed", focus: "48% 22%" },
  {
    src: "/gallery/05-hills.webp",
    alt: "Dhrubajyoti sitting on a rock among green trees on a misty hill",
    focus: "45% 40%",
  },
  {
    src: "/gallery/06-vidyamandira-group.webp",
    alt: "Group of students in front of the Ramakrishna Mission Vidyamandira building",
    caption: "With friends at Vidyamandira",
    focus: "50% 50%",
  },
  { src: "/gallery/07-classmates.webp", alt: "Group photo with classmates in a classroom", focus: "50% 30%" },
  { src: "/gallery/08-friends.webp", alt: "Group photo with friends in a classroom", focus: "50% 30%" },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Research", href: "#research" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export type SocialKey = "github" | "linkedin" | "x" | "instagram";

type Social = { key: SocialKey; label: string; href: string; handle: string };

// Leave `href` empty to hide a link everywhere on the site.
const allSocials: Social[] = [
  { key: "github", label: "GitHub", href: "https://github.com/Dhruba018v", handle: "@Dhruba018v" },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dhrubajyoti-ghosh-27b919377/",
    handle: "Dhrubajyoti Ghosh",
  },
  { key: "x", label: "Twitter / X", href: "", handle: "" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/dhrubaaaa18/", handle: "@dhrubaaaa18" },
];

export const socials = allSocials.filter((s) => s.href);

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export type EducationItem = {
  degree: string;
  institution: string;
  institutionUrl?: string;
  /** Optional; hidden when empty. */
  location?: string;
  /** Full address / plus code; when set, the location opens Google Maps. */
  mapQuery?: string;
  /** Free text, e.g. "2024 — Present" or "3rd Year · Present". */
  period: string;
  current?: boolean;
  summary: string;
  /** Marks, achievements, coursework highlights… (optional) */
  highlights: string[];
  /** Shown as tags. */
  subjects: string[];
};

// Newest first. Add school / higher-secondary entries below the degree.
export const education: EducationItem[] = [
  {
    degree: "B.Sc. in Computer Science",
    institution: "Ramakrishna Mission Vidyamandira",
    location: "Belur Math, Howrah, West Bengal",
    mapQuery: "J9J3+GPQ, Belur Math, Belur, Howrah, West Bengal 711202",
    period: "3rd Year · Present",
    current: true,
    summary:
      "Undergraduate study in Computer Science, with a growing focus on Artificial Intelligence (AI), Machine Learning (ML) and research.",
    highlights: [],
    subjects: [],
  },
  {
    degree: "Higher Secondary (Class 12)",
    institution: "Bohar High School",
    location: "Gadaitala, West Bengal 713422",
    mapQuery: "758W+GCC, Gadaitala, West Bengal 713422",
    period: "Completed",
    summary: "Completed my higher secondary education.",
    highlights: [],
    subjects: [],
  },
  {
    degree: "Madhyamik (Class 10)",
    institution: "Bulbulitala Sishu Niketan High School",
    location: "Bulbulitala, Khalishpur, Utra, West Bengal 713422",
    mapQuery: "76HC+886, Bulbulitala, Khalishpur, Utra, West Bengal 713422",
    period: "Completed",
    summary: "Completed my secondary education (Madhyamik).",
    highlights: [],
    subjects: [],
  },
];

/* ------------------------------------------------------------------ */
/* Research journey                                                    */
/* ------------------------------------------------------------------ */

export type ResearchStatus = "Exploring" | "Ongoing" | "Completed" | "Published";

export type ResearchItem = {
  title: string;
  status: ResearchStatus;
  /** Optional, e.g. "2025 — Present". */
  period?: string;
  description: string;
  tags: string[];
  /** Optional links, e.g. paper PDF, arXiv, GitHub repo, slides. */
  links?: { label: string; href: string }[];
};

export type Publication = {
  title: string;
  /** In order; the owner's name is highlighted automatically. */
  authors: string[];
  kind: string;
  venue: string;
  year: number;
  /** Optional extra line, e.g. where it was presented. */
  presentedAt?: string;
  doi?: string;
  url: string;
  /**
   * Optional PDF in /public/papers/. IEEE allows the *accepted manuscript* (not the final
   * IEEE-formatted version) on a personal website.
   */
  pdf?: string;
  summary: string;
  results: { label: string; value: string }[];
  tags: string[];
};

export const publications: Publication[] = [
  {
    title: "Explainable Machine Learning for Post-Operative Patient Outcome Prediction Using DALEX",
    authors: ["Dhrubajyoti Ghosh", "Tapas Si", "Samaresh Maiti", "Sarbajit Manna"],
    kind: "Conference Paper",
    venue: "2026 IEEE 1st International Conference on Instrumentation (INSTCon)",
    year: 2026,
    presentedAt: "Presented at NIT Rourkela",
    doi: "10.1109/INSTCon69741.2026.11691941",
    url: "https://ieeexplore.ieee.org/document/11691941",
    pdf: "/papers/ghosh-2026-explainable-ml-dalex.pdf",
    summary:
      "Predicts where a patient goes after surgery — ICU, general ward, or home — using Decision Tree, XGBoost, MLP and a Stacking Classifier on the UCI Post-Operative Patient dataset. Classes are balanced with SMOTE, models are validated with stratified 10-fold cross-validation and ranked with TOPSIS, and DALEX explains which clinical features drive each model's predictions.",
    results: [],
    tags: ["Explainable AI", "DALEX", "XGBoost", "SMOTE", "TOPSIS", "Healthcare"],
  },
];

export const researchIntro =
  "The areas of Artificial Intelligence I'm studying and working in.";

export const research: ResearchItem[] = [
  {
    title: "Machine Learning",
    status: "Exploring",
    description:
      "The foundation of my research — building models that learn patterns from data, from preparing and analysing datasets to training, tuning, and evaluating models carefully.",
    tags: ["Supervised Learning", "Model Evaluation", "Data Analysis"],
  },
  {
    title: "Explainable AI (XAI)",
    status: "Exploring",
    description:
      "Opening up the “black box” of AI. I've explored LIME, SHAP, DALEX and ELI5 to understand why a model makes each prediction and which features drive its decisions — so AI can be trusted, debugged, and audited.",
    tags: ["LIME", "SHAP", "DALEX", "ELI5", "Interpretability"],  },
  {
    title: "SUMO — Traffic Simulation",
    status: "Exploring",
    description:
      "Using SUMO (Simulation of Urban MObility), an open-source traffic simulator, to model road networks and vehicle movement — creating realistic environments where intelligent transport ideas can be tested.",
    tags: ["SUMO", "Traffic Simulation", "Intelligent Transport"],
  },
  {
    title: "Federated Learning",
    status: "Exploring",
    description:
      "Privacy-preserving machine learning: training a shared model across many devices or institutions without ever collecting their raw data in one place.",
    tags: ["Privacy", "Distributed ML", "Collaborative Learning"],
  },
];

/* ------------------------------------------------------------------ */
/* Skills & learning                                                   */
/* ------------------------------------------------------------------ */

export type Skill = {
  name: string;
  icon: string; // key into the icon map in components/TechStack.tsx
};

export const skillGroups: { title: string; blurb: string; icon: string; skills: Skill[] }[] = [
  {
    title: "Programming & Tools",
    blurb: "The languages and tools I write code with.",
    icon: "code",
    skills: [
      { name: "C", icon: "c" },
      { name: "Java", icon: "java" },
      { name: "Python", icon: "python" },
      { name: "SQL", icon: "sql" },
      { name: "Git", icon: "git" },
    ],
  },
  {
    title: "Web Development",
    blurb: "Building for the web, from structure to style.",
    icon: "web",
    skills: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "js" },
      { name: "Django", icon: "django" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    title: "Math, AI & Research",
    blurb: "The theory and tools behind my research.",
    icon: "ai",
    skills: [
      { name: "Discrete Mathematics", icon: "math" },
      { name: "NumPy", icon: "numpy" },
      { name: "scikit-learn", icon: "sklearn" },
      { name: "ML Models", icon: "ml" },
      { name: "DALEX", icon: "xai" },
      { name: "SHAP", icon: "xai" },
      { name: "LIME", icon: "xai" },
      { name: "ELI5", icon: "xai" },
      { name: "SUMO", icon: "sumo" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* About, stats, testimonials                                          */
/* ------------------------------------------------------------------ */

export const about = {
  title: { first: "Curiosity drives me.", second: "Research shapes me." },
  paragraphs: [
    "I'm a 3rd-year B.Sc. Computer Science student passionate about research, technology, and continuous learning. I enjoy exploring challenging problems, understanding how things work, and experimenting with ideas across different areas of Computer Science.",
    "My research interests include Machine Learning, Deep Learning, Neural Networks, Federated Learning, Large Language Models (LLMs), Agentic AI, and other emerging areas of Artificial Intelligence.",
    "Beyond research, I'm building my foundation in software and web development and plan to explore these areas more deeply in the future. I'm always looking to learn something new, experiment with ideas, and grow through the projects I work on.",
  ],
  principlesTitle: "How I approach my work",
  principles: [
    { title: "Stay curious", text: "Ask questions. Explore ideas. Understand deeply." },
    { title: "Learn by doing", text: "Experiment with concepts and turn knowledge into practical work." },
    { title: "Keep evolving", text: "Learn new technologies and continuously expand my perspective." },
  ],
};

