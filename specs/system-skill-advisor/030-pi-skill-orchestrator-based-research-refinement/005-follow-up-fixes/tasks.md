---
title: "Tasks: Follow-up Fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "follow-up fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Follow-up Fixes

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baseline pass counts for the deep-loop workflow tests, the Pi extension's tests and typecheck, the advisor runtime suite and the plugin `.cjs` suite. Evidence: the twelve deep-loop files that read the research and review workflows or their contracts, 322 of 322; Pi extension `npm test` 114 of 114 and typecheck exit 0; advisor runtime 947 passed, 1 failed, 6 skipped of 954, the one failure being the routing-divergence ratchet that failed at every earlier baseline; plugin `.cjs` 29 of 29.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Require the root dashboard only without lineage logs in both review workflows, with fan-out and no-lineage tests, and regenerate the review contract (`.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, `compiled/deep-review.contract.md`, `run-now-yaml-control.vitest.ts`). Evidence: Luna wrote the two review cases and saw the fan-out case fail on the unchanged workflow (`synthesis_incomplete`), then stopped when its patch tool could not match the workflow's context. The orchestrator applied the change to both workflows, confined to `step_convergence_report`: a `lineageStateLogs` helper mirroring the research one with `deep-review-state.jsonl`, `artifactDir` in `paths`, and the conditional dashboard entry. The three named test files pass 53 of 53, `check-contract-drift.cjs` prints `OK commands=3`, and reverting the auto workflow fails only the fan-out review case.
- [x] T003 [P] Refuse a trailing-newline count with a message that names the final empty line, and say in the `line_count` description and one guideline that the line counts (`.pi/extensions/pi-cache-optimizer/index.ts`, `tests/hash-verified-edits.test.ts`, `README.md`). Evidence: `validateEdits` returns the trailing-newline refusal when the claim is one short and the last split element is empty, and keeps refusing; the `line_count` description, one prompt guideline and the README say the final empty line counts. `npm test` 116 of 116 (baseline 114 plus two), typecheck exit 0; reverting `index.ts` fails only the new trailing-newline case.
- [x] T004 Decide transform dedup on the full advisor block before lifecycle reduction, add the same-message test, and remove the lifecycle kill switch from the same-message suppression test (`.skilled/plugins/system-skill-advisor.js`, `runtime/tests/system-skill-advisor-plugin.vitest.ts`, `.skilled/plugins/tests/system-skill-advisor.test.cjs`). Evidence: the transform decision now hashes the full block, and lifecycle reduction runs only for a block that will be delivered, so a suppressed duplicate leaves lifecycle state alone. A first run of the brief halted on LOGIC-SYNC: three of the four isolated tests expect a full second delivery that lifecycle dedup correctly reduces, so only the same-message suppression test lost its kill switch and the other three gained a comment giving the reason. The orchestrator restored the durable comment on identity-gated reduction that the edit had dropped. Plugin `.cjs` 29 of 29, plugin vitest 65 of 65; reverting the plugin fails the new vitest case and one `.cjs` test. Built through Pi with `edit_lines` enabled: its first call passed 931 for a 932-line count, got the new trailing-newline refusal, retried with 932 and succeeded, and three more `edit_lines` calls succeeded.
- [x] T005 Rebuild the trigger index from an export of committed content (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/`). Evidence: `git archive HEAD` of the markdown corpus into scratch, with this packet's documents laid over it from the working tree because they land in the same commit as the index, then `generate-trigger-index.mjs --repo-root <export>` writing the repository's index, manifest, diagnostics and variants files. A working-tree build would have indexed another session's untracked folders, among them `specs/cli-orca/002-consolidate-official-orca-skills`; the export's added paths are this packet's documents and content other sessions had already committed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Revert each source change and show its new test failing, then restore it. Evidence: the auto review workflow reverted fails only the fan-out review case (1 failed, 10 passed in that file); `index.ts` reverted fails only the trailing-newline case (115 of 116); the plugin reverted fails the new vitest repeat case and one `.cjs` test. Each source was restored and its diff checked.
- [x] T007 Rerun every suite from T001 and report the delta, plus `check-contract-drift.cjs`. Evidence: deep-loop 324 of 324 (+2); Pi extension 116 of 116 (+2) and typecheck exit 0; plugin `.cjs` 29 of 29 (same count, one test now runs with lifecycle dedup on); advisor runtime 947 passed, 2 failed, 6 skipped of 955 (+1 test): the ratchet as at baseline, plus a freshness benchmark's timing assertion that passed 12 of 12 twice when rerun alone; drift check `OK commands=3`.
- [x] T008 Run the Gate 1 lookup for "pi skill orchestrator research" and confirm it returns this packet. Evidence: against the rebuilt index the top results are exact matches on `001-deep-research/spec.md` and the parent `spec.md`, then 0.94 phrase containment on the 001 plan, tasks and summary; the index it replaces returned only unrelated partial matches at score 0.
- [x] T009 Run `validate.sh --strict --recursive` on the packet and require `RESULT: PASSED`. Evidence: all seven folders `RESULT: PASSED` with 0 errors; the one warning is SPEC_DOC_SUFFICIENCY on 006's implementation summary, which is written when the review closes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
