---
title: "Tasks: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced"
description: "Task breakdown for 028-fanout-dispatch-integrity: confirm-before-build pass over 12 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "fanout dispatch integrity"
  - "fanout fulfillment artifact contract"
  - "write containment dirty path"
  - "executor audit provenance"
  - "deep loop 028 fanout"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity"
    last_updated_at: "2026-08-08T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Added the AI Execution Protocol section; T005-T020 remain honestly unchecked"
    next_safe_action: "Re-land F-016-01/F-016-06 with runner argv support + env test"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 83
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 | T001-T004 | Worktree, classification, and enumerations |
| M2 | T005-T007 | Artifact-contract fulfillment |
| M3 | T008-T010 | Provenance durable and distinguishable |
| M4 | T011-T016 | Uniform containment and argv dispatch |
| M5 | T017-T020 | Sink allowlisted; delta clean |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm, isolate and enumerate [M1]

Blast-radius rule: every dispatch test in this child runs in an isolated worktree. `F-016-02` was observed live reverting 15 untracked files belonging to a concurrent session.

- [x] T001 Set up an isolated git worktree before any dispatch work; record the path [1h] Evidence: worktree at `.worktrees/0129-system-deep-loop-036-remediation-execution` on `system-deep-loop/0129-036-remediation-execution`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T002 **CONFIRM BEFORE BUILD.** For each of the 12 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. Line anchors here are among the most likely to have drifted: §5 records that a concurrent session was editing executor configuration and fan-out code during the review. (`spec.md` §3 scope table) [4h] {deps: T001}
- [x] T003 Enumerate existing lineage artifact shapes so the contract does not reject genuine historical lineages [4h] {deps: T002} Evidence: lineage census below found producers write state JSONL, `iterations/iteration-NNN.md`, deltas, findings registries, and terminal reports via `fanout-run.cjs`.
- [x] T004 Enumerate wrapper shell usage so argv dispatch does not silently remove a relied-on feature [3h] {deps: T002} Evidence: wrapper census below found four `command: |` shell blocks (research/review x auto/confirm) with interpolated values and no argv-native YAML field.

### T001-T004 Evidence Record

