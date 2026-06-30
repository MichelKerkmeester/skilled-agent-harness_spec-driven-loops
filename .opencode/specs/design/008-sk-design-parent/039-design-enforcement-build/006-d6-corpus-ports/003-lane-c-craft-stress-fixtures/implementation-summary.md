---
title: "Implementation Summary: Lane C craft-stress fixtures (stateful / dense / locale)"
description: "Post-build record for growing the sk-design route-gold corpus by six craft-stress scenarios (3 holdout primaries + 3 derived twins = 12 fixture files) across stateful-upload, dense-dashboard, and locale-component, the proof-fields fork resolved to the route-gold expected block (workflowMode / routeOutcome / forbiddenWorkflowModes / minimalPairGroup), the in-phase guard reconcile from 28/23 to 34/29, and the independently recomputed 34 routeRows / 29 pass / 5 known-gap / 0 regression headline that becomes the new baseline."
trigger_phrases:
  - "d6-r3 lane c craft fixtures implementation summary"
  - "craft stress fixtures route gold record"
  - "sk-design corpus 34 29 5 0 summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/003-lane-c-craft-stress-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record 6 craft-stress scenarios and the 34/29/5/0 route-gold headline"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-lane-c-craft-stress-fixtures |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverable** | Six craft-stress route-gold scenarios (12 new fixture files) under the sk-design fixture root — `stateful-upload`, `dense-dashboard`, `locale-component`, each as a T2 holdout primary plus a T1 derived twin — and the in-phase route-gold guard reconcile in `design-token-lint.vitest.ts` from `toHaveLength(28)`/`passed.toBe(23)` to `toHaveLength(34)`/`passed.toBe(29)` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-design route-gold corpus scored 28 route rows with 23 passing before this phase. The designer-skills-main source isolated three craft surfaces — component state, layout density, and localization — that sk-design covers in prose but never stressed in the benchmark. This phase converts those surfaces into gold-scored route expectations by GROWING the existing per-skill corpus in place with six new craft-stress scenarios, then reconciling the headline guard in the same phase so the corpus and its enforcement point cannot drift apart. The new headline is 34 route rows / 29 pass / 5 known-gap / 0 regression, and that tally is the baseline later phases build on.

This is additive growth, not a rewrite. The prior 23 passing rows still pass, the 5 known-gaps are unchanged, and no prior gold row flipped. The six new scenarios only added to the pass bucket.

### The six craft-stress scenarios

Three named craft surfaces each ship as a T2 holdout primary plus a T1 derived twin, so the corpus gains six scenarios across twelve fixture files (a public/private pair per scenario). `stateful-upload` exercises the component-state surface (a multi-state upload control), `dense-dashboard` exercises layout density (an information-dense dashboard), and `locale-component` exercises localization (a localized component). The T2 holdouts are the primaries; the T1 derived twins are paraphrased and decontaminated so the T1↔T2 score gap can be read as a circularity meter rather than a leak.

### The proof-fields fork, resolved to the route-gold block

