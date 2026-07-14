---
title: "Decision Record: integrate-validate-ship — worktree FF-push + deferred codex home install"
description: "ADRs for the final child of the 138 packet: (1) ship the integrated packet via an isolated-worktree FF-push onto origin/skilled/v4.0.0.0, operator-gated, and (2) defer the ~/.codex/prompts/ install and stale-symlink repair to operator confirmation."
trigger_phrases:
  - "138 ship decision"
  - "worktree ff-push decision"
  - "codex home install deferral"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship"
    last_updated_at: "2026-07-14T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded ship-via-worktree ADR-001 and codex home-install deferral ADR-002"
    next_safe_action: "Both ADRs await operator confirmation before ship and codex install"
---
# Decision Record: integrate-validate-ship — worktree FF-push + deferred codex home install

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship via an isolated-worktree FF-push, operator-gated

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (deferral); FF-push pending operator confirmation |
| **Date** | 2026-07-14 |
| **Deciders** | Implementing session (blast-radius call), operator (confirmation pending) |

### Context

The 138 packet's conformance and parity work is complete and committed on the working branch `skilled/0041-command-agent-canon` inside the isolated worktree `.worktrees/0041-skilled-command-agent-canon`. Making that work live on the shared line requires fast-forwarding the branch onto `origin/skilled/v4.0.0.0`. That target is a shared remote branch other sessions track and build on, so pushing it is a higher-blast-radius mutation than any in-worktree edit — and one that other concurrent sessions can race.

### Decision

**We chose**: keep all work on the isolated worktree branch and DEFER the FF-push of `skilled/0041-command-agent-canon` onto `origin/skilled/v4.0.0.0` pending explicit operator confirmation.

**How it works**: the packet is integrated and validated in-branch (children green, `validate.sh --recursive --strict` → Errors:0, parent rolled up, per-file gates green). The FF-push is tracked as an Open Question in `spec.md` §7 (REQ-004). When the operator confirms, the branch is fast-forwarded onto the current `origin/skilled/v4.0.0.0` tip (rebasing first if the remote advanced), keeping history linear and the operator in control of the shared-branch mutation.

### Alternatives Considered

- **Push now** — rejected: a shared-remote mutation onto a branch other sessions track should not happen without explicit confirmation, especially with concurrent sessions advancing the tip.
- **Open a PR instead of FF-push** — rejected for this packet: the operator's convention for this line is an isolated-worktree FF-push they run themselves; the deliverable is handed off as a ready-to-fast-forward branch.

### Consequences

- Positive: zero unconfirmed shared-remote mutation; the integrated packet is complete and reviewable in-branch now.
- Negative / trade-off: the work is not yet on `origin/skilled/v4.0.0.0`, so downstream sessions do not see it until the operator confirms the FF-push.

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

Phase 003 produced 37 repo-tracked codex command prompts and a `sync-prompts.cjs --check` gate; that in-repo parity is complete. Making the prompts live for Codex Desktop additionally requires installing them into the user's `~/.codex/prompts/` and repairing a stale `create` symlink there. That symlink is broken: `~/.codex/prompts/create -> ../../.opencode/command/create` (singular "command", not the repo's plural `.opencode/commands/`), and its target does not exist. Both actions mutate pre-existing files in the user's HOME directory that originate from an older flat convention.

### Decision

**We chose**: DEFER the `~/.codex/prompts/` install of the 37 prompts and the repair of the stale `create` symlink, pending explicit operator confirmation.

**How it works**: the in-repo deliverable (`sync-prompts.cjs` + the repo-tracked `.codex/prompts/` tree + the `--check` gate) is complete and committed independent of the install. The install is tracked as an Open Question in `spec.md` §7 (REQ-005). When the operator confirms, the prompts can be installed and the symlink retargeted at the correct plural `.opencode/commands/` path (or removed if superseded by the flat prompts).

### Alternatives Considered

- **Install now** — rejected: user-HOME mutation over pre-existing files is higher blast-radius and reversible only by touching the user's home directory; it should not happen without explicit confirmation.
- **Delete the broken symlink unilaterally** — rejected: still a home-dir mutation of a pre-existing artifact; folded into the same operator-gated decision.

### Consequences

- Positive: zero unconfirmed user-home mutation; the repo deliverable and its gate are fully usable and reviewable now.
- Negative / trade-off: Codex Desktop does not yet see the new prompts, and the broken `create` symlink remains until the operator confirms the install.

<!-- /ANCHOR:adr-002 -->
