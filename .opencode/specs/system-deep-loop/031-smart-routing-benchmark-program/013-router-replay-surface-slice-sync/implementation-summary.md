---
title: "Implementation Summary: Router-replay surface-slice sync to code-<surface> layout"
description: "Executed summary for the Lane-C router-replay harness fix: re-synced surface-slicing prefixes to code-<surface>/ folders, added regression guards, eliminated cross-surface leaks, and deferred stale gold alignment honestly."
trigger_phrases:
  - "router replay surface slice summary"
  - "surface slice sync summary"
  - "code surface router replay summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync"
    last_updated_at: "2026-07-06T08:41:30.282Z"
    last_updated_by: "claude-opus"
    recent_action: "Router-replay slicing restored; guard tests passing"
    next_safe_action: "Run close-out validation; keep gold alignment separate"
    blockers: []
    key_files:
      - "spec.md"
      - "router-replay.cjs"
      - "surface-slice-sync.vitest.ts"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-037-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Is this packet executed?"
        answer: "Yes. Three prefix sites were re-synced, four guard tests were added, and the leak dropped from 13/21 to 0/21."
      - question: "What remains deferred?"
        answer: "sk-code gold alignment is deferred; the pre-existing intents failure is a separate expectation-sync candidate."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-router-replay-surface-slice-sync |
| **Status** | Complete |
| **Level** | 2 |
| **Actual Effort** | Small correctness-critical harness fix: three prefix-site edits, one four-test regression guard, leak diagnostic, harness Vitest comparison, and close-out docs; gold alignment and push pending by scope |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 037 restored deterministic router-replay surface-slicing for sk-code after the surface packets moved to `code-*` folder names. The harness now slices against `code-webflow/`, `code-opencode/`, and `code-animation/` resource paths in the same layout used by the smart router `RESOURCE_MAP`. The task-text detectors were intentionally left unchanged because they classify prompt tokens, not resource folders. A new four-test Vitest guard locks WEBFLOW, OPENCODE, UNKNOWN Motion, and corpus-wide no-cross-surface-leak behavior. The fix is proven by direct leak elimination and guard tests, not by the still gold-limited sk-code aggregate.

### Files Changed

