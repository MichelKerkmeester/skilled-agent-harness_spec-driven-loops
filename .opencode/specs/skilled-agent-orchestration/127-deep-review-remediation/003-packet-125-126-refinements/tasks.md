---
title: "Tasks: Phase 3: packet-125-126-refinements"
description: "Task list for the 5 WS-B advisory refinements to the 125-cli-external-parent and 126-mcp-tooling-parent planning packets: verify each finding, apply the fix, regenerate metadata, then re-validate both packets."
trigger_phrases:
  - "packet 125 126 refinements tasks"
  - "WS-B refinement tasks"
  - "resolution-based move gate tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/003-packet-125-126-refinements"
    last_updated_at: "2026-07-10T05:15:00Z"
    last_updated_by: "claude"
    recent_action: "All 14 tasks done; both packets validate --strict"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/125-cli-external-parent/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-003-packet-125-126-refinements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: packet-125-126-refinements

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

- [x] T001 Read fix manifest `phase3-packets.md` - 5 refinements (R1-R5) with file:line targets for each.
- [x] T002 Cross-checked R1-R5 against `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/review-report.md` §3 WS-B registry - all 5 confirmed/plausible per the review adjudication (P1×3: R1/R2/R4, P2×2: R3/R5).
- [x] T003 [P] Verified all 5 findings against live files before editing - `126.../005-foldin-clickup-and-figma/spec.md:113` (R1 deferred-drift line), `126.../004-onboard-chrome-devtools/plan.md:85-88` (R2 Key Components), `126.../006-advisor-and-integration/spec.md:72` (R3 Scope Boundary), `125.../003-scaffold-hub/spec.md:104-105,121` (R4 In Scope + Files to Change), `125-cli-external-parent/spec.md:128` (R5 phase map row - found ALREADY carrying partial "(no writes)" text, noted as a Key Decision rather than assumed-implicit).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 R1: Added the ClickUp-drift cutover-visibility gate to `126.../008-cutover-and-rollout/spec.md` - Deliverables bullet at `spec.md:81`, In Scope bullet at `spec.md:109`, new `REQ-004` row at `spec.md:141`.
- [x] T005 R1: Mirrored the cutover-visibility gate in `126.../008-cutover-and-rollout/tasks.md` (new `T007` at `tasks.md:69`, Phase 3 renumbered `T008`-`T010`, Completion Criteria updated at `tasks.md:89`) and `plan.md` (Key Components bullet at `plan.md:90`, Phase 2 bullet at `plan.md:130`).
- [x] T006 R2: Added the resolution-based move gate to `126.../004-onboard-chrome-devtools` - `spec.md` REQ-002 acceptance criteria extended at `spec.md:130`, `plan.md` Key Components bullet at `plan.md:89` + Phase 3 bullet + Testing Strategy row at `plan.md:144`, `tasks.md` new `T010` at `tasks.md:78`.
- [x] T007 R2: Added the matching resolution-based move gate to `126.../005-foldin-clickup-and-figma` (click-up + figma trees) - `spec.md` REQ-002 acceptance criteria extended at `spec.md:134`, `plan.md` Key Components bullet at `plan.md:89` + Phase 3 bullet + Testing Strategy row at `plan.md:145`, `tasks.md` new `T011` at `tasks.md:79`.
- [x] T008 R3: Cross-referenced the ADR-005 carve-out at `126.../006-advisor-and-integration/spec.md:72`'s Scope Boundary sentence - now names "the ADR-005 scoped carve-out permitting a metadata-only reverse-edge repoint" in place, pointing to §3 Out of Scope and REQ-001.
- [x] T009 R4: Stated the "no advisor graph rebuild happens before phase 006" invariant explicitly at `125.../003-scaffold-hub/spec.md:104` (In Scope bullet) and `spec.md:121` (Files to Change row for `graph-metadata.json`).
- [x] T010 R5: Marked phase 001 explicitly read-only in `125-cli-external-parent/spec.md:128`'s PHASE DOCUMENTATION MAP row - changed "Research gate (no writes)" to "**Read-only research gate (no writes)**".
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Synced `_memory.continuity.last_updated_at`/`recent_action` on every edited 125/126 doc (13 files across 6 phase folders), then regenerated metadata for all 5 edited phase folders plus the 125 parent root via `generate-description.js` and `backfill-graph-metadata.js` - all 6 folder pairs reported `"failed": []` and `"drift": []`.
- [x] T012 Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/125-cli-external-parent --recursive --strict` - `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED` across the parent and all 8 phase children.
- [x] T013 Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent --recursive --strict` - `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED` across the parent and all 8 phase children.
- [x] T014 Authored the Level 1 spec-kit docs for this phase (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`) and ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/003-packet-125-126-refinements --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` - Evidence: T001-T014 all checked above.
- [x] No `[B]` blocked tasks remain.
- [x] Both 125 and 126 packets stay `Status: Planned`, and both re-validated `--recursive --strict` 0/0 after all edits - Evidence: T012-T013.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