Baseline commit: `9229cb8f3e281c9291e6d631237528bc755e6f4b`. The current linked worktree is isolated at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0129-system-deep-loop-036-remediation-execution` on `system-deep-loop/0129-036-remediation-execution`. The mandated `git checkout -- database/` cleanup was attempted before tests but the sandbox rejected the linked-worktree index lock; `runtime/database/` was clean before and after the baseline suites.

| Finding | Cited location at review time | T001 status | HEAD probe |
|---|---|---|---|
| `F-010-01` | `runtime/scripts/fanout-run.cjs:553` | `CONFIRMED` | `expectedLineageArtifactPaths()` returns only `review-report.md` or `research.md` at `fanout-run.cjs:553-557`; `findMissingLineageArtifacts()` checks only that list at `567-570`. |
| `F-010-02` | `runtime/scripts/fanout-run.cjs:674` | `MOVED` | The cited line is now the `records` assignment; the same defect is at `fanout-run.cjs:689-697`, where finite `synthesis.totalIterations` is trusted instead of the actual iteration count. |
| `F-010-03` | `runtime/scripts/fanout-run.cjs:2272` | `MOVED` | The cited line is now `effectivePermission`; the drop is at `fanout-run.cjs:2274-2288`, where `effectiveConfig` and `invocationFingerprint` returned by `buildLineageCommand()` are destructured away. |
| `F-010-04` | `runtime/lib/deep-loop/executor-audit.ts:824` | `CONFIRMED` | `buildExecutorAuditRecord()` returns only `kind`, `model`, `reasoningEffort`, `serviceTier`, and optional `lineageId` at `executor-audit.ts:824-831`; sandbox, timeout, search policy, config directory, governor, and executable identity are absent. |
| `F-016-01` | `commands/deep/assets/deep-research-auto.yaml:165` | `CONFIRMED` | The fan-out command block at `deep-research-auto.yaml:165-171` interpolates `research_topic`, `config.fanout_json`, and paths into a shell command. The same shape is present in the research-confirm and review auto/confirm fan-out blocks. |
| `F-016-02` | `runtime/scripts/fanout-run.cjs:1593` | `CONFIRMED` | `buildNativeLineageCommand()` hardcodes `--dangerously-skip-permissions` and `process.cwd()` at `fanout-run.cjs:1593-1600`, ignoring the resolved sandbox and permission values. |
| `F-016-03` | `runtime/scripts/fanout-run.cjs:1630` | `CONFIRMED` | `buildOpencodeLineageCommand()` emits no enforcing sandbox flag for `read-only` or `workspace-write`; only `danger-full-access` adds the bypass at `fanout-run.cjs:1630-1646`. |
| `F-016-04` | `runtime/lib/deep-loop/write-containment.ts:295` | `CONFIRMED` | `detectNewOutOfScopeViolations()` subtracts pre-existing paths by pathname at `write-containment.ts:295-313`, so later content changes to a dirty path are invisible. |
| `F-016-05` | `runtime/lib/deep-loop/write-containment.ts:238` | `CONFIRMED` | `resolveArtifactScope()` returns `null` for an artifact realpath outside the worktree at `write-containment.ts:238-256`; snapshot and detection convert that to an empty result at `277-279` and `295-298`. |
| `F-016-06` | `runtime/scripts/codex-dispatch.cjs:122` | `CONFIRMED` | `dispatchCodex()` passes `{ ...process.env, AI_SESSION_CHILD: '1' }` to `spawnSync()` at `codex-dispatch.cjs:122-130`, forwarding the complete parent environment. |
| `F-020-01` | `runtime/lib/deep-loop/observability-events.cjs:109` | `CONFIRMED` | `normalizeObservabilityEvent()` persists `{ ...payload }` unchanged at `observability-events.cjs:100-110`, with no sink allowlist or nested redaction. |
| `F-020-02` | `runtime/lib/deep-loop/observability-events.cjs:137` | `CONFIRMED` | `appendObservabilityEvent()` interpolates `envelope.payload.label` into stderr at `observability-events.cjs:134-139` for loud lifecycle events. |

Severity calibration carried forward verbatim: operator/stale-local robustness and cutover-readiness risk, not remote-attacker breach.

The lineage census found the existing fan-out gate checks only the top-level report, state-log presence for review max-iterations, and a limited iteration count; existing producers write state JSONL, `iterations/iteration-NNN.md`, deltas, findings registries, and terminal reports through the mode-specific command assets. The wrapper census found four fan-out command blocks (research/review × auto/confirm), all using shell `command: |` blocks with interpolated values; none declares an argv-native YAML field, so the replacement must enter through a fixed executable boundary and pass structured data without shell parsing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Artifact contract [M2]

- [ ] T005 Define the per-mode artifact contract and decide where it lives (registry versus per-asset) [5h] {deps: T003}
- [ ] T006 Validate state JSONL, iteration records, deltas, findings registry and terminal synthesis before fulfilling a lineage (`F-010-01`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [10h] {deps: T005}
- [ ] T007 Derive iteration counts from actual iteration files rather than a synthesis self-report (`F-010-02`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [6h] {deps: T006}

### Provenance [M3]

- [ ] T008 Carry `effectiveConfig` and `invocationFingerprint` through to the worker (`F-010-03`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [4h] {deps: T006}
- [ ] T009 Record sandbox mode, timeout, web-search policy, config dir, governor and executable identity in the audit (`F-010-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`) [5h] {deps: T008}
- [ ] T010 Assert audit distinctness for materially different invocations in the existing receipts suites (`.opencode/skills/system-deep-loop/runtime/tests/executor-audit-*.test.ts`) [4h] {deps: T009}

### Containment and dispatch [M4]

- [ ] T011 Reject sandbox modes a dispatch kind cannot enforce, instead of recording them as effective (`F-016-03`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [5h] {deps: T006}
- [ ] T012 Stop hardcoding permission bypass in native dispatch; honour the computed sandbox mode (`F-016-02`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) [6h] {deps: T011}
- [ ] T013 Run post-dispatch containment for every kind, not only `cli-codex` (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`) [6h] {deps: T012}
- [ ] T014 Detect dirty-path truncation by content identity rather than exempting by pathname (`F-016-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`) [5h] {deps: T013}
- [ ] T015 Hard-fail an out-of-worktree artifact scope instead of returning an empty violation list (`F-016-05`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`) [3h] {deps: T013}
- [ ] T016 Move fan-out wrappers to argv dispatch (`F-016-01`, calibrated) and filter the standalone Codex environment (`F-016-06`) (`.opencode/skills/system-deep-loop/commands/deep/assets/`, `.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs`) [8h] {deps: T004}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Sink and gate [M5]

- [ ] T017 Allowlist the persisted observability payload; redact or reject credential-shaped keys and prompt or error text in nested payloads (`F-020-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs`) [5h] {deps: T009}
- [ ] T018 Stop interpolating raw lineage labels onto stderr for the three loud events (`F-020-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs`) [2h] {deps: T017}
- [ ] T019 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test` including the receipts suites; report the delta against the `021` baseline [3h] {deps: T007, T010, T014, T015, T016, T018}
- [ ] T020 Independent adversarial verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity --strict` exits 0 [6h] {deps: T019}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [ ] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [ ] All ADRs have a terminal status (Accepted or Superseded)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->

---

## AI Execution Protocol

### Pre-Task Checklist

- Read the authored packet documents and cited implementation sites before editing.
- Confirm each of the 12 scoped finding IDs at HEAD (T001-T004) and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit.
- Keep the worktree and touched-file scope fixed to the 7 files named in `spec.md` §3; stop on uncertainty or a failing verification.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Read before edit | Re-read the target file and surrounding contract before every patch. |
| Scope lock | Modify only the packet's in-scope implementation, tests, and documentation. |
| Red/green | Add or run a failing regression fixture before each fix, then rerun it green. |
| Fail closed | Do not treat absent, malformed, or unbound evidence as success. |
| Revert over partial ship | When a fix is implemented, tested, and found not to close the finding or to regress an existing guarantee, revert it and record the gap rather than land it. |

### Status Reporting Format

Report each gate as `T###`, command, return code, result, and evidence artifact or test name. Distinguish confirmed evidence from inference and name any allowed pre-existing failure.

### Blocked Task Protocol

On a missing file, line mismatch, merge conflict, test failure, or unclear production boundary, halt the edit, record the exact blocker and rollback target, and do not substitute an unapproved workflow. `F-016-01` (argv dispatch) and `F-016-06` (Codex env allowlist) were both implemented, found to either not close the finding or regress an existing guarantee, and reverted before landing rather than shipped with a known gap — see `implementation-summary.md` Known Limitations.