| File | Action | Purpose | Commit |
|------|--------|---------|--------|
| `.opencode/specs/system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync/spec.md` | Updated | Define the harness regression, in-scope three-site fix, success criteria, risks, and follow-up boundaries | not committed at authoring time |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Updated | Re-sync `SURFACE_PREFIXES`, `hasSurfaceLayout`, and OpenCode language regex to the `code-<surface>/` layout | not committed at authoring time |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/surface-slice-sync.vitest.ts` | Added | Lock WEBFLOW, OPENCODE, UNKNOWN Motion, and corpus-wide no-dual-surface over-routing behavior | not committed at authoring time |
| `.opencode/specs/system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync/plan.md` | Added | Record implementation approach, quality gates, verification strategy, dependencies, and rollback | not committed at authoring time |
| `.opencode/specs/system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync/tasks.md` | Added | Record completed task sequence and evidence notes | not committed at authoring time |
| `.opencode/specs/system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync/checklist.md` | Added | Record Level 2 verification checklist with evidence and deferrals | not committed at authoring time |
| `.opencode/specs/system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync/implementation-summary.md` | Added | Record final state, files changed, verification, limitations, and deviations | not committed at authoring time |
| `.opencode/specs/system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync/description.json` | Updated | Packet metadata generated for memory/index visibility | not committed at authoring time |
| `.opencode/specs/system-deep-loop/031-smart-routing-benchmark-program/013-router-replay-surface-slice-sync/graph-metadata.json` | Updated | Packet graph metadata generated for traversal/status visibility | not committed at authoring time |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work started by diagnosing why single-surface sk-code scenarios were over-routing both surface resource sets. The harness's prompt detectors still identified WEBFLOW, OPENCODE, and Motion tasks, but the resource slicing logic still expected bare path prefixes from before the sk-code surface rename. Since the current map contains `code-webflow/`, `code-opencode/`, and `code-animation/`, `hasSurfaceLayout` stayed false and the slicing path never activated.

The repair changed only the resource-folder-facing constants: `SURFACE_PREFIXES`, the `hasSurfaceLayout` prefix check, and the OpenCode language sub-slice regex. The prompt-token detectors were left unchanged. The regression guard then asserted the corrected behavior directly: WEBFLOW tasks keep only webflow resources, OPENCODE tasks keep only opencode resources, UNKNOWN Motion keeps the animation overlay while dropping both surfaces, and the corpus no longer routes both surfaces for a single-surface scenario.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Fix only the three resource-prefix sites | The regression was a path-layout drift, not a prompt-classification failure |
| Leave `detectSurface` and `detectOpencodeLanguage` unchanged | Those functions key on task text and should not be coupled to folder names |
| Prove success with leak diagnostic and guard tests | The sk-code aggregate remains gold-limited, so direct leak evidence is the reliable proof |
| Defer playbook gold alignment and `benchmark/router-final/` regeneration | Operator directed a two-packet split to keep this harness fix clean |
| Leave the pre-existing intents assertion failure unchanged | It belongs to intent/mode-projection expectation sync, not surface-slicing |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:blockers -->
## Blockers

None. The harness fix, regression guard, and direct leak proof are complete. Remaining items are scoped deferrals, not blockers: sk-code playbook gold alignment and Lane-C re-baseline, plus the unrelated intent/mode-projection test expectation sync candidate.

<!-- /ANCHOR:blockers -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Evidence |
|-----------|--------|----------|----------|
| Over-routing leak diagnostic | Pass | Scored non-browser scenarios | 13 of 21 scenarios routed both `code-webflow/` and `code-opencode/` before the fix; 0 of 21 after the fix |
| Spot-check replay | Pass | Representative WEBFLOW, UNKNOWN Motion, and OPENCODE scenarios | SD-001 routes `code-webflow` and no `code-opencode`; CS-004 keeps `code-animation` and drops both surfaces; LS-001 routes `code-opencode` only |
| Surface-slice regression guard | Pass | Four new guard tests | `tests/surface-slice-sync.vitest.ts` adds four tests and all pass |
| Harness Vitest suite | Pass with known pre-existing failure | skill-benchmark tests | Baseline 1 failed / 100 passed across 101 tests in 6 files; post-fix 1 failed / 104 passed across 105 tests in 7 files; the single failure is the same out-of-scope `res.intents` assertion |
| sk-code router-mode benchmark | Baseline captured, gold-limited | Follow-up starting point | Aggregate 48, D1-intra 68, D2 52, D3 25, D5 100, hard gate pass; recorded only as honest starting baseline for the gold-alignment follow-up |
| Spec validation | Run at close-out | Packet docs | `validate.sh --strict` run at close-out; push pending |

### Test Coverage Summary

| Area | Result |
|------|--------|
| Prefix sync | 3/3 resource-prefix sites re-synced to `code-*` layout |
| Leak behavior | 13/21 over-routing before fix to 0/21 after fix |
| Regression guard | 4/4 new tests passing |
| Harness suite | No new failure; same 1 pre-existing failure, passing count increased by 4 |
| Scoped deferrals | Gold alignment/re-baseline and intents expectation sync documented |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Deterministic offline guard protects surface-slicing | Four Vitest guard tests lock single-surface and corpus-wide no-over-routing behavior | Pass |
| NFR-M01 | Fix stays maintainable and local to resource layout | Only resource-folder-facing prefix sites changed; prompt detectors remain text-based | Pass |
| NFR-C01 | Evidence does not overstate benchmark success | Gold-limited aggregate recorded as follow-up baseline, not as packet-037 success proof | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The sk-code playbook GOLD is still stale and uses pre-rename monolithic paths. Aligning it to the corrected router and regenerating `benchmark/router-final/` is the separate follow-up packet `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline`.
2. The pre-existing `skill-benchmark.vitest.ts` `res.intents` failure remains. It expects `implement` for a Webflow task, while current `hub-router.json` returns `['code-webflow']`; this is a separate intent/mode-projection expectation issue.
3. No commit SHA exists at authoring time. Close-out validation and push are pending after these docs are authored.
4. The sk-code post-slicing aggregate remains gold-limited, so packet success is proven by leak diagnostic and regression guard evidence instead.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Close-out docs generated by standard scaffolding | Docs were self-scaffolded from the required sibling structure, then authored with GPT using packet-037 evidence | User required exact structural mirroring from the phase-020 sibling docs while changing only content |
| Full harness suite green | Suite remains 1 failed / 104 passed | The single failure is pre-existing and belongs to intent/mode-projection expectation sync, not surface-slicing |
| sk-code router-mode aggregate as success proof | Aggregate captured only as gold-limited follow-up baseline | Playbook gold still uses pre-rename paths, so success is proven by 13/21 to 0/21 leak elimination and passing guard tests |

<!-- /ANCHOR:deviations -->
