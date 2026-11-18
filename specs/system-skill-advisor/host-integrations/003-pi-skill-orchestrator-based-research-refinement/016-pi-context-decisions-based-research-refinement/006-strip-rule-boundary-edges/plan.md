---
title: "Implementation Plan: Strip-Rule Boundary Edges"
description: "Move the shared strip cases into one JSON fixture, prove the three refuted edges red first, then require an attribution header in the cue and pick the marker rule by the fixture, the corpus count and a tie-break fixed before the build."
trigger_phrases:
  - "strip rule boundary edges plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Strip-Rule Boundary Edges

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, plus one JSON fixture |
| **Framework** | The advisor prompt policy, read by the recommend handler, the scorer entry and the calibration bench |
| **Storage** | None |
| **Testing** | Vitest in the advisor runtime, the corpus gates and the calibration bench |

### Overview
The cases the strip rule must honor move into `runtime/tests/fixtures/pasted-reply-strip-cases.json`, and one test in `runtime/tests/legacy/advisor-prompt-policy.vitest.ts` reads them. That test fails on five rows against the shipped rule. The cue then requires an attribution header, and the marker rule is chosen by a procedure fixed here, so the plan does not pick it. The corpus count, the corpus gates and the follow-up bench prove nothing else moved.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot. `SCRATCH` is this phase's `scratch/` folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `sed -n 225,249p runtime/lib/prompt-policy.ts` still shows `PASTED_REPLY_CUE`, `TASK_MARKER`, `stripPastedReplyOnce` and `export function stripLeadingPastedReply`
- [ ] `node SCRATCH/count-corpus-strips.mjs` prints `{"jsonl":701,"jsonlChanged":["rr-paste-208"],"harder":24,"harderChanged":[]}` before any edit
- [ ] The 003 bench with `--reporter=verbose` prints `"N":9`, `"H":5` and `collateral` 19 before any edit

### Definition of Done
- [ ] `npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts` from `runtime/` exits 0 with every fixture row passing
- [ ] `node SCRATCH/count-corpus-strips.mjs` after the build prints the same line as before
- [ ] The corpus gates exit 0, and the bench prints `"N":9`, `"H":5` and `collateral` 19
- [ ] `implementation-summary.md` names the marker rule, the tie-break result and the row the rule still misses
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture-driven rule test.

### Key Components
- **The cue at `runtime/lib/prompt-policy.ts:225`.** It becomes, for both candidates:

```ts
const PASTED_REPLY_CUE = /^\s*(?:(?:earlier|previously|above),?\s+)?(?:(?:you|the assistant|claude)\s+(?:replied|said|wrote|answered|responded)|(?:the\s+)?(?:assistant|claude)\s+(?:response|reply|answer))\s*:/i;
```

  The quote alternative `["“>]` is gone. A quote or `>` alone shows that text is quoted, not that the assistant wrote it. Keeping `"` and `“` while dropping `>` would split one kind of evidence for no reason. The new second branch reads `Assistant response:`, `Claude reply:` and the same with a leading `the`. The bench's pasted pair 9 opens with `Earlier you replied:`, so it still strips.

- **The marker rule at `:226-234`, two candidates.** The plan names both and lets the procedure below choose.
  - **First-marker** keeps `TASK_MARKER` and `stripPastedReplyOnce` as they are (`:226`, `:230`). It misses `marker-inside-reply`, where the reply's own `Task:` cuts first.
  - **Last-marker** makes the marker global and cuts at the last match:

```ts
const TASK_MARKER = /(?:^|[.!?\n]\s*)(?:now|task)\s*:\s*/gi;

function stripPastedReplyOnce(prompt: string): string {
  if (!PASTED_REPLY_CUE.test(prompt)) return prompt;
  const markers = [...prompt.matchAll(TASK_MARKER)];
  const marker = markers[markers.length - 1];
  if (!marker) return prompt;
  const task = prompt.slice((marker.index ?? 0) + marker[0].length).trim();
  return task.length > 0 ? task : prompt;
}
```

  It misses `two-markers-in-user-task`, where the user's own task holds `Task:` then `Now:`. The `?? 0` form copies `runtime/lib/command-attach.ts:475`. `matchAll` copies the regex, so the global flag leaves no `lastIndex` state behind.

- **The choosing procedure, fixed before the build.**
  1. Count failing fixture rows under each candidate. Fewer failing rows wins.
  2. On a tie, count corpus prompts each candidate changes. The candidate that changes only `rr-paste-208` in the JSONL corpora and nothing in the harder corpus wins.
  3. On a second tie, score each candidate's missed output and that row's ideal output with `scoreAdvisorPrompt`. The candidate whose miss keeps the ideal output's top skill wins.
  4. If that still ties, the conductor stops and asks the operator.

  `SCRATCH/candidate-rules.cjs` holds both candidates with the cue above and runs steps 1 and 2 without a build. The conductor first checks its two regexes match this section character for character. `SCRATCH/score-miss-outputs.mjs` runs step 3 through the built scorer, with its four texts set to the two misses and their ideal outputs. The chosen rule is then confirmed by the real fixture test and by `SCRATCH/count-corpus-strips.mjs` after the build.

  On 2026-11-18 steps 1 and 2 tie (one miss each, no new corpus strip). Step 3 separates them: first-marker's miss routes `sk-doc` and last-marker's routes `sk-code`. The build reruns all three steps on the new cue and records what it sees, not this preview.

