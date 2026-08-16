---
title: "Tasks: sk-vision 006-001 SKILL.md contract, README, references"
description: "Executable tasks for the SKILL.md/README/references rewrite child."
trigger_phrases:
  - "sk-vision 006-001 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/001-skill-md-and-readme"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 006-001 task list."
    next_safe_action: "Complete T001-T011 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-001-skill-md-and-readme"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 006-001 SKILL.md contract, README, references

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

- [ ] T001 Read shipped runtime sources (pi/sk-vision.ts, photon.ts, types.ts, runtime.py, opencode/tools.ts, attachments.ts) and inventory env vars + tool semantics
- [ ] T002 Read the sk-create-skill template assets and shared validators used by the gates
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Rewrite `.opencode/skills/sk-vision/SKILL.md` as the executable contract (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, SUCCESS CRITERIA; `---` separators; version 0.1.1.0)
- [ ] T004 Rewrite `.opencode/skills/sk-vision/README.md` (accurate layout, quick start, env vars, tool list, adapters, no stub claims)
- [ ] T005 Author `.opencode/skills/sk-vision/references/runtime-reference.md` (protocol, tool semantics, env defaults, model/hardware notes, troubleshooting)
- [ ] T006 Regenerate leaf manifests: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Prove `validate_document.py .opencode/skills/sk-vision/SKILL.md --type skill` exit 0
- [ ] T008 Prove `package_skill.py .opencode/skills/sk-vision --check` PASS
- [ ] T009 Prove `ci-skill-root-metadata.cjs` (no --fix) OK `[S] sk-vision`
- [ ] T010 Prove no stub language: `rg -n "later children|leave empty|do not populate" SKILL.md README.md` exit 1; run `validate.sh --strict` on this child
- [ ] T011 All tasks marked `[x]` with evidence; no `[B]` remaining
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
