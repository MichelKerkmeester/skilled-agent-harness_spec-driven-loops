---
title: "Implementation Plan: Phase 18 deep-loop canon alignment and benchmark"
description: "Plan for executing safe-now deep-loop hub artifacts while deferring registry, router, extension, and changelog fixes until the live refactor gate clears."
trigger_phrases:
  - "deep-loop canon plan"
  - "deep-loop safe-now gated split"
  - "deep-loop parent hub benchmark"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/018-deep-loop-canon-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Start T001"
---
# Implementation Plan: Phase 18 deep-loop canon alignment and benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON and Markdown skill metadata |
| **Framework** | OpenCode parent-hub canon, deep-loop workflow hub, sk-doc parent hub templates |
| **Storage** | Repository filesystem and spec-folder documentation |
| **Testing** | parent-skill-check strict, markdown/link checks, manual playbook review, benchmark baseline inspection |

### Overview
This phase is split by collision safety. 018a creates absent, collision-free hub artifacts for deep-loop-workflows. 018b is explicitly deferred until `mode-registry.json` is git-clean after the live deep-context/runtime refactor, because the registry and deprecation paths are active collision points.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Master plan 018 scope reviewed. Trace: master plan 018.
- [ ] Audit P0 findings P0-1 through P0-8 reviewed. Trace: audit P0 list.
- [ ] 018a target paths confirmed absent or safe to create. Trace: audit P0-4, P0-5, P0-6.
- [ ] 018b gate checked and recorded before any registry, router, or changelog work. Trace: audit P0-1.

### Definition of Done
- [ ] 018a `description.json` created and parent-hub field shape verified. Trace: audit P0-4.
- [ ] 018a hub-level `manual_testing_playbook/` created and shape verified. Trace: audit P0-5.
- [ ] 018a hub-level `benchmark/` baseline created and shape verified. Trace: audit P0-6.
- [ ] 018b remains blocked unless the gate clears, with all blocked tasks carrying the exact gate reason. Trace: user brief; audit P0-1.
- [ ] parent-skill-check strict evidence records the expected partial closure after 018a and full closure only after 018b. Trace: master plan verify bullet.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent hub canon alignment with a safety split: additive hub artifacts first, registry/router/changelog conformance only after single-writer collision risk clears.

### Key Components
- **deep-loop-workflows hub**: the parent skill receiving hub-level description, playbook, benchmark, registry, router, and changelog conformance.
- **018a additive artifacts**: `description.json`, `manual_testing_playbook/`, and `benchmark/`.
- **018b gated canon fields**: per-mode `packetKind`, `grandfatheredFolderMismatch`, and `toolSurface` across seven workflow modes.
- **018b gated extensions**: top-level `extensions` for `runtime-loop`, `advisor-projection` with drift guard path, and `deprecated-modes`.
- **018b gated router**: `hub-router.json`, blocked until registry mode keys are stable.
- **018b gated changelog cleanup**: dangling `changelog/deep-context` symlink, owned by the live deprecation sweep.

### Data Flow
Execution starts with collision-free additive files. Parent-skill-check strict then proves which 018a failures clear. When `mode-registry.json` becomes git-clean, 018b may update registry metadata, create router metadata aligned to the settled mode set, and let the deprecation sweep remove the dangling changelog symlink.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: 018a Safe-Now Additive Artifacts
- [ ] Create `deep-loop-workflows/description.json` from parent-hub description shape. Trace: master plan 018a; audit P0-4.
- [ ] Create hub-level `manual_testing_playbook/` mirroring sk-code package shape. Trace: master plan 018a; audit P0-5.
- [ ] Create hub-level `benchmark/` baseline mirroring sk-code baseline shape. Trace: master plan 018a; audit P0-6.

