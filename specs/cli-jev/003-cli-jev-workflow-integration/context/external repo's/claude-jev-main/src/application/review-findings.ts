import type { JsonValue, Usage } from '../domain/question.js';
import {
  byReviewPriority,
  judgeFinding,
  reviewQuestions,
  type Finding,
  type ReviewJudgement,
} from '../domain/catalog/review.js';
import { askAll } from './fan-out.js';
import type { JevDeps } from './ask.js';
import type { SourceRequest } from './ports.js';
import { sourcesField } from './state.js';

export interface ReviewInput {
  readonly findings: readonly Finding[];
  readonly sources: readonly SourceRequest[];
  /** What the change under review is meant to do. */
  readonly intent?: string | undefined;
}

export interface ReviewResult {
  readonly judgements: readonly ReviewJudgement[];
  readonly model: string;
  readonly usage: Usage;
  readonly requests: number;
  readonly stateTokens: number;
}

function findingsField(findings: readonly Finding[]): JsonValue {
  return Object.fromEntries(
    findings.map((finding) => [
      finding.id,
      {
        file: finding.file,
        ...(finding.line === undefined ? {} : { line: finding.line }),
        claim: finding.claim,
        failure: finding.failure,
      },
    ]),
  );
}

export async function reviewFindings(deps: JevDeps, input: ReviewInput): Promise<ReviewResult> {
  const snippets = await deps.reader.read(input.sources);
  const state = {
    task: 'A reviewer claims each of these findings is a defect in the code under `sources`.',
    ...(input.intent === undefined ? {} : { change_intent: input.intent }),
    findings: findingsField(input.findings),
    sources: sourcesField(snippets),
  };
  const questions = Object.assign({}, ...input.findings.map(reviewQuestions));
  const fanOut = await askAll(deps.jev, state, questions, deps.maxRequests);
  const judgements = input.findings
    .map((finding) => judgeFinding(finding, fanOut.answers))
    .sort(byReviewPriority);
  return {
    judgements,
    model: fanOut.model,
    usage: fanOut.usage,
    requests: fanOut.requests,
    stateTokens: fanOut.stateTokens,
  };
}
