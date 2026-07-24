---
title: "Tasks: Devin hook adapter layer"
description: "Task breakdown for building the Devin hook adapter layer: schema re-verification, thin adapter implementation, and live smoke testing."
trigger_phrases: ["devin hook adapter tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-24T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 13 tasks complete; T012 live-smoke returned a confirmed negative"
    next_safe_action: "Phase 008 can begin; same dormant-hooks caveat applies"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Hooks never fire under devin -p; adapters built dormant per operator's explicit choice."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin hook adapter layer

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|---|---|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-verify Devin's live hook JSON schema for `SessionStart`/`UserPromptSubmit` against a real fired event -- **result: no event fires under `-p`**, confirmed via a real dispatched tool call producing zero probe log entries (verification task, no file)
- [x] T002 Confirm `.devin/hooks.v1.json` discovery order against a live test project -- **result: never consulted in `-p` mode**, confirmed via deliberately malformed JSON producing zero parse errors; `.devin/config.json`'s `"hooks"` key and `--agent-config` were also tried and ruled out (verification task, no file)
- [x] T003 Resolve ADR-001 (hand-built vs. native import vs. hybrid) before writing adapter code -- Accepted, revised with the confirmed dormancy finding (`decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `hooks/devin/shared.ts` mirroring `hooks/codex/shared.ts`'s payload-validate / spawn-claude-adapter / emit-envelope shape (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts`)
- [x] T005 [P] Create `hooks/devin/session-start.ts` delegating to `session-prime.js` (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-start.ts`)
- [x] T006 [P] Create `hooks/devin/user-prompt-submit.ts` delegating to `user-prompt-submit.js` (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts`)
- [x] T007 [P] Create `runtime/hooks/devin/spec-gate-classify.mjs` wired to `spec-gate-core.mjs` (`.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs`)
- [x] T008 Descoped to phase 008: `spec-gate-enforce.mjs` (`PreToolUse`) contradicted this phase's own 2-event scope statement in the original Files-to-Change table; resolved in favor of the scope statement, not the table.
- [x] T009 `.devin/hooks.v1.json` deliberately NOT authored/committed -- registering a config path confirmed dead under `-p` dispatch would misrepresent coverage as active. The shape is documented in both README.md files instead.
- [x] T010 [P] Author `hooks/devin/README.md` and `runtime/hooks/devin/README.md`, documenting the dormant status and full live-verification evidence table (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Direct-invoke both compiled adapters plus `spec-gate-classify.mjs` with realistic payloads (valid, malformed, missing-required-field) -- all behave correctly (fail-open confirmed); a dedicated vitest file was not added since the adapters cannot be live-fired to test against (manual verification, no committed test file)
- [x] T012 Live-smoke both events against the installed `devin` binary -- **result: zero firings across every registration path tested**; this negative result IS the captured evidence (see decision-record.md ADR-001, README.md §2)
- [x] T013 Diff `hooks/claude/**` and `runtime/lib/spec-gate/**` against pre-phase state -- confirmed zero behavioral rewrite (`git diff --stat` empty)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both wired events were live-smoke-tested; the captured evidence is a confirmed negative (zero firings under `-p`), documented honestly rather than assumed positive
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- `../003-cli-devin-skill-packet/spec.md`, `../005-devin-model-registry-and-quota/spec.md`
<!-- /ANCHOR:cross-refs -->
