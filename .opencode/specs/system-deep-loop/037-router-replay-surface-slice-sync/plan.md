---
title: "Implementation Plan: Router-replay surface-slice sync to code-<surface> layout"
description: "Level 2 close-out plan for re-syncing the Lane-C router-replay harness surface-slicing prefixes to the code-<surface>/ packet layout, adding a regression guard, and recording honest benchmark deferrals."
trigger_phrases:
  - "router replay surface slice plan"
  - "surface slice sync plan"
  - "code surface router replay plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-router-replay-surface-slice-sync"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Router-replay slicing prefixes re-synced; regression guard added"
    next_safe_action: "Run close-out validation and push; keep sk-code gold alignment in the follow-up packet"
---
# Implementation Plan: Router-replay surface-slice sync to code-<surface> layout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript CommonJS harness code, Vitest regression tests, Markdown close-out docs |
| **Framework** | deep-loop deep-improvement skill benchmark harness, sk-code smart router resource map |
| **Storage** | Repository filesystem: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/` and packet docs |
| **Testing** | Over-routing leak diagnostic, targeted surface-slice regression tests, harness Vitest suite, spec close-out validation |

### Overview
This packet repairs a silent Lane-C router-replay harness regression caused by the earlier sk-code surface-packet rename. The deterministic replay harness still sliced resources by bare pre-rename prefixes (`webflow/`, `opencode/`, `animation/`) even though the live sk-code packets and smart-router `RESOURCE_MAP` now use `code-webflow/`, `code-opencode/`, and `code-animation/`. Because `hasSurfaceLayout` never became true, single-surface scenarios over-routed the whole cross-surface union. The fix re-syncs the three harness prefix sites, adds a four-test regression guard, proves the leak dropped from 13/21 scored non-browser scenarios to 0/21, and records the stale sk-code gold alignment as a separate follow-up.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 037 spec defines the harness regression, root cause, in-scope prefix sites, out-of-scope gold alignment, and success criteria.
- [x] The code-<surface>/ packet layout is established by the sk-code rename and smart-router `RESOURCE_MAP` update.
- [x] The documented smart-router contract still asserts deterministic router-replay enforces the same surface-slicing rule.
- [x] The unrelated pre-existing `res.intents` expectation failure is identified as outside surface-slicing scope.

### Definition of Done
- [x] `router-replay.cjs` re-syncs `SURFACE_PREFIXES`, `hasSurfaceLayout`, and the OpenCode language sub-slice regex to the `code-<surface>/` layout.
- [x] Prompt-token detectors remain unchanged because they key on task text, not resource-folder names.
- [x] Regression guard `tests/surface-slice-sync.vitest.ts` locks WEBFLOW, OPENCODE, UNKNOWN Motion, and corpus-wide no-cross-surface-leak behavior.
- [x] Leak diagnostic improves from 13/21 over-routed scored non-browser scenarios before the fix to 0/21 after the fix.
- [x] Harness Vitest result is honestly recorded as baseline 1 failed / 100 passed to post-fix 1 failed / 104 passed; the single failure is the same pre-existing out-of-scope intents assertion.
- [x] Post-slicing sk-code router-mode aggregate is recorded only as a gold-limited starting baseline for the follow-up packet, not as packet-037 success evidence.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted harness-contract repair: align deterministic replay slicing constants to the live resource-map layout, then lock the invariant with direct regression tests and leak diagnostics rather than treating stale gold aggregates as proof.

### Key Components
- **Replay harness**: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`, where the three resource-prefix sites determine whether sk-code surface slicing activates.
- **Surface prefix map**: `SURFACE_PREFIXES`, now keyed to `code-webflow/`, `code-opencode/`, and `code-animation/` resource folders.
- **Layout detector**: `hasSurfaceLayout`, now checking for `code-webflow/references/` and `code-opencode/references/` in the current map.
- **OpenCode language sub-slice**: regex now matching `code-opencode/references/<language>/` so language-specific narrowing survives the rename.
- **Regression guard**: `tests/surface-slice-sync.vitest.ts`, covering single-surface slicing and corpus-wide no-over-routing.

### Data Flow
The benchmark builds a sk-code resource map from the current packet layout, detects task surface from prompt text, checks that the map has the expected surface layout, then slices resource paths to the detected surface or overlay. Before the fix, the prompt detector identified WEBFLOW or OPENCODE correctly but the path constants no longer matched the map, so slicing never applied. After the fix, path constants match the current `code-*` folders and single-surface scenarios retain only their intended resource slice.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [x] Confirm packet-037 scope, branch, parent, and two-packet split from the follow-up sk-code gold alignment work.
- [x] Reproduce or inspect the pre-fix over-routing leak: 13 of 21 scored non-browser scenarios routed both `code-webflow/` and `code-opencode/`.
- [x] Capture baseline harness Vitest state before the edit: 1 failed / 100 passed across 101 tests in 6 files.

