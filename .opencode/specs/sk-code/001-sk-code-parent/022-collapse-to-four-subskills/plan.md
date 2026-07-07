---
title: "Implementation Plan: Collapse sk-code from 8 sub-skills to 4"
description: "Retrospective Level 2 plan for collapsing sk-code to four sub-skills, preserving dissolved-mode capability through shared doctrine and surface symlinks, folding animation into code-webflow, and re-baselining Lane-C."
trigger_phrases:
  - "phase 22 collapse plan"
  - "sk-code four subskills plan"
  - "collapse code-implement code-debug code-verify"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/022-collapse-to-four-subskills"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "sk-code collapsed to four sub-skills and Lane-C re-baselined"
    next_safe_action: "None; retrospective close-out docs record shipped work"
---
# Implementation Plan: Collapse sk-code from 8 sub-skills to 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skills, JSON router metadata, Python verification scripts, deterministic router benchmark reports |
| **Framework** | sk-code surface-primary two-axis parent hub, parent-hub router, manual testing playbook, Lane-C router benchmark |
| **Storage** | Repository filesystem: `.opencode/skills/sk-code/`, `.opencode/agents/`, specs/docs references, manual testing playbook, and `benchmark/router-final/` |
| **Testing** | parent-skill-check STRICT, parent-hub vocab-sync, check-rule-copies canary, drift-guard vitest, full skill-benchmark vitest suite, markdown link check, router-final comparison |

### Overview
This phase completed the structural collapse of the sk-code parent hub from eight sub-skills to exactly four. The near-empty workflow-mode skills `code-implement`, `code-debug`, and `code-verify` were dissolved into shared workflow doctrine that is symlinked into both surviving surface skills. `code-animation` was folded into `code-webflow` as non-skill references and assets. Routing metadata, external references, playbook gold, benchmark harness expectations, and `benchmark/router-final/` were reconciled to the surface-primary model. The shipped result preserves all real capability while reducing routable sub-skill surface area to `code-opencode`, `code-webflow`, `code-review`, and `code-quality`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 022 spec defines the collapse scope, out-of-scope boundaries, REQ-001 through REQ-007, SC-001 through SC-003, risks, and edge cases.
- [x] The starting hub shape was known: eight sub-skills split across surface skills, workflow-mode skills, quality, and review.
- [x] The target hub shape was fixed: exactly four routable sub-skills remain under sk-code.
- [x] The benchmark scope was bounded to deterministic router mode; live-mode re-baseline was explicitly out of scope.

### Definition of Done
- [x] `code-implement`, `code-debug`, `code-verify`, and `code-animation` are no longer routable sk-code sub-skill folders.
- [x] Dissolved-mode doctrine, verification scripts, debugging and verification checklists, and animation references/assets are preserved at their new homes.
- [x] Hub routing, mode registry, smart-routing resource maps, external references, and benchmark gold are reconciled to the four-sub-skill model.
- [x] Lane-C deterministic router-final is re-baselined to CONDITIONAL 71, holding the prior CONDITIONAL 71 requirement.
- [x] All recorded verification gates pass, including parent-skill-check STRICT, vocab-sync, check-rule-copies, drift-guard, full skill-benchmark vitests, markdown links, and router-final.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surface-primary parent hub collapse with shared doctrine preservation: dissolve generic workflow-mode shells into `shared/references/`, expose that doctrine through in-skill symlinks on both surviving surfaces, fold animation into the Webflow surface as an overlay, and keep quality/review as standalone workflow gates.

### Key Components
- **Surviving sub-skills**: `code-opencode`, `code-webflow`, `code-review`, and `code-quality` remain the only sk-code folders with SKILL.md.
- **Shared workflow doctrine**: `shared/references/workflow_implement.md`, `shared/references/workflow_debug.md`, and `shared/references/workflow_verify.md` preserve the dissolved mode doctrine.
- **Surface symlinks**: `code-opencode/references/` and `code-webflow/references/` expose the shared workflow doctrine from inside each surface.
- **Relocated assets**: Verification scripts live under `code-opencode/assets/scripts/`; animation references/assets live under `code-webflow/{references,assets}/animation/`; checklists remain under their preserved homes.
- **Router and benchmark surfaces**: `hub-router.json`, `mode-registry.json`, `shared/references/smart_routing.md`, manual testing playbook gold, benchmark harness tests, and `benchmark/router-final/` all reflect the four-sub-skill model.

### Data Flow
The parent hub now routes authoring work to the relevant surviving surface first, with implement/debug/verify doctrine loaded from the surface-local symlinks rather than from separate workflow-mode skills. Motion.dev animation prompts are handled as a cross-stack MOTION overlay loaded alongside the appropriate surface, not as a `code-animation` surface leak. Quality and review remain standalone modes. Benchmark gold and router-final regeneration consume the same four-sub-skill model, so deterministic Lane-C scoring measures the shipped routing shape.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [x] Confirm phase-022 scope, requirements, success criteria, risks, and out-of-scope boundaries.
- [x] Confirm the target hub has exactly four surviving sub-skills: `code-opencode`, `code-webflow`, `code-review`, and `code-quality`.
- [x] Inventory dissolved-mode doctrine, verification scripts, debugging and verification checklists, animation references/assets, routing metadata, external references, and benchmark gold requiring reconciliation.

