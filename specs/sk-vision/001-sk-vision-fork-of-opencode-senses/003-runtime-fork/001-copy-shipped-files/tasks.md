---
title: "Tasks: sk-vision copy shipped dump files"
description: "Executable tasks for sk-vision copy shipped dump files."
trigger_phrases:
  - "sk-vision copy dump"
  - "sk-vision vision-runtime copy"
  - "sk-vision shipped files"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/001-copy-shipped-files"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "002-rebrand-identifiers"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/plugin.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-001-copy-shipped-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision copy shipped dump files

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

- [x] T001 Confirm SKILL.md exists [evidence: test -f .opencode/skills/sk-vision/SKILL.md exit code 0]
- [x] T002 mkdir dest trees (`.opencode/skills/sk-vision/vision-runtime/`) [evidence: mkdir -p vision-runtime/src/{runtime,providers,opencode,core} python scripts exit code 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Copy locked file list from context/ to vision-runtime/ [evidence: 14 files under .opencode/skills/sk-vision/vision-runtime/; cp locked list exit code 0]
- [x] T004 Do not copy PLAN.md, .github/, or dump opencode.json [evidence: test ! -e vision-runtime/PLAN.md exit code 0; test ! -e vision-runtime/opencode.json exit code 0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 test -f listed dest files [evidence: test -f vision-runtime/src/plugin.ts vision-runtime/python/runtime.py vision-runtime/LICENSE exit code 0]
- [x] T006 git diff --exit-code on context/ [evidence: git diff --exit-code -- specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context exit code 0]
- [x] T007 Run validate.sh --strict on this child [evidence: validate.sh specs/.../001-copy-shipped-files --strict RESULT PASSED exit code 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T007 all [x] with evidence]
- [x] No `[B]` blocked tasks remaining [evidence: zero [B] entries in tasks.md]
- [x] Manual verification passed [evidence: copy-pack proof commands exit 0]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
