---
title: "Decision Record: atomic cross-skill symlink closures (032 phase 007 child 002)"
description: "Decision record for treating a symlink target, every link-node, relative target string, and dependent path reference as one atomic dependency closure during the kebab-case filesystem-name program."
trigger_phrases:
  - "atomic symlink decision"
  - "cross-skill symlink ordering"
  - "symlink closure contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Recorded the atomic target-and-pointer ordering decision"
    next_safe_action: "Use the accepted closure contract during symlink preflight"
    blockers: []
    key_files:
      - ".opencode/install_guides/install_scripts/"
      - ".opencode/skills/sk-doc/scripts/"
      - ".opencode/skills/sk-code/code-opencode/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Target-only and pointer-only intermediate states are rejected"
      - "Preflight must prove target ownership, relative-link rendering, mode preservation, and complete pointer coverage"
---
# Decision Record: Atomic Cross-Skill Symlink Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Move a symlink target and every pointer as one closure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | 032 naming-program maintainers |

<!-- ANCHOR:adr-001-context -->

### Context

Symlink link-nodes connect skill trees, install guides, runtime mirrors, and shared script/reference surfaces. A target can therefore have consumers outside its owning directory. Updating the target first can make those consumers dangling; updating links first can point them at a path that does not exist yet. Either intermediate state can break an otherwise unrelated skill and make a candidate commit impossible to validate.

### Constraints

- The phase 005 tooling supplies a semantic source-to-target map and reference checker; no mechanical path substitution is allowed.
- The phase 006 map is bijective and hashed with BASE; every target and link-node must have one disposition.
- Relative symlink text is interpreted from the link-node directory, so the same target may need different stored link text at different link locations.
- Link mode `120000`, target type, and target executable bits are part of the filesystem contract.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat each renamed symlink target, all link-nodes that resolve to it, and their path references as one dependency-closed operation.

**How it works**: The executor builds a reverse target-to-link index and precomputes every target path and relative link string before writing. If any target is missing, collides, has unknown ownership, or lacks a pointer disposition, the batch aborts before mutation. A successful batch updates the target and every pointer together, then verifies resolution, mode, target type, and executable bits from each link-node.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Atomic target-plus-pointers closure** | Preserves a valid tree at commit boundaries; makes review and rollback tractable | Requires a complete reverse index and stricter preflight | **10/10** |
| Target first, pointers in a later phase | Easy to sequence by file owner | Creates dangling links and breaks intermediate commits | 3/10 |
| Update each link independently | Small local diffs | Cannot prove all consumers were found; link order can expose broken states | 4/10 |
| Copy targets and retain compatibility aliases | Reduces immediate breakage | Leaves duplicate names, masks missed consumers, and conflicts with alias-removal policy | 2/10 |

**Why this one**: The target and its pointers are one graph closure. Atomic execution is the only option that preserves the repository contract at every accepted boundary and aligns with the phase 005/006 map discipline.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A candidate commit cannot silently leave a cross-skill link dangling.
- The verifier can compare the postflight tree with a concrete link/mode manifest.
- Component phases can depend on stable closure identifiers instead of rediscovering shared pointers.

**What it costs**:
- The executor must inventory all link-nodes before moving one target. Mitigation: build the reverse index from the tracked symlink manifest and fail on a zero or incomplete scan.
- A single unresolved edge blocks the closure. Mitigation: hand the edge to its target-owning phase with a precise disposition instead of weakening atomicity.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Relative link text is calculated from the wrong directory | H | Resolve and render link text per link-node, then test from that directory |
| A target has an untracked or generated pointer | M | Require the phase 005 checker and phase 006 classification to report the edge disposition |
| A target is executable or a directory | M | Record target type and mode before the batch and compare after it |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Cross-skill symlinks have consumers outside the target-owning subtree; target-only updates can dangle them |
| 2 | **Beyond Local Maxima?** | PASS | Target-first, link-first, per-link, and compatibility-alias options were compared |
| 3 | **Sufficient?** | PASS | Reverse indexing plus preflight and postflight checks cover target identity, link text, modes, and references |
| 4 | **Fits Goal?** | PASS | The contract preserves the program invariant that dependency closures move together |
| 5 | **Open Horizons?** | PASS | Closure identifiers and manifests support later component phases without duplicating discovery |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The symlink closure manifest records every link-node, raw relative target, resolved target, owner, mode, and map disposition.
- The execution order is preflight all edges, update target and pointers as one closure, then verify resolution and modes.
- The child checklist blocks acceptance when a target or pointer is missing, stale, dangling, or partially updated.

**How to roll back**: Revert the path-scoped closure commit as a unit, or discard the isolated worktree before any later closure batch starts. Do not roll back only the target or only the link-nodes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
