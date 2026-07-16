---
title: "Feature Specification: Fan-Out Hardening (Detached CLI Review Lineages)"
description: "Harden the detached CLI fan-out path: review setup bindings, salvage/retry classification, opt-in sandbox, leaf-only lineage merge, observability status mapping."
trigger_phrases:
  - "fan out hardening"
  - "detached cli review lineage salvage retry"
  - "fanout merge leaf only lineage"
  - "cli opencode sandbox opt in"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/008-loop-systems-remediation/007-fan-out-hardening"
    last_updated_at: "2026-06-30T15:30:00Z"
    last_updated_by: "glm-fanout-review"
    recent_action: "Shipped fan-out hardening fixes from GLM review findings P1-001..005, P1-011-001, P2-009-001"
    next_safe_action: "Phase complete; fixes applied and full suite green (549 tests)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-fanout-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Salvage/retry: salvage.failed > 0 now always rejects the lineage and is classified retryable (artifact_miss), so partial-output lineages are retried rather than silently fulfilled or treated as fatal exit."
      - "Sandbox: --dangerously-skip-permissions is now opt-in via sandboxMode: danger-full-access; the prompt-only write boundary is surfaced as a fatal warning."
---
# Feature Specification: Fan-Out Hardening (Detached CLI Review Lineages)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Branch** | current workspace |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 |
| **Predecessor** | 006-p2-test-adequacy-and-source-only-audit |
| **Successor** | None |
| **Handoff Criteria** | Full deep-loop-runtime Vitest suite passes with the new fan-out regressions included. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase remediates seven active P1 findings and one P2 advisory surfaced by the detached GLM fan-out review lineage (`review/lineages/glm/review-report.md`). All findings cluster in the detached CLI fan-out dispatch, salvage/retry, merge, and observability paths.

**Scope Boundary**: detached CLI fan-out prompt construction, salvage success gates, retry classification, sandbox/permission dispatch, registry-only merge of leaf-only lineages, and observability status mapping. No changes to single-executor paths or the native fan-out command contract beyond the shared prompt fix.

**Dependencies**: Phases 001-006 (prior remediation children) shipped; fan-out runtime test suite (`tests/helpers/spawn-cjs.ts`) loadable.

**Deliverables**: shipped code fixes plus regression tests (exit-0/no-artifact salvage guard, leaf-only merge reconstruction, cli-opencode sandboxMode acceptance) and an updated adversarial playbook.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The detached CLI fan-out path had: (1) review init bindings missing from CLI prompts, (2) unrecoverable salvage yielding false-fulfilled lineages, (3) mixed-salvage failures treated as fatal instead of retryable, (4) prompt-only write isolation via unconditional `--dangerously-skip-permissions`, (5) a playbook regression that did not exercise the documented exit-0/no-artifact path, (6) registry-only merge silently skipping leaf-only lineages, and (7) lag-ceiling observability events normalizing to `unknown`.

### Purpose
Make detached fan-out review lineages initialize correctly, reject/retry partial-output lineages, run with an opt-in trust boundary, reach merge even when registry-absent, and emit typed observability statuses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1-001 review setup bindings in `buildLoopPrompt`.
- P1-002 salvage-failure gate before fulfilled return.
- P1-003 `artifact_miss` retry class.
- P1-004 opt-in `--dangerously-skip-permissions` + `sandboxMode` support for cli-opencode.
- P1-005 exit-0/no-artifact regression test + playbook repoint.
- P1-011-001 `reconstructReviewRegistryFromState` leaf-only merge fallback.
- P2-009-001 lag-ceiling event status mapping.

### Out of Scope
- Wave assignment model (still rejected by the flat-pool guard).
- Native fan-out command contract changes beyond the shared prompt binding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Prompt bindings, salvage gate, sandbox opt-in, lag-ceiling status mapping |
| `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | Modify | `artifact_miss` retry class |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modify | Leaf-only registry reconstruction |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | `sandboxMode` support for cli-opencode |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | exit-0/no-artifact regression |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modify | reconstruction regression |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | Modify | sandboxMode acceptance contract |
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | Modify | Pre-existing duplicate-decl fix (unblocked the suite) |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/fanout/fanout-salvage-recovery.md` | Modify | Repoint to exit-0/no-artifact regression |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A detached CLI review lineage prompt must carry review setup bindings | grep `review_target` in `buildLoopPrompt` output; preflight no longer infers |
| REQ-002 | An exit-0 lineage with `salvage.failed > 0` must not be fulfilled | New salvage gate throws; `treats an exit-0/no-artifact lineage as salvage-miss` test passes |
| REQ-003 | Mixed-salvage failures must be retryable | `classifyLineageFailure` returns `artifact_miss` + `retryable: true` for `{salvaged:>0, failed:>0}` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `--dangerously-skip-permissions` must be opt-in | Only emitted when `sandboxMode === 'danger-full-access'`; fatal warning emitted; `accepts sandboxMode for cli-opencode` test passes |
| REQ-005 | Leaf-only review lineages must reach merge | `reconstructReviewRegistryFromState` unit tests pass |
| REQ-006 | Playbook must reference the exit-0/no-artifact regression | Playbook step 2 names the new test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full `deep-loop-runtime` Vitest suite passes (60 files / 549 tests observed post-fix).
- **SC-002**: Each fix names a runnable regression that fails when the bug returns (exit-0/no-artifact guard, merge reconstruction, sandboxMode acceptance).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Behavior change | cli-opencode no longer skips permissions by default | Autonomous write-heavy lineages may block | Operators set `sandboxMode: danger-full-access`; fatal warning surfaces it |
| Dependency | Vitest binary + loadable `spawn-cjs.ts` harness | Suite cannot run | Pre-existing duplicate fixed; suite green |
| Limitation | opencode has no path-scoped write flag | lineageDir boundary still prompt-only for workspace-write | Dangerous bypass is opt-in; boundary documented in fatal warning |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All seven findings remediated in-code; formalization tracked here.
<!-- /ANCHOR:questions -->
