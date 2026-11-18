---
title: "Implementation Plan: Route Receipts Build"
description: "Amend the provisional design from phase 010's research first. Then carry the floored flag to the hook, add a receipt module with one pure decision function, wire it into the shared handler and the Pi adapter and measure it on the nine follow-up pairs, with every failing test landing before its fix."
trigger_phrases:
  - "route receipts build plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Route Receipts Build

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, in the advisor runtime and its hooks |
| **Framework** | The shared Claude `UserPromptSubmit` handler, reused by Pi, DSH and Vibe, and by Codex through the Claude adapter |
| **Storage** | One small JSON file per session in a `route-receipts/` folder under the directive state base, provisional until phase 010 closes |
| **Testing** | Vitest hook, schema and handler suites, plus the calibration bench |

### Overview
Phase 010 fixes the design, so T001 first rewrites `spec.md`'s Files to Change table and REQ rows from `../010-route-receipts-research/research/research.md`. The provisional build then has three parts. The `confidenceFloored` flag travels from the scorer to the hook along the `heldBelow` path. A new `hooks/lib/route-receipt.ts` holds the receipt store and one pure decision function. The shared handler reads a receipt before rendering and writes one after a confident route. The bench calls the same decision function on the nine follow-up pairs, so the measurement reads the guard that ships.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 010's implementation summary names the over-suppresses branch, and its `research/research.md` answers Q1 to Q5
- [ ] T001 has run: `rg -n 'Provisional until 010 closes' spec.md` prints nothing
- [ ] Phase 009 is complete, and the hook lines this plan cites were re-read after it landed: `sed -n 360,392p hooks/claude/user-prompt-submit.ts` still shows the result build and the `renderBrief(result` call, or the briefs carry the new line numbers
- [ ] `npx vitest run tests/hooks tests/schemas tests/handlers` from `runtime/` exits 0 before any edit, with its pass count recorded

### Definition of Done
- [ ] `npx vitest run tests/hooks tests/schemas tests/handlers` from `runtime/` exits 0
- [ ] The bench's `advisor-follow-up-receipts` line meets the frozen threshold, and the corpus gates exit 0 with no corpus file changed
- [ ] `git diff --stat` lists only the files in the amended Files to Change table
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure decision, thin wiring. Provisional until 010 closes.

