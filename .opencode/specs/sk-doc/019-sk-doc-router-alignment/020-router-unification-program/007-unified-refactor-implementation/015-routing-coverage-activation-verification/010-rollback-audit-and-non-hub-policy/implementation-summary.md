---
title: "Implementation Summary: Rollback, Audit Integrity & Non-Hub Policy"
description: "Planning-time record (Status: Planned) of activate-hub.cjs --rollback, the flip-serving.cjs serving-prior and fence-direction fixes, append-only audit history, the non-hub ineligibility policy, the P2 canary naming, and the routingRecommendation field fix. No code has been written yet; this document will be updated with delivery evidence once implementation completes."
trigger_phrases:
  - "rollback audit integrity implementation summary"
  - "non-hub policy planned summary"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Rollback, Audit Integrity & Non-Hub Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned — not yet started |
| **Authored** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Unaffected by design — this child adds/fixes rollback capability on two already-shipped drivers but does not itself flip any hub's `servingAuthority` or `selectedPolicy` |
| **Strict validation** | Planning-doc validation (`validate.sh --strict` on this folder) is run at authoring time; implementation-time re-run against delivered code, plus the seven-hub fleet regression check, is a separate completion gate, not yet exercised |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: Planned.** Nothing below has been built yet; this section states the intended build so implementation can be verified against it.

`--rollback` added to `activate-hub.cjs`, reusing its existing `proveRollback()` hash-validation as a real, committed recovery command. `flip-serving.cjs`'s stale first-flip-only `serving-prior` guard replaced with an unconditional resave, and a persisted fence `direction` (or restore-prior-epoch alternative) closing the cutover-vs-recovery ambiguity. An append-only `flip-history.jsonl` per hub, shared by both drivers, so re-mint history is never lost. An explicit non-hub ineligibility policy naming all 5 non-hub candidates (`sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, `mcp-code-mode`) with negative fixtures. A named P2 canary profile/owner/window/thresholds/rollback-trigger. And a fix to `session-snapshot.ts`'s `routingRecommendation` field-name collision plus a live router-status probe requirement before the resume/priming sufficiency early-exit. This session independently re-read `activate-hub.cjs` and `flip-serving.cjs` in full, upgrading CF-ACT-8's evidence from synthesis's own "INFERRED" to CONFIRMED, and additionally confirmed `flip-serving.cjs` already has its own (differently-scoped) `--rollback`.

### Files Planned

| Area | Files | Purpose |
|------|-------|---------|
| Rollback | `007-unified-refactor-implementation/010-live-activation/lib/activate-hub.cjs` | New `--rollback` verb reusing `proveRollback()` |
| Serving-flip fixes | `007-unified-refactor-implementation/011-runtime-engine/lib/flip-serving.cjs` | Unconditional `serving-prior` resave; persisted fence `direction` |
| Audit | `flip-history.jsonl` (per hub, new) | Append-only history shared by both drivers |
| Policy | `non-hub-router-eligibility-policy.md` (new, location TBD at build time) | Named non-hub ineligibility policy + negative fixtures |
| Canary | `compiled-routing-canary-profile.md` (new, location TBD at build time) | Named P2 canary profile/owner/window/thresholds/rollback-trigger |
| Field fix | `session-snapshot.ts`, `speckit-resume-auto.yaml`, `session-prime.ts` | `codeSearchRecommendation`/`skillRouterStatus` rename + sufficiency-probe requirement |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | This planning record |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

> **Status: Planned.** The phases below describe the intended delivery sequence; none has executed yet.

Per `plan.md`, three phases: (1) setup — snapshot all seven hubs' committed state as the before-baseline, add `--rollback` to `activate-hub.cjs`, prove it on a test fixture before touching any live hub; (2) implementation — fix `flip-serving.cjs`'s stale-prior guard, add the persisted fence `direction`, wire append-only `flip-history.jsonl` into both drivers, author the non-hub policy and (P1) the canary-profile document; (3) verification — the P1 `session-snapshot.ts` field fix, a fleet-wide byte-diff regression check against the Phase 1 snapshot, a frozen-scorer re-hash, and `validate.sh --strict`. Every change is additive to two already-live, shipped drivers; the fleet regression check is the highest-care gate given the blast surface.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Reuse `proveRollback()` rather than write new hash-validation logic | It already exists in `activate-hub.cjs` as a pre-flight check; exposing it as a real command is the minimal, lowest-risk change |
| Fix `flip-serving.cjs`'s `serving-prior` guard as an intended behavior change, not a "regression" | CF-ACT-8 explicitly identifies the first-flip-only guard as the bug; the fix changes behavior only for the previously-broken rollback-then-reflip case |
| Do not edit `009-non-hub-rollout/`, `012-default-on-decision/`, or `013-create-skill-alignment/` | Scope-lock — this child's write authority is limited to its own three-child authoring pass; those packets' own fixes (e.g., 009's Phase Map undercount) are cross-referenced, not performed here |
| Owner field in the canary-profile document is an explicit placeholder | This child has no authority to name a human organizational owner; fabricating one would violate the no-fabrication mandate |
| `flip-history.jsonl` is additive alongside the existing single-record files, not a replacement | Keeps the existing "latest snapshot" consumers working unchanged while adding the missing history dimension |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

> **Status: Planned.** The checks below are what will be run; none has been run yet.

Once implemented, this child will be verified by: (1) `activate-hub.cjs --rollback` restoring the byte-identical prior manifest for a test fixture without touching any live hub; (2) a rollback-then-reflip sequence on `flip-serving.cjs` retaining the correct current `serving-prior`; (3) `fence-state.json` (or its replacement) distinguishing cutover from recovery; (4) `flip-history.jsonl` accumulating entries without erasure across repeated events; (5) all 5 non-hub negative fixtures passing; (6) a fleet-wide byte-diff of all seven hubs' committed state showing zero unintended change; (7) frozen-scorer SHA-256 digests unchanged pre/post; (8) `validate.sh --strict` on this folder reporting Errors: 0.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning-only record.** Status is Planned, not Complete; no code, test, or document described above has been written yet.
2. **REQ-006 and REQ-007 (P1) may be deferred with user approval**, particularly REQ-007 if its `skillRouterStatus` shape is better sequenced with `002`'s status-probe contract landing first.
3. **The exact human owner for the P2 canary is not named in this planning doc** — naming a specific person without operator input would be fabrication; REQ-006 produces the naming contract with an explicit placeholder, not a filled name.
4. **This child edits two already-shipped, Complete/production drivers** (`activate-hub.cjs`, `flip-serving.cjs`) that all seven hubs already depend on — the fleet regression check (byte-diff of all seven hubs' committed state) is the highest-priority verification item and has not yet been run.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: planned
    current_focus: "Level-2 planning docs authored for 010-rollback-audit-and-non-hub-policy (spec/plan/tasks/checklist/implementation-summary); no implementation started"
    next_steps:
      - "Snapshot all seven hubs' committed state before any implementation begins"
      - "Resolve the four Open Questions in spec.md §7 at build time (fence-direction design, document homes, canary owner, REQ-007 sequencing)"
      - "Run the fleet regression byte-diff as the primary completion gate"
    blockers: []
-->
