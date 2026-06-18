---
title: "Tasks: Public Root README"
description: "Planned task outline for Public Root README."
trigger_phrases:
  - "public root readme tasks"
  - "027 release cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/001-public-root-readme"
    last_updated_at: "2026-06-10T16:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Rewrote the public root README to current framework state and reconciled phase evidence"
    next_safe_action: "Monitor README drift"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:67a618d91957ff4c7a0fce33d104f4ebba1dd63cd494ef2d25547ab73c042d63"
      session_id: "2026-06-10-001-public-root-readme-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator pre-approved this release-cleanup phase and scope."
---
# Tasks: Public Root README

<!-- SPECKIT_LEVEL: 1 -->
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
## PHASE 1: SETUP

- [x] T001 Inventory current claims (README.md) Evidence: read existing root README and identified stale 22-skill, 11-agent, 24-command, old external-integration, packet-specific, and schema/runtime sections.
- [x] T002 List claims about schema, flags, CLI, constitutional rules, memory features, and doctrine (README.md) Evidence: checked timeline, changelog index, AGENTS.md, system-spec-kit SKILL.md, ENV_REFERENCE, opencode.json, skill index, command tree, and agent rosters.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Align stale schema and flag references (README.md) Evidence: README now states schema v37 and lists default-off or shadow-first hardening flags from ENV_REFERENCE.
- [x] T004 [P] Align CLI front-door and memory-feature references (README.md) Evidence: README now distinguishes five MCP servers from three additive daemon-backed CLIs and documents 37/8/9 surfaces.
- [x] T005 [P] Align constitutional-rule and doctrine references (README.md) Evidence: README now points to AGENTS.md and avoids stale release-packet-specific doctrine links.
- [x] T006 Preserve ownership boundary: Capstone phase; verify after the other outward surfaces settle. (README.md) Evidence: only the public root README and this phase folder were edited by this lane.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T007 Run strict validation for this child phase (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) Evidence: final strict validation run recorded exit 0.
- [x] T008 Record evidence in implementation-summary.md (implementation-summary.md) Evidence: implementation-summary.md lists README changes and spot-check evidence.
- [x] T009 Confirm no out-of-scope source, command, agent, skill, or YAML edits were made (git diff) Evidence: this lane's edited files are README.md plus this phase's spec docs and metadata only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval
- [x] No blocked tasks remain
- [x] Strict validation passes for this child phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
