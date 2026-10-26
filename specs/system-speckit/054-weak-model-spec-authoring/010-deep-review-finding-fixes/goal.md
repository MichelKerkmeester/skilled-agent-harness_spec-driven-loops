---
title: "Goal: Phase 10: deep-review-finding-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep review finding fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes"
    last_updated_at: "2026-10-25T20:45:00Z"
    last_updated_by: "conductor"
    recent_action: "Closed the phase"
    next_safe_action: "None; the speed loop ran on 2026-10-26"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-010-deep-review-finding-fixes-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: deep-review-finding-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every finding the 2026-10-25 deep review of packet 054 recorded, each with a fix at its source and a check that failed before the fix, without changing the verdict of any existing packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A new or changed gate applies only to docs stamped v2.3 or later, so no v2.2 or external packet gets a new failure. |
| D2 | Every fix is proved by a check that fails before the fix and passes after it. A fix without that check is not done. |
| D3 | A P2 is fixed only after it reproduces on the current tree. One that does not reproduce is recorded as not reproduced, with the check that showed it. |
| D4 | Three lanes run in parallel and each file belongs to one lane: gate code, guidance and guards, and playbook, records and review tooling. |
| D5 | A closed phase's record is corrected by a dated note beside the original, never by rewriting what it recorded about its run. |
| D6 | Work commits on `worktrees/217-weak-model-spec-authoring` and is not pushed until the operator says so. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] In a sandbox copy, `create.sh --track ../../escaped` exits non-zero and creates nothing outside `specs/`, and `--track demo` still creates `specs/demo/001-probe`
- [x] `placeholder-token-gate.vitest.ts` passes with mixed-line, fenced, indented-fence and legacy-token cells, and `spec/check-placeholders.sh` prints `"placeholders":0` on packet 054 and `"placeholders":1` on a folder whose only line holds one unfilled v2.3 value token
- [x] Strict validation fails a v2.3 fixture with its required `requirements` section removed, and recursive strict validation over `specs/` gives the same pass and fail counts before and after this phase
- [x] `rg -l spec-authoring-card .skilled/commands/speckit/` lists the plan and implement assets, each example `tasks.md` has as many `Verify:` clauses as task lines, no system-spec-kit doc teaches `[PLACEHOLDER]` and scenario 483 runs `git status --porcelain` before its cleanup
- [x] `scratch/p2-ledger.md` gives every P2 entry the outcome Fixed or Not reproduced with its evidence, and the three tooling-gap tests pass
- [x] `check-example-drift.sh` and `check-card-sync.sh` exit 0, `validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`, and the closing reviews by cli-devin and then cli-codex luna report no P0 or P1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | In Progress | `create.sh --phase --parent` scaffolded this folder on 2026-10-25, then `spec.md` and `acceptance-criteria.md` were written |
| Continuity set without the writer | Deviation | 2026-10-25: generate-context.js --full-auto on the phase parent refreshed only derived metadata and left spec.md continuity unchanged, and it has no path to closed-phase AC or goal frontmatter, so the conductor set the five continuity fields in eight docs directly (ADR-005 named the writer) |

### Deviations and findings

| Item | Note |
|------|------|
| P1-05 placement | The review hand-back recommended a separate validator packet for the required-section check. It moved into this phase because parent decision D2 already limits a new gate to v2.3 docs, which removes the repo-wide risk that recommendation cited. |
<!-- /ANCHOR:log -->
