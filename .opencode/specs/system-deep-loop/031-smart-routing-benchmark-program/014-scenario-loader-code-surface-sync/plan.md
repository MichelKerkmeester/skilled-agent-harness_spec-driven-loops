---
title: "Implementation Plan: Scenario loader code-<surface> path parsing sync"
description: "Level 2 close-out plan for teaching the Lane-C scenario loader and live-result parser to preserve code-<surface>/ packet paths, adding regression coverage, and recording scoped gold/intents deferrals."
trigger_phrases:
  - "scenario loader code surface plan"
  - "code surface path parse plan"
  - "load playbook code prefix plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/014-scenario-loader-code-surface-sync"
    last_updated_at: "2026-07-06T08:41:30.599Z"
    last_updated_by: "claude-opus"
    recent_action: "Scenario loader and live parser prefix handling re-synced; regression guard added"
    next_safe_action: "Validate and push; keep gold re-baseline in follow-up"
---
# Implementation Plan: Scenario loader code-<surface> path parsing sync

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript CommonJS harness code, Vitest regression tests, Markdown close-out docs |
| **Framework** | deep-loop deep-improvement skill benchmark harness, sk-code two-axis surface packet layout |
| **Storage** | Repository filesystem: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/` and packet docs |
| **Testing** | Direct path-extractor proof, targeted code-surface parse regression tests, harness Vitest suite, temporary end-to-end recall/verdict proof, spec close-out validation |

### Overview
This packet repairs a second silent Lane-C benchmark harness regression, companion to the router-replay surface-slicing fix. The scenario loader and live-result parser still recognized only `references/`, `assets/`, and `../shared/` path prefixes, while sk-code per-surface resources now live under `code-webflow/`, `code-opencode/`, and `code-animation/` packet folders. Gold such as `code-animation/references/decision_matrix.md` was silently truncated to `references/decision_matrix.md`, which neither exists nor matches the corrected router. The fix adds the `code-[a-z]+/` alternative to four prefix regexes, exports `extractForbiddenPrefixes` for direct tests, adds a two-test guard, proves whole-path parsing, and records the downstream gold translation and re-baseline as a separate follow-up.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 038 spec defines the loader/live-parser truncation problem, four in-scope prefix sites, out-of-scope gold translation, and success criteria.
- [x] The code-<surface>/ packet layout is established by the sk-code two-axis split and must parse whole in benchmark gold.
- [x] The companion router-replay slicing fix is complete, so loader parsing is the remaining harness-side blocker before gold translation can be measured.
- [x] The unrelated pre-existing `res.intents` expectation failure is identified as outside path-parsing scope.

### Definition of Done
- [x] `load-playbook-scenarios.cjs` teaches `extractPaths` and `extractForbiddenPrefixes` the `code-[a-z]+/` prefix alternative.
- [x] `live-executor.cjs` teaches both the prose-fallback parser and observed-reads parser the same `code-[a-z]+/` prefix alternative.
- [x] `extractForbiddenPrefixes` is exported so forbidden-prefix parsing is unit-testable.
- [x] Regression guard `tests/code-surface-path-parse.vitest.ts` locks whole-path parsing for `code-webflow`, `code-opencode`, `code-animation`, and `code-<surface>/` forbidden globs.
- [x] Direct proof confirms `extractPaths("- code-animation/references/decision_matrix.md ...")` returns the whole path and does not emit `references/decision_matrix.md`.
- [x] Harness Vitest result is honestly recorded as baseline 1 failed / 104 passed to post-fix 1 failed / 106 passed; the single failure is the same pre-existing out-of-scope intents assertion.
- [x] Temporary end-to-end proof is recorded as recall ~0 to 66% and router-mode verdict 47 FAIL to 71 CONDITIONAL, then reverted so the follow-up owns gold translation and re-baseline.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted harness-parser repair: align the benchmark's path extraction regexes to the live packet-path layout, then lock the invariant with direct unit tests and a temporary end-to-end measurement rather than folding gold translation into this packet.

### Key Components
- **Scenario loader**: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`, where `extractPaths` and `extractForbiddenPrefixes` parse scenario gold and forbidden prefixes.
- **Live-result parser**: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`, where prose-fallback and observed-reads parsing must preserve the same packet paths.
- **Prefix regexes**: Four additive regex updates now parse `code-<surface>/` packet paths whole alongside `references/`, `assets/`, and `../shared/`.
- **Regression guard**: `tests/code-surface-path-parse.vitest.ts`, covering whole-path extraction and forbidden-prefix extraction.
- **Excluded matcher**: `router-replay.cjs` referenced-router-doc finder stays unchanged because it locates the router doc under `references/`, not surface gold, and is not on the sk-code hub path.

### Data Flow
The playbook loader parses expected-resource gold from scenario Markdown, the live executor parses observed reads from model output, and the router benchmark compares those parsed paths with router emissions. Before the fix, `code-animation/references/decision_matrix.md` matched only the inner `references/decision_matrix.md` suffix. After the fix, the extractor accepts the packet prefix before the universal tier, so gold and live reads preserve full `code-<surface>/...` paths and can match the corrected router output.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [x] Confirm packet-038 scope, branch, parent, and operator-directed split from the sk-code gold translation packet.
- [x] Diagnose the silent truncation: `code-animation/references/decision_matrix.md` collapsed to `references/decision_matrix.md` in loader parsing.
- [x] Capture baseline harness Vitest state before the edit: 1 failed / 104 passed across 105 tests in 7 files.

### Phase 2: Fresh Benchmark Packages
- [x] Sweep the harness for code-*-blind path matchers and identify exactly four in-scope regex sites.
- [x] Update `load-playbook-scenarios.cjs` `extractPaths` to accept `code-[a-z]+/` packet paths whole.
- [x] Update `load-playbook-scenarios.cjs` `extractForbiddenPrefixes` to accept `code-[a-z]+/` forbidden glob prefixes and export it.
- [x] Update `live-executor.cjs` prose-fallback and observed-reads regexes to accept `code-[a-z]+/` packet paths whole.
- [x] Intentionally exclude `router-replay.cjs` referenced-router-doc finder because it resolves a router doc under `references/`, not surface gold.

### Phase 3: Validator Promotion
- [x] Add `tests/code-surface-path-parse.vitest.ts` with two regression tests for whole-path parsing and forbidden-prefix parsing.
- [x] Verify direct parser output: `extractPaths("- code-animation/references/decision_matrix.md ...")` returns `code-animation/references/decision_matrix.md` and not `references/decision_matrix.md`.
- [x] Re-run the harness Vitest suite and record post-fix state: 1 failed / 106 passed across 107 tests in 8 files, with the same pre-existing out-of-scope failure.

### Phase 4: Parent Rollup and Optional Catalogs
- [x] Temporarily translate gold to code-<surface>/ paths to prove the downstream unblock, then revert the gold so the follow-up packet owns it.
- [x] Record the end-to-end proof: gold-router recall rises from ~0 to 66% (65 of 99 gold paths) and sk-code router-mode verdict recovers from 47 FAIL to 71 CONDITIONAL with D1-intra 87, D2 79, D3 47, D5 100.
- [x] Document the sk-code playbook gold translation and `benchmark/router-final/` regeneration as the separate follow-up packet.
- [x] Run final close-out doc self-verification for frontmatter, anchors, checked boxes, and evidence consistency.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Direct parser proof | `extractPaths` whole-path behavior | Node/Vitest helper invocation evidence |
| Regression guard | Code-surface path extraction and forbidden-prefix extraction | `tests/code-surface-path-parse.vitest.ts` with Vitest |
| Harness suite | skill-benchmark test suite regression baseline | Vitest baseline and post-fix suite run |
| End-to-end unblock proof | Gold-router recall and router-mode verdict after temporary gold translation | Lane-C benchmark run with translated gold, then reverted |
| Spec validation | Packet close-out docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` run at close-out |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 038 spec scope | Internal | Available | Harness fix boundaries and deferrals would be ambiguous |
| Companion router-replay slicing fix | Internal | Available | Loader parse repair could not be matched against corrected router output |
| Scenario loader and live executor | Internal | Available | Benchmark gold and observed reads would keep truncating surface packet paths |
| Vitest harness suite | Internal | Available with pre-existing failure | New guard tests can prove the fix while the unrelated intents assertion remains out of scope |
| sk-code playbook gold translation | Internal | Deferred by scope | Final router-final re-baseline remains blocked until the follow-up packet updates gold |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The prefix sync causes new harness failures beyond the known pre-existing intents assertion, or a code-<surface>/ packet path again collapses to `references/...`.
- **Procedure**: Revert the four regex prefix edits, the `extractForbiddenPrefixes` export, and the regression test as one harness unit, re-run the direct parser proof and harness Vitest suite to confirm the previous baseline, then reopen with a narrower parser fixture.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Packet 038 spec, companion slicing fix, baseline Vitest run | Prefix parser edits |
| Fresh Benchmark Packages | Completeness sweep and excluded-matcher decision | Regression guard execution |
| Validator Promotion | Prefix edits, export, and guard test creation | End-to-end unblock proof |
| Parent Rollup and Optional Catalogs | Direct parser proof and harness suite evidence | Follow-up sk-code gold translation packet |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Small code surface but correctness-critical because benchmark scoring silently truncated gold paths |
| Fresh Benchmark Packages | Low | Four one-line prefix additions plus one export and one deliberate exclusion |
| Validator Promotion | Medium | Requires baseline/post-fix comparison and direct whole-path proof despite a pre-existing suite failure |
| Parent Rollup and Optional Catalogs | Medium | Must record temporary gold-translation proof honestly without absorbing follow-up scope |
| **Total** | | **Small harness fix with correctness-critical verification** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Record baseline harness Vitest state: 1 failed / 104 passed across 105 tests in 7 files.
- [x] Record the direct truncation symptom: `code-animation/references/decision_matrix.md` collapsed to `references/decision_matrix.md` before the fix.
- [x] Record the known out-of-scope failing assertion before changing the parser code.

### Rollback Procedure
1. Revert the four prefix regex edits, the `extractForbiddenPrefixes` export, and the regression guard test together.
2. Re-run the direct parser proof to confirm whether behavior returned to the pre-fix truncation baseline.
3. Re-run the harness Vitest suite and compare against the captured baseline failure count.
4. Re-open the fix with a narrower parser fixture if rollback proves the prefix sync caused an unexpected side effect.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File-only revert of two harness scripts and one regression test; the temporary gold translation was already reverted and no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
