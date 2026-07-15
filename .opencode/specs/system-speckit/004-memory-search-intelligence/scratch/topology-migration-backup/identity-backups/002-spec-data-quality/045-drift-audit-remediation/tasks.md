---
title: "Tasks: 028 Drift Audit Remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "028 drift remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/045-drift-audit-remediation"
    last_updated_at: "2026-07-04T17:11:49.048Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Enumerated 93 tasks: setup, 4 investigations, 42 fixes, 42 verifies, 3 wrap-up"
    next_safe_action: "Execute Phase 2 tasks via Workflow"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-028-drift-audit-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 028 Drift Audit Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create isolated git worktree from HEAD for all remediation edits (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/028-drift-remediation-wt` @ `aca0f7eb8b`)
- [x] T002 Scaffold this 045-drift-audit-remediation spec folder inside the worktree (spec.md, plan.md, tasks.md, checklist.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Investigate the 4 code-gap findings, fix all 42 directories, then verify each fix.

- [x] T003 [P] Investigate hybrid-search.ts summary/community fusion lane: repo-wide search for the lane under any name before deciding fix strategy
- [x] T004 [P] Investigate 002-code-graph/005-seeded-ppr-ranking: repo-wide search for seeded-PPR flag/symbols/test under any name
- [x] T005 [P] Investigate system-skill-advisor/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior: repo-wide search for the shadow-weight promoter module under any name
- [x] T006 [P] Investigate system-skill-advisor/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon: repo-wide search for the store/rerank/test modules under any name

- [x] T007 [P] Fix findings in `.opencode/skills/deep-loop-runtime/scripts/` (0 confirmed + 1 unverified)
- [x] T008 [P] Fix findings in `.opencode/skills/system-spec-kit/mcp_server/lib/search/` (1 confirmed) [depends on investigation]
- [x] T009 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/` (2 confirmed + 4 unverified)
- [x] T010 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/000-release-cleanup/` (3 confirmed)
- [x] T011 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/000-release-cleanup/001-code-readmes/` (0 confirmed + 1 unverified)
- [x] T012 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/000-release-cleanup/014-spec-regrouping-renumber-reindex/` (0 confirmed + 3 unverified)
- [x] T013 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/` (3 confirmed + 5 unverified)
- [x] T014 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero/` (1 confirmed)
- [x] T015 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing/` (0 confirmed + 1 unverified)
- [x] T016 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/007-bitemporal-window/` (0 confirmed + 1 unverified)
- [x] T017 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness/` (0 confirmed + 1 unverified)
- [x] T018 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks/` (1 confirmed)
- [x] T019 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding/` (0 confirmed + 1 unverified)
- [x] T020 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall/` (0 confirmed + 1 unverified)
- [x] T021 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer/` (0 confirmed + 1 unverified)
- [x] T022 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/030-opencode-temp-worker-reaping/` (2 confirmed)
- [x] T023 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/research/` (0 confirmed + 1 unverified)
- [x] T024 [P] Fix findings in `.opencode/specs/system-code-graph/001-code-graph-core/` (1 confirmed + 1 unverified)
- [x] T025 [P] Fix findings in `.opencode/specs/system-code-graph/001-code-graph-core/002-edge-staleness-correctness/` (0 confirmed + 1 unverified)
- [x] T026 [P] Fix findings in `.opencode/specs/system-code-graph/001-code-graph-core/004-code-edge-bitemporal/` (0 confirmed + 1 unverified)
- [x] T027 [P] Fix findings in `.opencode/specs/system-code-graph/001-code-graph-core/005-seeded-ppr-ranking/` (1 confirmed + 1 unverified) [depends on investigation]
- [x] T028 [P] Fix findings in `.opencode/specs/system-code-graph/001-code-graph-core/007-parser-resilience/` (0 confirmed + 1 unverified)
- [x] T029 [P] Fix findings in `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/001-rrf-determinism-spine/` (0 confirmed + 1 unverified)
- [x] T030 [P] Fix findings in `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/003-embedding-staleness-signal/` (0 confirmed + 1 unverified)
- [x] T031 [P] Fix findings in `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior/` (1 confirmed + 1 unverified) [depends on investigation]
- [x] T032 [P] Fix findings in `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/005-conflict-rerank-query-routing/` (0 confirmed + 1 unverified)
- [x] T033 [P] Fix findings in `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/006-provenance-drift-observability/` (0 confirmed + 1 unverified)
- [x] T034 [P] Fix findings in `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/` (1 confirmed + 1 unverified) [depends on investigation]
- [x] T035 [P] Fix findings in `.opencode/specs/system-deep-loop/038-deep-loop-runtime/` (0 confirmed + 1 unverified)
- [x] T036 [P] Fix findings in `.opencode/specs/system-deep-loop/038-deep-loop-runtime/001-reducer-anchor-fix/` (0 confirmed + 2 unverified)
- [x] T037 [P] Fix findings in `.opencode/specs/system-deep-loop/038-deep-loop-runtime/002-fanout-determinism-observability/` (0 confirmed + 2 unverified)
- [x] T038 [P] Fix findings in `.opencode/specs/system-deep-loop/038-deep-loop-runtime/003-fanout-failure-recovery/` (0 confirmed + 1 unverified)
- [x] T039 [P] Fix findings in `.opencode/specs/system-deep-loop/038-deep-loop-runtime/004-reliability-weighted-convergence/` (0 confirmed + 1 unverified)
- [x] T040 [P] Fix findings in `.opencode/specs/system-deep-loop/038-deep-loop-runtime/005-stop-input-corroboration/` (1 confirmed)
- [x] T041 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/` (3 confirmed + 3 unverified)
- [x] T042 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap/` (1 confirmed + 1 unverified)
- [x] T043 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/` (1 confirmed + 1 unverified)
- [x] T044 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/001-eval-benchmark-fidelity/` (0 confirmed + 2 unverified)
- [x] T045 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/003-doc-accuracy/` (0 confirmed + 2 unverified)
- [x] T046 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/006-review-record-packet-type/` (0 confirmed + 1 unverified)
- [x] T047 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/` (1 confirmed)
- [x] T048 [P] Fix findings in `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/007-graduation-follow-ups/` (0 confirmed + 2 unverified)

- [x] T049 [P] Verify fix for `.opencode/skills/deep-loop-runtime/scripts/` against real files (GPT-5.5 high fast)
- [x] T050 [P] Verify fix for `.opencode/skills/system-spec-kit/mcp_server/lib/search/` against real files (GPT-5.5 high fast)
- [x] T051 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/` against real files (GPT-5.5 high fast)
- [x] T052 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/000-release-cleanup/` against real files (GPT-5.5 high fast)
- [x] T053 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/000-release-cleanup/001-code-readmes/` against real files (GPT-5.5 high fast)
- [x] T054 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/000-release-cleanup/014-spec-regrouping-renumber-reindex/` against real files (GPT-5.5 high fast)
- [x] T055 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/` against real files (GPT-5.5 high fast)
- [x] T056 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero/` against real files (GPT-5.5 high fast)
- [x] T057 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing/` against real files (GPT-5.5 high fast)
- [x] T058 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/007-bitemporal-window/` against real files (GPT-5.5 high fast)
- [x] T059 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness/` against real files (GPT-5.5 high fast)
- [x] T060 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks/` against real files (GPT-5.5 high fast)
- [x] T061 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding/` against real files (GPT-5.5 high fast)
- [x] T062 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall/` against real files (GPT-5.5 high fast)
- [x] T063 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer/` against real files (GPT-5.5 high fast)
- [x] T064 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/030-opencode-temp-worker-reaping/` against real files (GPT-5.5 high fast)
- [x] T065 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/research/` against real files (GPT-5.5 high fast)
- [x] T066 [P] Verify fix for `.opencode/specs/system-code-graph/001-code-graph-core/` against real files (GPT-5.5 high fast)
- [x] T067 [P] Verify fix for `.opencode/specs/system-code-graph/001-code-graph-core/002-edge-staleness-correctness/` against real files (GPT-5.5 high fast)
- [x] T068 [P] Verify fix for `.opencode/specs/system-code-graph/001-code-graph-core/004-code-edge-bitemporal/` against real files (GPT-5.5 high fast)
- [x] T069 [P] Verify fix for `.opencode/specs/system-code-graph/001-code-graph-core/005-seeded-ppr-ranking/` against real files (GPT-5.5 high fast)
- [x] T070 [P] Verify fix for `.opencode/specs/system-code-graph/001-code-graph-core/007-parser-resilience/` against real files (GPT-5.5 high fast)
- [x] T071 [P] Verify fix for `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/001-rrf-determinism-spine/` against real files (GPT-5.5 high fast)
- [x] T072 [P] Verify fix for `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/003-embedding-staleness-signal/` against real files (GPT-5.5 high fast)
- [x] T073 [P] Verify fix for `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior/` against real files (GPT-5.5 high fast)
- [x] T074 [P] Verify fix for `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/005-conflict-rerank-query-routing/` against real files (GPT-5.5 high fast)
- [x] T075 [P] Verify fix for `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/006-provenance-drift-observability/` against real files (GPT-5.5 high fast)
- [x] T076 [P] Verify fix for `.opencode/specs/system-skill-advisor/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon/` against real files (GPT-5.5 high fast)
- [x] T077 [P] Verify fix for `.opencode/specs/system-deep-loop/038-deep-loop-runtime/` against real files (GPT-5.5 high fast)
- [x] T078 [P] Verify fix for `.opencode/specs/system-deep-loop/038-deep-loop-runtime/001-reducer-anchor-fix/` against real files (GPT-5.5 high fast)
- [x] T079 [P] Verify fix for `.opencode/specs/system-deep-loop/038-deep-loop-runtime/002-fanout-determinism-observability/` against real files (GPT-5.5 high fast)
- [x] T080 [P] Verify fix for `.opencode/specs/system-deep-loop/038-deep-loop-runtime/003-fanout-failure-recovery/` against real files (GPT-5.5 high fast)
- [x] T081 [P] Verify fix for `.opencode/specs/system-deep-loop/038-deep-loop-runtime/004-reliability-weighted-convergence/` against real files (GPT-5.5 high fast)
- [x] T082 [P] Verify fix for `.opencode/specs/system-deep-loop/038-deep-loop-runtime/005-stop-input-corroboration/` against real files (GPT-5.5 high fast)
- [x] T083 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/` against real files (GPT-5.5 high fast)
- [x] T084 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap/` against real files (GPT-5.5 high fast)
- [x] T085 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/` against real files (GPT-5.5 high fast)
- [x] T086 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/001-eval-benchmark-fidelity/` against real files (GPT-5.5 high fast)
- [x] T087 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/003-doc-accuracy/` against real files (GPT-5.5 high fast)
- [x] T088 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation/006-review-record-packet-type/` against real files (GPT-5.5 high fast)
- [x] T089 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/` against real files (GPT-5.5 high fast)
- [x] T090 [P] Verify fix for `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/007-graduation-follow-ups/` against real files (GPT-5.5 high fast)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T091 Sync verified changes from worktree back to live tree as uncommitted diffs; run `git diff --stat`
- [x] T092 Update this packet's checklist.md and implementation-summary.md with final per-finding outcomes
- [x] T093 Run `validate.sh 045-drift-audit-remediation --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 93 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Live-tree `git diff --stat` reviewed by operator
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