### Phase 2: 018a Verification
- [ ] Run parent-skill-check strict and confirm checks 8a, 9a, and 9b no longer fail. Trace: audit P0-4, P0-5, P0-6.
- [ ] Confirm no gated registry, router, or changelog file was modified. Trace: audit P0-1.

### Phase 3: 018b Deferred/Gated Canon Alignment
- [ ] [B] Add per-mode `packetKind`, `grandfatheredFolderMismatch`, and `toolSurface` to seven workflow modes. Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean. Trace: audit P0-2.
- [ ] [B] Add top-level `extensions` for `runtime-loop`, `advisor-projection` with drift guard path, and `deprecated-modes`. Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean. Trace: audit P0-3.
- [ ] [B] Author `hub-router.json` after the seven-mode set is stable for bidirectional check 5b. Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean. Trace: audit P0-7.
- [ ] [B] Remove dangling `changelog/deep-context` symlink through the live deprecation sweep. Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean. Trace: audit P0-8.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Trace |
|-----------|-------|-------|-------|
| Parent hub contract | deep-loop-workflows conformance | `parent-skill-check` with strict mode | master plan verify; audit scorecard |
| Artifact existence | description, playbook, benchmark | Filesystem inspection and parent-skill-check 8a/9a/9b | audit P0-4, P0-5, P0-6 |
| Collision safety | registry, router, changelog untouched during 018a | `git diff` scoped to deep-loop-workflows | audit P0-1, P0-8 |
| Router alignment | future hub-router keys match settled workflow modes | parent-hub router schema check 5b | audit P0-7 |
| Benchmark baseline | hub-level baseline package exists and is inspectable | Benchmark file review and parent-skill-check 9b | audit P0-6 |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code hub artifact shapes | Internal reference | Available | 018a shape lacks canonical comparison |
| Parent-hub description template | Internal reference | Available | `description.json` field set may drift |
| `mode-registry.json` clean state | Live branch gate | Blocked for 018b | Registry fields and extensions cannot be safely authored |
| Settled seven-mode registry set | Live branch gate | Blocked for 018b | `hub-router.json` cannot pass bidirectional mode-key check |
| Live deep-context deprecation sweep | Concurrent work | Blocked for 018b | Dangling changelog symlink cleanup can collide |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: 018a additive artifacts make parent-skill-check worse, fail shape checks, or conflict with live deep-loop work.
- **Procedure**: Revert only the new 018a additive artifacts from `description.json`, `manual_testing_playbook/`, and `benchmark/`, then re-run parent-skill-check strict to return to the prior known failure profile.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 018a Safe-Now | Master plan 018 and audit P0-4/P0-5/P0-6 | Partial closure of 3 of 8 deep-loop P0 findings |
| 018a Verification | Safe-now artifact creation | Decision to leave 018b blocked or open later |
| 018b Deferred/Gated | `mode-registry.json` git-clean and settled seven-mode set | Full deep-loop parent-hub conformance |
| 019 Promotion | 018b complete | WARN-to-FAIL validator promotion and cross-hub benchmark rollup |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 018a Safe-Now | Medium | Additive metadata, playbook, and benchmark package authoring |
| 018a Verification | Low | Existence, shape, and parent-skill-check strict evidence |
| 018b Deferred/Gated | Medium | Registry fields, extensions, router, and changelog cleanup after gate clears |
| **Total** | | **Split phase; safe-now can execute independently, full closure waits on gate** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm 018a targets are absent or safe add-only paths.
- [ ] Confirm `mode-registry.json` dirty state before leaving 018b blocked.
- [ ] Confirm no 018b target file is staged or edited by this phase.

### Rollback Procedure
1. Remove only newly added 018a artifacts if they fail verification.
2. Re-run parent-skill-check strict on deep-loop-workflows.
3. Confirm the failure profile did not increase beyond the known audit baseline.
4. Keep 018b tasks blocked until the gate clears.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Revert repository filesystem additions for the safe-now artifacts only.

<!-- /ANCHOR:enhanced-rollback -->
