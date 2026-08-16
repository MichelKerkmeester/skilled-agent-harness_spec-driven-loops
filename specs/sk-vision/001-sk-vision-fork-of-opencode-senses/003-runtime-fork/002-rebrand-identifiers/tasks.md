---
title: "Tasks: sk-vision rebrand identifiers"
description: "Executable tasks for sk-vision rebrand identifiers."
trigger_phrases:
  - "sk-vision rebrand"
  - "sk-vision SK_VISION_"
  - "sk-vision package name"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/002-rebrand-identifiers"
    last_updated_at: "2026-08-16T08:00:00.000Z"
    last_updated_by: "code-agent"
    recent_action: "Rebranded vision-runtime identifiers; all tasks complete."
    next_safe_action: "003-build-and-tests"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-002-rebrand-identifiers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision rebrand identifiers

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

- [x] T001 Confirm dest copies exist [evidence: 14 files under `.opencode/skills/sk-vision/vision-runtime/`]
- [x] T002 Read longest-token-first table in spec.md [evidence: spec.md:124 copy pack applied; validate.sh --strict RESULT PASSED exit code 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply env, cache, envelope, and tool-key replacements [evidence: `rg SENSES_ --glob '!LICENSE'` → NO_SENSES_OUTSIDE_LICENSE]
- [x] T004 Set package.json name to sk-vision [evidence: `rg '"name": "sk-vision"' package.json` match line 2]
- [x] T005 Keep LICENSE Adarsh line and append modification notice [evidence: `rg 'Copyright (c) 2026 Adarsh'` LICENSE exit 0]
- [x] T006 Correct python/runtime.py default-model comment [evidence: `rg moondream2 python/runtime.py` matches DEFAULT_MODEL and header]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 rg sk_vision_query must be empty [evidence: `rg sk_vision_query vision-runtime` no matches]
- [x] T008 Confirm package.json name [evidence: package.json line 2 `"name": "sk-vision"`]
- [x] T009 Run validate.sh --strict on this child [evidence: validate.sh RESULT PASSED after metadata sync]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T009 all [x] with evidence]
- [x] No `[B]` blocked tasks remaining [evidence: zero [B] entries in tasks.md]
- [x] Manual verification passed [evidence: copy-pack rg proofs NO_OLD and NO_SENSES_OUTSIDE_LICENSE]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
