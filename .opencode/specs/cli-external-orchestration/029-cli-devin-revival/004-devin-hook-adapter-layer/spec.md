---
title: "Feature Specification: Devin hook adapter layer"
description: "Add thin Devin hook adapters over this repo's runtime-neutral guard-hook cores so all 7 guard hooks (spec-gate enforce/classify, dispatch preflight lint, post-edit quality, code-graph freshness, dispatch audit, completion-evidence sentinel, mcp route guard) fire correctly when cli-devin is the dispatched CLI executor, mirroring the proven cli-codex adapter pattern."
trigger_phrases: ["devin hook adapters", "devin hooks.v1.json", "devin guard hooks", "Devin lifecycle hooks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase 004 spec/plan/tasks/checklist/decision-record; status Planned"
    next_safe_action: "Wait for phase 003, then live-verify Devin hook schema before adapter code"
    blockers: ["depends on 003-cli-devin-skill-packet landing first", "read_config_from.claude fidelity unverified until implementation-time check"]
    key_files: ["plan.md", "tasks.md", "checklist.md", "decision-record.md", "../003-cli-devin-skill-packet/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does read_config_from.claude import Claude Code's own hooks in the schema .devin/hooks.v1.json expects, or only simpler context? Verify at implementation time, see decision-record.md ADR-001", "Function-by-function parity between future hooks/devin/ adapters and live hooks/codex/ siblings not verified line-by-line at authoring time", "Mapping of remaining guard hooks to Devin's 8 lifecycle events beyond SessionStart/UserPromptSubmit not decided this phase"]
    answered_questions: ["cli-codex precedent confirmed live at mcp-server/hooks/codex/ and runtime/hooks/codex/, both directories exist exactly as described", "ADVISOR_RUNTIME_VALUES confirmed live as exactly ['claude','copilot','opencode'] - dispatched-executor hook parity and the hosting-runtime enum are separate concerns"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Devin hook adapter layer

---

## EXECUTIVE SUMMARY

Add thin Devin-host hook adapters over this repo's existing runtime-neutral guard-hook cores, mirroring the proven `cli-codex` adapter pattern, so all 7 guard hooks fire correctly when Devin is the dispatched CLI executor.

**Key Decisions**: Start with hand-built adapters (ADR-001 in `decision-record.md`), deferring Devin's native `read_config_from.claude` import until its fidelity is verified.

**Critical Dependencies**: Phase 003 (cli-devin skill packet + hub registration) must land first.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `../003-cli-devin-skill-packet/spec.md` |
| **Successor** | `../005-devin-model-registry-and-quota/spec.md` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo enforces its scope-lock, spec-folder, quality, and completion-evidence discipline through 7 guard hooks (spec-gate enforce/classify, dispatch preflight lint, post-edit quality, code-graph freshness, dispatch audit, completion-evidence sentinel, mcp route guard). `cli-codex` already has thin per-CLI adapters for this: `system-spec-kit/mcp-server/hooks/codex/` (confirmed live: `session-start.ts`, `user-prompt-submit.ts`, `session-stop.ts`, `compact-inject.ts`, `completion-evidence-stop.cjs`, `shared.ts`, `README.md`) plus runtime-neutral gate wiring at `system-spec-kit/runtime/hooks/codex/` (`spec-gate-enforce.mjs`, `spec-gate-classify.mjs`). `cli-devin` has no sibling adapters, so when another AI dispatches a Devin subprocess into this repo today, none of these 7 guard hooks fire - a real enforcement blind spot identical to the one `cli-codex` closed for the Codex CLI.

### Purpose
Add the equivalent sibling adapter directories (`mcp-server/hooks/devin/`, `runtime/hooks/devin/`) so this repo's guard hooks fire correctly under a dispatched Devin executor, starting with the two events (`SessionStart`, `UserPromptSubmit`) that the codex precedent itself proved out first.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build `cli-devin` hook adapters mirroring the confirmed live `cli-codex` sibling structure: `mcp-server/hooks/devin/` (thin adapters + shared translation layer + README) and `runtime/hooks/devin/` (runtime-neutral spec-gate wiring).
- Register the adapters in project-level `.devin/hooks.v1.json` (Devin's recommended standalone hook config form) for at minimum `SessionStart` and `UserPromptSubmit`.
- Live smoke test the JSON stdin/stdout round trip against the installed `devin` binary for each wired event.
- Record an explicit architecture decision on hand-built adapters vs. native `read_config_from.claude` import vs. hybrid (`decision-record.md`).

### Out of Scope
- `ADVISOR_RUNTIME_VALUES` enum changes - confirmed live as exactly `['claude', 'copilot', 'opencode']` today; this is a hosting-runtime concern (Devin acting as the primary assistant), not a dispatched-executor concern (this phase).
- `system-skill-advisor/hooks/devin/` (the deleted D5 IDE-runtime hooks surface) and `runtime-parity.vitest.ts` - a separate, optional follow-on the operator has not asked for, matching the phase-parent spec's own Open Question 2.
- Wiring all 7 guard hooks in this phase's first pass - start with `SessionStart`/`UserPromptSubmit`; extend to the remaining hooks incrementally once those two are live-verified.
- Rewriting the runtime-neutral hook cores themselves (`hooks/claude/*.ts` implementations, `runtime/lib/spec-gate/spec-gate-core.mjs`, `lib/hooks/completion-evidence-sentinel.cjs`) - adapters translate only, matching the codex precedent's "no lifecycle logic is duplicated" design.

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/**` (`shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `README.md`; additional adapters as later hooks are wired) | Create | 004 | Thin Devin-host adapters delegating to the existing `hooks/claude/*.ts` implementations, mirroring `hooks/codex/`. |
| `.opencode/skills/system-spec-kit/runtime/hooks/devin/**` (`spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, `README.md`) | Create | 004 | Devin-side wiring into the shared `runtime/lib/spec-gate/spec-gate-core.mjs`, mirroring `runtime/hooks/codex/`. |
| `.devin/hooks.v1.json` (project-level) | Create | 004 | Native Devin hook registration for the wired events. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Adapters exist for at least `SessionStart` and `UserPromptSubmit`, matching the two events the codex precedent proved out first. | P0 |
| REQ-002 | `.devin/hooks.v1.json` correctly registers the `SessionStart` and `UserPromptSubmit` adapters using Devin's documented `{type, matcher?, command\|prompt, timeout?}` entry shape. | P0 |
| REQ-003 | A live smoke test confirms the JSON stdin/stdout contract round-trips against the installed `devin` binary for each wired event. | P0 |
| REQ-004 | This phase does not modify `ADVISOR_RUNTIME_VALUES`, does not touch `system-skill-advisor/hooks/devin/`, and does not touch `runtime-parity.vitest.ts`. | P0 |

### P1 - Required
| ID | Requirement | Priority |
|---|---|---|
| REQ-005 | `decision-record.md` records the hook-adapter-strategy ADR, choosing hand-built adapters as the starting approach and flagging `read_config_from.claude` for later re-evaluation. | P1 |
| REQ-006 | Runtime-neutral hook cores (`spec-gate-core.mjs`, `hooks/claude/*.ts`, `completion-evidence-sentinel.cjs`) remain unmodified; adapters translate only. | P1 |
| REQ-007 | `.devin/hooks.v1.json` discovery order (standalone file vs. the `hooks` key in `.devin/config.json`/`.devin/config.local.json`) is confirmed live before the file is shipped. | P1 |

### P2 - Nice-to-have
| ID | Requirement | Priority |
|---|---|---|
| REQ-008 | The remaining repo guard hooks beyond `SessionStart`/`UserPromptSubmit` get adapters extended incrementally, each mapped to its corresponding Devin lifecycle event; exact sequencing is decided at implementation time, not this phase. | P2 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: The installed `devin` binary recognizes and fires both wired hook adapters in a live session, confirmed by captured stdin/stdout evidence, not just static config presence.
- **SC-002**: Neutral hook cores show zero behavioral diff (`git diff` empty for `hooks/claude/**`, `runtime/lib/spec-gate/**`, `lib/hooks/completion-evidence-sentinel.cjs` against pre-phase state).
- **SC-003**: `decision-record.md`'s ADR-001 has a recorded status and an explicit re-evaluation trigger for `read_config_from.claude`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Devin's hook JSON schema differs subtly from the Claude/Codex dialect (matcher regex syntax, timeout units, decision field names) | Adapters silently no-op or crash | Live-verify every field against a real fired `devin` event before marking an event done, not just against `docs.devin.ai` |
| Risk | `read_config_from.claude` import fidelity is unverified | Choosing native import over hand-built adapters could silently drop parity | Decision-record defers native import until fidelity is confirmed; start with hand-built (ADR-001) |
| Dependency | Phase 003 (skill packet + hub registration) | No `cli-devin` mode exists yet for this phase's hook context to attach to if 003 hasn't landed | Track the phase-map handoff criteria; do not start 004 implementation before 003's exit criteria are met |
| Risk | `devin` binary absent on a given machine | A hook registration references a tool that can't run | Fail-closed pattern matching the `cli-codex`/`cli-devin` executor precedent: check `command -v devin` before relying on any hook firing |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Hook adapters add no perceptible latency to Devin's turn loop; thin delegation only, no new heavy computation, matching the codex precedent's translation-only design.

### Security
- **NFR-S01**: No credentials or secrets pass through hook stdin/stdout logging; adapters may read `session_id`/`tool_name`/`tool_input` but must not log raw payload contents that could contain user secrets.

### Reliability
- **NFR-R01**: Every adapter fails open (approves/no-ops) on a malformed or missing stdin payload, matching the fail-open discipline already documented for `runtime/hooks/codex/`.

---

## 8. EDGE CASES

### Data Boundaries
- `devin` binary absent from `PATH` entirely: hooks never fire because there is no host to invoke them; this is an accepted no-op, not a regression, per phase 002's fail-closed executor precedent.
- `.devin/hooks.v1.json` present but malformed JSON: Devin's own loader behavior in that case is unconfirmed from the fetched documentation - verify at implementation time before shipping the file.

### Error Scenarios
- Nested `.devin/config.json` vs. `.devin/config.local.json` vs. standalone `hooks.v1.json`: Devin's documented discovery/precedence order must be confirmed live, not assumed, before choosing which file the adapters register against.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|---|---|---|
| Scope | 15/25 | Files: ~10 new (2 adapter directories + 1 config file), LOC: low (thin delegation pattern), Systems: 1 new CLI host |
| Risk | 18/25 | Auth: N/A, API: new external hook JSON schema unconfirmed at the field level, Breaking: no - additive only |
| Research | 15/20 | `read_config_from.claude` fidelity requires implementation-time live verification, not just documentation |
| Multi-Agent | 5/15 | Single workstream; no parallel-agent coordination required |
| Coordination | 8/15 | Depends on phase 003 landing first; loosely blocks phase 005's model-registry work |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Devin hook JSON schema differs from the Claude/Codex dialect at the field level | M | M | Live-verify every field before marking an event done |
| R-002 | `read_config_from.claude` import silently drops hook fidelity if chosen prematurely | H | L | Decision-record defers native import until verified (ADR-001) |
| R-003 | `devin` binary absent | L | M | Fail-closed `command -v devin` guard, matching the `cli-codex`/`cli-devin` executor precedent |

---

## 11. USER STORIES

### US-001: Guard hooks fire under a dispatched Devin executor (Priority: P0)

**As a** dispatching AI or orchestration script, **I want** this repo's spec-gate and quality guard hooks to fire when Devin is the executor doing the work, **so that** dispatching to Devin does not create an enforcement blind spot the way dispatching to Codex or Claude Code does not.

**Acceptance Criteria**:
1. Given a Devin session with `.devin/hooks.v1.json` registered, When a `SessionStart` or `UserPromptSubmit` event fires, Then the adapter delegates to the existing neutral core and returns a valid Devin-shaped response envelope.

---

### US-002: Operator can trust the adapter-vs-native-import decision (Priority: P1)

**As an** operator evaluating future maintenance burden, **I want** the `read_config_from.claude` native-import path evaluated and recorded rather than silently assumed, **so that** a future phase can confidently simplify the adapter layer if the native path turns out reliable.

**Acceptance Criteria**:
1. Given `decision-record.md` ADR-001, When phase 004 implementation begins, Then the first task is verifying `read_config_from.claude` fidelity before writing adapter code against the wrong strategy.

---

## 12. OPEN QUESTIONS

- Does Devin's `read_config_from.claude` import ingest Claude Code's own hooks (the `hooks` key in `.claude/settings.json`) in the same schema `.devin/hooks.v1.json` expects, or only simpler rules/instructions-style context? Unconfirmed from fetched documentation - verify at implementation time (see `decision-record.md` ADR-001).
- Exact function-by-function parity between the future `hooks/devin/` adapters and the live `hooks/codex/` siblings (`shared.ts`'s spawn/translate helpers, matcher syntax, timeout semantics) was not verified line-by-line at authoring time - confirm against the live codex files when implementation starts.
- Which of the 7 repo guard hooks map onto which of Devin's 8 native lifecycle events beyond `SessionStart`/`UserPromptSubmit` is not decided in this phase - sequencing and mapping happen at implementation time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this phase)
- `../003-cli-devin-skill-packet/spec.md` (predecessor - hub registration this phase's adapters attach to)
- `../005-devin-model-registry-and-quota/spec.md` (successor)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/codex/README.md` (structural precedent)
- `../spec.md` (phase-parent packet)
