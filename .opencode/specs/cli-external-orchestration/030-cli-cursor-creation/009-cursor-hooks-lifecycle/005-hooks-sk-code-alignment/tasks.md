---
title: "Tasks: cli-cursor hook code sk-code/code-opencode alignment"
description: "Task breakdown for auditing and aligning Cursor hook .mjs files against sk-code's code-opencode standards."
trigger_phrases: ["cli-cursor hooks sk-code alignment tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment"
    last_updated_at: "2026-07-24T17:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-sk-code-alignment", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cursor hook code sk-code/code-opencode alignment

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read `sk-code/SKILL.md` — confirmed `code-opencode` is a read-only surface evidence packet, advisor-invisible, bundled alongside a workflow mode
- [x] T002 Read `code-opencode/SKILL.md` — confirmed the reference map includes `references/shared/hooks.md` for hook entrypoint/wiring evidence
- [x] T003 Read `code-opencode/references/shared/hooks.md` in full — found zero Cursor CLI mentions across all sections
- [x] T004 Read `references/typescript/style-guide/overview-strict-and-naming.md` + `typescript-checklist.md` — confirmed all 5 Cursor `.ts` hook files already compliant
- [x] T005 Read the JavaScript style guide + checklist — found the P0 box-header requirement and `.mjs` `'use strict'` prohibition
- [x] T006 Grepped all 8 Cursor hook files for `\bany\b`-type usage and forbidden ephemeral-artifact ids (`ADR-`/`REQ-`/`CHK-`/`T\d{3}`) — 0 in-scope hits
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T007 Measured exact box-header widths from `install-codex-hooks.mjs` via Python (`79`-char rows, `71`-char inner content width) rather than hand-counting
- [x] T008 Generated and validated all 5 `COMPONENT`/`PURPOSE` box headers (79-char rows) before applying any edit
- [x] T009 Applied box header + `'use strict'` removal to `spec-gate-enforce.mjs`
- [x] T010 Applied box header + `'use strict'` removal to `spec-gate-classify.mjs`
- [x] T011 Applied box header + `'use strict'` removal to `mcp-route-guard.mjs`
- [x] T012 Applied box header + `'use strict'` removal to `post-tool-use.mjs`
- [x] T013 Applied box header + `'use strict'` removal to `task-dispatch-guard.mjs`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T014 `node --check` on all 5 edited files — all pass
- [x] T015 Re-ran each file's synthetic-payload smoke test — identical response envelopes to before editing (e.g. `spec-gate-classify.mjs` still returns the same `SPEC FOLDER QUESTION` advisory verbatim)
- [x] T016 `python3 verify_alignment_drift.py --root .../runtime/hooks/cursor --root .../mcp-server/hooks/cursor` → `11 files scanned, Findings: 0, Errors: 0, Warnings: 0, Violations: 0`
- [x] T017 Re-read `.cursor/hooks.json` fresh and built the new `CURSOR HOOKS` section in `hooks.md` matching all 12 live entries exactly
- [x] T018 Renumbered `hooks.md` sections 4-7 to 5-8, touched up the dynamic-load-pattern table, Key Sources table, and Cross-Runtime Parity table, bumped version to `1.0.0.15`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T019 `validate.sh 013-hooks-sk-code-alignment --strict` passes 0/0; SC-001..SC-006 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Aligns the hook adapter files phases 004/010/011 shipped against `sk-code/code-opencode`'s standards.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
