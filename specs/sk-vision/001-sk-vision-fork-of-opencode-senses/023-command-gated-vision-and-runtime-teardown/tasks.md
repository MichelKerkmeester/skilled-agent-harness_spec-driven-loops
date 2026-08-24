---
title: "Tasks: Command-gated vision activation and runtime teardown"
description: "Task ledger for making sk-vision opt-in via /vision in OpenCode and Pi, with default auto-inject and tool advertisement removed and runtime teardown after each call."
trigger_phrases:
  - "sk-vision command-gated tasks"
  - "sk-vision /vision teardown tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown"
    last_updated_at: "2026-08-22T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Doc sweep + changelog v0.2.0.0 + version bump; validators 0."
    next_safe_action: "Operator smoke-tests /vision in OpenCode, Cursor, Pi."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown/tasks.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/opencode/command.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-023-command-gated-vision-and-runtime-teardown"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Command-gated vision activation and runtime teardown

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Smoke-test that `command.execute.before` fires for a markdown-defined `/vision` in a live OpenCode session; if not, adopt the one-minimal-tool fallback.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 In `plugin.ts`, remove default `tool`/`event`/`chat.message` registration; gate the old behavior behind `SK_VISION_AUTOINSPECT`. Evidence: default return is `{ "command.execute.before": … }`; legacy path restored when the flag is `"1"`.
- [x] T003 [P] Create `src/opencode/command.ts`: fetch latest session image (SDK + reuse materialize), run query (`/vision <q>`) or full inspect (bare), inject evidence, teardown in `finally`. Evidence: file present; typecheck exit 0.
- [x] T004 [P] Create `.opencode/commands/vision.md` (description, argument-hint). Evidence: file present.
- [x] T005 In `hooks/pi/sk-vision.ts`, remove default injection transform and default tool advertisement. Evidence: `registerTool` wrapper only registers when `autoInspect`; shared client undefined by default.
- [x] T006 Add Pi `registerCommand("vision", ...)`: `/vision <q>` runs; bare `/vision` calls `ctx.ui.input(...)` then runs; GPU-free image capture; teardown per run + `session_shutdown` backstop. Evidence: `runVisionCommand` opens a fresh client; typecheck exit 0.
- [x] T007 Rebuild dist (`bun run scripts/build.ts`). Evidence: build exit 0; `dist/plugin.js` + `hooks/opencode/sk-vision.js` regenerated.
- [x] T012 Cross-runtime: exclude `vision.md` from Claude mirror + register Cursor/Pi natives in `command-scope.cjs`. Evidence: both sync `--check` PASS; `.claude/commands/vision.md` absent.
- [x] T013 Author `.cursor/commands/vision.md` (drives `sk_vision_inspect` MCP tool) and `.pi/prompts/vision.md` (drives hidden tool). Evidence: files present; MCP tool wired in `.cursor/mcp.json`.
- [x] T014 Rework Pi hook: hidden tools + per-call teardown; remove `registerCommand("vision")`. Evidence: grep shows no `registerCommand`; per-call `teardownVision`; typecheck + tests exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Typecheck + unit tests green in `vision-runtime`. Evidence: `bun run typecheck` exit 0; `bun test` 20 pass / 0 fail exit 0 (re-run independently).
- [x] T009 Grep proofs: default return no longer registers tools/inject; scope confined to the 5 allowed files; `tools.ts`/`mcp/server.ts`/runtime contract untouched; comment hygiene clean. Evidence: `git status` scope sweep + grep.
- [ ] T010 Live smoke tests (OPERATOR-RUN): OpenCode + Cursor + Pi `/vision` (arg + bare); confirm no runtime process remains after each call. Not testable from a Claude session.
- [x] T011 Docs updated for the new activation model + env flags; changelog v0.2.0.0 created; version bumped 0.1.3.1 -> 0.2.0.0. Evidence: 14 docs `validate_document.py` 0 issues; catalog + playbook validators 0 violations; `validate.sh --strict` 0/0. Docs describe the primary command-hook design; a fallback would need a minor revision.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Off-by-default in both hosts; `/vision` works; runtime torn down. Evidence: T001-T010.
- [ ] No `[B]` blocked tasks remaining. Evidence: this ledger.
- [x] Docs synchronized. Evidence: T011.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
