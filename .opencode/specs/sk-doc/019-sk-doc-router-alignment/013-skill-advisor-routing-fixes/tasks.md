---
title: "Tasks: system-skill-advisor Routing Fixes"
description: "Task Format: T### [P?] Description (file path). One task per research.md Section 8 fix-plan item, each carrying its own verification command from Section 9 or its acceptance criterion from Section 10."
trigger_phrases:
  - "skill advisor routing fixes tasks"
  - "advisor fix task list"
  - "P0 correctness fix tasks"
  - "gated shadow experiment task"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/013-skill-advisor-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored one task per fix-plan item with its verification command or acceptance criterion"
    next_safe_action: "Await operator authorization, then start T001"
    blockers:
      - "T005 (P1-5) is blocked on joint fixture design with sibling packet 012-sk-doc-routing-fixes"
      - "T008 (P2-8) is blocked on T004 (P0-4) landing"
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-skill-advisor-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: system-skill-advisor Routing Fixes

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T000 Confirm operator authorization to start implementation
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Covers fix-plan items P0-1 through P2-8.

- [ ] T001 [P] Reconcile the no-brief output contract (`.opencode/skills/system-skill-advisor/mcp_server/hooks/claude/user-prompt-submit.ts:228-245`, `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:143-178`, `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md`). Decide `{}` vs governance fallback directive per decision-record.md ADR-007, align all three files. Verification: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/hooks/claude-user-prompt-submit-hook.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`
- [ ] T002 [P] Reserve fallback budget and add live handoff timing tests (`.opencode/skills/system-skill-advisor/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skills/system-skill-advisor/mcp_server/hooks/lib/skill-advisor-cli-fallback.ts`, `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`). Pass `hookBudget - fallbackReserve` as the primary `subprocessTimeoutMs`. Add tests: primary-timeout to fallback-success, probe-timeout within total budget, `skipped` to no CLI, daemon-absent to exit 75. Verification: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/hooks/claude-user-prompt-submit-hook.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`
- [ ] T003 [P] Repair executor-delegation coherence (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`, `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json`, `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts`). Replace the stale `suppressed-codex-abstain` fixture with a genuinely retired executor alias. Cover the existing-candidate branch (`executor-delegation.ts:470-477`) with branch-provenance assertions. Add a single finalization boundary in `fusion.ts:839-868` so `result.ambiguous` derives from the post-override cluster. Verification: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/scorer/executor-delegation.vitest.ts --reporter=verbose`
- [ ] T004 Repair calibration measurement freshness (`.opencode/skills/system-skill-advisor/mcp_server/bench/scorer-calibration-baseline.json`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/joined-calibration-report.cjs`, `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts`). Regenerate both baselines against the clean 193-row corpus. Add one joined evaluator report: holdout top-1, ambiguity accuracy, floor frequency, Brier/ECE reliability bins. Measurement repair only, no scorer changes. Verification: `shasum -a 256 .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/*.jsonl`, then `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/parity/scorer-eval-baseline-ratchet.vitest.ts`
- [B] T005 Build the metadata-hub advisor-discovery battery, coordinated with sibling packet `012-sk-doc-routing-fixes` (`.opencode/skills/system-skill-advisor/mcp_server/tests/metadata-hub-discovery-battery.vitest.ts`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs`). Blocked on joint fixture format and location confirmation with packet 012. One representative prompt plus hard negatives per sk-doc workflow mode, routed through the real scorer at compat thresholds. Extend `parent-skill-check.cjs` to fail on a missing fixture. Do not mirror the 113 aliases into `graph-metadata.json`. Verification: new suite green, `parent-skill-check.cjs` fails closed on a synthetic missing-fixture case
- [ ] T006 [P] Build the advisor-threshold-surface-parity suite (`.opencode/skills/system-skill-advisor/mcp_server/tests/parity/advisor-threshold-surface-parity.vitest.ts`, `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/runtime-parity.vitest.ts`). Env-override rows (after `vi.resetModules()`) across MCP dispatch, shared brief, Claude hook entry, CLI fallback args. Call-override rows across MCP and shared brief only. Absorb or rename the mislabeled `runtime-parity.vitest.ts`. Verification: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/parity/advisor-threshold-surface-parity.vitest.ts`
- [ ] T007 [P] Split the transport diagnostic taxonomy and repair stale docs (`.opencode/skills/system-skill-advisor/mcp_server/hooks/lib/skill-advisor-cli-fallback.ts`, `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md`, manual playbook). Split `mcp_channel_unavailable`, `warm_daemon_unavailable`, `probe_timeout`, `cli_timeout`, state CLI-recoverability per code. Fix authored-source vs build-owner vs executed-dist ownership paths. Add a dist-freshness assertion. Verification: `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"test"}' --warm-only --format json --timeout-ms 3000`
- [B] T008 Run the shadow `taskIntentFloor` calibration experiment (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/shadow-floor-experiment.cjs`). Blocked on T004. Public thresholds stay unchanged. Single candidate: `taskIntentFloor` 0.82 to 0.80, accepted only if holdout at or above 57/78, coverage at or above 61/78, ambiguity slice at or above 16/25. Verification: joined evaluator (T004's output) run against the candidate, strict accept or reject recorded
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run all 4 Section 9 verification commands in order: hook and fallback suites, executor-delegation parity in verbose mode, baseline hash freshness plus ratchet suite, warm-only CLI fallback exit-75 check
- [ ] T010 Confirm the Section 10 acceptance matrix holds for all 7 rows (P0-1 through P2-8), record the P2-8 accept-or-reject verdict explicitly
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T005's packet-012 coordination resolved, T008's T004 dependency satisfied)
- [ ] All 7 Section 10 acceptance-matrix rows confirmed, including a strict P2-8 verdict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: `../011-skill-advisor-routing-research/research/research.md` (Sections 8-11)
- **Sibling Fix Packet (T005 coordination)**: `../012-sk-doc-routing-fixes/tasks.md`
<!-- /ANCHOR:cross-refs -->
