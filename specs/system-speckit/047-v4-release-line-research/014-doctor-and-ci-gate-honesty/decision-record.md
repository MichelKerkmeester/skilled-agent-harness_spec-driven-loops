---
title: "Decision Record: Phase 14: doctor-and-ci-gate-honesty"
description: "Decisions for the doctor and CI gate fixes: drift classes for the symlink check, the report-only manifest step, the deferred P2s and the review adjudication."
trigger_phrases:
  - "doctor and ci gate honesty decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/014-doctor-and-ci-gate-honesty"
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
# Decision Record: Phase 14: doctor-and-ci-gate-honesty

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
## ADR-002: Which symlink states are drift

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The check returned 0 for every state. Making every non-linked state an error would fail `/doctor:install` on its own normal input, since a project with `.claude/` starts as a partial merge.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Exit 1 for broken, foreign-link, source-missing, tracked absolute links and a partial merge with broken links; exit 0 for missing, local, project-owned and a partial merge with only missing children.

**Details**: The review measured the pre-install fixture exiting 1 under the first rule, which is why partial merge was split.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Split partial merge by broken links** | Install input stays clean, real breakage fails | One more rule | 8/10 |
| Every non-linked state fails | Simple | Fails install's normal input | 3/10 |

**Why Chosen**: A broken link is drift; a missing link is work.

---

### Consequences

**Positive**:
- Install and symlink routes read one rule.

**Negative**:
- A half-finished install exits 0. Mitigation: its report lists every missing child.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Manifest check report-only, two P2s deferred

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

No workflow ran the AGENTS.md manifest check, but it fails today until the operator's write (phase 013). V63 and V64 were downgraded by Luna as a per-command contract and an improvement.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Add the manifest check to advisory CI as report-only; defer V63 and V64 with reasons.

**Details**: Promote the manifest step to blocking after the operator's write. V63 needs a release-update contract change; V64 is covered by the sync checkers this phase wires in.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Report-only now, blocking later** | Visible without reddening every PR | Not a gate yet | 8/10 |
| Blocking now | Strict | Every PR red until the operator acts | 3/10 |

**Why Chosen**: The step's purpose is visibility, and the fix belongs to the operator.

---

### Consequences

**Positive**:
- The failure that shipped unseen is now visible on every run.

**Negative**:
- Not enforced until promoted.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Cross-family review adjudication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

DeepSeek reviewed Luna's part and returned FAIL: a presentation template with two STATUS vocabularies (P1), partial merge counted as drift on install's normal input, no repair line for the new parity step, a stale playbook line, and thin exit tests (P2s). Luna reviewed DeepSeek's part and returned PASS.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Fix all five rows; accept the PASS.

**Details**: Fixed in one Luna brief: one STATUS vocabulary checked across every template line, the partial-merge split, a repair line naming the generators and the hand-maintained Claude agent files, the playbook line, and tests for foreign-link, partial merge both ways and project-owned alone.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix every row** | No reproduced issue open | One more brief | 9/10 |
| Fix the P1 only | Faster | Leaves install misreporting | 4/10 |

**Why Chosen**: Each row was reproduced or measured by the reviewer.

---

### Consequences

**Positive**:
- Each exit class has its own test.

**Negative**:
- None measured.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-004 -->
---

