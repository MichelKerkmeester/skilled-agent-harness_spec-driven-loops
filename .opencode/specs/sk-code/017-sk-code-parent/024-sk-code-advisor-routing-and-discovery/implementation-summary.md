---
title: "Implementation Summary: sk-code advisor-routing discovery + Lane-C D3 proxy fix"
description: "Executed summary for the sk-code-local routing discovery increment shipped in commit ec014f95c6: CWV and accessibility smart-routing coverage, router replay acronym boundaries, D3 empty-gold not-applicable scoring, schema doc refresh, playbook path repairs, benchmark reports, limitations, and downstream boundaries."
trigger_phrases:
  - "phase 24 implementation summary"
  - "sk-code advisor routing discovery summary"
  - "Lane-C D3 proxy summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/024-sk-code-advisor-routing-and-discovery"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Close-out recorded for ec014f95c6"
    next_safe_action: "None; implementation packet is shipped and pushed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-024-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Is this packet complete?"
        answer: "Yes. The sk-code-local routing discovery increment and D3 proxy fix shipped and were pushed in commit ec014f95c6."
      - question: "What remains deferred?"
        answer: "Shared advisor-scorer root fixes, advisor projection-vocabulary work, CS-007 JavaScript trigger expansion, and sk-design's resource-gold measurement gap remain downstream or out of scope."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-sk-code-advisor-routing-and-discovery |
| **Status** | Complete |
| **Level** | 2 |
| **Actual Effort** | One pushed implementation increment in commit `ec014f95c6`; retrospective close-out docs record the shipped scope and evidence |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 024 shipped the sk-code-local, advisor-scorer-independent Layer 1 routing increment in commit `ec014f95c6`. It expanded smart-routing intent coverage so CWV and accessibility prompts fire existing RESOURCE_MAP references, constrained short CWV acronyms in router replay to word-boundary matching, made D3 not-applicable when a scenario has no positive-resource gold, refreshed the parent-hub router schema doc to the current sk-code four-mode surface-primary model, repaired dead expected-asset paths in two cross-stack playbooks, regenerated sk-code `router-final`, and wrote new sibling benchmark reports for sk-design and deep-loop-workflows.

### Files Changed

| File | Action | Purpose | Commit |
|------|--------|---------|--------|
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Updated | Add CWV PERFORMANCE vocabulary, new ACCESSIBILITY intent, and MOTION_DEV cross-listing against existing RESOURCE_MAP references | `ec014f95c6` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Updated | Add `lcp`, `inp`, and `cls` to WORD_BOUNDARY_KEYWORDS so short acronyms match only on word boundaries | `ec014f95c6` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Updated | Return null/not-applicable D3 for scenarios with no positive-resource gold and exclude null D3 from mode A weighted normalization | `ec014f95c6` |
| `.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md` | Updated | Refresh stale sk-code worked example to workflow modes `quality` and `code-review`, surface packets `code-webflow` and `code-opencode`, and `defaultMode: null` | `ec014f95c6` |
| `.opencode/skills/sk-code/manual_testing_playbook/cross-stack-routing/cwv-gates-animation-heavy.md` | Updated | Reconcile dead expected-asset paths to real on-disk homes | `ec014f95c6` |
| `.opencode/skills/sk-code/manual_testing_playbook/cross-stack-routing/prefers-reduced-motion.md` | Updated | Reconcile dead expected-asset paths to real on-disk homes | `ec014f95c6` |
| `.opencode/skills/sk-code/benchmark/router-final/` | Regenerated | Record current/regenerable sk-code router-mode benchmark after routing discovery and D3 changes | `ec014f95c6` |
| `.opencode/skills/sk-design/benchmark/after-d3-proxy/` | Added | Record sibling benchmark report after D3 proxy fix while preserving frozen `baseline/` | `ec014f95c6` |
| `.opencode/skills/deep-loop-workflows/benchmark/after-d3-proxy/` | Added | Record sibling benchmark report after D3 proxy fix while preserving frozen `baseline/` | `ec014f95c6` |
| `spec.md` | Added | Record retrospective specification for packet 024 | close-out doc |
| `plan.md` | Added | Record retrospective implementation plan, gates, dependencies, rollback, and effort for packet 024 | close-out doc |
| `tasks.md` | Added | Record completed task ledger and completion criteria with evidence | close-out doc |
| `checklist.md` | Added | Record Level 2 verification checklist and scoped deferrals/deviations | close-out doc |
| `implementation-summary.md` | Added | Record final status, files changed, verification, limitations, and deviations | close-out doc |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet shipped in commit `ec014f95c6` on branch `system-speckit/028-memory-search-intelligence`. The sk-code smart-routing block was updated first so CWV and accessibility vocabulary fired existing RESOURCE_MAP references rather than inventing new resource paths. Router replay then received word-boundary matching for `lcp`, `inp`, and `cls`, and the skill benchmark scorer was updated so D3 is null/not-applicable when positive-resource gold is empty.

The documentation and artifact layer was reconciled in the same increment. The sk-doc parent-hub schema example was refreshed to the current sk-code surface-primary model, two cross-stack playbooks were repaired to point at real expected-asset paths, sk-code `benchmark/router-final` was regenerated as its README-documented current folder, and sk-design plus deep-loop-workflows wrote `after-d3-proxy/` sibling reports instead of overwriting frozen baselines.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Fix keyword coverage rather than add resources | The needed references already existed in RESOURCE_MAP; failing prompts did not fire the right intents |
| Treat `lcp`, `inp`, and `cls` as word-boundary keywords | Short acronyms are prone to substring false positives, especially `inp` inside `input` |
| Return null D3 for empty positive-resource gold | Empty expectations cannot define routed-resource waste; scoring zero was a measurement artifact |
| Exclude null D3 from mode A normalization | This follows the same not-applicable convention already used by D1-inter |
| Preserve frozen benchmark baselines | sk-design and deep-loop-workflows READMEs define `baseline/` as frozen and instruct adding sibling folders for new baselines |
| Leave CS-007 at honest 6/7 recall | Adding a JavaScript trigger would re-route every Webflow `.js` scenario and trimming gold would read as gaming |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:blockers -->
## Blockers

