---
title: "Implementation Plan: Follow-Up Routing Benchmark with Floor Counter"
description: "Extend the scorer calibration bench with a floored-pass counter and inline follow-up pairs, apply a decision rule fixed in advance and build the flag pass-through and the guard only if that rule says ship."
trigger_phrases:
  - "follow-up routing benchmark plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Follow-Up Routing Benchmark with Floor Counter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, in the advisor runtime |
| **Framework** | Vitest benches and tests, the fusion scorer and the prompt policy |
| **Storage** | None. The counts go to the bench's console line, not to a baseline file |
| **Testing** | The calibration bench run, plus one hook test if the guard ships |

### Overview
The calibration bench already scores every labeled-corpus row with `scoreAdvisorPrompt` (`runtime/bench/scorer-calibration.bench.ts:201-219`) and prints one JSON line (`:246-255`). This phase adds a floored-pass count to that loop and a short inline set of follow-up pairs, then applies the decision rule in `spec.md` section 4. The flag pass-through and the guard come last and only on a ship decision.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002's corpus gates are green, so the scorer under test includes the stripping rule, and its strip function is exported
- [ ] Phase 004 is complete, so its pinned lines in `hooks/claude/user-prompt-submit.ts` no longer move
- [ ] The pair list in section 3 and the decision rule in `spec.md` section 4 are unchanged since planning

### Definition of Done
- [ ] `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts` from `runtime/` exits 0 and prints both log lines
- [ ] `implementation-summary.md` records `N`, `H`, `C`, the ids of the `C` rows and the branch of the rule taken
- [ ] If the guard ships, `npx vitest run tests/hooks tests/schemas tests/handlers` from `runtime/` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure in the bench, gate, then build.

### Key Components
- **Floor counter, in `runtime/bench/scorer-calibration.bench.ts`**: inside the loop at `:201-219`, the bench already finds `top` for `result.topSkill`. `topSkill` is the first passing recommendation (`runtime/lib/scorer/fusion.ts:1640-1642`, `:1655`), so a floored top-1 pass is `top?.confidenceFloored === true`. The bench adds the policy reason from `shouldFireAdvisor` (`runtime/lib/prompt-policy.ts:126`), called on phase 002's stripped text, and counts floored passes, split by correct, wrong and work-intent. `C` is the work-intent floored passes that are correct. The bench prints the ids of the `C` rows. The counts join the existing log object at `:246-255`. `createBaseline` (`:172-193`) and the baseline file stay untouched, so no pinned value moves.
- **Follow-up pairs, in the same file**: one constant array, scored in the same run. Pairs 1 to 8 are a session task and a follow-up of three to eight words that names no skill. Pair 9 puts pair 1's follow-up behind a pasted reply that names skills, so it tests the strip before the policy call. The task's measured top-1 is the reference, so no gold label is needed. Each follow-up's policy reason comes from `shouldFireAdvisor` on phase 002's stripped text. The bench prints one `advisor-follow-up-routing` JSON line with `N`, `H`, `Hsame` and the per-pair results, including each follow-up's full floored set. `Hsame` counts the guarded pairs whose follow-up top-1 matches the task's top-1. `Hsame` and the floored sets are reported, not gated on. The bench adds no new assertion, because a measurement has no pass bar. Pairs 2 and 4 have no task verb and are negative controls. They count inside `N`, which is 9, so the ship bar is `H >= 5`. The list, fixed before the first run:

| # | Session task | Follow-up | Note |
|---|--------------|-----------|------|
| 1 | Update the advisor README to document the new corpus file layout | fix that too | |
| 2 | Commit the staged changes and open a pull request on github | do the same for the other branch | Negative control, no task verb |
| 3 | Create a spec folder for the new routing benchmark work | add one more task there | |
| 4 | Design a pricing card component with a dark theme | make it a bit tighter | Negative control, no task verb |
| 5 | Search Notion for the onboarding checklist page | update it again with the new name | |
| 6 | Run a deep review of the advisor hook changes | now fix the remaining ones | |
| 7 | Write a changelog entry for the last release | apply that change to the second file as well | |
| 8 | Refactor the session store module to remove duplicated locking code | add tests for it as well | |
| 9 | Update the advisor README to document the new corpus file layout | Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: fix that too | Pasted-reply form of pair 1 |

