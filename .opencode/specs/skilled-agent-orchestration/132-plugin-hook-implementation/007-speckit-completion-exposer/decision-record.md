---
title: "Decision Record: Spec-Kit Completion-State Exposer (tool.register)"
description: "Decision record for the completion-state tool: the runtime-neutral core plus thin adapters boundary, and the read-only fail-safe posture with the check-completion.sh exit-1 parse."
trigger_phrases:
  - "completion state decision"
  - "runtime-neutral core adapters"
  - "read-only tool posture"
  - "check-completion exit-1 parse"
  - "default-export-only decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/007-speckit-completion-exposer"
    last_updated_at: "2026-07-11T08:51:12.807Z"
    last_updated_by: "spec-author"
    recent_action: "Authored two ADRs: shared-core-plus-thin-adapters boundary and the read-only fail-safe posture"
    next_safe_action: "Keep implementation-summary.md as a planning stub; run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs"
      - ".opencode/plugins/mk-speckit-completion.js"
      - ".opencode/bin/speckit-completion.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-speckit-completion-exposer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Spec-Kit Completion-State Exposer (tool.register)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Runtime-neutral core with thin adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Michel Kerkmeester (operator), spec-author |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two runtimes want the same completion signal, but only OpenCode exposes a plugin tool-register surface. Claude has no plugin tool-register equivalent. We chose where the resolution, level inference, script execution, and merge logic live: inside the OpenCode plugin, or inside a shared core that both runtimes import. Putting logic in the plugin would strand Claude parity and would push non-trivial code into a file that OpenCode's auto-loader treats strictly.

### Constraints

- OpenCode plugins are ESM `.js` and must be default-export-only; a stray named export drops the whole file (`plugins/README.md:26-28`).
- The two source scripts are shell scripts; the core must shell them and parse their JSON.
- The repo already ships this exact shape: `mk-deep-loop-guard.js:28` imports a `.cjs` core as the ESM default, and `task-dispatch-guard.cjs:14` consumes the same core on the Claude side.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: put all logic in `completion-state.cjs` and keep both adapters thin (one OpenCode plugin, one optional Claude CLI shim).

**How it works**: `computeCompletionState({specFolder, projectDir, strict})` resolves the folder, infers level, shells both scripts, and merges the payload. The OpenCode plugin maps `ctx.directory` to `projectDir` and returns the core result. The CLI shim maps argv to the same core and prints JSON.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared core plus thin adapters (chosen)** | One source of truth for payload shape and fail-open; keeps the plugin a safe default-export factory; matches `mk-deep-loop-guard` | Adds one core file | 9/10 |
| Logic inside the plugin | One fewer file | Strands Claude parity; couples policy to the ESM auto-loader; raises the default-export-only risk | 3/10 |
| Duplicate logic in the plugin and a separate CLI | No shared import | Two copies drift; the fail-open contract splits in two | 2/10 |

**Why this one**: The shared core gives both runtimes an identical payload and an identical never-throw contract, and it keeps the plugin file small enough to stay a clean default export.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One core owns the payload shape, so the OpenCode tool and the CLI shim cannot diverge.
- The plugin file stays a thin default-export factory, which avoids the auto-loader drop trap.

**What it costs**:
- One extra core file to maintain. Mitigation: it is roughly 120 LOC with an exact exemplar to copy.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future edit inlines logic into the plugin and reintroduces a named export | H | Default-export-only checklist item (CHK-010) plus a smoke-load test |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The COMPLETION VERIFICATION gate hand-merges multiple Bash calls today; one call replaces that |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed; the plugin-only and duplicate-logic options were rejected on drift and parity grounds |
| 3 | **Sufficient?** | PASS | A single core plus two thin adapters is the smallest shape that serves both runtimes |
| 4 | **Fits Goal?** | PASS | The phase goal is to activate `tool.register` cleanly; the thin adapter keeps that file loadable |
| 5 | **Open Horizons?** | PASS | The core is reusable by any future runtime front door without a rewrite |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New core `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs`.
- New OpenCode adapter `.opencode/plugins/mk-speckit-completion.js` that imports the core as the ESM default.
- New optional CLI shim `.opencode/bin/speckit-completion.cjs`.

