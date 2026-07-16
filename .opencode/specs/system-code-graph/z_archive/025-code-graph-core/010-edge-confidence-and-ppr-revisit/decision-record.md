---
title: "Decision Record: Edge-Confidence Differentiation and Seeded-PPR Revisit"
description: "ADRs for reusing a discarded resolution-quality signal instead of building new call-resolution infrastructure, and recovering the deleted PPR module from git instead of rewriting it."
trigger_phrases:
  - "edge confidence ppr revisit decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Both ADRs finalized"
    next_safe_action: "Sync to live tree"
    blockers: []
    key_files: ["decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-010-edge-confidence-ppr-revisit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Edge-Confidence Differentiation and Seeded-PPR Revisit

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse the discarded resolution-quality signal instead of building new call-resolution infrastructure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-01 |
| **Deciders** | User, Claude Sonnet 5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

CALLS edges carry uniform confidence today because the extractor never threads resolution quality into edge metadata. True semantic call-target binding (TypeScript-compiler-API symbol resolution) would give the most accurate confidence signal, but the current extractor is tree-sitter/regex-based with no type-checker integration - adding one is a large, separate rewrite.

### Constraints

- Must not change ranking behavior for existing consumers (structural search, impact analysis) unless explicitly opted in.
- Must be testable without a parser rewrite, since that is out of scope for this packet.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: reuse `cross-file-edge-resolver.ts`'s existing `resolved`/`ambiguousSkipped`/`unresolved` classification (already computed for every cross-file CALLS edge, currently only used to rewrite `target_id`) plus a same-file candidate-cardinality check, writing both into the existing `confidence`/`evidenceClass` metadata fields.

**How it works**: A new default-off flag, `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, gates both changes. With it off, every CALLS edge still gets the same constant `0.8/INFERRED/heuristic` metadata as before. With it on, resolved cross-file edges get `0.9/EXTRACTED`, ambiguous ones get `0.3/AMBIGUOUS`, and same-file resolution contributes `0.75/INFERRED` (single candidate) or `0.35/AMBIGUOUS` (multiple candidates).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse the discarded resolution-quality signal** | Ships fast, reuses existing schema, no new infrastructure. | Confidence is a proxy (candidate cardinality), not true semantic resolution. | 8/10 |
| Full TypeScript-compiler-API rewrite of the extractor | Would give real semantic resolution. | Multi-week separate project, out of scope for testing whether PPR benefits from ANY real gradient at all. | 4/10 |

**Why this one**: It tests the actual open question - "does PPR perform differently with a real confidence gradient" - without gambling the whole packet on a parser rewrite that was never in scope.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- CALLS edges get a real, non-constant confidence signal for the first time, usable by any consumer of `contextEdgeReliability`.
- Seeded-PPR gets a fair second test against the exact prerequisite its original cut named.

**What it costs**:
- The signal is a proxy (candidate cardinality), not true semantic resolution. Mitigation: documented explicitly as an approximation in the implementation summary's Known Limitations.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `contextEdgeReliability` is already live/unconditional for other consumers; an ungated change would alter real ranking behavior | H | Gate everything behind the new default-off flag; existing test suite confirmed byte-identical behavior with the flag off. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The repo's own benchmark record named this exact prerequisite as the reason PPR tied instead of differentiating. |
| 2 | **Beyond Local Maxima?** | PASS | Considered a full parser rewrite; rejected as out of scope for testing the narrower question. |
| 3 | **Sufficient?** | PASS | Gives PPR a real, non-constant signal to rank on - enough to answer the open question either way. |
| 4 | **Fits Goal?** | PASS | Directly targets the one revisit the operator selected out of four cut features. |
| 5 | **Open Horizons?** | PASS | Leaves a real TypeScript-compiler-API resolution rewrite open as future work if this proxy signal ever needs replacing. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `structural-indexer.ts`: same-file CALLS edge confidence keyed on candidate cardinality.
- `cross-file-edge-resolver.ts`: cross-file CALLS edge confidence keyed on resolution outcome.
- New flag registered in `ENV_REFERENCE.md`.

**How to roll back**: Set `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` to unset/false (already the default) - every CALLS edge reverts to the constant `0.8/INFERRED/heuristic` metadata it had before this packet, with zero code changes needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Recover the deleted PPR module from git history instead of rewriting it

**Status**: Accepted

**Context**: The seeded-PPR module (`computeBoundedPersonalizedPageRank` and related functions) was fully built, benchmarked, and deleted at commit `277c35344c`. It is recoverable byte-for-byte via `git show 277c35344c^:<path>`.

**Decision**: Recover the deleted code from git history and re-wire it, fixing only the specific incompatibilities introduced by codebase drift since the deletion, rather than re-implementing PPR from scratch.

**Consequences**:
- Avoids re-doing already-working, already-tested implementation work.
- Requires checking the recovered code against the current codebase for drift (symbols renamed/removed since `277c35344c`).

**Alternatives Rejected**:
- Re-implement PPR from scratch: wastes effort re-solving an already-solved problem and risks introducing new bugs the original implementation didn't have.

**Note on execution (2026-07-01)**: the first recovery pass deviated from this ADR without noticing - when the recovered code's cross-subsystem dependency (a dynamic import of the Memory MCP's compiled `bfs-traversal.js`) wasn't found in the worktree (the package's `dist/` output wasn't built there), the dispatch replaced it with a local reimplementation of the same walker instead of building the missing output. That is exactly the "second walker" ADR-001 in `../005-seeded-ppr-ranking/decision-record.md` warns against. Caught by comparing the recovered file's imports against the pre-deletion original via `git show`, and fixed by building the missing `dist/` output and restoring the real shared-substrate import. Recorded here as a caution for any future git-history recovery: verify restored code's external dependencies actually resolve before accepting a "couldn't find X so I wrote a local version" deviation.
