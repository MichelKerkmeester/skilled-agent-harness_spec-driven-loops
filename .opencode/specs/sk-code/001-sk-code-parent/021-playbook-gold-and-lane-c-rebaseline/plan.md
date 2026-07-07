---
title: "Implementation Plan: sk-code playbook gold refresh + Lane-C re-baseline"
description: "Forward-looking Level 2 plan for translating stale sk-code playbook gold paths to the code-<surface>/ packet layout, regenerating router-final, and recording the honest residual recall signal."
trigger_phrases:
  - "phase 21 playbook gold plan"
  - "sk-code playbook gold rebaseline plan"
  - "lane-c router-final plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Gold paths translated; router-final regenerated to CONDITIONAL 71"
    next_safe_action: "Run close-out validation; push remains pending"
---
# Implementation Plan: sk-code playbook gold refresh + Lane-C re-baseline

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook scenarios, JSON/Markdown benchmark reports, deterministic router trace mode |
| **Framework** | sk-code two-axis parent hub, manual testing playbook, Lane-C router benchmark |
| **Storage** | Repository filesystem: `.opencode/skills/sk-code/manual_testing_playbook/`, `.opencode/skills/sk-code/benchmark/router-final/`, benchmark README, and phase docs |
| **Testing** | Stale-path grep, translated-path existence checks, offline router-final regeneration, leak check, recall comparison, strict spec validation at close-out |

### Overview
This phase completes the third and final piece of the sk-code benchmark recovery. The two-axis rename left the benchmark harness broken in two places and the playbook gold stale. The harness fixes landed first as separate packets for router-replay surface slicing and scenario-loader `code-<surface>/` parsing. This packet performs the gold work those fixes unblocked: translate stale playbook gold paths from the pre-013 monolithic layout to the current `code-<surface>/` packet layout, regenerate the deterministic `benchmark/router-final/` baseline, refresh the benchmark README statistic, and record the honest residual gold-vs-router recall gap instead of hiding it.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 021 spec defines the gold-refresh scope, out-of-scope boundaries, REQ-001 through REQ-005, SC-001 through SC-003, risks, and edge cases.
- [x] Harness dependency packets 037 and 038 landed first, making router-replay surface slicing and scenario-loader `code-<surface>/` parsing measurable.
- [x] The path translation is deterministic: `references/motion_dev/` and `assets/motion_dev/` map to `code-animation/`, `references/webflow/` and `assets/webflow/` map to `code-webflow/`, and `references/opencode/` and `assets/opencode/` map to `code-opencode/`.
- [x] The frozen `benchmark/baseline/` snapshot is identified as intentionally read-only input.

### Definition of Done
- [x] Every stale playbook gold path is translated to the `code-<surface>/` packet layout while preserving each scenario's curated resource set.
- [x] All 71 translated gold paths are existence-checked on disk before applying, and the post-translation stale-path grep returns 0 files.
- [x] The deterministic `benchmark/router-final/` baseline is regenerated in offline router trace mode with verdict CONDITIONAL and aggregate 71/100.
- [x] Benchmark README's stale latest-router-verdict statistic is refreshed to match the regenerated router-final result.
- [x] Scoped deferrals are documented: residual 66% gold-vs-router recall gap, live-mode re-baseline, and the pre-existing unrelated harness `intents` test failure.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic path translation with evidence-preserving re-baseline: map only stale prefixes, verify each translated path exists, regenerate router-final from the corrected harness, and report residual recall as signal rather than forcing gold to match router output.

### Key Components
- **Playbook scenario gold**: Curated expected resource paths in `.opencode/skills/sk-code/manual_testing_playbook/**/*.md`.
- **Path translation map**: Pre-013 `references/{motion_dev,webflow,opencode}/` and `assets/{motion_dev,webflow,opencode}/` prefixes translated to `code-animation/`, `code-webflow/`, and `code-opencode/` packet locations.
- **Router-final baseline**: Deterministic offline router trace report under `.opencode/skills/sk-code/benchmark/router-final/`.
- **Benchmark README statistic**: Human-facing latest-router-verdict line aligned to the regenerated report.

### Data Flow
The harness dependency fixes make playbook scenarios parse and slice `code-<surface>/` resource paths correctly. The gold translation then updates stale path prefixes without changing scenario intent. Existence checks prevent dead gold paths. Router-final regeneration consumes the corrected harness and refreshed gold, writes a current deterministic report, and exposes both recovered score and residual recall gap. The frozen baseline remains untouched.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [x] Confirm phase-021 scope, out-of-scope boundaries, and the frozen-baseline contract.
- [x] Confirm harness dependency packets 037 and 038 landed before gold work proceeds.
- [x] Inventory stale playbook path prefixes and establish the deterministic `code-<surface>/` translation map.

