---
title: "Decision Record: Phase 10: validate-and-retrieval-exit-honesty"
description: "Decisions for the validate and retrieval exit fixes: the skipped-check status, the post-edit scan shape, the trigger index rebuild, and the review adjudication."
trigger_phrases:
  - "validate and retrieval exit honesty decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/010-validate-and-retrieval-exit-honesty"
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
# Decision Record: Phase 10: validate-and-retrieval-exit-honesty

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
## ADR-002: A skipped check reports info, not pass

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

CROSS_ANCHOR_CONTAMINATION printed the pass marker when no routing payload was supplied, so validate.sh showed a check as passed that did not run. No current caller supplies a payload.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Return status `info`, shown as `i` only under `--verbose` and counted as neither a pass nor a warning.

**Details**: Wiring a payload producer was considered and rejected: no verified finding asks for it, and the save writer has no router to produce one.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Info status** | Honest, no new noise | Check stays dormant | 8/10 |
| Warn | Visible | Every packet gains a warning it cannot fix | 3/10 |
| Wire a producer | Check runs | No producer exists to wire | 2/10 |

**Why Chosen**: It removes the false pass without adding a warning nobody can clear.

---

### Consequences

**Positive**:
- No packet changes verdict.

**Negative**:
- The check stays dormant. Mitigation: recorded as such in the summary.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Post-edit scan keeps its folder walk and gains the Draft lifecycle

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The synthesis suggested calling `run_check` from the post-edit scan. Doing so narrowed the scan to the rule's fixed file list and dropped handover.md, timeline.md and other docs the scan used to read, which the review caught.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Keep the folder walk; a value token in a v2.3+ doc of a Draft packet counts as a warning, everything else as a failure.

**Details**: The exit is 1 only on failures, so a Draft packet no longer fails the hook while PLACEHOLDER_FILLED only warns.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Walk plus Draft lifecycle** | No lost coverage, exits agree for Draft | Two scanners keep their own file lists | 8/10 |
| Call `run_check` | One code path | Silently stops reading several docs | 3/10 |

**Why Chosen**: It closes the false failure without opening a false pass.

---

### Consequences

**Positive**:
- The hook reports every doc it reported before.

**Negative**:
- The scan can report a doc strict validation does not read. Mitigation: that is the old behaviour, unchanged.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: The phase-parent ANCHORS_VALID pass stays; only its note changes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

V30: `orchestrator.ts:975-976` returns pass for a phase parent without checking anchors. The skill README (`README.md:303`) documents the exemption; the v4.0.0.5 release note describing the stricter rule did not mention it.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: No code change. The exemption is intended and documented; phase 011 adds it to the v4.0.0.5 note.

**Details**: The orchestrator comment says widening the check to lean parents is a separate decision from what the check asserts. Luna downgraded V30 to a P2 drift on the same reading.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the exemption, fix the note** | Matches the documented design | Lean parents stay unchecked | 8/10 |
| Check parent anchors | One rule for all | Fails every lean parent by design | 2/10 |

**Why Chosen**: The behaviour is deliberate; only the release note was silent about it.

---

### Consequences

**Positive**:
- No packet changes verdict.

**Negative**:
- None measured.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-004 -->
---

<!-- ANCHOR:adr-005 -->
## ADR-005: Cross-family review adjudication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

DeepSeek V4.1 Flash max returned FAIL with three P1 and four P2 rows. The orchestrator reproduced each P1 by reading the code and, for the entry guard, by running the eval through the `.opencode/skills` symlink after the fix.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Fix all three P1s and three P2s; record one P2.

**Details**: Fixed: the post-edit scan's lost coverage, the hand-rolled entry guard (now `isMainModule`), unprovisioned treated as failure, the stale check-goal README, the stale caller comment in the placeholder rule, and the research match on any `research` segment (now anchored to a numbered packet folder). Recorded: the committed trigger index is not regenerated here, because generators are outside worker scope and the index rebuild workflow owns it. The full cli suite afterwards caught a repo-era report regression (a pruned research tree left no skipped row), fixed in the walker.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix reproduced rows, record the generator step** | No reproduced issue left open | Index stays stale until rebuilt | 8/10 |
| Regenerate the index here | No drift | Runs a generator the brief forbids | 3/10 |

**Why Chosen**: It closes every behaviour defect and leaves the one derived-artifact step to its owner.

---

### Consequences

**Positive**:
- Each P1 has a test or probe that fails on the old code.

**Negative**:
- Index drift until the next rebuild. Mitigation: listed in the summary limitations for the operator.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-005 -->
---

