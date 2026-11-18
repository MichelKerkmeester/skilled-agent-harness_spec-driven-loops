---
title: "Implementation Plan: Pasted-Context Stripping Before Scoring"
description: "Pick the smallest rule that drops a leading pasted reply before a task marker, put it in the prompt policy, call it in the recommend handler and at the entry of scoreAdvisorPrompt, and prove it with the CLI probe pair and one new corpus row."
trigger_phrases:
  - "pasted context stripping plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Pasted-Context Stripping Before Scoring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, in the advisor runtime under `.skilled/skills/system-skill-advisor/runtime/` |
| **Framework** | The five-lane fusion scorer and its prompt policy |
| **Storage** | None. JSONL corpora and JSON baselines only |
| **Testing** | Vitest parity gates and the calibration bench, plus one CLI probe |

### Overview
A short design step picks one rule that drops a leading reported-speech or quoted span when a task marker follows it. The rule goes into `runtime/lib/prompt-policy.ts` as one exported function. The recommend handler calls it before it builds the embedding and the cache key, and `scoreAdvisorPrompt` calls it at its entry for callers that skip the handler. The CLI probe pair and one new corpus row prove it, and the routing gates stay green after a re-baseline whose only delta is that row.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The Measured Behavior command in `spec.md` still prints `sk-doc` first for the pasted prompt
- [ ] The design step's rule is written in `implementation-summary.md` with its match count over the existing corpora

### Definition of Done
- [ ] The Measured Behavior command prints `sk-code` first on both lines, from a daemon started after the rebuild
- [ ] `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts` from `runtime/` exits 0
- [ ] `git diff` on each recaptured baseline shows only the hash, the counts and the entry the new row explains
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One function, two call sites.

### Why the handler and the scorer entry, not the brief producer
The brief names `runtime/lib/skill-advisor-brief.ts` and its prompt policy as the shared producer. That file reaches no runtime in production:

- No runtime hook calls `buildSkillAdvisorBrief` (`runtime/lib/skill-advisor-brief.ts:449`). Outside its module it is reached only through the Claude hook's optional `buildBrief` test dependency (`hooks/claude/user-prompt-submit.ts:129`, used at `:365-370`), a compat re-export (`runtime/compat/index.ts:8`) and a spec-kit measurement script (`.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:252-256`).
- The hook's production path is `skippedAdvisorResultFor(prompt) ?? await buildCliBrief(...)` (`hooks/claude/user-prompt-submit.ts:371`). `buildSkillAdvisorBriefFromCli` spawns the CLI with `advisor_recommend` (`hooks/lib/skill-advisor-cli-fallback.ts:253-255`) and sends the raw prompt (`:230`).
- Pi, DSH and Vibe call the same Claude handler (`hooks/pi/prompt-advisor.ts:289`, `hooks/dsh/prompt-advisor.mjs:124`, `hooks/vibe/prompt-advisor.mjs:192`).
- The OpenCode plugin reaches the same producer. It spawns `.opencode/bin/skill-advisor.cjs advisor_recommend` (`.opencode/plugins/system-skill-advisor.js:137`, `:693-695`), and that shim is byte-identical to `.skilled/bin/skill-advisor.cjs` (`cmp` printed no difference on 2026-11-18). Neither runtime reaches `skill-advisor-brief.ts`.
- All five runtimes therefore meet in `computeRecommendationOutput` (`runtime/handlers/advisor-recommend.ts:515`), which builds its cache key from `input.prompt.trim()` (`:535-536`) and scores at `:569`.

Two places reach all five runtimes: the handler before its cache key, and the entry of `scoreAdvisorPrompt` (`runtime/lib/scorer/fusion.ts:1274`). Each fails alone:

- A handler-only strip fails the corpus requirement. Every corpus runner calls `scoreAdvisorPrompt` directly: the calibration bench (`runtime/bench/scorer-calibration.bench.ts:202`), `advisor_validate` (`runtime/handlers/advisor-validate.ts:377`, `:484`) and the ratchet. So the new row would still route `sk-doc`.
- A scorer-only strip breaks the semantic lane for stripped prompts. The handler embeds the raw prompt (`withSemanticShadowPromptEmbedding(input.prompt, ...)` at `runtime/handlers/advisor-recommend.ts:569`), and the lane uses that embedding only when its stored prompt equals the prompt it is scoring (`runtime/lib/scorer/lanes/semantic-shadow.ts:249-251`, `:328-330`). Outside the fixture projection a miss gives no vector, so the lane scores nothing.

