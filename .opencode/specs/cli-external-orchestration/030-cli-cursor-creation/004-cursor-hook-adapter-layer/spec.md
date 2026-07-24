---
title: "Feature Specification: Cursor hook adapter layer"
description: "Add thin Cursor hook adapters over this repo's runtime-neutral guard-hook cores so the repo guard hooks fire when cli-cursor is the dispatched CLI executor, registered via a project-level .cursor/hooks.json - accounting for Cursor's editor-shared config surface and its documented CLI partial-event-delivery caveat."
trigger_phrases: ["cursor hook adapters", "cursor hooks.json", "cursor guard hooks", "cursor lifecycle hooks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase 004 spec; status Planned"
    next_safe_action: "Wait for phase 003, then live-verify per-event CLI hook delivery"
    blockers: ["depends on 003-cli-cursor-skill-packet landing first", "Cursor CLI per-event hook delivery unverified until implementation-time check"]
    key_files: ["plan.md", "tasks.md", "checklist.md", "decision-record.md", "../003-cli-cursor-skill-packet/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does the Cursor CLI (vs. the editor) actually fire every event registered in .cursor/hooks.json? A community report says not all events are delivered - verify per-event live.", "Registering a project .cursor/hooks.json affects Cursor-EDITOR users of this repo too, not just dispatched CLI sessions - is that acceptable, or is dispatch-scoped isolation needed?", "Which of the repo's guard hooks map onto which Cursor events beyond the sessionStart/beforeSubmitPrompt/stop core."]
    answered_questions: ["cli-codex precedent confirmed live at mcp-server/hooks/codex/ and runtime/hooks/codex/, both directories exist. Cursor's AGENTS.md/CLAUDE.md import is rules-only and cannot substitute for hook enforcement."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Cursor hook adapter layer

---

## EXECUTIVE SUMMARY

Add thin Cursor-host hook adapters over this repo's existing runtime-neutral guard-hook cores, mirroring the proven `cli-codex` adapter pattern, so the repo's guard hooks fire when Cursor is the dispatched CLI executor — registered through a project-level `.cursor/hooks.json`.

**Key Decisions**: Register via a project-level `.cursor/hooks.json` and accept that it also applies to Cursor-editor users of this repo (ADR-001); start with the confirmed-delivered core events and live-verify per-event CLI delivery before extending (ADR-002), because Cursor's CLI is documented not to deliver every editor hook event.

**Critical Dependencies**: Phase 003 (cli-cursor skill packet + hub registration) must land first.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../003-cli-cursor-skill-packet/spec.md` |
| **Successor** | `../005-cursor-model-registry-and-routing/spec.md` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo enforces its scope-lock, spec-folder, quality, and completion-evidence discipline through 7 guard hooks. `cli-codex` already has thin per-CLI adapters for this: `system-spec-kit/mcp-server/hooks/codex/` plus runtime-neutral gate wiring at `system-spec-kit/runtime/hooks/codex/` (both directories confirmed live). `cli-cursor` has no sibling adapters, so when another AI dispatches a `cursor-agent` subprocess into this repo today, none of these guard hooks fire — an enforcement blind spot identical to the one `cli-codex` closed for Codex.

Cursor's hook system makes this materially different from Devin's or Codex's, in two ways this phase must handle rather than paper over. First, **Cursor's hooks are shared with the Cursor editor**: they live in `.cursor/hooks.json` (project), `~/.cursor/hooks.json` (user), and enterprise paths — not a tool-private namespace like `.codex/hooks.json` or `.devin/hooks.v1.json`. Registering guard adapters in a project `.cursor/hooks.json` therefore also affects anyone using the Cursor *editor* on this repo. Second, the Cursor **CLI is documented (community-reported) not to deliver every hook event** the editor does, so which events actually fire under a dispatched `cursor-agent` must be verified per-event, not assumed from the editor's event list.

### Purpose
Add the equivalent sibling adapter directories (`mcp-server/hooks/cursor/`, `runtime/hooks/cursor/`) so this repo's guard hooks fire correctly under a dispatched Cursor executor, registered through a project-level `.cursor/hooks.json`, starting with the core events (`sessionStart`, `beforeSubmitPrompt`, `stop`) and live-verifying per-event CLI delivery before extending to the shell/MCP/file guard events.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build `cli-cursor` hook adapters mirroring the confirmed live `cli-codex` sibling structure: `mcp-server/hooks/cursor/` (thin adapters + shared translation layer + README) and `runtime/hooks/cursor/` (runtime-neutral spec-gate wiring).
- Register the adapters in a project-level `.cursor/hooks.json` for at minimum `sessionStart`, `beforeSubmitPrompt`, and `stop`, using Cursor's documented `{ "version": 1, "hooks": { "<event>": [ { "command": ... } ] } }` schema.
- Translate between Cursor's hook payload/response envelope (`{permission: allow|deny|ask, user_message, agent_message}`, exit 0 = succeed / exit 2 = block) and the neutral cores' contract.
- Live smoke test the JSON stdin/stdout round trip against the installed `cursor-agent` binary for each wired event, confirming per-event delivery (not just static config presence).
- Record explicit architecture decisions on (ADR-001) registration scope given the editor-shared config surface, and (ADR-002) the event-mapping and CLI partial-delivery strategy.

### Out of Scope
- `ADVISOR_RUNTIME_VALUES` enum changes — this is a hosting-runtime concern (Cursor acting as the primary assistant), not a dispatched-executor concern (this phase).
- Modifying the runtime-neutral hook cores themselves (`hooks/claude/*.ts` implementations, `runtime/lib/spec-gate/spec-gate-core.mjs`, `lib/hooks/completion-evidence-sentinel.cjs`) — adapters translate only.
- Wiring all guard hooks in this phase's first pass — start with the confirmed-delivered core events; extend to shell/MCP/file/edit guard events incrementally once per-event CLI delivery is live-verified.
- Reusing Cursor's native `AGENTS.md`/`CLAUDE.md` rules import as a substitute for hooks — that import is rules-only (context), not enforcement; it cannot block a shell command or gate completion the way a hook can. Documented in `decision-record.md` so it is not mistaken for a shortcut.
- The `~/.cursor/hooks.json` user-global registration path — using an operator-global config to enforce a single repo's guards is out of scope (blast radius far beyond this repo); project-level is the chosen scope (ADR-001).

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/**` (`shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `session-stop.ts`, `README.md`; more as later events are wired) | Create | 004 | Thin Cursor-host adapters delegating to the existing `hooks/claude/*.ts` implementations, mirroring `hooks/codex/`. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/**` (`spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, `README.md`) | Create | 004 | Cursor-side wiring into the shared `runtime/lib/spec-gate/spec-gate-core.mjs`, mirroring `runtime/hooks/codex/`. |
| `.cursor/hooks.json` (project-level) | Create | 004 | Native Cursor hook registration for the wired events, mapping Cursor event names to the adapter commands. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Adapters exist for at least `sessionStart`, `beforeSubmitPrompt`, and `stop` (the Cursor analogs of the codex precedent's first-proven events). | P0 |
| REQ-002 | `.cursor/hooks.json` correctly registers those adapters using Cursor's documented `{version, hooks:{<event>:[{command, timeout?, type?, matcher?}]}}` schema, and the adapters honor the `{permission: allow\|deny\|ask, ...}` + exit-code-2-blocks response contract. | P0 |
| REQ-003 | A live smoke test confirms each wired event actually fires under the installed `cursor-agent` CLI (not just the editor), capturing stdin/stdout evidence — directly addressing the documented CLI partial-event-delivery caveat. | P0 |
| REQ-004 | This phase does not modify `ADVISOR_RUNTIME_VALUES` and does not modify the runtime-neutral hook cores. | P0 |

### P1 - Required
| ID | Requirement | Priority |
|---|---|---|
| REQ-005 | `decision-record.md` records ADR-001 (registration scope given the editor-shared config) and ADR-002 (event mapping + CLI partial-delivery strategy), each with a status and explicit re-evaluation/verification trigger. | P1 |
| REQ-006 | Runtime-neutral hook cores remain unmodified (`git diff` empty for `hooks/claude/**`, `runtime/lib/spec-gate/**`, `lib/hooks/completion-evidence-sentinel.cjs`); adapters translate only. | P1 |
| REQ-007 | The blast-radius consequence of a project `.cursor/hooks.json` (it also applies to Cursor-editor users of this repo) is documented in the adapters' README and `decision-record.md`, and the adapters fail open so an editor user is never blocked by a malformed payload. | P1 |

### P2 - Nice-to-have
| ID | Requirement | Priority |
|---|---|---|
| REQ-008 | The remaining repo guard hooks beyond the core events get adapters extended incrementally, each mapped to its corresponding Cursor event (`beforeShellExecution`/`beforeMCPExecution`/`beforeReadFile` for the spec-gate/permission guards, `afterFileEdit` for post-edit quality, `preCompact` for compaction, `sessionEnd` for teardown); exact sequencing decided at implementation time, only for events confirmed to fire under the CLI. | P2 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: The installed `cursor-agent` binary recognizes and fires the wired hook adapters in a live session, confirmed by captured stdin/stdout evidence, not just static config presence.
- **SC-002**: Neutral hook cores show zero behavioral diff (`git diff` empty for the core paths against pre-phase state).
- **SC-003**: `decision-record.md`'s ADR-001 and ADR-002 each have a recorded status and an explicit verification/re-evaluation trigger.
- **SC-004**: For any Cursor event the CLI does NOT deliver (per REQ-003 verification), the gap is documented, not silently assumed closed.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | The Cursor CLI does not fire an event the adapter registered (documented partial-delivery gap) | A guard silently never runs under CLI dispatch | Live-verify per-event delivery (REQ-003); document any non-delivered event as an open gap, do not assume closure |
| Risk | Project `.cursor/hooks.json` also fires for Cursor-editor users of this repo | Editor users get guard behavior they didn't opt into | Adapters fail open; document the blast radius (REQ-007); the guards enforce repo discipline regardless of client, so this is largely intended |
| Risk | Cursor's hook JSON schema differs subtly from the Claude/Codex dialect (matcher syntax, response field names, exit-code semantics) | Adapters silently no-op or crash | Live-verify every field against a real fired `cursor-agent` event before marking it done |
| Dependency | Phase 003 (skill packet + hub registration) | No `cli-cursor` mode exists yet for this phase's hook context to attach to | Do not start 004 implementation before 003's exit criteria are met |
| Risk | `cursor-agent` binary absent on a given machine | A hook registration references a tool that can't run | Fail-closed executor precedent (phase 002): guards only matter when `cursor-agent` is actually on PATH |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Hook adapters add no perceptible latency to Cursor's turn loop; thin delegation only, matching the codex precedent's translation-only design.

### Security
- **NFR-S01**: No credentials or secrets pass through hook stdin/stdout logging; adapters may read event fields but must not log raw payload contents that could contain user secrets.

### Reliability
- **NFR-R01**: Every adapter fails open (returns `{permission: allow}` / no-ops) on a malformed or missing stdin payload, matching the fail-open discipline documented for `runtime/hooks/codex/` and protecting editor users (REQ-007).

---

## 8. EDGE CASES

### Data Boundaries
- `cursor-agent` absent from `PATH`: hooks never fire because there is no host to invoke them; an accepted no-op, not a regression.
- `.cursor/hooks.json` present but malformed JSON: Cursor's loader behavior in that case is unconfirmed — verify at implementation time before shipping the file, since a malformed project file could also degrade the editor experience.

### Error Scenarios
- An event registered but not delivered by the CLI (partial-delivery caveat): treated as an open, documented gap; the corresponding guard is marked "editor-only until CLI delivery is confirmed", never silently assumed active.
- Cursor's `stop` hook `loop_limit` semantics differ from Codex's `Stop` event: confirm live before relying on stop-hook re-entry behavior.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|---|---|---|
| Scope | 15/25 | ~10 new files (2 adapter directories + 1 config file), thin delegation, 1 new CLI host |
| Risk | 19/25 | Editor-shared config blast radius + documented CLI partial-event-delivery gap; new external hook JSON dialect unconfirmed at the field level |
| Research | 15/20 | Per-event CLI delivery and schema fields require implementation-time live verification, not just documentation |
| Multi-Agent | 5/15 | Single workstream |
| Coordination | 8/15 | Depends on phase 003 landing first; loosely blocks phase 005 |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Cursor CLI does not deliver a registered event | M | M | Live-verify per-event; document non-delivered events as open gaps |
| R-002 | Project `.cursor/hooks.json` affects Cursor-editor users of the repo | M | H | Fail-open adapters; document blast radius; guards are repo-discipline enforcement |
| R-003 | Cursor hook schema/field/exit-code differs from the Claude/Codex dialect | M | M | Live-verify every field before marking an event done |
| R-004 | `cursor-agent` binary absent | L | M | Fail-closed executor precedent (phase 002) |

---

## 11. USER STORIES

### US-001: Guard hooks fire under a dispatched Cursor executor (Priority: P0)

**As a** dispatching AI or orchestration script, **I want** this repo's spec-gate and quality guard hooks to fire when Cursor is the executor doing the work, **so that** dispatching to Cursor does not create the enforcement blind spot that dispatching to Codex or Claude Code does not.

**Acceptance Criteria**:
1. Given a Cursor session with `.cursor/hooks.json` registered, When a `sessionStart` or `beforeSubmitPrompt` event fires under the CLI, Then the adapter delegates to the existing neutral core and returns a valid Cursor-shaped response envelope.

### US-002: Operator understands the editor-shared blast radius (Priority: P1)

**As an** operator, **I want** the fact that a project `.cursor/hooks.json` also applies to Cursor-editor users of this repo recorded explicitly, **so that** the shared-config consequence is a documented decision, not a surprise.

**Acceptance Criteria**:
1. Given `decision-record.md` ADR-001, When the registration scope is chosen, Then the editor-blast-radius consequence and the fail-open mitigation are both recorded.

---

## 12. OPEN QUESTIONS

- Does the Cursor CLI (as opposed to the editor) actually fire every event registered in `.cursor/hooks.json`? A community report says not all events are delivered — verify per-event live before claiming any guard is active under CLI dispatch (see `decision-record.md` ADR-002).
- Is a project-level `.cursor/hooks.json` (which also applies to Cursor-editor users of this repo) acceptable, or is a dispatch-scoped isolation mechanism (e.g. a generated hooks.json in the lineage cwd, or `--workspace` config isolation) needed? ADR-001 chooses project-level with fail-open mitigation; revisit if editor impact is unacceptable.
- Which of the repo's guard hooks map onto which Cursor events beyond the `sessionStart`/`beforeSubmitPrompt`/`stop` core is decided at implementation time, only for events confirmed to fire under the CLI.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this phase)
- `../003-cli-cursor-skill-packet/spec.md` (predecessor — hub registration this phase's adapters attach to)
- `../005-cursor-model-registry-and-routing/spec.md` (successor)
- `../001-cursor-contract-pin/implementation-summary.md` (live Cursor hooks contract: events, schema, discovery, envelope, partial-delivery caveat)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/codex/README.md` (structural precedent)
- `../spec.md` (phase-parent packet)
