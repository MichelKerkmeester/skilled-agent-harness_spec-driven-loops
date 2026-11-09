---
title: "Decision Record: Phase 20: operator-approved-closeout"
description: "The operator's four answers of 2026-11-09, verbatim, and the review of the AGENTS.md cut."
trigger_phrases:
  - "operator approved closeout decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/020-operator-approved-closeout"
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
# Decision Record: Phase 20: operator-approved-closeout

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
## ADR-002: Operator answer 1: AGENTS.md

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Asked by the lead through AskUserQuestion on 2026-11-09 and relayed to this orchestrator verbatim.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: 1. AGENTS.md: "Cut, then write (Recommended)": a worker cuts at least 512 bytes of restated prose from AGENTS.md sections 1-2, review, rerun copy checks, then manifest --write and --check.

**Details**: Applied in this phase: 579 bytes cut net, Blast-Radius ends at 15,800, `--write` then `--check` exit 0.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **The operator's answer** | Decided by the operator | None | 10/10 |

**Why Chosen**: The operator decided it.

---

### Consequences

**Positive**:
- The open item has an owner decision.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Operator answer 2: Regenerate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Asked by the lead through AskUserQuestion on 2026-11-09 and relayed to this orchestrator verbatim.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: 2. Regenerate: "Regenerate both (Recommended)": sk-design compiled-routing manifest and the trigger index, via their generators in the worktree.

**Details**: Applied in this phase: `compiled-route-manifest.cjs refresh` for sk-design and `generate-trigger-index.mjs` for the index.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **The operator's answer** | Decided by the operator | None | 10/10 |

**Why Chosen**: The operator decided it.

---

### Consequences

**Positive**:
- The open item has an owner decision.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Operator answer 3: Leftovers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Asked by the lead through AskUserQuestion on 2026-11-09 and relayed to this orchestrator verbatim.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: 3. Leftovers: "Delete them (Recommended)": done by the lead (scratchpad zips and test folder, untracked 047 .skilled/logs; 043's .skilled/logs kept because it is tracked).

**Details**: Not in this phase's files; the lead did it.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **The operator's answer** | Decided by the operator | None | 10/10 |

**Why Chosen**: The operator decided it.

---

### Consequences

**Positive**:
- The open item has an owner decision.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-004 -->
---

<!-- ANCHOR:adr-005 -->
## ADR-005: Operator answer 4: Merge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Asked by the lead through AskUserQuestion on 2026-11-09 and relayed to this orchestrator verbatim.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: 4. Merge: "Merge to main and push": the lead merges worktrees/334-v4-release-remediation into main and pushes after the final gates.

**Details**: Not in this phase's files; the lead runs it after the final gates.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **The operator's answer** | Decided by the operator | None | 10/10 |

**Why Chosen**: The operator decided it.

---

### Consequences

**Positive**:
- The open item has an owner decision.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-005 -->
---

<!-- ANCHOR:adr-006 -->
## ADR-006: Review of the AGENTS.md cut

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

GPT is out of quota until 2026-11-13, so the second-family review is Claude's, line by line.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: PASS after one restore. The worker's cut removed "(a save, a resume, a further iteration)" from Gate 3's trigger, the only place AGENTS.md says a resume or a further iteration is a continuity write; the reviewer restored it. Every other cut drops an example, a restatement of a pointer target or filler, with obligations, triggers, exceptions, pointers and numbers unchanged.

**Details**: Removed restatements include PLAN-WORKFLOW LOCK's closing blockquote (steps 1 to 3 and the HARD BLOCKER heading carry it) and Gate 4's last sentence (its first bullet says the same). The doctor over-budget fixture padded the shipped document by 100 lines to pass 32,768 bytes; after the cut it fell to 32,461, so its padding went to 200 lines.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Restore the one weakened example** | Keeps Gate 3's scope | 40 bytes back | 9/10 |
| Accept the cut whole | More headroom | Resume no longer named as a Gate 3 trigger | 3/10 |

**Why Chosen**: A headroom cut must not narrow a gate.

---

### Consequences

**Positive**:
- 584 bytes of Devin headroom with no rule changed.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-006 -->
---

