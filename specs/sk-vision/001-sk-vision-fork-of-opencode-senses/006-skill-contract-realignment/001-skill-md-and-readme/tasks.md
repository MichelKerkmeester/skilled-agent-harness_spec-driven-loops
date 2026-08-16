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
    recent_action: "Completed 006-001 doc rewrite."
    next_safe_action: "002-package-hygiene"
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - ".opencode/skills/sk-vision/SKILL.md"
      - ".opencode/skills/sk-vision/README.md"
      - ".opencode/skills/sk-vision/references/runtime-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-001-skill-md-and-readme"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Read shipped runtime sources (pi/sk-vision.ts, photon.ts, types.ts, runtime.py, opencode/tools.ts, attachments.ts) and inventory env vars + tool semantics — evidence: read all listed sources; env vars and methods inventoried from `runtime.py` header + `photon.ts` + `runtime/client.ts`
- [x] T002 Read the sk-create-skill template assets and shared validators used by the gates — evidence: read `assets/skill/skill-md-template.md`, `skill-readme-template.md`, `skill-reference-template.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite `.opencode/skills/sk-vision/SKILL.md` as the executable contract (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, SUCCESS CRITERIA; `---` separators; version 0.1.1.0) — evidence: file rewritten (147 lines, 5 numbered ALL-CAPS H2 + REFERENCES), `validate_document.py --type skill` exit 0
- [x] T004 Rewrite `.opencode/skills/sk-vision/README.md` (accurate layout, quick start, env vars, tool list, adapters, no stub claims) — evidence: file rewritten (9 numbered sections), `validate_document.py` exit 0
- [x] T005 Author `.opencode/skills/sk-vision/references/runtime-reference.md` (protocol, tool semantics, env defaults, model/hardware notes, troubleshooting) — evidence: file created, `validate_document.py` exit 0
- [x] T006 Regenerate leaf manifests: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` — evidence: `OK [S] sk-vision (wrote leaf-manifest.json, leaf-aliases.json)`; leaf-manifest.json now lists `references/runtime-reference.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Prove `validate_document.py .opencode/skills/sk-vision/SKILL.md --type skill` exit 0 — evidence: `✅ VALID … Total issues: 0`, exit 0
- [x] T008 Prove `package_skill.py .opencode/skills/sk-vision --check` PASS — evidence: `Result: PASS` (7 advisory warnings, non-blocking: INTEGRATION POINTS/RELATED RESOURCES/ALWAYS-NEVER-ESCALATE subsections/smart-router markers/LICENSE kebab-case)
- [x] T009 Prove `ci-skill-root-metadata.cjs` (no --fix) OK `[S] sk-vision` — evidence: `checked=13 passed=13 failed=0 fixed=0`
- [x] T010 Prove no stub language: `rg -n "later children|leave empty|do not populate" SKILL.md README.md` exit 1; run `validate.sh --strict` on this child — evidence: grep exit 1 (no matches); child validate.sh --strict `RESULT: PASSED` errors=0 warnings=0
- [x] T011 All tasks marked `[x]` with evidence; no `[B]` remaining — evidence: T001-T011 all `[x]` with inline evidence above
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