### Phase 2: Fresh Benchmark Packages
- [x] Update `SURFACE_PREFIXES` from bare folder names to `code-webflow/`, `code-opencode/`, and `code-animation/` prefixes.
- [x] Update `hasSurfaceLayout` detection to require the current `code-webflow/references/` and `code-opencode/references/` prefixes.
- [x] Update the OpenCode language sub-slice regex to match `code-opencode/references/([^/]+)/`.
- [x] Leave `detectSurface` and `detectOpencodeLanguage` unchanged because they parse task text, not resource paths.

### Phase 3: Validator Promotion
- [x] Add regression guard tests for WEBFLOW-only, OPENCODE-only, UNKNOWN Motion overlay, and corpus-wide no dual-surface over-routing.
- [x] Verify spot checks: SD-001 routes `code-webflow` and not `code-opencode`; CS-004 keeps `code-animation` and drops both surfaces; LS-001 routes `code-opencode` only.
- [x] Re-run the harness Vitest suite and record post-fix state: 1 failed / 104 passed across 105 tests in 7 files, with the same pre-existing out-of-scope failure.

### Phase 4: Parent Rollup and Optional Catalogs
- [x] Capture the post-slicing sk-code router-mode baseline as aggregate 48, D1-intra 68, D2 52, D3 25, D5 100, hard gate pass.
- [x] Document that the aggregate is gold-limited because the playbook gold still uses pre-rename paths and is not packet-037 success evidence.
- [x] Record the sk-code playbook gold alignment and `benchmark/router-final/` regeneration as the separate follow-up packet.
- [x] Run final close-out doc self-verification for frontmatter, anchors, checked boxes, and evidence consistency.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Leak diagnostic | Scored non-browser sk-code playbook scenarios | Router-replay diagnostic before/after comparison |
| Regression guard | Single-surface slicing and corpus-wide no-over-routing | `tests/surface-slice-sync.vitest.ts` with Vitest |
| Harness suite | skill-benchmark test suite regression baseline | Vitest baseline and post-fix suite run |
| Benchmark baseline | Honest follow-up starting point after slicing restoration | sk-code router-mode benchmark output captured to scratch |
| Spec validation | Packet close-out docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` run at close-out |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 037 spec scope | Internal | Available | Harness fix boundaries and deferrals would be ambiguous |
| Current sk-code `RESOURCE_MAP` | Internal | Available | `hasSurfaceLayout` could not be aligned to the live `code-*` surface folders |
| Router-replay harness | Internal | Available | The deterministic benchmark could not enforce the documented slicing rule |
| Vitest harness suite | Internal | Available with pre-existing failure | New guard tests can prove the fix while the unrelated intents assertion remains out of scope |
| sk-code playbook gold alignment | Internal | Deferred by scope | Aggregate benchmark remains gold-limited until the follow-up packet updates gold and re-baselines |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The prefix sync causes new harness failures beyond the known pre-existing intents assertion, or a single-surface scenario again routes both `code-webflow/` and `code-opencode/` resources.
- **Procedure**: Revert the `router-replay.cjs` prefix edits and regression test as one harness unit, re-run the leak diagnostic and harness Vitest suite to confirm the previous baseline, then re-open the layout detector with a smaller fixture that directly inspects resource-map prefixes.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Packet 037 spec, current sk-code layout, baseline diagnostic | Prefix sync edits |
| Fresh Benchmark Packages | Confirmed three-site drift and detector boundaries | Regression guard execution |
| Validator Promotion | Prefix edits and guard test creation | Close-out documentation |
| Parent Rollup and Optional Catalogs | Leak elimination and harness suite evidence | Follow-up sk-code gold alignment packet |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Small code surface but correctness-critical because benchmark scoring silently over-routed |
| Fresh Benchmark Packages | Low | Three prefix sites plus deliberate non-change to prompt detectors |
| Validator Promotion | Medium | Requires baseline/post-fix comparison and direct leak proof despite a pre-existing suite failure |
| Parent Rollup and Optional Catalogs | Medium | Must record gold-limited aggregate honestly without overstating packet success |
| **Total** | | **Small harness fix with correctness-critical verification** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Record pre-fix over-routing leak count: 13/21 scored non-browser scenarios routed both surface slices.
- [x] Record baseline harness Vitest state: 1 failed / 100 passed across 101 tests in 6 files.
- [x] Record the known out-of-scope failing assertion before changing the slicing code.

### Rollback Procedure
1. Revert the harness prefix edits and the regression guard test together.
2. Re-run the leak diagnostic to confirm whether behavior returned to the pre-fix over-routing baseline.
3. Re-run the harness Vitest suite and compare against the captured baseline failure count.
4. Re-open the fix with a narrower resource-map fixture if rollback proves the prefix sync caused an unexpected side effect.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File-only revert of one harness script and one regression test; no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
