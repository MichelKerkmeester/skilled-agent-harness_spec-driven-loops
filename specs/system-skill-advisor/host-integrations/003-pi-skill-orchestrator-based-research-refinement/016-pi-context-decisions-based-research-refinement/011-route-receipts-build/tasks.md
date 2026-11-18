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

`A` is `.skilled/skills/system-skill-advisor/`. `HOOKS` is `npx vitest run tests/hooks tests/schemas tests/handlers`, run from `A/runtime/`. `BENCH` is `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose`, run from `A/runtime/`. `GATES` is `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts`, run from `A/runtime/`.

**Who does what.** Tasks marked `Luna leaf` go to a GPT-6 Luna `xhigh` `fast` leaf through cli-codex, one change per brief, with the DeepSeek Vibe fallback, per `../delegation-strategy.md`. Every other task is a conductor task: amending this spec, reading diffs, typecheck, build, every test and bench run, comment hygiene, the summary and strict validation. A leaf cannot run tsx, vitest, the typecheck or the build in its sandbox.

**Provisional until T001 runs.** The file names and the name `decideRouteReceipt` below follow the provisional design. T001 replaces them with phase 010's design, and the conductor pastes the final names into every brief.

Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Amend the Files to Change table and the REQ rows from phase 010's synthesis: copy the frozen success threshold, the false-carry prompt pair, the expiry rule, the store and the runtime reach, and drop the provisional banners. Amend `goal.md` criteria and the task names below to match (`spec.md`, `goal.md`, `tasks.md`). Verify: `rg -n 'Provisional until 010 closes' spec.md` prints nothing, and every file `../010-route-receipts-research/research/research.md` names for this phase appears in the table.
- [ ] T002 Confirm phases 009 and 010 are done and 010 took the over-suppresses branch (`../009-crash-fallback-edge-cases/tasks.md`, `../010-route-receipts-research/implementation-summary.md`). Verify: `grep -c '^- \[ \] T[0-9]' ../009-crash-fallback-edge-cases/tasks.md ../010-route-receipts-research/tasks.md` prints `:0` for both files, and `rg -n 'Q0 branch' ../010-route-receipts-research/implementation-summary.md` names over-suppresses.
- [ ] T003 Re-read the hook after phase 009 and fix the line numbers every brief will cite (`A/hooks/claude/user-prompt-submit.ts`). Verify: `rg -n 'renderBrief\(result|skippedAdvisorResultFor\(prompt\)|directiveLifecycleStore\?' A/hooks/claude/user-prompt-submit.ts` prints three lines, and each brief cites those numbers.
- [ ] T004 Record the baselines (`A/runtime/`). Verify: `HOOKS` exits 0 with its pass count, `BENCH` exits 0 with its `collateral` value and `GATES` exits 0 with its pass count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Wave 1, four Luna leaves in parallel on disjoint files.

- [ ] T005 [P] Luna leaf. Add the failing receipt tests: the pair-1 shape, where an `sk-doc` receipt and a floored work-intent `sk-code` follow-up is not kept as routed. The false-carry case from the amended REQ-002 keeps `sk-code`. A receipt is not used after a lifecycle boundary, after the transcript shrinks or past its age limit. A missing receipt always keeps (`A/runtime/tests/hooks/route-receipt.vitest.ts`). Verify: the conductor runs `npx vitest run tests/hooks/route-receipt.vitest.ts` and it fails because `hooks/lib/route-receipt.ts` does not exist.
- [ ] T006 [P] Luna leaf. Add the failing mapper assertion: a CLI row with `confidenceFloored: true` keeps the flag, shaped like the existing `needsMode` case (`A/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`). Verify: the conductor runs `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` and only the new case fails, because `recommendationFromCli` drops the flag.
- [ ] T007 [P] Luna leaf. Add optional `confidenceFloored: z.literal(true)` to `AdvisorRecommendationSchema`, beside `needsMode` (`A/runtime/schemas/advisor-tool-schemas.ts`). Verify: `npm --prefix A/runtime run typecheck` exits 0.
- [ ] T008 [P] Luna leaf. Copy the flag in `publicRecommendation` when it is true, beside `heldBelow` (`A/runtime/handlers/advisor-recommend.ts`). Verify: `npm --prefix A/runtime run typecheck` exits 0.

Wave 2, after the conductor confirms T005 and T006 fail for the right reason.