So the handler strips once and passes the result to the embedding, the cache key and the scorer. The scorer-entry call covers the corpus runners and changes nothing for text that is already stripped, which the rule must guarantee. Task T004 confirms the placement before any code changes.

No vitest gate can catch a wrong placement. Under vitest, `withSemanticShadowPromptEmbedding` returns early (`runtime/lib/scorer/lanes/semantic-shadow.ts:145`), and the lane falls back to a fixture vector of whatever text it holds (`:251`). Every gate passes with either placement. So the post-rebuild probe in task T013 also checks that the stripped probe still gets a `semantic_shadow` contribution.

### Key Components
- **`runtime/lib/prompt-policy.ts`**: holds the new exported function next to `shouldFireAdvisor` (`:126`). It already owns prompt-text rules and imports nothing from the scorer, so no import cycle appears. The function is exported because phase 003's guard and bench call it too.
- **`runtime/handlers/advisor-recommend.ts`**: `computeRecommendationOutput` strips `input.prompt` once and uses the result for the embedding (`:569`), the cache key (`:535-536`) and the scorer call.
- **`runtime/lib/scorer/fusion.ts`**: `scoreAdvisorPrompt` calls the function before `prompt.toLowerCase()` (`:1278`) and uses the result for every lane.

### Data Flow
Hook or plugin, then the CLI, then the daemon handler, which strips the leading pasted span, embeds the remainder, builds the cache key from it and scores it. The handler's other reads of the raw prompt stay as they are: the compiled route (`runtime/handlers/advisor-recommend.ts:563`, `:638`), the typed command (`:560`, `:635`) and the workflow mode (`:257`). No failure in those reads has been shown, so they are out of scope. A pasted reply that names a slash command may still surface that command through the compiled route. Task T013 runs one probe for it. A leak opens a follow-up and is not fixed in this phase.

### Known limit
When the daemon is unreachable, the CLI falls back to the Python local scorer (`runtime/skill-advisor-cli.ts:1456-1468`, `runtime/lib/subprocess.ts:321-357`). That path does not get the strip. This phase plans no Python change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs the probe pair and checks the candidate rule against every existing corpus prompt and a set of inline negatives. Implementation adds the function to `runtime/lib/prompt-policy.ts`, calls it from the recommend handler and from `scoreAdvisorPrompt`, and adds one row to `labeled-prompts.jsonl`. Verification re-baselines the moved pins, runs the corpus gates and re-runs the probe pair after a rebuild, with a semantic-lane check and a compiled-route probe. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new corpus row is the test. It fails before the change and passes after it, and the ratchet pins its result. The gate command in Definition of Done must exit 0 from `runtime/`. It covers every test that reads `labeled-prompts.jsonl` by default: the parity folder (ratchet, Python parity, local-native divergence, holdout independence), the legacy corpus parity and the policy gold replay. The CLI probe pair is the end-to-end check, because it runs the same handler every hook reaches. No new test file is added.

The corpus pins one new row moves:

| Pin | Where | Recapture |
|-----|-------|-----------|
| Corpus hash and counts | `tests/parity/scorer-eval-baseline-ratchet.vitest.ts:247` | `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write` |
| Calibration corpus hash and row count | `bench/scorer-calibration.bench.ts:259-260` | `SPECKIT_WRITE_SCORER_CALIBRATION_BASELINE=1 SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts` |
| Python and TypeScript divergence | `tests/parity/fixtures/local-native-approved-divergences.json` | `node scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs --write`, only when the ratchet reports the new row as a new divergence |
| Python parity counts | `tests/parity/python-ts-parity.vitest.ts:269-280` | None expected, because the Python scorer does not get the strip and is expected to route the new row away from `sk-code`, which keeps `pythonCorrect` at 113. If it routes `sk-code`, the constant at `:269` moves by one |
| Legacy Python counts | `tests/legacy/advisor-corpus-parity.vitest.ts:178-179` | None expected, for the same reason. If the Python scorer routes the new row `sk-code`, `pythonCorrect` at `:178` moves by one |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The runtime build (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build`) and the three capture commands above. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a gate stays red after the re-baseline, or the probe shows a correct route lost. Revert the one commit, which restores the function, both calls, the row and the three baselines together, then rebuild.
<!-- /ANCHOR:rollback -->

---
