---
title: "Tasks: Pi hook extension layer"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi hook extension tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer"
    last_updated_at: "2026-07-27T10:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "T001 (docs re-fetch) done; T002-T010 deferred to a future execution phase"
    next_safe_action: "Commit as Blocked; phase 009 proceeds independently"
    blockers:
      - "Live-session probing (T002-T010) requires running an actual pi session, out of this planning phase's own Hard Constraint"
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: pi-hook-extension-layer

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

Phase 001 has since landed (`pi` 0.82.1 installed); T001 is achievable now and was completed during this phase's closeout. T002-T003 require an installed-package introspection and writing a real `.pi/extensions/*.ts` file — both out of this planning phase's own Hard Constraint — and stay deferred to a future execution phase.

- [x] T001 Re-read `pi.dev/docs/latest/extensions` live at execution time; diff against this phase's cached findings and note any drift (`plan.md` §4 Phase 1) [EVIDENCE: live WebFetch during closeout found a major update - the extension registration model (`pi.on(event, handler)`) and the full event taxonomy (`tool_call`, `agent_end`, etc.) are now documented, where the authoring-time snapshot had none of this]
- [x] T002 Locate and type-introspect the extension registration surface shipped with the installed `@earendil-works/pi-coding-agent` package [EVIDENCE: this is a filesystem read, not a live Pi session, so it stays inside this planning phase's scope - resolved `~/.local/bin/pi` (symlink) to `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js`, then read `dist/core/extensions/types.d.ts` directly. Confirms, with exact line citations: `ExtensionFactory = (pi: ExtensionAPI) => void | Promise<void>` (types.d.ts:1078); `ExtensionAPI.on(event, handler)` registration for 32 named event types (types.d.ts:850-882); `tool_call` fires pre-execution with `ToolCallEventResult { block?: boolean; reason?: string }` (types.d.ts:772-776, 879) and `event.input` is mutable to patch arguments in place (types.d.ts:681-683); real narrow tool names for `tool_call`/`tool_result` are `bash`/`read`/`edit`/`write`/`grep`/`find`/`ls` plus a `CustomToolCallEvent` catch-all (types.d.ts:646-677, 694-721) - this is a type-file line reference, the exact evidence class REQ-001's acceptance criterion names as sufficient alongside a captured live invocation]
- [B] T003 Author one minimal instrumented `.pi/extensions/*.ts` probe module that logs every lifecycle callback name/payload it receives [DEFERRED: writing any `.pi/extensions/*.ts` file is explicitly out of scope per spec.md's Out of Scope section; a future execution phase performs this step]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T004 Run a real interactive `pi` session and the phase-001-confirmed headless dispatch surface, exercising session start, at least one tool call, and session end; capture which callbacks actually fire [DEFERRED: out of this planning phase's own scope, same reason as T002 above (running `pi`, not just reading its installed files, crosses the Hard Constraint)]
- [x] T005 Record the confirmed lifecycle surface (names, payload shapes, block-capability) [EVIDENCE: `plan.md` §3 mapping table records all 32 event names, their result-object shapes, and `tool_call`'s block-capability, each citing a `types.d.ts` line number - satisfied at the type level via T002; the residual gap is runtime behavior (does `block: true` actually get enforced), which needs T004's live capture]
- [B] T006 Choose Shape A (in-process direct-call) or Shape B (`spawnSync` delegate), or a hybrid, based on T004's findings; record rationale [DEFERRED: this decision hinges on whether Pi's extension loader sandboxes `node:child_process`/`node:fs` access, a runtime question `types.d.ts` cannot answer - genuinely gated on T004]
- [B] T007 [P] Author `mcp-server/hooks/pi/**` (shared module + per-guard adapters + `README.md`), mirroring `hooks/codex/`, `hooks/devin/`, `hooks/cursor/` [DEFERRED: out of this planning phase's own scope, same reason as T002]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T008 Fixture-based unit probing of fail-open behavior (malformed/missing input) for each bridged guard [DEFERRED: gated on T007]
- [B] T009 Live smoke test each wired lifecycle point against a real `pi` session, capturing stdin/stdout (or equivalent in-process) evidence [DEFERRED: gated on T007]
- [B] T010 Update documentation — author `README.md` in each new `hooks/pi/` sibling directory [DEFERRED: gated on T007; this closeout's own docs updates (spec.md/plan.md) already record the docs-confirmed-vs-live-verified distinction for a future implementer to pick up]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001 (achievable pre-work) marked `[x]` with evidence; T002-T010 (live-session-dependent) explicitly `[B]` with a documented reason [EVIDENCE: this file]
- [B] No `[B]` blocked tasks remaining [DEFERRED: 9 of 10 tasks genuinely require a live installed Pi session, out of this planning phase's own scope - not resolvable this session]
- [B] Manual verification passed (live `pi` session smoke test evidence captured per wired lifecycle point) [DEFERRED: requires a future execution phase]

This phase's own `spec.md`/`plan.md`/`tasks.md`/`checklist.md` closeout pass re-verified everything achievable without a live session and found a major docs update (T001). This phase's status is **Blocked**, not Complete — REQ-001's own live-session probe (T002-T010) genuinely remains open, deferred to a future execution phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Depends on `../001-pi-contract-pin/` (live extension-loading + headless dispatch confirmation) and `../003-cli-pi-skill-packet/` (hub registration); sequenced after `../007-pi-mcp-host-integration/`.
- Precedes `../009-pi-model-registry-and-routing/`.
- Structural precedent: `.opencode/skills/system-spec-kit/mcp-server/hooks/{codex,devin,cursor}/`, `.opencode/skills/system-spec-kit/runtime/hooks/{codex,devin,cursor}/`.
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
