---
title: "Tasks: sk-vision 006-002 package hygiene"
description: "Executable tasks for the package hygiene child."
trigger_phrases:
  - "sk-vision 006-002 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/002-package-hygiene"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 006-002 task list."
    next_safe_action: "Complete T001-T011 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-002-package-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 006-002 package hygiene

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

- [ ] T001 Read `vision-runtime/package.json` and confirm current publish/provenance fields
- [ ] T002 Inspect `python/runtime.test.ts` + `scripts/build.ts` to understand interpreter discovery before deleting `.venv`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Remove `publishConfig` and `publish:npm`; neutralize `repository`/`author`; fix `description` for dual-host
- [ ] T004 Delete `.venv`: `rm -rf .opencode/skills/sk-vision/vision-runtime/.venv`
- [ ] T005 Add `vision-runtime/.gitignore` if absent (node_modules, .venv, __pycache__, *.pyc)
- [ ] T006 Prove hermetic `bun run build && bun test` exit 0 without `.venv` (record output; if fail, fix interpreter discovery or record named-blocker SKIP)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Prove `rg -n "publishConfig|publish:npm" package.json` exit 1 and `rg -i "opencode-senses|itsmeadarsh" package.json` exit 1
- [ ] T008 Prove `test ! -d .opencode/skills/sk-vision/vision-runtime/.venv` exit 0 and `dist/plugin.js` + `dist/python/runtime.py` exist after rebuild
- [ ] T009 Identifier sweep: `rg -n -i "opencode-senses" . --glob '!bun.lock' --glob '!LICENSE'` exit 1; `rg -n "SENSES_" . --glob '!LICENSE'` exit 1; `rg "Adarsh" LICENSE` exit 0
- [ ] T010 Run `validate.sh --strict` on this child
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
