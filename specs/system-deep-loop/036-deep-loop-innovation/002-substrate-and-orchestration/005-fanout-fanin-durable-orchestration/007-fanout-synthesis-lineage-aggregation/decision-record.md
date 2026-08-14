---
title: "Decision Record: Read fan-out lineage artifacts in place"
description: "Choose immutable in-place lineage consumption with canonical root projections instead of copying or renumbering iteration and delta artifacts."
trigger_phrases:
  - "lineage artifact synthesis decision"
  - "fanout registry projection"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-fanout-fanin-durable-orchestration/007-fanout-synthesis-lineage-aggregation"
    last_updated_at: "2026-07-26T08:44:44Z"
    last_updated_by: "opencode"
    recent_action: "Implemented and verified immutable lineage input architecture"
    next_safe_action: "Begin the dependent sk-design mode-consolidation packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Read Fan-out Lineage Artifacts in Place

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Immutable Lineage Inputs with Canonical Root Projections

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-25 |
| **Deciders** | Operator and OpenCode implementation agent |

<!-- ANCHOR:adr-001-context -->
### Context

Fan-out lineages own their iteration numbers, state logs, and deltas. Multiple lineages may legitimately contain `iteration-001.md` and `iter-001.jsonl`, so copying those files into one root directory requires renumbering or collision handling that changes identity and weakens provenance. Root synthesis nevertheless needs canonical registry, resource-map, dashboard, and research outputs.

### Constraints

- Preserve original lineage paths and labels.
- Do not copy, rename, or renumber completed research evidence.
- Keep single-executor behavior unchanged.
- Keep canonical and shipped compatibility registry readers aligned.
- Prevent resource-map generation from rebuilding and erasing merged state.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Discover direct lineage artifacts in stable order, read them in place, and publish only the canonical root projections that consumers require.

**How it works**: Fan-in reconstructs a lineage registry only when its usable findings are empty, merges findings with attribution, serializes once, and atomically writes the same bytes to both registry names. Resource-map generation receives a write-isolated fan-out branch over lineage deltas. Synthesis and its invariant check use lineage state and iteration paths directly.

**Safety refinement**: Every consumed or overwritten descendant must be a real contained file or directory. Count-only state accepts exact-count Markdown or graph evidence; malformed JSONL, unresolved count mismatches, symbolic links, and incomplete synthesis halt before success is recorded.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read lineage artifacts in place** | Preserves provenance and avoids collisions | Requires a fan-out input branch | 9/10 |
| Copy and renumber into root | Reuses root-only readers | Mutates identity, creates duplicate storage, and risks broken citations | 3/10 |
| Copy with label-prefixed names | Avoids numeric collisions | Still duplicates evidence and changes canonical filenames | 5/10 |
| Make each lineage synthesize independently | Keeps isolation | Produces multiple reports with no canonical fan-in synthesis | 4/10 |

**Why this one**: In-place reads are the only option that preserves evidence identity and still permits deterministic fan-in without a migration layer.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Completed fan-out sessions can synthesize from all lineage evidence.
- Duplicate iteration basenames remain distinct by full path and lineage label.
- Canonical and compatibility registry consumers receive identical bytes.

**What it costs**:
- Synthesis and resource-map logic need an explicit fan-out discovery branch. Mitigation: keep single-executor paths unchanged and test both branches.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A lineage path escapes the artifact root | H | Discover only direct children and resolve beneath the known lineages directory |
| Resource-map aggregation mutates merged state | H | Resource-map-only mode writes no registry, strategy, or dashboard |
| Workflow modes drift | H | Update auto and confirm together and regenerate the compiled contract |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing completed lineage research lacks canonical synthesis |
| 2 | **Beyond Local Maxima?** | PASS | Copy, prefix, and per-lineage synthesis alternatives were compared |
| 3 | **Sufficient?** | PASS | One discovery branch serves registry, resource-map, and synthesis needs |
| 4 | **Fits Goal?** | PASS | It directly unblocks the dependent sk-design packet |
| 5 | **Open Horizons?** | PASS | Any number of stable-sorted direct lineages can participate |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Fan-out merge handles existing-empty registries and writes two identical root projections.
- The research reducer gains write-isolated lineage delta aggregation.
- Both synthesis workflows and the compiled contract use lineage-aware inputs and invariants.

**Delivered evidence**:
- Stable full runtime gate: 138 test files and 2,561 tests passed.
- Canonical synthesis: 34 merged findings, five delta provenance rows, 17 report sections, and a five-iteration completion event.
- Immutable evidence: all five iteration and five delta hashes matched their pre-run values.
- Registry equality: both canonical names share SHA-256 `66536750917bd63f789234e89d58f5a47f6d9b5c6b980a02e7eb324c204b33df`.

**How to roll back**: Restore the touched runtime, workflow, generated contract, and test files. Do not change or delete lineage artifacts; they remain the source evidence under either implementation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
