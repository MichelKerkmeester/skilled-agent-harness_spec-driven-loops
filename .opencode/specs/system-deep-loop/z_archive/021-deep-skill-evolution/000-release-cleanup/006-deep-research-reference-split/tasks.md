---
title: "Tasks: deep-research reference split and router alignment"
description: "Task ledger for splitting deep-research convergence/state references and aligning the smart router with sk-doc standards."
trigger_phrases:
  - "deep-research reference split tasks"
  - "deep-research router alignment tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/002-deep-research/001-reference-split"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "tasks-complete"
    next_safe_action: "optional-commit"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000012014"
      session_id: "131-000-012-reference-split"
      parent_session_id: "131-000-012-reference-split"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: deep-research reference split and router alignment

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Author `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Slim `references/convergence.md` into the live convergence hub.
- [x] T011 Add focused convergence references for signals, recovery, graph gates, and reference-only material.
- [x] T012 Slim `references/state_format.md` into the state packet hub.
- [x] T013 Add focused state references for JSONL, outputs, and reducer/registry details.
- [x] T014 Replace deep-review bulk in deep-research references with sibling-skill links.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Align `SKILL.md` smart router with sk-doc resilience mechanics.
- [x] T021 Move the `Task`/LEAF frontmatter comment out of YAML frontmatter.
- [x] T022 Update `README.md` structure and related-doc tables.
- [x] T023 Update `quick_reference.md` only for navigation/stale-link cleanup.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## PHASE 4: EVIDENCE

- [x] T030 Run `extract_structure.py` on SKILL, README, and changed/new references.
- [x] T031 Run `validate_document.py --blocking-only` on SKILL, README, and changed/new references.
- [x] T032 Run `quick_validate.py .opencode/skills/deep-research --json`.
- [x] T033 Run grep checks for stale weights, monolith-only refs, and deep-review bulk sections.
- [x] T034 Run strict spec validation.
- [x] T035 Fill implementation summary and checklist evidence.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Reference hubs are slim and focused references exist.
- [x] `SKILL.md` router follows sk-doc resilient-router standards.
- [x] No stale research convergence weights remain.
- [x] Verification evidence is recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Target Skill**: `.opencode/skills/deep-research/`
<!-- /ANCHOR:cross-refs -->
