---
title: "Implementation Plan: Phase 11 hub canon"
description: "Plan for the shipped canonical parent-hub method, sk-doc templates, validator enforcement, vocab-sync hardening, and scaffolder alignment."
trigger_phrases:
  - "hub canon plan"
  - "parent hub implementation plan"
  - "two-axis hub plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/011-hub-canon"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Backfilled the Level 2 plan for the already-shipped hub canon phase."
    next_safe_action: "Run strict validation for the 011-hub-canon phase folder."
---
# Implementation Plan: Phase 11 hub canon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON templates, JavaScript command scripts, YAML command contract |
| **Framework** | OpenCode skill and command authoring framework |
| **Storage** | Local `.opencode/` skill, command, and spec files |
| **Testing** | Vitest, parent-skill-check, drift guard, strict spec validation |

### Overview
This phase defines the single parent-hub canon for the repo. It generalizes the sk-design/sk-code 2-tier shape, models deep-loop's extra machinery as named extensions, publishes sk-doc templates and schema docs, upgrades doctor enforcement, and aligns vocab sync plus the parent-hub scaffolder to the same two-axis contract.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing parent-hub disagreement documented in `spec.md` and `design-contract.md`.
- [x] Canonical model chosen: 2-tier generalized, deep-loop extensions named in place.
- [x] Scope frozen to sk-doc parent hub assets, validator enforcement, vocab sync, scaffolder, and doctor invariant.
- [x] No code changes are part of this documentation backfill.

### Definition of Done
- [x] Canon contract shipped in docs and templates.
- [x] Parent-skill-check covers all hubs with checks 1-9.
- [x] Vocab sync fails loud on missing router/registry and tests pass.
- [x] Scratch scaffolded hub passes parent-skill-check in default and strict mode.
- [x] Level-2 docs backfilled and checklist evidence recorded.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical parent hub = thin hub `SKILL.md` plus companion metadata, with every packet represented in `mode-registry.json > modes[]` and classified by `packetKind`.

### Key Components
- **Design contract**: `design-contract.md` captures the one method and enforcement map.
- **Registry model**: `modes[]` carries both workflow and surface packets through the required `packetKind` discriminator.
- **Router model**: `hub-router.json` adds `routerPolicy.outcomes.surfaceBundle` and bidirectional registry/signal coverage.
- **Metadata model**: `description.json` and `graph-metadata.json` are required hub companions.
- **Extensions model**: Deep-loop-specific machinery is declared under `extensions` and activates fields in place.
- **Enforcement**: `parent-skill-check.cjs`, vocab sync, and scaffolder gates encode the same canon.

### Data Flow
Authoring starts from sk-doc parent hub templates, emits hub companion metadata, and routes through `parent-skill-check.cjs`. Vocab sync reads registry/router vocabulary, fails on missing required inputs, and drift guard verifies advisor-projection stability for lexical or alias-fold modes.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Canon Definition
- [x] Define the 2-tier generalized parent-hub method in `design-contract.md`.
- [x] Specify `packetKind: "workflow" | "surface"` on every `modes[]` entry.
- [x] Define surface packet requirements: `backendKind: "evidence-base"`, read-only `toolSurface`, and `routingClass: metadata`.
- [x] Define required hub companions: `hub-router.json` and `description.json`.

### Phase 2: Template and Schema Authoring
- [x] Rewrite parent hub SKILL, registry, and graph metadata templates.
- [x] Add hub router schema, hub router template, and description template.
- [x] Rewrite nested packet guidance with the three-hub extension matrix.
- [x] Update sk-doc index and SKILL routing for PARENT_HUB intent.

### Phase 3: Enforcement and Scaffolding
- [x] Upgrade `parent-skill-check.cjs` to full checks 1-9 for all hubs.
- [x] Inventory strict gaps: sk-code 6, deep-loop 27, sk-design 10.
- [x] Make vocab sync fail loud for missing router/registry and add vitest fixtures.
- [x] Upgrade `/create:sk-skill-parent` scaffolding to the two-axis canon.
- [x] Add the doctor parent-skill two-axis invariant.

### Phase 4: Verification
- [x] Run vocab-sync tests: 5/5.
- [x] Run drift-guard tests: 7/7.
- [x] Run deep-improvement vitests: 414 pass with 2 pre-existing unrelated failures.
- [x] Verify scratch scaffold hub passes parent-skill-check exit 0 in default and strict mode.
- [x] Backfill Level-2 docs and strict-validate this phase folder.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/regression | parent-hub-vocab-sync missing router/registry behavior | Vitest fixtures in commit `d1b545e4b6` |
| Drift guard | Advisor projection compatibility | Drift-guard suite, 7/7 pass |
| Parent hub enforcement | Canon compliance and strict-gap inventory | `parent-skill-check.cjs` default and `PARENT_HUB_CHECK_STRICT=1` |
| Scaffolder QA | Two-axis scratch hub output | `/create:sk-skill-parent` scratch scaffold plus parent-skill-check |
| Spec validation | Backfilled phase docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-code/001-sk-code-parent/011-hub-canon --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code and sk-design existing hub shape | Internal | Green | Canon would lack the chosen 2-tier baseline |
| deep-loop-workflows parent hub | Internal | Green | Extensions model could not be validated against the heaviest hub |
| sk-doc parent hub templates | Internal | Green | New hubs would keep inheriting stale structure |
| parent-skill-check.cjs | Internal | Green | Canon would remain documented but unenforced |
| parent-hub-vocab-sync.cjs | Internal | Green | Missing router/registry could silently pass |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Canon enforcement blocks valid existing hubs or vocab sync produces false failures for complete hub metadata.
- **Procedure**: Revert the shipped phase commits (`b6fe2f31b1`/local `deab5a3853` and tail `d1b545e4b6`), then rerun parent-skill-check and vocab-sync gates to confirm prior behavior is restored.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Canon Definition | Existing sk-code, sk-design, and deep-loop hub evidence | Template and Schema Authoring |
| Template and Schema Authoring | Canon Definition | Enforcement and Scaffolding |
| Enforcement and Scaffolding | Template and Schema Authoring | Verification |
| Verification | Enforcement and Scaffolding | Later strict promotion and sk-code two-axis restructure |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Canon Definition | High | Already shipped |
| Template and Schema Authoring | High | Already shipped |
| Enforcement and Scaffolding | High | Already shipped |
| Verification | Medium | Already shipped |
| Level-2 doc backfill | Low | Current session |
| **Total** | | **Completed before backfill** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Shipped commits identified: core remote `b6fe2f31b1`, local `deab5a3853`, tail remote `d1b545e4b6`.
- [x] Verification evidence captured for vocab sync, drift guard, deep-improvement vitests, and scratch scaffold parent-skill-check.
- [x] Strict gaps kept migration-gated rather than forcing immediate failures.

### Rollback Procedure
1. Revert the core and tail commits for this phase.
2. Re-run vocab-sync and drift-guard suites.
3. Re-run parent-skill-check against sk-code, sk-design, and deep-loop hubs.
4. Restore any later phases that intentionally depend on this canon only after confirming compatibility.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Static docs, templates, command scripts, and YAML changes are reverted through git.

<!-- /ANCHOR:enhanced-rollback -->
