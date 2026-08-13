---
title: "Implementation Summary: Write-Set Conflict Graph"
description: "Evidence for the additive phase-013 dependency and write-set conflict graph runtime leaf."
trigger_phrases:
  - "write-set conflict graph implementation"
  - "phase-013 graph evidence"
  - "deep-loop conflict scheduler result"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-21T13:29:00Z"
    last_updated_by: "codex"
    recent_action: "Consolidated comparison-time path identity and verified normalization composition"
    next_safe_action: "Run the independent verifier against the sealed graph inputs"
    blockers:
      - "Independent phase-gate verification is not yet recorded"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts"
    completion_pct: 90
    open_questions:
      - "Will the independent verifier accept the digest-bound candidate schedule?"
    answered_questions:
      - "Unknown, stale, ambiguous, and incomplete evidence is represented as conflict or serial refusal."
      - "Hard ordering remains distinct from derived resource conflicts."
---
# Implementation Summary: Write-Set Conflict Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Planned; local implementation candidate verified and independent phase-gate sign-off pending |
| **Scope** | Additive runtime graph library, unit fixtures, and this leaf's evidence documents |
| **Authority** | Planning/orchestration evidence only; no migration or approval authority moved |
| **Rollback** | Remove the additive module/test and restore the leaf docs; serial policy remains the fallback |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The new `runtime/lib/write-set-conflict-graph/` library emits a versioned, digest-bound graph envelope for exactly the
eight phase-013 workstreams. It canonicalizes evidence-backed read/write resources, derives symmetric write-write,
write-read, shared-backend, and fence conflicts, then adds the required hard-order constraints as a separate edge class.

The scheduler uses stable node ordering and deterministic antichain construction. Any unknown resource, unresolved alias,
missing or stale source, contradictory declaration, manifest mismatch, failed independence assertion, or dependency cycle
produces a `serial-single-writer` refusal schedule. Both ready and fallback schedules keep `phase_gate_complete: false`.

`normalizeComparablePath` now provides the single comparison-time identity for path resources. In order, it applies NFC,
POSIX normalization and dot-segment collapse, leading `./` removal, complete trailing-slash trimming, root/empty collapse,
and ASCII case folding. Overlap derivation, identity/canonical collision keys, comparable-path alias detection, and
canonical metadata keys consume that result, so case, slash, Unicode, dot-segment, and root variants compose instead of
escaping through separate partial normalizers. Shared-state access remains closed to `read`/`write`, invalid mutability
still becomes `unknown`, and unresolved path aliases still force conservative widening plus global serial fallback.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

- `types.ts` defines the schema, exact node identities, graph records, evidence, decisions, and reuse result.
- `shipped-census.ts` records canonical resources from direct imports and writes in the shipped mode packets and shared roots.
- `canonicalize.ts` owns `normalizeComparablePath` and resource canonicalization while turning unresolved evidence into explicit validation issues.
- `graph.ts` validates the node set, derives conflict and hard-order edges, checks independence, seals the digest, and rejects stale reuse.
- `scheduler.ts` produces reproducible lanes and an evidence receipt for every node.
- `write-set-conflict-graph.vitest.ts` attacks node drift, overlap soundness, aliases, stale evidence, assertions, fallback honesty, and determinism.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- Directory resources overlap descendants within the same namespace. This intentionally over-serializes ambiguous roots
  rather than missing a real write-read conflict.
- Every path-comparison and path-keyed collision site uses the same comparable-path function; no detector owns a partial
  case-only or slash-only normalization path.
- Stored path case remains preserved, while the comparable key ASCII-folds it. Same-comparable-path aliases fail closed
  because the declarations can name one resource on a case-insensitive filesystem.
- Unicode NFC/NFD variants of one path compare equal. NFKC/NFKD compatibility variants and cross-script lookalikes do not
  fold, so genuinely different filesystem names remain separate.
- Empty, `.` and `/` path payloads denote the namespace root and collapse to one canonical identity.
- Shared-state access and mutability use closed runtime vocabularies so malformed strings cannot bypass edge derivation.
- Explicit canonical IDs are mandatory. A plausible raw identity cannot become evidence of safety by itself.
- The review-loop requirement adds a fence even when other derived conflicts already exist. An unresolved review alias
  adds an unknown fence resource and forces fallback.
- Research/council independence is an assertion to validate against derived edges, never a waiver of resource checks.
- `serial-single-writer` is a refusal state, not a green gate. External verification remains required before orchestration.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| Leaf Vitest suite | `57 passed`; exit 0 |
| Repository-bundled TypeScript `--noEmit` | exit 0 |
| Strict leaf validation | Errors 0, Warnings 0; exit 0 |
| Comment hygiene and whitespace | Scoped scans passed; exit 0 |
| Scope | Task-owned status contains only the additive graph library/test and leaf-local docs/metadata |

The executable fixtures cover unknown-as-conflict, write-write and write-read soundness, canonical collisions, directory
overlap and trailing-slash equivalence, valid and invalid shared-state access, case-only alias fallback, the 16-case
case × slash × Unicode-form × root/non-root composition matrix, different-filename/NFKC-ligature/accented-name negative
controls, namespace-root variants, mutability normalization, separate hard ordering, both review-loop aliases,
ambiguous-alias fallback, malformed and stale digests, changed declaration reuse refusal, assertion revalidation,
deterministic reruns, non-green fallback receipts, per-node evidence, honest parallel controls, and exact manifest equality.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The library consumes caller-supplied source digests; it does not read the filesystem or mutate any mode packet. That keeps
the leaf deterministic and orchestration-only, while requiring the caller to hash every path returned by
`collectRequiredSourcePaths`. The graph does not grant the phase-012 or phase-013 gate: the next action is independent
verification of the sealed candidate and its source census.

Case-only ambiguity detection is intentionally limited to ASCII for deterministic cross-platform behavior. Canonically
equivalent Unicode forms are normalized to NFC; NFKC/NFKD compatibility folding, locale-specific case folding, and
cross-script homoglyph folding remain excluded because they can merge genuinely different filesystem names.
<!-- /ANCHOR:limitations -->
