---
title: "Decision Record: Phase 21: host-root-marker-refresh"
description: "Decisions for the marker refresh in a host repository and the anchor proof behind it."
trigger_phrases:
  - "host root marker refresh decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/021-host-root-marker-refresh"
    last_updated_at: "2026-11-09T13:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the phase decisions"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-lead"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 21: host-root-marker-refresh

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse host detection for the upgrade-legacy repository

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Lead orchestrator (operator asked for these fixes) |

---

### Context

upgrade-legacy took its repository from its own file location. In Barter that is the vendored `skilled/` tree, so the refresh could never reach Barter's packets, and phase 019 shipped it with a caveat instead of a working host path.

### Constraints
- Barter's checkout is read-only from this session.

---

### Decision

**Summary**: When the caller's checkout is a host by `isHostRepository`, it is the repository; otherwise the file location still decides.

**Details**: In a host the default root is `specs/` only, because `.opencode/specs` there resolves into the vendored tree. Folders git ignores in the host are skipped with one `git check-ignore` call, because Barter keeps an ignored mirror of Skilled's packets under `specs/skilled/`. The run names the host and the number of skipped folders on stderr, and says so when every folder was ignored, because a global excludes file that ignores `/specs` would otherwise empty the run without a word.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse `host-index.mjs`** | One definition of a host for the index and the refresh | Depends on the caller's working directory | 9/10 |
| A `--repo-root` flag | Explicit | Every host has to know to pass it, which is the caveat this replaces | 5/10 |

**Why Chosen**: The trigger index already ships this detection and its tests, and a host run needs no new flag.

---

### Consequences

**Positive**:
- A host refreshes its own packets with the documented command.

**Negative**:
- A run from inside a host now reads the host, not the vendored tree. Mitigation: the stderr line names the repository.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: The marker proof counts every anchor the template emits

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Lead orchestrator (operator asked for these fixes) |

---

### Context

The Barter dry run refused 1,482 documents and refreshed none. A freshly scaffolded Level 2 phase child with its marker set back to v2.2 was refused for carrying `phase-context` and `measured-behavior`, two anchors the current template renders. `provenMarker` read only the contract's required and optional anchors and ignored its `allowedAnchors`. The same refusal blocked `headerAdd`, the default lane mode that stamps a missing marker.

### Constraints
- Barter's checkout is read-only from this session.

---

### Decision

**Summary**: An extra anchor is one the level never emits: required, optional and allowed anchors together. A missing anchor is a required or optional one. A document already at its level's marker gets no refusal from `refreshMarker`.

**Details**: The brief asked for the union on both sides. The worker measured that checking `missing` against the union refused 5,073 of this repository's 5,379 spec documents for an absent `measured-behavior`, which arrived with v2.4, so the refresh could reach almost none of the documents it exists for. The lead accepted the narrower missing check: the contract itself does not require that block, and the validator only warns when it is absent. A document with an anchor the template never emits is still refused.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Emitted set for extras, mandatory set for missing** | Matches what the contract requires | A refreshed v2.2 spec may lack the measured-behavior block | 8/10 |
| Union on both sides | Strictest | Refuses almost every document that needs a refresh | 3/10 |
| Required anchors only | Most permissive | Drops the optional-section proof phase 019 relied on | 4/10 |

**Why Chosen**: It follows the contract's own line between required and permitted anchors.

---

### Consequences

**Positive**:
- Current documents prove their marker, and the refresh reaches real packets.

**Negative**:
- A refreshed document can claim v2.4 while missing a block v2.4 renders; the validator's measured-behavior warning still reports it.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Lead orchestrator (operator asked for these fixes) |

---

### Context

Goal G4 asks for the other model family to review each diff. cli-codex is out of quota until 2026-11-13, so DeepSeek wrote every change.

### Constraints
- Barter's checkout is read-only from this session.

---

### Decision

**Summary**: The lead (Claude) reviewed each worker diff before accepting it and reran every touched suite.

**Details**: The review accepted one worker deviation (ADR-002) and asked for one follow-up, the skipped-folder count on stderr. No defect remained open at close.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Claude review of DeepSeek diffs** | Second family, available now | Not GPT | 8/10 |
| Wait for Luna | Brief-exact family | Blocks the phase four days | 3/10 |

**Why Chosen**: Claude is the second family available today, as in phases 018 and 019.

---

### Consequences

**Positive**:
- Every diff was read before it landed.

**Negative**:
- No GPT review on this phase.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: not applicable; process decision.

<!-- /ANCHOR:adr-003 -->
