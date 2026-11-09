---
title: "Decision Record: Phase 19: template-marker-upgrade-and-staleness-scope"
description: "Decisions for the old-marker upgrade path and the staleness discovery scope."
trigger_phrases:
  - "template marker upgrade and staleness scope decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/019-template-marker-upgrade-and-staleness-scope"
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
# Decision Record: Phase 19: template-marker-upgrade-and-staleness-scope

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
## ADR-002: An opt-in refresh mode, bound to the anchor proof

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

MIGRATION.md section 2 says not to rewrite old packets only to normalize markers, and section 4 allows a marker only when the anchors exactly match the template. A passing packet with an old marker had no path forward.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Add `--refresh-markers` to upgrade-legacy. It moves an existing marker only to the marker `provenMarker` returns, refuses otherwise, and is never part of a default run.

**Details**: Under `--apply` the packet's fingerprint is re-derived, then the packet is revalidated; failure restores documents and the generated pair byte for byte. The worker found that revalidating before re-deriving fails every packet with generated metadata, so the order changed from the brief.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in proven refresh** | Clears stale markers without inventing provenance | One more flag | 8/10 |
| Documented refusal | No code | Hosts keep stale reports forever | 4/10 |
| Restamp every marker to current | Simple | Claims renders documents do not have | 1/10 |

**Why Chosen**: The proof already exists, so the move is honest.

---

### Consequences

**Positive**:
- A host can clear proven stale markers.

**Negative**:
- Documents whose anchors differ stay stale and need authoring.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Staleness discovery follows the corpus walker's root and names

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The checker ran `find` from the repository root, so fixture packets, archives and a host's vendored tree counted as stale packets.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Walk `<root>/specs/` only and prune the walker's directory names, with `-fixtures` limited to lowercase-first names.

**Details**: A naive `*-fixtures` glob dropped seven real numbered packets in this repository; the lowercase-first form keeps them. Archives are excluded, as in upgrade-legacy's default.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared names, spec root** | Matches the corpus; plain find | Path-scoped walker rules not copied | 8/10 |
| Call the node walker | Exact parity | Node dependency and slower startup in a shell tool | 6/10 |

**Why Chosen**: The name list is the part that decides what is a packet.

---

### Consequences

**Positive**:
- Counts drop to real packets in both trees.

**Negative**:
- Two folders under one research packet still count.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Follow-up: vendored copies, deep-run trees and ignored mirrors

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The lead reran the first pass read-only from Barter: 8146 folders, with 49 fixture paths inside nested vendored Skilled copies under research lineages, plus 2534 folders in `specs/skilled/`, an untracked mirror Barter's .gitignore ignores.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Prune lineages, containment and research_archive by name; skip any tree under a `.skilled/skills/system-spec-kit` sentinel; skip git-ignored folders using the corpus walker's own git query.

**Details**: The sentinel pass is one extra find, with no per-directory subprocess. The ignore query is `git ls-files --others --ignored --exclude-per-directory=.gitignore --directory`, counting committed .gitignore files only, and a git failure ignores nothing. Barter: 1008 folders, 0 fixture entries, 34 s.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sentinel plus walker's ignore rule** | General; matches the corpus | Two extra passes | 9/10 |
| Name-match `skilled` | Simple | Barter-specific | 3/10 |

**Why Chosen**: Both rules already define what is not a packet elsewhere in the framework.

---

### Consequences

**Positive**:
- Host report lists only host packets.

**Negative**:
- A vendored copy without the sentinel and not ignored would still count.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-004 -->
---

<!-- ANCHOR:adr-005 -->
## ADR-005: Review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

GPT is out of quota until 2026-11-13, so the second-family review is Claude's.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: PASS. Diffs read line by line; claims rechecked by rerunning the checker, the Bash 3.2 form, the lock guard and the tests.

**Details**: One P2 comment-wording note, recorded as a limitation.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Claude review** | Different family from the writer | Not the planned GPT lens | 8/10 |

**Why Chosen**: Only other family available.

---

### Consequences

**Positive**:
- Independent check of every claim.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-005 -->
---

