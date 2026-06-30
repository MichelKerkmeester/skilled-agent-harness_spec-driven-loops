---
title: "Decision Record: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field [template:level_3/decision-record.md]"
description: "Decision record template for documenting architectural choices, alternatives, consequences, and implementation notes."
trigger_phrases:
  - "decision"
  - "record"
  - "name"
  - "template"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/006-subagent-governor-recursion"
    last_updated_at: "2026-06-15T14:06:38Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-subagent-governor-recursion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Inject the governor through structural channels, not the subagent-blind hook

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-15 |
| **Deciders** | fable-5 packet owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

<!-- Voice guide: State the problem directly. "We needed to choose between X and Y because Z"
     not "A decision was required regarding the selection of an appropriate approach." -->

We needed a way to get the fable-5 governor in front of sub-agents. Phase 005 rides the live per-turn skill-advisor hook, but that hook is subagent-blind: it never fires for deep-loop iterations or for agents dispatched through the Task tool. That is exactly the long-running, token-heavy work where the efficiency doctrine matters most, so leaving it ungoverned defeats the point of the capsule.

### Constraints

- The governor capsule text is owned by phase 005; this phase consumes it and must not maintain a second copy.
- The three runtime agent prompts (`.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`) must stay consistent; only the canonical OpenCode source may be hand-edited, with `agent-mirror-sync.yml` propagating the rest.
- The change must be backward compatible: a deep-loop run with no governor configured must render and parse exactly as before.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Inject the governor structurally through `renderPromptPack` and the canonical agent prompt bodies, with an optional `governor` field on the executor config, rather than relying on the subagent-blind hook or static read-surface text.

**How it works**: A single `{governor_block}` token in `prompt-pack.ts` and the two deep-loop iteration templates carries the capsule into every rendered iteration. The same capsule is embedded in the canonical `.opencode/agents/*.md` prompts and propagated to the Claude and Codex mirrors by `agent-mirror-sync.yml`. An optional `governor` field on `executorConfigSchema` lets a deep-loop run supply a per-lineage governor; absent that field, the token defaults to empty and behavior is unchanged.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Structural injection (chosen)** | Subagent-visible; survives because it is enforced code/templates; one token, no per-surface duplication | Touches runtime code + templates + agent prompts; needs the mirror-sync workflow | 9/10 |
| AGENTS-only governor | Cheapest text edit | Setpoint decays without the thermostat; still subagent-blind | 3/10 |
| Hand-edit all three agent mirrors | No workflow dependency | Drifts without a sync mechanism; high maintenance | 2/10 |

**Why this one**: It is the only option that actually reaches sub-agents, and it puts the governor on enforced code/template surfaces that do not decay, at the cost of one token and the existing mirror-sync workflow.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Sub-agents and deep-loop iterations finally operate under the efficiency doctrine, closing the largest governance gap (the token-heavy long-running work).
- The governor lives on enforced surfaces that survive context decay, not advisory text that fades.

**What it costs**:
- A new required prompt-pack token could break renders that do not supply it. Mitigation: default `{governor_block}` to empty so absent governor renders unchanged.
- The mirror-sync workflow becomes load-bearing for agent-prompt edits. Mitigation: edit only the canonical source and verify mirror consistency after the workflow runs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Token regression breaks existing renders | H | Default token to empty; keep prompt-pack tests green before claiming done |
| Mirror drift from manual edits | M | Edit only `.opencode/agents/*.md`; rely on `agent-mirror-sync.yml`; verify after |
| Governor text diverges from phase 005 | M | Treat phase 005 as the single source; reference, do not copy |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The hook is subagent-blind; without this channel the governor never reaches deep-loop iterations or dispatched agents. |
| 2 | **Beyond Local Maxima?** | PASS | AGENTS-only and hand-edited-mirror alternatives were weighed and rejected. |
| 3 | **Sufficient?** | PASS | One token plus one optional field covers all subagent-visible surfaces without per-surface duplication. |
| 4 | **Fits Goal?** | PASS | The 002 implementation sequence puts structural enforcement (subagent channel) before advisory text. |
| 5 | **Open Horizons?** | PASS | The optional `governor` field leaves room for later model-family specialization without a schema rewrite. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `prompt-pack.ts` renders a `{governor_block}` token; the deep-research and deep-review iteration templates declare the slot.
- `executorConfigSchema` gains an optional `governor` field; the canonical `.opencode/agents/*.md` prompts embed the governor and are mirrored by `agent-mirror-sync.yml`.

**How to roll back**: Git revert the `prompt-pack.ts`, template, and `executor-config.ts` edits; revert the agent-prompt edits and re-run `agent-mirror-sync.yml` to restore the mirrors. All changes are additive with safe defaults, so no data migration is involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Scope the recursion-control rule to extended-thinking xhigh executors

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-15 |
| **Deciders** | fable-5 packet owner |

### Context

The Opus anxiety loop shows up on extended-thinking xhigh executors: the model reasons about itself and audits its own audit instead of returning to the task, burning tokens. We needed a rule that damps that loop without throttling legitimate normal-effort work.

### Decision

**We chose**: Ship `recursion-control.md` as a generic constitutional rule scoped to extended-thinking xhigh executors, carrying the doctrine "reason about the problem and the person, not yourself", an audit-depth-limit-1, and the caption test; keep it advisory for normal-effort runs.

**How it works**: The rule names the failure mode and gives a concrete stop condition (audit-depth-limit-1: do not audit your own audit) plus the caption test (if a thought would not survive being read aloud as a caption on the work, drop it and return to the task). It surfaces from the constitutional pointer so xhigh dispatches pick it up.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Generic rule, xhigh-scoped (chosen)** | Targets the actual failure mode; portable now, specializable later | Rules 1-2 are Anthropic-specific, so portability is partial | 8/10 |
| Hard blocker on all runs | Strongest enforcement | Over-blocks normal-effort work; high false-positive cost | 2/10 |
| Model-family-specific rule now | Precise per model | Premature; the portability taxonomy says ship generic first | 3/10 |

**Why this one**: It addresses the measured anxiety loop where it occurs (xhigh) and follows the 002 recommendation to ship generic and specialize later.

### Consequences

**What improves**:
- xhigh executors get a concrete stop condition for self-referential recursion, reducing wasted tokens.
- The rule is discoverable from the constitutional surfacing pointer alongside the other rules.

**What it costs**:
- Rules 1-2 are Anthropic-specific, so the rule is only partially portable. Mitigation: ship generic now, parameterize per model-family in a later layer.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The anxiety loop is a named, observed failure mode on xhigh executors. |
| 2 | **Beyond Local Maxima?** | PASS | Hard-blocker and model-specific alternatives were weighed and rejected. |
| 3 | **Sufficient?** | PASS | Audit-depth-limit-1 plus the caption test give a concrete stop condition. |
| 4 | **Fits Goal?** | PASS | Recursion-control is the antidote the governor capsule's rule 1 names. |
| 5 | **Open Horizons?** | PASS | Generic-first leaves room for per-model specialization without a rewrite. |

### Implementation

**What changes**:
- New file `.opencode/skills/system-spec-kit/constitutional/recursion-control.md`.
- One line added to the constitutional surfacing pointer so the rule is discoverable.

**How to roll back**: Delete `recursion-control.md` and remove its line from the constitutional surfacing pointer. No code depends on it, so removal is clean.

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

