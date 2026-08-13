---
title: "Tasks: Cross-runtime goal hook capability probes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "capability probe tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/002-capability-probes"
    last_updated_at: "2026-07-28T22:15:00Z"
    last_updated_by: "claude"
    recent_action: "Ran three live capability probes and recorded the matrix"
    next_safe_action: "Hand fixed tiers to phases 003, 004, 005 for adapters"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-002-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin Stop decision:block forces continuation (live transcript proof)."
      - "Pi types.d.ts exposes turn_end/agent_end/agent_settled, all subscribable."
      - "Cursor preToolUse agent_message does not reach model-visible context."
---
# Tasks: Cross-runtime goal hook capability probes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm live session access (or document absence) for a Devin probe session [EVIDENCE: `command -v devin` resolved to `/Users/michelkerkmeester/.local/bin/devin`; `devin auth status` returned "Logged in".]
- [x] T002 Confirm live session access (or document absence) for a Cursor probe session [EVIDENCE: `command -v cursor-agent` resolved to `/Users/michelkerkmeester/.local/bin/cursor-agent`; `cursor-agent --version` returned `2026.07.23-e383d2b`.]
- [x] T003 [P] Locate Pi's installed `types.d.ts` on disk and confirm it is readable [EVIDENCE: `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts`, 1264 lines, read directly.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Probe (a): read Pi's `types.d.ts` event-type declarations for a usable turn-end/agent-loop event [EVIDENCE: `TurnEndEvent` (types.d.ts:549), `AgentEndEvent` (types.d.ts:534), `AgentSettledEvent` (types.d.ts:539), all subscribable via `ExtensionContext.on(...)` at types.d.ts:867-870.]
- [x] T005 [P] Probe (b): dispatch a live Devin session with a test `Stop` hook returning `decision:"block"`; observe actual continuation behavior [EVIDENCE: isolated `/tmp` workspace, real `.devin/hooks.v1.json` untouched; session transcript `~/.local/share/devin/cli/transcripts/caring-diver.json` shows the block reason injected as a synthetic user turn (step 9) and a genuine new agent turn in response (step 10); `stop_hook_active` false→true across two Stop firings.]
- [x] T006 [P] Probe (c): dispatch a live Cursor session with a test `preToolUse` hook attempting an `agent_message` refresh; observe actual delivery [EVIDENCE: isolated `/tmp` workspace, real `.cursor/hooks.json` untouched; raw transcript `~/.cursor/projects/private-tmp-cli-cursor-pretooluse-probe-*/agent-transcripts/*.jsonl` contains zero occurrences of the injected marker token; confirmed non-delivery into model-visible context.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Populate the capability matrix in `spec.md` with all three probe results, each cited by evidence (`spec.md`) [EVIDENCE: `spec.md` §5 table populated + full evidence table in `capability-matrix.md`, no TBD cells.]
- [x] T008 Update phases 003/004/005 `spec.md` scope sections to reference the fixed tiers instead of open questions [EVIDENCE: `003-devin-goal-hooks/spec.md`, `004-cursor-goal-hooks/spec.md`, `005-pi-goal-hooks/spec.md` scope/open-questions sections edited to cite the fixed tiers.]
- [x] T009 Run `validate.sh --strict` on this folder and resolve any errors [EVIDENCE: see `implementation-summary.md` Verification table.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Capability matrix fully populated, no `TBD` cells
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
