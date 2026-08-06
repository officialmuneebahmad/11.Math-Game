import { v4 as uuidv4 } from 'uuid';
import { type Level } from '../store/useGameStore';

export type QuestionFormat = 'multiple-choice' | 'type-answer';

export interface Question {
  id: string;
  text: string;
  answer: number | string;
  options?: (number | string)[];
  format: QuestionFormat;
}

const generateRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Fisher-Yates shuffle
const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const generateWrongOptions = (correctAnswer: number, count: number): number[] => {
  const options = new Set<number>();
  options.add(correctAnswer);

  while (options.size < count) {
    const offset = generateRandomInt(-5, 5);
    if (offset !== 0) {
      const wrong = correctAnswer + offset;
      if (wrong > 0 || correctAnswer <= 0) {
        options.add(wrong);
      }
    } else {
      options.add(correctAnswer + generateRandomInt(1, 10));
    }
  }

  return shuffleArray(Array.from(options));
};

const formatQuestionString = (a: number, b: number, operator: string) => {
    if (operator === '*') return `${a} × ${b}`;
    if (operator === '/') return `${a} ÷ ${b}`;
    return `${a} ${operator} ${b}`;
};

const generateEasyQuestion = (): Question => {
  const ops = ['+', '-', '*', '/'];
  const op = ops[generateRandomInt(0, ops.length - 1)];
  let a, b, answer;

  if (op === '+') {
    a = generateRandomInt(1, 20);
    b = generateRandomInt(1, 20);
    answer = a + b;
  } else if (op === '-') {
    a = generateRandomInt(5, 40);
    b = generateRandomInt(1, a);
    answer = a - b;
  } else if (op === '*') {
    a = generateRandomInt(2, 10);
    b = generateRandomInt(2, 10);
    answer = a * b;
  } else {
    b = generateRandomInt(2, 10);
    answer = generateRandomInt(2, 10);
    a = b * answer;
  }

  const format: QuestionFormat = Math.random() > 0.5 ? 'multiple-choice' : 'type-answer';
  const options = format === 'multiple-choice' ? generateWrongOptions(answer, 4) : undefined;

  return {
    id: uuidv4(),
    text: formatQuestionString(a, b, op),
    answer,
    format,
    options
  };
};

const generateMediumQuestion = (): Question => {
  const ops = ['+', '-', '*', '/', 'remainder', 'percent'];
  const op = ops[generateRandomInt(0, ops.length - 1)];
  let text, answer;

  if (op === '+') {
    const a = generateRandomInt(50, 500);
    const b = generateRandomInt(50, 500);
    text = formatQuestionString(a, b, '+');
    answer = a + b;
  } else if (op === '-') {
    const a = generateRandomInt(100, 1000);
    const b = generateRandomInt(10, a);
    text = formatQuestionString(a, b, '-');
    answer = a - b;
  } else if (op === '*') {
    const a = generateRandomInt(10, 50);
    const b = generateRandomInt(5, 20);
    text = formatQuestionString(a, b, '*');
    answer = a * b;
  } else if (op === '/') {
    const b = generateRandomInt(5, 25);
    answer = generateRandomInt(10, 50);
    const a = b * answer;
    text = formatQuestionString(a, b, '/');
  } else if (op === 'remainder') {
    const b = generateRandomInt(3, 15);
    const quotient = generateRandomInt(2, 20);
    answer = generateRandomInt(1, b - 1);
    const a = (b * quotient) + answer;
    text = `${a} ÷ ${b} (Remainder)`;
  } else {
    const percents = [10, 20, 25, 50, 75];
    const p = percents[generateRandomInt(0, percents.length - 1)];
    const num = generateRandomInt(2, 20) * 10;
    text = `${p}% of ${num}`;
    answer = (p / 100) * num;
  }

  const format: QuestionFormat = Math.random() > 0.5 ? 'multiple-choice' : 'type-answer';
  const options = format === 'multiple-choice' ? generateWrongOptions(answer, 4) : undefined;

  return { id: uuidv4(), text, answer, format, options };
};

const generateHardQuestion = (): Question => {
  const ops = ['*', '/', 'square', 'cube', 'mixed-fraction', 'percent-change'];
  const op = ops[generateRandomInt(0, ops.length - 1)];
  let text, answer;

  if (op === '*') {
    const a = generateRandomInt(25, 99);
    const b = generateRandomInt(11, 99);
    text = formatQuestionString(a, b, '*');
    answer = a * b;
  } else if (op === '/') {
    const b = generateRandomInt(15, 45);
    answer = generateRandomInt(15, 45);
    const a = b * answer;
    text = formatQuestionString(a, b, '/');
  } else if (op === 'square') {
    const a = generateRandomInt(11, 30);
    text = `${a}²`;
    answer = a * a;
  } else if (op === 'cube') {
    const a = generateRandomInt(3, 12);
    text = `${a}³`;
    answer = a * a * a;
  } else if (op === 'mixed-fraction') {
    const whole = generateRandomInt(1, 5);
    const den = generateRandomInt(3, 8);
    const num = generateRandomInt(1, den - 1);
    text = `Convert ${whole} ${num}/${den} to fraction (e.g. 11/3)`;
    answer = `${(whole * den) + num}/${den}`;
  } else {
    const start = generateRandomInt(2, 10) * 10;
    const change = [10, 20, 25, 50][generateRandomInt(0, 3)];
    const isIncrease = Math.random() > 0.5;
    text = isIncrease ? `Increase ${start} by ${change}%` : `Decrease ${start} by ${change}%`;
    answer = isIncrease ? start * (1 + change/100) : start * (1 - change/100);
  }

  const format: QuestionFormat = op === 'mixed-fraction' ? 'type-answer' : (Math.random() > 0.5 ? 'multiple-choice' : 'type-answer');

  let options = undefined;
  if (format === 'multiple-choice' && typeof answer === 'number') {
    options = generateWrongOptions(answer, 4);
  }

  return { id: uuidv4(), text, answer, format, options };
};

export const generateQuestionBank = (level: Level): Question[] => {
  const questions: Question[] = [];
  const textSet = new Set<string>();

  while (questions.length < 100) {
    let q: Question;
    if (level === 'easy') q = generateEasyQuestion();
    else if (level === 'medium') q = generateMediumQuestion();
    else q = generateHardQuestion();

    if (!textSet.has(q.text)) {
      textSet.add(q.text);
      questions.push(q);
    }
  }

  return questions;
};