None for this packet. Commit `ec014f95c6` shipped and pushed the sk-code-local routing discovery updates, D3 scoring fix, schema doc refresh, playbook path repairs, and benchmark reports. Remaining items are scoped downstream or pre-existing findings: the shared advisor-scorer root fix and advisor projection-vocabulary work are planned for a separate packet, CS-007 remains 6/7 by deliberate blast-radius control, sk-design resource gold is a measurement gap, and two sk-design-lane failures were isolated as pre-existing outside this packet.

<!-- /ANCHOR:blockers -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Evidence |
|-----------|--------|----------|----------|
| sk-code router-mode benchmark | Pass | Routing discovery and D3 effects | aggregate 71 to 84; verdict CONDITIONAL to PASS; D1intra 87 to 91; D2 79 to 85; D3 47 to 68; D5 100 unchanged; CS-006 D2 recall 0.375 to 1.0; CS-007 D2 recall 0.43 to 0.86; zero scenarios regressed below 50 |
| sk-design after-d3-proxy | Pass | D3 empty-gold proxy removal | benchmark score 69 to 100; old score reproduced by `(100*13+100*20+0*15)/48 = 69` because D1intra and D2 were already 100 |
| deep-loop-workflows after-d3-proxy | Pass | D3 empty-gold proxy removal | benchmark score 71 to 100 |
| Parent hub strict invariants | Pass | sk-code parent hub | sk-code parent-skill-check STRICT reported 0 |
| Vocabulary sync | Pass | sk-code routing vocabulary | vocab-sync exited 0 and sk-code `hub-router.json` was unchanged |
| Router drift guards | Pass | sk-code router sync and surface slice sync | router drift-guards passed 8/8 |
| Skill-benchmark vitest suite | Pass | Benchmark harness | skill-benchmark vitest suite reported 106/107 |
| Markdown links | Pass | Four changed docs | markdown-links clean on all four changed docs |
| Schema JSON examples | Pass | Refreshed parent-hub schema doc | all six JSON examples in the refreshed schema doc parse |

### Test Coverage Summary

| Area | Result |
|------|--------|
| Discovery routing | CWV and accessibility vocabulary now fire existing RESOURCE_MAP references |
| Acronym matching | `lcp`, `inp`, and `cls` use word-boundary handling in router replay |
| D3 scoring | Empty positive-resource gold is not-applicable and excluded from mode A normalization |
| Benchmark artifacts | sk-code `router-final` regenerated; sk-design and deep-loop-workflows `after-d3-proxy/` reports added |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Discovery fixes use existing RESOURCE_MAP paths | CWV and ACCESSIBILITY updates route to references already present in `smart_routing.md` | Pass |
| NFR-M01 | Frozen baselines are preserved | sk-design and deep-loop-workflows wrote new `after-d3-proxy/` sibling folders and left `baseline/` intact | Pass |
| NFR-S01 | Advisor-scorer lane is not disturbed | Downstream scorer changes under `system-skill-advisor/mcp_server/lib/scorer/*.ts` remain out of scope | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. CS-007 recall is 6/7 (0.86), not 1.0. Its seventh gold reference, `code-webflow/references/javascript/quality_standards.md`, is unroutable for the accessibility-framed prompt because LANGUAGE_STANDARDS has no JavaScript trigger. The packet left this as honest 6/7 rather than trimming gold or adding a broad JS trigger.
2. sk-design router-mode benchmark carries no resource gold, so D3 is uniformly not-applicable and the resulting 100 is largely vacuous. This is a pre-existing measurement gap exposed by the D3 fix.
3. Two sk-design-lane failures were isolated as pre-existing: parent-skill-check STRICT failure for child directory `feature_catalog` neither registered nor allowlisted, and design-token-lint vitest headline drift from 25 to 29 hub-route pass. They reproduce on the origin harness with this packet's edits reverted.
4. Shared advisor-scorer root fixes and advisor projection-vocabulary work are downstream of this packet and require a separate 193-row advisor corpus re-baseline.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Re-baseline `sk-design/benchmark/baseline` and `deep-loop-workflows/benchmark/baseline` | Wrote `sk-design/benchmark/after-d3-proxy` and `deep-loop-workflows/benchmark/after-d3-proxy` sibling folders; frozen `baseline/` folders were left intact | Each benchmark README documents `baseline/` as a frozen comparison anchor and instructs adding new baselines as sibling folders |
| Fold shared advisor-scorer root fix into the same lane | Deferred to downstream packet `028/003-skill-advisor/010-scorer-saturation-root-fix` | Scorer edits touch `system-skill-advisor/mcp_server/lib/scorer/*.ts`, the live agent's actively-worked 009 dispatch-hardening lane, and require a full 193-row advisor corpus re-baseline |
| Make CS-007 recall 1.0 | Left CS-007 at 6/7 recall | Adding a JavaScript trigger would re-route every Webflow `.js` scenario; trimming gold would misrepresent the benchmark |

<!-- /ANCHOR:deviations -->
