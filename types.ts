export enum SlideLayout {
  TITLE = 'TITLE',
  BULLETS = 'BULLETS',
  SPLIT = 'SPLIT', // Text left, list/image right
  PYRAMID = 'PYRAMID', // Specific for CSR Pyramid
  QUOTE = 'QUOTE',
  COMPARISON = 'COMPARISON', // Narrow vs Broad view
  FINAL_SCORE = 'FINAL_SCORE'
}

export interface BulletItem {
  text: string;
  detail?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface SlideContent {
  id: number;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  bullets?: BulletItem[];
  mainText?: string;
  quoteAuthor?: string;
  comparison?: {
    leftTitle: string;
    leftPoints: string[];
    rightTitle: string;
    rightPoints: string[];
  };
  highlightBox?: string; // For examples or key takeaways
  quizzes?: QuizQuestion[];
  footer?: string; // Copyright or other footer text
}