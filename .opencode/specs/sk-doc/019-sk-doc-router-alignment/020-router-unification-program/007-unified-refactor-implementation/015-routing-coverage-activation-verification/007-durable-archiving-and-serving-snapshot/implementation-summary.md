---
title: "Implementation Summary: Durable Archiving & Serving-Snapshot"
description: "Completion record for durable compiled-routing archiving. Commit 2a39ecb9a0 delivered the fail-closed <hub>/benchmark/compiled-routing/ convention, serving-snapshot schema and renderer, report rendering, repo-relative provenance, execution context, and all seven benchmark indexes. The append-only transition ledger was intentionally assigned to sibling 010 and later landed in a1cdb65d90. No hub or repository default was changed; the frozen scorer trio remained byte-identical."
trigger_phrases:
  - "durable archiving implementation summary"
  - "serving snapshot current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/007-durable-archiving-and-serving-snapshot"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled completion evidence to commit 2a39ecb9a0"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Snapshot tooling landed in 2a39ecb9a0; transition ledger ownership moved to 010"
---
# Implementation Summary: Durable Archiving & Serving-Snapshot

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — landed in `2a39ecb9a0`, behind the still-off flag; the frozen scorer stayed byte-identical (SHA-256 unchanged) |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Implementation** | Complete for this child's owned scope — archive convention/writer, snapshot schema/capture/renderer, report/provenance rendering, execution context, storage guide, and seven benchmark indexes |
| **Transition ledger** | Deliberately not duplicated here; REQ-006 ownership moved to sibling 010 and its append-only history landed in `a1cdb65d90` |
| **Current archiving state** | Convention and tooling exist under `sk-doc:create-benchmark`; archives are created only at explicit operator-run labels and fail closed on collisions |
| **Strict validation** | Rerun after final metadata regeneration; result recorded at handoff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented and committed in `2a39ecb9a0`: a durable, fail-closed report-path convention for compiled-routing evidence; a `serving-snapshot.json` schema/capture/renderer joining manifest, fence, flag, freshness, and parity; JSON-to-Markdown report and provenance blocks; repo-relative provenance; a complete execution-context record; storage guidance; and all seven hub benchmark indexes. Every archive step is gated on the promoted active serving manifest and rejects a shadow-candidate source, manifest drift, the frozen `baseline` label, and any existing run label. The frozen scorer trio remained untouched.

### Delivered Surfaces

| Area | Files | Purpose |
|------|-----------------|---------|
| Report convention | `<hub>/benchmark/compiled-routing/<run-label>/{skill-benchmark-report.json,.md}` (7 hubs) | Durable, fail-closed archive location |
| Snapshot schema + renderer | `create-benchmark/references/skill-benchmark/serving-snapshot-schema.md`, a renderer script | Joined per-hub compiled-routing state |
| Report rendering | `system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | `report.compiledRouting` JSON→Markdown block |
| Provenance | `skill-benchmark-storage-guide.md` | Repo-relative `rootRel` documentation + new label conventions |
| Transition log | Owned by sibling `010`; landed in `a1cdb65d90` | Append-only history stays with the drivers that mutate serving state |
| Index | `<hub>/benchmark/README.md` (7 hubs) | Convention row alongside existing archive-directory rows |

No runtime router, serving manifest, repository default, existing `baseline` label, or frozen scorer file was modified by this child.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `002` runtime foundation and `004` parity lane landed first. Commit `2a39ecb9a0` then added the archive writer and snapshot renderer, extended the non-frozen report renderer, documented portable storage, and created or extended all seven benchmark indexes. The implementation used explicit fixture exercises recorded in `tasks.md`: collision, shadow-source rejection, manifest drift, snapshot validation, portability, execution-context completeness, baseline refusal, and frozen-scorer equality. REQ-006 moved to sibling 010 because only the serving-state drivers can own an honest append-only transition ledger.
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
| Fail-closed collision behavior | Pass — existing and empty label directories return `COLLISION`; original bytes remain unchanged and no partial archive is left |
| Active-manifest source boundary | Pass — archive and snapshot capture reject a `006` shadow-candidate path with `MANIFEST_SOURCE` |
| Manifest drift | Pass — digest change between capture and commit returns `DRIFT` with no partial directory |
| Snapshot correctness | Pass — real `sk-code` snapshot validates through `validateServingSnapshot` and renders JSON/Markdown |
| Repo-relative provenance | Pass — archived report drops the absolute root, records `rootRel` plus immutable digests, and remains valid after a path move |
| Execution context | Pass — executor, model/variant, CLI, flag, runtime/manifest digests, scenarios, and revision are persisted |
| Frozen boundaries | Pass — frozen scorer SHA-256 unchanged; `baseline` run label is refused; no serving manifest is written |
| Seven hub indexes | Pass — four benchmark READMEs extended and three created in `2a39ecb9a0` |
| Append-only transition history | Satisfied by owning sibling 010 in `a1cdb65d90`; not duplicated in this child |
| Strict packet validation | Pending only until final metadata regeneration; final result recorded at handoff |

## Milestone Status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M0 dependencies + schema | Done | `002`/`004` landed; schema and collision-free labels pinned before the archive implementation |
| M1 archive + snapshot | Done | Writer, capture, validator, renderer, provenance, and execution context landed in `2a39ecb9a0` |
| M2 reporting + indexes | Done | `build-report.cjs`, storage guide, and all seven benchmark indexes landed |
| M3 verification | Done | Collision, source-boundary, drift, portability, baseline, snapshot, and digest evidence recorded in committed tasks |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Archives are explicit, not automatic.** The tooling does not run on every Lane C invocation and does not imply that a live cutover occurred.
2. **Historical reports are not retrofitted.** Portable `rootRel` provenance applies to new archives; existing absolute-path reports remain historical artifacts.
3. **Transition-history retention remains out of scope.** Sibling 010 owns the append-only ledger and drivers; rotation or archival needs a separate operator policy.
4. **The repository default remains off.** This child supplies evidence tooling only; the live canary and default-on sequence remain operator-gated in P4/011.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] Dependency, schema, archive, snapshot, renderer, provenance, execution-context, and seven-index work landed in `2a39ecb9a0`.
- [x] Collision, boundary, drift, portability, snapshot, baseline, and frozen-digest evidence was recorded with the implementation.
- [x] Append-only transition-history ownership moved to sibling 010 and landed in `a1cdb65d90`.
- [ ] Use the archive and snapshot tooling during the operator-gated P4/011 canary after the 013/014 join gate becomes green.
- [ ] Keep default-off until that operator authorization; this packet does not perform cutover.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The append-only `flip-history.jsonl` writer did not land in `2a39ecb9a0`; ownership moved to sibling 010 so the ledger is written by the same drivers that mutate serving state. That sibling implementation landed in `a1cdb65d90`. Archive capture also reads the promoted runtime manifests delivered by `002`, not the mutable spec-tree copies described in the initial plan. Neither deviation changes the child safety contract.

<!-- /ANCHOR:deviations -->
