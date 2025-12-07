import { SlideContent, SlideLayout } from '../types.ts';

export const slides: SlideContent[] = [
  {
    id: 1,
    title: "Corporate Social Responsibility",
    subtitle: "BBDM2023 Business Ethics",
    layout: SlideLayout.TITLE,
    mainText: "Welcome, class! Today we explore the moral status of the modern corporation.",
    highlightBox: "Lecture Objective: Understand Corporate Moral Agency & CSR",
    footer: "Copyright by Dr Jaimie Lee Sook Ling",
    quizzes: [
      {
        id: "q1-1",
        question: "What is the course code for this subject?",
        options: ["BUS101", "BBDM2023", "ETHICS99", "MBA500"],
        correctAnswer: 1,
        explanation: "This course is BBDM2023 Business Ethics."
      },
      {
        id: "q1-2",
        question: "What is the main topic of Chapter 5?",
        options: ["Accounting", "Marketing Strategy", "Corporations & CSR", "Office Decor"],
        correctAnswer: 2,
        explanation: "We are focusing on Corporations and their Social Responsibility."
      }
    ]
  },
  {
    id: 2,
    title: "The Big Questions",
    layout: SlideLayout.BULLETS,
    bullets: [
      { 
        text: "Corporations yield awesome economic clout 💰",
        detail: "Some corporations (like Apple or Amazon) have revenues larger than the GDP of entire countries. This power affects our daily lives."
      },
      { 
        text: "They use highly structured, impersonal management systems.",
        detail: "Decisions are made by committees, policies, and algorithms, not just by one person's feelings. This removes personal emotion."
      },
      { 
        text: "❓ The Question: Do these systems have moral implications?",
        detail: "When a system causes harm (e.g., a bank foreclosing on families automatically), is it just a 'system error' or a moral failure?"
      },
      { 
        text: "Can a 'structure' be good or evil, or just the people inside it?",
        detail: "This is the core debate: Is the corporation itself a 'Moral Agent' capable of sin, or is it just a tool like a hammer?"
      }
    ],
    highlightBox: "Example: Think of a giant tech company. Is the company 'evil' if it invades privacy, or just the CEO?",
    quizzes: [
      {
        id: "q2-1",
        question: "Corporate management systems are described as...",
        options: ["Emotional and Chaotic", "Highly structured and Impersonal", "Simple and Personal", "Random"],
        correctAnswer: 1,
        explanation: "Large corporations rely on impersonal, structured systems to manage operations."
      },
      {
        id: "q2-2",
        question: "Why do we question corporate morality?",
        options: ["Because they have economic clout", "Because they are small", "Because they don't make money", "They are invisible"],
        correctAnswer: 0,
        explanation: "Their massive economic power (clout) means their actions have huge moral consequences."
      }
    ]
  },
  {
    id: 3,
    title: "What IS a Corporation?",
    subtitle: "The Three-Part Organization",
    layout: SlideLayout.SPLIT,
    mainText: "A corporation isn't just a building. It's a legal entity composed of three distinct groups:",
    bullets: [
      { text: "👥 Stockholders: Provide capital, own the corp, enjoy limited liability." },
      { text: "👔 Managers: Run the business operations day-to-day." },
      { text: "👷 Employees: Produce the actual goods and services." }
    ],
    highlightBox: "In Malaysia, Shareholders = Owners (e.g., You buying shares in Maybank).",
    quizzes: [
      {
        id: "q3-1",
        question: "Who provides the capital and owns the corporation?",
        options: ["Employees", "Managers", "Stockholders", "Government"],
        correctAnswer: 2,
        explanation: "Stockholders (shareholders) provide the money and own the company."
      },
      {
        id: "q3-2",
        question: "What is the primary role of Managers?",
        options: ["To produce goods", "To run business operations", "To provide capital", "To ignore the staff"],
        correctAnswer: 1,
        explanation: "Managers are hired to run the day-to-day operations of the business."
      }
    ]
  },
  {
    id: 4,
    title: "Limited Liability Concept",
    layout: SlideLayout.BULLETS,
    bullets: [
      { 
        text: "🛡️ Definition: Limited Liability", 
        detail: "Members are financially responsible for debts ONLY up to the amount of their investment. If the company owes millions, you only lose your share value."
      },
      { 
        text: "Requires public registration (e.g., SSM in Malaysia).", 
        detail: "You cannot just say you are a corporation. You must register with the government and follow strict reporting laws."
      },
      { 
        text: "Shareholders only get profit (dividends) when 'declared'.", 
        detail: "Even if the company makes a profit, you don't automatically get it. The Board of Directors must vote to distribute it as dividends."
      }
    ],
    highlightBox: "Real World: If you own RM100 of Tesla stock and Tesla goes bankrupt, you lose RM100. They can't come take your house!",
    quizzes: [
      {
        id: "q4-1",
        question: "What does 'Limited Liability' mean for a shareholder?",
        options: ["You are responsible for all debts", "You lose your house if the company fails", "Liability is limited to your investment", "The government pays you"],
        correctAnswer: 2,
        explanation: "You only lose what you invested (the stock value), not your personal assets."
      },
      {
        id: "q4-2",
        question: "When do shareholders receive a share of the profits?",
        options: ["Every month", "Whenever they want", "When dividends are declared", "Never"],
        correctAnswer: 2,
        explanation: "Profits are only shared when the directors formally 'declare' a dividend."
      }
    ]
  },
  {
    id: 5,
    title: "Corporate Moral Agency",
    layout: SlideLayout.QUOTE,
    mainText: "In the eyes of the law, corporations are legal persons.",
    quoteAuthor: "Legal Status",
    bullets: [
      { text: "They have rights: Free speech, due process, jury trial." },
      { text: "They are 'artificial persons'." },
      { text: "🤔 The Moral Puzzle: If they are legal persons, are they also MORAL agents?" }
    ],
    highlightBox: "If a corporation kills a river with pollution, can we put the corporation in 'jail'?",
    quizzes: [
      {
        id: "q5-1",
        question: "Legally, a corporation is considered a(n)...",
        options: ["Machine", "Animal", "Artificial Person", "Computer Program"],
        correctAnswer: 2,
        explanation: "The law treats corporations as 'artificial persons' with certain rights."
      },
      {
        id: "q5-2",
        question: "What rights do corporations enjoy?",
        options: ["Right to vote", "Right to free speech", "Right to marry", "Right to eat"],
        correctAnswer: 1,
        explanation: "Corporations have rights like free speech and due process, but cannot vote or marry."
      }
    ]
  },
  {
    id: 6,
    title: "The CID Structure",
    subtitle: "Corporate Internal Decision Structures",
    layout: SlideLayout.SPLIT,
    mainText: "How does a company 'decide'?",
    bullets: [
      { text: "Decisions are filtered through the CID Structure." },
      { text: "It consists of individuals, but operates like a machine 🤖." },
      { text: "This leads to the 'Diffusion of Responsibility'." },
      { text: "It becomes hard to point a finger at one specific person when things go wrong." }
    ],
    highlightBox: "Analogy: A car has a brake failure. Is it the designer, the assembler, or the steel supplier?",
    quizzes: [
      {
        id: "q6-1",
        question: "What does CID stand for?",
        options: ["Criminal Investigation Dept", "Corporate Internal Decision", "Central Intelligence Division", "Company Idea Department"],
        correctAnswer: 1,
        explanation: "CID stands for Corporate Internal Decision structures."
      },
      {
        id: "q6-2",
        question: "What is 'Diffusion of Responsibility'?",
        options: ["Responsibility is shared so no one feels blamed", "Responsibility is clear", "Everyone wants to be responsible", "The boss takes all blame"],
        correctAnswer: 0,
        explanation: "It means responsibility is spread out (diffused), so no single person feels fully accountable."
      }
    ]
  },
  {
    id: 7,
    title: "The Responsibility Gap",
    layout: SlideLayout.COMPARISON,
    comparison: {
      leftTitle: "Vanishing Responsibility",
      leftPoints: [
        "CID structures blur the lines.",
        "No single person feels fully responsible.",
        "Refusal to let individuals 'duck' blame."
      ],
      rightTitle: "Possible Responses",
      rightPoints: [
        "Attribute moral agency to the Corp itself.",
        "Hold individuals strictly accountable anyway."
      ]
    },
    quizzes: [
      {
        id: "q7-1",
        question: "Why does individual responsibility 'vanish'?",
        options: ["People are invisible", "CID structures blur accountability", "Managers are lazy", "Computers do everything"],
        correctAnswer: 1,
        explanation: "Complex structures make it hard to pinpoint exactly who caused a result."
      },
      {
        id: "q7-2",
        question: "One response to this gap is to attribute moral agency to...",
        options: ["The janitor", "The government", "The Corporation itself", "No one"],
        correctAnswer: 2,
        explanation: "We can treat the Corporation itself as the moral agent to hold it accountable."
      }
    ]
  },
  {
    id: 8,
    title: "Rival Views of Responsibility",
    layout: SlideLayout.TITLE,
    subtitle: "Narrow View vs. Broad View",
    mainText: "Does a company exist ONLY to make money, or to do good?",
    highlightBox: "Let's look at the debate 🥊",
    quizzes: [
      {
        id: "q8-1",
        question: "The 'Narrow View' focuses primarily on...",
        options: ["Saving the whales", "Profit Maximization", "Employee Happiness", " Charity"],
        correctAnswer: 1,
        explanation: "The Narrow View says business is only about making profit."
      },
      {
        id: "q8-2",
        question: "The 'Broad View' includes...",
        options: ["Only shareholders", "Only managers", "Acting morally & helping society", "Ignoring the law"],
        correctAnswer: 2,
        explanation: "The Broad View argues businesses should refrain from harm and contribute to the public good."
      }
    ]
  },
  {
    id: 9,
    title: "The Narrow View",
    subtitle: "Profit Maximization",
    layout: SlideLayout.QUOTE,
    mainText: "Business's only social responsibility is to make money within the rules of the game.",
    quoteAuthor: "Milton Friedman (Economist)",
    bullets: [
      { text: "Diverting from profit makes the economy less efficient." },
      { text: "Public responsibilities (welfare, environment) belong to the Government, not business." }
    ],
    quizzes: [
      {
        id: "q9-1",
        question: "Who is the famous proponent of the Narrow View?",
        options: ["Karl Marx", "Milton Friedman", "Steve Jobs", "Adam Smith"],
        correctAnswer: 1,
        explanation: "Milton Friedman wrote 'Capitalism and Freedom' arguing for profit maximization."
      },
      {
        id: "q9-2",
        question: "According to Friedman, who should handle public responsibilities?",
        options: ["Businesses", "Churches", "The Government", "Nobody"],
        correctAnswer: 2,
        explanation: "Friedman believed social issues are the government's job, not business's."
      }
    ]
  },
  {
    id: 10,
    title: "The Broad View",
    subtitle: "Corporate Social Responsibility (CSR)",
    layout: SlideLayout.BULLETS,
    bullets: [
      { 
        text: "🤝 The Social Contract", 
        detail: "Business acts within society's permission. In return, business must serve society, not just take resources from it."
      },
      { 
        text: "Must consider ALL 'Stakeholders'.", 
        detail: "It's not just about the owners (stockholders). It's about employees, suppliers, customers, and the local community."
      },
      { 
        text: "Externalities: Responsibility for side effects.", 
        detail: "Example: A factory produces cheap clothes (Good) but dumps toxic dye in the river (Bad Externality). The Broad View says they must clean the river."
      },
      { 
        text: "Includes: Employees, Customers, Public at large.", 
        detail: "Paying fair wages (Employees) and ensuring product safety (Customers) is part of their duty."
      }
    ],
    highlightBox: "Example: A factory provides jobs (Good) but pollutes the air (Bad). Broad view says they must fix the air.",
    quizzes: [
      {
        id: "q10-1",
        question: "What is an 'Externality'?",
        options: ["A type of profit", "An unintended side effect (positive or negative)", "A shareholder meeting", "A legal contract"],
        correctAnswer: 1,
        explanation: "An externality is a side effect of business, like pollution, that affects others."
      },
      {
        id: "q10-2",
        question: "Which model focuses on employees, customers, AND community?",
        options: ["Shareholder Model", "Stakeholder Model", "Profit Model", "Narrow Model"],
        correctAnswer: 1,
        explanation: "The Stakeholder Model (Broad View) considers everyone affected by the business."
      }
    ]
  },
  {
    id: 11,
    title: "The 4 Components of CSR",
    subtitle: "Carroll's Pyramid - Deep Dive",
    layout: SlideLayout.PYRAMID,
    bullets: [
      { text: "1. PHILANTHROPIC (Top): Desired by society. Be a good corporate citizen. Donate to arts/education." },
      { text: "2. ETHICAL: Expected. Avoid harm, do what is fair, even if law doesn't require it." },
      { text: "3. LEGAL: Required. Obey regulations (e.g. Labor laws, Environmental Protection Act)." },
      { text: "4. ECONOMIC (Base): Required. Be profitable to survive. Without this, others don't matter." }
    ],
    highlightBox: "Tension: You cannot trade one for another. Giving to charity (Philanthropic) does NOT excuse breaking the law (Legal)!",
    quizzes: [
      {
        id: "q11-1",
        question: "Which responsibility is the ABSOLUTE FOUNDATION?",
        options: ["Legal compliance", "Ethical behavior", "Economic profitability", "Philanthropic giving"],
        correctAnswer: 2,
        explanation: "Economic responsibility. If a business goes bankrupt, it cannot help anyone."
      },
      {
        id: "q11-2",
        question: "Philanthropic responsibility is considered...",
        options: ["Mandatory by law", "Desired/Expected by society", "Illegal", "Unnecessary"],
        correctAnswer: 1,
        explanation: "Society 'desires' companies to give back, but you won't go to jail if you don't."
      },
      {
        id: "q11-3",
        question: "A company dumps toxic waste (Illegal) but donates millions to orphans (Philanthropic). Is this good CSR?",
        options: ["Yes, the donation balances it out", "No, Legal compliance is required before Philanthropy", "Yes, orphans need money", "Maybe"],
        correctAnswer: 1,
        explanation: "No. You cannot skip the lower levels (Legal) just because you do the top level (Philanthropy)."
      }
    ]
  },
  {
    id: 12,
    title: "Debating Corporate Responsibility",
    subtitle: "Arguments for the Narrow View",
    layout: SlideLayout.BULLETS,
    bullets: [
      { 
        text: "1. Invisible Hand Argument ✋", 
        detail: "Adam Smith's idea: By pursuing their own self-interest (profit), businesses unintentionally maximize the good for society (efficiency)."
      },
      { 
        text: "2. Let-Government-Do-It", 
        detail: "Business argues: 'We pay taxes! The government should use that money to fix social problems like poverty or pollution.'"
      },
      { 
        text: "3. Business-Can't-Handle-It", 
        detail: "Managers are trained in finance and marketing, not social work. If they try to solve social problems, they might make it worse!"
      }
    ],
    highlightBox: "Counter-argument: Corporations have huge power and resources. If they don't help, who will?",
    quizzes: [
      {
        id: "q12-1",
        question: "The 'Invisible Hand' argument suggests...",
        options: ["Ghosts run the market", "Self-interest leads to social good", "Government controls everything", "Businesses should hide"],
        correctAnswer: 1,
        explanation: "Adam Smith argued that seeking profit efficiently allocates resources for everyone."
      },
      {
        id: "q12-2",
        question: "The 'Business-Can't-Handle-It' argument claims executives lack...",
        options: ["Money", "Time", "Moral/Social expertise", "Employees"],
        correctAnswer: 2,
        explanation: "It argues managers are experts in business, not social welfare."
      }
    ]
  },
  {
    id: 13,
    title: "Institutionalizing Ethics",
    layout: SlideLayout.SPLIT,
    mainText: "How do we make companies ethical?",
    bullets: [
      { text: "📢 Articulate values and goals clearly." },
      { text: "📜 Adopt a moral code for all members." },
      { text: "⚖️ Set up a high-ranking ethics committee." },
      { text: "🎓 Incorporate ethics training in development." }
    ],
    highlightBox: "It's not enough to have a poster on the wall. It must be in the DNA of the company.",
    quizzes: [
      {
        id: "q13-1",
        question: "What is a key step to institutionalize ethics?",
        options: ["Fire everyone", "Hide the code of conduct", "Adopt a moral code", "Ignore complaints"],
        correctAnswer: 2,
        explanation: "Adopting a clear moral code helps guide behavior across the company."
      },
      {
        id: "q13-2",
        question: "Who should oversee the ethics code?",
        options: ["The intern", "A high-ranking ethics committee", "No one", "The competitors"],
        correctAnswer: 1,
        explanation: "Top-level oversight signals that ethics is a serious priority."
      }
    ]
  },
  {
    id: 14,
    title: "Corporate Culture",
    layout: SlideLayout.TITLE,
    mainText: "The implicit and explicit values, beliefs, and behaviors that shape the organization.",
    highlightBox: "Culture eats strategy for breakfast. If the culture is 'win at all costs', ethics will vanish.",
    quizzes: [
      {
        id: "q14-1",
        question: "Corporate Culture consists of...",
        options: ["Only the logo", "Values, beliefs, and behaviors", "The office furniture", "The annual party"],
        correctAnswer: 1,
        explanation: "Culture is the deep-seated values and behaviors shared by members."
      },
      {
        id: "q14-2",
        question: "Why must management monitor culture?",
        options: ["To prevent dysfunctional behavior", "To make work boring", "To stop people talking", "To save paper"],
        correctAnswer: 0,
        explanation: "A bad culture can lead to unethical or dysfunctional behavior (like Enron)."
      }
    ]
  },
  {
    id: 15,
    title: "Summary & Discussion",
    layout: SlideLayout.BULLETS,
    bullets: [
      { text: "Corporations are legal persons, but moral agency is debated.", detail: "They have rights, but do they have responsibilities?" },
      { text: "Narrow View: Profit First (Friedman).", detail: "Focus on shareholders and efficiency." },
      { text: "Broad View: Stakeholders & CSR.", detail: "Focus on the wider impact on society." },
      { text: "CSR Pyramid: Economic > Legal > Ethical > Philanthropic.", detail: "You must be profitable to exist, but you must be ethical to be respected." },
      { text: "We need strong Corporate Culture to enforce ethics.", detail: "Rules alone don't work; people must believe in them." }
    ],
    highlightBox: "Next Class: We will discuss specific cases of corporate scandals! 🕵️‍♀️",
    quizzes: [
      {
        id: "q15-1",
        question: "Which view emphasizes 'Stakeholders'?",
        options: ["Narrow View", "Broad View (CSR)", "Invisible View", "Legal View"],
        correctAnswer: 1,
        explanation: "The Broad View/CSR considers all stakeholders."
      },
      {
        id: "q15-2",
        question: "True or False: Profit is the ONLY responsibility in the Pyramid.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "False. The Pyramid includes Legal, Ethical, and Philanthropic responsibilities too."
      }
    ]
  },
  {
    id: 16,
    title: "Lesson Complete",
    layout: SlideLayout.FINAL_SCORE,
    mainText: "You have reached the end of the lesson. Let's see how you did!",
  }
];