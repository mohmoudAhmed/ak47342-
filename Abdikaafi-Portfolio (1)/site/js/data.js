/* ==========================================================
   PORTFOLIO CONTENT: Abdikaafi Ahmed Maxamuud
   Edit the text between the quotes. Photos live in "images",
   CV lives at cv/CV.pdf
   ========================================================== */
window.PORTFOLIO = {
  name: "Abdikaafi Ahmed Maxamuud",
  firstName: "Abdikaafi",
  lastName: "Ahmed Maxamuud",
  role: "Architecture & Interior Design",
  years: "2023-2025",
  location: "Mogadishu, Somalia",
  email: "ahmedabdikafi08@gmail.com",
  phone: "0617050935",
  social: [],

  cv: "cv/CV.pdf",
  portrait: "images/portrait.png",
  closingImage: "images/closing.jpg",

  bio: "Interior Designer and Architectural Engineer with 3+ years of experience in residential and commercial design. I develop creative concepts, produce detailed drawings and deliver high-quality visualizations using AutoCAD, SketchUp and D5 Render. I enjoy working with clients and turning design ideas into functional, beautiful spaces.",

  education: [
    { when: "Graduated 06/2023", title: "University of Mogadishu", lines: ["Bachelor of Science in Architectural Engineering", "Mogadishu, Somalia"] }
  ],

  experience: [
    { when: "May 2023 - Nov 2025", title: "Architectural Designer", lines: [
      "Deegaan Design and Visualization, Mogadishu",
      "Interior concepts, drawings and layouts in AutoCAD and SketchUp",
      "3D visualizations and realistic renders in D5 Render",
      "Material, finish and furniture selection, client revisions and site visits"
    ] }
  ],

  software: [
    { name: "AutoCAD",   badge: "A"  },
    { name: "SketchUp",  badge: "SK" },
    { name: "D5 Render", badge: "D5" },
    { name: "V-Ray",     badge: "V"  },
    { name: "Photoshop", badge: "Ps" }
  ],

  skills: ["Architectural design & visualization", "Interior design concepts", "Space planning & layout design", "Communication & team collaboration"],
  languages: ["Somali", "English"],
  awards: ["Specialized training: SketchUp, AutoCAD, D5 Render and Adobe Photoshop"],
  quote: "I design calm, natural spaces where people feel relaxed and welcome.",

  projects: [
    {
      title: "Asal Coffee",
      subtitle: "Modern Japandi Cafe with Boho-Natural Elements",
      type: "Interior design, cafe",
      location: "Behind Banaadir Mall, Mogadishu",
      year: "2025",
      area: "16.54 x 9.10 m",
      role: "Solo project",
      concept: [
        { label: "The Problem", text: "Many coffee shops lack a unique identity and a comfortable atmosphere where customers can relax, socialize or work." },
        { label: "The Idea", text: "A modern Japandi cafe with natural boho elements: warm neutral colors, wooden furniture, woven pendant lights and large windows, creating a cozy, elegant and welcoming space for a relaxing coffee experience." }
      ],
      palette: [
        { name: "Cream white",  color: "#F4EEE2" },
        { name: "Warm beige",   color: "#D8C2A2" },
        { name: "Natural wood", color: "#8B5E3C" },
        { name: "Soft green",   color: "#A9B99C" },
        { name: "Light gray",   color: "#CBCBCD" }
      ],
      hero: "images/project-1/hero.jpg",
      gallery: [
        "images/project-1/gallery-1.jpg", "images/project-1/gallery-2.jpg", "images/project-1/gallery-3.jpg",
        "images/project-1/gallery-4.jpg", "images/project-1/gallery-5.jpg", "images/project-1/gallery-6.jpg",
        "images/project-1/gallery-7.jpg", "images/project-1/gallery-8.jpg", "images/project-1/gallery-9.jpg"
      ],
      drawings: []
    },
    {
      title: "Apartment Building",
      subtitle: "Residential tower with green balconies: renders and plans",
      type: "Architecture, multi-storey building",
      description: "A multi-storey apartment building with planted balconies on every floor, set among tall towers. The plans show a basement with parking and two lifts, a landscaped ground floor, and a typical floor with apartments arranged around a central lift core.",
      hero: "images/project-2/hero.jpg",
      gallery: ["images/project-2/gallery-1.jpg", "images/project-2/gallery-2.jpg", "images/project-2/gallery-3.jpg"],
      drawings: [
        { src: "images/project-2/drawing-1.jpg", caption: "Site and Basement Plan" },
        { src: "images/project-2/drawing-2.jpg", caption: "Site and Ground Floor Plan" },
        { src: "images/project-2/drawing-3.jpg", caption: "1st Floor Plan" }
      ]
    }
  ]
};
