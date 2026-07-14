---
title: "Decision Record: Codex command parity — thin router-prompts + deferred home install"
description: "ADRs for the Codex command parity phase: (1) thin router-prompts pointing at canonical commands instead of duplicating bodies, and (2) deferring the ~/.codex/prompts/ install and stale-symlink repair to operator confirmation."
trigger_phrases:
  - "codex command parity decisions"
  - "thin router prompt decision"
  - "codex home install deferral"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/003-codex-command-parity"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded thin-router decision (ADR-001) + deferred-install decision (ADR-002)"
    next_safe_action: "Orchestrator strict-validates; ADR-002 awaits operator confirmation to install"
---
# Decision Record: Codex command parity — thin router-prompts + deferred home install

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Thin router-prompts, not command-body duplication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (Q1), implementing session |

### Context

Codex needs a command surface that mirrors the OpenCode `.opencode/commands/**` tree. Codex commands are markdown prompts (invoked `/<name>`, `$ARGUMENTS` substitution) — NOT TOML; TOML is only the Codex agent format, already handled in phase 002. Two shapes were possible for each `.codex/prompts/*.md`: copy the full canonical command body into the prompt, or emit a thin router that points at the canonical command. Body duplication would create two authoritative copies of every command and reintroduce exactly the silent drift the agent-TOML sync exists to prevent.

### Decision

**We chose**: each `.codex/prompts/*.md` is a THIN ROUTER that names its canonical `.opencode/commands/<path>` as the single source of truth and forwards `$ARGUMENTS`, rather than copying the command body.

**How it works**: `sync-prompts.cjs` `renderPrompt()` emits a generated-by header, a pointer to the canonical command path, an instruction to read and follow that file exactly, and a `$ARGUMENTS` passthrough. Prompt names are flat-hyphenated (`design/motion.md` → `design-motion.md`), matching the existing `~/.codex/prompts/` flat convention and the repo's hyphen-naming direction. Because the prompt carries no command logic, the OpenCode command stays authoritative and Codex cannot drift from it.

### Alternatives Considered

- **Duplicate command bodies into each prompt** — rejected: creates two sources of truth per command and guarantees drift; defeats the purpose of a sync gate.
- **Generate TOML like the agents** — rejected on a factual basis: Codex commands are markdown prompts, not TOML; TOML would not be invocable as a `/<name>` prompt.

### Consequences

- Positive: single source of truth preserved; `--check` only needs to protect presence + the fixed router text; the generator is a near-exact mirror of `sync-agents.cjs`.
- Negative / trade-off: a Codex user must be able to read the referenced `.opencode/commands/<path>` file; the prompt itself is intentionally content-light.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Defer the ~/.codex/prompts/ install and stale-symlink repair

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (deferral); install pending operator confirmation |
| **Date** | 2026-07-14 |
| **Deciders** | Implementing session (blast-radius call), operator (confirmation pending) |

### Context

The 37 generated prompts are complete and committed in the repo tree. Making them live for Codex Desktop additionally requires installing them into the user's `~/.codex/prompts/` and repairing a stale `create` symlink there. That symlink is currently broken: `~/.codex/prompts/create -> ../../.opencode/command/create` (singular "command", not the repo's plural `.opencode/commands/`), and its target does not exist. Both actions mutate pre-existing files in the user's HOME directory that originate from an older flat convention.

### Decision

**We chose**: DEFER the `~/.codex/prompts/` install of the 37 prompts and the repair of the stale `create` symlink, pending explicit operator confirmation.

**How it works**: the in-repo deliverable (`sync-prompts.cjs` + the repo-tracked `.codex/prompts/` tree + the `--check` gate) is complete and committed independent of the install. The install is tracked as the sole Open Question in `spec.md` §7 (REQ-005). When the operator confirms, the prompts can be installed and the symlink retargeted at the correct plural `.opencode/commands/` path (or removed if superseded by the flat prompts).

### Alternatives Considered

- **Install now** — rejected: user-HOME mutation over pre-existing files is higher blast-radius and reversible only by touching the user's home directory; it should not happen without explicit confirmation.
- **Delete the broken symlink unilaterally** — rejected: still a home-dir mutation of a pre-existing artifact; folded into the same operator-gated decision.

### Consequences

- Positive: zero unconfirmed user-home mutation; the repo deliverable and its gate are fully usable and reviewable now.
- Negative / trade-off: Codex Desktop does not yet see the new prompts, and the broken `create` symlink remains until the operator confirms the install.

<!-- /ANCHOR:adr-002 -->
