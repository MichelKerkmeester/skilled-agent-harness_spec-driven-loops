---
title: "Implementation Summary: Expected Daemon Classifier and Process Sweep"
description: "Completed phase-005 sweep surface, ancestry helper, classifier taxonomy, and verification evidence."
trigger_phrases:
  - "expected-daemon-classifier-and-process-sweep"
  - "memory leak 5"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep"
    last_updated_at: "2026-05-22T13:13:51Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-005-daemon-classifier-sweep"
    next_safe_action: "start-006-cocoindex-remove-cancel"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0505050505050505050505050505050505050505050505050505050505050505"
      session_id: "009-memory-leak-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 005 remains dry-run only; live termination is deferred to phase 010."
      - "Expected daemons and external tools preserve by default."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Expected Daemon Classifier and Process Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 005 delivered a dry-run process sweep surface and extended the phase-002 process-memory harness.

- Added `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`.
- Added `planSweep(inventory, { selfPid })`, returning rows with `pid`, `ppid`, `command`, `classification`, `eligibleForTermination`, and `rationale`.
- Added a default `plan` CLI mode and deterministic `fixture` mode. Phase 014 B6 removed the misleading non-destructive `apply --confirmed <token>` alias; no destructive apply command exists.
- Extended `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` with `Inventory`, `ProcessClassification`, `getProcessAncestry(pid, rows)`, `collectInventory()`, and `hasKnownProjectOwnerMarker()`.
- Extended harness classification with `expected-warm-daemon`, `orphaned-project-daemon`, `external-mcp-stdio`, `browser-session`, `ccc-daemon`, `eperm-alive-unowned`, `stale-pid-lock`, and `unknown-owner`.
- Added `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts` for the SC-001 fixture matrix.
- Updated `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` for the new taxonomy and ancestry export.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sweep layer consumes the existing inventory instead of replacing it. `process-memory-harness.ts` still owns `ps`, `vm_stat`, `sysctl`, PID-lock parsing, and row classification. `process-sweep.ts` owns termination-plan eligibility only.

Eligibility is deliberately narrow:

1. `self-pid-refused` for `pid === selfPid`.
2. `ancestor-refused` for any PID in `getProcessAncestry(selfPid, inventory.processes)`.
3. `expected-warm-preserved` for expected warm daemons.
4. `unknown-owner-refused` for unknown owners and EPERM-alive rows.
5. `stale-or-orphan` only for `stale-pid-lock` or `orphaned-project-daemon` rows with known project identity.
6. `default-preserve` for all remaining external MCP, browser, `ccc`, zombie, current-session descendant, and non-target rows.

No broad `pkill` or process-name kill pattern was added. No implementation path calls `process.kill()` for termination.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `role` and add `classification` | Existing harness callers keep compatibility while the sweep gets precise policy labels. |
| Treat owner-token-less `ccc` rows as `ccc-daemon` and preserve | Packet 024 requires inventory first; phase 010 owns operator-confirmed cleanup. |
| Preserve browser and external MCP rows | Source packet 020 says these need explicit close/stop paths outside broad sweep cleanup. |
| Require known project identity before marking stale/orphan rows eligible | Remediation-map item #6 requires exact identity before destructive cleanup. |
| Keep `apply` non-destructive even with `--confirmed` | Phase 005 has no operator-token policy; phase 010 owns confirmation gates and runbook behavior. |
| Pipe failed telemetry command stderr into the harness fallback | CLI JSON stays parseable when sandbox denies `ps`, `vm_stat`, or `sysctl`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase strict validation after `plan.md` authoring | Passed: 0 errors, 0 warnings. |
| Phase strict validation after `tasks.md` authoring | Passed: 0 errors, 0 warnings. |
| Targeted sweep Vitest | Passed: `process-sweep.vitest.ts`, 1 file, 10 tests. |
| Sweep plus existing harness Vitest | Passed: 2 files, 17 tests. |
| Typecheck | Passed: `npm run typecheck --workspace=@spec-kit/scripts`. |
| Build | Passed: `npm run build --workspace=@spec-kit/scripts`. |
| CLI fixture dry run | Passed: `node scripts/dist/ops/process-sweep.js fixture --pretty`; 11 rows, 3 eligible, 8 preserved, `dryRun: true`. |
| CLI live apply | Reconciled by phase 014 B6: `apply --confirmed` is no longer a supported dry-run alias; operators use `plan --pretty` for evidence. |
| OpenCode alignment | Passed with 0 errors and 44 warnings from the wider scanned scope. |
| Final strict phase validation | Passed: 0 errors, 0 warnings. |
| Final strict parent arc validation | Passed: 0 errors, 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. EPERM classification depends on inventory rows carrying `eperm: true`; POSIX `ps` output alone does not expose permission-denied liveness.
2. Live inventory can be empty in restricted sandboxes when process enumeration is denied. The deterministic fixture and unit tests cover policy behavior.
3. No destructive apply command exists. Phase 014 B6 removed the old dry-run `apply --confirmed <token>` alias; a future signal-sending command needs a separate operator policy packet and a new command name.
4. Sidecar ownership is classified and preserved here; phase 008 owns the port ledger, health payload, stale exact-PID sidecar cleanup, and reuse policy.
5. Alignment verification reports 44 warnings in the broader `system-spec-kit` scan, but no errors. Those warnings are outside the phase-005 changed files.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Suggested commit message:

```text
feat(009/005): expected daemon classifier + dry-run process sweep
```

Absolute paths for commit review:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/graph-metadata.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/remediation-map.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep/implementation-summary.md`
