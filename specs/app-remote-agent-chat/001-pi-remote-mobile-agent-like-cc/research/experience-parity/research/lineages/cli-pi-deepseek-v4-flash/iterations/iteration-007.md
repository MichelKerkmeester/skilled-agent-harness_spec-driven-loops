# Iteration 7: Axis 5 — Browsable, Renamable Session List under Opaque-Id/Redaction

## Focus
Design the session catalog UX: browsable and renamable while the server sees only opaque ids and redacted metadata (003 catalog + 004 read-only API + 005 opaque session cards). Prior art: tmux session naming, Tailscale machine-name vs key identity separation, Claude Code resume-by-id.

## Findings

### F1. tmux naming conventions — the human-layer playbook
- Convention: `<project>-<purpose>` lowercase with `-` separators; name the workspace/project, not the current command; add a qualifier only when needed; keep names unique (tmux requires unique session names) ([SOURCE: github.com/tmux/tmux/wiki/Getting-Started]).
- Sessions are durable workspaces; windows are ephemeral tasks ([SOURCE: mintlify.com/tmux/tmux/reference/faq]).
- Implication: sessions deserve durable task-oriented labels; the PWA should *propose* labels, not force them.

### F2. Tailscale: human-friendly name ≠ cryptographic identity
- Machine name is derived from OS hostname, disambiguated on duplicates, renamable (`tailscale set --hostname`); the name is also the MagicDNS label ([SOURCE: tailscale.com/kb/1098/machine-names]).
- Real identity is the machine key + node key; renaming never changes identity ([SOURCE: tailscale.com/docs/concepts/node-keys]).
- Implication: the exact two-layer model needed: server-side opaque key (identity, immutable) + client-side human label (display, mutable). Tailscale proves renaming can be cheap and identity-safe.

### F3. Claude Code session identity: opaque ids, no documented naming
- Resume by id (`claude --resume <id>`) or continue latest (`-c`); **no documented user-defined session names or list CLI** ([SOURCE: docs.anthropic.com/en/docs/claude-code/cli-usage]).
- Implication: the reference's session list (claude.ai/code) is account-cloud-bound and id-centric; a *client-local* naming layer is unclaimed territory.

## Design: Axis 5 deliverables

### Two-layer identity model
- **Server layer (003 catalog)**: `sessionOpaqueId` is the only server-side identity; immutable; never human-readable by construction (high-entropy, non-pronounceable). All relay APIs (004 read-only list, WS tickets, attention deep-links, approval leases) reference only this id.
- **Client layer (PWA)**: a per-device label map `{sessionOpaqueId → label}` stored encrypted at rest in IndexedDB (app session key). Rename = local write; zero server round-trip; no content crosses the boundary. Uniqueness is per-device, so the tmux collision problem vanishes (no shared label namespace server-side).

### Safe server metadata (what the list API may return)
`session.list` returns per session: `{id: opaque, status: running|needs_input|finished|error, model, startedAt, lastActiveAt, workspaceLabel, pendingApprovals, epochFloor}`. Derived from 003 catalog + `transcript.run.status` + `approval.queue`; contains no transcript content, no paths, no tool names. `workspaceLabel` is host-configured (user-set on the host, never derived from paths automatically) — redaction-safe by construction.

### Browse UX
- Session cards: status dot (attention class colored: needs_input = amber pulsing), label (large), model + workspaceLabel (secondary), "3 approvals waiting" chip, last-active relative time; sorted by lastActiveAt.
- Search filters labels only; ids are deliberately not searchable (not memorable — by design).
- Card tap → session thread (005 hydration + replay reconciliation); needs_input cards deep-link to the approval queue (axis 3 attention class).

### Label lifecycle
- **Auto-proposal**: on first sight, PWA proposes `<workspaceLabel>-<state>` (tmux convention; e.g. `api-feature-auth`, `infra-maintenance`); user accepts or renames; stored locally.
- **Rename**: tap-edit inline; optimistic local update; no server event (nothing to sync).
- **Optional encrypted label sync**: a device group (user's own devices, authenticated via 004 app sessions) can share labels as **relay-stored ciphertext** — the relay persists encrypted blobs keyed to the device group and never holds plaintext. Off by default.
- **Orphan cleanup**: label rows for expired sessions are purged per retention; the list never fabricates labels for unseen sessions (offline read-only cache per 005 shows cached + stale marker).

### Why this exceeds the reference
- Reference: session ids only; naming not documented; the session list is tied to the claude.ai account cloud.
- Pi: server-opaque identity + client-local human layer gives naming with zero server trust; per-device labels are inherently private; optional ciphertext sync is the only cross-device path. This is Tailscale's name-vs-key separation applied to sessions, with redaction by construction (the server literally cannot leak a label it never holds in plaintext).

## Sources Consulted
- [SOURCE: https://github.com/tmux/tmux/wiki/Getting-Started]
- [SOURCE: https://www.mintlify.com/tmux/tmux/reference/faq]
- [SOURCE: https://tailscale.com/kb/1098/machine-names]
- [SOURCE: https://tailscale.com/docs/concepts/node-keys]
- [SOURCE: https://docs.anthropic.com/en/docs/claude-code/cli-usage]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation/spec.md]

## Assessment
- newInfoRatio: 0.75
- Novelty justification: two-layer identity model + per-device label map + ciphertext-only sync is new design; tmux/Tailscale/Claude Code facts consolidate prior art.
- Confidence: high on prior art; design maps to 003/004/005 contracts.

## Reflection
- What worked: borrowing Tailscale's identity/name separation — it already solves "rename without changing identity."
- What failed / ruled out: server-side shared label namespaces (collision handling, leaks across devices, needs server trust); deriving labels from host paths automatically (redaction violation); making opaque ids searchable (undermines opacity).
- Ruled out: renaming sessions server-side (003 catalog keys are immutable; rename would be a fake-out).

## Recommended Next Focus
Axis 6: background sessions and starting new work while away — how far within the posture; process supervision + detached run creation.
