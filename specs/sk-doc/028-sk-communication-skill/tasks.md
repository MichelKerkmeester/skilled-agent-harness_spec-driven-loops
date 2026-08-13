---
title: "Tasks: sk-communication skill"
description: "Task breakdown for authoring the sk-communication standalone skill."
trigger_phrases:
  - "sk-communication tasks"
importance_tier: "standard"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-communication-skill"
    last_updated_at: "2026-08-12T17:49:00Z"
    last_updated_by: "claude"
    recent_action: "Cited a persisted advisor smoke report as T005 evidence"
    next_safe_action: "None; complete."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-communication-skill-20260812"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All authoring and validation tasks are complete."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: sk-communication skill

<!-- ANCHOR:notation -->
## TASK NOTATION

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Scaffold the standalone skill with `init_skill.py` [evidence: `.opencode/skills/sk-communication/` created]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T002 Author `SKILL.md` as the package wrapper [evidence: `.opencode/skills/sk-communication/SKILL.md` documents the pipeline, tiers, privacy order, and exact-original fallback]
- [x] T003 Fill `graph-metadata.json` domains and intent signals [evidence: `.opencode/skills/sk-communication/graph-metadata.json` real projection phrasing and sibling edges]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T004 Generate manifest and validate [evidence: `ci-skill-root-metadata` 12/12 clean; `validate_skill_package.py` PASS]
- [x] T005 Confirm advisor routing [evidence: `.opencode/skills/sk-communication/benchmark/reports/advisor-routing-smoke-2026-08-12.json` — advisor ranks sk-communication #1 at confidence 0.95 (above the 0.8 invoke threshold) for the projection prompt; reproduce via the command recorded in that file]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] The skill validates with zero hard failures.
- [x] The advisor routes the skill for the projection intent.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Skill**: `.opencode/skills/sk-communication/SKILL.md`
<!-- /ANCHOR:cross-refs -->
