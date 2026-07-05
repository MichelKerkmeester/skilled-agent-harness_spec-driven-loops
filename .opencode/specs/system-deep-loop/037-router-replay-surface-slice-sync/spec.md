---
title: "Feature Specification: Sync router-replay surface-slicing to the code-<surface>/ packet layout"
description: "The Lane-C router-replay harness sliced sk-code resources by pre-rename bare surface prefixes (webflow/, opencode/, animation/), but the surfaces now live under code-<surface>/ packet folders. hasSurfaceLayout therefore evaluated false, surface-slicing silently went dead, and single-surface tasks over-routed the whole cross-surface union — the benchmark measured a broken router, contradicting the smart router's documented route-time slicing contract. This packet re-syncs the three slicing prefix sites to the code-<surface>/ layout and adds a regression guard."
trigger_phrases:
  - "router-replay surface slice sync"
  - "skill-benchmark surface slicing"
  - "code-webflow code-opencode surface prefix"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-router-replay-surface-slice-sync"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Slicing prefixes re-synced to code-<surface>/; regression guard added; harness vitests green"
    next_safe_action: "Close out, push; unblocks the sk-code gold alignment + Lane-C re-baseline (021)"
---
# Feature Specification: Sync router-replay surface-slicing to the code-<surface>/ packet layout

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
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Lane-C deterministic router-replay (`deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`) slices a single-surface sk-code task down to only its detected surface's resources, so the benchmark can measure route-time loading discipline (the D3 efficiency dimension). That slicing keys on the surface's on-disk path prefix. sk-code's surfaces were renamed to sibling packet folders — `code-webflow/`, `code-opencode/`, `code-animation/` — and the smart router's `RESOURCE_MAP` was updated to match, but the harness's slicing constants stayed on the pre-rename bare prefixes (`webflow/`, `opencode/`, `animation/`). As a result `hasSurfaceLayout` (which requires both `code-webflow/references/` and `code-opencode/references/` prefixes in the map) permanently evaluated false, surface-slicing went dead, and single-surface tasks over-routed the entire cross-surface union. The benchmark was measuring a broken, over-routing router — directly contradicting the route-time slicing rule the smart router documents ("The deterministic router-replay enforces the same rule, so the benchmark measures it").

### Purpose
Re-sync the three prefix sites in `router-replay.cjs` to the `code-<surface>/` packet layout so surface-slicing is restored, and add a regression guard so a future folder rename cannot silently break it again. This is a targeted harness-correctness fix; aligning the sk-code playbook gold to the now-correctly-sliced router and re-baselining Lane-C is a separate follow-up packet.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update the three resource-path prefix sites in `router-replay.cjs`: `SURFACE_PREFIXES`, the `hasSurfaceLayout` detection, and the OpenCode language sub-slice regex — from bare prefixes to `code-webflow/`, `code-opencode/`, `code-animation/`.
- Add a regression guard test (`tests/surface-slice-sync.vitest.ts`) locking the no-cross-surface-leak invariant and the code-<surface>/ slicing behavior.
- Verify no regression to the existing harness vitest suite and that surface-slicing is restored (over-routing eliminated).

