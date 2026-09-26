import type { AnswerMap, QuestionMap, StateEntry, Usage } from '../domain/question.js';
import { askAll } from './fan-out.js';
import type { JevPort, SourceReader, SourceRequest } from './ports.js';
import { sourcesField } from './state.js';

export interface JevDeps {
  readonly jev: JevPort;
  readonly reader: SourceReader;
  readonly maxRequests: number;
}

export interface AskInput {
  readonly state?: StateEntry | undefined;
  readonly sources?: readonly SourceRequest[] | undefined;
  readonly questions: QuestionMap;
}

export interface AskResult {
  readonly answers: AnswerMap;
  readonly model: string;
  readonly usage: Usage;
  readonly requests: number;
  readonly stateTokens: number;
}

export class EmptyStateError extends Error {
  constructor() {
    super('nothing to evaluate: pass `state`, `sources`, or both');
    this.name = 'EmptyStateError';
  }
}

export async function askJev(deps: JevDeps, input: AskInput): Promise<AskResult> {
  const requests = input.sources ?? [];
  const snippets = requests.length > 0 ? await deps.reader.read(requests) : [];
  const state = buildState(input.state, snippets);
  return askAll(deps.jev, state, input.questions, deps.maxRequests);
}

function buildState(
  given: StateEntry | undefined,
  snippets: Awaited<ReturnType<SourceReader['read']>>,
): StateEntry {
  if (snippets.length === 0) {
    if (given === undefined) throw new EmptyStateError();
    return given;
  }
  const sources = sourcesField(snippets);
  if (given === undefined) return { sources };
  if (typeof given === 'string') return { context: given, sources };
  if (Array.isArray(given)) return { context: given, sources };
  return { ...given, sources };
}
