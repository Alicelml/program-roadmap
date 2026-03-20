import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@programroadmap.edu" },
    update: {},
    create: {
      email: "admin@programroadmap.edu",
      password: hashedPassword,
      name: "Admin User",
    },
  });
  console.log("✅ Admin user created: admin@programroadmap.edu / Admin@123");

  // Site settings
  const settings = [
    { key: "site.name", value: "Program Roadmap" },
    { key: "site.tagline", value: "Adelaide University" },
    { key: "home.hero.title", value: "Chart Your Path to Success" },
    { key: "home.hero.subtitle", value: "Explore programs, connect with industry, and discover where your degree can take you. Your academic journey starts here." },
    { key: "home.hero.cta_primary", value: "Explore Programs" },
    { key: "home.hero.cta_secondary", value: "Meet Our Alumni" },
    { key: "home.stats.students", value: "12,000+" },
    { key: "home.stats.programs", value: "50+" },
    { key: "home.stats.alumni", value: "80,000+" },
    { key: "home.stats.partners", value: "200+" },
    { key: "home.about.title", value: "Your Academic Journey, Visualised" },
    { key: "home.about.description", value: "We help students navigate their degree with clarity. From first-year foundations to career-ready capstones, our interactive roadmaps show you exactly where you're headed — and how to get there." },
    { key: "contact.email", value: "info@programroadmap.edu.au" },
    { key: "contact.phone", value: "+61 8 8313 5208" },
    { key: "contact.address", value: "North Terrace, Adelaide SA 5005" },
    { key: "programs.intro", value: "Explore our range of programs designed to equip you with the skills, knowledge and connections to thrive in a rapidly evolving world." },
    { key: "alumni.intro", value: "Our graduates go on to make a real impact across industries worldwide. Hear their stories and learn from their journeys." },
    { key: "industry.intro", value: "We partner with leading organisations to ensure our programs reflect the needs of industry, giving students a competitive edge from day one." },
  ];

  for (const s of settings) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log("✅ Site settings created");

  // Programs
  const csProgram = await prisma.program.upsert({
    where: { slug: "bachelor-computer-science" },
    update: {},
    create: {
      slug: "bachelor-computer-science",
      title: "Bachelor of Computer Science",
      description: "Build a strong foundation in computing and software development, progressing to advanced specialisations in AI, cybersecurity, and distributed systems.",
      level: "Bachelor",
      duration: "3 years",
      featured: true,
      published: true,
      overview: "The Bachelor of Computer Science is a rigorous, industry-aligned program that takes you from the fundamentals of programming through to cutting-edge topics in artificial intelligence, cloud computing, and software engineering. You will complete a capstone industry project in your final year, working alongside real organisations to solve real problems.",
    },
  });

  const dsProgram = await prisma.program.upsert({
    where: { slug: "master-data-science" },
    update: {},
    create: {
      slug: "master-data-science",
      title: "Master of Data Science",
      description: "Transform raw data into strategic insights. This advanced program combines statistics, machine learning, and domain expertise to prepare you for the data-driven economy.",
      level: "Masters",
      duration: "2 years",
      featured: true,
      published: true,
      overview: "The Master of Data Science equips graduates with the technical depth and practical experience to lead data initiatives across industries. Combining advanced statistics, machine learning, and data engineering with business strategy, this program prepares you to extract meaningful insights and drive evidence-based decisions.",
    },
  });

  const bisProgram = await prisma.program.upsert({
    where: { slug: "bachelor-business-information-systems" },
    update: {},
    create: {
      slug: "bachelor-business-information-systems",
      title: "Bachelor of Business Information Systems",
      description: "Bridge the gap between technology and business. Learn to design, implement and manage information systems that drive organisational performance.",
      level: "Bachelor",
      duration: "3 years",
      featured: true,
      published: true,
      overview: "The Bachelor of Business Information Systems prepares you to lead at the intersection of technology and business. You will develop expertise in systems analysis, project management, enterprise architecture, and digital transformation — skills that are in high demand across every sector of the economy.",
    },
  });

  const aiProgram = await prisma.program.upsert({
    where: { slug: "master-artificial-intelligence" },
    update: {},
    create: {
      slug: "master-artificial-intelligence",
      title: "Master of Artificial Intelligence",
      description: "Advance to the frontier of AI research and application. Develop expertise in deep learning, natural language processing, computer vision, and responsible AI.",
      level: "Masters",
      duration: "2 years",
      featured: false,
      published: true,
      overview: "The Master of Artificial Intelligence is designed for graduates who want to lead in the rapidly evolving AI landscape. Through a combination of foundational theory, hands-on research, and industry collaboration, you will develop the skills to design and deploy AI systems that are both technically sophisticated and ethically sound.",
    },
  });

  console.log("✅ Programs created");

  // CS Courses
  const csCourses = [
    // Year 1, Semester 1
    { code: "CS1001", title: "Introduction to Programming", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 1, description: "Python fundamentals, problem solving and algorithmic thinking" },
    { code: "MATH1001", title: "Calculus I", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 2, description: "Differential and integral calculus with applications" },
    { code: "CS1002", title: "Digital Systems", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 3, description: "Binary arithmetic, logic gates and computer organisation" },
    { code: "CS1003", title: "Computational Thinking", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 4, description: "Decomposition, pattern recognition and abstraction" },
    // Year 1, Semester 2
    { code: "CS1004", title: "Data Structures", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 1, description: "Arrays, linked lists, stacks, queues and trees" },
    { code: "MATH1002", title: "Discrete Mathematics", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 2, description: "Logic, sets, relations and graph theory" },
    { code: "CS1005", title: "Web Fundamentals", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 3, description: "HTML, CSS, JavaScript and responsive design" },
    { code: "CS1006", title: "Introduction to Algorithms", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 4, description: "Algorithm analysis, sorting and searching techniques" },
    // Year 2, Semester 1
    { code: "CS2001", title: "Object-Oriented Programming", year: 2, semester: 1, courseType: "CORE", units: 3, sortOrder: 1, description: "OOP concepts in Java: classes, inheritance, polymorphism" },
    { code: "CS2002", title: "Database Systems", year: 2, semester: 1, courseType: "CORE", units: 3, sortOrder: 2, description: "Relational databases, SQL, normalisation and query optimisation" },
    { code: "CS2003", title: "Computer Networks", year: 2, semester: 1, courseType: "CORE", units: 3, sortOrder: 3, description: "TCP/IP stack, protocols and network architecture" },
    { code: "CS2004", title: "Elective I", year: 2, semester: 1, courseType: "ELECTIVE", units: 3, sortOrder: 4, description: "Choose from cybersecurity, mobile development or UX design" },
    // Year 2, Semester 2
    { code: "CS2005", title: "Software Engineering", year: 2, semester: 2, courseType: "CORE", units: 3, sortOrder: 1, description: "SDLC, agile methodologies, testing and CI/CD" },
    { code: "CS2006", title: "Operating Systems", year: 2, semester: 2, courseType: "CORE", units: 3, sortOrder: 2, description: "Process management, memory, file systems and concurrency" },
    { code: "CS2007", title: "AI Fundamentals", year: 2, semester: 2, courseType: "CORE", units: 3, sortOrder: 3, description: "Search algorithms, knowledge representation and machine learning basics" },
    { code: "CS2008", title: "Elective II", year: 2, semester: 2, courseType: "ELECTIVE", units: 3, sortOrder: 4, description: "Choose from cloud computing, data visualisation or game development" },
    // Year 3, Semester 1
    { code: "CS3001", title: "Machine Learning", year: 3, semester: 1, courseType: "SPECIALIZATION", units: 3, sortOrder: 1, description: "Supervised and unsupervised learning, neural networks" },
    { code: "CS3002", title: "Distributed Systems", year: 3, semester: 1, courseType: "SPECIALIZATION", units: 3, sortOrder: 2, description: "Microservices, containerisation and cloud architecture" },
    { code: "CS3003", title: "Industry Project I", year: 3, semester: 1, courseType: "INDUSTRY", units: 6, sortOrder: 3, description: "First half of capstone: problem definition and research phase with industry partner" },
    // Year 3, Semester 2
    { code: "CS3004", title: "Industry Project II", year: 3, semester: 2, courseType: "CAPSTONE", units: 6, sortOrder: 1, description: "Solution development, testing and deployment with industry partner" },
    { code: "CS3005", title: "Professional Practice", year: 3, semester: 2, courseType: "CORE", units: 3, sortOrder: 2, description: "Ethics, communication, leadership and career readiness" },
    { code: "CS3006", title: "Elective III", year: 3, semester: 2, courseType: "ELECTIVE", units: 3, sortOrder: 3, description: "Choose from blockchain, AR/VR or entrepreneurship" },
  ];

  for (const course of csCourses) {
    await prisma.course.upsert({
      where: { id: `cs-${course.code}` },
      update: {},
      create: { id: `cs-${course.code}`, programId: csProgram.id, ...course },
    });
  }

  // CS Career Outcomes
  const csOutcomes = [
    { title: "Software Engineer", description: "Design and build software systems at scale", icon: "code" },
    { title: "Full Stack Developer", description: "End-to-end web and mobile application development", icon: "layers" },
    { title: "DevOps Engineer", description: "Bridge development and operations with automation", icon: "server" },
    { title: "AI/ML Engineer", description: "Build and deploy machine learning models", icon: "brain" },
    { title: "Cybersecurity Analyst", description: "Protect systems and data from threats", icon: "shield" },
    { title: "Product Manager", description: "Lead product vision and cross-functional teams", icon: "target" },
  ];
  for (let i = 0; i < csOutcomes.length; i++) {
    await prisma.careerOutcome.upsert({
      where: { id: `cs-outcome-${i}` },
      update: {},
      create: { id: `cs-outcome-${i}`, programId: csProgram.id, ...csOutcomes[i], sortOrder: i },
    });
  }

  // DS Courses
  const dsCourses = [
    { code: "DS6001", title: "Statistical Foundations", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 1, description: "Probability theory, statistical inference and hypothesis testing" },
    { code: "DS6002", title: "Python for Data Science", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 2, description: "NumPy, Pandas, Matplotlib and data wrangling" },
    { code: "DS6003", title: "Database Engineering", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 3, description: "SQL, NoSQL, data warehousing and ETL pipelines" },
    { code: "DS6004", title: "Research Methods", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 4, description: "Research design, literature review and academic writing" },
    { code: "DS6005", title: "Machine Learning", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 1, description: "Regression, classification, clustering and model evaluation" },
    { code: "DS6006", title: "Big Data Technologies", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 2, description: "Spark, Hadoop, streaming data and cloud platforms" },
    { code: "DS6007", title: "Data Visualisation", year: 1, semester: 2, courseType: "ELECTIVE", units: 3, sortOrder: 3, description: "Storytelling with data, Tableau and D3.js" },
    { code: "DS6008", title: "Elective I", year: 1, semester: 2, courseType: "ELECTIVE", units: 3, sortOrder: 4, description: "Choose from NLP, computer vision or time series analysis" },
    { code: "DS7001", title: "Deep Learning", year: 2, semester: 1, courseType: "SPECIALIZATION", units: 3, sortOrder: 1, description: "Neural networks, CNNs, RNNs and transformers" },
    { code: "DS7002", title: "MLOps & Deployment", year: 2, semester: 1, courseType: "SPECIALIZATION", units: 3, sortOrder: 2, description: "Model productionisation, monitoring and A/B testing" },
    { code: "DS7003", title: "Industry Consulting Project I", year: 2, semester: 1, courseType: "INDUSTRY", units: 6, sortOrder: 3, description: "Data strategy consulting with an industry partner" },
    { code: "DS7004", title: "Master's Thesis / Industry Project II", year: 2, semester: 2, courseType: "CAPSTONE", units: 9, sortOrder: 1, description: "Original research or major industry data science project" },
    { code: "DS7005", title: "Ethics in AI & Data", year: 2, semester: 2, courseType: "CORE", units: 3, sortOrder: 2, description: "Bias, fairness, privacy and responsible data use" },
  ];

  for (const course of dsCourses) {
    await prisma.course.upsert({
      where: { id: `ds-${course.code}` },
      update: {},
      create: { id: `ds-${course.code}`, programId: dsProgram.id, ...course },
    });
  }

  const dsOutcomes = [
    { title: "Data Scientist", description: "Extract insights from complex datasets", icon: "chart" },
    { title: "ML Engineer", description: "Build and scale machine learning systems", icon: "brain" },
    { title: "Data Engineer", description: "Design and maintain data infrastructure", icon: "database" },
    { title: "Analytics Manager", description: "Lead data strategy and analytics teams", icon: "trending" },
    { title: "Research Scientist", description: "Advance the field through original research", icon: "flask" },
  ];
  for (let i = 0; i < dsOutcomes.length; i++) {
    await prisma.careerOutcome.upsert({
      where: { id: `ds-outcome-${i}` },
      update: {},
      create: { id: `ds-outcome-${i}`, programId: dsProgram.id, ...dsOutcomes[i], sortOrder: i },
    });
  }

  // BIS Courses
  const bisCourses = [
    { code: "BIS1001", title: "Introduction to IS", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 1, description: "Information systems in organisations and digital strategy" },
    { code: "BIS1002", title: "Business Fundamentals", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 2, description: "Management, economics and organisational behaviour" },
    { code: "BIS1003", title: "Programming Essentials", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 3, description: "Python basics and web scripting for business applications" },
    { code: "BIS1004", title: "Business Analytics I", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 1, description: "Excel, SQL and descriptive analytics" },
    { code: "BIS1005", title: "Systems Analysis & Design", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 2, description: "Requirements engineering and UML modelling" },
    { code: "BIS2001", title: "Enterprise Architecture", year: 2, semester: 1, courseType: "CORE", units: 3, sortOrder: 1, description: "TOGAF, IT governance and strategic alignment" },
    { code: "BIS2002", title: "Project Management", year: 2, semester: 1, courseType: "CORE", units: 3, sortOrder: 2, description: "PMBOK, agile and risk management" },
    { code: "BIS2003", title: "Business Process Management", year: 2, semester: 1, courseType: "CORE", units: 3, sortOrder: 3, description: "BPMN, process optimisation and automation" },
    { code: "BIS2004", title: "Digital Transformation", year: 2, semester: 2, courseType: "CORE", units: 3, sortOrder: 1, description: "Cloud strategy, change management and innovation" },
    { code: "BIS2005", title: "Business Intelligence", year: 2, semester: 2, courseType: "SPECIALIZATION", units: 3, sortOrder: 2, description: "Data warehousing, dashboards and KPI frameworks" },
    { code: "BIS2006", title: "Elective I", year: 2, semester: 2, courseType: "ELECTIVE", units: 3, sortOrder: 3, description: "Choose from cybersecurity, ERP systems or UX design" },
    { code: "BIS3001", title: "IS Strategy & Leadership", year: 3, semester: 1, courseType: "SPECIALIZATION", units: 3, sortOrder: 1, description: "CIO roles, IT investment and digital leadership" },
    { code: "BIS3002", title: "Consulting Practicum", year: 3, semester: 1, courseType: "INDUSTRY", units: 6, sortOrder: 2, description: "Real-world IS consulting engagement with a client organisation" },
    { code: "BIS3003", title: "Capstone: IS Innovation", year: 3, semester: 2, courseType: "CAPSTONE", units: 6, sortOrder: 1, description: "Design and implement an IS solution for a strategic business problem" },
    { code: "BIS3004", title: "Professional Ethics", year: 3, semester: 2, courseType: "CORE", units: 3, sortOrder: 2, description: "Ethics, governance and responsible technology leadership" },
  ];

  for (const course of bisCourses) {
    await prisma.course.upsert({
      where: { id: `bis-${course.code}` },
      update: {},
      create: { id: `bis-${course.code}`, programId: bisProgram.id, ...course },
    });
  }

  const bisOutcomes = [
    { title: "Business Analyst", description: "Bridge business needs and technology solutions", icon: "briefcase" },
    { title: "IT Project Manager", description: "Deliver technology projects on time and budget", icon: "calendar" },
    { title: "Digital Strategist", description: "Shape organisational digital transformation", icon: "target" },
    { title: "Systems Consultant", description: "Advise organisations on IS strategy", icon: "users" },
    { title: "Product Owner", description: "Define and prioritise product requirements", icon: "layers" },
  ];
  for (let i = 0; i < bisOutcomes.length; i++) {
    await prisma.careerOutcome.upsert({
      where: { id: `bis-outcome-${i}` },
      update: {},
      create: { id: `bis-outcome-${i}`, programId: bisProgram.id, ...bisOutcomes[i], sortOrder: i },
    });
  }

  // AI Courses
  const aiCourses = [
    { code: "AI6001", title: "Foundations of AI", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 1, description: "History, philosophy and current landscape of AI" },
    { code: "AI6002", title: "Advanced Machine Learning", year: 1, semester: 1, courseType: "CORE", units: 3, sortOrder: 2, description: "Ensemble methods, kernel machines and deep learning" },
    { code: "AI6003", title: "Natural Language Processing", year: 1, semester: 1, courseType: "SPECIALIZATION", units: 3, sortOrder: 3, description: "Transformers, LLMs and language understanding" },
    { code: "AI6004", title: "Computer Vision", year: 1, semester: 2, courseType: "SPECIALIZATION", units: 3, sortOrder: 1, description: "CNNs, object detection, segmentation and generation" },
    { code: "AI6005", title: "Reinforcement Learning", year: 1, semester: 2, courseType: "SPECIALIZATION", units: 3, sortOrder: 2, description: "MDP, Q-learning and policy gradient methods" },
    { code: "AI6006", title: "AI Ethics & Governance", year: 1, semester: 2, courseType: "CORE", units: 3, sortOrder: 3, description: "Fairness, explainability and regulatory compliance" },
    { code: "AI7001", title: "AI Research Methods", year: 2, semester: 1, courseType: "CORE", units: 3, sortOrder: 1, description: "Experimental design, benchmarking and publication" },
    { code: "AI7002", title: "AI Systems Engineering", year: 2, semester: 1, courseType: "SPECIALIZATION", units: 3, sortOrder: 2, description: "MLOps, scalable inference and system design" },
    { code: "AI7003", title: "Industry AI Project", year: 2, semester: 1, courseType: "INDUSTRY", units: 6, sortOrder: 3, description: "Solve a real AI challenge with an industry partner" },
    { code: "AI7004", title: "Master's Thesis", year: 2, semester: 2, courseType: "CAPSTONE", units: 12, sortOrder: 1, description: "Original AI research contributing to the state of the art" },
  ];

  for (const course of aiCourses) {
    await prisma.course.upsert({
      where: { id: `ai-${course.code}` },
      update: {},
      create: { id: `ai-${course.code}`, programId: aiProgram.id, ...course },
    });
  }

  const aiOutcomes = [
    { title: "AI Research Scientist", description: "Advance the frontier of AI knowledge", icon: "brain" },
    { title: "ML/AI Engineer", description: "Build production AI systems at scale", icon: "code" },
    { title: "NLP Engineer", description: "Develop language AI applications", icon: "message" },
    { title: "AI Product Manager", description: "Lead AI-powered product development", icon: "target" },
  ];
  for (let i = 0; i < aiOutcomes.length; i++) {
    await prisma.careerOutcome.upsert({
      where: { id: `ai-outcome-${i}` },
      update: {},
      create: { id: `ai-outcome-${i}`, programId: aiProgram.id, ...aiOutcomes[i], sortOrder: i },
    });
  }

  console.log("✅ Courses and career outcomes created");

  // Alumni
  const alumni = [
    {
      id: "alumni-1",
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      graduationYear: 2021,
      bio: "Sarah graduated top of her class in Computer Science and joined Google's Sydney office as part of their infrastructure team.",
      testimonial: "The program roadmap gave me a clear vision from day one. The industry project in my final year was what landed me my role at Google — I came in with real experience, not just theory.",
      featured: true,
      programId: csProgram.id,
    },
    {
      id: "alumni-2",
      name: "James Wilson",
      role: "Lead Data Scientist",
      company: "Atlassian",
      graduationYear: 2022,
      bio: "James pivoted from a finance background to data science through the Master's program and now leads analytics at Atlassian.",
      testimonial: "The master's program connected me with an incredible network of industry professionals. The curriculum was directly applicable to what I do every day.",
      featured: true,
      programId: dsProgram.id,
    },
    {
      id: "alumni-3",
      name: "Emily Parker",
      role: "Product Manager",
      company: "Canva",
      graduationYear: 2020,
      bio: "Emily's BIS degree gave her the perfect blend of technical and business skills to thrive in product management at Canva.",
      testimonial: "Understanding both the technical and business sides of systems made me a much more effective product manager. My BIS degree was the perfect foundation.",
      featured: true,
      programId: bisProgram.id,
    },
    {
      id: "alumni-4",
      name: "Michael Zhang",
      role: "AI Research Lead",
      company: "Microsoft Research",
      graduationYear: 2023,
      bio: "Michael's thesis on multimodal AI was published at NeurIPS and led directly to his role at Microsoft Research.",
      testimonial: "The research environment and industry connections in the AI program are world-class. My thesis supervisor connected me with the Microsoft team.",
      featured: true,
      programId: aiProgram.id,
    },
    {
      id: "alumni-5",
      name: "Jessica Lee",
      role: "Co-Founder & CTO",
      company: "BuildFlow AI",
      graduationYear: 2019,
      bio: "Jessica founded BuildFlow AI, a construction technology startup, using skills she developed throughout her Computer Science degree.",
      testimonial: "The entrepreneurship elective and the supportive startup community I found during my degree gave me the confidence to build my own company.",
      featured: false,
      programId: csProgram.id,
    },
    {
      id: "alumni-6",
      name: "David Brown",
      role: "Head of Analytics",
      company: "ANZ Bank",
      graduationYear: 2021,
      bio: "David leads a team of 15 analysts at ANZ, using the statistical and leadership skills he developed in the Master of Data Science.",
      testimonial: "The industry project was transformative. Working with a real financial services client in my second year meant I walked into ANZ already knowing how the industry works.",
      featured: false,
      programId: dsProgram.id,
    },
  ];

  for (const a of alumni) {
    await prisma.alumni.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
  }
  console.log("✅ Alumni created");

  // Industry Partners
  const partners = [
    { id: "partner-1", name: "Google", description: "Global technology leader partnering with us on AI research and student internship programs.", category: "Technology", tier: "GOLD", website: "https://google.com", published: true },
    { id: "partner-2", name: "Microsoft", description: "Cloud computing and AI collaboration, providing Azure credits and research partnerships.", category: "Technology", tier: "GOLD", website: "https://microsoft.com", published: true },
    { id: "partner-3", name: "Atlassian", description: "Agile software tools company offering graduate programs and capstone project sponsorship.", category: "Technology", tier: "GOLD", website: "https://atlassian.com", published: true },
    { id: "partner-4", name: "ANZ Bank", description: "Financial services industry partner sponsoring data science and analytics capstone projects.", category: "Finance", tier: "SILVER", website: "https://anz.com.au", published: true },
    { id: "partner-5", name: "Commonwealth Bank", description: "Australia's largest bank offering graduate rotations and hackathon sponsorship.", category: "Finance", tier: "SILVER", website: "https://commbank.com.au", published: true },
    { id: "partner-6", name: "SA Health", description: "State government health department partnering on digital health and data analytics projects.", category: "Healthcare", tier: "SILVER", website: "https://sahealth.sa.gov.au", published: true },
    { id: "partner-7", name: "BHP", description: "Global mining and resources company leveraging technology graduates for digital transformation.", category: "Engineering", tier: "SILVER", website: "https://bhp.com", published: true },
    { id: "partner-8", name: "Canva", description: "Design platform offering internships and project collaboration with design technology students.", category: "Technology", tier: "BRONZE", website: "https://canva.com", published: true },
    { id: "partner-9", name: "Defence SA", description: "State government defence industry partner for cybersecurity and systems engineering projects.", category: "Government", tier: "BRONZE", website: "https://defencesa.com", published: true },
    { id: "partner-10", name: "Westpac", description: "Financial institution sponsoring fintech innovation projects and graduate employment.", category: "Finance", tier: "BRONZE", website: "https://westpac.com.au", published: true },
  ];

  for (const p of partners) {
    await prisma.industryPartner.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }
  console.log("✅ Industry partners created");

  console.log("🎉 Database seeded successfully!");
  console.log("\n📝 Admin credentials:");
  console.log("   Email:    admin@programroadmap.edu");
  console.log("   Password: Admin@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
