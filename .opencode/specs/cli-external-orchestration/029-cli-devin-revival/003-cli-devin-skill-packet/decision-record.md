---
title: "Decision Record: cli-devin skill packet"
description: "Three ADRs: packet-kind classification, self-invocation guard signal design, and prompt-quality-card shape for the new cli-devin mode."
trigger_phrases: ["cli-devin decision record", "cli-devin ADR", "cli-devin architecture decisions"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/003-cli-devin-skill-packet"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored decision-record.md with 3 ADRs for the planned cli-devin skill-packet phase"
    next_safe_action: "Wait for phase 002 to land before implementation begins"
    blockers: ["Phase 002 (deep-loop-executor-support) must land and pass validate.sh --strict before this phase's implementation starts, per the parent packet's Phase Transition Rules"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: cli-devin skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: packet-kind classification

### Metadata

| Field | Value |
|---|---|
| **Status** | Proposed |
| **Date** | 2026-07-23 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`cli-external-orchestration` is a zero-extension, two-axis hub. Every mode carries a `packetKind` and a `backendKind`. Today all three modes (`cli-opencode`, `cli-claude-code`, `cli-codex`) classify as `packetKind: "workflow"`: each classifies intent, chooses or confirms a provider, and conducts a dispatched CLI session whose writes land in this repo's workspace (`mutatesWorkspace: true`). None of the three is read-only evidence, and none is a transport packet — a transport packet requires `mutatesWorkspace: false` with writes landing only inside the external tool, which is not how any of the three siblings behave.

We need to place `cli-devin` on the same discriminator without inventing a new axis the hub does not otherwise use.

### Constraints

- The hub's `mode-registry.json` documents exactly two `packetKind` values in current use (`workflow`) and explicitly states the hub has "zero extensions (no surface-axis, no transport-axis)".
- `cli-devin` dispatches the external `devin` binary and its writes land in this repo's workspace, identical in shape to the 3 siblings — Devin's own cloud-handoff (`/handoff`, confirmed real in phase 001) is an opt-in escape hatch a user invokes mid-session, not this packet's default behavior.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `cli-devin` is `packetKind: "workflow"`, `backendKind: "cli-dispatch"`, `toolSurface.mutatesWorkspace: true` — identical classification to its 3 siblings.

**How it works**: The packet classifies dispatch intent (should this task go to Devin), confirms the `devin` binary is available, and conducts a dispatched Devin CLI session whose file writes land in this repo's checkout, exactly like `cli-opencode`/`cli-claude-code`/`cli-codex`. Cloud handoff via `/handoff` is a mid-session, user-invoked escape hatch documented in `cloud-handoff.md`; it does not change the packet's default `mutatesWorkspace: true` classification.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **workflow (chosen)** | Matches all 3 existing siblings exactly; zero new discriminator values; simplest possible fit | None material | 9/10 |
| transport | Would model cloud-handoff as the packet's primary mode | Rejected — transport requires `mutatesWorkspace: false` with writes landing only in the external tool; Devin's default dispatch writes land locally like its siblings, not externally-only | 2/10 |
| surface | Would model this as read-only evidence collection | Rejected — this packet dispatches and mutates the workspace; it is not read-only evidence | 1/10 |

**Why this one**: `workflow` is the only classification consistent with how `cli-devin` actually behaves (dispatches a binary, writes land locally) and it costs nothing new — the hub's registry contract already documents `workflow` as the shape for exactly this behavior.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Zero new discriminator values added to the hub; `mode-registry.json`'s "zero extensions" claim stays true for a 4th mode.
- `cli-devin` inherits the exact same `toolSurface` (`[Bash, Read, Glob, Grep]`, `mutatesWorkspace: true`, empty `bashAllowlist`) as its siblings with no bespoke exception to justify.

**What it costs**:
- Cloud handoff (`/handoff`) is not given its own first-class discriminator value, so its distinct "some writes land outside this repo" behavior is documented in prose (`cloud-handoff.md`) rather than encoded in the registry schema. Mitigation: the phase's `references/cloud-handoff.md` (≥100 LOC) documents this explicitly as an escape hatch, not a hidden default.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| A future reviewer assumes cloud handoff means `cli-devin` should be `transport` | Low | ADR-001 is the citable record explaining why `workflow` was chosen despite the handoff capability. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | The hub requires every mode to declare a `packetKind`; this is not optional. |
| 2 | **Beyond Local Maxima?** | PASS | Both `transport` and `surface` were evaluated and rejected on their actual definitions, not assumed away. |
| 3 | **Sufficient?** | PASS | `workflow` fully describes the packet's dispatch-and-mutate behavior with no gaps. |
| 4 | **Fits Goal?** | PASS | Matches the parent packet's explicit goal of matching the `cli-codex` precedent exactly. |
| 5 | **Open Horizons?** | PASS | Does not foreclose a future dedicated transport-axis packet for cloud-handoff-only workflows if ever needed. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mode-registry.json`: new `modes[]` entry with `"packetKind": "workflow"`, `"backendKind": "cli-dispatch"`.
- `cli-devin/SKILL.md`: frontmatter and prose consistent with a workflow packet (no transport-only language).

**How to roll back**: Remove the `cli-devin` entry from `mode-registry.json`'s `modes[]` array; delete `cli-external-orchestration/cli-devin/`; no other packet's `packetKind` is touched by this decision.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: self-invocation guard signal design

### Metadata

| Field | Value |
|---|---|
| **Status** | Proposed |
| **Date** | 2026-07-23 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Every mode in this hub carries a non-negotiable, packet-owned self-invocation guard (`cli-external-orchestration/SKILL.md` §4: "Never let any mode dispatch itself — the self-invocation guard is packet-owned and non-negotiable"). `cli-codex` and its siblings each implement this with a 3-layer pattern: (1) an env-var namespace lookup (e.g. `CODEX_SESSION_ID` / any `CODEX_*` var), (2) a process-ancestry grep for the binary name in the parent process tree, and (3) a state-dir/lock-file check (e.g. `~/.codex/state/<id>/lock`).

Devin's confirmed contract (phase 001, live-verified against `docs.devin.ai` and the installed `v3000.2.17` binary) documents auth (`COGNITION_API_KEY` / `cog_`-prefixed service-user tokens for headless use) and a hooks/config/permissions/model/subagent contract — but it does **not** document a session-scoped env-var convention analogous to `CODEX_SESSION_ID`, nor a lock-file convention analogous to `~/.codex/state/<id>/lock`. Building the guard as a literal copy of `cli-codex`'s 3-layer pattern would fabricate two of the three signals.

### Constraints

- The guard is a hard, non-negotiable requirement of the hub (`cli-external-orchestration/SKILL.md` §4) — it cannot be omitted.
- Only confirmed facts from phase 001 may be used to design the guard; anything else must be documented as an open, unconfirmed gap rather than invented.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Design the guard around confirmed signals only — (1) an env-var namespace lookup for `COGNITION_*`/`DEVIN_*` (pending live verification of the exact variable Devin sets during an active session), (2) a process-ancestry grep for `devin` in the parent process tree (the same mechanically-verifiable technique the siblings use, requiring no unconfirmed Devin-specific convention), and (3) `devin list --format json` run as a best-effort session probe in place of a lock file, since no lock-file convention is documented for Devin.

**How it works**: The guard function runs all three checks in sequence and refuses to dispatch if any signal fires. It explicitly documents, in both the `SKILL.md` guard comment and `references/cli-reference.md`, that "absence of a detected signal is not proof no session is active" — the same honest caveat the original 2026-05 `cli-devin` packet used for its own guard.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **Confirmed-signals-only guard with honest caveat (chosen)** | Never fabricates an unconfirmed mechanism; matches the repo's "Never fabricate" mandate directly | Weaker guarantee than a true lock-file check; documented as best-effort, not airtight | 8/10 |
| Invent a lock-file convention (e.g. assume `~/.devin/state/<id>/lock`) | Would give a 3rd, filesystem-based signal matching the sibling shape exactly | Rejected — fabricates a mechanism with no evidence it exists; violates the "Never fabricate" mandate and risks silently failing (checking a file that never gets written) | 2/10 |
| No guard at all | Simplest possible implementation | Rejected — violates the hub's own non-negotiable "self-invocation guard is packet-owned" rule (`cli-external-orchestration/SKILL.md` §4) | 0/10 |

**Why this one**: Using only what phase 001 actually confirmed, plus a best-effort `devin list` probe in place of the unconfirmed lock file, is the only option that neither fabricates a mechanism nor skips the hub's hard requirement.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The guard never claims a certainty it cannot back with evidence — consistent with the repo's "Never fabricate" documentation mandate.
- The `devin list --format json` probe reuses a real, phase-001-confirmed command surface rather than inventing new file-system state.

**What it costs**:
- The guard is weaker than the siblings' lock-file layer in the specific case where `devin list` does not reliably surface an in-progress self-referential session. Mitigation: the explicit "absence is not proof" caveat is stated in both `SKILL.md` and `references/cli-reference.md`, so callers are not misled into over-trusting the guard.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| A real Devin session env-var convention exists but was not surfaced by phase 001's research | Medium | Flagged as an explicit Open Question in `spec.md` §12; upgrade the guard once confirmed, without needing a new ADR. |
| `devin list --format json` output shape changes in a future Devin release | Low | Guard treats a parse failure as "signal not confirmed", not as "safe to proceed" — fails toward caution. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | The hub hard-requires a packet-owned self-invocation guard for every mode. |
| 2 | **Beyond Local Maxima?** | PASS | A lock-file convention and "no guard" were both considered and rejected with stated reasons. |
| 3 | **Sufficient?** | PASS | 2 of 3 signals are fully confirmed; the 3rd (env-var) is documented as pending verification rather than silently assumed. |
| 4 | **Fits Goal?** | PASS | Matches the parent packet's explicit "unavailable devin binary never becomes routable (fail-closed)" handoff criterion. |
| 5 | **Open Horizons?** | PASS | Designed to be upgraded in place once the env-var signal is confirmed, without restructuring the guard. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `cli-devin/SKILL.md` §2: a self-invocation guard function implementing the 3 signals above, with the honest-caveat comment.
- `cli-devin/references/cli-reference.md`: documents the guard's signals and the "absence is not proof" caveat for maintainers.

**How to roll back**: Remove the guard function from `SKILL.md`; this reverts to no guard, which immediately fails checklist item CHK-013 and must not be shipped — rollback of this ADR means rolling back the whole packet, not shipping a guardless version.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: prompt-quality-card shape

### Metadata

| Field | Value |
|---|---|
| **Status** | Proposed |
| **Date** | 2026-07-23 |
| **Deciders** | claude-code (authoring), operator (approval pending) |

---

<!-- ANCHOR:adr-003-context -->
### Context

The archived `cli-devin` packet's `prompt-quality-card.md` drifted, in its v1.0.6.x era, into re-inlining a competing 7-framework taxonomy that reused the same acronyms (STAR/BUILD/ATLAS/CONTEXT) already owned by the canonical `sk-prompt/prompt-models` card, but assigned to a different concept. This was a real, previously-fixed bug — the v1.0.7.0 fix turned the card into a thin delegator instead. 112 real dispatches across 3 models (documented in the archived `018` packet's phases 003/007) already validated a specific set of defaults empirically: RCAF-as-default, a medium-effort pre-plan step, and a standard-bundle gate.

Rebuilding `cli-devin`'s prompt-quality card from scratch risks repeating the exact drift that was already found and fixed once.

### Constraints

- `sk-prompt/prompt-models` is the canonical, single source of truth for prompt-craft framework definitions across all model-dispatching packets in this repo.
- The archived 018 packet's empirical findings (RCAF-as-default, medium-pre-plan, standard-bundle-gate) are real, already-validated data — not something this phase should re-derive from a blank page.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Ship the new `cli-devin/assets/prompt-quality-card.md` as a thin delegator from day one, stating a 3-tier precedence rule at the top — (1) the `sk-prompt` framework is authoritative for framework definitions, (2) the model-hub profile (`sk-prompt/prompt-models`) governs per-model defaults, (3) this card only adds Devin-dispatch-mechanics addenda that don't belong in either of the first two tiers.

**How it works**: The card opens with the 3-tier precedence statement, links directly to the canonical `sk-prompt/prompt-models` card, and then documents only what is genuinely Devin-specific: how RCAF/medium-pre-plan/standard-bundle-gate map onto Devin's own hooks/permissions/subagent contract (confirmed in phase 001), without re-defining any framework acronym.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **Thin delegator from day one (chosen)** | Reuses 112 dispatches' worth of already-validated empirical defaults; structurally impossible to re-introduce the acronym-collision bug since no competing taxonomy is defined here | Slightly less self-contained — a reader must follow a link to get the full framework picture | 9/10 |
| Inline a fresh framework table | Would make the card fully self-contained | Rejected — reintroduces the exact bug 018 fixed (a second taxonomy competing for the same acronyms) and throws away 112 dispatches of validated defaults | 1/10 |

**Why this one**: The archived packet already proved empirically what works (RCAF-as-default, medium-pre-plan, standard-bundle-gate) and already proved what breaks (a second competing taxonomy). Choosing the delegator shape costs nothing and structurally forecloses the known failure mode.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Zero risk of re-introducing the acronym-collision bug, since no competing framework taxonomy is defined in this card at all.
- Directly reuses 112 real dispatches' worth of validated defaults instead of re-deriving them from a blank page.

**What it costs**:
- The card is not fully self-contained; a reader needs the canonical `sk-prompt/prompt-models` card open alongside it. Mitigation: the 3-tier precedence rule and a direct link are stated in the first paragraph, so the dependency is immediately visible, not discovered midway through.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| A future edit re-inlines framework content "for convenience" | Medium | ADR-003 is the citable record explaining why that specific convenience was already tried and rejected once. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | Every sibling mode (`cli-opencode`, `cli-claude-code`, `cli-codex`) carries a `prompt-quality-card.md`; family parity requires one here too. |
| 2 | **Beyond Local Maxima?** | PASS | Inlining a fresh taxonomy was considered and rejected on documented historical evidence, not assumption. |
| 3 | **Sufficient?** | PASS | The 3-tier precedence rule plus Devin-specific addenda fully covers what a dispatcher needs, without gaps. |
| 4 | **Fits Goal?** | PASS | Matches the parent packet's explicit instruction to fold in 018's validated findings rather than re-derive them. |
| 5 | **Open Horizons?** | PASS | If `sk-prompt/prompt-models` gains new Devin-relevant defaults later, this card only needs its addenda section touched, not a rewrite. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `cli-devin/assets/prompt-quality-card.md`: new file, thin-delegator shape, 3-tier precedence rule stated first.

**How to roll back**: Delete the file or replace its body with a stub; no other file depends on its internal content (only `SKILL.md`/`README.md` link to it).
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