- **The fixture `runtime/tests/fixtures/pasted-reply-strip-cases.json`.** It follows `runtime/tests/fixtures/affordance-injection-fixtures.json`, which `runtime/tests/affordance-normalizer.test.ts:34` and `runtime/tests/python/test_skill_advisor.py:2167-2176` both read:

```json
{
  "$comment": "Shared pasted-reply strip cases. Read by the TypeScript prompt-policy test and the Python advisor test, so both scorers drop the same text. A row with an ideal field is a known miss of the shipped rule.",
  "schema_version": 1,
  "cases": [
    { "id": "probe", "input": "...", "expected": "..." }
  ]
}
```

  Non-ASCII characters are written as `\u` escapes. The rows, with phase 002's text verbatim:

| id | input | expected |
|----|-------|----------|
| `probe` | `Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code` | `Refactor the session store module to remove duplicated locking code` |
| `you-said-variant` | `You said: run the tests. Task: fix the failing parser test` | `fix the failing parser test` |
| `nested-two-cues` | `Earlier you replied: A. Now: You said: B. Task: fix the parser` | `fix the parser` |
| `nested-plan` | `Earlier you replied: You said: run the tests. Now: Refactor the session store module to remove duplicated locking code` | `Refactor the session store module to remove duplicated locking code` |
| `plain-task` | `Refactor the session store module to remove duplicated locking code` | unchanged |
| `neg-cue-inside` | `Fix the bug where the bot prints "you said:" twice` | unchanged |
| `neg-cue-inside-plan` | `Fix the parser so a line with "you said:" in it is kept` | unchanged |
| `neg-now-mid` | `Update the docs. Now: also add a changelog entry` | unchanged |
| `neg-now-mid-plan` | `Refactor the timer so the label Now: shows the current time` | unchanged |
| `neg-no-marker` | `Earlier you replied: done with the README` | unchanged |
| `neg-no-marker-plan` | `You said: the build is green, so commit it` | unchanged |
| `quote-requirement-kept` | `> Keep the public API backward compatible.\nTask: Refactor the session store module to remove duplicated locking code.` | unchanged |
| `marker-inside-reply` | `Earlier you replied: The report is done. Task: Create a README with sk-doc. Now: Refactor the session store module to remove duplicated locking code.` | `Refactor the session store module to remove duplicated locking code.` |
| `assistant-response-header` | `Assistant response: I updated the README with sk-doc conventions and committed it with sk-git. Task: Refactor the session store module to remove duplicated locking code.` | `Refactor the session store module to remove duplicated locking code.` |
| `two-markers-in-user-task` | `Earlier you replied: Done. Task: Refactor the session store module. Now: also update its tests.` | `Refactor the session store module. Now: also update its tests.` |
| `quote-led-straight` | `"I updated the README with sk-doc conventions."\nNow: Refactor the session store module to remove duplicated locking code` | unchanged |
| `quote-led-curly` | `“I updated the README with sk-doc conventions.”\nNow: Refactor the session store module to remove duplicated locking code` | unchanged |

  In JSON, "unchanged" is the input string repeated. After the procedure picks a rule, the row it misses gets `expected` set to the rule's actual output and an `ideal` field holding the text in the table above.

- **The test block in `runtime/tests/legacy/advisor-prompt-policy.vitest.ts`.** It adds `stripLeadingPastedReply` to the import at `:6-9`, reads the fixture with `readFileSync` from `../fixtures/pasted-reply-strip-cases.json` beside the test file, and runs one `it` per row. Each asserts `stripLeadingPastedReply(input)` equals `expected` and that a second call returns the same text, the property phase 002 relies on so the handler and the scorer agree.

### Data Flow
Unchanged. The handler strips once (`runtime/handlers/advisor-recommend.ts:536`) for the cache key, the embedding and the scorer. The scorer strips again at its entry (`runtime/lib/scorer/fusion.ts:1277`), which is a no-op on stripped text. Only the rule's output changes, so the three call sites need no edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-reads `runtime/lib/prompt-policy.ts:225-249` and records the corpus count and the bench baseline. Implementation writes the fixture and its test, runs them red against the shipped rule, changes the cue, runs the choosing procedure and lands the chosen marker rule. Verification rebuilds, recounts the corpus, runs the corpus gates and the bench, and records the remaining miss. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts` from `runtime/` fails on exactly five rows before the cue changes (`quote-requirement-kept`, `marker-inside-reply`, `assistant-response-header`, `quote-led-straight`, `quote-led-curly`) and passes every row after. The corpus gates (`GATES` in `tasks.md`) guard routing. The 003 bench with `--reporter=verbose` guards the follow-up numbers. If the corpus count or a gate shows routing moved, the phase 002 recaptures run in its order, T009 to T011, after `npm run build`, because each capture script scores through `dist/`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the existing runtime. No new package. The three scratch scripts use only Node built-ins and the built `dist/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a corpus gate fails on a row the rule now strips, or the probe pair stops routing `sk-code` first. Revert the phase commit. That restores the shipped regexes and removes the fixture and its test. If baselines were recaptured, the same revert restores them, then rebuild and restart the daemon.
<!-- /ANCHOR:rollback -->

---
