---
title: "Tasks: Phase 22: review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal plugin review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/022-review-remediation"
    last_updated_at: "2026-07-04T08:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored tasks from spec and plan"
    next_safe_action: "Dispatch implementation to cli-opencode executor"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-022-review-remediation-20260704"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 22: review-remediation

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

- [x] T001 Run `node --test .opencode/plugins/tests/*.test.cjs` fresh; paste the baseline pass/fail counts. Evidence: baseline command returned `# tests 103`, `# pass 103`, `# fail 0`, duration `2162.635667ms`.
- [x] T002 Inventory every `archiveGoalStateFile` call site via `rg -n "archiveGoalStateFile" .opencode/plugins/`; classify each as sweep-initiated or explicit (session.deleted, clear); paste the classification. Evidence: `.opencode/plugins/mk-goal.js:1205` definition; `.opencode/plugins/mk-goal.js:1254` sweep-initiated archive; `.opencode/plugins/mk-goal.js:2575` explicit `session.deleted` archive. `clearGoal` deletes through `deleteGoalFile`, not `archiveGoalStateFile`, so it remains unconditional and unaffected.
- [x] T003 Re-verify the status-drift set: grep the `| **Status** |` row from every phase folder's spec.md and implementation-summary.md; paste the disagreement list (expected at authoring: 009-speckit-command-goal-prompt-offer, 012, 015, 016, 017, 018, 019, 021; verify 020 by reading its implementation-summary content). Evidence: live scan found child `spec.md` Planned/Draft versus implementation-summary Complete for 009, 012, 015, 016, 017, 018, 019, 021; 020 `implementation-summary.md` has no Status row but documents shipped completion with baseline `85/85` and final `93/93`, so 020 was included in the flip set.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [REQ-001] Write the deterministic interleaving regression test in `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` (deferred-mutator queue hold -> sweep read -> fresh goal write -> queued archive); run against CURRENT code and paste the RED failure output. Evidence RED: `node --test .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` failed at `orphan sweep does not archive a goal refreshed after the stale read` with `Expected values to be strictly equal: + undefined - 'active'`, `# pass 27`, `# fail 1`.
- [x] T005 [REQ-001] Implement sweep-only in-queue staleness re-validation (`archiveGoalStateFile` option/predicate or dedicated sweep-archive wrapper) in `.opencode/plugins/mk-goal.js`; explicit archives stay unconditional; paste the GREEN run of T004's test. Evidence GREEN: same command passed with `# tests 28`, `# pass 28`, `# fail 0`, duration `1141.806792ms`.
- [x] T006 [REQ-002] Flip spec.md Status rows to Complete for every phase T003 confirmed drifted (after reading each implementation-summary to confirm real shipped work); list any phase left unflipped with the reason. Evidence: flipped 009, 012, 015, 016, 017, 018, 019, 020, 021; no confirmed completed phase was left unflipped.
- [x] T007 [REQ-002] Update the parent `../spec.md` phase-map rows to match the flipped child statuses. Evidence: parent phase-map rows 009 and 015-022 now read Complete, and row 022 was added for this phase.
- [x] T008 [P] [REQ-003] Refresh `../scratch/2026-07-03-four-reviewer-audit-findings.md`: add a dated refresh note; mark F4, F5, DOC-2, e-2.2 RESOLVED with current file:line evidence verified against live code. Evidence: dossier grep returns `Refresh note 2026-07-04` plus RESOLVED markers for F4, F5, clock unification, and DOC-2.
- [x] T009 [P] [REQ-004] Correct parent `../spec.md` narrative: replace the "6-file" suite claim with the fresh actual count, replace "16-seam" with the current `__test` seam count (17 at authoring), remove the "(not cited)" annotation on the phase 010 handoff row. Evidence: read-only Node checks report `plugin test files: 10 total; goal test files: 8` and `__test seam count: 17`; parent-only retired-claim check reports `parent retired claims: none`.
- [x] T010 [P] [REQ-005] Add a `speckit-goal-offer-contract.test.cjs` row to BOTH feature catalogs and make the two `mk-goal-state.test.cjs` description cells string-identical (`.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md`). Evidence: both catalogs now include `speckit-goal-offer-contract.test.cjs`; both `mk-goal-state.test.cjs` rows use `State persistence, generated prompt fields, injection, caps, sanitization, redaction, and status output.`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Fresh full-suite run; paste output; confirm zero regressions vs T001 baseline plus the new passing test. Evidence: final command returned `# tests 104`, `# pass 104`, `# fail 0`, duration `2339.65675ms`; delta vs T001 is +1 passing regression test and 0 new failures.
- [x] T012 Re-run the T003 status-drift grep; paste the zero-disagreement result. Evidence: final phase scan reports no spec-vs-implementation-summary Status disagreements for phases with both rows; 020 has no implementation-summary Status row, but its summary documents completed shipped work and its spec is now Complete.
- [x] T013 Grep the parent spec for retired claims ("6-file", "16-seam", "(not cited)"); paste the empty result. Grep both catalogs for the added test filename; paste the matching rows. Evidence: parent-only check reports `parent retired claims: none`; catalog greps return `speckit-goal-offer-contract.test.cjs` in both feature catalogs.
- [x] T014 `node --check .opencode/plugins/mk-goal.js` and the touched test file; run comment-hygiene and alignment-drift checks on `mk-goal.js`; paste results. Evidence: `node --check .opencode/plugins/mk-goal.js`, `node --check .opencode/plugins/tests/mk-goal-lifecycle.test.cjs`, and `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js` produced no output; alignment drift reported PASS, scanned files 18, findings 0, errors 0, warnings 0, violations 0.
- [x] T015 Write `implementation-summary.md` with evidence; set THIS phase's spec.md Status row to Complete. Evidence: this closeout patch created `implementation-summary.md` and flipped `spec.md` Status to Complete. Pre-summary validation reported Errors: 0 and the known benign ANCHORS_VALID warning. Post-summary validation reported the same ANCHORS_VALID warning plus `GENERATED_METADATA_INTEGRITY` source-fingerprint drift in `graph-metadata.json`, which is generated metadata outside this dispatch's allowed write paths by design.
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
- **Finding source**: `../review/review-report.md` section 10 (orchestrator adjudication)
<!-- /ANCHOR:cross-refs -->
