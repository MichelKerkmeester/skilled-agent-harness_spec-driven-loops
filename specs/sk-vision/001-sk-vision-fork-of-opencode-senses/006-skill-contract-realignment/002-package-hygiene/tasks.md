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

- [x] T001 Read `vision-runtime/package.json` and confirm current publish/provenance fields — evidence: `repository.url` = upstream `opencode-senses`; `publishConfig.access` = public; `publish:npm` script present
- [x] T002 Inspect `python/runtime.test.ts` + `scripts/build.ts` to understand interpreter discovery — evidence: test hardcoded `VENV_PYTHON = join(REPO, ".venv", "bin", "python")`; cache venv `~/.cache/sk-vision/venv` has PIL 12.3.0; torch/transformers imported lazily in runtime.py (lines 166/270)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove `publishConfig` and `publish:npm`; omit `repository`; `author` -> `sk-vision contributors`; dual-host `description` — evidence: rewritten `package.json`; `rg -n "publishConfig|publish:npm" package.json` exit 1
- [x] T004 Delete `.venv` — evidence: `rm -rf` ran; `test ! -d .opencode/skills/sk-vision/vision-runtime/.venv` exit 0
- [x] T005 Add `vision-runtime/.gitignore` — evidence: created with node_modules/, .venv/, __pycache__/, *.pyc, .DS_Store; `test -f` exit 0
- [x] T006 Prove hermetic build + tests without `.venv` — evidence: `bun run build` exit 0 (`built dist/plugin.js + dist/python/runtime.py`); `bun test` exit 0 (`8 pass, 0 fail`); interpreter discovery fixed in `python/runtime.test.ts` to prefer `~/.cache/sk-vision/venv` then local venv then `python3`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Prove publish/provenance sweep — evidence: `rg -n "publishConfig|publish:npm" package.json` exit 1; `rg -i "opencode-senses|itsmeadarsh" package.json` exit 1
- [x] T008 Prove venv gone + dist rebuilt — evidence: `test ! -d` exit 0; `dist/plugin.js` 499333 bytes and `dist/python/runtime.py` 34705 bytes exist after `bun run build`
- [x] T009 Identifier sweep — evidence: `rg -n -i "opencode-senses" . --glob '!bun.lock' --glob '!LICENSE'` exit 1; `rg -n "SENSES_" . --glob '!LICENSE'` exit 1; `rg "Adarsh" LICENSE` exit 0 (MIT copyright kept)
- [x] T010 Run `validate.sh --strict` on this child — evidence: folder RESULT PASSED errors=0 warnings=0 (wrapper exit 2 from pre-existing repo COMMAND_TREE_PARITY drift, same as prior children; not a folder failure)
- [x] T011 All tasks marked `[x]` with evidence; no `[B]` remaining — evidence: this closeout
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
