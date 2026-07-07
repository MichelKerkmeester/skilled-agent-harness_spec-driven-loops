---
title: "Feature Specification: sk-code advisor-routing discovery + Lane-C D3 proxy fix"
description: "Layer 1 sk-code-local, advisor-scorer-independent routing increment: smart-routing discovery vocabulary for CWV and accessibility prompts, router replay acronym boundaries, Lane-C D3 not-applicable scoring, parent-hub router schema correction, playbook expected-asset path repairs, and regenerated benchmark reports. Shipped and pushed in commit ec014f95c6."
trigger_phrases:
  - "sk-code advisor routing discovery"
  - "Lane-C D3 proxy fix"
  - "CWV accessibility smart routing"
importance_tier: "high"
contextType: "general"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/024-sk-code-advisor-routing-and-discovery"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Retrospective scope authored for pushed commit ec014f95c6"
    next_safe_action: "None; packet implementation is complete and pushed"
---
# Feature Specification: sk-code advisor-routing discovery + Lane-C D3 proxy fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two sk-code discovery scenarios failed because the references they needed already existed in `sk-code/shared/references/smart_routing.md` RESOURCE_MAP, but the prompts did not fire the intents that map to those references. The PERFORMANCE intent lacked CWV acronyms and phrase vocabulary (`lcp`, `inp`, `cls`, `web vitals`, `interaction to next paint`, `cumulative layout shift`), and there was no ACCESSIBILITY intent for reduced-motion and a11y vocabulary. In parallel, Lane-C D3 efficiency scoring treated scenarios with no positive-resource gold as if every routed resource were waste, producing spurious 0 scores for empty expectations.

### Purpose
Ship the sk-code-local, advisor-scorer-independent Layer 1 routing increment in commit `ec014f95c6`: expand smart-routing discovery vocabulary for CWV and accessibility prompts, make short CWV acronyms match on word boundaries in router replay, make D3 not-applicable when a scenario has no positive-resource gold, refresh stale parent-hub router schema documentation to the current four-mode surface-primary model, repair dead expected-asset paths in two sk-code playbook scenarios, and regenerate benchmark reports in the documented current or sibling result folders.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `sk-code/shared/references/smart_routing.md` with a machine-readable INTENT_SIGNALS/RESOURCE_MAP router block that adds CWV vocabulary to PERFORMANCE, adds ACCESSIBILITY vocabulary for reduced motion and a11y prompts, maps ACCESSIBILITY to existing Webflow animation and verification references, and cross-lists `animation/performance_and_pitfalls.md` into MOTION_DEV.
- Update `deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` so `lcp`, `inp`, and `cls` are treated as WORD_BOUNDARY_KEYWORDS; this prevents `inp` from substring-firing on `input`.
- Update `deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` so D3 returns null/not-applicable when a scenario declares no positive-resource gold, and mode A weighted normalization excludes null D3 using the same convention as D1-inter.
- Refresh `sk-doc/references/skill_creation/parent_hub_router_schema.md` from the stale five-mode sk-code worked example to the current surface-primary two-axis model with workflow modes `quality` and `code-review`, surface packets `code-webflow` and `code-opencode`, and `defaultMode: null`.
- Repair the two sk-code manual playbook scenarios `cwv-gates-animation-heavy.md` and `prefers-reduced-motion.md` by replacing three dead expected-asset paths with their real on-disk homes.
- Regenerate `sk-code/benchmark/router-final` and write new sibling benchmark reports `sk-design/benchmark/after-d3-proxy` and `deep-loop-workflows/benchmark/after-d3-proxy`.

