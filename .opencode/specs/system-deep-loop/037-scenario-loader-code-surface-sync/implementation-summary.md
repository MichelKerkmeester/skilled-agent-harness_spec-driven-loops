---
title: "Implementation Summary: Scenario loader code-<surface> path parsing sync"
description: "Executed summary for the Lane-C scenario loader and live-result parser fix: preserved code-<surface>/ packet paths, exported forbidden-prefix parsing, added regression guards, proved recall/verdict unblock, and deferred sk-code gold re-baseline honestly."
trigger_phrases:
  - "scenario loader code surface summary"
  - "code surface path parse summary"
  - "load playbook code prefix summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-scenario-loader-code-surface-sync"
    last_updated_at: "2026-07-06T08:41:30.599Z"
    last_updated_by: "claude-opus"
    recent_action: "Scenario loader and live parser now preserve code-surface packet paths; guard tests passing"
    next_safe_action: "Run close-out validation; keep gold translation and Lane-C re-baseline separate"
    blockers: []
    key_files:
      - "spec.md"
      - "load-playbook-scenarios.cjs"
      - "live-executor.cjs"
      - "code-surface-path-parse.vitest.ts"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-038-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Is this packet executed?"
        answer: "Yes. Four prefix regex sites were re-synced, `extractForbiddenPrefixes` was exported, two guard tests were added, and whole-path parsing was proven."
      - question: "What remains deferred?"
        answer: "sk-code playbook gold translation plus Lane-C re-baseline are deferred to the follow-up packet; the pre-existing intents failure is a separate expectation-sync candidate."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 037-scenario-loader-code-surface-sync |
| **Status** | Complete |
| **Level** | 2 |
| **Actual Effort** | Small correctness-critical harness fix: four one-line regex prefix additions, one export, one two-test regression guard, direct parser proof, harness Vitest comparison, temporary end-to-end recall/verdict proof, and close-out docs; gold translation and push pending by scope |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 038 restored Lane-C scenario-loader and live-result parser compatibility with sk-code's post-split `code-<surface>/` packet layout. The loader and live parsers now preserve `code-webflow/`, `code-opencode/`, and `code-animation/` paths whole alongside the universal `references/`, `assets/`, and `../shared/` tiers. `extractForbiddenPrefixes` is exported for direct unit coverage. A new two-test Vitest guard locks whole-path parsing and forbidden-prefix parsing, while the sk-code gold translation and Lane-C re-baseline remain owned by the separate follow-up packet.

### Files Changed