### Phase 2: Fresh Benchmark Packages
- [x] Consolidate generic implement, debug, and verify doctrine into `shared/references/workflow_{implement,debug,verify}.md`.
- [x] Symlink the shared workflow doctrine into both `code-opencode/references/` and `code-webflow/references/`.
- [x] Relocate real dissolved-mode assets, including verify scripts and preserved checklists, without content loss.
- [x] Fold `code-animation` references and assets into `code-webflow` as non-skill animation resources.

### Phase 3: Validator Promotion
- [x] Delete the dissolved/folded sub-skill folders so only four SKILL.md files remain under sk-code.
- [x] Reconcile `hub-router.json`, `mode-registry.json`, and `shared/references/smart_routing.md` to the four-sub-skill model.
- [x] Repoint external references in agents and specs/docs off the dissolved sub-skills.
- [x] Restore the verify Iron Law in shared verify doctrine and repoint canary and external verify-script references to `code-opencode`.
- [x] Verify parent-hub strict checks, vocabulary sync, rule-copy canary, and router drift guard pass.

### Phase 4: Parent Rollup and Optional Catalogs
- [x] Re-translate manual testing playbook gold for folded animation and dissolved verify-mode paths.
- [x] Update benchmark harness vitests off dissolved implement/debug/verify modes and onto the two-axis model.
- [x] Update the router-replay surface-slicer so Motion.dev animation classifies as a cross-stack MOTION overlay.
- [x] Regenerate `benchmark/router-final/` and confirm the verdict remains CONDITIONAL 71.
- [x] Record scoped deviations and live-mode deferral in close-out docs.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parent hub invariants | sk-code parent hub strict shape | `PARENT_HUB_CHECK_STRICT=1` parent-skill-check on sk-code |
| Vocabulary drift | Router aliases and keyword ownership | parent-hub vocab-sync with all drift arrays empty |
| Rule-copy canary | Rule invariants and Iron Law copies | check-rule-copies canary |
| Router sync | sk-code router drift guard | `sk-code-router-sync.vitest.ts` |
| Benchmark suite | Full skill benchmark harness | 107/107 vitest pass across 8 files |
| Link integrity | sk-code markdown links | check-markdown-links with 0 sk-code links flagged |
| Router-final baseline | Deterministic Lane-C report | `benchmark/router-final` verdict CONDITIONAL, aggregate 71 |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 022 spec scope | Internal | Available | Collapse scope, requirement disposition, and out-of-scope boundaries would be ambiguous |
| Current sk-code parent hub | Internal | Available | Folder collapse, routing reconciliation, and asset preservation could not be applied |
| Manual testing playbook gold | Internal | Available | Lane-C deterministic router-final could not be re-baselined to the shipped four-sub-skill model |
| Benchmark harness vitests | Internal | Updated in scope | Dissolved-mode gold and routing expectations would keep the suite red |
| Live-mode provider configuration | External | Deferred by scope | Live-mode benchmark re-baseline remains pending; router mode is the deterministic CI gate |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sk-code does not expose exactly four SKILL.md files, relocated doctrine/assets are missing, routing drift appears, external references still target dissolved sub-skills, router-final drops below CONDITIONAL 71, or strict parent-hub gates fail.
- **Procedure**: Restore the sk-code paths to the prior branch tip, re-apply the collapse in smaller coherent units, re-run parent-skill-check STRICT, vocab-sync, check-rule-copies, drift-guard, full skill-benchmark vitests, markdown link checks, and router-final before pushing again.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Phase 022 spec and current sk-code filesystem | Doctrine consolidation and asset relocation |
| Fresh Benchmark Packages | Inventory of dissolved-mode and animation content | Folder deletion and router reconciliation |
| Validator Promotion | Completed content preservation and routing updates | Playbook gold re-translation and benchmark re-baseline |
| Parent Rollup and Optional Catalogs | Green parent-hub and benchmark gates | Final close-out documentation |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Bounded by one parent hub but spans routing, assets, references, and benchmark gold |
| Fresh Benchmark Packages | High | Four folder dissolutions/folds with zero-loss preservation through shared doctrine and surface symlinks |
| Validator Promotion | High | Router metadata, external references, canaries, and full benchmark suite reconciliation |
| Parent Rollup and Optional Catalogs | Medium | Playbook gold re-translation, router-final regeneration, and close-out evidence capture |
| **Total** | | **Medium-high structural collapse and benchmark re-baseline phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the starting hub shape and target four-sub-skill shape.
- [x] Confirm real dissolved-mode doctrine, scripts, checklists, and animation resources have new homes before folder deletion.
- [x] Record deterministic router-final baseline requirement: verdict at least prior CONDITIONAL 71.

### Rollback Procedure
1. Restore sk-code folder layout and router metadata from the prior branch tip.
2. Restore external references and manual testing playbook gold from the same change set.
3. Restore the prior `benchmark/router-final/` report if the regenerated report is invalid.
4. Re-run parent-hub strict checks, drift checks, full skill-benchmark vitests, markdown link checks, and router-final before attempting a narrower collapse.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Filesystem-only revert of sk-code folder moves/deletions, routing metadata edits, external reference updates, playbook gold edits, benchmark harness expectations, and regenerated router-final outputs; no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
