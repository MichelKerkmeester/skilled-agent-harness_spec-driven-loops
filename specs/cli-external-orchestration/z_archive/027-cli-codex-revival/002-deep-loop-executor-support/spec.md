---
title: "Feature Specification: Deep-loop Codex executor support"
description: "Restore cli-codex as an accepted, audited deep-loop executor while failing closed before dispatch when the Codex binary is absent."
trigger_phrases: ["cli-codex executor", "Codex fanout", "Codex executor audit"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-13T05:37:00Z"
    last_updated_by: "opencode"
    recent_action: "Restored accepted fail-closed cli-codex runtime support"
    next_safe_action: "Wait for phase 003 hub rename dependency"
    blockers: []
    key_files: [".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts", ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-002", parent_session_id: "134-wave1" }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Runtime config accepts cli-codex; fan-out checks binary availability before command construction."]
---
# Feature Specification: Deep-loop Codex executor support
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete — repository-baseline suite gap documented (SC-002 amended) |
| **Created** | 2026-07-13 |
| **Branch** | `wt/goalD-codex` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../001-codex-contract-pin/spec.md` |
| **Successor** | `../003-cli-codex-skill-packet/spec.md` |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The deep-loop runtime rejects `cli-codex`, lacks its command adapter and audit metadata, and therefore cannot run Codex lineages. Simply accepting the enum would recreate an advertised-but-unusable route when the binary is absent.
### Purpose
Restore the historical Codex executor symmetrically with current executor kinds, with an explicit availability preflight that rejects before spawn.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Add `cli-codex` to executor kinds and its supported flag matrix.
- Restore `codex exec` fan-out construction and stdin prompt delivery.
- Restore audit binary, session, state, home, and environment maps.
- Accept the kind in the AI-council executor allowlist.
- Retarget rejection coverage to acceptance and add absent-binary coverage.
### Out of Scope
- Creating the `cli-codex` skill or globally advertising the route.
- Hook adapters, agent TOMLs, or docs rollout.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `runtime/lib/deep-loop/executor-config.ts` | Modify | Kind and flags. |
| `runtime/lib/deep-loop/executor-audit.ts` | Modify | Audit and recursion metadata. |
| `runtime/scripts/fanout-run.cjs` | Modify | Adapter and availability gate. |
| `runtime/tests/unit/*.vitest.ts` | Modify | Acceptance, adapter, and fail-closed tests. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Accept `cli-codex` config | Parser and fan-out schema return the kind. |
| REQ-002 | Restore adapter | Command uses `codex exec`, model/reasoning/tier/sandbox, and stdin. |
| REQ-003 | Fail closed | A PATH without Codex throws a clean unavailable error before command construction. |
| REQ-004 | Preserve default behavior | Native and existing CLI tests remain green. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-005 | Audit symmetry | Codex binary/session/state/home/env maps participate in existing guards. |
| REQ-006 | No forced enablement | Runtime acceptance alone does not advertise Codex; phase 003 owns route availability. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `EXECUTOR_KINDS` contains `cli-codex`.
- **SC-002 (AMENDED — not met as originally worded)**: Original bar was "Full runtime Vitest suite passes." Actual result: 606/694 (88 failures traced to a pre-existing repository dependency baseline — missing runtime-local `better-sqlite3`/`tsx` and stale AI-council contract digests — not caused by this phase's `cli-codex` changes; see `checklist.md` CHK-022 and `implementation-summary.md`). This phase's own acceptance is instead carried by the 157/157 focused executor/audit/fan-out suite (CHK-020) and the explicit fail-closed absent-binary test (CHK-021). The unqualified full-suite-green bar is descoped to a documented pre-existing blocker, not fabricated as passing.
- **SC-003**: Changed TypeScript modules pass strict typecheck.
- **SC-004**: Absent-binary test proves clean fail-closed rejection.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Binary absent | Unusable executor | `command -v codex` preflight before adapter output. |
| Risk | Environment leak | Credential or state crossover | Existing per-kind allowlist with Codex prefixes only. |
| Dependency | Phase 003 availability gate | Route advertisement | Keep this phase runtime-only and document ownership. |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
- None for Wave 1. Global advertisement and user-facing route selection remain phase 003 work.
<!-- /ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
- Reliability: absent Codex binaries fail before spawn and before retries consume executor time.
- Security: `approval_policy=never` and the selected runtime sandbox remain explicit.
<!-- /ANCHOR:nfr -->
<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
- Missing model uses the historical adapter default; phase 003 may impose stricter skill-level requirements.
- Missing service tier omits the setting so Codex uses its account default.
- Missing binary returns a typed input-validation error instead of ENOENT subprocess noise.
<!-- /ANCHOR:edge-cases -->
<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 14/25 | Config, fan-out, audit, council allowlist, tests. |
| Risk | 15/25 | Executor availability and process boundaries. |
| Research | 6/20 | Historical adapter is available as an oracle. |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
