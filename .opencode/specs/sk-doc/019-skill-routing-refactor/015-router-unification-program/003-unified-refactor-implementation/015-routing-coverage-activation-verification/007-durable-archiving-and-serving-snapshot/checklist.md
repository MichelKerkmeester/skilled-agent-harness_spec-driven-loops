---
title: "Checklist: Durable Archiving & Serving-Snapshot"
description: "Implemented-state QA gate for durable compiled-routing archiving. Commit 2a39ecb9a0 delivered the fail-closed archive writer, serving-snapshot schema and renderer, repo-relative provenance, execution context, report rendering, and seven benchmark indexes. Transition-ledger ownership moved to sibling 010 and landed in a1cdb65d90. The default remains off and no hub was cut over."
trigger_phrases:
  - "durable archiving checklist"
  - "serving snapshot QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/007-durable-archiving-and-serving-snapshot"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled checklist evidence to commit 2a39ecb9a0"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Archive tooling landed in 2a39ecb9a0; transition ledger landed under sibling 010"
---
# Checklist: Durable Archiving & Serving-Snapshot

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|----------------------|
| **[P0]** | Hard blocker | Cannot claim durable archiving complete while unchecked |
| **[P1]** | Required | Must verify or record an operator-approved deferral |
| **[P2]** | Optional | May defer with an explicit reason |

Checked rows cite committed implementation or fixture evidence. This child changes no serving default; use of the tooling in a live canary remains operator-gated in P4/011.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `002` and `004` dependency readiness was confirmed before schema work.
  - **Evidence**: `4153cbebd8` and `8532c4b64b` precede archive commit `2a39ecb9a0` and provide the promoted status/parity surfaces.
- [x] CHK-002 [P0] The active promoted manifest field shape was confirmed before pinning the schema.
  - **Evidence**: `captureServingSnapshot` reads the declared active manifest fields; a real `sk-code` snapshot validates.
- [x] CHK-003 [P1] Each hub benchmark label family was inventoried to avoid collision.
  - **Evidence**: tasks record `router-compiled-parity-baseline`/`-final` as collision-free across all seven hubs.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The report-path writer fails closed with no partial write on a collision.
  - **Evidence**: `archive-compiled-routing.cjs` returns `COLLISION`; implementation evidence confirms original bytes unchanged and empty labels refused.
- [x] CHK-011 [P0] Snapshot capture reads only the active promoted manifest, never a `006` shadow candidate.
  - **Evidence**: archive and snapshot capture return `MANIFEST_SOURCE` for a shadow-candidate path.
- [x] CHK-012 [P1] Report/provenance rendering is confined to non-frozen `build-report.cjs`.
  - **Evidence**: `2a39ecb9a0` changes the renderer and leaves all three frozen scorer paths absent.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Fail-closed collision behavior is proven for the report-path convention.
  - **Evidence**: committed task evidence records non-zero `COLLISION`, no partial directory, and unchanged original bytes.
- [x] CHK-021 [P0] Mid-capture manifest drift aborts the archive.
  - **Evidence**: committed task evidence records `DRIFT` and no partial directory.
- [x] CHK-022 [P0] `serving-snapshot.json` joins manifest, fence, flag, freshness, and parity for a real hub.
  - **Evidence**: `validateServingSnapshot` accepts the captured `sk-code` snapshot; renderer emits JSON and Markdown.
- [x] CHK-023 [P1] Repo-relative provenance remains valid after a path move.
  - **Evidence**: archived pair contains `rootRel` plus digests and no absolute worktree root; portability fixture passed.
- [x] CHK-024 [P1] `flip-history.jsonl` is append-only across repeated driver operations.
  - **Evidence**: ownership moved to sibling 010; its ledger schema and append-only activation/flip drivers landed in `a1cdb65d90`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All seven hubs gained the convention/index and share the snapshot capability.
  - **Evidence**: four benchmark READMEs extended, three created, and the generic create-benchmark scripts handle every eligible hub.
- [x] CHK-031 [P0] The frozen `baseline` label is never written by this packet.
  - **Evidence**: writer rejects `baseline` as `BAD_LABEL`; commit contains no `benchmark/baseline/` change.
- [x] CHK-032 [P1] New archive labels do not collide with existing directory names.
  - **Evidence**: seven-hub inventory recorded before the chosen baseline/final sibling labels.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live routing, router, engine, serving manifest, or default was modified.
  - **Evidence**: `git show --stat 2a39ecb9a0` is limited to archive/snapshot/report/docs/spec metadata surfaces.
- [x] CHK-041 [P0] The three frozen scorer files are untouched.
  - **Evidence**: commit path audit plus identical start/end SHA-256 values.
- [x] CHK-042 [P1] Archived artifacts contain execution metadata, not credentials or secrets.
  - **Evidence**: `buildExecutionContext` persists the enumerated reproducibility fields; committed fixture inspection found no secret field.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, checklist, and summary agree on the implemented scope and sibling-owned transition ledger.
  - **Evidence**: all three cite `2a39ecb9a0`, the `a1cdb65d90` ledger ownership, and the unchanged default.
- [x] CHK-051 [P1] `skill-benchmark-storage-guide.md` documents portable provenance and the new archive labels.
  - **Evidence**: storage-guide change landed in `2a39ecb9a0`.
- [x] CHK-052 [P1] Strict packet validation reports zero errors.
  - **Evidence**: final `validate.sh --strict` result recorded after metadata regeneration.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Archive state is confined to each hub benchmark tree and the create-benchmark/report extension points.
  - **Evidence**: writer computes `<hub>/benchmark/compiled-routing/<run-label>` and fails before partial writes.
- [x] CHK-061 [P1] The seven hub benchmark indexes are the README-level edits.
  - **Evidence**: commit changed the seven named `benchmark/README.md` paths (four modified, three created).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 13 | 13/13 | Verified |
| P1 Items | 9 | 9/9 | Verified |
| P2 Items | 0 | 0/0 | N/A |

**Verification Date**: 2026-07-21; reconciled to `2a39ecb9a0` and sibling-ledger evidence `a1cdb65d90`, with final strict validation after metadata regeneration.

**Verification Scope**: Fail-closed report-path convention, active-manifest archive boundary, `serving-snapshot.json` correctness, repo-relative provenance, append-only transition log, frozen-scorer and `baseline`-label untouched invariants.

**Completion Boundary**: Durable evidence tooling is implemented; it does not run a live canary or change the repository default. P4/011 execution remains blocked on siblings 013/014 and operator authorization.
<!-- /ANCHOR:summary -->