**How to roll back**: Delete the plugin file so the auto-loader stops registering the tool, then delete the core and CLI shim (both inert unless called), then remove the `plugins/README.md` row.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Read-only fail-safe posture and the check-completion.sh exit-1 parse

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Michel Kerkmeester (operator), spec-author |

---

<!-- ANCHOR:adr-002-context -->
### Context

The tool observes completion state; it never enforces or blocks. A read-only surface has no fail-open versus fail-closed decision, because it cannot affect a session either way. The real decision is how the core behaves when a source script fails. One script complicates this: `check-completion.sh` exits 1 when a checklist is incomplete but still emits its JSON on stdout first. `execFileSync` throws on any non-zero exit, so a naive success-only read reports every incomplete packet as `unavailable`.

### Constraints

- `check-completion.sh` exits 0 complete, 1 incomplete, 2 error (`check-completion.sh:433,450,452`), and emits its JSON before a non-zero exit.
- OpenCode plugins must never write stdout or stderr, or they corrupt the TUI; the tool RETURN value is the only legitimate channel.
- The core must not cold-start any daemon or MCP.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: make the core never throw and degrade each failing section to `{status:'unavailable', error}`, and catch the `check-completion.sh` non-zero exit to parse `err.stdout` for its JSON.

**How it works**: the core wraps each `execFileSync` in try/catch. On the `check-completion.sh` throw it reads `err.stdout` and parses that JSON, so an incomplete packet reports its real status. Any other failure sets that one section to `unavailable` while the rest of the payload still populates.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Never-throw, parse err.stdout on exit 1 (chosen)** | Incomplete packets report real status; broken packets degrade gracefully; the TUI is never corrupted | Slightly more branching in the core | 9/10 |
| Read only the success path | Simpler | Every incomplete packet falsely reports `unavailable`, which defeats the tool's purpose | 2/10 |
| Add an env kill-switch for fail-open versus fail-closed | Matches enforcement plugins | Meaningless for a read-only tool that cannot block anything | 3/10 |

**Why this one**: The exit-1 parse is the only way an incomplete packet reports honest status, and the never-throw contract keeps a broken packet from crashing the session.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Incomplete packets (the common case at the gate) report real P0/P1/P2 status instead of `unavailable`.
- A missing or malformed packet degrades to `unavailable` without a thrown exception or TUI corruption.

**What it costs**:
- The core carries a specific try/catch that depends on `check-completion.sh` still emitting JSON before exit 1. Mitigation: REQ-002 vitest against a known-incomplete packet locks this behavior in.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `check-completion.sh` stops emitting JSON before exit 1 | M | The vitest fail-open case flips to `unavailable`, surfacing the change immediately |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the exit-1 parse, every incomplete packet reports `unavailable`, which is the gate's most common state |
| 2 | **Beyond Local Maxima?** | PASS | Success-only and env-kill-switch options were weighed and rejected |
| 3 | **Sufficient?** | PASS | Try/catch plus section-level degradation is the minimum for an honest, crash-free payload |
| 4 | **Fits Goal?** | PASS | A read-only convenience tool must never destabilize the session it observes |
| 5 | **Open Horizons?** | PASS | The never-throw section contract extends to any new source signal added later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `completion-state.cjs` wraps each script call in try/catch, parses `err.stdout` on the `check-completion.sh` throw, and sets failing sections to `unavailable`.
- The plugin returns the payload through the tool result channel only, with no `console.*`.

**How to roll back**: Remove the tool by deleting the plugin file. The posture lives entirely in the core, so reverting the core file removes the behavior with it.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
</content>
