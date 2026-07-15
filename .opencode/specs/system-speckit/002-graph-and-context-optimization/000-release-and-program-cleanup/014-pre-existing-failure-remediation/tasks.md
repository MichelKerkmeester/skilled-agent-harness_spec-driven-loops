---
title: "Tasks: Pre-existing test + doc failure remediation"
description: "Task list for reconciling pre-existing advisor/feature-flag/deferred-suite/dead-code/EINVAL failures."
trigger_phrases:
  - "pre-existing failure remediation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/014-pre-existing-failure-remediation"
    last_updated_at: "2026-06-05T08:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "All lanes implemented + verified green/clean-skip"
    next_safe_action: "Commit + push"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts"
---
# Tasks: Pre-existing test + doc failure remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` done · `[ ]` pending. Implemented by gpt-5.5 worker lanes + orchestrator review/correction.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Classify the pre-existing failures from `../013-comprehensive-audit-remediation/central-verification-record.md`; confirm none introduced by 013/014/015.
- [x] T002 Scope file-disjoint lanes (advisor, feature-flag docs, spec-kit deferred suites, code-index EINVAL).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 [REQ-001] Advisor: reconcile renderer/hook/brief/plugin/parity expectations + fixtures; fix render.ts hygiene-directive cap-ordering.
- [x] T004 [REQ-002] feature-flag-reference-docs: update test filename constants to renumbered docs; revert duplicate-file hack.
- [x] T005 [REQ-003] Gate handler-memory-index + shadow-evaluation-runtime to skip without DB fixtures (mirror vector-index-impl).
- [x] T006 [REQ-004] Fix stale dead-code-regression canary (symbol still in use).
- [x] T007 [REQ-005] security-hardening: accept EADDRINUSE|EINVAL for non-socket bind.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 Typecheck clean (advisor/spec-kit/code-index).
- [x] T009 Affected suites green/clean-skip: advisor full (452/4), feature-flag-reference-docs, handler-memory-index + shadow-evaluation (skipped), dead-code-regression, security-hardening.
- [x] T010 Comment hygiene clean on changed source/test files; no duplicate files; validate.sh --strict on this folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All affected suites pass or cleanly skip; typecheck clean; no assertion weakened; no duplicate files.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Source of the failure classification: `../013-comprehensive-audit-remediation/central-verification-record.md`.
- Sibling (out of scope here): `006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening` (O6).
<!-- /ANCHOR:cross-refs -->