### Out of Scope
- Shared advisor-scorer root fixes in `system-skill-advisor/mcp_server/lib/scorer/*.ts`, including WS1 post-cap penalty-demotion, WS2 executor-delegation resolver, WS3 TypeScript/Python parity re-baseline, WS4 graph-causal BFS fix, WS5 eval-gate hardening, and WS6 semantic-shadow ablation.
- Advisor projection-vocabulary edits to sk-code graph metadata, sk-code SKILL frontmatter, and deep-loop-workflows advisor metadata.
- The full 193-row advisor corpus re-baseline required by downstream scorer work.
- Any work in the actively-worked advisor TypeScript lane; downstream scope is planned separately as `028/003-skill-advisor/010-scorer-saturation-root-fix`.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Modify | Add CWV PERFORMANCE vocabulary, new ACCESSIBILITY intent, and MOTION_DEV cross-listing |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | Add `lcp`, `inp`, and `cls` to WORD_BOUNDARY_KEYWORDS |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Return null/not-applicable D3 for scenarios with no positive-resource gold and exclude null D3 from weighted normalization |
| `.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md` | Modify | Refresh sk-code worked example and allow `defaultMode: null` for surface-primary hubs |
| `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/cwv-gates-animation-heavy.md` | Modify | Reconcile dead expected-asset paths to real homes |
| `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/prefers-reduced-motion.md` | Modify | Reconcile dead expected-asset paths to real homes |
| `.opencode/skills/sk-code/benchmark/router-final/` | Regenerate | Current/regenerable sk-code router benchmark report |
| `.opencode/skills/sk-design/benchmark/after-d3-proxy/` | Add | Sibling report preserving frozen `baseline/` |
| `.opencode/skills/deep-loop-workflows/benchmark/after-d3-proxy/` | Add | Sibling report preserving frozen `baseline/` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Discovery vocabulary fires existing resources | CWV prompts fire PERFORMANCE; accessibility/reduced-motion prompts fire ACCESSIBILITY; mapped resources are existing paths in `smart_routing.md` | problem |
| REQ-002 | Short CWV acronyms do not substring-fire | `lcp`, `inp`, and `cls` are word-boundary keywords in router replay, preventing `inp` from matching `input` | scope |
| REQ-003 | D3 handles empty positive-resource gold | D3 is null/not-applicable when a scenario declares no positive-resource gold; mode A excludes null D3 from normalization and diagnostics guard null | scope |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-004 | Parent hub router schema doc matches current sk-code model | Worked example uses workflow modes `quality` and `code-review`, surface packets `code-webflow` and `code-opencode`, and `defaultMode: null` | scope |
| REQ-005 | Manual playbook expected assets resolve | The two changed cross-stack routing playbooks point to `shared/references/`, `code-review/assets/`, and `code-webflow/assets/webflow-verification_checklist.md` as appropriate | scope |
| REQ-006 | Benchmarks record the shipped effects | sk-code `router-final` is regenerated; sk-design and deep-loop-workflows write `after-d3-proxy/` sibling reports without overwriting frozen baselines | scope |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-007 | Downstream scorer work remains isolated | Advisor-scorer and advisor projection-vocabulary work is documented as downstream/out of scope and not folded into this packet | scope |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-code router-mode benchmark improves from aggregate 71 / CONDITIONAL to aggregate 84 / PASS, with D1intra 87 to 91, D2 79 to 85, D3 47 to 68, D5 100 unchanged, CS-006 D2 recall 0.375 to 1.0, CS-007 D2 recall 0.43 to 0.86, and zero scenarios regressed below 50. [EVIDENCE: commit `ec014f95c6` benchmark report]
- **SC-002**: D3 empty-gold proxy removal is reflected by sibling reports: sk-design 69 to 100 and deep-loop-workflows 71 to 100. [EVIDENCE: `sk-design/benchmark/after-d3-proxy`, `deep-loop-workflows/benchmark/after-d3-proxy`]
- **SC-003**: Gates are green. [EVIDENCE: sk-code parent-skill-check STRICT 0; vocab-sync exit 0; router drift-guards 8/8; skill-benchmark vitest suite 106/107; markdown-links clean on all four changed docs; all six JSON examples in the refreshed schema doc parse; validate.sh --strict exit 0]

### Acceptance Scenarios

- **Scenario 1**: **Given** a CWV-heavy Webflow performance prompt, **when** smart routing evaluates intent signals, **then** PERFORMANCE fires from CWV vocabulary and routes to the existing performance resources without adding new resource paths.
- **Scenario 2**: **Given** a reduced-motion accessibility prompt, **when** smart routing evaluates intent signals, **then** ACCESSIBILITY fires and maps to the existing Webflow animation performance, animation workflow, and verification workflow references.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `inp` can match inside `input` if treated as a substring keyword | False positive performance intent routing | Add `inp` to WORD_BOUNDARY_KEYWORDS with `lcp` and `cls` |
| Risk | D3 can punish skills with no positive-resource gold | Spurious 0 efficiency score and misleading benchmark delta | Return null/not-applicable and exclude null D3 from weighted normalization |
| Risk | Frozen benchmark baselines could be overwritten | Loss of comparison anchors | Follow benchmark READMEs: create `after-d3-proxy/` sibling folders for sk-design and deep-loop-workflows |
| Dependency | Advisor TypeScript lane | Downstream scorer root fix must wait for lane quiet | Keep this packet limited to sk-code-local, advisor-scorer-independent changes |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Discovery fixes must use existing RESOURCE_MAP paths; the root cause is keyword coverage, not missing resources.

### Maintainability
- **NFR-M01**: Benchmark baselines must follow each benchmark README's artifact convention: overwrite only the documented current/regenerable sk-code `router-final/`, and preserve frozen `baseline/` directories through sibling result folders.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Scenarios with no positive-resource gold are valid measurement inputs; D3 must be absent from the weighted denominator rather than treated as zero.

### Error Scenarios
- If CS-007 remains at 6/7 recall, do not trim gold or add a broad JavaScript trigger inside this packet; the missing JavaScript trigger has disproportionate blast radius and is a deferred follow-up.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Crosses sk-code smart routing, deep-loop benchmark scoring/replay, sk-doc schema docs, two playbooks, and benchmark artifacts |
| Risk | 13/25 | Routing vocabulary and scoring changes affect benchmark interpretation, but stay advisor-scorer-independent |
| Research | 8/20 | Root cause, benchmark conventions, and downstream boundaries were identified from existing files and reports |
| **Total** | **37/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. Downstream advisor-scorer root fixes and advisor projection-vocabulary work are explicitly out of scope for this packet and planned separately.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent hub**: `.opencode/skills/sk-code/`
- **Commit**: `ec014f95c6`
- **Downstream packet**: `028/003-skill-advisor/010-scorer-saturation-root-fix`

<!-- /ANCHOR:related-docs -->
