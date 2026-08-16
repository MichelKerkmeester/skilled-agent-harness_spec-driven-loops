---
title: "Implementation Plan: DeepSeek V4 Flash pinned to the Max thinking tier"
description: "Force-to-max effort pin for deepseek-v4-flash in the fan-out builders, plus catalog corrections and tests."
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/044-deepseek-v4-flash-max-only"
    last_updated_at: "2026-08-16T17:34:05Z"
    last_updated_by: "implementer"
    recent_action: "Authored implementation plan"
    next_safe_action: "Implement the pin helper + builder application"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: DeepSeek V4 Flash pinned to the Max thinking tier

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Fan-out command construction lives in `fanout-run.cjs`: the cli-pi builder maps `reasoningEffort` to `--thinking`, the cli-opencode builder to `--variant`. DeepSeek V4 Flash is a reasoning model with a `max` thinking level on both providers. There is no `-max` model id on pi/opencode; cli-devin bakes the tier into its `deepseek-v4-flash-max` uid.

### Overview
Add a pin predicate (TS source of truth + CJS mirror) and apply it in the two builders so a Flash dispatch is forced to max effort. Correct the catalogs and document the policy.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Live capability verified: Flash `reasoning: true` with `thinkingLevelMap.max`; no `-max` id on pi/opencode.
- Operator decisions captured: (1) Flash Max = effort pin; (2) force to max.

### Definition of Done
- vitest (executor-config, fanout-run unit, cli-adapter stress fanout) green with the pin.
- A cli-pi Flash dispatch at `high` observed emitting `--thinking max`.
- Catalogs corrected; policy notes present.
- `validate.sh <folder> --strict` exit 0/1.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single TS source of truth (`isFlashMaxPinnedModel` / `pinReasoningEffortForModel`) + a synchronous CJS mirror, applied at the two command builders.

### Key Components
- `executor-config.ts` — pin predicate + effort resolver.
- `fanout-run.cjs` — mirror predicate; `buildPiLineageCommand` and `buildOpencodeLineageCommand` apply it.
- CLI catalogs — corrected reasoning claim + policy notes.

### Data Flow
Builder reads `lineage.model` + `lineage.reasoningEffort` → `effectiveEffort = isFlashMaxPinnedModel(model) ? 'max' : reasoningEffort` → maps to `--thinking`/`--variant` and records `reasoningEffort: effectiveEffort`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Helper
Add `isFlashMaxPinnedModel` + `pinReasoningEffortForModel` to `executor-config.ts`; mirror the predicate in `fanout-run.cjs`.

### Phase 2: Apply + tests
Apply the pin in the pi and opencode builders. Add helper unit tests and builder tests; update the provider-map assertion for Flash's `--thinking max`. Run vitest.

### Phase 3: Docs
Correct the cli-pi/cli-opencode catalogs; add the cli-devin policy note; add a changelog entry.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- Watch the old behavior fail: a Flash dispatch without `--thinking max`.
- Add builder tests asserting Flash → max and non-Flash → unchanged; helper unit tests for match/exclusion/effort.
- Whole-suite green on the three affected files is the authoritative gate.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `system-deep-loop/runtime` vitest toolchain.
- No compiled `dist` of `executor-config` (imported directly as `.ts`).

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Remove the pin predicate + its two builder applications and revert the doc edits. Fully reversible via git; the change is additive and small.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES
- Phase 2 depends on Phase 1 (the mirror predicate must exist before the builders call it).
- Phase 3 (docs) is independent of Phases 1–2.

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION
- Code: two small functions + two builder call-sites.
- Tests: 3 helper unit tests + 2 builder tests + 1 updated assertion.
- Docs: 3 catalogs + changelog.

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Baseline suites green before edits.
- Confirm the pin predicate excludes the devin `-max` uid.

### Rollback Procedure
`git checkout` the two source files + tests + docs, or delete the predicate and its two applications.

### Data Reversal
None — no persisted data.

<!-- /ANCHOR:l2-rollback -->
