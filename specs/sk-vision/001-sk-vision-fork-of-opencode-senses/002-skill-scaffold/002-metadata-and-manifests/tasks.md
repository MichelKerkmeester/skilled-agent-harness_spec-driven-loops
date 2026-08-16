---
title: "Tasks: sk-vision Class S metadata"
description: "Executable tasks for sk-vision Class S metadata."
trigger_phrases:
  - "sk-vision graph-metadata"
  - "sk-vision leaf manifest"
  - "sk-vision class S"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/002-metadata-and-manifests"
    last_updated_at: "2026-08-16T09:55:00.000Z"
    last_updated_by: "cursor-markdown-leaf"
    recent_action: "Class S identity files authored; generators and proof suite passed."
    next_safe_action: "003 context copy or 004 host adapters per parent scaffold plan."
    blockers: []
    key_files:
      - ".opencode/skills/sk-vision/graph-metadata.json"
      - ".opencode/skills/sk-vision/leaf-manifest.config.json"
      - ".opencode/skills/sk-vision/leaf-manifest.json"
      - ".opencode/skills/sk-vision/leaf-aliases.json"
      - ".opencode/skills/sk-vision/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-002-skill-scaffold-002-metadata-and-manifests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision Class S metadata

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

- [x] T001 Confirm SKILL.md exists (`.opencode/skills/sk-vision/SKILL.md`) [evidence: test -f .opencode/skills/sk-vision/SKILL.md exit 0; wc -l reports 86 lines]
- [x] T002 Confirm generator path (`sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`) [evidence: test -f .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs exit 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write graph-metadata.json (`.opencode/skills/sk-vision/graph-metadata.json`) [evidence: skill_id sk-vision; 8 intent_signals including sk-vision for CI floor]
- [x] T004 Write leaf-manifest.config.json (`.opencode/skills/sk-vision/leaf-manifest.config.json`) [evidence: leafRoots references only per copy pack File 3]
- [x] T005 Write README.md (`.opencode/skills/sk-vision/README.md`) [evidence: Class S standalone operator README with 13 sk_vision_* tools note]
- [x] T006 Run ci-skill-root-metadata.cjs --fix [evidence: node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix exit code 0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run ci-skill-root-metadata.cjs without --fix [evidence: node ci-skill-root-metadata.cjs exit code 0 OK S sk-vision fleet gate]
- [x] T008 Run package_skill.py --check [evidence: python3 package_skill.py .opencode/skills/sk-vision --check exit code 0 Result PASS]
- [x] T009 Prove hub JSON absent and vision-runtime empty [evidence: ls hub json names exit code 1; test ! -e vision-runtime exit code 0]
- [x] T010 Run validate.sh --strict on this child [evidence: validate.sh scoped Errors 0 Warnings 0 RESULT PASSED]
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
