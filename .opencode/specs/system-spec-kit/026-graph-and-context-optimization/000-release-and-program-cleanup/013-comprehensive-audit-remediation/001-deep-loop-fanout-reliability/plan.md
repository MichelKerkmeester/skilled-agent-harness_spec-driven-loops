---
title: "Implementation Plan: Phase 1: deep-loop-fanout-reliability [template:level_1/plan.md]"
description: "Sequence the fan-out worker fixes (A1 throw-on-failure, A2 async spawn, A4 service_tier, A5 sandbox note) in one region, thread the A3 iteration cap into the prompt, correct the A6 SKILL.md inventory, and strip A7 perishable comment labels, with regression tests in fanout-run.vitest.ts."
trigger_phrases:
  - "fanout reliability plan"
  - "deep loop fanout sequencing"
  - "async spawn fanout"
  - "fanout worker fixes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "013-comprehensive-audit-remediation/001-deep-loop-fanout-reliability"
    last_updated_at: "2026-06-04T23:10:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Sequenced and implemented A1-A7 per verified backlog"
    next_safe_action: "None remaining, phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-013-001-deep-loop-fanout-reliability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: deep-loop-fanout-reliability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) + TypeScript (zod schema) |
| **Framework** | Deep-loop runtime fan-out layer |
| **Storage** | Filesystem artifacts (orchestration-summary.json, status ledger, lineage dirs) |
| **Testing** | Vitest (run from `system-spec-kit/mcp_server`) |

### Overview
All four worker-region fixes (A1, A2, A4, A5) edit the same spawn / `buildLineageCommand` block of `fanout-run.cjs`, so they were sequenced A1 then A2 then A4 then A5 to avoid edit collisions. A3 (prompt cap) and A6 (SKILL.md) and A7 (comment hygiene) are independent. The pool primitive (`settleItem` / `buildPoolSummary`) stays frozen; failure routing happens by throwing from the worker so the existing catch path counts it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (shared pool primitive frozen)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (29 vitest tests across 3 suites)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Concurrency-capped worker pool with an injected async worker. The pool counts a worker as failed only when it throws; the worker is where CLI-exit/timeout semantics live.

### Key Components
- **`runLineageProcess` (new helper)**: non-blocking `spawn` wrapped in a Promise resolving a spawnSync-shaped result (`status`, `signal`, `stdout`, `error`); kills with SIGTERM on timeout and enforces a 20MB stdout cap.
- **fan-out worker**: builds the prompt + command, runs the subprocess, salvages stdout, then throws on non-zero exit or timeout.
- **`buildLoopPrompt`**: now threads `config.maxIterations` when `iterations` is set.
- **`buildLineageCommand` (cli-codex branch)**: conditionally appends `service_tier` only when set.

### Data Flow
Worker spawns the CLI subprocess, captures stdout, runs the salvage sweep, then either returns success or throws a failure carrying `{label, exitCode, timedOut, salvage}`. The pool settles the throw as rejected, `buildPoolSummary` counts it in `failed`, and `main()` maps the summary to the process exit code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| fanout-run.cjs worker | Produces per-lineage result consumed by the pool | update (throw on failure, async spawn) | vitest: non-zero exit -> exit 3, mixed -> exit 2, parallel timing < 1.9s |
| fanout-pool.cjs settleItem/buildPoolSummary | Counts fulfilled vs rejected workers | unchanged (shared with council; comment-only edit) | fanout-pool.vitest.ts still green |
| buildLineageCommand cli-codex | Emits codex CLI args including service_tier | update (omit when unset) | echo-stub argv assertion |
| buildLoopPrompt | Builds subprocess loop prompt | update (thread maxIterations) | echo-stub stdout assertion |
| resolve* sandbox helpers | Resolve per-kind sandbox/permission | unchanged for review (documented) | code comment + deep-review SKILL.md write-path inspection |

Required inventories:
- Consumers of the worker result shape: `rg -n 'exitCode|timedOut|salvage' .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.
- service_tier emitters/validators: `rg -n 'service_tier|SERVICE_TIERS' .opencode/skills/deep-loop-runtime`.
- Algorithm invariant: a worker that throws => pool-rejected => `summary.failed += 1` => non-zero process exit; salvage sweep always runs before the throw.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read verified backlog findings A1-A7
- [x] Re-read fanout-run.cjs, fanout-pool.cjs, executor-config.ts, tests
- [x] Confirm review write-path (A5 decision) and shared-pool contract

### Phase 2: Core Implementation
- [x] A7 comment hygiene (independent, lowest coupling) first
- [x] A2 import spawn + add runLineageProcess helper
- [x] A4 codex service_tier omission
- [x] A5 sandbox-default documentation note
- [x] A2 swap worker spawnSync for runLineageProcess
- [x] A1 throw on non-zero exit / timeout after salvage
- [x] A3 thread config.maxIterations into buildLoopPrompt
- [x] A6 SKILL.md script inventory

### Phase 3: Verification
- [x] node --check on modified .cjs
- [x] vitest (3 suites) green
- [x] tsc --noEmit for code-graph clean
- [x] grep proves A7 comment hygiene
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Non-zero exit -> failure; mixed exits; parallel timing; service_tier omission; iteration cap | Vitest |
| Integration | Stub-binary fan-out run end to end via spawnCjs | Vitest |
| Manual | A6 script count vs `ls`; A7 grep for perishable labels | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| fanout-pool.cjs (shared pool primitive) | Internal | Green | Must stay frozen; fixes confined to worker |
| executor-config.ts SERVICE_TIERS enum | Internal | Green | Defines the valid tier set A4 must respect |
| deep-research / deep-review loop maxIterations consumption | Internal | Green | A3 prompt line relies on the loop honoring config.maxIterations |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fan-out regression (false failures, deadlocked pump, or lost stdin).
- **Procedure**: Revert `fanout-run.cjs` to the prior spawnSync worker and its return-object behavior; the comment-only edits (A6, A7) and tests can stay.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
