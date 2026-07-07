---
title: "Feature Specification: sk-code playbook gold refresh + Lane-C re-baseline"
description: "The sk-code manual_testing_playbook gold still named resources by the pre-013 monolithic references/{motion_dev,webflow,opencode}/ layout, while the surfaces now live under code-<surface>/ packet folders. With the benchmark harness made code-*-aware (surface-slicing + scenario loader), this packet translates the stale gold paths to the code-<surface>/ layout and regenerates the deterministic router-final baseline, restoring the benchmark to an honest verdict."
trigger_phrases:
  - "sk-code playbook gold rebaseline"
  - "lane-c router-final regenerate"
  - "playbook gold code-surface translation"
importance_tier: "high"
contextType: "general"
parent: "skilled-agent-orchestration"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Playbook gold translated to code-<surface>/; router-final regenerated to CONDITIONAL 71"
    next_safe_action: "Close out, push; benchmark re-baseline complete"
---
# Feature Specification: sk-code playbook gold refresh + Lane-C re-baseline

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
The sk-code `manual_testing_playbook` scenarios assert an expected-resource gold — the references and assets a correct route should load for each prompt. That gold still named resources by the pre-013 monolithic layout (`references/motion_dev/…`, `references/webflow/…`, `references/opencode/…`), even though the two-axis split moved every per-surface resource under `code-webflow/`, `code-opencode/`, and `code-animation/` packet folders and the smart router's `RESOURCE_MAP` was updated to match. Because the gold pointed at paths the corrected router never emits, the deterministic Lane-C benchmark could not credit any surface scenario, and the committed router-final baseline no longer reflected a fresh run. This is the follow-up to the two harness fixes (surface-slicing sync and the scenario-loader code-<surface>/ parse) that had to land first for the gold to be measurable.

### Purpose
Translate the stale gold paths in the playbook scenarios to the current `code-<surface>/` layout (preserving each scenario's curated resource set — a path refresh, not a re-curation) and regenerate the deterministic `benchmark/router-final/` baseline so the benchmark reports an honest, current verdict.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Translate every stale `references/{motion_dev,webflow,opencode}/` and `assets/{…}` gold path in the playbook scenarios to its `code-<surface>/` location (a deterministic prefix mapping; every translated path verified to exist on disk).
- Regenerate `benchmark/router-final/` (the deterministic CI-gate run) against the corrected harness and refreshed gold.
- Update the benchmark README's stale "latest router verdict" line to the regenerated result.

### Out of Scope
- The frozen `benchmark/baseline/` snapshot (kept as the pre-optimization before-picture, never regenerated).
- The two harness fixes this depends on (surface-slicing sync and the scenario-loader parse) — landed as their own packets.
- Re-curating each scenario's intended resource set or closing the residual gold-vs-router recall gap (a real but separate signal; this packet only refreshes stale paths).
- The live-mode re-baseline (needs a configured provider; router mode is the deterministic CI gate) and the pre-existing, unrelated harness `intents` test.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/manual_testing_playbook/**/*.md` | Modify | Translate stale gold/forbidden/source paths to the code-<surface>/ layout |
| `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.{json,md}` | Modify | Regenerated deterministic baseline |
| `.opencode/skills/sk-code/benchmark/README.md` | Modify | Refresh the stale latest-router-verdict statistic |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Gold uses the code-<surface>/ layout | No playbook scenario retains a `references/{motion_dev,webflow,opencode}/` or `assets/{…}/` gold path; every translated path exists on disk | problem |
| REQ-002 | router-final regenerated to an honest verdict | The deterministic router-mode run writes a fresh `router-final/` report and the recorded verdict matches the run | purpose |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-003 | No cross-surface leak; hard gate passes | The corrected router routes no scenario to both surfaces at once; D5 connectivity is 100/100 | scope |
| REQ-004 | README statistic refreshed | The benchmark README's latest-router-verdict line matches the regenerated router-final | scope |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-005 | Residual recall gap recorded | The gold-vs-router recall is reported honestly (not forced to 100%) so the residual curation gap is visible for a future pass | out-of-scope note |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero stale gold paths remain in the playbook. [EVIDENCE: post-translation grep for references/{motion_dev,webflow,opencode}/ + assets/{…}/ returns 0 files; 71 translated paths all verified to exist on disk]
- **SC-002**: router-final regenerated with an honest verdict. [EVIDENCE: router-mode run = CONDITIONAL, aggregate 71/100 (D1-intra 87, D2 79, D3 47, D5 100); recovers the pre-regression baseline]
- **SC-003**: No cross-surface leak; gold-recall reported honestly. [EVIDENCE: 0 cross-surface leaks; gold-recall 65/99 = 66% — a real value, not overfit to 100%]

### Acceptance Scenarios

- **Scenario 1**: **Given** the harness is code-<surface>/-aware, **when** the translated gold is parsed and scored, **then** discovery/recall rises materially over the pre-fix baseline and the verdict recovers to CONDITIONAL.
- **Scenario 2**: **Given** the frozen baseline contract, **when** the re-baseline runs, **then** only `router-final/` is regenerated and `baseline/` is left untouched.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Path translation produces a non-existent path | Dead gold route | Every one of the 71 translated paths was existence-checked against the skill + packet roots before applying |
| Risk | Regenerating the frozen baseline by mistake | Loss of before-picture | Only `router-final/` is regenerated; `baseline/` is never written |
| Dependency | Harness surface-slicing + scenario-loader code-<surface>/ fixes | Gold unmeasurable without them | Both landed as their own packets before this ran |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The re-baseline is deterministic (router mode, offline), so the recorded verdict is reproducible from the same inputs.

### Maintainability
- **NFR-M01**: The gold refresh is a pure path translation preserving each scenario's curated set, so scenario intent is unchanged and future diffs stay legible.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Universal-tier gold (`references/universal/*`, `references/stack_detection.md`, `references/smart_routing.md`) is intentionally left unchanged — it is not surface-scoped.

### Error Scenarios
- The residual gold-vs-router recall gap (66%, not 100%) is a genuine signal that a scenario's curated set differs from the router's focused route; it is reported, not hidden by regenerating gold from the router.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Deterministic path translation across the playbook + one baseline regen |
| Risk | 8/25 | Gold defines pass/fail; mitigated by existence-checks + honest recall reporting |
| Research | 8/20 | Translation validated end-to-end before applying |
| **Total** | **26/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The residual recall gap and the live-mode re-baseline are recorded as separate, optional follow-ups.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Harness dependencies**: `system-deep-loop/036-router-replay-surface-slice-sync`, `system-deep-loop/037-scenario-loader-code-surface-sync`
- **Corpus refreshed**: `.opencode/skills/sk-code/manual_testing_playbook/`
- **Baseline regenerated**: `.opencode/skills/sk-code/benchmark/router-final/`

<!-- /ANCHOR:related-docs -->