The spec gestured at "proof fields", which could have meant a separate `DESIGN_BOUNDARY_PROOF` token or the existing route-gold `expected` block. The fork resolved to the route-gold block: each private fixture declares `workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, and `minimalPairGroup`, the same schema the existing corpus already uses. No new proof token was introduced. This keeps the corpus homogeneous and scored by the same per-skill `hubRoute` stage, so a new scenario routes as its gold declares and is rejected if it does not.

### The in-phase guard reconcile

`design-token-lint.vitest.ts` carries the route-gold headline guard that asserts the exact corpus tally. Because this phase added six gold rows, the guard's numerics were reconciled in the same phase: `toHaveLength(28)` became `toHaveLength(34)` and `passed.toBe(23)` became `passed.toBe(29)`. `knownGaps` stayed at 5 and `regressions` stayed at 0. This is the corpus-growth contract — a phase that adds route-gold fixtures must reconcile the headline assertion it changes, or the guard would fail on a corpus it no longer describes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `…/fixtures/sk-design/sk-design-craft-stateful-upload-holdout-001.{public,private}.json` | Created | T2 holdout: multi-state upload component; route-gold `expected` block |
| `…/fixtures/sk-design/sk-design-craft-stateful-upload-derived-001.{public,private}.json` | Created | T1 derived twin: paraphrased + decontaminated; mechanically derived gold |
| `…/fixtures/sk-design/sk-design-craft-dense-dashboard-holdout-001.{public,private}.json` | Created | T2 holdout: information-dense dashboard; route-gold `expected` block |
| `…/fixtures/sk-design/sk-design-craft-dense-dashboard-derived-001.{public,private}.json` | Created | T1 derived twin for the density surface |
| `…/fixtures/sk-design/sk-design-craft-locale-component-holdout-001.{public,private}.json` | Created | T2 holdout: localized component; route-gold `expected` block |
| `…/fixtures/sk-design/sk-design-craft-locale-component-derived-001.{public,private}.json` | Created | T1 derived twin for the locale surface |
| `…/scripts/skill-benchmark/tests/design-token-lint.vitest.ts` | Modified | Reconcile the route-gold headline guard: `toHaveLength(28)→(34)`, `passed.toBe(23)→(29)`; `knownGaps`/`regressions` unchanged at 5/0 |

The fixture root is `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/`. The existing fixtures, `score-skill-benchmark.cjs`, and `router-replay.cjs` were left untouched; the only edits were the twelve new fixture files and the single guard assertion.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 xhigh fast`) authored the twelve fixtures, set each private gold to the route-gold `expected` schema, and reconciled the headline guard from 28/23 to 34/29 in the same phase. The orchestrator then verified acceptance independently by recomputing the tally through the exact aggregate path the vitest uses, not by trusting the implementer's report: `routeRows=34`, `passed=29`, `knownGaps=5`, `regressions=0`, which matches the updated assertion. The prior 23 passing scenarios still pass, the 5 known-gaps are unchanged, and `regressions===0` because the six new scenarios only added to the pass count — none flipped a prior gold row. Every new fixture JSON parses, the scope is clean (existing fixtures, `score-skill-benchmark.cjs`, and `router-replay.cjs` untouched; only the new fixtures plus the vitest assertion), and the evergreen scan is clean. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live skill, fixture, scorer, or test file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the proof-fields fork to the route-gold `expected` block, not a `DESIGN_BOUNDARY_PROOF` token | The existing corpus already scores `workflowMode` / `routeOutcome` / `forbiddenWorkflowModes` / `minimalPairGroup` through the per-skill `hubRoute` stage; reusing that schema keeps the corpus homogeneous and avoids inventing a second proof surface that the scorer does not read |
| GROW `fixtures/sk-design/` in place rather than author a sibling corpus | The scorer's `hubRoute` gate is per-skill and the new scenarios are schema-homogeneous with the existing rows; a sibling would fragment a homogeneous corpus for no scoring benefit. "Grows the pass count, holds the 0-regression invariant" is exactly GROW semantics |
| Reconcile the headline guard in the same phase that grew the corpus | The corpus-growth contract: a phase that adds route-gold fixtures owns the headline assertion it changes. Leaving the guard at 28/23 would fail it against a corpus it no longer describes; updating it from 28/23 to 34/29 keeps the guard honest about the grown corpus |
| Treat 34/29/5/0 as the new baseline for later phases | The headline grew by exactly the six clean new passes (28→34 rows, 23→29 pass); `knownGaps` and `regressions` held at 5/0, so the tally is a stable floor later phases must preserve rather than a moving target |
| Ship each surface as a T2 holdout plus a T1 derived twin | The T1↔T2 pair publishes the score-gap circularity meter, so a large gap surfaces as a corpus finding instead of passing silently as a leak |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Headline recomputed via the vitest aggregate path | PASS, `routeRows=34`, `passed=29`, `knownGaps=5`, `regressions=0` (orchestrator-recomputed, matches the updated assertion) |
| No regression against the prior floor | PASS, the prior 23 pass rows still pass; the 5 known-gaps are unchanged; `regressions===0` — no prior gold row flipped |
| New scenarios route as their gold declares | PASS, the six new scenarios added 6 rows and 6 passes (28→34 rows, 23→29 pass) through the route-gold `expected` block |
| Guard reconciled in-phase | PASS, `design-token-lint.vitest.ts` updated `toHaveLength(28)→(34)` and `passed.toBe(23)→(29)`; `knownGaps`/`regressions` left at 5/0 |
| Every new fixture parses | PASS, all twelve fixture JSON files parse |
| Scope clean (additive only) | PASS, existing fixtures, `score-skill-benchmark.cjs`, and `router-replay.cjs` untouched; only the 12 new fixtures + the single vitest assertion changed |
| Evergreen: no spec/packet/phase IDs in fixtures | PASS, evergreen scan clean across the new fixtures |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see the GENERATED_METADATA residual below |
| GENERATED_METADATA residual (`graph-metadata.json` `source_fingerprint`, `description.json` level) | EXPECTED, the orchestrator regenerates these; the fingerprint and level drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Whether the craft scenarios are the right stress set is curation judgment.** The route-gold block proves each new scenario routes as its gold declares and that the corpus tally holds at 34/29/5/0. It cannot prove that stateful-upload, dense-dashboard, and locale-component are the *right* three craft surfaces to stress, or that the chosen prompts exercise the hardest edge of each surface. That selection stays advisory.
2. **The proof is route conformance, not design quality.** The fixtures prove the router admits each scenario to its declared `workflowMode` and avoids `forbiddenWorkflowModes`. They do not prove the routed mode bundle produces good design for that craft surface; taste is not scored.
3. **The 34/29/5/0 headline is a per-corpus floor, not a global one.** It describes the sk-design route-gold corpus only. A later phase that grows the corpus again owns its own headline reconcile under the same corpus-growth contract.
4. **GENERATED_METADATA stays stale until the orchestrator regenerates it.** `description.json` (`level: "1"`) and `graph-metadata.json` (`source_fingerprint`) are generated artifacts; this phase does not hand-write them, so `validate.sh --strict` reports them as an expected residual until a metadata save runs.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Additive corpus growth: 6 craft-stress route-gold scenarios (12 fixtures) across stateful-upload, dense-dashboard, locale-component (3 T2 holdout + 3 T1 derived)
- Proof-fields fork resolved to the route-gold expected block (workflowMode / routeOutcome / forbiddenWorkflowModes / minimalPairGroup), NOT a DESIGN_BOUNDARY_PROOF token
- Headline grown 28/23 → 34/29 with knownGaps 5 / regressions 0; guard reconciled in-phase (corpus-growth contract); 34/29/5/0 is the new baseline
- Independently recomputed via the vitest aggregate path; prior 23 still pass, 0 regressions; scope clean (fixtures + the one vitest assertion); GENERATED_METADATA regenerated by the orchestrator
-->
