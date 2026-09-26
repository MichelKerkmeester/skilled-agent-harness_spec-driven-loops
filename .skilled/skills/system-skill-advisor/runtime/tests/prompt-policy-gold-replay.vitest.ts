// ───────────────────────────────────────────────────────────────
// MODULE: Prompt Policy Gold Replay Tests
// ───────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { shouldFireAdvisor } from '../lib/prompt-policy.js';

interface LabeledPrompt {
  id: string;
  prompt: string;
  skill_top_1: string;
}

interface GoldenPrompt {
  id: string;
  prompt: string;
  expectedSkillAny?: string[];
}

interface DeclinedPrompt {
  corpus: string;
  id: string;
  prompt: string;
  reason: string;
}

function readJsonlLines(path: URL): string[] {
  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
}

const labeledPrompts = readJsonlLines(
  new URL('../scripts/routing-accuracy/labeled-prompts.jsonl', import.meta.url),
).map((line) => JSON.parse(line) as LabeledPrompt);

const goldenPrompts = readJsonlLines(
  new URL('../scripts/fixtures/gate2-golden-prompts.jsonl', import.meta.url),
)
  .slice(1)
  .map((line) => JSON.parse(line) as GoldenPrompt);

it('replays both prompt corpora without declining routeable prompts', () => {
  expect(labeledPrompts.length, 'labeled prompt corpus must not be empty').toBeGreaterThan(0);
  expect(goldenPrompts.length, 'Gate 2 golden prompt corpus must not be empty').toBeGreaterThan(0);

  const declinedRouteable: DeclinedPrompt[] = [];

  for (const entry of labeledPrompts) {
    const result = shouldFireAdvisor(entry.prompt);
    if (!result.fire && entry.skill_top_1 !== 'none') {
      declinedRouteable.push({
        corpus: 'labeled-prompts',
        id: entry.id,
        prompt: entry.prompt,
        reason: result.reason,
      });
    }
  }

  for (const entry of goldenPrompts) {
    const result = shouldFireAdvisor(entry.prompt);
    if (!result.fire && (entry.expectedSkillAny?.length ?? 0) > 0) {
      declinedRouteable.push({
        corpus: 'gate2-golden-prompts',
        id: entry.id,
        prompt: entry.prompt,
        reason: result.reason,
      });
    }
  }

  const failureDetails = declinedRouteable
    .map(({ corpus, id, prompt, reason }) =>
      `- ${corpus} ${id}: prompt=${JSON.stringify(prompt)}; reason=${reason}`,
    )
    .join('\n');

  expect(
    declinedRouteable,
    `Declined routeable prompts (${declinedRouteable.length}):\n${failureDetails}`,
  ).toEqual([]);
});