- [ ] T009 [P] Luna leaf. Carry the flag on `AdvisorRecommendation` and keep it in `recommendationFromCli` beside `heldBelow`, one coupled pair (`A/runtime/lib/subprocess.ts`, `A/hooks/lib/skill-advisor-cli-fallback.ts`). Verify: `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` exits 0.
- [ ] T010 [P] Luna leaf. Create the receipt module: the receipt type, the in-memory store, the file store with temp-file-and-rename writes and a 64-session bound plus the pure `decideRouteReceipt` (`A/hooks/lib/route-receipt.ts`). Verify: `npx vitest run tests/hooks/route-receipt.vitest.ts` exits 0.
- [ ] T011 [P] Luna leaf, only if the amended design suppresses. Export one helper that builds the skipped result through the private `result` builder with status `skipped` and freshness `unavailable` (`A/runtime/lib/skill-advisor-brief.ts`). Verify: `npm --prefix A/runtime run typecheck` exits 0. On a reuse design, mark it `[x]` with "not built, design reuses the route".

Wave 3, the failing hook test before the hook edit.

- [ ] T012 Luna leaf. Add the failing hook replay: a task then its follow-up on one session id with an in-memory receipt store, pair 9's pasted form deciding the same as pair 1 and the no-receipt case returning today's output (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: the conductor runs `HOOKS` and only the new replay cases fail, because the handler ignores receipts. The no-receipt case passes.
- [ ] T013 Luna leaf. Wire the receipt into the handler: the optional store dependency, the read and the decision before `renderBrief`, the policy reason from `shouldFireAdvisor(stripLeadingPastedReply(prompt))` and the write after a confident route, each in its own try (`A/hooks/claude/user-prompt-submit.ts`). Verify: `HOOKS` exits 0.
- [ ] T014 [P] Luna leaf. Pass `session_id: sessionIdFromContext(ctx)` in the Pi handler input, and assert it in the Pi test, one coupled pair (`A/hooks/pi/prompt-advisor.ts`, `A/runtime/tests/hooks/prompt-advisor.vitest.ts`). Verify: `npx vitest run tests/hooks/prompt-advisor.vitest.ts` exits 0, and the new assertion failed before the adapter edit.
- [ ] T015 [P] Luna leaf. Add the receipt measurement beside `logFollowUpRouting`: score each pair's task, build an in-memory receipt from its top-1, run the follow-up through `decideRouteReceipt`, add the false-carry pair and print one `advisor-follow-up-receipts` line. No new assertion (`A/runtime/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and prints that line with `N`, `H`, a decision per pair and the false-carry result.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run the typecheck and the build, then probe the public flag from a daemon started after the build (`A/runtime/`). Verify: `npm --prefix A/runtime run typecheck` and `npm --prefix A/runtime run build` both exit 0, and `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt 'fix that too' --format json` shows `"confidenceFloored": true` on the floored recommendations.
- [ ] T017 Read the receipt line against the frozen threshold (`A/runtime/bench/scorer-calibration.bench.ts`). Verify: `BENCH` prints `advisor-follow-up-receipts` with `H` at or under the amended REQ-001 threshold, pairs 7 and 8 kept, controls 2 and 4 unchanged and the false-carry pair kept.
- [ ] T018 Confirm 0 changes on the routing corpus (`A/runtime/scripts/routing-accuracy/`, `A/runtime/bench/scorer-calibration-baseline.json`). Verify: `GATES` exits 0, `git diff --stat -- A/runtime/scripts/routing-accuracy A/runtime/bench/scorer-calibration-baseline.json` prints nothing and `collateral` equals T004's value.
- [ ] T019 Run the full hook, schema and handler gate (`A/runtime/tests/`). Verify: `HOOKS` exits 0, with the pass count above T004's by the new tests only.
- [ ] T020 Confirm the diff holds only the amended Files to Change (`git`). Verify: `git diff --stat` lists those files and nothing else from this phase.
- [ ] T021 Check comment hygiene in the changed code (`A/hooks/`, `A/runtime/`). Verify: `git diff -U0 -- A | rg -n '^\+.*(N4|016-|phase 0|phase 1[01]|REQ-)'` prints nothing.
- [ ] T022 Record the files, the receipt line, the test results and a read-only Luna refutation pass (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with T011 noted as not built on a reuse design
- [ ] No `[B]` blocked tasks remaining
- [ ] `HOOKS`, `BENCH` and `GATES` exit 0 from the final state, and the receipt line meets the frozen threshold
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../010-route-receipts-research/research/research.md`, which T001 applies
- **Delegation**: See `../delegation-strategy.md` for the brief rules and the fallback
<!-- /ANCHOR:cross-refs -->

---
