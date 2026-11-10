---
title: "Decision Record: Phase 11: spec-kit-doc-drift"
description: "Decisions for the spec-kit doc drift fixes: text over code for each finding, and the review result."
trigger_phrases:
  - "spec kit doc drift decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/011-spec-kit-doc-drift"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded the phase decisions"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 11: spec-kit-doc-drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Workflow deviations under an absent operator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

`/speckit:plan:auto` step 5 dispatches four `@context` explorers through the Task tool and both workflows end in a continuity save through `generate-context.js`. This orchestrator runs as a leaf that may not dispatch native agents, and goal G4 reserves code writes for CLI workers.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Explore inline from the parent synthesis evidence, run CLI workers one at a time, and keep continuity in the spec docs' `_memory` blocks instead of running the save writer.

**Details**: The plan YAML's own fallback ("Use inline planning activities below") covers the explorers. The research for this phase is the parent synthesis, so no phase `research/research.md` is created. cli-codex rule 15 keeps one CLI dispatch alive at a time without operator approval. The phase commit sets `SPECKIT_SKIP_SPEC_REMINT=1`, and no other hook skip, as the lead approved: the spec-remint pre-commit check refuses a commit that stages 047 docs while another 047 child has unstaged edits, which is always true with two orchestrators in one worktree. `repair-derived.cjs --apply` runs on the parent and this phase under the commit lock first, and the lead makes one final unbypassed commit.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inline exploration, serial workers** | Breaks no rule | Slower | 8/10 |
| Parallel CLI workers | Faster | Breaks cli-codex rule 15 without approval | 3/10 |

**Why Chosen**: It is the only option that breaks no rule.

---

### Consequences

**Positive**:
- Every write traces to one brief.

**Negative**:
- Longer wall-clock time. Mitigation: one change per brief keeps each run short.

---

### Implementation

**Affected Systems**: none beyond this phase's files.

**Rollback**: not applicable; process decision.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Fix the text, not the code, for every finding

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Each finding is a document promising behaviour the code lacks: a scope-adherence rule, a tiered save router, a truthy kill switch. The synthesis names the documents as the fix and offers widening the kill-switch parser as an option.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Change the documents. Build nothing and widen no parser.

**Details**: Widening the gate core to accept `true`, `yes` and `on` would change what disables a safety gate, which no verified finding asks for. Building a scope-adherence rule or a router is feature work outside a remediation line.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix the text** | Smallest true change | Two parser grammars remain | 8/10 |
| Widen the gate parser | Docs stay as written | Changes a kill switch's behaviour | 4/10 |

**Why Chosen**: Every finding closes with no behaviour change.

---

### Consequences

**Positive**:
- No runtime risk.

**Negative**:
- Two grammars for one variable remain. Mitigation: the docs name the value both accept.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Cross-family review adjudication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Luna (read-only) checked each changed sentence against the code, including the OpenCode plugin's reader and the `/doctor:env` parser.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: PASS with no rows; nothing to adjudicate.

**Details**: The review confirmed the OpenCode plugin reads the switch through `isHookEnabled`, so it accepts the wider grammar, which the new row text allows for.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept PASS** | Evidence-backed | None | 9/10 |
| Second review | More eyes | No open question to answer | 3/10 |

**Why Chosen**: The review cited code for each claim.

---

### Consequences

**Positive**:
- Each sentence has a code citation.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

