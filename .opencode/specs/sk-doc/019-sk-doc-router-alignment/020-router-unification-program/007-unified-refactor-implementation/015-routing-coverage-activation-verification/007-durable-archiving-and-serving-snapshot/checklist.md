---
title: "Checklist: Durable Archiving & Serving-Snapshot"
description: "Planned QA gate for the fail-closed report-path convention, the serving-snapshot.json schema and renderer, repo-relative provenance, the append-only flip-history log, and the active-manifest archive boundary."
trigger_phrases:
  - "durable archiving checklist"
  - "serving snapshot QA gate"
importance_tier: "critical"
contextType: "implementation"
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

All checks are **Planned** and remain unchecked until implementation evidence exists.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `../002-runtime-promotion-and-status-foundation/` and `../004-benchmark-compiled-lane-c/` dependency readiness is confirmed before schema work begins.
  - **Planned evidence**: Dependency-confirmation note.
- [ ] CHK-002 [P0] The `010-live-activation/activation/<hub>/manifest.json` field shape is confirmed for all 7 hubs before the schema is pinned.
  - **Planned evidence**: Per-hub manifest field inventory.
- [ ] CHK-003 [P1] Each hub's existing `benchmark/` label family is inventoried to avoid a naming collision.
  - **Planned evidence**: Per-hub directory listing.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The report-path convention writer fails closed with no partial write on a collision.
  - **Planned evidence**: Collision fixture — assert non-zero exit and no orphaned partial directory.
- [ ] CHK-011 [P0] The snapshot capture step reads only the active `010` manifest, never a `006` shadow candidate.
  - **Planned evidence**: Source-path assertion in the capture code; negative fixture confirms rejection of a `006` path.
- [ ] CHK-012 [P1] The `report.compiledRouting` render block is added to the non-frozen `build-report.cjs` only.
  - **Planned evidence**: Diff shows zero changes to any of the three frozen scorer files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fail-closed collision behavior is proven for the report-path convention.
  - **Planned evidence**: Re-run against an existing `<run-label>`; non-zero exit, no partial write.
- [ ] CHK-021 [P0] Drift abort behavior is proven: a mid-capture manifest-digest change aborts the archive.
  - **Planned evidence**: Simulated mid-run mutation fixture; assert abort, not silent completion.
- [ ] CHK-022 [P0] `serving-snapshot.json` correctly joins manifest + fence + flag + freshness + parity for a real hub.
  - **Planned evidence**: Captured snapshot compared field-by-field against the source manifest and latest parity result.
- [ ] CHK-023 [P1] Repo-relative provenance resolves correctly after a path move.
  - **Planned evidence**: Copy-and-validate fixture across two different paths.
- [ ] CHK-024 [P1] `flip-history.jsonl` is append-only across repeated runs.
  - **Planned evidence**: Before/after entry-count and byte-prefix comparison.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] All 7 hubs gain the report-path convention, the snapshot capability, and the README update.
  - **Planned evidence**: Per-hub file/section inventory against the 7-hub set.
- [ ] CHK-031 [P0] The existing frozen `baseline` label is never written to by this packet, on any hub.
  - **Planned evidence**: `git diff` scoped to every `benchmark/baseline/` path is empty.
- [ ] CHK-032 [P1] New archive labels (`router-compiled-parity-baseline`/`-final`) do not collide with any existing directory name.
  - **Planned evidence**: Directory-listing diff against the pre-implementation naming inventory (CHK-003).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No live routing, router, engine, or activation-manifest file is modified.
  - **Planned evidence**: `git diff --stat` for this packet touches only archive directories, the renderer, `build-report.cjs`, and READMEs.
- [ ] CHK-041 [P0] The three frozen scorer files are untouched.
  - **Planned evidence**: Pre/post SHA-256 comparison against the pinned digests.
- [ ] CHK-042 [P1] No archived artifact embeds a credential, token, or environment secret.
  - **Planned evidence**: Fixture inspection of a captured snapshot and archived report.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Spec, plan, tasks, checklist, and summary all report Planned status and agree on the schema/convention shape.
  - **Planned evidence**: Status audit across all 5 docs.
- [ ] CHK-051 [P1] `skill-benchmark-storage-guide.md` documents the repo-relative provenance form and the new archive labels.
  - **Planned evidence**: Diff review of the storage guide.
- [ ] CHK-052 [P1] Strict packet validation reports zero errors.
  - **Planned evidence**: `validate.sh --strict` output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] All new archive state lives under `<hub>/benchmark/compiled-routing/`; nothing is written outside a hub's own `benchmark/` tree or the `create-benchmark`/`build-report.cjs` extension points.
  - **Planned evidence**: Path inventory of every created/modified file.
- [ ] CHK-061 [P1] The 7 hub `benchmark/README.md` files are the only README-level edits.
  - **Planned evidence**: `git diff --stat` scoped to README paths.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 12 | 0/12 | Planned |
| P1 Items | 7 | 0/7 | Planned |
| P2 Items | 0 | 0/0 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: Fail-closed report-path convention, active-manifest archive boundary, `serving-snapshot.json` correctness, repo-relative provenance, append-only transition log, frozen-scorer and `baseline`-label untouched invariants.
<!-- /ANCHOR:summary -->
