---
title: "Tasks: Scaffold system-skill-advisor package"
description: "Audit, author SKILL.md + graph-metadata.json, mirror catalog/playbook, write policy + install stubs, validate."
trigger_phrases:
  - "system-skill-advisor scaffold tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/002-scaffold-system-skill-advisor-package"
    last_updated_at: "2026-05-14T03:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Scaffold system-skill-advisor package

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Audit existing `.opencode/skills/system-skill-advisor/` state (SKILL.md empty, graph-metadata.json missing, ARCHITECTURE/README from parallel session).
- [ ] T002 Inventory `mcp_server/skill_advisor/feature_catalog/` + `manual_testing_playbook/` + `references/` for mirror content.
- [ ] T003 Reread ADR-001 (`015/009/001/decision-record.md`) to anchor shape.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Author `system-skill-advisor/SKILL.md` (overwrite empty stub) with full frontmatter + body per ADR-001.
- [ ] T011 Author `system-skill-advisor/graph-metadata.json` (new) using the per-skill schema; populate `derived.*` + `manual.*`.
- [ ] T012 Audit + reconcile or replace existing `ARCHITECTURE.md` and `README.md` so they align with ADR-001.
- [ ] T013 Author or mirror `feature_catalog/` content (≥ 1 entry).
- [ ] T014 Author or mirror `manual_testing_playbook/` content (≥ 1 entry).
- [ ] T015 Author or mirror `references/` content (≥ 1 entry).
- [ ] T016 Author `references/db-path-policy.md` documenting the future DB location under this skill folder.
- [ ] T017 Author `INSTALL_GUIDE.md` stub referencing the future `skill-advisor-launcher.cjs`.
- [ ] T018 Create `mcp_server/` directory with stub README ("child 003 will fill").
- [ ] T019 Update `implementation-summary.md` with edit ledger + parity-test delta.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 node JSON/YAML load on every new/modified file.
- [ ] T021 `npm exec -- vitest run skill_advisor` from `mcp_server/`. Confirm ≤ 3 failures.
- [ ] T022 Strict validate this packet.
- [ ] T023 Strict validate parent 015/009.
- [ ] T024 Strict validate parent 015.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks `[x]`.
- [ ] No `[B]` blockers.
- [ ] No production advisor code modified.
- [ ] Strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `015/009-system-skill-advisor-extraction`
- ADR source: `015/009/001-design-and-decision-record/decision-record.md`
- Survey source: `015/009/001-design-and-decision-record/research/extraction-survey.md`
- Mirror source: `mcp_server/skill_advisor/feature_catalog/`, `manual_testing_playbook/`, `references/`
- Next packet: `015/009/003-move-advisor-source-db-and-tests`
<!-- /ANCHOR:cross-refs -->
