---
title: "Setup notes: skills"
description: "The call sites, the baseline and the measured skill sizes recorded before the skills build edited any file."
---

# Setup notes: skills

## 1. Call sites

The four places the change touches: `buildBotPrompt` in dispatch.ts (the prompt builder), its call in runner.ts (the loader goes before it), `answerLocked` with `REVIEW_KINDS` in answer.ts (the review seam) and `RESERVED_BOT_IDS` in label.ts.

`rg -c 'buildBotPrompt' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` exits 0 and prints:

```text
2
```

`rg -n 'buildBotPrompt' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` exits 0 and prints:

```text
.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:447:export function buildBotPrompt(input: {
.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:57:  buildBotPrompt,
.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1456:      const built = buildBotPrompt({
```

`rg -n 'RESERVED_BOT_IDS' .skilled/skills/system-skilled-bots/runtime/lib/label.ts` exits 0 and prints:

```text
34:export const RESERVED_BOT_IDS: readonly string[] = [DRAIN_SUFFIX, MEMORY_PROPOSALS_BOT_ID, SKILL_PROPOSALS_BOT_ID];
105:  if (RESERVED_BOT_IDS.includes(botId)) return { ok: false, reason: 'bot-id-reserved', detail: botId };
137:    if (!BOT_ID_PATTERN.test(botId) || RESERVED_BOT_IDS.includes(botId)) {
```

`rg -n 'function answerLocked|REVIEW_KINDS' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` exits 0 and prints:

```text
183:const REVIEW_KINDS: readonly ReviewKind[] = [MEMORY_PROPOSAL_REVIEW];
188:  return REVIEW_KINDS.find((r) => r.kind === kind) ?? null;
286:function answerLocked(input: AnswerInput, ctx: LockedContext): Result<AnswerResult> {
```

## 2. Baseline before any edit

`cd .skilled/skills/system-skilled-bots/runtime && npm test` ran on 2026-11-28 before any edit and printed `Test Files  51 passed (51)` and `Tests  654 passed (654)` with exit 0, and `npm run typecheck` exited 0. The orchestrator measured both and this note records them.

## 3. The sizes the caps are set against

`wc -c .skilled/skills/*/SKILL.md | grep -v total | sort -rn` exits 0 and prints:

```text
   32668 .skilled/skills/sk-git/SKILL.md
   28798 .skilled/skills/system-spec-kit/SKILL.md
   17093 .skilled/skills/sk-prompt/SKILL.md
   14605 .skilled/skills/sk-code/SKILL.md
   14519 .skilled/skills/cli-external-orchestration/SKILL.md
   14403 .skilled/skills/mcp-code-mode/SKILL.md
   13009 .skilled/skills/system-skill-advisor/SKILL.md
   12469 .skilled/skills/sk-doc/SKILL.md
   11233 .skilled/skills/system-deep-loop/SKILL.md
    8924 .skilled/skills/cli-classifier/SKILL.md
    8187 .skilled/skills/mcp-tooling/SKILL.md
    8163 .skilled/skills/mcp-browser-use/SKILL.md
    7472 .skilled/skills/sk-design/SKILL.md
    7213 .skilled/skills/system-skilled-doctor/SKILL.md
    6186 .skilled/skills/system-skilled-bots/SKILL.md
```

`ls -d .skilled/skills/*/ | wc -l` exits 0 and prints:

```text
      15
```

The caps are 16,384 bytes per skill and 20,480 across the list. Three bodies sit over 16,384 bytes: sk-git at 32,668 bytes, system-spec-kit at 28,798 bytes and sk-prompt at 17,093 bytes. Fifteen skills exist. The plan measured the largest body as 32,362 bytes on 2026-11-25 and today's largest is 32,668 bytes, so the task's literal check `32362 .skilled/skills/sk-git/SKILL.md` no longer prints as written, and the plan's sixteen skills are now 15.

## 4. The detector and the reader

`rg -n 'export function findSecretLiteral|export function readRunRecord|export function collectAllKnownSecrets' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` exits 0 and prints:

```text
.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:466:export function readRunRecord(stateRoot: string, identity: string, runId: string): Result<RecordRead> {
.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:307:export function collectAllKnownSecrets(env: NodeJS.ProcessEnv, checkoutRoot: string | null, stateRoot: string, identity: string | null): Result<Map<string, string>> {
.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:325:export function findSecretLiteral(text: string, known: KnownSecrets): SecretMatch | null {
```

`findSecretLiteral`, `collectAllKnownSecrets` and `readRunRecord` are exported, so a new module can import them.
