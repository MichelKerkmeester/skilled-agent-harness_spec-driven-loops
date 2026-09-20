---
title: "Decision Record: cli-cursor skill packet"
description: "Three ADRs: packet-kind classification, self-invocation guard signal design, and prompt-quality-card shape for the new cli-cursor mode."
trigger_phrases: ["cli-cursor decision record", "cli-cursor ADR", "cli-cursor architecture decisions"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/003-cli-cursor-skill-packet"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored decision-record.md with 3 ADRs for the cli-cursor skill-packet phase"
    next_safe_action: "Wait for phase 002 to land before implementation begins"
    blockers: ["Phase 002 must land before implementation starts"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: cli-cursor skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: packet-kind classification

### Metadata

| Field | Value |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`cli-external-orchestration` is a zero-extension, two-axis hub. Every mode carries a `packetKind` and a `backendKind`. Today all three modes (`cli-opencode`, `cli-claude-code`, `cli-codex`) classify as `packetKind: "workflow"`: each classifies intent, chooses or confirms a provider, and conducts a dispatched CLI session whose writes land in this repo's workspace (`mutatesWorkspace: true`). None is read-only evidence, and none is a transport packet — a transport packet requires `mutatesWorkspace: false` with writes landing only inside the external tool.

Cursor complicates this more than its siblings because it ships two surfaces that superficially resemble "elsewhere" execution: native git-worktree isolation (`-w`/`--worktree`, writes land in `~/.cursor/worktrees/<repo>/<name>`) and a cloud `worker` (agents run in a remote environment). We must place `cli-cursor` on the same discriminator without inventing a new axis the hub does not otherwise use.

### Constraints

- The hub's `mode-registry.json` documents `workflow` as the shape in current use and states the hub has "zero extensions (no surface-axis, no transport-axis)".
- Cursor's **default** dispatch (`cursor-agent -p "<prompt>"` in the current working directory) writes land in this repo's checkout, identical in shape to the 3 siblings — the `-w` worktree and `worker` cloud modes are opt-in flags/subcommands a user selects, not this packet's default behavior.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `cli-cursor` is `packetKind: "workflow"`, `backendKind: "cli-dispatch"`, `toolSurface.mutatesWorkspace: true` — identical classification to its 3 siblings.

**How it works**: The packet classifies dispatch intent, confirms `cursor-agent` is available, and conducts a dispatched Cursor CLI session whose file writes land in this repo's checkout, exactly like the siblings. Native worktree isolation (`-w`) and cloud `worker` are documented in `cursor-tools.md` as opt-in escape hatches a user invokes deliberately; they do not change the packet's default `mutatesWorkspace: true` classification. The packet's default dispatch command does not pass `-w`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **workflow (chosen)** | Matches all 3 existing siblings exactly; zero new discriminator values; simplest fit | None material | 9/10 |
| transport | Would model `-w` worktree / `worker` cloud as the packet's primary mode | Rejected — transport requires `mutatesWorkspace: false` with writes landing only in the external tool; Cursor's default dispatch writes land locally | 2/10 |
| surface | Would model this as read-only evidence collection | Rejected — this packet dispatches and mutates the workspace; not read-only evidence | 1/10 |

**Why this one**: `workflow` is the only classification consistent with how `cli-cursor` actually behaves by default (dispatches a binary, writes land locally) and it costs nothing new. Cursor's worktree/worker capabilities are opt-in, not the packet's default posture, so they do not justify a transport classification.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Zero new discriminator values added; `mode-registry.json`'s "zero extensions" claim stays true for a 4th mode.
- `cli-cursor` inherits the exact same `toolSurface` (`[Bash, Read, Glob, Grep]`, `mutatesWorkspace: true`, empty `bashAllowlist`) as its siblings with no bespoke exception.

**What it costs**:
- Cursor's worktree/worker "some writes land outside the cwd" behavior is documented in prose (`cursor-tools.md`) rather than encoded in the registry schema. Mitigation: `cursor-tools.md` (≥100 LOC) documents both as opt-in escape hatches, and the packet's default dispatch omits `-w`.
- A dispatched `cursor-agent` inherits the operator's shared `~/.cursor/` config (hooks/mcp/rules). Mitigation: `shared-editor-config.md` documents this; the workspace/config-isolation decision is flagged as an Open Question for the dispatch-command finalization.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| A future reviewer assumes worktree/worker means `cli-cursor` should be `transport` | Low | ADR-001 is the citable record explaining why `workflow` was chosen despite those capabilities. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | The hub requires every mode to declare a `packetKind`; not optional. |
| 2 | **Beyond Local Maxima?** | PASS | Both `transport` and `surface` were evaluated and rejected on their actual definitions. |
| 3 | **Sufficient?** | PASS | `workflow` fully describes the packet's default dispatch-and-mutate behavior. |
| 4 | **Fits Goal?** | PASS | Matches the parent packet's goal of mirroring the `cli-codex`/`cli-devin` precedent. |
| 5 | **Open Horizons?** | PASS | Does not foreclose a future dedicated transport-axis packet for worktree/worker-only workflows if ever needed. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mode-registry.json`: new `modes[]` entry with `"packetKind": "workflow"`, `"backendKind": "cli-dispatch"`.
- `cli-cursor/SKILL.md`: frontmatter and prose consistent with a workflow packet (no transport-only language); default dispatch omits `-w`.

**How to roll back**: Remove the `cli-cursor` entry from `mode-registry.json`'s `modes[]` array; delete `cli-external-orchestration/cli-cursor/`; no other packet's `packetKind` is touched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: self-invocation guard signal design

### Metadata

| Field | Value |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Every mode in this hub carries a non-negotiable, packet-owned self-invocation guard (`cli-external-orchestration/SKILL.md` §4: "the self-invocation guard is packet-owned and non-negotiable"). `cli-codex` and its siblings each implement this with a 3-layer pattern: (1) an env-var namespace lookup (e.g. `CODEX_SESSION_ID` / any `CODEX_*` var), (2) a process-ancestry grep for the binary name in the parent process tree, and (3) a state-dir/lock-file check.

At authoring time, Cursor's confirmed contract documented auth env vars (`CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN`) and a `--resume [chatId]`/`--continue` session model, but not a session-scoped env-var convention analogous to `CODEX_SESSION_ID`. That gap has since closed: an authenticated live dispatch (`cursor-agent -p --force "env | grep -i cursor"`) surfaced `CURSOR_AGENT=1` — set unconditionally whenever the current process runs under `cursor-agent` — and `CURSOR_CONVERSATION_ID`, matching the `--output-format json` `session_id` field exactly. `CURSOR_AGENT=1` is a stronger signal than `CODEX_SESSION_ID`: it doesn't depend on a session having a live conversation id, it fires the instant the binary is running. No lock-file convention is documented for Cursor, so that third layer stays a best-effort session probe rather than a real lock check. It also has a naming wrinkle: the canonical binary is `cursor-agent` with an `agent` alias symlink, so a process-ancestry grep must match `cursor-agent` (the real process name), not just `agent`.

### Constraints

- The guard is a hard, non-negotiable requirement of the hub — it cannot be omitted.
- Only confirmed facts may be used to design the guard; anything else must be documented as an open, unconfirmed gap rather than invented.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Design the guard around confirmed signals only — (1) an env-var namespace lookup, checking `CURSOR_AGENT=1` first (confirmed set unconditionally whenever the current process runs under `cursor-agent`) and `CURSOR_CONVERSATION_ID` second (confirmed session-id marker, matching the `--output-format json` `session_id` field), (2) a process-ancestry grep for `cursor-agent` (the confirmed canonical process name) in the parent process tree, and (3) a best-effort session probe in place of a lock file, since no lock-file convention is documented for Cursor.

**How it works**: The guard function runs all three checks in sequence and refuses to dispatch if any signal fires. Layer 1 and layer 2 are both fully confirmed (not best-effort); only layer 3 (no documented lock-file convention) stays a best-effort probe. The guard still documents, in both the `SKILL.md` guard comment and `references/cli-reference.md`, that "absence of a detected signal is not proof no session is active" for the lock-file layer specifically — matching the honest caveat the sibling packets use. The process-ancestry check matches `cursor-agent`, not the `agent` alias, to avoid both false negatives (missing the real process) and false positives (matching an unrelated `agent` command).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **Confirmed-signals-only guard, 2 of 3 layers fully confirmed (chosen)** | Never fabricates an unconfirmed mechanism; matches the repo's "Never fabricate" mandate; env + ancestry layers are both live-verified, stronger than the sibling pattern's single env-var layer | Lock-file layer still best-effort (no documented convention) | 9/10 |
| Invent a lock-file convention (e.g. assume `~/.cursor/state/<id>/lock`) | Would give a 3rd fully-confirmed signal matching the sibling shape | Rejected — fabricates a mechanism with no evidence; violates "Never fabricate" and risks silently checking a signal that never exists | 2/10 |
| No guard at all | Simplest implementation | Rejected — violates the hub's non-negotiable "self-invocation guard is packet-owned" rule | 0/10 |

**Why this one**: Using only confirmed facts, with a best-effort probe in place of the unconfirmed lock file, is the only option that neither fabricates a mechanism nor skips the hub's hard requirement. A live dispatch confirmed `CURSOR_AGENT=1` before implementation began, so 2 of the 3 layers ship fully confirmed rather than pending.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The guard never claims a certainty it cannot back with evidence — consistent with the "Never fabricate" mandate.
- The process-ancestry check uses the confirmed canonical binary name (`cursor-agent`), avoiding the alias ambiguity.
- The env-var layer is fully confirmed (`CURSOR_AGENT=1`), not best-effort — 2 of 3 guard layers are hard signals, only the lock-file layer stays best-effort.

**What it costs**:
- The guard's lock-file layer is weaker than the siblings' where no reliable session signal surfaces. Mitigation: the explicit "absence is not proof" caveat is stated for that layer specifically, in both `SKILL.md` and `references/cli-reference.md`.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| A Cursor lock-file convention exists but is undocumented | Low | Flagged in `references/cli-reference.md`; upgrade the guard once confirmed, without a new ADR. |
| The process-ancestry grep matches the `agent` alias and false-positives on an unrelated `agent` command | Low | Guard matches `cursor-agent` specifically, not bare `agent`. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | The hub hard-requires a packet-owned self-invocation guard for every mode. |
| 2 | **Beyond Local Maxima?** | PASS | A lock-file/session-env convention and "no guard" were both considered and rejected with reasons. |
| 3 | **Sufficient?** | PASS | 2 of 3 signals (env-var, process-ancestry) are fully confirmed; the lock-file signal is documented as best-effort, not silently assumed. |
| 4 | **Fits Goal?** | PASS | Matches the parent packet's "unavailable cursor-agent binary never becomes routable (fail-closed)" handoff criterion. |
| 5 | **Open Horizons?** | PASS | Designed to be upgraded in place once the env-var signal is confirmed. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `cli-cursor/SKILL.md` §2: a self-invocation guard function implementing the 3 signals above, with the honest-caveat comment and a `cursor-agent`-specific process match.
- `cli-cursor/references/cli-reference.md`: documents the guard's signals and the "absence is not proof" caveat.

**How to roll back**: Remove the guard function from `SKILL.md`; this reverts to no guard, which immediately fails checklist item CHK-013 and must not be shipped — rollback of this ADR means rolling back the whole packet, not shipping a guardless version.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: prompt-quality-card shape

### Metadata

| Field | Value |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-003-context -->
### Context

Every sibling mode carries an `assets/prompt-quality-card.md`. In this repo's history, a sibling card once drifted into re-inlining a competing framework taxonomy (reusing acronyms already owned by the canonical `sk-prompt/prompt-models` card for a different concept) — a real, previously-fixed bug whose fix turned the card into a thin delegator. Unlike the Devin card (which could fold in 112 real dispatches' worth of empirical defaults from an archived packet), **Cursor has zero prior empirical dispatch data in this repo** — it is a first-time creation. There is no validated RCAF-as-default finding, no measured medium-pre-plan step, nothing. Any per-model default this card asserted would be invented from a blank page.

Rebuilding `cli-cursor`'s prompt-quality card from scratch risks both repeating the taxonomy-drift bug and fabricating per-model defaults with no evidence.

### Constraints

- `sk-prompt/prompt-models` (canonical card at `.opencode/skills/sk-prompt/prompt-models/assets/cli-prompt-quality-card.md`) is the single source of truth for prompt-craft framework definitions across all model-dispatching packets.
- Cursor has no archived empirical dispatch findings; the repo's "Never fabricate" mandate forbids inventing per-model defaults.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Ship `cli-cursor/assets/prompt-quality-card.md` as a thin delegator from day one, stating a precedence rule at the top — (1) the `sk-prompt` framework is authoritative for framework definitions, (2) the model-hub profile (`sk-prompt/prompt-models`) governs per-model defaults, (3) this card only adds confirmed Cursor-dispatch-mechanics addenda that don't belong in either of the first two tiers.

**How it works**: The card opens with the precedence statement, links directly to the canonical `sk-prompt/prompt-models` card, and then documents only what is genuinely and confirmably Cursor-specific from phase 001 (non-interactive `-p` invocation, `--output-format`, plan/ask/agent modes, approval/sandbox flags, the auth-gated model-roster caveat), without re-defining any framework acronym and without asserting any per-model default Cursor has no empirical basis for.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **Thin delegator from day one (chosen)** | Structurally impossible to re-introduce the acronym-collision bug; cannot fabricate per-model defaults since none are asserted | Slightly less self-contained — a reader follows a link for the full framework picture | 9/10 |
| Inline a fresh framework table + Cursor per-model defaults | Fully self-contained | Rejected — reintroduces the taxonomy-collision bug AND fabricates per-model defaults Cursor has no data for | 1/10 |

**Why this one**: With no prior Cursor empirical data, the only honest option is to delegate framework/per-model guidance to the canonical source and add confirmed-mechanics-only addenda. The delegator shape costs nothing and structurally forecloses both known failure modes.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Zero risk of re-introducing the acronym-collision bug, since no competing taxonomy is defined here.
- Zero fabricated per-model defaults — the card asserts only phase-001-confirmed Cursor dispatch mechanics.

**What it costs**:
- The card is not fully self-contained; a reader needs the canonical `sk-prompt/prompt-models` card alongside it. Mitigation: the precedence rule and a direct link are in the first paragraph.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| A future edit re-inlines framework content or invents Cursor per-model defaults "for convenience" | Medium | ADR-003 is the citable record explaining why both were rejected, and why fabrication is specifically disallowed given no empirical data exists. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | Every sibling mode carries a `prompt-quality-card.md`; family parity requires one here. |
| 2 | **Beyond Local Maxima?** | PASS | Inlining a fresh taxonomy + per-model defaults was considered and rejected on documented evidence. |
| 3 | **Sufficient?** | PASS | The precedence rule plus confirmed Cursor-dispatch addenda fully covers what a dispatcher needs. |
| 4 | **Fits Goal?** | PASS | Matches the repo's "Never fabricate" mandate and the family thin-delegator convention. |
| 5 | **Open Horizons?** | PASS | If real Cursor dispatch data is gathered later (e.g. via phase 006 playbook runs), the card's addenda section can be extended without a rewrite. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `cli-cursor/assets/prompt-quality-card.md`: new file, thin-delegator shape, precedence rule stated first, confirmed-mechanics-only addenda.

**How to roll back**: Delete the file or replace its body with a stub; no other file depends on its internal content (only `SKILL.md`/`README.md` link to it).
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
