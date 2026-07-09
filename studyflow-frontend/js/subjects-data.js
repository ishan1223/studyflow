const STUDYFLOW_CURRICULUM = {
  school: {
    label: "School Student",
    icon: "fas fa-school",
    subcategories: {
      "class-6-8": {
        label: "Class 6 – 8",
        defaultSubjects: ["maths", "science", "social", "english", "hindi"],
        subjects: {
          maths: {
            label: "Mathematics", icon: "fas fa-square-root-alt", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Number System", intro: "Explore integers, fractions, decimals and rational numbers — the building blocks of all mathematics.", topics: ["Integers", "Fractions & Decimals", "Rational Numbers", "Powers & Exponents"] },
              { id: "ch2", title: "Algebra Basics", intro: "Learn how letters replace numbers to form expressions and equations you can solve.", topics: ["Variables & Expressions", "Linear Equations", "Simple Inequalities"] },
              { id: "ch3", title: "Geometry", intro: "Angles, triangles, and polygons — understand the shapes that make up our world.", topics: ["Lines & Angles", "Triangles", "Quadrilaterals", "Circles Basics"] },
              { id: "ch4", title: "Mensuration", intro: "Calculate areas and perimeters of 2D shapes with real-world applications.", topics: ["Area of Triangles", "Area of Quadrilaterals", "Perimeter Problems"] },
              { id: "ch5", title: "Data Handling", intro: "Collect, organise, and interpret data using graphs and averages.", topics: ["Mean, Median, Mode", "Bar Graphs", "Pie Charts", "Probability Intro"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Number System – Khan Academy", url: "https://www.youtube.com/watch?v=ycin6tXHQ_k" }, { type: "notes", title: "NCERT Chapter Notes", url: "https://ncert.nic.in/textbook.php?gehm1=1-14" }],
              ch2: [{ type: "youtube", title: "Algebra for Beginners", url: "https://www.youtube.com/watch?v=NybHckSEQBI" }],
              ch3: [{ type: "youtube", title: "Geometry Basics – MathAntics", url: "https://www.youtube.com/watch?v=KtcBnm9v7i8" }],
              ch4: [{ type: "youtube", title: "Mensuration Made Easy", url: "https://www.youtube.com/watch?v=qzBfnHFMxM8" }],
              ch5: [{ type: "youtube", title: "Data Handling & Statistics", url: "https://www.youtube.com/watch?v=SzZ6GpcfoQY" }]
            }
          },
          science: {
            label: "Science", icon: "fas fa-flask", color: "#059669",
            chapters: [
              { id: "ch1", title: "Cell – Structure & Function", intro: "The cell is the basic unit of life. Discover its parts and how they work together.", topics: ["Cell Theory", "Plant vs Animal Cell", "Cell Organelles", "Cell Division Intro"] },
              { id: "ch2", title: "Motion & Force", intro: "Understand how objects move and what causes them to change speed or direction.", topics: ["Types of Motion", "Speed & Velocity", "Force & Pressure", "Friction"] },
              { id: "ch3", title: "Light", intro: "Learn how light travels, reflects, and refracts — the science behind mirrors and lenses.", topics: ["Reflection", "Refraction", "Lenses & Mirrors", "Human Eye"] },
              { id: "ch4", title: "Microorganisms", intro: "Invisible yet powerful — explore bacteria, viruses, fungi and their role in our world.", topics: ["Types of Microbes", "Useful Microorganisms", "Diseases & Prevention", "Food Preservation"] },
              { id: "ch5", title: "Chemical Reactions", intro: "Matter changes. Learn how and why chemical reactions happen around us every day.", topics: ["Types of Reactions", "Acids & Bases", "Indicators", "Neutralisation"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Cell Structure – Amoeba Sisters", url: "https://www.youtube.com/watch?v=8IlzKri08kk" }],
              ch2: [{ type: "youtube", title: "Force & Motion – Physics Girl", url: "https://www.youtube.com/watch?v=_y2iS1g06mE" }],
              ch3: [{ type: "youtube", title: "Light & Optics Explained", url: "https://www.youtube.com/watch?v=uhHBKABCWQc" }],
              ch4: [{ type: "youtube", title: "Microorganisms – Class 8 NCERT", url: "https://www.youtube.com/watch?v=SKbXZFVn_7M" }],
              ch5: [{ type: "youtube", title: "Chemical Reactions for Beginners", url: "https://www.youtube.com/watch?v=8m6RtOpqvtU" }]
            }
          },
          social: {
            label: "Social Studies", icon: "fas fa-globe-asia", color: "#D97706",
            chapters: [
              { id: "ch1", title: "Resources & Development", intro: "What are resources, how are they classified, and why sustainable use matters.", topics: ["Natural Resources", "Human Resources", "Resource Conservation", "Land Use"] },
              { id: "ch2", title: "Indian History – Medieval Period", intro: "Explore the rise of empires, trade routes, and cultural shifts in medieval India.", topics: ["Delhi Sultanate", "Mughal Empire", "Bhakti & Sufi Movements", "Art & Architecture"] },
              { id: "ch3", title: "Indian Constitution", intro: "The foundation of Indian democracy — rights, duties, and how government works.", topics: ["Fundamental Rights", "Fundamental Duties", "Parliament", "Judiciary"] },
              { id: "ch4", title: "Agriculture in India", intro: "India is an agrarian economy. Understand crops, seasons, and farming challenges.", topics: ["Kharif & Rabi Crops", "Irrigation Methods", "Green Revolution", "Challenges"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Resources – Geography Class 8", url: "https://www.youtube.com/watch?v=4RIrWQpxOw0" }],
              ch2: [{ type: "youtube", title: "Medieval India – Quick Revision", url: "https://www.youtube.com/watch?v=nM6T7p4EWWU" }],
              ch3: [{ type: "youtube", title: "Indian Constitution Explained", url: "https://www.youtube.com/watch?v=JgSFe9EGpJ4" }],
              ch4: [{ type: "youtube", title: "Agriculture in India", url: "https://www.youtube.com/watch?v=tXolXjETH4U" }]
            }
          },
          english: {
            label: "English", icon: "fas fa-book-open", color: "#2563EB",
            chapters: [
              { id: "ch1", title: "Grammar Foundations", intro: "Parts of speech, tenses, and sentence structure — the rules that make English work.", topics: ["Nouns & Pronouns", "Verbs & Tenses", "Adjectives & Adverbs", "Sentence Types"] },
              { id: "ch2", title: "Reading Comprehension", intro: "Read passages, extract meaning, and answer questions with precision.", topics: ["Main Idea", "Inference", "Vocabulary in Context", "Summarising"] },
              { id: "ch3", title: "Writing Skills", intro: "Express ideas clearly through paragraphs, letters, and essays.", topics: ["Paragraph Writing", "Formal Letters", "Story Writing", "Notice & Message"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "English Grammar – Basic Rules", url: "https://www.youtube.com/watch?v=V-4q9dBljWY" }],
              ch2: [{ type: "youtube", title: "Reading Comprehension Tips", url: "https://www.youtube.com/watch?v=A74KfkLHMBE" }],
              ch3: [{ type: "youtube", title: "Essay & Letter Writing Guide", url: "https://www.youtube.com/watch?v=A3AvE0CKMYI" }]
            }
          },
          hindi: {
            label: "Hindi", icon: "fas fa-language", color: "#DC2626",
            chapters: [
              { id: "ch1", title: "व्याकरण (Grammar)", intro: "हिंदी भाषा के नियम — संज्ञा, सर्वनाम, क्रिया और वाक्य रचना।", topics: ["संज्ञा व सर्वनाम", "क्रिया और काल", "विशेषण", "वाक्य रचना"] },
              { id: "ch2", title: "गद्य और पद्य (Prose & Poetry)", intro: "NCERT पाठ्यक्रम के मुख्य पाठ और कविताएं।", topics: ["गद्य पाठ", "कविता", "भाव व अर्थ", "प्रश्नोत्तर"] },
              { id: "ch3", title: "लेखन कौशल (Writing)", intro: "पत्र, निबंध और अनुच्छेद लेखन।", topics: ["पत्र लेखन", "निबंध लेखन", "अनुच्छेद", "सारांश"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Hindi Vyakaran – Class 7 & 8", url: "https://www.youtube.com/watch?v=6O4gMlnFAQk" }],
              ch2: [{ type: "youtube", title: "NCERT Hindi Chapters Explained", url: "https://www.youtube.com/watch?v=2gWXx2tqLSA" }],
              ch3: [{ type: "youtube", title: "Hindi Letter & Essay Writing", url: "https://www.youtube.com/watch?v=Ud1mXNK4tBs" }]
            }
          }
        }
      },
      "class-9-10": {
        label: "Class 9 – 10",
        defaultSubjects: ["maths", "physics", "chemistry", "biology", "sst", "english"],
        subjects: {
          maths: {
            label: "Mathematics", icon: "fas fa-square-root-alt", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Real Numbers", intro: "Euclid's division lemma, HCF, LCM, and the beauty of irrational numbers.", topics: ["Euclid's Algorithm", "Fundamental Theorem", "Irrational Numbers", "Decimal Expansions"] },
              { id: "ch2", title: "Polynomials", intro: "Zeroes, coefficients, and factorisation — the algebra of expressions.", topics: ["Zeroes of Polynomial", "Remainder Theorem", "Factor Theorem", "Algebraic Identities"] },
              { id: "ch3", title: "Linear Equations", intro: "Two equations, two unknowns — graphical and algebraic methods.", topics: ["Graphical Method", "Substitution", "Elimination", "Cross Multiplication"] },
              { id: "ch4", title: "Quadratic Equations", intro: "Factorisation, completing the square, and the quadratic formula.", topics: ["Factorisation Method", "Completing the Square", "Quadratic Formula", "Nature of Roots"] },
              { id: "ch5", title: "Trigonometry", intro: "Sine, cosine, tangent — the mathematics of triangles and angles.", topics: ["Trig Ratios", "Trig Identities", "Heights & Distances", "Applications"] },
              { id: "ch6", title: "Statistics & Probability", intro: "Analyse data and calculate chances with mean, median, mode and probability.", topics: ["Mean/Median/Mode", "Cumulative Frequency", "Probability", "Events & Sample Space"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Real Numbers – Vedantu Class 10", url: "https://www.youtube.com/watch?v=0_HFPBJYdgI" }],
              ch2: [{ type: "youtube", title: "Polynomials – Khan Academy", url: "https://www.youtube.com/watch?v=FFoHZpCbUAI" }],
              ch3: [{ type: "youtube", title: "Linear Equations – 2 Variables", url: "https://www.youtube.com/watch?v=M-5QaObVxFk" }],
              ch4: [{ type: "youtube", title: "Quadratic Equations Full Chapter", url: "https://www.youtube.com/watch?v=n8hhL8ysBGw" }],
              ch5: [{ type: "youtube", title: "Trigonometry from Scratch", url: "https://www.youtube.com/watch?v=PUB0TaZ7bhA" }],
              ch6: [{ type: "youtube", title: "Statistics & Probability Class 10", url: "https://www.youtube.com/watch?v=MXaJ7sa7q-8" }]
            }
          },
          physics: {
            label: "Physics", icon: "fas fa-atom", color: "#0891B2",
            chapters: [
              { id: "ch1", title: "Motion", intro: "Distance, displacement, speed, velocity and acceleration — the language of movement.", topics: ["Distance vs Displacement", "Speed & Velocity", "Acceleration", "Equations of Motion", "Graphs"] },
              { id: "ch2", title: "Laws of Motion", intro: "Newton's three laws explain why everything moves the way it does.", topics: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Momentum"] },
              { id: "ch3", title: "Gravitation", intro: "What goes up must come down — gravity, free fall, and universal gravitation.", topics: ["Universal Law", "Free Fall", "Weight vs Mass", "Escape Velocity"] },
              { id: "ch4", title: "Light – Reflection & Refraction", intro: "Mirrors, lenses, and the laws that govern how light bends and bounces.", topics: ["Laws of Reflection", "Mirrors", "Refraction", "Lenses", "Power of Lens"] },
              { id: "ch5", title: "Electricity", intro: "Current, voltage, resistance — the fundamentals of electric circuits.", topics: ["Ohm's Law", "Resistance", "Series & Parallel", "Electric Power"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Motion – Class 9 Physics", url: "https://www.youtube.com/watch?v=5Ky-CpJNTFU" }],
              ch2: [{ type: "youtube", title: "Newton's Laws – MinutePhysics", url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds" }],
              ch3: [{ type: "youtube", title: "Gravitation – Vedantu", url: "https://www.youtube.com/watch?v=QcUey-DVYuf" }],
              ch4: [{ type: "youtube", title: "Light Reflection & Refraction", url: "https://www.youtube.com/watch?v=7Dm0K4uY2IE" }],
              ch5: [{ type: "youtube", title: "Electricity Class 10 Full Chapter", url: "https://www.youtube.com/watch?v=1UrHnIb_ecc" }]
            }
          },
          chemistry: {
            label: "Chemistry", icon: "fas fa-vial", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Matter in Our Surroundings", intro: "States of matter, interconversion, and the particle nature of matter.", topics: ["Solid, Liquid, Gas", "Evaporation", "Sublimation", "Latent Heat"] },
              { id: "ch2", title: "Atoms & Molecules", intro: "The building blocks of matter — atomic theory, atomic mass, and molecules.", topics: ["Dalton's Theory", "Atomic Mass", "Molecules", "Mole Concept"] },
              { id: "ch3", title: "Structure of Atom", intro: "Protons, neutrons, electrons — inside the atom and electronic configuration.", topics: ["Subatomic Particles", "Bohr's Model", "Electronic Config", "Valency"] },
              { id: "ch4", title: "Chemical Reactions & Equations", intro: "How to write, balance and classify chemical equations.", topics: ["Balancing Equations", "Types of Reactions", "Oxidation & Reduction", "Corrosion"] },
              { id: "ch5", title: "Acids, Bases & Salts", intro: "pH scale, indicators, and the chemistry of everyday substances.", topics: ["Properties of Acids/Bases", "pH Scale", "Salts", "Baking Soda & Bleach"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Matter – States & Changes", url: "https://www.youtube.com/watch?v=s-KvoVzukHo" }],
              ch2: [{ type: "youtube", title: "Atoms & Molecules – Class 9", url: "https://www.youtube.com/watch?v=rz6oMVfRmHU" }],
              ch3: [{ type: "youtube", title: "Structure of Atom – Crash Course", url: "https://www.youtube.com/watch?v=xazQRcSCRaY" }],
              ch4: [{ type: "youtube", title: "Chemical Reactions & Equations", url: "https://www.youtube.com/watch?v=ZPvGBLGJN0s" }],
              ch5: [{ type: "youtube", title: "Acids, Bases & Salts Full Chapter", url: "https://www.youtube.com/watch?v=g5e0p4OQQbg" }]
            }
          },
          biology: {
            label: "Biology", icon: "fas fa-dna", color: "#059669",
            chapters: [
              { id: "ch1", title: "Cell – Fundamental Unit of Life", intro: "Prokaryotic vs eukaryotic, cell organelles and their functions.", topics: ["Cell Theory", "Cell Organelles", "Plant vs Animal Cell", "Cell Division"] },
              { id: "ch2", title: "Tissues", intro: "Groups of similar cells performing a common function.", topics: ["Plant Tissues", "Animal Tissues", "Epithelial", "Connective & Muscular"] },
              { id: "ch3", title: "Life Processes", intro: "Nutrition, respiration, transportation and excretion in living organisms.", topics: ["Nutrition", "Respiration", "Transportation", "Excretion"] },
              { id: "ch4", title: "Reproduction", intro: "How life continues — asexual and sexual reproduction in plants and animals.", topics: ["Asexual Reproduction", "Sexual Reproduction", "Human Reproduction", "Reproduction in Plants"] },
              { id: "ch5", title: "Heredity & Evolution", intro: "Mendel's laws, DNA, and the story of how species change over time.", topics: ["Mendel's Experiments", "Heredity", "Evolution", "Natural Selection"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Cell Biology – Amoeba Sisters", url: "https://www.youtube.com/watch?v=8IlzKri08kk" }],
              ch2: [{ type: "youtube", title: "Tissues – Class 9 Biology", url: "https://www.youtube.com/watch?v=AH1l6eTlBUs" }],
              ch3: [{ type: "youtube", title: "Life Processes Full Chapter", url: "https://www.youtube.com/watch?v=XnqfJDWHMhQ" }],
              ch4: [{ type: "youtube", title: "Reproduction – Class 10", url: "https://www.youtube.com/watch?v=ttTgXBvZyGE" }],
              ch5: [{ type: "youtube", title: "Heredity & Evolution Explained", url: "https://www.youtube.com/watch?v=TRwFMpwt9S0" }]
            }
          },
          sst: {
            label: "Social Science", icon: "fas fa-globe-asia", color: "#D97706",
            chapters: [
              { id: "ch1", title: "India & Contemporary World", intro: "French Revolution, Nationalism, and Industrialisation — history that shaped the modern world.", topics: ["French Revolution", "Nationalism in Europe", "Nazism", "Industrialisation"] },
              { id: "ch2", title: "Contemporary India – Geography", intro: "India's physical features, climate, vegetation, and natural resources.", topics: ["Physical Features", "Climate", "Natural Vegetation", "Water Resources"] },
              { id: "ch3", title: "Democratic Politics", intro: "Elections, political parties, democracy and its challenges.", topics: ["Democracy", "Electoral System", "Political Parties", "Outcomes of Democracy"] },
              { id: "ch4", title: "Economics", intro: "Development, sectors of economy, money, credit, and globalisation.", topics: ["Development", "Sectors of Economy", "Money & Banking", "Globalisation"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "French Revolution – Class 9 History", url: "https://www.youtube.com/watch?v=5fJl_ZX91l0" }],
              ch2: [{ type: "youtube", title: "India Geography Full Revision", url: "https://www.youtube.com/watch?v=9vMSp7h5r5c" }],
              ch3: [{ type: "youtube", title: "Democratic Politics – Class 10", url: "https://www.youtube.com/watch?v=5UmGHMKkBFk" }],
              ch4: [{ type: "youtube", title: "Economics Class 10 – Full Chapter", url: "https://www.youtube.com/watch?v=W4zxJXkfzCk" }]
            }
          },
          english: {
            label: "English", icon: "fas fa-book-open", color: "#2563EB",
            chapters: [
              { id: "ch1", title: "Grammar – Advanced", intro: "Tenses, modals, clauses, voice and narration for board-level grammar.", topics: ["Tenses", "Modals", "Clauses", "Active & Passive", "Direct & Indirect"] },
              { id: "ch2", title: "Reading Comprehension", intro: "Speed reading and comprehension techniques for board exams.", topics: ["Factual Passages", "Discursive Passages", "Gap Filling", "Editing"] },
              { id: "ch3", title: "Writing Skills", intro: "Formal/informal writing, articles, reports, speeches and letters.", topics: ["Formal Letter", "Article Writing", "Report Writing", "Speech"] },
              { id: "ch4", title: "Literature", intro: "NCERT prose and poetry — themes, characters, and critical analysis.", topics: ["Prose Analysis", "Poetry Appreciation", "Character Sketch", "Theme & Message"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "English Grammar Board Prep", url: "https://www.youtube.com/watch?v=3V-ZCFyPmtg" }],
              ch2: [{ type: "youtube", title: "Comprehension Tips – Class 10", url: "https://www.youtube.com/watch?v=9bqBRlkJnUI" }],
              ch3: [{ type: "youtube", title: "Writing Skills – Letter & Article", url: "https://www.youtube.com/watch?v=A3AvE0CKMYI" }],
              ch4: [{ type: "youtube", title: "First Flight & Footprints – NCERT", url: "https://www.youtube.com/watch?v=X47h2T0JJGU" }]
            }
          }
        }
      },
      "class-11-12-pcm": {
        label: "Class 11 – 12 (PCM)",
        defaultSubjects: ["physics", "chemistry", "maths", "english"],
        subjects: {
          physics: {
            label: "Physics", icon: "fas fa-atom", color: "#0891B2",
            chapters: [
              { id: "ch1", title: "Kinematics", intro: "Motion in 1D and 2D — vectors, projectiles, and relative motion.", topics: ["Vectors", "Projectile Motion", "Relative Velocity", "Circular Motion"] },
              { id: "ch2", title: "Laws of Motion", intro: "Newton's laws in depth — friction, banking, connected systems.", topics: ["Newton's Laws", "Friction", "Banking of Roads", "Connected Bodies"] },
              { id: "ch3", title: "Work, Energy & Power", intro: "Energy conservation, work-energy theorem, and collision theory.", topics: ["Work-Energy Theorem", "Potential & Kinetic Energy", "Power", "Collisions"] },
              { id: "ch4", title: "Electrostatics", intro: "Coulomb's law, electric field, potential and capacitors.", topics: ["Coulomb's Law", "Electric Field", "Gauss's Law", "Capacitance"] },
              { id: "ch5", title: "Current Electricity", intro: "Ohm's law, Kirchhoff's laws, Wheatstone bridge and more.", topics: ["Drift Velocity", "Kirchhoff's Laws", "Wheatstone Bridge", "Meter Bridge"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Kinematics – Physics Wallah", url: "https://www.youtube.com/watch?v=WgGFxYCMleA" }, { type: "notes", title: "HC Verma Solutions", url: "https://www.hcvermasolutions.com/" }],
              ch2: [{ type: "youtube", title: "Laws of Motion – JEE Level", url: "https://www.youtube.com/watch?v=KM40fDkU7_Y" }],
              ch3: [{ type: "youtube", title: "Work Energy Power – Vedantu", url: "https://www.youtube.com/watch?v=Tl9DkFMcDVQ" }],
              ch4: [{ type: "youtube", title: "Electrostatics Full Chapter", url: "https://www.youtube.com/watch?v=r7HxrGSX_Lw" }],
              ch5: [{ type: "youtube", title: "Current Electricity – Class 12", url: "https://www.youtube.com/watch?v=0-DGNKkQAmw" }]
            }
          },
          chemistry: {
            label: "Chemistry", icon: "fas fa-vial", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Some Basic Concepts", intro: "Mole concept, stoichiometry, and the language of chemistry.", topics: ["Mole Concept", "Stoichiometry", "Limiting Reagent", "Concentration Terms"] },
              { id: "ch2", title: "Atomic Structure", intro: "Quantum model, orbitals, electronic configuration and periodic trends.", topics: ["Quantum Numbers", "Orbitals", "Electronic Config", "Periodic Properties"] },
              { id: "ch3", title: "Chemical Bonding", intro: "Ionic, covalent, metallic bonds and molecular geometry.", topics: ["Ionic Bonds", "Covalent Bonds", "VSEPR Theory", "Hybridisation"] },
              { id: "ch4", title: "Thermodynamics", intro: "Energy, enthalpy, entropy and Gibbs free energy in chemical systems.", topics: ["System & Surroundings", "Enthalpy", "Entropy", "Gibbs Energy"] },
              { id: "ch5", title: "Organic Chemistry Basics", intro: "Nomenclature, isomerism, and reaction mechanisms.", topics: ["IUPAC Nomenclature", "Isomerism", "Reaction Mechanisms", "Inductive Effect"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Mole Concept – Chemistry Wallah", url: "https://www.youtube.com/watch?v=3Vc5e4TBNZ0" }],
              ch2: [{ type: "youtube", title: "Atomic Structure Full Chapter", url: "https://www.youtube.com/watch?v=WinDDhV7Bcs" }],
              ch3: [{ type: "youtube", title: "Chemical Bonding – JEE Prep", url: "https://www.youtube.com/watch?v=5qIbKwLnfQQ" }],
              ch4: [{ type: "youtube", title: "Thermodynamics – Class 11", url: "https://www.youtube.com/watch?v=h_eTLGiqmvQ" }],
              ch5: [{ type: "youtube", title: "Organic Chemistry Basics", url: "https://www.youtube.com/watch?v=uLHj3dMIStI" }]
            }
          },
          maths: {
            label: "Mathematics", icon: "fas fa-square-root-alt", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Sets, Relations & Functions", intro: "The mathematical foundation — sets, mappings, and function types.", topics: ["Sets", "Relations", "Functions", "Inverse Functions"] },
              { id: "ch2", title: "Trigonometry", intro: "Advanced trig — identities, equations, and inverse trig functions.", topics: ["Trig Identities", "Trig Equations", "Inverse Trig", "Properties of Triangles"] },
              { id: "ch3", title: "Algebra – Sequences & Series", intro: "AP, GP, and special series — patterns in numbers.", topics: ["AP", "GP", "Sum of Series", "Binomial Theorem"] },
              { id: "ch4", title: "Calculus – Limits & Derivatives", intro: "The foundation of calculus — limits, continuity and differentiation.", topics: ["Limits", "Continuity", "Derivatives", "Chain Rule", "Applications"] },
              { id: "ch5", title: "Calculus – Integration", intro: "Antiderivatives, definite integrals, and area under curves.", topics: ["Indefinite Integrals", "Methods of Integration", "Definite Integrals", "Area"] },
              { id: "ch6", title: "Coordinate Geometry", intro: "Straight lines, circles, parabola, ellipse and hyperbola.", topics: ["Straight Lines", "Circles", "Parabola", "Ellipse", "Hyperbola"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Sets & Functions – Class 11", url: "https://www.youtube.com/watch?v=ZCDSbXXR5uw" }],
              ch2: [{ type: "youtube", title: "Trigonometry – JEE Level", url: "https://www.youtube.com/watch?v=pSyOPNY17p4" }],
              ch3: [{ type: "youtube", title: "Sequences & Series Full Chapter", url: "https://www.youtube.com/watch?v=XHjnCIX3d5A" }],
              ch4: [{ type: "youtube", title: "Limits & Derivatives – Unacademy", url: "https://www.youtube.com/watch?v=N7kEKZ7sMwI" }],
              ch5: [{ type: "youtube", title: "Integration – Full Chapter", url: "https://www.youtube.com/watch?v=rfG8ce4nNh0" }],
              ch6: [{ type: "youtube", title: "Coordinate Geometry – JEE Mains", url: "https://www.youtube.com/watch?v=hDn76WLBFHQ" }]
            }
          },
          english: {
            label: "English", icon: "fas fa-book-open", color: "#2563EB",
            chapters: [
              { id: "ch1", title: "Advanced Grammar", intro: "Board-level grammar — clauses, transformations, reported speech.", topics: ["Reported Speech", "Transformation", "Clauses", "Error Correction"] },
              { id: "ch2", title: "Writing Skills", intro: "Articles, speeches, debates, reports and creative writing.", topics: ["Article", "Speech", "Debate", "Report", "Creative Writing"] },
              { id: "ch3", title: "Literature – Flamingo & Vistas", intro: "Analysis of NCERT Class 12 prose and poetry.", topics: ["The Last Lesson", "Lost Spring", "The Tiger King", "Poetry Analysis"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Class 12 English Grammar", url: "https://www.youtube.com/watch?v=3V-ZCFyPmtg" }],
              ch2: [{ type: "youtube", title: "Writing Skills – Class 12", url: "https://www.youtube.com/watch?v=eXOoHrclIK8" }],
              ch3: [{ type: "youtube", title: "Flamingo Chapter Summaries", url: "https://www.youtube.com/watch?v=LBi14NqT6VQ" }]
            }
          }
        }
      }
    }
  },
  college: {
    label: "College Student",
    icon: "fas fa-university",
    subcategories: {
      btech: {
        label: "B.Tech / B.E.",
        defaultSubjects: ["dsa", "dbms", "os", "cn", "maths"],
        subjects: {
          dsa: {
            label: "Data Structures & Algorithms", icon: "fas fa-code-branch", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Arrays & Strings", intro: "The most fundamental data structure — learn manipulation, two pointers, and sliding window.", topics: ["Array Basics", "Two Pointer", "Sliding Window", "Prefix Sum", "Kadane's Algorithm"] },
              { id: "ch2", title: "Linked Lists", intro: "Dynamic data with pointers — singly, doubly, circular lists and classic problems.", topics: ["Singly Linked List", "Doubly Linked List", "Reverse a List", "Detect Cycle", "Merge Lists"] },
              { id: "ch3", title: "Stacks & Queues", intro: "LIFO and FIFO structures — implementation and classic applications.", topics: ["Stack Implementation", "Queue Implementation", "Monotonic Stack", "Deque", "Applications"] },
              { id: "ch4", title: "Trees & Graphs", intro: "Hierarchical and network structures — traversals, BFS, DFS, shortest paths.", topics: ["Binary Tree", "BST", "Tree Traversals", "Graph BFS/DFS", "Shortest Path"] },
              { id: "ch5", title: "Dynamic Programming", intro: "Memoisation and tabulation — solve complex problems by breaking them into subproblems.", topics: ["Memoisation", "Tabulation", "Knapsack", "LCS", "Matrix Chain"] },
              { id: "ch6", title: "Sorting & Searching", intro: "Classic sorting algorithms and efficient search techniques.", topics: ["Bubble/Selection/Insertion", "Merge Sort", "Quick Sort", "Binary Search", "Complexity"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Arrays – Striver A2Z Sheet", url: "https://www.youtube.com/watch?v=37E9ckMDdTk" }, { type: "notes", title: "Striver's A2Z DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" }],
              ch2: [{ type: "youtube", title: "Linked List – Complete Playlist", url: "https://www.youtube.com/watch?v=Nq7ok-OyEpg" }],
              ch3: [{ type: "youtube", title: "Stacks & Queues – Striver", url: "https://www.youtube.com/watch?v=tqQ5fTamIN4" }],
              ch4: [{ type: "youtube", title: "Trees & Graphs – Full Playlist", url: "https://www.youtube.com/watch?v=_ANrF3FJm7I" }, { type: "notes", title: "Graph Algorithms – CP Algorithms", url: "https://cp-algorithms.com/graph/breadth-first-search.html" }],
              ch5: [{ type: "youtube", title: "Dynamic Programming – Aditya Verma", url: "https://www.youtube.com/watch?v=nqowUJzG-iM" }, { type: "notes", title: "DP Patterns – LeetCode", url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns" }],
              ch6: [{ type: "youtube", title: "Sorting Algorithms Visualised", url: "https://www.youtube.com/watch?v=kPRA0W1kECg" }]
            }
          },
          dbms: {
            label: "Database Management Systems", icon: "fas fa-database", color: "#D97706",
            chapters: [
              { id: "ch1", title: "Introduction to DBMS", intro: "What databases are, why they exist, and the DBMS architecture.", topics: ["Database vs File System", "DBMS Architecture", "Users & DBA", "Data Independence"] },
              { id: "ch2", title: "Relational Model & SQL", intro: "Tables, keys, constraints and writing SQL queries.", topics: ["Relational Model", "Keys", "SQL DDL", "SQL DML", "Joins", "Subqueries"] },
              { id: "ch3", title: "ER Model & Normalization", intro: "Design databases correctly using ER diagrams and normal forms.", topics: ["ER Diagrams", "Mapping ER to Tables", "1NF 2NF 3NF", "BCNF"] },
              { id: "ch4", title: "Transactions & Concurrency", intro: "ACID properties, transaction states, and handling concurrent access.", topics: ["ACID Properties", "Transaction States", "Concurrency Problems", "Locking"] },
              { id: "ch5", title: "Indexing & Query Processing", intro: "Speed up queries with indexing and understand how queries are executed.", topics: ["Indexing Types", "B+ Trees", "Query Processing", "Query Optimization"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "DBMS Full Course – Gate Smashers", url: "https://www.youtube.com/watch?v=kBdlM6hNDAE" }, { type: "notes", title: "DBMS Notes – GeeksForGeeks", url: "https://www.geeksforgeeks.org/dbms/" }],
              ch2: [{ type: "youtube", title: "SQL Full Tutorial – Traversy Media", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" }],
              ch3: [{ type: "youtube", title: "ER Model & Normalization", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc" }],
              ch4: [{ type: "youtube", title: "Transactions & Concurrency Control", url: "https://www.youtube.com/watch?v=5ZjhNTM8XU8" }],
              ch5: [{ type: "youtube", title: "Indexing in DBMS", url: "https://www.youtube.com/watch?v=aZjYr87r1b8" }]
            }
          },
          os: {
            label: "Operating Systems", icon: "fas fa-server", color: "#059669",
            chapters: [
              { id: "ch1", title: "Introduction to OS", intro: "What an OS does, types of OS, and system calls.", topics: ["OS Functions", "Types of OS", "System Calls", "OS Structure"] },
              { id: "ch2", title: "Process Management", intro: "Process lifecycle, scheduling algorithms, and inter-process communication.", topics: ["Process States", "PCB", "Scheduling Algorithms", "IPC", "Threads"] },
              { id: "ch3", title: "Memory Management", intro: "How OS manages RAM — paging, segmentation, and virtual memory.", topics: ["Contiguous Allocation", "Paging", "Segmentation", "Virtual Memory", "Page Replacement"] },
              { id: "ch4", title: "Deadlocks", intro: "What causes deadlocks, detection, prevention and avoidance.", topics: ["Deadlock Conditions", "Resource Allocation Graph", "Banker's Algorithm", "Prevention"] },
              { id: "ch5", title: "File Systems & I/O", intro: "File organisation, disk scheduling and I/O management.", topics: ["File Organisation", "Directory Structure", "Disk Scheduling", "I/O Management"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "OS Full Course – Gate Smashers", url: "https://www.youtube.com/watch?v=bkSWJJZNgf8" }, { type: "notes", title: "OS Notes – GeeksForGeeks", url: "https://www.geeksforgeeks.org/operating-systems/" }],
              ch2: [{ type: "youtube", title: "Process Scheduling Algorithms", url: "https://www.youtube.com/watch?v=2h3eWaPx8SA" }],
              ch3: [{ type: "youtube", title: "Memory Management – Paging", url: "https://www.youtube.com/watch?v=pJ6qrCB8pDw" }],
              ch4: [{ type: "youtube", title: "Deadlock – Banker's Algorithm", url: "https://www.youtube.com/watch?v=7gMLNiEz3nw" }],
              ch5: [{ type: "youtube", title: "File Systems & Disk Scheduling", url: "https://www.youtube.com/watch?v=NtmwXM9iBkw" }]
            }
          },
          cn: {
            label: "Computer Networks", icon: "fas fa-network-wired", color: "#DC2626",
            chapters: [
              { id: "ch1", title: "Network Fundamentals", intro: "Types of networks, topologies, and the OSI vs TCP/IP model.", topics: ["Network Types", "Topologies", "OSI Model", "TCP/IP Model"] },
              { id: "ch2", title: "Data Link Layer", intro: "Framing, error detection, flow control and MAC protocols.", topics: ["Framing", "Error Detection", "CRC", "Flow Control", "MAC Protocols"] },
              { id: "ch3", title: "Network Layer", intro: "IP addressing, subnetting, routing algorithms and protocols.", topics: ["IP Addressing", "Subnetting", "Routing Algorithms", "OSPF", "BGP"] },
              { id: "ch4", title: "Transport Layer", intro: "TCP vs UDP, connection establishment, congestion control.", topics: ["TCP vs UDP", "3-Way Handshake", "Flow Control", "Congestion Control"] },
              { id: "ch5", title: "Application Layer", intro: "HTTP, DNS, SMTP, FTP — the protocols you use every day.", topics: ["HTTP/HTTPS", "DNS", "SMTP", "FTP", "DHCP"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Computer Networks – Gate Smashers", url: "https://www.youtube.com/watch?v=JFF2vAaN6Uc" }, { type: "notes", title: "CN Notes – GeeksForGeeks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" }],
              ch2: [{ type: "youtube", title: "Data Link Layer Protocols", url: "https://www.youtube.com/watch?v=jGWxhQQAT6Y" }],
              ch3: [{ type: "youtube", title: "IP Addressing & Subnetting", url: "https://www.youtube.com/watch?v=ddM9AcreVqY" }],
              ch4: [{ type: "youtube", title: "TCP/IP – 3 Way Handshake", url: "https://www.youtube.com/watch?v=xMtP5ZB3wSU" }],
              ch5: [{ type: "youtube", title: "Application Layer Protocols", url: "https://www.youtube.com/watch?v=3QhU9jd03a0" }]
            }
          },
          maths: {
            label: "Engineering Mathematics", icon: "fas fa-square-root-alt", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Linear Algebra", intro: "Matrices, determinants, eigenvalues — the mathematics of transformations.", topics: ["Matrix Operations", "Determinants", "Eigenvalues", "Linear Transformations"] },
              { id: "ch2", title: "Calculus", intro: "Multivariable calculus, partial derivatives and multiple integrals.", topics: ["Partial Derivatives", "Maxima/Minima", "Multiple Integrals", "Vector Calculus"] },
              { id: "ch3", title: "Probability & Statistics", intro: "Random variables, distributions, and statistical inference.", topics: ["Probability Basics", "Distributions", "Expected Value", "Hypothesis Testing"] },
              { id: "ch4", title: "Discrete Mathematics", intro: "Logic, set theory, graph theory and combinatorics.", topics: ["Logic & Proofs", "Set Theory", "Graph Theory", "Combinatorics", "Recurrences"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Linear Algebra – 3Blue1Brown", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs" }, { type: "notes", title: "Gilbert Strang MIT Notes", url: "https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/" }],
              ch2: [{ type: "youtube", title: "Multivariable Calculus – Khan Academy", url: "https://www.youtube.com/watch?v=TrcCbdWwCBc" }],
              ch3: [{ type: "youtube", title: "Probability & Statistics – StatQuest", url: "https://www.youtube.com/watch?v=KknuxP6QVxU" }],
              ch4: [{ type: "youtube", title: "Discrete Maths – TrevTutor", url: "https://www.youtube.com/watch?v=tyDKR4FG3Yw" }]
            }
          }
        }
      },
      bcom: {
        label: "B.Com",
        defaultSubjects: ["accounts", "economics", "blaw", "finance"],
        subjects: {
          accounts: {
            label: "Accountancy", icon: "fas fa-calculator", color: "#D97706",
            chapters: [
              { id: "ch1", title: "Financial Accounting Basics", intro: "Double entry system, journal entries, ledger and trial balance.", topics: ["Double Entry", "Journal Entries", "Ledger", "Trial Balance"] },
              { id: "ch2", title: "Financial Statements", intro: "Prepare and analyse profit & loss account and balance sheet.", topics: ["Trading Account", "P&L Account", "Balance Sheet", "Adjustments"] },
              { id: "ch3", title: "Partnership Accounts", intro: "Admission, retirement, and dissolution of partnership firms.", topics: ["Admission of Partner", "Retirement", "Death of Partner", "Dissolution"] },
              { id: "ch4", title: "Company Accounts", intro: "Issue of shares, debentures and company final accounts.", topics: ["Issue of Shares", "Forfeiture", "Debentures", "Company Final Accounts"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Accountancy Basics – Letstute", url: "https://www.youtube.com/watch?v=LyZ8aH6y1Z8" }],
              ch2: [{ type: "youtube", title: "Financial Statements Explained", url: "https://www.youtube.com/watch?v=7w4L66BNKP4" }],
              ch3: [{ type: "youtube", title: "Partnership Accounts Full Chapter", url: "https://www.youtube.com/watch?v=TxmJsOFjDdU" }],
              ch4: [{ type: "youtube", title: "Company Accounts – Class 12", url: "https://www.youtube.com/watch?v=j5k3OJ7Z1Kk" }]
            }
          },
          economics: {
            label: "Economics", icon: "fas fa-chart-line", color: "#059669",
            chapters: [
              { id: "ch1", title: "Microeconomics", intro: "Demand, supply, market equilibrium and price determination.", topics: ["Demand & Supply", "Elasticity", "Market Structures", "Production Theory"] },
              { id: "ch2", title: "Macroeconomics", intro: "National income, money, banking and fiscal policy.", topics: ["National Income", "Money Supply", "Central Banking", "Fiscal Policy"] },
              { id: "ch3", title: "Indian Economy", intro: "Economic planning, poverty, agriculture and industrial policy.", topics: ["Planning in India", "Poverty", "Agriculture", "Industrial Policy", "Globalisation"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Microeconomics – Crash Course", url: "https://www.youtube.com/watch?v=eVAS-t83Tx4" }],
              ch2: [{ type: "youtube", title: "Macroeconomics Full Course", url: "https://www.youtube.com/watch?v=d8uTB5XorBw" }],
              ch3: [{ type: "youtube", title: "Indian Economy – StudyIQ", url: "https://www.youtube.com/watch?v=9xt4JXqP9cM" }]
            }
          },
          blaw: {
            label: "Business Law", icon: "fas fa-gavel", color: "#DC2626",
            chapters: [
              { id: "ch1", title: "Indian Contract Act", intro: "Essentials of a valid contract, types of contracts and remedies.", topics: ["Essentials of Contract", "Offer & Acceptance", "Consideration", "Breach & Remedies"] },
              { id: "ch2", title: "Sale of Goods Act", intro: "Contract of sale, conditions, warranties and rights of buyer/seller.", topics: ["Contract of Sale", "Conditions & Warranties", "Transfer of Property", "Rights of Parties"] },
              { id: "ch3", title: "Company Law", intro: "Formation, management and winding up of companies.", topics: ["Types of Companies", "Incorporation", "MOA & AOA", "Directors", "Meetings"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Indian Contract Act – Full Chapter", url: "https://www.youtube.com/watch?v=2w5hBdDPdNM" }],
              ch2: [{ type: "youtube", title: "Sale of Goods Act Explained", url: "https://www.youtube.com/watch?v=LoT5bB1PsZE" }],
              ch3: [{ type: "youtube", title: "Company Law Basics", url: "https://www.youtube.com/watch?v=xKqTJLEYJvE" }]
            }
          },
          finance: {
            label: "Financial Management", icon: "fas fa-coins", color: "#2563EB",
            chapters: [
              { id: "ch1", title: "Time Value of Money", intro: "Present value, future value and the power of compounding.", topics: ["Simple Interest", "Compound Interest", "Present Value", "Future Value", "Annuities"] },
              { id: "ch2", title: "Capital Budgeting", intro: "NPV, IRR, Payback — evaluate long-term investment decisions.", topics: ["NPV Method", "IRR Method", "Payback Period", "Profitability Index"] },
              { id: "ch3", title: "Sources of Finance", intro: "Equity, debt, preference shares and other financing instruments.", topics: ["Equity Shares", "Preference Shares", "Debentures", "Term Loans", "Working Capital"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Time Value of Money – CFA Prep", url: "https://www.youtube.com/watch?v=cEr3fNmG2R8" }],
              ch2: [{ type: "youtube", title: "Capital Budgeting – NPV & IRR", url: "https://www.youtube.com/watch?v=Iqp7QICJ5XU" }],
              ch3: [{ type: "youtube", title: "Sources of Finance Explained", url: "https://www.youtube.com/watch?v=k7SaHIxMRSE" }]
            }
          }
        }
      }
    }
  },
  competitive: {
    label: "Competitive Exams",
    icon: "fas fa-trophy",
    subcategories: {
      jee: {
        label: "JEE Mains & Advanced",
        defaultSubjects: ["physics", "chemistry", "maths"],
        subjects: {
          physics: {
            label: "Physics", icon: "fas fa-atom", color: "#0891B2",
            chapters: [
              { id: "ch1", title: "Mechanics", intro: "Kinematics, Newton's laws, work-energy, rotational motion — the backbone of JEE Physics.", topics: ["Kinematics", "Laws of Motion", "Work & Energy", "Rotation", "Gravitation"] },
              { id: "ch2", title: "Electromagnetism", intro: "Electric fields, magnetic fields, electromagnetic induction — high weightage in JEE.", topics: ["Electrostatics", "Current Electricity", "Magnetism", "EMI", "AC Circuits"] },
              { id: "ch3", title: "Optics & Modern Physics", intro: "Wave optics, photoelectric effect, atomic and nuclear physics.", topics: ["Ray Optics", "Wave Optics", "Photoelectric Effect", "Atomic Structure", "Nuclear Physics"] },
              { id: "ch4", title: "Thermodynamics & Waves", intro: "Heat, thermodynamic processes, wave motion and sound.", topics: ["Thermodynamics Laws", "KTG", "Waves", "Sound", "Doppler Effect"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "JEE Physics – Physics Wallah", url: "https://www.youtube.com/watch?v=WgGFxYCMleA" }, { type: "notes", title: "HC Verma Solutions", url: "https://www.hcvermasolutions.com/" }],
              ch2: [{ type: "youtube", title: "Electromagnetism JEE – Vedantu", url: "https://www.youtube.com/watch?v=r7HxrGSX_Lw" }],
              ch3: [{ type: "youtube", title: "Optics & Modern Physics – JEE", url: "https://www.youtube.com/watch?v=7Dm0K4uY2IE" }],
              ch4: [{ type: "youtube", title: "Thermodynamics & Waves – JEE", url: "https://www.youtube.com/watch?v=h_eTLGiqmvQ" }]
            }
          },
          chemistry: {
            label: "Chemistry", icon: "fas fa-vial", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Physical Chemistry", intro: "Mole concept, thermodynamics, equilibrium, electrochemistry — high scoring in JEE.", topics: ["Mole Concept", "Thermodynamics", "Chemical Equilibrium", "Electrochemistry", "Chemical Kinetics"] },
              { id: "ch2", title: "Inorganic Chemistry", intro: "Periodic table, chemical bonding, coordination compounds and qualitative analysis.", topics: ["Periodic Properties", "Chemical Bonding", "p-Block Elements", "d-Block Elements", "Coordination Compounds"] },
              { id: "ch3", title: "Organic Chemistry", intro: "Reaction mechanisms, named reactions, biomolecules and polymers.", topics: ["Reaction Mechanisms", "Hydrocarbons", "Functional Groups", "Named Reactions", "Biomolecules"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Physical Chemistry – JEE", url: "https://www.youtube.com/watch?v=3Vc5e4TBNZ0" }, { type: "notes", title: "JEE Chemistry Notes – PW", url: "https://www.pw.live/chapter-notes/jee-main-and-advanced/chemistry" }],
              ch2: [{ type: "youtube", title: "Inorganic Chemistry JEE Complete", url: "https://www.youtube.com/watch?v=5qIbKwLnfQQ" }],
              ch3: [{ type: "youtube", title: "Organic Chemistry – JEE Level", url: "https://www.youtube.com/watch?v=uLHj3dMIStI" }]
            }
          },
          maths: {
            label: "Mathematics", icon: "fas fa-square-root-alt", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Algebra", intro: "Quadratics, sequences, complex numbers, matrices — core JEE algebra topics.", topics: ["Quadratic Equations", "Progressions", "Complex Numbers", "Matrices", "Determinants", "Binomial Theorem"] },
              { id: "ch2", title: "Calculus", intro: "Limits, continuity, differentiation, integration, differential equations.", topics: ["Limits", "Derivatives", "Applications of Derivatives", "Integration", "Differential Equations"] },
              { id: "ch3", title: "Coordinate Geometry", intro: "Straight lines, circles, conics — frequently asked in JEE.", topics: ["Straight Lines", "Circles", "Parabola", "Ellipse", "Hyperbola"] },
              { id: "ch4", title: "Trigonometry & Vectors", intro: "Trig identities, inverse trig, 3D geometry and vector algebra.", topics: ["Trig Identities", "Inverse Trig", "Vectors", "3D Geometry"] },
              { id: "ch5", title: "Probability & Statistics", intro: "Probability theorems, distributions, and statistics for JEE.", topics: ["Probability", "Bayes Theorem", "Distributions", "Statistics"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "JEE Maths Algebra – Vedantu", url: "https://www.youtube.com/watch?v=ZCDSbXXR5uw" }, { type: "notes", title: "JEE Maths Notes – PW", url: "https://www.pw.live/chapter-notes/jee-main-and-advanced/maths" }],
              ch2: [{ type: "youtube", title: "Calculus JEE – Physics Wallah", url: "https://www.youtube.com/watch?v=N7kEKZ7sMwI" }],
              ch3: [{ type: "youtube", title: "Coordinate Geometry – JEE Mains", url: "https://www.youtube.com/watch?v=hDn76WLBFHQ" }],
              ch4: [{ type: "youtube", title: "Vectors & 3D – JEE Level", url: "https://www.youtube.com/watch?v=pSyOPNY17p4" }],
              ch5: [{ type: "youtube", title: "Probability – JEE Prep", url: "https://www.youtube.com/watch?v=MXaJ7sa7q-8" }]
            }
          }
        }
      },
      upsc: {
        label: "UPSC Civil Services",
        defaultSubjects: ["history", "polity", "geography", "economy", "scitech"],
        subjects: {
          history: {
            label: "History", icon: "fas fa-landmark", color: "#D97706",
            chapters: [
              { id: "ch1", title: "Ancient India", intro: "Indus Valley, Vedic Age, Mauryan Empire and post-Mauryan period.", topics: ["Indus Valley", "Vedic Period", "Mauryan Empire", "Gupta Period", "South Indian Kingdoms"] },
              { id: "ch2", title: "Medieval India", intro: "Delhi Sultanate, Mughal Empire, Bhakti-Sufi movements.", topics: ["Delhi Sultanate", "Mughal Empire", "Bhakti Movement", "Sufi Movement", "Vijayanagara"] },
              { id: "ch3", title: "Modern India", intro: "British colonialism, freedom struggle, and independence.", topics: ["British Rule", "1857 Revolt", "Congress", "Gandhi & Movements", "Independence & Partition"] },
              { id: "ch4", title: "World History", intro: "French Revolution, World Wars, Cold War and decolonisation.", topics: ["French Revolution", "World War I", "World War II", "Cold War", "Decolonisation"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Ancient India – StudyIQ", url: "https://www.youtube.com/watch?v=8MuqoMXZ8GI" }, { type: "notes", title: "NCERT Old History Books", url: "https://ncert.nic.in/textbook.php" }],
              ch2: [{ type: "youtube", title: "Medieval India – UPSC Prep", url: "https://www.youtube.com/watch?v=nM6T7p4EWWU" }],
              ch3: [{ type: "youtube", title: "Modern India Freedom Struggle", url: "https://www.youtube.com/watch?v=bN6ZPSKqdkk" }],
              ch4: [{ type: "youtube", title: "World History UPSC – StudyIQ", url: "https://www.youtube.com/watch?v=kFAUXYi_3JE" }]
            }
          },
          polity: {
            label: "Indian Polity", icon: "fas fa-balance-scale", color: "#DC2626",
            chapters: [
              { id: "ch1", title: "Constitution & Its Making", intro: "Constituent Assembly, sources of Constitution, Preamble and key features.", topics: ["Constituent Assembly", "Preamble", "Features of Constitution", "Schedules"] },
              { id: "ch2", title: "Fundamental Rights & DPSP", intro: "Rights, their limitations, directive principles and their relationship.", topics: ["Fundamental Rights", "Exceptions", "DPSP", "Fundamental Duties"] },
              { id: "ch3", title: "Parliament & State Legislature", intro: "Lok Sabha, Rajya Sabha, legislative process and constitutional amendments.", topics: ["Lok Sabha", "Rajya Sabha", "Legislative Process", "Amendments"] },
              { id: "ch4", title: "Executive & Judiciary", intro: "President, PM, Council of Ministers, Supreme Court and High Courts.", topics: ["President", "Prime Minister", "Council of Ministers", "Supreme Court", "High Courts"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Polity – Laxmikant Summary", url: "https://www.youtube.com/watch?v=JgSFe9EGpJ4" }, { type: "notes", title: "M. Laxmikant Notes Online", url: "https://www.clearias.com/indian-polity-laxmikanth-notes/" }],
              ch2: [{ type: "youtube", title: "Fundamental Rights UPSC", url: "https://www.youtube.com/watch?v=YK1PBHJ_LWQ" }],
              ch3: [{ type: "youtube", title: "Parliament – UPSC StudyIQ", url: "https://www.youtube.com/watch?v=0iHSWgl9LsI" }],
              ch4: [{ type: "youtube", title: "President & Judiciary – UPSC", url: "https://www.youtube.com/watch?v=tRj5F4mVBGo" }]
            }
          },
          geography: {
            label: "Geography", icon: "fas fa-globe", color: "#059669",
            chapters: [
              { id: "ch1", title: "Physical Geography", intro: "Earth's structure, geomorphology, climate, oceanography and biogeography.", topics: ["Earth's Interior", "Plate Tectonics", "Climate", "Oceans", "Biomes"] },
              { id: "ch2", title: "Indian Geography", intro: "Physical features, rivers, climate, soil, vegetation and resources of India.", topics: ["Physical Features", "Rivers", "Climate of India", "Soils", "Resources"] },
              { id: "ch3", title: "Human & Economic Geography", intro: "Population, urbanisation, agriculture, industries and international trade.", topics: ["Population", "Urbanisation", "Agriculture", "Industries", "Trade"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Physical Geography – UPSC", url: "https://www.youtube.com/watch?v=K_dFMrNUMv4" }, { type: "notes", title: "NCERT Geography Notes", url: "https://ncert.nic.in/textbook.php" }],
              ch2: [{ type: "youtube", title: "Indian Geography Complete", url: "https://www.youtube.com/watch?v=9vMSp7h5r5c" }],
              ch3: [{ type: "youtube", title: "Human Geography – StudyIQ", url: "https://www.youtube.com/watch?v=tXolXjETH4U" }]
            }
          },
          economy: {
            label: "Indian Economy", icon: "fas fa-rupee-sign", color: "#2563EB",
            chapters: [
              { id: "ch1", title: "Economic Concepts", intro: "GDP, GNP, inflation, fiscal & monetary policy — macro fundamentals.", topics: ["GDP & GNP", "Inflation", "Fiscal Policy", "Monetary Policy", "Budget"] },
              { id: "ch2", title: "Indian Economic History", intro: "Planning, liberalisation, and post-1991 reforms.", topics: ["Five Year Plans", "1991 Reforms", "LPG", "WTO", "Economic Survey"] },
              { id: "ch3", title: "Agriculture & Industry", intro: "Green Revolution, food security, industrial policy and MSMEs.", topics: ["Green Revolution", "Food Security", "Industrial Policy", "MSME", "FDI"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Indian Economy – Nitin Sangwan", url: "https://www.youtube.com/watch?v=W4zxJXkfzCk" }, { type: "notes", title: "Economy Notes – ClearIAS", url: "https://www.clearias.com/economy/" }],
              ch2: [{ type: "youtube", title: "1991 Reforms & LPG – UPSC", url: "https://www.youtube.com/watch?v=8qE1bFBPBDI" }],
              ch3: [{ type: "youtube", title: "Agriculture UPSC – StudyIQ", url: "https://www.youtube.com/watch?v=tXolXjETH4U" }]
            }
          },
          scitech: {
            label: "Science & Technology", icon: "fas fa-microscope", color: "#7C3AED",
            chapters: [
              { id: "ch1", title: "Space Technology", intro: "ISRO missions, satellites, space exploration and recent developments.", topics: ["ISRO Missions", "Satellites", "Mars & Moon Missions", "Space Applications"] },
              { id: "ch2", title: "Defence Technology", intro: "Missiles, defence systems, DRDO and India's defence modernisation.", topics: ["Missile Systems", "DRDO", "Defence Policy", "Recent Developments"] },
              { id: "ch3", title: "Biotechnology & Health", intro: "Vaccines, GMOs, CRISPR, and India's health technology.", topics: ["Vaccines", "GMOs", "CRISPR", "Healthcare Tech", "Biosafety"] },
              { id: "ch4", title: "IT & Emerging Tech", intro: "AI, blockchain, 5G, cybersecurity — tech in governance and society.", topics: ["Artificial Intelligence", "Blockchain", "5G", "Cybersecurity", "Digital India"] }
            ],
            resources: {
              ch1: [{ type: "youtube", title: "Space Tech UPSC – StudyIQ", url: "https://www.youtube.com/watch?v=SKbXZFVn_7M" }],
              ch2: [{ type: "youtube", title: "Defence Tech India – UPSC", url: "https://www.youtube.com/watch?v=s4XDFLpqIJo" }],
              ch3: [{ type: "youtube", title: "Biotech & Health – Science UPSC", url: "https://www.youtube.com/watch?v=8m6RtOpqvtU" }],
              ch4: [{ type: "youtube", title: "Emerging Tech for UPSC", url: "https://www.youtube.com/watch?v=rfG8ce4nNh0" }]
            }
          }
        }
      }
    }
  }
};