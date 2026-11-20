---
title: "Tasks: Route Receipts Build"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "route receipts build tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Route Receipts Build

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`A` is `.skilled/skills/system-skill-advisor/`. `HOOKS` is `npx vitest run tests/hooks tests/schemas tests/handlers`, run from `A/runtime/`. `BENCH` is `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose`, run from `A/runtime/`. `GATES` is `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts`, run from `A/runtime/`. `DSH` is `node --test hooks/tests/dsh-prompt-advisor.test.mjs`, run from `A` after a build.

**Who does what.** Tasks marked `Luna leaf` go to a GPT-6 Luna `xhigh` `fast` leaf through cli-codex, one change per brief, with the DeepSeek Vibe fallback, per `../delegation-strategy.md`. Every other task is a conductor task: amending this spec, reading diffs, typecheck, build, every test and bench run, comment hygiene, the summary and strict validation. A leaf cannot run tsx, vitest, the typecheck or the build in its sandbox.

**Frozen names.** Every brief uses these: `RouteReceipt`, `RouteReceiptStore`, `InMemoryRouteReceiptStore`, `FileRouteReceiptStore`, `defaultRouteReceiptStore`, `isWeakFollowUp`, `decideRouteReceiptGuard`, `RouteReceiptGuardInput`, `promptPolicyTokens`, `skippedWeakFollowUpResult`, the policy reason `weak_follow_up_receipt`, the hook dependency `routeReceiptStore`, the DSH export `advanceBoundary` and the bench line `advisor-follow-up-receipts` with key `H_after`.

Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Amend the Files to Change table and the REQ rows from phase 010's synthesis, with the design corrections, and amend `goal.md` criteria and these task names to match (`spec.md`, `goal.md`, `tasks.md`). Verify: `rg -n 'Provisional until 010 closes' spec.md` prints nothing, and every file research section 8 names for this phase appears in the table or under a dropped row with its reason.
- [x] T002 Confirm phases 009 and 010 are done and 010 took the over-suppresses branch (`../009-crash-fallback-edge-cases/tasks.md`, `../010-route-receipts-research/implementation-summary.md`). Verify: `grep -c '^- \[ \] T[0-9]' ../009-crash-fallback-edge-cases/tasks.md ../010-route-receipts-research/tasks.md` prints `:0` for both files, and `rg -n 'over-suppresses' ../010-route-receipts-research/implementation-summary.md` prints a line.
- [x] T003 Re-read the hook after phase 009 and fix the line numbers every brief cites (`A/hooks/claude/user-prompt-submit.ts`). Verify: `rg -n 'renderBrief\(result|skippedAdvisorResultFor\(prompt\)|directiveLifecycleStore\?' A/hooks/claude/user-prompt-submit.ts` prints three lines, and each brief cites those numbers.
- [x] T004 Record the baselines and measure the clock spawn (`A/runtime/`). The bound is set here, before the measurement: keep clock-bound expiry when the p95 of 20 sequential `defaultDirectiveLifecycleStore().clock(id)` calls from `dist/` is at most 150 ms; over 150 ms, switch REQ-003 to research section 5's fallback, transcript shrink plus a 30-minute age limit, before any brief goes out. Verify: `HOOKS` exits 0 with its pass count, `BENCH` exits 0 with `collateral` 19, `GATES` exits 0 with its pass count, `npx vitest run tests/hooks tests/parity tests/handlers` exits 0 with its pass count, and the p95 is recorded beside the bound.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Wave 1, five Luna leaves in parallel on disjoint files.

- [x] T005 [P] Luna leaf. Add the failing unit tests: `isWeakFollowUp` on the seven probed prompts, `decideRouteReceiptGuard` on each predicate, the false-carry pair, clock and shrink expiry, and the file store on a `mkdtemp` base (`A/runtime/tests/hooks/route-receipt.vitest.ts`). Verify: the conductor runs `npx vitest run tests/hooks/route-receipt.vitest.ts` and it fails because `hooks/lib/route-receipt.ts` does not exist.
- [x] T006 [P] Luna leaf. Add the failing mapper assertion: a CLI row with `confidenceFloored: true` keeps the flag, shaped like the existing `needsMode` case (`A/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`). Verify: the conductor runs that file and only the new case fails, because `recommendationFromCli` drops the flag.
- [x] T007 [P] Luna leaf. Add optional `confidenceFloored: z.literal(true)` to `AdvisorRecommendationSchema`, beside `needsMode` (`A/runtime/schemas/advisor-tool-schemas.ts`). Verify: `npm --prefix A/runtime run typecheck` exits 0.
- [x] T008 [P] Luna leaf. Copy the flag in `publicRecommendation` when it is true, beside `heldBelow` (`A/runtime/handlers/advisor-recommend.ts`). Verify: `npm --prefix A/runtime run typecheck` exits 0.
- [x] T009 [P] Luna leaf. Export `promptPolicyTokens(prompt)` returning `{ tokens, meaningful, workVerbs }` through the policy's own normalize, tokenize and stop-word filter (`A/runtime/lib/prompt-policy.ts`). Verify: `npm --prefix A/runtime run typecheck` exits 0.

Wave 2, after the conductor confirms T005 and T006 fail for the right reason.

