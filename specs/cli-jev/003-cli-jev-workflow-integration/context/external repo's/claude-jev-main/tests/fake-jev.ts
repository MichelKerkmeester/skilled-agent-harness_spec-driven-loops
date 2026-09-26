import type { JevPort, JevReply } from '../src/application/ports.js';
import type { Answer, AnswerMap, QuestionMap, StateEntry } from '../src/domain/question.js';

export interface AskCall {
  readonly state: StateEntry;
  readonly questions: QuestionMap;
}

/** Answers from a fixed table, and records what it was asked. */
export class FakeJev implements JevPort {
  readonly calls: AskCall[] = [];

  constructor(private readonly table: Readonly<Record<string, Answer>>) {}

  async ask(state: StateEntry, questions: QuestionMap): Promise<JevReply> {
    this.calls.push({ state, questions });
    const answers: Record<string, Answer> = {};
    for (const name of Object.keys(questions)) {
      const answer = this.table[name];
      if (answer !== undefined) answers[name] = answer;
    }
    return {
      model: 'jev-1.13.0',
      answers,
      usage: { inputTokens: 100, outputTokens: 10 },
    };
  }
}

export function noul(value: number): Answer {
  return { type: 'noul', noul: value };
}

export function score(value: number, levels: number, confidence = 0.8): Answer {
  const probabilities: Record<string, number> = {};
  for (let level = 0; level < levels; level += 1) probabilities[String(level)] = 1 / levels;
  return { type: 'score', score: value, confidence, legend: {}, probabilities };
}

export function choice(
  picked: string,
  probabilities: Readonly<Record<string, number>>,
  confidence = 0.8,
): Answer {
  return { type: 'choice', choice: picked, confidence, probabilities };
}

export function answersOf(calls: readonly AskCall[]): readonly string[] {
  return calls.flatMap((call) => Object.keys(call.questions));
}

export const noAnswers: AnswerMap = {};
