---
title: "Tasks: sk-vision 006-002 package hygiene"
description: "Task list for the package hygiene child."
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
    next_safe_action: "Complete T001-T010 with evidence."
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
# Tasks: sk-vision 006-002 package hygiene

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:tasks -->
## Tasks

| ID | Task | Status |
|----|------|--------|
| T001 | Read `vision-runtime/package.json` and confirm current publish/provenance fields | [ ] |
| T002 | Remove `publishConfig` and `publish:npm`; neutralize `repository`/`author`; fix `description` for dual-host | [ ] |
| T003 | Prove `rg -n "publishConfig|publish:npm" package.json` exit 1 | [ ] |
| T004 | Prove `rg -i "opencode-senses|itsmeadarsh" package.json` exit 1 | [ ] |
| T005 | Delete `.venv`: `rm -rf .opencode/skills/sk-vision/vision-runtime/.venv`; prove `test ! -d` exit 0 | [ ] |
| T006 | Prove hermetic `bun run build && bun test` exit 0 without `.venv` (record output; if fail, fix interpreter discovery or record named-blocker SKIP) | [ ] |
| T007 | Rebuild `dist/` (`bun run build`) and prove `dist/plugin.js` + `dist/python/runtime.py` exist | [ ] |
| T008 | Identifier sweep: `rg -n -i "opencode-senses" . --glob '!bun.lock' --glob '!LICENSE'` exit 1; `rg -n "SENSES_" . --glob '!LICENSE'` exit 1 | [ ] |
| T009 | Verify LICENSE attribution: `rg "Adarsh" LICENSE` exit 0; add `vision-runtime/.gitignore` if absent | [ ] |
| T010 | Run `validate.sh --strict` on this child | [ ] |
| T011 | All tasks marked `[x]` with evidence; no `[B]` remaining | [ ] |
<!-- /ANCHOR:tasks -->
