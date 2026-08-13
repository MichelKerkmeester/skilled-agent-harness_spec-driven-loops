---
title: "Decision Record: Cross-Filesystem Path Identity Handling"
description: "Records path case, Unicode normalization, and namespace-root handling across filesystems."
trigger_phrases:
  - "write-set path case handling"
  - "unicode-normalized resource path"
  - "case-insensitive resource alias"
  - "cross-filesystem conflict graph"
importance_tier: "critical"
contextType: "decision"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Consolidated cross-filesystem path comparison into one composable normalizer"
    next_safe_action: "Run independent verification against the hardened graph"
    blockers:
      - "Independent phase-gate verification is not yet recorded"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Stored case is preserved, while one comparable-path key composes ASCII case, slash, NFC, dot, and root handling."
      - "NFKC-only compatibility variants remain distinct filesystem identities."
---
# Decision Record: Cross-Filesystem Path Identity Handling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Preserve path case while canonicalizing equivalent path spellings

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Runtime graph maintainers |

<!-- ANCHOR:adr-001-context -->
### Context

Canonical path identities must behave safely across case-sensitive Linux filesystems and case-insensitive default macOS
and Windows filesystems. Lowercasing every path would merge files that can be distinct on Linux. Preserving case without
detecting aliases would let the same physical path appear independent on a case-insensitive host.

Unicode adds a separate identity boundary. Canonically equivalent NFC and NFD spellings can resolve to the same filename
on macOS filesystems while remaining different UTF-16 strings. Namespace-root spellings also arrive as an empty path,
`.` or `/`. Leaving either family distinct lets two writers target one filesystem object without a conflict edge.

The earlier case-fold detector and trailing-slash overlap detector normalized different axes at different call sites.
A path differing in both case and trailing slash therefore missed both checks. Path identity comparison must compose all
supported equivalences before any detector treats distinct keys as evidence of independence.

### Constraints

- The graph must not assume that path case either always matters or never matters.
- Canonically equivalent Unicode spellings and namespace-root variants must have one deterministic identity.
- Ambiguous evidence must force the existing global `serial-single-writer` fallback.
- The graph remains additive and non-authoritative until the later authority phase.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Preserve declared path case, but route every comparison-time path key through `normalizeComparablePath`.
The function applies NFC, POSIX and dot-segment normalization, leading `./` removal, complete trailing-slash trimming,
root/empty collapse, and ASCII case folding in one fixed order.

**How it works**: Overlap derivation and every path-keyed collision or metadata lookup use the same fully comparable key.
Same-comparable paths derive an ordinary resource conflict; distinct declared IDs sharing that key also emit
`UNRESOLVED_RESOURCE_ALIAS`, add an `unknown-widening` conflict between nodes, and trigger global serial fallback.
Namespaces remain isolated. NFKC/NFKD compatibility folding, locale-specific case folding, and homoglyph folding are not
applied because those transforms can merge genuinely different files.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve case, normalize canonical Unicode/root spellings, and fail closed on ASCII-only ambiguity** | Deterministic equality for equivalent spellings without losing Linux case distinctions | May over-serialize ASCII-case-distinct paths on Linux | 10/10 |
| Lowercase every path | Simple equality checks | Creates false collisions for distinct Linux files | 3/10 |
| Preserve case and assume independence | Preserves Linux distinctions | Allows false parallelism on default macOS and Windows filesystems | 1/10 |
| Detect the current host filesystem | Can be precise locally | Makes sealed graph results host-dependent and non-reproducible | 5/10 |

**Why this one**: It preserves deterministic graph input while converting cross-filesystem uncertainty into the existing
conservative fallback instead of a false safety grant.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Case-only path aliases cannot place conflicting work in one parallel lane.
- Case and trailing-slash differences compose instead of bypassing independent detectors.
- NFC/NFD spellings of one filename and empty/root path variants derive normal conflict edges.
- Genuinely distinct case-sensitive paths are not permanently collapsed into one canonical identity.
- Genuinely different Unicode filenames remain separate identities.
- NFKC-only ligature variants remain separate identities.

**What it costs**:
- Some Linux-only graphs may serialize case-distinct paths. Mitigation: provide reviewed canonical identities that remove
  the ambiguity before widened scheduling is requested.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Locale-specific Unicode case folding differs by platform | M | Require explicit alias evidence instead of applying locale-dependent folding |
| Conservative fallback reduces parallelism | L | Keep fallback non-green and require reviewed identity evidence to widen |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Case-only, NFC/NFD, and namespace-root collisions produced false parallel-safe schedules |
| 2 | **Beyond Local Maxima?** | PASS | Lowercasing, host detection, and unchecked preservation were compared |
| 3 | **Sufficient?** | PASS | One comparable key closes every supported combination; ambiguity and fallback close aliases |
| 4 | **Fits Goal?** | PASS | The decision directly protects conflict-graph soundness |
| 5 | **Open Horizons?** | PASS | Explicit alias evidence can later remove conservative serialization |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `canonicalize.ts` defines `normalizeComparablePath` as the sole comparison-time path identity function.
- `graph.ts` routes overlap, identity/canonical collision keys, path-alias detection, and metadata keys through it.
- The unit suite covers the 16-case composition matrix and proves different names, NFKC-only ligatures, different accents,
  and the honest shipped control remain independent.

**How to roll back**: Revert the shared comparable-path function, its graph call sites, the composition fixtures, and this
record. The remaining scheduler still defaults to serial for other validation issues, but rollback would reopen the
cross-dimensional false-safe path.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
