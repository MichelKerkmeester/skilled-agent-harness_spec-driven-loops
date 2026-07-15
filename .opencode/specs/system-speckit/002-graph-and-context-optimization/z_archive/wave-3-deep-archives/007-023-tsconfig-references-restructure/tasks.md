---
title: "Tasks: TSConfig References Restructure"
description: "Task list for removing the system-code-graph tsconfig project reference, rebuilding from clean emitted output, and verifying the MCP launcher starts without missing shared files."
trigger_phrases:
  - "009 tsconfig references restructure tasks"
  - "system code graph shared emit tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-023-tsconfig-references-restructure"
    last_updated_at: "2026-05-14T16:26:51Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-009"
    recent_action: "Completed tsconfig and verification tasks"
    next_safe_action: "Stage and commit from a Git-writable shell"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/tsconfig.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-009-tsconfig-references-restructure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: TSConfig References Restructure

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

- [x] T001 Confirm no existing `009-*` child folder under packet 014.
- [x] T002 Read `.opencode/skills/system-code-graph/tsconfig.json`.
- [x] T003 Read inherited `.opencode/skills/system-spec-kit/tsconfig.json`.
- [x] T004 Inspect current copied `dist/system-spec-kit/shared/` output.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Remove the `references` array from `.opencode/skills/system-code-graph/tsconfig.json`.
- [x] T006 Move stale `dist/system-spec-kit` output aside before build verification.
- [x] T007 Move stale `dist/system-code-graph/tsconfig.tsbuildinfo` aside before final build verification.
- [x] T008 Generate packet metadata files for 009.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the requested `npx tsc` attempt and record the network-disabled failure.
- [x] T010 Run local TypeScript emit with `node node_modules/typescript/bin/tsc --listEmittedFiles`.
- [x] T011 Confirm `dist/system-spec-kit/shared/unicode-normalization.js` exists.
- [x] T012 Probe `.opencode/bin/system-code-graph-launcher.cjs` and confirm no missing-module output.
- [x] T013 Run `validate.sh --strict` on the 009 packet.
- [x] T014 Attempt to stage scoped changes; sandbox blocked `.git/index.lock`, so commit remains uncreated.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