### Key Components
- **Flag pass-through**: the same four edits phase 003 planned for its ship branch (`../003-follow-up-routing-benchmark/plan.md` section 3). An optional `confidenceFloored: z.literal(true)` on `AdvisorRecommendationSchema` (`runtime/schemas/advisor-tool-schemas.ts:305-332`). `publicRecommendation` copies it when true (`runtime/handlers/advisor-recommend.ts:286`). `AdvisorRecommendation` carries it (`runtime/lib/subprocess.ts:39-56`). `recommendationFromCli` keeps it (`hooks/lib/skill-advisor-cli-fallback.ts:379`).
- **`hooks/lib/route-receipt.ts`, new**: a receipt holds the session's last confident top skill, its confidence, a hash of the stripped prompt, the time it was written, the transcript byte count when known and the directive clock tokens when known. The provisional store writes one file per hashed session id, through a temp file and `rename`, in a `route-receipts/` folder beside Vibe's `vibe-turn-start/` folder under the same base (`hooks/vibe/prompt-advisor.mjs:43-44`, `:68-72`). It keeps at most 64 sessions, the bound both existing stores use (`hooks/lib/directive-lifecycle-contract.ts:8`, `hooks/vibe/prompt-advisor.mjs:45`). An in-memory store serves tests, as `InMemoryDirectiveLifecycleStore` does (`hooks/lib/directive-lifecycle.ts:193-246`). The decision function takes the receipt, the policy reason, the top passing recommendation and the weak-follow-up test 010's Q1 fixes, and returns keep, suppress or reuse. It does no I/O, so the bench can call it.
- **The shared handler**: after the result is built (`hooks/claude/user-prompt-submit.ts:366-378`) and before `renderBrief` (`:388`), the handler reads the session's receipt, calls `shouldFireAdvisor(stripLeadingPastedReply(prompt))` for the policy reason and applies the decision. The live skip check reads the unstripped prompt (`:372`, `runtime/lib/skill-advisor-brief.ts:420-423`), so the guard must not reuse that reason: pair 9's raw reason is the explicit marker, not work intent. On a suppress decision the handler swaps in the policy's skipped result, built through an exported helper over the private `result` builder (`runtime/lib/skill-advisor-brief.ts:321`, `:432-442`), never a hand-written literal. After a confident, non-floored route it writes the receipt. Every receipt read and write sits in its own try, so a store fault keeps today's output, as directive dedup does (`:429-432`). Tests inject the store through a new optional dependency beside `directiveLifecycleStore` (`:136`), and the default is the file store.
- **Pi**: the adapter passes `session_id: sessionIdFromContext(ctx)` (`hooks/pi/prompt-advisor.ts:56-62`) in the handler input at `:290-294`. DSH (`hooks/dsh/prompt-advisor.mjs:171`) and Vibe (`hooks/vibe/prompt-advisor.mjs:236`) already pass one. Codex forwards its whole input to the Claude adapter (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:101`). INFERRED that Codex input holds `session_id`, which phase 010's Q4 confirms.
- **The bench**: a new log function beside `logFollowUpRouting` (`runtime/bench/scorer-calibration.bench.ts:216-252`) scores each pair's task, builds an in-memory receipt from the task's top-1, scores the follow-up and calls the decision function. It prints one `advisor-follow-up-receipts` line with `H`, the per-pair decision and the false-carry result. It adds no assertion, as phase 003's lines did not.

### Data Flow
Turn one: the CLI result reaches the handler with `confidenceFloored` on each floored recommendation, the brief renders and the handler writes a receipt for the confident top skill. Turn two: the handler reads that receipt, reads the policy reason from stripped text, calls the decision function and renders either the route, the reused route or the skipped head. With no receipt, the decision is always keep.

### Why `C` does not apply
`C` counts corpus rows the prompt-only guard would hide. Corpus rows are scored one at a time with no session, so no receipt exists and the decision is keep for every row. The corpus gates still run, as a check that no receipt logic leaks into the scorer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup amends `spec.md` from phase 010's research, confirms 009 and 010 are done, re-reads the hook and records the suite, bench and corpus baselines. Implementation lands each failing test before its fix, in the waves `tasks.md` gives: the receipt tests and the flag pass-through, then the receipt module, then the hook replay test and the hook, Pi and bench wiring. Verification runs the typecheck and build, the bench, the corpus gates and the hook, schema and handler suites, and checks the diff and comment hygiene. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Red first. `runtime/tests/hooks/route-receipt.vitest.ts` lands before `hooks/lib/route-receipt.ts` and fails because the module does not exist. It covers the pair-1 shape, the false-carry case and expiry by lifecycle boundary, transcript shrink and age. The hook replay test lands before the hook edit and fails because the handler ignores receipts. It runs a task then its follow-up on one session id with an in-memory store, using the `buildCliBrief` stub the suite already injects (`runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:72-93`), and also covers the no-receipt case and pair 9. That stub bypasses `recommendationFromCli`, so one new case in `runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` lands before the mapper edit and fails until the mapper keeps the flag. Without it a dropped flag would leave every test green while the live guard never fires. The bench is the measurement on the nine pairs. The gate is `npx vitest run tests/hooks tests/schemas tests/handlers` from `runtime/`, then `BENCH` and `GATES`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 010 closed on the over-suppresses branch. Phase 009 complete. `SPECKIT_RUN_BENCHES=true` for the bench. No new package. The Luna swarm and its fallback per `../delegation-strategy.md`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a weak follow-up loses a correct route in use, or a receipt fault changes output with no receipt present. Revert the phase's commit, which removes the receipt module, the guard, the Pi session id and the flag pass-through together, then rebuild the runtime. Receipt files left on disk are inert once the code is gone. Delete the `route-receipts/` folder under the state base to clear them.
<!-- /ANCHOR:rollback -->

---
