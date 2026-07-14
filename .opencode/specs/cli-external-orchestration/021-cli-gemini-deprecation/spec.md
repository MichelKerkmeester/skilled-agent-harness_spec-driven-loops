---
title: "Feature Specification: Gemini Deprecation"
description: "Phase parent for removing the deprecated Gemini surface end-to-end: the checked-in runtime and skill, the command layer, the executor wiring, and the Gemini host-runtime + model surface across the framework."
trigger_phrases:
  - "gemini deprecation"
  - "remove gemini surface"
  - "cli-gemini cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation"
    last_updated_at: "2026-06-08T18:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Gemini eradicated (runtime+model) across phases 001-004"
    next_safe_action: "Concurrent session finishes 2 deferred skill-advisor files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000132"
      session_id: "132-cli-gemini-deprecation-parent"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "Execution order: runtime/skill deletion (001), command-layer cleanup (002), executor-wiring purge (003), runtime+model eradication (004)"
      - "Scope: purge Gemini everywhere outside specs/** incl. host-runtime, model, and changelogs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Gemini Deprecation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Gemini removed everywhere outside `specs/**` — `cli-gemini` executor/skill, command layer, executor wiring, AND the host-runtime + model surface; affected test suites green. Residual: 2 `system-skill-advisor` files are being finished by a concurrent session; user-home `~/.gemini` / `.geminiignore` left by design. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The project no longer supports a Gemini surface, yet active tooling still depends on one in two places: the checked-in project runtime directory and skill, and the command-layer YAMLs that still carry Gemini executor branches and references. As long as either remains, docs, tests, and command workflows keep pointing at a surface the project has dropped.

### Purpose
Remove Gemini from the project end-to-end so no active tooling, docs, or command workflows depend on it. Phase 001 deletes the checked-in runtime and skill and aligns active non-spec references; phase 002 removes the orphaned command-layer branches and references (YAML assets + command docs); phase 003 purges the remaining `cli-gemini` executor wiring across skill source, tests, manifests, feature-catalogs, testing playbooks, and changelogs; phase 004 eradicates Gemini as a host runtime (runtime-detection enums, the `hooks/gemini/**` subsystems, the GEMINI.md root-doc convention) and as a model (`gemini-flash`, `gemini-3.1-pro`) across every remaining surface. Only external-binary user-home state (`~/.gemini`, `.geminiignore`) and historical spec records stay, by design.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child-phase manifest for the Gemini deprecation effort.
- Per-phase runtime/skill deletion, active-reference alignment, and command-YAML cleanup (in the child folders).

### Out of Scope
- External Gemini CLI binary references, user-home state such as `~/.gemini`, and the `.geminiignore` ignore file.
- Historical spec records that mention Gemini.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-runtime-surface-and-skill-deletion/ | Delete the checked-in project `.gemini/` runtime and `.opencode/skills/cli-gemini/` skill, and align active non-spec references | Complete |
| 2 | 002-command-yaml-gemini-cleanup/ | Remove the orphaned `cli-gemini` executor branches and Gemini references across the command layer (deep-loop + doctor YAML assets and the deep command docs) | Complete |
| 3 | 003-cli-gemini-full-purge/ | Purge the remaining `cli-gemini` executor wiring across skill source, tests, manifests, feature-catalogs, testing playbooks, and changelogs (all surfaces outside `specs/**`) | Complete |
| 4 | 004-gemini-runtime-and-model-eradication/ | Eradicate Gemini as a host runtime (runtime-detection, `hooks/gemini/**`, GEMINI.md convention) and as a model (`gemini-flash`, `gemini-3.1-pro`) across all remaining surfaces | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-runtime-surface-and-skill-deletion | 002-command-yaml-gemini-cleanup | Runtime and skill deleted; active non-spec references aligned | deletion staged and targeted searches clean |
| 002-command-yaml-gemini-cleanup | 003-cli-gemini-full-purge | Command layer (YAML assets + command docs) carries no Gemini references | `grep -rniE "gemini" .opencode/commands` returns 0 |
| 003-cli-gemini-full-purge | 004-gemini-runtime-and-model-eradication | No `cli-gemini` reference outside `specs/**`; affected test suites green | global `rg "cli-gemini"` excl specs = 0; deep-loop 213/214, matrix 13/13, remediation 25/25 |
| 004-gemini-runtime-and-model-eradication | (done) | No Gemini (runtime/model/convention) outside `specs/**` except 2 deferred skill-advisor files; suites green | `rg "gemini"` excl specs = only 2 deferred files; hooks 59, code-graph 14, fallback 8, scripts 8+267 green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. Gemini is fully eradicated (executor/skill, command layer, executor wiring, host-runtime, and model) outside `specs/**`. Residual: 2 `system-skill-advisor` files (a pro-eradication negative test assertion + a historical deferred-decisions record) are being finished by a concurrent session that is also removing `devin`; touching them here would race that session.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
