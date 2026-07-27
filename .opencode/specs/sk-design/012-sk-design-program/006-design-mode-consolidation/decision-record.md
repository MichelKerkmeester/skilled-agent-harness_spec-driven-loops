---
title: "Decision Record: sk-design mode consolidation"
description: "Architecture decisions for a four-mode hub with permanent interface-owned foundations and audit subworkflows and a frozen styles package."
trigger_phrases:
  - "sk-design consolidation decisions"
  - "design command subworkflow architecture"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-26T09:08:32Z"
    last_updated_by: "opencode"
    recent_action: "Accepted the four-mode command-subworkflow architecture"
    next_safe_action: "Capture baselines and execute sequential relocation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Audit remains embedded rather than becoming a standalone skill."
---
# Decision Record: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Four Modes with Permanent Interface Subworkflows

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-26 |
| **Deciders** | User, OpenCode execution agent |

<!-- ANCHOR:adr-001-context -->
### Context

Foundations and audit are real independently invoked workflows, but they belong to the interface design domain and do not need peer hub-mode identities. Deleting their capabilities would regress public commands, corpora, validators, and evidence contracts.

The canonical research recommended a standalone audit skill because audit has independent scoring, reports, corpora, fingerprints, and Bash gates. The approved objective instead requires one `sk-design` advisor identity with exactly four registry modes and both workflows embedded beneath interface. The shared styles package has 7,812 tracked files and does not need to move for this topology change.

### Constraints

- Keep `/interface:foundations` and `/interface:audit` permanent and complete.
- Preserve all behavior and downstream verifier seams without nested skill identities.
- Do not edit any tracked file under `styles/`.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep exactly four top-level registry modes and preserve foundations and audit as permanent interface-owned command subworkflows.

**How it works**: Move both complete workflow trees beneath `design-interface`, transform their nested `SKILL.md` files to `contract.md`, and let stable public commands select typed subworkflows of the interface mode. Preserve audit authority and foundations behavior in full, expose no standalone audit advisor identity, and freeze every tracked styles byte.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four modes plus permanent interface subworkflows** | Small topology, stable commands, complete behavior | Requires atomic path and generated-consumer migration | 10/10 |
| Keep six modes | No path migration | Preserves unnecessary identities | 5/10 |
| Standalone audit skill | Preserves independent authority | Adds another advisor identity contrary to approved architecture | 6/10 |
| Flatten both into shared prose | Few directories | Cannot own artifacts, corpora, reports, or executable gates | 2/10 |

**Why this one**: It is the smallest approved topology that preserves every real user job and proof surface. It changes identity and ownership only, not workflow capability or styles behavior.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Smaller advisor and hub topology.
- Stable public commands and specialized workflows.
- Clear interface-domain ownership.

**What it costs**:
- Command metadata and router schemas must represent subworkflow ownership separately from mode rows. Mitigation: update authored schemas before deleting rows.
- Every path-sensitive verifier and generated consumer must migrate atomically. Mitigation: sequential stages with local gates and scoped rollback.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Permanent command loses a route | H | Add typed subworkflow routing before row removal |
| Audit proof surface splits | H | Move owned files atomically and run all audit gates |
| Styles bytes change | H | Require identical full tracked-file manifests |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six mode identities contradict the approved four-mode target |
| 2 | **Beyond Local Maxima?** | PASS | Research compared peer modes, embedded workflows, standalone audit, and shared doctrine |
| 3 | **Sufficient?** | PASS | Removes only identities while retaining complete capability |
| 4 | **Fits Goal?** | PASS | Exact four-mode routing is the goal's critical path |
| 5 | **Open Horizons?** | PASS | Typed subworkflow ownership supports durable commands without topology growth |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Relocate foundations and audit beneath `design-interface` and transform their identity contracts.
- Update authored and generated routing consumers to four modes plus two permanent command subworkflows.

**How to roll back**: Restore the two peer directories, nested skill contracts, six registry rows, and old consumer paths from the scoped pre-change state; regenerate derived metadata and rerun baselines without touching unrelated dirty files.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
