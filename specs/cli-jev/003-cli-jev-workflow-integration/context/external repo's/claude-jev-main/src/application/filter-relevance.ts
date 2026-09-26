import type { JsonValue, Usage } from '../domain/question.js';
import {
  byNeed,
  readRelevance,
  relevanceQuestions,
  type RelevanceReading,
} from '../domain/catalog/relevance.js';
import { askAll } from './fan-out.js';
import type { JevDeps } from './ask.js';
import type { SourceRequest, SourceSnippet } from './ports.js';

/** Enough of a file to judge whether it is relevant, without sending all of it. */
export const DEFAULT_HEAD_BYTES = 1500;

export interface RelevanceCandidateInput {
  readonly id: string;
  /** A file to peek at; its head is read by the server. */
  readonly path?: string | undefined;
  /** Text supplied directly instead of a path. */
  readonly text?: string | undefined;
  /** How the candidate is named in the answer; defaults to the path or the id. */
  readonly label?: string | undefined;
}

export interface FilterInput {
  /** The question the surviving candidates have to help answer. */
  readonly goal: string;
  readonly candidates: readonly RelevanceCandidateInput[];
  readonly headBytes?: number | undefined;
}

export interface FilterResult {
  readonly kept: readonly RelevanceReading[];
  readonly dropped: readonly RelevanceReading[];
  readonly model: string;
  readonly usage: Usage;
  readonly requests: number;
  readonly stateTokens: number;
}

export class EmptyCandidateError extends Error {
  constructor(id: string) {
    super(`candidate "${id}" has neither \`path\` nor \`text\``);
    this.name = 'EmptyCandidateError';
  }
}

async function peek(
  read: (requests: readonly SourceRequest[]) => Promise<readonly SourceSnippet[]>,
  candidates: readonly RelevanceCandidateInput[],
  maxBytes: number,
): Promise<ReadonlyMap<string, SourceSnippet>> {
  const wanted = candidates.flatMap((candidate) =>
    candidate.path === undefined ? [] : [{ id: candidate.id, path: candidate.path }],
  );
  const snippets = await read(wanted.map(({ path }) => ({ path, maxBytes })));
  const found = new Map<string, SourceSnippet>();
  wanted.forEach(({ id }, index) => {
    const snippet = snippets[index];
    if (snippet !== undefined) found.set(id, snippet);
  });
  return found;
}

export async function filterRelevance(deps: JevDeps, input: FilterInput): Promise<FilterResult> {
  const peeked = await peek(
    (requests) => deps.reader.read(requests),
    input.candidates,
    input.headBytes ?? DEFAULT_HEAD_BYTES,
  );

  const candidates: Record<string, JsonValue> = {};
  const labelled = input.candidates.map((candidate) => {
    const content = peeked.get(candidate.id)?.content ?? candidate.text;
    if (content === undefined) throw new EmptyCandidateError(candidate.id);
    const label = candidate.label ?? candidate.path ?? candidate.id;
    candidates[candidate.id] = { label, content };
    return { id: candidate.id, label };
  });

  const state = { goal: input.goal, candidates };
  const questions = Object.assign({}, ...labelled.map(relevanceQuestions));
  const fanOut = await askAll(deps.jev, state, questions, deps.maxRequests);
  const readings = labelled
    .map((candidate) => readRelevance(candidate, fanOut.answers))
    .sort(byNeed);
  return {
    kept: readings.filter((reading) => reading.keep),
    dropped: readings.filter((reading) => !reading.keep),
    model: fanOut.model,
    usage: fanOut.usage,
    requests: fanOut.requests,
    stateTokens: fanOut.stateTokens,
  };
}
