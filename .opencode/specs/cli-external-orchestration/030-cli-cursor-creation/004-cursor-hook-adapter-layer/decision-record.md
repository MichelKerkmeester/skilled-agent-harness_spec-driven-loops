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
| **Status** | Proposed |
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
- `.cursor/hooks.json` created at the project root, registering the confirmed-delivered core events.
- `mcp-server/hooks/cursor/README.md` documents the editor-shared blast radius and the fail-open guarantee.

**How to roll back**: Delete `.cursor/hooks.json` (removes the editor-blast-radius effect entirely) and the `hooks/cursor/` adapter directories; the neutral cores are untouched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: event mapping and CLI partial-event-delivery strategy

### Metadata

| Field | Value |
|---|---|
| **Status** | Proposed |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Cursor's editor exposes ~18 agent hook events (`sessionStart`, `beforeSubmitPrompt`, `beforeShellExecution`, `beforeMCPExecution`, `beforeReadFile`, `afterFileEdit`, `preCompact`, `stop`, `sessionEnd`, and more — confirmed in phase 001). This repo's 7 guard hooks each need to map onto one of those events. But a community report (surfaced in phase 001) says the Cursor **CLI** does not fire every event defined in `hooks.json` — the editor's event list is an upper bound, not a guarantee of CLI delivery. Wiring all 7 guards against the full editor event list up front would risk registering guards that silently never fire under a dispatched `cursor-agent`, creating a false sense of coverage.

### Constraints

- The set of events the CLI actually delivers is unconfirmed from documentation alone (phase 001 open question).
- The codex precedent proved out `SessionStart`/`UserPromptSubmit` first before extending — a start-small, verify-then-extend discipline this phase should inherit.
- A guard that is registered but never delivered is worse than an unregistered one, because it looks active while enforcing nothing.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Start with the three core events the codex precedent maps first (`sessionStart` ← SessionStart, `beforeSubmitPrompt` ← UserPromptSubmit, `stop` ← Stop), live-verify each actually fires under the installed `cursor-agent` CLI, and only then extend to the shell/MCP/file/edit guards (`beforeShellExecution`/`beforeMCPExecution`/`beforeReadFile` ← spec-gate/permission guards, `afterFileEdit` ← post-edit quality, `preCompact` ← compaction, `sessionEnd` ← teardown) — registering each additional event **only after** its CLI delivery is confirmed live. Any event the CLI does not deliver is documented as an open, editor-only gap, never assumed active.

**How it works**: Phase 1 probes CLI delivery empirically. Each mapped guard is wired, then smoke-tested end-to-end inside a real `cursor-agent` session with captured stdin/stdout evidence. The mapping table lives in `mcp-server/hooks/cursor/README.md` with a per-event "CLI delivery: confirmed / not-delivered / untested" column, so coverage is always legible and never overstated.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **Start-small, verify-then-extend (chosen)** | Never registers a guard that silently never fires; matches the codex precedent's proven order; coverage is always legible | Slower to reach full 7-guard coverage | 9/10 |
| Wire all 7 guards against the full editor event list up front | Fastest to "full coverage" on paper | Rejected — risks registering guards the CLI never delivers, creating false coverage; contradicts the phase-001 partial-delivery caveat | 2/10 |
| Wire nothing until Cursor documents CLI delivery officially | Zero risk of false coverage | Rejected — leaves the enforcement blind spot open indefinitely on an unbounded external-docs timeline | 3/10 |

**Why this one**: Empirical per-event verification is the only approach that closes the enforcement gap while never claiming a guard is active without evidence it fires — directly honoring both the codex precedent and the "Finding = hypothesis" verification standard.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Coverage claims are always backed by live per-event delivery evidence, never by the editor's event list alone.
- The README's per-event delivery column keeps the real coverage legible to maintainers.

**What it costs**:
- Full 7-guard coverage arrives incrementally rather than in one pass. Mitigation: the three core events (session/prompt/stop) — the highest-value guards — land first.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| The CLI delivers an event in one build but not a later one | M | The per-event delivery column is re-verified when the `cursor-agent` build changes, not treated as permanent |
| A guard mapped to a non-delivered event is assumed active | H | Explicit "not-delivered / editor-only" status recorded; never assumed closed |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | The CLI's partial-event delivery is a documented, unresolved caveat that would otherwise create false coverage. |
| 2 | **Beyond Local Maxima?** | PASS | Wire-all-up-front and wire-nothing were both considered and rejected with reasons. |
| 3 | **Sufficient?** | PASS | Verifying the three core events, then extending on evidence, closes the highest-value gap first without overstating coverage. |
| 4 | **Fits Goal?** | PASS | Matches the codex precedent's proven start-small order and the repo's verification standards. |
| 5 | **Open Horizons?** | PASS | Additional events are added purely by confirming delivery, with no rework of the chosen structure. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `mcp-server/hooks/cursor/README.md`: the event-mapping table with a per-event CLI-delivery status column.
- `.cursor/hooks.json`: registers only events confirmed to fire under the CLI, extended incrementally.

**How to roll back**: Remove any event's registration from `.cursor/hooks.json`; the mapping table and adapters remain as documentation of what was attempted and what the CLI delivered.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
