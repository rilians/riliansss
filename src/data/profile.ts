import type { Profile } from "../types";

/**
 * PROFILE — Egi Apriliansyah.
 * Sources: egi-apriliansyah-portfolio (GitHub Pages), public résumé,
 * linkedin.com/in/egi-apriliansyah, github.com/rilians.
 */
export const PROFILE: Profile = {
  name: "Egi Apriliansyah",
  role: "Informatics Engineering Graduate · Project Coordination & Technology Operations",
  tagline: "Your story, mapped differently.",
  location: "Bogor, West Java, Indonesia",
  phone: "+62 813 8860 3049",
  status: "Open to entry-level opportunities",
  email: "egiapriliansyah5@gmail.com",
  availability: "Project Coordination / PMO · Business Analysis · IT Operations",
  bio: [
    "I'm Egi — an Informatics Engineering graduate (S.Kom., GPA 3.61/4.00) drawn to the space between a clear plan, a curious technical mind, and a team moving in the same direction.",
    "I coordinate work, understand the systems behind it, and try to leave every project a little clearer than I found it: 25 committee members coordinated, an IDR 45M event budget delivered, 500+ attendees supported, and four ministries of a student board kept aligned for a full term.",
    "On the technical side I've shipped a Next.js product as a freelancer, worked PHP & SQL as a full-stack intern, and built independent Python platforms for service desks and data quality — with Scrum, networking and Python credentials to back the fundamentals.",
  ],
  philosophy: "Good work happens where plans meet people.",
  skillClusters: [
    {
      routeId: "build",
      title: "Technical",
      skills: ["PHP & SQL", "Python", "Next.js", "React", "Tailwind CSS", "SDLC", "Requirements analysis", "FastAPI"],
    },
    {
      routeId: "connect",
      title: "Communication",
      skills: ["Stakeholder communication", "Documentation & reporting", "Content production", "Community education", "Visual editing"],
    },
    {
      routeId: "support",
      title: "Operations",
      skills: ["Project coordination", "Progress tracking", "Risk & issue tracking", "Agile / Scrum (SFC™)", "Budget management", "Task allocation & follow-up"],
    },
    {
      routeId: "explore",
      title: "Exploration",
      skills: ["Data validation", "C4.5 & NLG", "Networking (CCNA)", "ML basics", "Explainable scoring", "Design exploration"],
    },
  ],
  tools: [
    "Microsoft Excel",
    "Microsoft PowerPoint",
    "Jira (personal practice)",
    "Git & GitHub",
    "Vercel",
    "Docker",
    "PostgreSQL",
    "pytest",
  ],
  education: [
    {
      period: "Sep 2022 — Sep 2026",
      title: "S.Kom. — Informatics Engineering",
      place: "Universitas Binaniaga Indonesia",
      note: "GPA 3.61/4.00 · Final-year thesis integrating C4.5 classification with Natural Language Generation for digital promotion intelligence.",
    },
    {
      period: "Ongoing",
      title: "The Explore Line (self-directed)",
      place: "Everywhere",
      note: "Independent platforms, creative-coding experiments and a growing credential collection — the frontier line of this map.",
    },
  ],
  certifications: [
    {
      title: "Scrum Fundamentals Certified (SFC™)",
      issuer: "SCRUMstudy",
      href: "https://www.scrumstudy.com/certification/verify?type=SFC&number=1200710",
      note: "Foundational Scrum and Agile project practices.",
    },
    {
      title: "CCNA: Introduction to Networks",
      issuer: "Cisco · Credly",
      href: "https://www.credly.com/badges/c7e7ad68-5fdc-4872-bbda-99ddee7b4fa6/public_url",
      note: "Networking foundations and connectivity.",
    },
    {
      title: "Python Essentials 1",
      issuer: "Cisco · Credly",
      href: "https://www.credly.com/badges/cbf2b6d6-120b-4652-9409-b16be570d2d8/public_url",
      note: "Programming foundation for analytical work.",
    },
    {
      title: "Basics of Machine Learning Algorithms",
      issuer: "UniAthena × Cambridge International Qualifications",
      href: "https://docs.uniathena.com/prod/course/certificate/322_1785017443_certificate.pdf",
      note: "Issued 25 Jul 2026.",
    },
    {
      title: "Basics of Python",
      issuer: "UniAthena × Cambridge International Qualifications",
      href: "https://docs.uniathena.com/prod/course/certificate/323_1785003339_certificate.pdf",
      note: "Blockchain ID 4030-8135-4424.",
    },
    {
      title: "English Conversation — Verbal Test",
      issuer: "Maxy Academy",
      href: "https://cms.maxy.academy/certificate/verify/f59af11b-088e-4296-8479-99f5f6f18fc4",
    },
  ],
  highlights: [
    { value: "25", label: "Committee members coordinated" },
    { value: "IDR 45M", label: "Event budget managed" },
    { value: "500+", label: "Attendees supported" },
    { value: "3.61", label: "GPA — out of 4.00" },
  ],
  interests: [
    "Project coordination & PMO",
    "IT operations & service desks",
    "Data quality & decision support",
    "Editorial & visual design",
    "Digital literacy education",
  ],
  languages: ["Indonesian — native", "English — conversational"],
  links: [
    { label: "Email", href: "mailto:egiapriliansyah5@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/egi-apriliansyah", external: true },
    { label: "GitHub", href: "https://github.com/rilians", external: true },
    { label: "Credly", href: "https://www.credly.com/users/egi-apriliansyah", external: true },
    { label: "Download CV", href: "/cv.pdf", external: false },
  ],
};
