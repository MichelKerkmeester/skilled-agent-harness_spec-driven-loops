---
title: "Decision Record: Completion Evidence Sentinel"
description: "Architecture decisions for the completion-evidence sentinel: the shared runtime-neutral core plus two thin adapters boundary, and the advisory / fail-open posture with no block and no enforce env in v1."
trigger_phrases:
  - "completion evidence sentinel decisions"
  - "completion sentinel adr"
  - "shared core two adapters boundary"
  - "advisory fail-open posture decision"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/004-completion-evidence-sentinel"
    last_updated_at: "2026-07-11T09:03:30.617Z"
    last_updated_by: "spec-author"
    recent_action: "Authored two ADRs for the completion-evidence sentinel"
    next_safe_action: "Hold ADR status at Proposed until the core lands"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts"
      - ".opencode/plugins/mk-completion-sentinel.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-completion-evidence-sentinel"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Completion Evidence Sentinel

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Shared runtime-neutral core plus two thin adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Spec author, packet 132 owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed the sentinel to run on two runtimes with different event shapes: the Claude `Stop` hook, which already hands over the last assistant message and the resolved spec folder, and the OpenCode `session.idle` event, which hands over neither. A single definition of "completion claim", one evidence-evaluation policy, and one bounded-log path must hold across both, or the two runtimes drift.

### Constraints

- The Claude `Stop` owner `session-stop.ts` already resolves `lastSpecFolder` and `last_assistant_message`; the adapter must reuse that state, not recompute it.
- The completion-claim regex already exists at `quality-loop.ts:13`; a second copy would drift.
- The repo already proves this shape with `dispatch-guard.cjs` plus `task-dispatch-guard.cjs` and `mk-deep-loop-guard.js`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: put all policy in one runtime-neutral core `completion-evidence-sentinel.cjs` and keep both adapters thin.

**How it works**: the core exposes `detectCompletionClaim` and `evaluateCompletionEvidence` and returns a transport-free decision. The Claude adapter requires the core after its atomic state write. The OpenCode adapter resolves the last message and packet via `ctx.client`, then delegates to the same core.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared core plus two thin adapters** | One policy, one log path, matches an already-proven repo shape | The OpenCode adapter still owns its own last-message resolution | 9/10 |
| Two independent hook implementations | Each runtime is self-contained | Two definitions of "completion claim" and two log paths drift over time | 4/10 |
| Claude-only hook, skip OpenCode | Smallest surface | Leaves OpenCode with no backstop and no shared contract to grow into | 5/10 |

**Why this one**: it removes the drift risk at the source and reuses a pattern the repo already runs in production for the deep-loop guard.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One place owns claim detection, evidence evaluation, dedup, and the bounded log.
- The core is unit-testable in isolation, which proves the no-test guarantee before any adapter is wired.

**What it costs**:
- The OpenCode adapter must resolve the last message and packet itself. Mitigation: best-effort resolution via `ctx.client`, and no-op when it cannot resolve them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The core grows runtime-specific branches | Med | Keep transport in the adapters; the core returns a decision only |
| Editing `session-stop.ts` ships a stale dist | Med | Rebuild `mcp_server/dist` in the same task; verify with the freshness guard |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The COMPLETION VERIFICATION RULE has no runtime backstop today; both runtimes need one |
| 2 | **Beyond Local Maxima?** | PASS | Two-independent-hooks and Claude-only alternatives were weighed and scored |
| 3 | **Sufficient?** | PASS | One core plus two thin adapters is the smallest shape that serves both runtimes |
| 4 | **Fits Goal?** | PASS | Directly on the packet 132 critical path: shared core is the first deliverable |
| 5 | **Open Horizons?** | PASS | The transport-free core can later gate an enforce posture without a rewrite |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New core `completion-evidence-sentinel.cjs` under `mcp_server/lib/hooks`.
- `session-stop.ts` gains a call to the core after the atomic write, then a dist rebuild.
- New OpenCode plugin `mk-completion-sentinel.js` delegating to the core.

**How to roll back**: revert the `session-stop.ts` insert and rebuild dist, delete `mk-completion-sentinel.js` and its README entry; the core and its test are inert with no caller.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Advisory and fail-open posture with no block and no enforce env in v1

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Spec author, packet 132 owner |

---

### Context

The sentinel reacts to a completion claim detected by a broad regex that can false-positive on mid-turn narration. A blocking posture on a noisy signal would force continuation and interrupt correct work. We needed a posture that surfaces the signal without ever changing control flow while the detector is still broad.

### Constraints

- The Claude `Stop` hook must not emit `{decision:"block"}`, which forces Claude to continue.
- The OpenCode plugin must never write stdout or stderr, which corrupts the TUI.
- The signal quality is not yet good enough to gate a block posture.

### Decision

**We chose**: an observe-and-advise, fail-open, non-blocking posture for the entire v1 rollout, with no reject or enforce env.

**How it works**: the core returns `ok` or `advise` with a detail. Adapters log the advisory to a bounded shared log and surface it for observability. Any internal error resolves to a silent `ok`. A future `SPECKIT_COMPLETION_SENTINEL_ENFORCE` could gate a block posture, but only after the claim detector is tightened.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisory, fail-open, no enforce env** | Zero control-flow risk during rollout, safe on a noisy detector | No hard stop until a later phase | 9/10 |
| Block on missing evidence now | Strongest enforcement | Forces continuation on false positives, interrupts correct work | 3/10 |
| Ship an enforce env off by default | Enforcement is one flag away | Invites premature flipping before the detector is tightened | 5/10 |

**Why this one**: it matches the signal quality we actually have and keeps the rollout reversible and quiet.

### Consequences

**What improves**:
- The rollout cannot change control flow, so a sentinel bug or a false positive is harmless.
- Dedup plus a bounded log keeps the advisory cheap even when the regex over-fires.

**What it costs**:
- No hard enforcement in v1. Mitigation: the transport-free core can gate an enforce posture later without a rewrite.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The advisory is ignored because it never blocks | Med | Surface it in the Stop return object and the bounded log for observability |
| A future enforce flag is flipped too early | Med | Document the detector-tightening prerequisite before any enforce posture |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A block posture on a broad regex would interrupt correct work |
| 2 | **Beyond Local Maxima?** | PASS | Block-now and enforce-env-off alternatives were weighed and scored |
| 3 | **Sufficient?** | PASS | Advisory plus bounded log delivers the backstop without control-flow risk |
| 4 | **Fits Goal?** | PASS | Matches the near-term verdict: build the backstop, defer enforcement |
| 5 | **Open Horizons?** | PASS | Leaves a clean path to an enforce posture once the detector is tightened |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- The core returns only `ok` or `advise`; it never returns a block decision.
- The Claude adapter surfaces the advisory via `hookLog`, the bounded log, and the return object, and never emits `{decision:"block"}`.
- The OpenCode adapter appends to the bounded log only, never stdout or stderr.

**How to roll back**: remove the advisory surfacing and the core call; no env or control-flow change was introduced, so there is nothing further to unwind.
