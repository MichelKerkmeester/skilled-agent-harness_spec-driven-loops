---
title: "Implementation Plan: Route Receipts Build"
description: "Apply phase 010's design first. Then carry the floored flag to the hook, add a receipt module with one pure decision function, wire it into the shared handler and the DSH boundaries and measure it on the nine follow-up pairs, with every failing test landing before its fix."
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
| **Framework** | The shared Claude `UserPromptSubmit` handler, reused by DSH and Vibe, and by Codex through the Claude adapter |
| **Storage** | One small JSON file per session in a `route-receipts/` folder under the directive state base |
| **Testing** | Vitest hook, schema and handler suites, plus the calibration bench |

### Overview
Phase 010 fixes the design, so T001 first rewrites `spec.md`'s Files to Change table and REQ rows from `../010-route-receipts-research/research/research.md`. The build then has four parts. The `confidenceFloored` flag travels from the scorer to the hook along the `heldBelow` path. A new `hooks/lib/route-receipt.ts` holds the receipt store and one pure decision function. The shared handler reads a receipt before rendering and writes one after a confident route. The DSH adapter rotates the lifecycle clock on its own boundaries. The bench calls the same decision function on the nine follow-up pairs, so the measurement reads the guard that ships.

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
Pure decision, thin wiring. The design is research section 3 to 8 with the corrections in `spec.md`.

### Key Components
- **Flag pass-through**: an optional `confidenceFloored: z.literal(true)` on `AdvisorRecommendationSchema` (`runtime/schemas/advisor-tool-schemas.ts:331`). `publicRecommendation` copies it when true (`runtime/handlers/advisor-recommend.ts:286`). `AdvisorRecommendation` carries it (`runtime/lib/subprocess.ts:39-56`). `recommendationFromCli` keeps it (`hooks/lib/skill-advisor-cli-fallback.ts:379`).
- **`hooks/lib/route-receipt.ts`, new**: a receipt holds `version: 1`, the `sessionId`, the delivered top-1 `skill`, the lifecycle clock's `storeGeneration` and `lifecycleEpoch` at write time and the transcript byte count or `null`. `FileRouteReceiptStore` writes one `<sha256(sessionId)[:16]>.json` per session in `route-receipts/` under `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`, defaulting to `join(tmpdir(), 'speckit-advisor')` like the lifecycle and Vibe stores (`hooks/lib/directive-lifecycle-file-store.ts:46-48`). It writes a `wx` temp file and renames it, keeps at most `MAX_DIRECTIVE_LIFECYCLE_SESSIONS` files by `mtime`, removes temp files older than 5 minutes, refuses a symlinked folder and reads nothing over 4 KiB. `InMemoryRouteReceiptStore` serves tests. `isWeakFollowUp` needs at least one back-reference word from the closed list and at most 3 content words, counted through `promptPolicyTokens`.
- **`decideRouteReceiptGuard`**: returns `suppress` only when all five predicates hold: (a) a receipt whose clock equals the current clock and whose transcript bytes are not above the current ones, (b) the stripped prompt's policy reason is `work_intent_with_meaningful_tokens`, (c) the top-1 is floored, (d) the top-1 differs from the receipt's skill, (e) `isWeakFollowUp`. It checks (b) to (e) first and calls the clock function last. It does no I/O, so the bench calls it with a fixed clock.
- **The shared handler**: after the result build (`hooks/claude/user-prompt-submit.ts:458-470`) and before the metrics spread (`:472-478`), the guard reads the session's receipt and, on `suppress`, swaps in `skippedWeakFollowUpResult()`. The guard reads its policy reason from `shouldFireAdvisor(stripLeadingPastedReply(prompt))`, never from the hook's `skippedResult`, which is computed on raw text (`:457`). After the render (`:480`), an `ok` result with a rendered brief and an unfloored top-1 writes a receipt. The clock comes from `dependencies.directiveLifecycleStore ?? defaultDirectiveLifecycleStore()`, and the store from the new `routeReceiptStore` dependency or `defaultRouteReceiptStore()`. The guard and the write each sit in their own try that keeps the result, so a receipt fault never reaches the outer catch and its timeout fallback.
- **DSH**: `advanceBoundary(sessionId, load)` imports `runtime/dist/hooks/lib/directive-lifecycle.js` and calls `advanceDirectiveLifecycleBoundary(defaultDirectiveLifecycleStore(), sessionId)`, and returns without importing when the id is not a non-empty string. The `agent/created` handler and the clean `compaction/end` branch call it through `core.advanceBoundary`, the second with a `.catch` because that handler is synchronous.
- **The bench**: a new log function beside `logFollowUpRouting` (`runtime/bench/scorer-calibration.bench.ts:216-252`) builds a receipt from each pair's task top only when that top is unfloored, runs the follow-up through `decideRouteReceiptGuard` with a fixed matching clock and prints one `advisor-follow-up-receipts` line with `N`, `H`, `H_after`, the per-pair `taskFloored`, `receiptWritten` and `guard`, and the false-carry result. It adds no assertion.

### Data Flow
Turn one: the CLI result reaches the handler with `confidenceFloored` on each floored recommendation, the brief renders and the handler writes a receipt for the unfloored top skill with the current clock. Turn two: the handler finds that receipt, the follow-up passes the five predicates and the handler renders `Advisor: prompt skipped.` with the directive block. A boundary rotates the clock, so the next follow-up's predicate (a) fails and it delivers. With no receipt, every turn delivers as today.

### Why `C` does not apply
`C` counts corpus rows the prompt-only guard would hide. Corpus rows are scored one at a time with no session, so no receipt exists and every row delivers. The corpus gates still run, as a check that no receipt logic leaks into the scorer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup amends `spec.md` from phase 010's research, confirms 009 and 010 are done, re-reads the hook and records the suite, bench and corpus baselines. Implementation lands each failing test before its fix, in the waves `tasks.md` gives: the receipt tests and the flag pass-through, then the receipt module, then the hook replay and DSH tests, the bench and the Vibe row, then the hook and DSH wiring. Verification runs the typecheck and build, the bench, the corpus gates and the hook, schema and handler suites, and checks the diff and comment hygiene. The ordered work is in `tasks.md`.
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

Trigger: a weak follow-up loses a correct route in use, or a receipt fault changes output with no receipt present. Revert the phase's commit, which removes the receipt module, the guard, the DSH boundary call and the flag pass-through together, then rebuild the runtime. Receipt files left on disk are inert once the code is gone. Delete the `route-receipts/` folder under the state base to clear them.
<!-- /ANCHOR:rollback -->

---
