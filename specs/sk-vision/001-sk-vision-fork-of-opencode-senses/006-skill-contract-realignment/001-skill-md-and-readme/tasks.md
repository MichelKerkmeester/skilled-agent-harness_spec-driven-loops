---
title: "Tasks: sk-vision 006-001 SKILL.md contract, README, references"
description: "Task list for the SKILL.md/README/references rewrite child."
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
    next_safe_action: "Complete T001-T010 with evidence."
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
# Tasks: sk-vision 006-001 SKILL.md contract, README, references

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:tasks -->
## Tasks

| ID | Task | Status |
|----|------|--------|
| T001 | Read shipped runtime sources (pi/sk-vision.ts, photon.ts, types.ts, runtime.py, opencode/tools.ts, attachments.ts) and inventory env vars + tool semantics | [ ] |
| T002 | Rewrite SKILL.md as the executable contract (File 1: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, SUCCESS CRITERIA; `---` separators; version 0.1.1.0) | [ ] |
| T003 | Rewrite README.md (File 2: accurate layout, quick start, env vars, tool list, adapters, no stub claims) | [ ] |
| T004 | Author references/runtime-reference.md (File 3: protocol, tool semantics, env defaults, model/hardware notes, troubleshooting) | [ ] |
| T005 | Regenerate leaf manifests: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` | [ ] |
| T006 | Prove `validate_document.py .opencode/skills/sk-vision/SKILL.md --type skill` exit 0 | [ ] |
| T007 | Prove `package_skill.py .opencode/skills/sk-vision --check` PASS | [ ] |
| T008 | Prove `ci-skill-root-metadata.cjs` (no --fix) OK `[S] sk-vision` | [ ] |
| T009 | Prove no stub language: `rg -n "later children|leave empty|do not populate" .opencode/skills/sk-vision/SKILL.md .opencode/skills/sk-vision/README.md` exit 1 | [ ] |
| T010 | Run `validate.sh --strict` on this child | [ ] |
| T011 | All tasks marked `[x]` with evidence; no `[B]` remaining | [ ] |
<!-- /ANCHOR:tasks -->