### Phase 2: Fresh Benchmark Packages
- [x] Validate the translation end-to-end before applying by checking every translated path exists on disk.
- [x] Apply the gold path translation across the manual testing playbook scenario files.
- [x] Preserve curated scenario resource sets; do not re-curate scenarios and do not regenerate gold from router output.
- [x] Leave universal-tier references and the frozen `benchmark/baseline/` snapshot unchanged.

### Phase 3: Validator Promotion
- [x] Verify the post-translation stale-path grep returns 0 files.
- [x] Verify all 71 translated gold paths exist after applying the translation.
- [x] Regenerate `benchmark/router-final/skill-benchmark-report.{json,md}` in deterministic router trace mode.
- [x] Verify verdict CONDITIONAL, aggregate 71/100, D5 connectivity 100/100, and 0 scored scenarios routing both code-webflow/ and code-opencode/.
- [x] Record honest gold-vs-router recall as 65/99 = 66%.

### Phase 4: Parent Rollup and Optional Catalogs
- [x] Refresh the benchmark README latest-router-verdict statistic to match router-final.
- [x] Document the residual recall gap as an optional per-scenario re-curation follow-up.
- [x] Document live-mode re-baseline deferral because it needs a configured provider.
- [x] Document the unrelated harness `intents` test failure as out of scope.
- [x] Run final close-out doc verification after the evidence is recorded.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Stale-path sweep | Playbook scenario gold paths | Post-translation grep for old `references/{motion_dev,webflow,opencode}/` and `assets/{...}/` prefixes |
| Path integrity | 71 translated gold paths | Existence checks against the current sk-code packet filesystem |
| Baseline regeneration | `benchmark/router-final/` report | Offline router trace mode |
| Signal honesty | Leak and recall metrics | Router-final verdict review: 0 leaks, recall 65/99 = 66% |
| Spec validation | Phase close-out docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` at close-out |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 021 spec scope | Internal | Available | Gold refresh, benchmark scope, and deferral boundaries would be ambiguous |
| Harness packet 037 router-replay surface slicing | Internal | Landed before this work | Surface scenario scoring would remain broken |
| Harness packet 038 scenario-loader `code-<surface>/` parsing | Internal | Landed before this work | Refreshed gold paths could not be parsed correctly |
| Current sk-code packet filesystem | Internal | Available | Existence checks for translated gold paths could not prove path integrity |
| Live-mode provider configuration | External | Deferred by scope | Live-mode re-baseline remains pending; router mode is the deterministic CI gate |
| Harness `intents` test subsystem | Internal | Out of scope | Pre-existing unrelated failure remains tracked separately and is not touched here |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A translated gold path does not exist, stale pre-013 paths remain, router-final is not reproducible in deterministic mode, the frozen baseline is modified, or the README statistic contradicts the regenerated report.
- **Procedure**: Revert the playbook path translation, restore the prior router-final report and README statistic from the same change set, leave the frozen baseline untouched, then re-run stale-path grep, translated-path existence checks, and deterministic router-final regeneration before attempting a narrower translation.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Phase 021 spec and dependency packets 037/038 | Gold path translation |
| Fresh Benchmark Packages | Validated translation map and current filesystem paths | Router-final regeneration |
| Validator Promotion | Completed playbook translation and corrected harness | README statistic refresh and close-out docs |
| Parent Rollup and Optional Catalogs | Regenerated router-final evidence and documented deferrals | Final validation and pending push |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Bounded by one playbook corpus but dependent on prior harness packets |
| Fresh Benchmark Packages | Medium | Deterministic prefix translation with 71 existence checks |
| Validator Promotion | Medium | Router-final regeneration plus leak, verdict, and recall review |
| Parent Rollup and Optional Catalogs | Low | README statistic and close-out docs record the evidence and scoped deferrals |
| **Total** | | **Medium benchmark recovery and documentation phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Record the stale-path grep baseline before translation.
- [x] Record the 71 translated path targets and their existence-check result.
- [x] Record the pre-regeneration router-final report and benchmark README statistic.

### Rollback Procedure
1. Revert the playbook path translation and regenerated router-final report together.
2. Restore the benchmark README latest-router-verdict statistic to its prior value.
3. Confirm `benchmark/baseline/` was not modified.
4. Re-run stale-path grep, translated-path existence checks, and deterministic router-final regeneration after the narrower fix.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Filesystem-only revert of playbook markdown path edits, router-final report regeneration outputs, and benchmark README statistic; no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
