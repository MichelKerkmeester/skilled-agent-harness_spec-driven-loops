---
title: "Tasks: Pi Directive Enforcement — tool_call Deny"
description: "Matcher reuse, guard implementation, matrix tests, verification."
trigger_phrases:
  - "pi directive enforcement tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Tasks authored"
    next_safe_action: "T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi Directive Enforcement — tool_call Deny

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm DISPATCH_SHAPES matcher reuse path (dispatch-audit.mjs / dispatch-preflight-lint.ts)
  - [evidence: `dispatch-audit.mjs` exports `matchDispatchShape`; pi tool_call surface confirmed in the dispatch preflight lint chain]
- [x] T002 Decide guard placement (pi tool_call surface)
  - [evidence: placement: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:70` — pi-specific preflight already receives tool_call + current user text]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement pi-default deny: shape match → block unless override token in current-turn user text
  - [evidence: deny implemented: `matchDispatchShape` at :78; exemptions — deep-loop executor pattern `:9`, explicit cli-mode override `hasExplicitModeOverride` `:42-44`, subagent tool, non-pi runtime]
- [x] T004 Exempt deep-loop executor shapes; never deny subagent tool
  - [evidence: 7 matrix cases in `dispatch-preflight-lint.test.ts`: devin/cursor-agent denied; cli-devin override allowed; deep-loop executor allowed; subagent tool unaffected; npm test allowed; non-pi runtime unaffected]
- [x] T005 Add deny/allow matrix tests (4+ cases)
  - [evidence: `npx vitest run pi/dispatch-preflight-lint.test.ts` 7/7; full dispatch suite 48/48 (the 1 collection failure is pre-existing `lib/dispatch-rule-checks.test.mjs` — no vitest suite, untouched)]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run matrix + existing dispatch audit tests (no regression)
  - [evidence: `npx vitest run pi/dispatch-preflight-lint.test.ts` 13/13 (7 original + 6 review-regression cases); full dispatch suite 54/54]
- [x] T007 Run validate.sh --strict on this folder
  - [evidence: `validate.sh --strict` — PASSED (Errors: 0, Warnings: 0)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`
  - [evidence: `grep -c "\[x\]" tasks.md` matches task count; completion verified via `validate.sh --strict`]
- [x] validate.sh --strict exits 0
  - [evidence: `bash validate.sh <folder> --strict` — RESULT: PASSED, 0 errors 0 warnings]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