- [x] T010 [P] Luna leaf. Carry the flag on `AdvisorRecommendation` and keep it in `recommendationFromCli` beside `heldBelow`, one coupled pair (`A/runtime/lib/subprocess.ts`, `A/hooks/lib/skill-advisor-cli-fallback.ts`). Verify: `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` exits 0.
- [x] T011 [P] Luna leaf. Create the receipt module with the frozen names (`A/hooks/lib/route-receipt.ts`). Verify: `npx vitest run tests/hooks/route-receipt.vitest.ts` exits 0.
- [x] T012 [P] Luna leaf. Export `skippedWeakFollowUpResult()` through the private `result` builder, status `skipped`, freshness `unavailable`, policy reason `weak_follow_up_receipt` (`A/runtime/lib/skill-advisor-brief.ts`). Verify: `npm --prefix A/runtime run typecheck` exits 0.

Wave 3, the failing tests before their fixes, plus the bench and the Vibe row.

- [x] T013 [P] Luna leaf. Add the failing hook replay: task then follow-up on one session id with `InMemoryRouteReceiptStore` and `InMemoryDirectiveLifecycleStore`, pair 9's pasted form, the false carry, epoch and shrink expiry, and the no-session, empty-store and throwing-store cases (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: the conductor runs that file and only the suppress cases fail, because the handler ignores receipts. The deliver cases pass.
- [x] T014 [P] Luna leaf. Add the DSH boundary tests: `advanceBoundary` called with the id on `agent/created` and a clean `compaction/end`, not called without an id or on a failed compaction, and notices unchanged (`A/hooks/tests/dsh-prompt-advisor.test.mjs`). Verify: the conductor runs `DSH` and only the new boundary cases fail.
- [x] T015 [P] Luna leaf. Add the receipt measurement beside `logFollowUpRouting`: per pair `taskFloored`, `receiptWritten` and `guard` through `decideRouteReceiptGuard` with a fixed matching clock, plus `H_after` and the false-carry result, printed as one `advisor-follow-up-receipts` line. No new assertion (`A/runtime/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and prints that line.
- [x] T016 [P] Luna leaf. Add the Vibe route, guard, guard, route replay (`A/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts`). It characterizes the existing head receipt, so it passes on landing. Verify: the conductor runs that file and it exits 0.

Wave 4, after the conductor confirms T013 and T014 fail for the right reason.

- [x] T017 [P] Luna leaf. Wire the guard and the receipt write into the handler: the `routeReceiptStore` dependency, the guard between the result build and the metrics spread, the write after the render, each in its own try (`A/hooks/claude/user-prompt-submit.ts`). Verify: `HOOKS` exits 0.
- [x] T018 [P] Luna leaf. Add `advanceBoundary` and call it from both boundary handlers through `core.advanceBoundary` (`A/hooks/dsh/prompt-advisor.mjs`). Verify: `DSH` exits 0 after a build.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run the typecheck and the build, then probe the public flag from a daemon started after the build, and on the CLI's local-scorer path (`A/runtime/`). Verify: `npm --prefix A/runtime run typecheck` and `npm --prefix A/runtime run build` both exit 0, and `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt 'fix that too' --format json` shows `"confidenceFloored": true` on the floored recommendations from the daemon. The local-scorer path is recorded as it is: the Python scorer has no floor, so it returns no flag.
- [x] T020 Read the receipt line against the frozen threshold, precondition first (`A/runtime/bench/scorer-calibration.bench.ts`). Verify: `BENCH` prints `advisor-follow-up-receipts` with `receiptWritten` true for pairs 1, 3, 5, 6 and 9, then `"H_after":0`, pairs 7 and 8 and controls 2 and 4 `deliver`, and `falseCarry.guard` `deliver`.
- [x] T021 Run the false-carry negative control: remove predicate (e) from `decideRouteReceiptGuard`, run the unit file, restore it (`A/hooks/lib/route-receipt.ts`). Verify: the false-carry case fails without (e), passes with it, and `git diff` of the module afterwards matches T011's landed text, as amended at T026 (`cmp` against the prepared file).
- [x] T022 Confirm 0 changes on the routing corpus and scorer isolation (`A/runtime/`). Verify: `GATES` exits 0, `git diff --stat -- A/runtime/scripts/routing-accuracy A/runtime/bench/scorer-calibration-baseline.json` prints nothing, `collateral` is 19 and `rg -n 'route-receipt|routeReceipt|weak_follow_up' A/runtime/lib/scorer/` prints nothing.
- [x] T023 Run the full gates against T004's counts (`A/runtime/tests/`). Verify: `HOOKS` and `npx vitest run tests/hooks tests/parity tests/handlers` exit 0, with each pass count above T004's by the new tests only, and `DSH` exits 0.
- [x] T024 Confirm the diff holds only the Files to Change (`git`). Verify: `git diff --stat` lists those files and this phase's docs, nothing else.
- [x] T025 Check comment hygiene in the changed code (`A/hooks/`, `A/runtime/`). Verify: `git diff -U0 -- A | rg -n '^\+.*(N4|016-|phase 0|phase 1[01]|REQ-)'` prints nothing.
- [x] T026 Run one read-only Luna refutation pass over the phase diff and check each finding against the code (`implementation-summary.md`). Verify: every finding is recorded with the conductor's verdict.
- [x] T027 Record the files, the receipt line and the test results (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `HOOKS`, `BENCH`, `GATES` and `DSH` exit 0 from the final state, and the receipt line meets the frozen threshold
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../010-route-receipts-research/research/research.md` sections 3 to 8, applied by T001 with the corrections in `spec.md`
- **Delegation**: See `../delegation-strategy.md` for the brief rules and the fallback
<!-- /ANCHOR:cross-refs -->

---
