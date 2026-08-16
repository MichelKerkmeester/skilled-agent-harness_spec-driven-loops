---
title: "Tasks: sk-vision 010 quality gate"
description: "Task list for the quality gate child."
trigger_phrases:
  - "sk-vision 010 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/010-quality-gate"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 010 task list."
    next_safe_action: "Complete T001-T012 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-010-quality-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-vision 010 quality gate

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:tasks -->
## Tasks

| ID | Task | Status |
|----|------|--------|
| T001 | Run `ci-skill-root-metadata.cjs` (fleet) — record output | [ ] |
| T002 | Run `validate_skill_package.py` + `package_skill.py --check` — record output | [ ] |
| T003 | Run `validate_document.py` on SKILL.md, README, references/runtime-reference.md, catalog root + 16 leaves, playbook root — record outputs | [ ] |
| T004 | Run `validate_catalog_package.cjs` + `validate-playbook-package.cjs` — record outputs | [ ] |
| T005 | Run `extract_structure.py` on SKILL.md (DQI) — record score | [ ] |
| T006 | Run `bun run build && bun test` in vision-runtime — record output | [ ] |
| T007 | Run advisor smoke (`advisor_recommend --warm-only`) — record result or cold-daemon note | [ ] |
| T008 | Run parent `validate.sh --recursive --strict` — record output | [ ] |
| T009 | Reconcile metadata: 002-001 `completion_pct` → 100; parent `last_active_child_id` → current; refresh description/graph via generate-context.js if available | [ ] |
| T010 | Final sweep: no `.venv`, no temp/bak files, no hub JSON on skill root, `context/` diff empty | [ ] |
| T011 | Run `validate.sh --strict` on this child | [ ] |
| T012 | All tasks marked `[x]` with evidence; no `[B]` remaining | [ ] |
<!-- /ANCHOR:tasks -->
