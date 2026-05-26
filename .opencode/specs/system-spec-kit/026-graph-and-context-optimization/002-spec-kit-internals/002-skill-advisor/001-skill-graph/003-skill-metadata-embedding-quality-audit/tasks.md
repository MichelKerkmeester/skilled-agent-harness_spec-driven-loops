---
title: "Tasks: Skill metadata quality audit"
description: "Inventory, score, dedupe, rank, recommend, validate."
trigger_phrases:
  - "skill metadata audit tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/003-skill-metadata-embedding-quality-audit"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Tasks: Skill metadata quality audit

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Enumerate skills via `ls .opencode/skills/` and filter to active skills with both `graph-metadata.json` and `SKILL.md`.
- [ ] T002 Read each skill's `graph-metadata.json` and `SKILL.md` description block.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Score per skill per dimension D1-D5.
- [ ] T011 Compute cross-skill phrase duplication.
- [ ] T012 Rank top-N for improvement.
- [ ] T013 Write per-skill concrete recommendations.
- [ ] T014 Author `research/audit-report.md`.
- [ ] T015 Update `implementation-summary.md` executive summary block.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 Strict spec validate this packet.
- [ ] T021 Strict spec validate parent 015 packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All tasks `[x]`.
- [ ] Audit report written.
- [ ] No skill files modified.
- [ ] Strict validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `002-semantic-routing-lane`
- Sibling driving signal: `004-corpus-seeded-sweep` (variance was zero with current metadata)
- Source files: `.opencode/skills/<skill>/graph-metadata.json` + `.opencode/skills/<skill>/SKILL.md` for each active skill
<!-- /ANCHOR:cross-refs -->
