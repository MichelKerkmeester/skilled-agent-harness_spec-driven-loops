---
title: "Tasks: Devin hook adapter layer"
description: "Task breakdown for building the Devin hook adapter layer: schema re-verification, thin adapter implementation, and live smoke testing."
trigger_phrases: ["devin hook adapter tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored task breakdown; all tasks unchecked, phase Planned"
    next_safe_action: "Wait for phase 003, then start T001 live schema re-verification"
    blockers: ["depends on 003-cli-devin-skill-packet landing first"]
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

- [ ] T001 Re-verify Devin's live hook JSON schema for `SessionStart`/`UserPromptSubmit` against `docs.devin.ai/cli/extensibility/hooks/{overview,lifecycle-hooks}.md` and a real fired event (verification task, no file)
- [ ] T002 Confirm `.devin/hooks.v1.json` discovery order against a live test project (verification task, no file)
- [ ] T003 [B] Resolve ADR-001 (hand-built vs. native import vs. hybrid) before writing adapter code (`decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `hooks/devin/shared.ts` mirroring `hooks/codex/shared.ts`'s payload-validate / spawn-claude-adapter / emit-envelope shape (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts`)
- [ ] T005 [P] Create `hooks/devin/session-start.ts` delegating to `session-prime.js` (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-start.ts`)
- [ ] T006 [P] Create `hooks/devin/user-prompt-submit.ts` delegating to `user-prompt-submit.js` (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts`)
- [ ] T007 [P] Create `runtime/hooks/devin/spec-gate-classify.mjs` wired to `spec-gate-core.mjs` (`.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs`)
- [ ] T008 [P] Create `runtime/hooks/devin/spec-gate-enforce.mjs`, mapping Devin's tool-call vocabulary onto the core's `bash`/`write`/`edit` vocabulary (`.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs`)
- [ ] T009 Author `.devin/hooks.v1.json` registering both wired events against the compiled adapters (`.devin/hooks.v1.json`)
- [ ] T010 [P] Author `hooks/devin/README.md` and `runtime/hooks/devin/README.md` mirroring the Codex siblings' documentation shape (`.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Unit-test adapters against fixture payloads (new vitest file mirroring `hook-completion-evidence-stop.vitest.ts`)
- [ ] T012 Live-smoke both events against the installed `devin` binary, capturing stdin/stdout evidence (manual verification task, no file)
- [ ] T013 Diff `hooks/claude/**` and `runtime/lib/spec-gate/**` against pre-phase state to confirm zero behavioral rewrite (verification task, no file)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Both wired events pass the live smoke test with captured evidence
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
