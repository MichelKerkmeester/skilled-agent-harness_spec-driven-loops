import type { AnswerMap, QuestionMap, StateEntry, Usage } from '../domain/question.js';

export interface JevReply {
  readonly model: string;
  readonly answers: AnswerMap;
  readonly usage: Usage;
}

/** Anything that can answer typed questions about one state. */
export interface JevPort {
  ask(state: StateEntry, questions: QuestionMap): Promise<JevReply>;
}

export interface SourceRequest {
  readonly path: string;
  /** 1-based first line; the whole file when omitted. */
  readonly start?: number | undefined;
  /** 1-based last line, inclusive. */
  readonly end?: number | undefined;
  readonly maxBytes?: number | undefined;
}

export interface SourceSnippet {
  readonly path: string;
  readonly startLine: number;
  readonly endLine: number;
  readonly content: string;
  readonly truncated: boolean;
}

/** Reads code the questions are about, so the caller never has to hold it. */
export interface SourceReader {
  read(requests: readonly SourceRequest[]): Promise<readonly SourceSnippet[]>;
}
