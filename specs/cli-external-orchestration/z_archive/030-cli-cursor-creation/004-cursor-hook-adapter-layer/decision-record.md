---
title: "Decision Record: Cursor hook adapter layer"
description: "Two ADRs: hook registration scope given Cursor's editor-shared config surface, and the event-mapping + CLI partial-event-delivery strategy."
trigger_phrases: ["cursor hook adapter decision record", "cursor hooks.json scope decision"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored ADR-001 and ADR-002 for the Cursor hook adapter layer"
    next_safe_action: "Verify per-event CLI delivery before implementation starts"
    blockers: ["Cursor CLI per-event hook delivery is unverified from docs alone"]
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does the Cursor CLI deliver every event registered in .cursor/hooks.json, or only a subset?"]
    answered_questions: []
---
# Decision Record: Cursor hook adapter layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: hook registration scope given Cursor's editor-shared config surface

### Metadata

| Field | Value |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-001-context -->
### Context

This repo enforces its scope-lock and quality discipline through 7 guard hooks. `cli-codex` gets these firing via thin per-CLI adapters at `system-spec-kit/mcp-server/hooks/codex/` plus runtime-neutral gate wiring at `system-spec-kit/runtime/hooks/codex/`, registered in a tool-private `.codex/hooks.json`. `cli-devin`'s planned layer registers in a tool-private `.devin/hooks.v1.json`. `cli-cursor` needs the same coverage, but Cursor's hook config is **not tool-private** — it is shared with the Cursor editor. Cursor loads hooks from `<project-root>/.cursor/hooks.json` (project), `~/.cursor/hooks.json` (user), and enterprise paths (confirmed in phase 001 against `cursor.com/docs/hooks` and the live `~/.cursor/hooks.json`). There is no CLI-only hook file.

We must choose where to register the guard adapters, knowing every option has a different blast radius, and knowing (phase 001) that Cursor's own `AGENTS.md`/`CLAUDE.md` import is rules-only and cannot enforce (block a command, gate completion) the way a hook can.

### Constraints

- Cursor provides no tool-private, CLI-only hook file — the choices are project `.cursor/hooks.json`, user `~/.cursor/hooks.json`, enterprise paths, or a bespoke dispatch-scoped mechanism.
- A project `.cursor/hooks.json` committed to this repo would fire for anyone using the Cursor *editor* on this repo, not just dispatched `cursor-agent` sessions.
- The guard adapters must delegate to the same runtime-neutral cores the codex adapters use, unmodified.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Register the guard adapters in a **project-level** `.cursor/hooks.json` committed to the repo, and accept that it also applies to Cursor-editor users of this repo — mitigated by making every adapter fail open. The `~/.cursor/hooks.json` user-global path is rejected (far too broad); a bespoke dispatch-scoped isolation mechanism is deferred, not built, unless the editor impact proves unacceptable.

**How it works**: `.cursor/hooks.json` maps Cursor event names (`sessionStart`, `beforeSubmitPrompt`, `stop`, and later the shell/MCP/file guards) to the thin `mcp-server/hooks/cursor/*` adapter commands. Because the same guards enforce this repo's discipline regardless of which Cursor client is driving, an editor user getting the same spec-gate/quality behavior as a dispatched CLI is largely a feature, not a defect — and the fail-open design guarantees a malformed payload never blocks an editor user. This mirrors how `.codex/hooks.json` behaves for Codex, adapted to Cursor's shared-config reality.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **Project `.cursor/hooks.json` + fail-open (chosen)** | Direct analog to `.codex/hooks.json`; guards enforce repo discipline for any Cursor client; committed + reviewable | Also applies to Cursor-editor users of this repo | 8/10 |
| User `~/.cursor/hooks.json` | Would not touch the repo tree | Rejected — operator-global; enforces one repo's guards across all the operator's Cursor usage everywhere; wrong blast radius | 2/10 |
| Bespoke dispatch-scoped hooks (generated hooks.json in the lineage cwd / `--workspace` isolation) | CLI-only, zero editor impact | Deferred — adds a config-isolation mechanism Cursor doesn't natively provide; premature before the editor impact is shown to be a real problem | 5/10 |
| Reuse Cursor's `AGENTS.md`/`CLAUDE.md` rules import | Zero hook code | Rejected — rules are context, not enforcement; cannot block a shell command or gate completion | 1/10 |

**Why this one**: The project-level file is the closest working analog to the proven codex pattern, keeps the config committed and reviewable, and — with fail-open adapters — turns the editor-shared blast radius into mostly-desirable repo-discipline enforcement rather than a hazard. Dispatch-scoped isolation stays available as a documented escalation if editor impact is later judged unacceptable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The guard hooks fire under a dispatched Cursor executor, closing the same enforcement blind spot the codex adapters closed for Codex.
- The registration is a committed, reviewable project file, consistent with how the other executors register.

**What it costs**:
- A Cursor-editor user of this repo also triggers the guard adapters. Mitigation: fail-open design (never blocks on malformed input); the guards are repo-discipline enforcement, so shared behavior is largely intended; the blast radius is documented in the adapters' README (REQ-007).

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| An editor user hits an unexpected guard block | M | Adapters fail open; guards mirror the same discipline the repo already enforces; documented in README |
| The operator wants CLI-only enforcement later | L | Dispatch-scoped isolation is documented here as the ready escalation path, not foreclosed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | Guard hooks must fire under a dispatched Cursor executor; `cli-cursor` has no adapters today. |
| 2 | **Beyond Local Maxima?** | PASS | User-global, dispatch-scoped, and rules-import options were each evaluated and scored, not assumed away. |
| 3 | **Sufficient?** | PASS | A project `.cursor/hooks.json` + fail-open adapters closes the enforcement gap for the confirmed-delivered events. |
| 4 | **Fits Goal?** | PASS | Mirrors the `.codex/hooks.json` registration pattern, adapted to Cursor's shared-config reality. |
| 5 | **Open Horizons?** | PASS | Dispatch-scoped isolation remains a documented, non-foreclosed escalation. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp-server/hooks/cursor/README.md` documents the editor-shared blast radius and the fail-open guarantee.
- `.cursor/hooks.json` itself — the architectural decision (project-level, ADR-001) is Accepted, but the operator explicitly chose to defer the actual committed file to a later, separately-approved step during this phase. The adapters exist and are live-verified; only the registration file is outstanding.

**How to roll back**: Once `.cursor/hooks.json` is eventually registered, delete it (removes the editor-blast-radius effect entirely) and the `hooks/cursor/` adapter directories; the neutral cores are untouched. Today, rollback is simply not registering it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: event mapping and CLI partial-event-delivery strategy

### Metadata

| Field | Value |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Cursor's editor exposes ~18 agent hook events (`sessionStart`, `beforeSubmitPrompt`, `beforeShellExecution`, `beforeMCPExecution`, `beforeReadFile`, `afterFileEdit`, `preCompact`, `stop`, `sessionEnd`, and more — confirmed in phase 001). This repo's 7 guard hooks each need to map onto one of those events. Phase 001 flagged (from a community report) that the Cursor **CLI** might not fire every event the editor does. This phase live-verified per-event delivery empirically, using a temporary, uncommitted `.cursor/hooks.json` wiring every documented event to a probe script, then dispatching real `cursor-agent -p` sessions (single-turn and `--continue` multi-turn) that exercised shell commands, file reads, and file writes.

**Confirmed result — the reverse of what was assumed.** The phase's own working assumption (mirroring the Codex precedent's `SessionStart`/`UserPromptSubmit`/`Stop` trio) was that `sessionStart`/`beforeSubmitPrompt`/`stop` would be the safe starting set. Live testing shows:

| Event | Fires under `cursor-agent -p`? | Evidence |
|---|---|---|
| `sessionStart` | **Yes** | Fired once per session, full payload captured |
| `sessionEnd` | **Yes** | Fired once per process, `reason:"completed"`/`final_status:"completed"` |
| `preToolUse` | **Yes** | Fired before every tool call (`Shell`, `Read`, `Grep`, `Write` all observed as `tool_name`) |
| `postToolUse` | **Yes** | Fired after every tool call |
| `beforeShellExecution` / `afterShellExecution` | **Yes** | Fired around every shell command |
| `beforeReadFile` | **Yes** | Fired on file reads, full file content in payload |
| `afterFileEdit` | **Yes** | Fired when the model used its native write/edit tool (not shell redirection) |
| `afterAgentThought` | **Yes** | Fired on reasoning steps |
| `beforeSubmitPrompt` | **No** — confirmed non-delivery | Never fired across 3 separate dispatches, including a `--continue` second turn |
| `stop` | **No** — confirmed non-delivery | Never fired across all 3 dispatches; `sessionEnd` is the actual completion signal under `-p` |
| `postToolUseFailure`, `beforeMCPExecution`, `afterMCPExecution`, `preCompact`, `subagentStart`, `subagentStop`, `afterAgentResponse` | Untested | No failure/MCP/subagent/compaction scenario was triggered in these probes; treat as unconfirmed, not assumed either way |

This inverts the phase's original plan: `beforeSubmitPrompt` (the intended Gate-3-classify attachment point) and `stop` (the intended completion-sentinel attachment point) are the two events from the "safe starting set" that do NOT fire, while `preToolUse` (the single most valuable enforcement point — it wraps every tool call, not just shell) fires reliably and was not even in the original starting-set plan.

### Constraints

- The set of events the CLI actually delivers is now empirically confirmed for the tested set (see table above); untested events remain genuinely unconfirmed, not assumed.
- The codex precedent proved out `SessionStart`/`UserPromptSubmit` first before extending — a start-small, verify-then-extend discipline this phase inherited, but the actual "small start" that survived contact with the live CLI is different from Codex's.
- A guard that is registered but never delivered is worse than an unregistered one, because it looks active while enforcing nothing — this is exactly why `beforeSubmitPrompt`/`stop` must NOT be wired as if they worked.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Wire adapters only to the events empirically confirmed to fire under `cursor-agent -p`: `sessionStart` (lifecycle prime), `preToolUse` (spec-gate enforce — using the generic, always-fires-before-every-tool event rather than the narrower `beforeShellExecution`, since `preToolUse` alone covers `Shell`/`Write`/`Read`/`Grep` and any future tool without needing per-tool-event wiring), and `sessionEnd` (completion signal, replacing the originally-planned `stop`, which is confirmed to never fire under CLI dispatch). `beforeSubmitPrompt` (the intended Gate-3-classify attachment point) has no working CLI attachment point at all and is documented as a confirmed, load-bearing gap, not deferred-but-assumed-workable.

**How it works**: Phase 1 empirically probed every documented event with a temporary, uncommitted `.cursor/hooks.json` and a logging probe script, across 3 live `cursor-agent -p` dispatches (including a `--continue` turn) exercising shell/read/write tool calls. Only confirmed-firing events get real adapters; `postToolUseFailure`/`beforeMCPExecution`/`afterMCPExecution`/`preCompact`/`subagentStart`/`subagentStop`/`afterAgentResponse` remain untested and unwired pending a scenario that actually triggers them. The mapping table lives in `mcp-server/hooks/cursor/README.md` with a per-event "CLI delivery: confirmed-fires / confirmed-non-delivery / untested" column, so coverage is always legible and never overstated.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **Empirically-confirmed-only wiring (chosen)** | Never registers a guard that silently never fires; every wired event has direct captured evidence; `preToolUse` gives broader coverage than the originally-planned per-tool events | `beforeSubmitPrompt`/`stop` genuinely have no working attachment point — Gate-3 classify and a stop-time sentinel cannot be wired as originally planned | 9/10 |
| Blindly wire the originally-planned `sessionStart`/`beforeSubmitPrompt`/`stop` trio (mirroring Codex without verifying) | Matches the codex precedent's exact event names | Rejected — live testing proved 2 of the 3 never fire; would have shipped guards that silently never run | 1/10 |
| Wire all documented events up front (including untested ones) | Fastest to "full coverage" on paper | Rejected — `postToolUseFailure`/MCP/subagent/compaction events remain genuinely untested; wiring them would assert delivery with no evidence | 2/10 |
| Wire nothing until Cursor documents CLI delivery officially | Zero risk of false coverage | Rejected — leaves the enforcement blind spot open indefinitely on an unbounded external-docs timeline, and this phase already has the evidence needed for the confirmed subset | 3/10 |

**Why this one**: Empirical per-event verification is the only approach that closes the enforcement gap while never claiming a guard is active without evidence it fires — directly honoring both the "Finding = hypothesis" verification standard and the discovery that the Codex-mirrored plan was simply wrong about which events fire.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Coverage claims are always backed by live per-event delivery evidence, never by the editor's event list or a sibling CLI's event names.
- `preToolUse` gives the spec-gate enforce adapter broader coverage (every tool, not just shell) than the originally-planned `beforeShellExecution`-only approach would have.
- The README's per-event delivery column keeps the real coverage legible to maintainers, including the confirmed-non-delivery events.

**What it costs**:
- Gate-3 classify (originally planned against `beforeSubmitPrompt`) and a stop-time completion sentinel (originally planned against `stop`) have no confirmed CLI attachment point at all — this is a real capability gap for `cli-cursor` dispatch, not just an incomplete rollout. `sessionEnd` substitutes for a completion-time hook but fires after the fact, unlike `stop`'s presumed pre-completion timing.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| The CLI delivers an event in one build but not a later one (including `beforeSubmitPrompt`/`stop` starting to fire in a future build) | M | The per-event delivery column is re-verified when the `cursor-agent` build changes, not treated as permanent; re-run the same probe methodology this ADR documents |
| A guard mapped to a non-delivered event is assumed active | H | Explicit "confirmed-non-delivery" status recorded for `beforeSubmitPrompt`/`stop`; never assumed closed |
| Gate-3 classify has no working attachment point under `cli-cursor` CLI dispatch | H | Documented explicitly here and in `mcp-server/hooks/cursor/README.md`; the spec-gate ENFORCE path (via `preToolUse`) still blocks unauthorized mutations even though the advisory CLASSIFY question cannot be surfaced pre-emptively |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | The CLI's partial-event delivery is a documented, unresolved caveat that would otherwise create false coverage. |
| 2 | **Beyond Local Maxima?** | PASS | Wire-all-up-front and wire-nothing were both considered and rejected with reasons. |
| 3 | **Sufficient?** | PASS | The empirically-confirmed `sessionStart`/`preToolUse`/`sessionEnd` set closes the highest-value enforcement gap (spec-gate mutations) without overstating coverage; the genuine `beforeSubmitPrompt`/`stop` gap is documented, not papered over. |
| 4 | **Fits Goal?** | PASS | Matches the codex precedent's proven start-small order and the repo's verification standards. |
| 5 | **Open Horizons?** | PASS | Additional events are added purely by confirming delivery, with no rework of the chosen structure. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `mcp-server/hooks/cursor/README.md`: the event-mapping table with a per-event CLI-delivery status column (confirmed-fires / confirmed-non-delivery / untested).
- Adapters built for `sessionStart`, `preToolUse` (spec-gate enforce), and `sessionEnd`; no adapter built for `beforeSubmitPrompt` or `stop` since neither has a confirmed CLI attachment point.
- `.cursor/hooks.json` registration itself is deferred to a later, explicitly-approved step (operator choice during this phase) — the adapter code and live-verification evidence ship now; the committed project-level registration file does not.

**How to roll back**: Remove any event's registration from `.cursor/hooks.json` (once registered); the mapping table and adapters remain as documentation of what was attempted and what the CLI delivered.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
