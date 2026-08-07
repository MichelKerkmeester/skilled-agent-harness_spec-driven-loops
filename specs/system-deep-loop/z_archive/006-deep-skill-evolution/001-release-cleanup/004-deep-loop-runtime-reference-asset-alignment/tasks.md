---
title: "Tasks: Deep Skills Reference And Asset Alignment"
description: "Task breakdown for Level 3 deep skill reference and asset alignment."
trigger_phrases:
  - "deep skills alignment tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/004-deep-loop-runtime-reference-asset-alignment"
    last_updated_at: "2026-05-24T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "tasks-updated-through-phase-8"
    next_safe_action: "await-human-approval-for-phase-9"
    blockers:
      - "Phase 9 requires human approval."
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000013015"
      session_id: "131-000-013-deep-skills-reference-asset-alignment"
      parent_session_id: "131-000-013-deep-skills-reference-asset-alignment"
    completion_pct: 89
    open_questions:
      - "Approve Phase 9?"
    answered_questions: []
---

# Tasks: Deep Skills Reference And Asset Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1]

- [x] T001 Create phase folder (`013-deep-skills-reference-asset-alignment`) [10m]
- [x] T002 Replace scaffold spec docs with Level 3 content (`spec.md`, `plan.md`) [45m]
- [x] T003 Add schemas and RCAF prompt templates (`schemas/`, `prompts/`) [45m]
- [x] T004 Create resource-map and audit report shells (`resource-map.yaml`, `audit-findings.jsonl`) [45m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Milestone M2]

- [x] T010 Inventory scoped deep skill artifacts (`deep-ai-council`, `deep-research`, `deep-review`) [30m] {deps: T001}
- [x] T011 Add council quick reference and loop protocol (`deep-ai-council/references/`) [45m] {deps: T010}
- [x] T012 Add council config, strategy, dashboard, prompt-pack, and capability assets (`deep-ai-council/assets/`) [60m] {deps: T010}
- [x] T013 Add review convergence/state focused references (`deep-review/references/`) [45m] {deps: T010}
- [x] T014 Update council SKILL/README/router/version (`deep-ai-council`) [45m] {deps: T011,T012}
- [x] T015 Update review SKILL/README/router/version (`deep-review`) [30m] {deps: T013}
- [x] T016 Update research SKILL/README/version note (`deep-research`) [20m] {deps: T010}
- [x] T017 Add changelog entries for all touched skills (`changelog/`) [30m] {deps: T014,T015,T016}
- [x] T018 Update parent phase graph metadata (`000-release-cleanup/graph-metadata.json`) [10m] {deps: T001}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Milestone M3]

- [x] T030 Run sk-doc quick validation for all three skills [15m] {deps: T017}
- [x] T031 Run sk-doc document validation for changed markdown [20m] {deps: T017}
- [x] T032 Run structure extraction for rewritten READMEs and new major docs [15m] {deps: T017}
- [x] T033 Run JSON/YAML parse checks for schemas, assets, and resource map [10m] {deps: T003,T012}
- [x] T034 Run link/resource-map path sweep [15m] {deps: T014,T015,T016}
- [x] T035 Run strict spec validation [15m] {deps: T002}
- [x] T036 Run skill advisor threshold checks [15m] {deps: T014,T015,T016}
- [x] T037 Update validation report/checklist/summary with command evidence [20m] {deps: T030,T031,T032,T033,T034,T035,T036}
- [B] T090 Obtain human approval for Phase 9 [blocked]
- [ ] T091 Run 10 deep-research iterations after approval [blocked: T090]
- [ ] T092 Merge converged missing logic into `resource-map.yaml` after approval [blocked: T091]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 8 validation tasks complete with evidence.
- [x] P0/P1 validation failures are fixed or explicitly deferred by user approval.
- [x] Phase 9 is blocked until human approval.
- [ ] Phase 9 iteration outputs exist only after approval.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Resource Map**: `resource-map.yaml`
- **Validation**: `validation-report.md`
<!-- /ANCHOR:cross-refs -->
