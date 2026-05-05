---
title: "Tasks: Phase 006 Routing Precision Fixes"
description: "Task ledger for remediating F-001 through F-009 from Phase 005 and validating the Phase 006 mini recheck matrix."
trigger_phrases:
  - "phase 006 tasks"
  - "routing precision tasks"
  - "packet 069 finding remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/006-routing-precision-fixes"
    last_updated_at: "2026-05-05T13:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized finding-level task ledger"
    next_safe_action: "Complete P0 remediation tasks"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Phase 006 Routing Precision Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T-000 Read Phase 005 audit report and P0 evidence YAMLs.
- [x] T-000A Read target router docs, Motion.dev docs/assets, skill graph, and runner scripts before edits.
- [x] T-010 Create Level 2 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T-001 [P0] Fix F-001 RD-002 doc-only markdown routing so `sk-doc` wins over `sk-code`. Static docs/JSON patched; live SQLite still routes `sk-code` first.
- [x] T-002 [P0] Fix F-002 CS-002 explicit non-Webflow guard so Motion.dev cross-stack prompts stay UNKNOWN/N/A, not WEBFLOW.
- [x] T-003 [P1] Fix F-003 CS-001 exact Motion.dev quick-start and in-view/snippet contract.
- [x] T-004 [P1] Fix F-004 CS-003 directory placeholder references by tightening exact-file output requirements.
- [x] T-005 [P1] Fix F-005 SD-001 WEBFLOW implementation trio load contract.
- [x] T-006 [P1] Fix F-006 CB-002/SA-001 exact performance and decision-matrix refs.
- [B] T-007 [P1] Fix F-007 LS-001 advisor weighting for executable `.opencode/` code edits. Static JSON patched; live SQLite still ranks `system-spec-kit` first.
- [x] T-008 [P1] Fix F-008 CS-004/CS-005 Motion.dev contract regression examples.
- [x] T-009 [P2] Fix F-009 runner YAML extraction quality flags and placeholder rejection.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-010 Update parent `spec.md` Phase Documentation Map with Phase 006.
- [x] T-011 Verify parent `graph-metadata.json` includes Phase 006 child id.
- [x] T-012 Run RD-002, CS-002, and LS-001 mini rechecks through `run_codex.sh`.
- [x] T-013 Copy recheck result YAMLs into `spot-recheck-results/` and assign PASS/PARTIAL/FAIL rationale.
- [x] T-014 Write `implementation-summary.md` with per-finding status, changed files, verification commands, and recommendation mapping.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Final Checks

- [x] T-020 Run Phase 006 strict validation.
- [x] T-021 Run parent Packet 069 strict validation.
- [x] T-022 Parse `skill-graph.json` with Python JSON loader.
- [x] T-023 Confirm `spot-recheck-results/` contains 3 YAML files.
- [x] T-024 Mark checklist items with evidence.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All finding tasks T-001 through T-009 are marked `[x]` or documented as partial/deferred.
- [x] No `[B]` blocked tasks remain without an implementation-summary explanation.
- [x] Required validation commands and recheck outcomes are recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Audit Report**: See `../005-playbook-cross-cli-execution/playbook-execution-report.md`
<!-- /ANCHOR:cross-refs -->
