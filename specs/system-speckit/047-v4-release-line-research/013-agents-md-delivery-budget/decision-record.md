---
title: "Decision Record: Phase 13: agents-md-delivery-budget"
description: "Decisions for the AGENTS.md manifest and Devin delivery budget: why both wait for the operator, and the exact steps."
trigger_phrases:
  - "agents md delivery budget decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/013-agents-md-delivery-budget"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded the phase decisions"
    next_safe_action: "Implement the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 13: agents-md-delivery-budget

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
## ADR-002: The manifest write is the operator's

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

`agents-md-manifest.cjs --check` fails on history body `865f058927ed`. Its remedy, `--write`, records the AGENTS.md body on disk as released, though that body has not been released.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: No worker runs `--write`. The operator runs `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write` after deciding the AGENTS.md body for the next release, then `--check`.

**Details**: Running it now would erase the evidence V48 rests on and would have to be repeated after any headroom cut.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Operator runs it after the body is settled** | One correct record | Check stays red meanwhile | 8/10 |
| Run it now | Green check | Records an unreleased body as released | 2/10 |

**Why Chosen**: The lead reserved it, and its output is a release claim.

---

### Consequences

**Positive**:
- The release record stays truthful.

**Negative**:
- The check and phase 014's CI step stay red until then.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Devin headroom proposal for the operator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Devin keeps the first 16,384 bytes of AGENTS.md. The canary's last anchor, Blast-Radius Management, ends at byte 16,379. `.devin/SYNC.md` already states that hard rules must stay in the first 16 KB, so the dropped tail (sections 5 to 10 and the repository block) is by design; the defect is the five-byte margin.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Proposal: cut at least 512 bytes from prose above the Blast-Radius heading in AGENTS.md (sections 1 and 2 restate several rules their rule files carry), rerun `check-rule-copies.js`, then run the manifest write from ADR-002.

**Details**: Not applied here: AGENTS.md is the shipped universal template every runtime reads, the same text lives in the operator's global CLAUDE.md, and Devin cannot be run to confirm delivery while its quota is exhausted.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Operator applies a reviewed cut** | One sitting, both findings close | Waits on the operator | 8/10 |
| Cut it here | Closes now | Changes every runtime's instructions unreviewed | 3/10 |
| Generate a Devin-only tail rule file | Delivers the tail | New generator and drift check, unverifiable live | 4/10 |

**Why Chosen**: The edit is small, but its blast radius is every runtime.

---

### Consequences

**Positive**:
- The cut and the manifest write happen together.

**Negative**:
- The margin stays at five bytes until then. Mitigation: the canary fails loudly on the next edit.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

