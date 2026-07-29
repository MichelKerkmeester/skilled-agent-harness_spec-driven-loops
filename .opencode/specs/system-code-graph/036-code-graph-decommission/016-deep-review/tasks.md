---
title: "Tasks: Phase 16: deep-review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "deep review"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/016-deep-review"
    last_updated_at: "2026-07-28T09:34:43Z"
    last_updated_by: "claude-code"
    recent_action: "Remediated confirmed review findings across all workstreams"
    next_safe_action: "Validate the packet and push"
    blockers: []
    key_files:
      - "review/lineages/grok/review-report.md"
      - "review/lineages/deepseek/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-036-016-deep-review"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: deep-review

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Scaffold the review child and author its spec (spec.md) — evidence: `spec.md`
- [x] T002 Sync the branch before launching the fan-out so lanes audit a fixed target — evidence: `review/lineages/grok/review-report.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the two-lane fan-out to 5/5 iterations per lane with forced max-iterations (review/lineages/) — evidence: `review/lineages/grok/review-report.md`
- [x] T004 Verify every grok P0/P1 at its cited line before action (14/14 confirmed) — evidence: `implementation-summary.md`
- [x] T005 Triage deepseek findings: 1 P1 wording confirmed, external-server framing refuted, layer-definitions and compact tokenizer confirmed — evidence: `implementation-summary.md`
- [x] T006 Fix the live-guidance scrub workstream (context-server.ts, tool-schemas.ts, session-prime.ts, compact-inject.ts, layer-definitions.ts) — evidence: `implementation-summary.md`
- [x] T007 Fix the cursor hook workstream (hooks/cursor/post-tool-use.mjs) — evidence: `implementation-summary.md`
- [x] T008 Fix the test/harness workstream (opencode-plugin test deleted; compact-merger, durability stress, matrix manifest, substrate harness stripped) — evidence: `implementation-summary.md`
- [x] T009 Fix the docs/metadata workstream (plugins README, spec-kit graph-metadata edges, sk-doc roster) — evidence: `implementation-summary.md`
- [x] T010 Fix the completion-honesty workstream (015 checklist claim, in-flight wording, suite status) — evidence: `../015-verification-and-closeout/implementation-summary.md`
- [x] T011 Self-audit sweep: delete four dead launcher tests and the fork drift guard, remove the dead resume binary resolver, retire the removed-contract import in the trust-vocabulary test — evidence: `implementation-summary.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Typecheck 0 errors after remediation — evidence: `implementation-summary.md`
- [x] T013 Affected test files green (compact-merger 2/2, hardening 9/9, context-server 395, hook-precompact, m8) — evidence: `implementation-summary.md`
- [x] T014 Substrate harness verified against a HEAD baseline: the memory_search timeout is pre-existing and environmental, and the connect failure of the retired daemon is eliminated — evidence: `implementation-summary.md`
- [x] T015 Residual sweep re-run with `--hidden --no-ignore`; remaining hits recorded in the triage table — evidence: `implementation-summary.md`
- [x] T016 Reconcile completion metadata in 015 and this child — evidence: `../015-verification-and-closeout/tasks.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (typecheck + targeted suites + residual sweep)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
