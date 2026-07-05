---
title: "Tasks: Validate.sh Registry Bridge"
description: "Task ledger for bridging orchestrator.ts's default validateFolder() path to registry-backed shell rules."
trigger_phrases:
  - "validate sh registry bridge"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/011-followup-remediation/006-validate-sh-registry-bridge"
    last_updated_at: "2026-07-01T21:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed registry bridge and full packet remediation"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Validate.sh Registry Bridge

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm siblings 003-scaffold-content-002-deep-loop-runtime, 004-scaffold-content-003-deep-loop-workflows, and 005-scaffold-content-004-through-007 all show Status: Complete. Evidence: all 3 verified Complete before dispatch.
- [x] T002 Read `validateFolder()` in `orchestrator.ts` and confirm the current native validator call sequence.
- [x] T003 Read `validator-registry.json` and confirm `rule_id`/`script_path`/`category`/`strict_only` shape for all entries.
- [x] T004 Read `run_all_rules()` in `validate.sh` and confirm its `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` parsing convention.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the bridge function to `orchestrator.ts` (reads `validator-registry.json`, derives skip-set from live `entries[]`). Evidence: `runRegistryShellRules()`, 181 insertions, purely additive (`git diff --stat`).
- [x] T006 Implement shell-out plus `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` parsing for each non-native registry rule.
- [x] T007 Wire the bridge function call into `validateFolder()` immediately after native entries are pushed.
- [x] T008 Verify skip-set derivation matches `entries[]` exactly for all currently-native validators (no double-running). Evidence: self-healing `nativeRuleIds` derived live from `entries[]`, not a hardcoded allowlist.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate.sh --strict --recursive` on the whole `030-deep-loop-improved` packet root; confirm 0 errors. Evidence: 12/12 folders, `Errors: 0` (only the repo-wide pre-existing `SECTION_COUNTS` warning remains, matching every other packet in the repo).
- [x] T010 Manual test: fixture folder with a known scaffold marker and `Status: Complete` fails under the default invocation (no `SPECKIT_RULES` set). Evidence: `072-scaffold-never-touched-violation` fixture fails via the default path; `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` explicit path still works unchanged; both independently re-run and confirmed.
- [x] T011 Document the pre-existing test-coverage gap and the discoveries this bridge surfaced in `implementation-summary.md`.
- [x] T012 Author `implementation-summary.md` and mark `spec.md`/`plan.md` Complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed (`validate.sh --strict` exits 0 for this folder).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