| File | Action | Purpose | Commit |
|------|--------|---------|--------|
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/spec.md` | Updated | Define the loader/live-parser regression, in-scope four-site fix, success criteria, risks, and follow-up boundaries | not committed at authoring time |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Updated | Teach `extractPaths` and `extractForbiddenPrefixes` the `code-<surface>/` prefix and export forbidden-prefix parsing | not committed at authoring time |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` | Updated | Teach prose-fallback and observed-reads parsers the `code-<surface>/` prefix | not committed at authoring time |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/code-surface-path-parse.vitest.ts` | Added | Lock whole-path parsing for `code-webflow`, `code-opencode`, `code-animation`, and `code-<surface>/` forbidden globs | not committed at authoring time |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/plan.md` | Added | Record implementation approach, quality gates, verification strategy, dependencies, and rollback | not committed at authoring time |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/tasks.md` | Added | Record completed task sequence and evidence notes | not committed at authoring time |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/checklist.md` | Added | Record Level 2 verification checklist with evidence and deferrals | not committed at authoring time |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/implementation-summary.md` | Added | Record final state, files changed, verification, limitations, and deviations | not committed at authoring time |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/description.json` | Updated | Packet metadata generated for memory/index visibility | not committed at authoring time |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/graph-metadata.json` | Updated | Packet graph metadata generated for traversal/status visibility | not committed at authoring time |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work started by diagnosing why translated sk-code gold still could not match corrected router output. The router could emit `code-animation/references/decision_matrix.md`, but the loader and live parser extracted only the inner `references/decision_matrix.md` suffix because their regexes knew only universal tiers. That made every surface scenario vulnerable to silent discovery/recall depression with no loud parse failure.

The repair changed only the path-prefix-facing regex alternatives in the four in-scope parser sites and exported `extractForbiddenPrefixes` so forbidden-prefix parsing could be tested directly. A completeness sweep confirmed these were the code-*-blind path matchers on the benchmark gold/live path. The `router-replay.cjs` referenced-router-doc finder was intentionally left alone because it locates the router doc under `references/`, not surface gold, and is not on the sk-code hub path.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Fix exactly four parser prefix regex sites | The regression was path-prefix extraction drift in loader/live parsing, not router slicing or prompt classification |
| Export `extractForbiddenPrefixes` | Forbidden-prefix parsing needed direct unit coverage to prevent another silent prefix blind spot |
| Leave the router-doc finder unchanged | It resolves a router documentation path under `references/`, not sk-code surface gold |
| Prove success with direct parser proof, guard tests, and temporary end-to-end measurement | Whole-path parse behavior is the packet invariant; the downstream gold update remains separate |
| Defer playbook gold translation and `benchmark/router-final/` regeneration | Operator directed keeping harness fixes separate from sk-code gold work |
| Leave the pre-existing intents assertion failure unchanged | It belongs to intent/mode-projection expectation sync, not path parsing |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:blockers -->
## Blockers

None. The harness parser fix, export, regression guard, direct parser proof, and temporary end-to-end unblock proof are complete. Remaining items are scoped deferrals, not blockers: sk-code playbook gold translation and Lane-C re-baseline, plus the unrelated intent/mode-projection test expectation sync candidate.

<!-- /ANCHOR:blockers -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Evidence |
|-----------|--------|----------|----------|
| Whole-path parser proof | Pass | `extractPaths` code-surface path extraction | After the fix, `extractPaths("- code-animation/references/decision_matrix.md ...")` returns `code-animation/references/decision_matrix.md` whole and does not emit `references/decision_matrix.md` |
| Code-surface parse regression guard | Pass | Two new guard tests | `tests/code-surface-path-parse.vitest.ts` asserts `extractPaths` keeps `code-webflow`, `code-opencode`, and `code-animation` paths whole and `extractForbiddenPrefixes` captures a `code-<surface>/` forbidden glob prefix |
| Harness Vitest suite | Pass with known pre-existing failure | skill-benchmark tests | Baseline 1 failed / 104 passed across 105 tests in 7 files; post-fix 1 failed / 106 passed across 107 tests in 8 files; the single failure is the same out-of-scope `res.intents` assertion |
| End-to-end unblock proof | Pass, then reverted | Temporary translated gold against corrected loader/router | Recall rose from ~0 to 66% (65 of 99 gold paths) and sk-code router-mode verdict recovered from 47 FAIL to 71 CONDITIONAL with D1-intra 87, D2 79, D3 47, D5 100; temporary gold translation was reverted |
| Spec validation | Run at close-out | Packet docs | `validate.sh --strict` run at close-out; push pending |

### Test Coverage Summary

| Area | Result |
|------|--------|
| Prefix sync | 4/4 path-prefix regex sites re-synced to accept `code-[a-z]+/` packet paths |
| Export coverage | `extractForbiddenPrefixes` exported and directly tested |
| Regression guard | 2/2 new tests passing |
| Harness suite | No new failure; same 1 pre-existing failure, passing count increased by 2 |
| End-to-end proof | Recall ~0 to 66% and verdict 47 FAIL to 71 CONDITIONAL with temporary translated gold, then reverted |
| Scoped deferrals | Gold translation/re-baseline and intents expectation sync documented |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Deterministic offline guard protects whole-path parsing | Two Vitest guard tests lock code-surface extraction and forbidden-prefix extraction | Pass |
| NFR-M01 | Fix stays maintainable and additive | Only path-prefix alternatives and the testable export changed; universal-tier parsing remains unchanged | Pass |
| NFR-C01 | Evidence does not overstate benchmark success | Temporary translated-gold proof recorded as unblock evidence, then reverted for the follow-up packet to own | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The sk-code playbook GOLD translation plus `benchmark/router-final/` regeneration is the separate follow-up packet `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline`, explicitly out of packet-038 scope by operator direction.
2. The pre-existing `skill-benchmark.vitest.ts` `res.intents` failure remains. It expects `implement` for a Webflow task, while the current hub router returns `['code-webflow']`; this is a separate intent/mode-projection expectation issue.
3. No commit SHA exists at authoring time. Close-out validation and push are pending after these docs are authored.
4. The end-to-end 71 CONDITIONAL verdict was a temporary proof with translated gold; the playbook gold was reverted so the downstream packet owns the durable gold update and re-baseline.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Keep gold translation out of packet 038 | Temporary gold translation was applied, measured, and reverted during discovery | Needed to prove the loader fix plus corrected router unblocked real gold-router recall without taking ownership of the downstream gold artifact |
| Full harness suite green | Suite remains 1 failed / 106 passed | The single failure is pre-existing and belongs to intent/mode-projection expectation sync, not path parsing |
| sk-code gold re-baseline as packet output | Gold translation and `benchmark/router-final/` regeneration deferred to follow-up | Operator directed keeping harness fixes separate from sk-code gold work |

<!-- /ANCHOR:deviations -->