- **Only if the rule says ship.** These follow the existing `heldBelow` path, which already crosses the same boundary:
  - Schema: an optional `confidenceFloored: z.literal(true)` on the strict `AdvisorRecommendationSchema` (`runtime/schemas/advisor-tool-schemas.ts:305-332`), shaped like `needsMode` at `:331`.
  - Handler: `publicRecommendation` copies the flag when true, beside `heldBelow` (`runtime/handlers/advisor-recommend.ts:286`).
  - Hook type and mapper: the flag on `AdvisorRecommendation` (`runtime/lib/subprocess.ts:39-56`), kept by `recommendationFromCli` beside `heldBelow` (`hooks/lib/skill-advisor-cli-fallback.ts:377-379`).
  - Guard: in `handleClaudeUserPromptSubmit`, after `result` is built (`hooks/claude/user-prompt-submit.ts:366-375`) and before the brief renders (`:387`). The policy reason is not carried on a firing result, because `skippedAdvisorResultFor` returns null when the policy fires (`runtime/lib/skill-advisor-brief.ts:420-423`). So the guard calls `shouldFireAdvisor` again, on phase 002's stripped text, not the raw prompt. When the reason is `work_intent_with_meaningful_tokens` and the top passing recommendation carries the flag, the guard returns the policy's existing skipped result: status `skipped`, freshness `unavailable`, built through the policy's existing skipped builder and never a hand-written literal. That builder is the module-private `result` (`runtime/lib/skill-advisor-brief.ts:321`), which `skippedAdvisorResultFor` calls with those two values (`:432-442`). `skippedAdvisorResultFor` itself cannot be called as it stands, because it returns null on a firing prompt (`:423`). So the ship branch exports one helper from `skill-advisor-brief.ts` that calls `result` with those two values, and the guard calls that helper. The hook then renders `Advisor: prompt skipped.` and the hygiene directive (`runtime/lib/render.ts:644-646`, `:659`, `:663`), the same output "continue" gets today. `{}` is ruled out because it drops the hygiene directive.
  - Reach: one guard in the shared handler covers Claude, Pi, DSH and Vibe, which all call it (`hooks/pi/prompt-advisor.ts:289`, `hooks/dsh/prompt-advisor.mjs:124`, `hooks/vibe/prompt-advisor.mjs:192`). OpenCode renders its own brief and is not covered.
  - Checks: the ship branch adds a field to `AdvisorRecommendationSchema`, which is `.strict()` (`runtime/schemas/advisor-tool-schemas.ts:332`). The hook tests do not parse daemon output against the schema, so the ship-branch checks also run `tests/schemas` and `tests/handlers`.

### Expected outcome
A close is the expected outcome. "Floored" marks any work-intent prompt whose task-intent floor lifted it (`runtime/lib/scorer/fusion.ts:478`), and that includes moderate real matches such as the standalone refactor task in `spec.md` Measured Behavior. One correct corpus row like that makes `C > 0`, and the rule then closes with no guard. The rule is right to refuse in that case. The bench lists the ids of the `C` rows, so the close can be checked row by row.

### Data Flow
Corpus rows and pairs go into `scoreAdvisorPrompt` and `shouldFireAdvisor`, then into counts on the bench log. On a ship decision only: the daemon handler, then the CLI JSON, then the hook mapper, then the guard, then the renderer.

### Order and why it differs from the brief
The brief lists the pass-through first. The bench reads `confidenceFloored` straight from the scorer, so the measurement needs no pass-through. The flag's only consumer is the guard. The plan therefore builds the pass-through only on a ship decision, so a closed-without-guard outcome adds no public field.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 002 and 004 are done and records a baseline bench run. Implementation adds the floor counter and the inline pairs to `runtime/bench/scorer-calibration.bench.ts`, runs the bench and applies the decision rule. Verification records `N`, `H` and `C` and, on a ship decision only, builds and tests the pass-through and the guard, then runs the hook, schema and handler tests. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The bench run is the measurement: `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts` from `runtime/` must exit 0 with its existing Brier and ECE gate still passing, because the change adds counts and touches no pinned value. If the guard ships, one test in `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` covers the guarded case and one unguarded case, using the `buildCliBrief` stub the suite already uses (`:86-93`). The guarded case asserts the `Advisor: prompt skipped.` head and the hygiene directive. No other test is added. Because `AdvisorRecommendationSchema` is strict, the ship branch also runs the existing schema and handler tests: `npx vitest run tests/hooks tests/schemas tests/handlers` from `runtime/` must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 002 complete, with its strip function exported. Phase 004 complete. `SPECKIT_RUN_BENCHES=true`, because the vitest config includes benches only when it is set. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The bench change is test-only, so reverting its commit restores the old log line. If the guard shipped and hides a correct route in use, revert the guard commit, which removes the schema field, the mapper change and the guard together, then rebuild.
<!-- /ANCHOR:rollback -->

---
