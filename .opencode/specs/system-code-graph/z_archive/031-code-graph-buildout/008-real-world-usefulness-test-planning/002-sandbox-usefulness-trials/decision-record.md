---
title: "Decision Record: Real-World Usefulness Test Execution"
description: "Execution ADRs documenting sandbox deferrals and scoring mechanics."
trigger_phrases:
  - "real-world usefulness execution"
  - "026/007/012/001"
  - "usefulness synthesis"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/008-real-world-usefulness-test-planning/002-sandbox-usefulness-trials"
    last_updated_at: "2026-05-06T04:35:32.335Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Recorded execution methodology decisions"
    next_safe_action: "Review synthesis gaps or rerun deferred live runtime cells"
    blockers:
      - "Authenticated/networked external CLI runtimes unavailable in sandbox"
      - "Claude Code and OpenCode native live sessions unavailable from sandbox"
    key_files:
      - "decision-record.md"
      - "synthesis-report.md"
    session_dedup:
      fingerprint: "sha256:0260070120010260070120010260070120010260070120010260070120010260"
      session_id: "026-007-012-002-sandbox-usefulness-trials"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved for this execution packet."
---
# Decision Record: Real-World Usefulness Test Execution

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat Live Runtime Cells as Deferred When the Sandbox Cannot Observe Them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-06 |
| **Deciders** | User, Codex |

### Context

The parent matrix includes native Claude Code and OpenCode cells plus external CLI cells. The sandbox can run local shell commands and scripts, but it cannot create a real interactive native runtime session, and the observed external CLIs blocked on permission, auth, DNS, or browser-login prompts.

### Constraints

- Do not fabricate model behavior or hook consumption.
- Preserve smoke-test failure evidence.
- Continue local trials where the implementation can be called directly.

### Decision

**We chose**: Complete sandbox-direct cells and mark live/runtime cells deferred with a concrete blocker.

**How it works**: The execution packet maps completed cells to local evidence and lists every deferred parent cell in `plan.md` and `synthesis-report.md`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Explicit deferral | Honest and reproducible. | Leaves runtime coverage gaps. | 9/10 |
| Simulate model outputs | Fills the matrix visually. | Invalid evidence. | 1/10 |
| Stop after first runtime failure | Saves time. | Misses local code graph/hook evidence. | 4/10 |

### Consequences

**What improves**:
- The synthesis distinguishes real local evidence from unmeasured runtime behavior.
- Follow-up work has an exact deferred-cell list.

**What it costs**:
- Plugin/runtime integration verdict is sandbox-limited.

### Implementation

- `plan.md` lists completed and deferred cells.
- `synthesis-report.md` includes deferred cells and recommended follow-up.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use Local Lower-Bound Controls for Graph and Hook Trials

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-06 |
| **Deciders** | User, Codex |

### Context

The parent plan calls for paired controls. In a non-interactive sandbox, the most reproducible controls are shell-level lower bounds: `rg` for code graph scenarios, labeled prompt rows for advisor/classifier scenarios, and no-prime records for startup context.

### Constraints

- Controls must use the same repo state.
- Controls must not rely on unrecorded human memory.
- Controls need raw evidence files.

### Decision

**We chose**: Use reproducible local controls and label them as lower bounds rather than full human IDE timings.

**How it works**: Every completed code graph scenario has a paired `manual-rg` control row. Advisor and Gate 3 scenarios use the labeled prompt corpus as the truth baseline.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Local lower-bound controls | Reproducible and fast. | Understates human reading cost. | 8/10 |
| Manual stopwatch controls | Closer to real workflow. | Less reproducible in one pass. | 6/10 |
| No controls | Faster. | Violates parent methodology. | 1/10 |

### Consequences

**What improves**:
- Deltas are traceable to raw output.
- The campaign can be rerun without relying on hidden operator state.

**What it costs**:
- Timing wins are conservative.

### Implementation

- Control files live under `trials/control/`.
- Aggregate reports separate assisted and control means.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Estimate Tokens When CLIs Do Not Report Them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-06 |
| **Deciders** | User, Codex |

### Context

Local scripts and shell commands do not expose model-token counters. The parent packet permits `UNKNOWN` for unavailable token metrics, but the requested trial schema includes `tokens_estimated`.

### Constraints

- Do not claim exact model billing tokens.
- Preserve a rough cost proxy for aggregation.

### Decision

**We chose**: Estimate tokens as text character length divided by four and call the field an estimate in analysis.

**How it works**: The harness computes `Math.ceil(text.length / 4)` from prompts, raw outputs, and stderr.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Character/4 estimate | Simple, comparable proxy. | Not exact billing tokens. | 7/10 |
| UNKNOWN for all local rows | Honest. | Loses cost trend signal. | 5/10 |
| External tokenizer dependency | More accurate. | Adds setup and dependency risk. | 4/10 |

### Consequences

**What improves**:
- Aggregation can compare approximate verbosity.

**What it costs**:
- Synthesis must avoid exact cost claims.

### Implementation

- `analysis/aggregated-metrics.md` labels means as estimated tokens.
- `synthesis-report.md` confidence note scopes token precision.
<!-- /ANCHOR:adr-003 -->
