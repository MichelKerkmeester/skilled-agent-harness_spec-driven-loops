---
title: "Implementation Summary: Durable Archiving & Serving-Snapshot"
description: "Planned-state record for the durable compiled-routing report-path convention and serving-snapshot.json. No archiving convention, schema, or renderer exists yet; the packet is hard-blocked on the 002 status foundation and the 004 Lane C parity harness."
trigger_phrases:
  - "durable archiving planned summary"
  - "serving snapshot current status"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Durable Archiving & Serving-Snapshot

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Implementation** | Not started |
| **Current archiving state** | No `compiled-routing/` convention exists under any hub's `benchmark/`; per-hub activation state is split across 7 separate JSON files with no joined artifact (confirmed this session) |
| **Strict validation** | Planned after the full Markdown set is authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet plans a durable, fail-closed report-path convention for compiled-routing benchmark evidence, a `serving-snapshot.json` schema joining manifest + fence + flag + freshness + parity into one artifact plus a renderer, a `report.compiledRouting` render block in the existing non-frozen `build-report.cjs`, repo-relative portable provenance, and an append-only `flip-history.jsonl`. Every archive step is gated on the active `010-live-activation` serving manifest and never touches the frozen scorer or the existing `baseline` label.

### Planned Implementation Surfaces

| Area | Planned Files | Purpose |
|------|-----------------|---------|
| Report convention | `<hub>/benchmark/compiled-routing/<run-label>/{skill-benchmark-report.json,.md}` (7 hubs) | Durable, fail-closed archive location |
| Snapshot schema + renderer | `create-benchmark/references/skill-benchmark/serving-snapshot-schema.md`, a renderer script | Joined per-hub compiled-routing state |
| Report rendering | `system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | `report.compiledRouting` JSON→Markdown block |
| Provenance | `skill-benchmark-storage-guide.md` | Repo-relative `rootRel` documentation + new label conventions |
| Transition log | `<hub>/benchmark/compiled-routing/flip-history.jsonl` (7 hubs) | Append-only serving-authority transition history |
| Index | `<hub>/benchmark/README.md` (7 hubs) | Convention row alongside existing archive-directory rows |

No runtime, router, manifest, or frozen scorer file was modified by this planning phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation waits on `../002-runtime-promotion-and-status-foundation/` (the durable status-probe fields the snapshot schema consumes) and `../004-benchmark-compiled-lane-c/` (the `compiledRoute` parity JSON this packet archives). Once both land, the report-path convention and snapshot capture/renderer ship first, the `build-report.cjs` render block and provenance rework follow, and the append-only log and README updates close out the packet — each step verified against the active `010` manifest, never a `006` shadow candidate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Fail closed on an existing `<run-label>` | Prevents a LUNA or parity run from silently overwriting or vanishing, per `CF-ARC-1`. |
| One joined `serving-snapshot.json` instead of reading 4-7 separate files | Today's evidence is split across `manifest.json`, `fence-state.json`, `activation-record.json`, `serving-flip-record.json`, and siblings, with no single readable state — `CF-ARC-2`. |
| Extend the non-frozen `build-report.cjs`, never the frozen scorer | Matches the exact precedent `verification-v1.md` §3.1 confirmed for `CF-BM-4`: the safe implementation site is the orchestrator, not the frozen file. |
| Never repurpose the `baseline` label | `CF-ARC-4` states this explicitly; new immutable siblings follow the hub's existing naming family instead. |
| Archive only against the active `010` manifest | A `006` shadow candidate was never live; archiving it as if it were the serving decision would misattribute state. |
| Repo-relative provenance over absolute paths | The current absolute `root` field is already demonstrably stale the moment a report is viewed from a different checkout — confirmed live this session. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Current archiving-state inventory | Confirmed this session: no `compiled-routing/` convention exists; per-hub state fragmented across up to 7 files |
| Stale absolute-path proof | Confirmed this session: `sk-code/benchmark/router-final/skill-benchmark-report.json:7-10` serializes a `root` that no longer matches its own current location |
| Fail-closed collision behavior | Planned |
| Active-manifest source boundary (never `006`) | Planned |
| `serving-snapshot.json` field-level correctness | Planned |
| Repo-relative provenance portability | Planned |
| Append-only `flip-history.jsonl` | Planned |
| Strict skill-package and spec-folder validation | Planned spec command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/007-durable-archiving-and-serving-snapshot --strict` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This packet is hard-blocked on `002` and `004`.** The snapshot schema's `freshness`/`engineResolverPath` fields and the `report.compiledRouting` content both depend on work that has not shipped yet.
2. **The renderer's exact script name and output shape are open.** `spec.md` §7 leaves the concrete `create-benchmark` script path as a build-time detail.
3. **`flip-history.jsonl` retention is unbounded by design here.** A future rotation/archival policy is explicitly out of scope and flagged as a follow-on question.
4. **Historical reports are not retrofitted.** Only newly-archived reports gain `rootRel`; existing absolute-path reports remain as-is unless a separate migration is later scoped.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Confirm `../002-runtime-promotion-and-status-foundation/` and `../004-benchmark-compiled-lane-c/` readiness.
- [ ] Pin the `serving-snapshot.json` schema against the confirmed `010` manifest shape.
- [ ] Implement the report-path convention, snapshot capture/renderer, `build-report.cjs` block, provenance rework, and `flip-history.jsonl` writer listed in `spec.md`.
- [ ] Run the collision, boundary, drift, portability, and append-only fixture tests plus strict spec-folder validation.
- [ ] Let the parent workflow generate `description.json` and `graph-metadata.json` for this spec folder; this leaf authoring pass does not create them.
<!-- /ANCHOR:follow-up -->
