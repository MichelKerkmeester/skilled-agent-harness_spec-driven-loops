---
title: "Canonical-first spec-root resolution"
description: "Canonical-first spec-root resolution gives unqualified packet names a stable canonical winner, preserves explicit paths, retains legacy-only read fallback, and blocks unsafe duplicate-root writes."
trigger_phrases:
  - canonical-first spec-root resolution
  - canonical spec folder resolver
  - spec root collision guard
  - legacy spec root fallback
  - spec root migration
version: 1.0.0.0
---

# Canonical-first spec-root resolution

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Canonical-first spec-root resolution gives unqualified packet names a stable canonical winner under `.opencode/specs`, preserves explicit paths, retains a legacy-only read fallback, and blocks writes when two physical roots contain divergent copies of the same packet.

The implementation is present on this implementation branch. Its real-data migration and compatibility-alias retirement have not been claimed or recorded as completed in production: those rollout steps remain deployment-gated by the data-before-writers migration sequence, the clean compatibility window, and the alias-retirement runbook.

---

## 2. HOW IT WORKS

### Canonical Selection And Compatibility

`resolveSpecFolderCanonical()` preserves absolute paths and paths explicitly qualified with `specs/` or `.opencode/specs/`. For an unqualified packet identity, it checks the canonical packet first, falls back to a unique existing legacy packet for reads, and otherwise returns the canonical destination for a new packet. The shared config helper follows the same canonical-before-legacy order while `getAllExistingSpecsDirs()` can still enumerate both distinct roots.

### Collision And Write Safety

The collision classifier assigns one of five states: `canonical-only`, `legacy-only`, `same-inode-alias`, `byte-identical-duplicate`, or `divergent-duplicate`. It allows the first four and fails closed for divergence or when no safe readable owner can be established. `assertSpecWriteAllowed()` first honors the process-independent writer freeze, then rejects a divergent packet write with both observed roots in the error when available.

### Migration And Rollout Boundary

The migration path snapshots packet file sets with SHA-256 hashes, copies legacy-only packets into a verified quarantine outside both spec roots, and only then moves them to the canonical root. Divergent packets are deferred for explicit resolution. In-process fallback telemetry records legacy reads and legacy-write attempts so operators can evaluate the compatibility clean-window gate.

The implementation branch therefore contains the resolver, guards, migration primitives, telemetry, fixtures, and normalized call sites. Production rollout is separate: real packet data must be classified and migrated before writer cutover, and alias retirement requires the documented 28-day zero-hit window plus complete no-alias validation. This entry does not claim that either production step has occurred.

---

## 3. SOURCE FILES

### SOURCE EVIDENCE

### 1) Canonical-first resolution and explicit-path preservation

- `.opencode/skills/system-spec-kit/scripts/core/spec-root-canonical-resolver.ts:12-18` recognizes explicit root-qualified inputs.
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-canonical-resolver.ts:43-72` preserves absolute and qualified paths, checks `.opencode/specs` first, falls back to an existing legacy-only packet, and otherwise returns the canonical candidate.
- `.opencode/skills/system-spec-kit/scripts/core/config.ts:321-360` orders canonical before legacy for active-root selection while enumerating and realpath-deduplicating both existing roots.

### 2) Fail-closed collision and writer guards

- `.opencode/skills/system-spec-kit/scripts/core/spec-root-collision-classifier.ts:12-23` defines the five collision classes and the allow/reject result.
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-collision-classifier.ts:145-169` selects canonical-only, legacy-only, same-inode, or byte-identical states and rejects divergence or an unreadable ownership state.
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-write-guard.ts:14-38` applies the writer freeze and rejects `divergent-duplicate` writes with observed-root evidence.
- `.opencode/skills/system-spec-kit/scripts/core/spec-writer-freeze.ts:130-194` provides durable freeze, unfreeze, inspection, and fail-closed write assertions.

### 3) Lossless migration, manifest, and compatibility telemetry

- `.opencode/skills/system-spec-kit/scripts/core/spec-root-migration.ts:213-265` quarantines verified legacy-only packets before moving them and defers divergent duplicates.
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-migration-manifest.ts:162-173` hashes framed packet file sets with SHA-256.
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-migration-manifest.ts:225-247` builds the deterministic read-only manifest and counts divergent packets.
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-fallback-telemetry.ts:13-47` records legacy fallback/write activity and exposes the clean compatibility-window predicate.

### 4) Integrated writers and validation matrix

- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:27-28` imports the canonical resolver and write guard; `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:913-917` resolves the requested packet and applies the guard before writing.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:811-815` selects `.opencode/specs` as the creation root before applying an optional track.
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:14` imports the canonical resolver; `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:925` uses it for the configured packet argument.
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-fixtures.ts:46-123` defines the R1-R10 root-state contract.
- `.opencode/skills/system-spec-kit/scripts/tests/spec-root-canonical-resolver.vitest.ts:35-79` covers canonical-first bare names, new canonical targets, legacy-only fallback, explicit paths, and traversal rejection.
- `.opencode/skills/system-spec-kit/scripts/tests/spec-root-validation-matrix.vitest.ts:89-205` exercises R1-R10 and proves a guarded no-alias write does not materialize `specs/`.

### 5) Deployment-gated status

- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/research.md:17-25` defines the canonical-first contract and the data-before-writers deployment order.
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/research.md:138-147` gates reader rollout on 28 clean days and alias removal on complete no-alias proof.

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/core/spec-root-canonical-resolver.ts` | Script | Canonical-first resolution with explicit-path preservation and legacy-only read fallback |
| `scripts/core/spec-root-collision-classifier.ts` | Script | Five-state physical-root classification and fail-closed divergence decision |
| `scripts/core/spec-root-write-guard.ts` | Script | Writer-freeze and divergent-duplicate enforcement at mutation boundaries |
| `scripts/core/spec-root-migration.ts` | Script | Verified quarantine and legacy-to-canonical packet migration |
| `scripts/core/spec-root-migration-manifest.ts` | Script | Deterministic hashed migration preflight manifest |
| `scripts/core/spec-root-fallback-telemetry.ts` | Script | Compatibility fallback counters and clean-window gate |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/spec-root-canonical-resolver.vitest.ts` | Automated test | Resolver precedence, explicit paths, fallback, and containment |
| `scripts/tests/spec-root-collision-classifier.vitest.ts` | Automated test | Collision-state contract over materialized R fixtures |
| `scripts/tests/spec-root-write-guard.vitest.ts` | Automated test | Divergence rejection and writer-freeze enforcement |
| `scripts/tests/spec-root-validation-matrix.vitest.ts` | Automated test | R1-R10 integration and no-alias write behavior |
| `../../manual-testing-playbook/tooling-and-scripts/canonical-first-spec-root-resolution.md` | Manual playbook | Temporary-workspace operator validation for the five user-visible behaviors |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/canonical-first-spec-root-resolution.md`

Related references:
- [migration-checkpoint-scripts.md](../../feature-catalog/tooling-and-scripts/migration-checkpoint-scripts.md) — Migration rollback tooling and checkpoint discipline
- [dist-freshness-enforcement.md](../../feature-catalog/tooling-and-scripts/dist-freshness-enforcement.md) — Source/dist freshness enforcement for runtime rollout bundles
