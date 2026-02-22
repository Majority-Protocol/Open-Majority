// ── Parent → Game messages ──────────────────────────────────────────────

export type ContestConfigMessage = {
  type: "CONTEST_CONFIG";
  gameID: string;
  username: string | null;
  walletAddress: string | null;
};

export type GameStartMessage = {
  type: "GAME_START";
  totalQuestions: number;
};

export type QuestionRevealMessage = {
  type: "QUESTION_REVEAL";
  questionId: string;
  orderIndex: number;
  text: string;
  mediaUrl: string | null;
  timerSeconds: number;
  deadline: number; // unix ms
};

export type QuestionClosedMessage = {
  type: "QUESTION_CLOSED";
  questionId: string;
};

export type GameEndedMessage = {
  type: "GAME_ENDED";
};

export type ResultsMessage = {
  type: "RESULTS";
  questions: {
    questionId: string;
    questionText: string;
    orderIndex: number;
    clusters: {
      canonicalAnswer: string;
      count: number;
      isMajority: boolean;
    }[];
    userAnswer: string | null;
    userInMajority: boolean;
    userScore: number;
  }[];
  totalScore: number;
};

export type ParentToGameMessage =
  | ContestConfigMessage
  | GameStartMessage
  | QuestionRevealMessage
  | QuestionClosedMessage
  | GameEndedMessage
  | ResultsMessage;

// ── Game → Parent messages ──────────────────────────────────────────────

export type SessionStartMessage = {
  type: "SESSION_START";
};

export type AnswerSubmitMessage = {
  type: "ANSWER_SUBMIT";
  questionId: string;
  answerText: string;
  submittedAt: number; // unix ms
};

export type SessionEndMessage = {
  type: "SESSION_END";
  answers: {
    questionId: string;
    answerText: string;
    submittedAt: number;
  }[];
  totalQuestions: number;
  answeredCount: number;
};

export type NavigateBackMessage = {
  type: "NAVIGATE_BACK";
};

export type GameToParentMessage =
  | SessionStartMessage
  | AnswerSubmitMessage
  | SessionEndMessage
  | NavigateBackMessage;
