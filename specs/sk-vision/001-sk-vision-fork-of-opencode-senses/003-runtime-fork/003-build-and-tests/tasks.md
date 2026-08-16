---
title: "Tasks: sk-vision build and tests"
description: "Executable tasks for sk-vision build and tests."
trigger_phrases:
  - "sk-vision bun build"
  - "sk-vision dist plugin"
  - "sk-vision bun test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/003-build-and-tests"
    last_updated_at: "2026-08-16T10:15:00.000Z"
    last_updated_by: "code-agent"
    recent_action: "bun install/build/test passed; all tasks complete with evidence."
    next_safe_action: "004-gpu-smoke"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/dist/plugin.js"
      - ".opencode/skills/sk-vision/vision-runtime/dist/python/runtime.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-003-build-and-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision build and tests

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

- [x] T001 cd vision-runtime [evidence: cwd `.opencode/skills/sk-vision/vision-runtime` for all commands]
- [x] T002 bun install (or document tsc substitute) [evidence: `bun install` exit 0, 33 packages]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 bun run build (`scripts/build.ts`) [evidence: `bun run build` exit 0; output `built dist/plugin.js + dist/python/runtime.py`]
- [x] T004 Prove dist/plugin.js (`vision-runtime/dist/plugin.js`) [evidence: `test -f dist/plugin.js` exit 0; 499333 bytes]
- [x] T005 bun test [evidence: `bun test` exit 0 after `.venv` + Pillow; 8 pass, 0 fail]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 rg residual dump identifiers [evidence: `rg --no-ignore` → only `package.json:13` provenance URL; zero `senses_` in `src/`]
- [x] T007 Run validate.sh --strict on this child [evidence: validate.sh RESULT PASSED after metadata backfill]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T007 all [x] with evidence tags]
- [x] No `[B]` blocked tasks remaining [evidence: zero [B] entries in tasks.md]
- [x] Manual verification passed [evidence: copy-pack proofs in implementation-summary.md §Verification]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