### Out of Scope
- Aligning the sk-code `manual_testing_playbook` gold to the corrected router and regenerating `benchmark/router-final/` (the sk-code re-baseline is the separate follow-up packet).
- The pre-existing, unrelated harness test failure asserting `res.intents` contains `implement` (an intent/mode-projection expectation now stale because `hub-router.json` scores the `code-webflow` packet signal over the `implement` mode for a Webflow task) — a different subsystem, not surface-slicing.
- The task-text surface/language detectors (`detectSurface`, `detectOpencodeLanguage`), which key on prompt tokens, not resource-folder names, and are correct as-is.
- Any change to other benchmarked skills (`hasSurfaceLayout` requires both `code-webflow/` and `code-opencode/` prefixes, which only sk-code's map carries).

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | Re-sync the three slicing prefix sites to the code-<surface>/ layout |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts` | Create | Regression guard for the no-cross-surface-leak / code-<surface>/ slicing invariant |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Slicing keys on the code-<surface>/ layout | `SURFACE_PREFIXES`, `hasSurfaceLayout`, and the OpenCode language regex reference `code-webflow/`, `code-opencode/`, `code-animation/`; `hasSurfaceLayout` evaluates true against the current RESOURCE_MAP | problem |
| REQ-002 | Surface-slicing restored (no over-routing) | No scored, non-browser playbook scenario routes both `code-webflow/` and `code-opencode/` resources at once | purpose |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-003 | Regression guard added and green | `tests/surface-slice-sync.vitest.ts` asserts single-surface slicing + no corpus-wide cross-surface leak, and passes | scope |
| REQ-004 | No new harness-test regressions | The skill-benchmark vitest suite shows no failure introduced by this change relative to the captured baseline | scope |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-005 | Capture the honest post-slicing sk-code baseline | The post-fix sk-code router-mode aggregate is recorded as the starting baseline for the follow-up gold-alignment packet | follow-up handoff |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three prefix sites reference the code-<surface>/ layout and `hasSurfaceLayout` is active. [EVIDENCE: router-replay.cjs SURFACE_PREFIXES/hasSurfaceLayout/OpenCode-regex updated to code-webflow|code-opencode|code-animation]
- **SC-002**: Over-routing is eliminated across the sk-code corpus. [EVIDENCE: per-scenario leak diagnostic 13/21 → 0/21 after the fix]
- **SC-003**: The regression guard passes and the harness suite shows no new failure. [EVIDENCE: baseline 1 failed / 100 passed → post-fix 1 failed / 104 passed; the single failure is the same pre-existing, out-of-scope intents assertion]

### Acceptance Scenarios

- **Scenario 1**: **Given** a WEBFLOW-surface task, **when** router-replay routes it, **then** the result contains `code-webflow/` resources and no `code-opencode/` resources.
- **Scenario 2**: **Given** an UNKNOWN-surface Motion.dev decision task, **when** router-replay routes it, **then** it keeps the `code-animation/` overlay and drops both surface slices.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Prefix change alters other skills' benchmark scoring | Unintended cross-skill regression | `hasSurfaceLayout` gate requires both `code-webflow/` + `code-opencode/` prefixes, which only sk-code's map carries; full suite re-run confirms no new failures |
| Risk | Stale gold masks the fix in the aggregate score | Fix looks ineffective | Prove the fix by the direct leak diagnostic + guard test, not the gold-limited aggregate |
| Dependency | Downstream sk-code gold alignment + re-baseline | Blocked until this lands | Sequenced as the follow-up packet against the corrected router |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The slicing behavior is locked by a deterministic, offline regression test so the invariant survives future renames.

### Maintainability
- **NFR-M01**: The fix keeps the durable rationale in a comment (surfaces live under code-<surface>/ packet folders) without embedding ephemeral artifact identifiers.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- A MIXED task (both `.opencode/` and Webflow markers) legitimately keeps both surface slices; the guard checks single-surface scenarios only.

### Error Scenarios
- If a future rename moves the surface folders again, `hasSurfaceLayout` would go false and the guard's corpus-wide leak assertion fails loudly instead of silently over-routing.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Three prefix sites + one guard test |
| Risk | 12/25 | Shared harness code affecting benchmark scoring; mitigated by the gate + full suite re-run |
| Research | 6/20 | Root cause diagnosed against the real replay output |
| **Total** | **24/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The sk-code gold alignment + Lane-C re-baseline proceeds as the follow-up packet against the corrected router.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Harness under repair**: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- **Documented slicing contract**: `.opencode/skills/sk-code/shared/references/smart_routing.md` (§ Surface-aware loading)
- **Follow-up**: sk-code playbook gold alignment + Lane-C re-baseline

<!-- /ANCHOR:related-docs -->
