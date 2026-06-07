---
title: "SWEEP-003 -- CLI Council Seats"
description: "This scenario validates CLI Council Seats for `SWEEP-003`. It focuses on the concurrent dispatch of CLI executor seats via multi-seat-dispatch.cjs and the per-kind CLI flag requirements."
---

# SWEEP-003 -- CLI Council Seats

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SWEEP-003`.

---

## 1. OVERVIEW

This scenario validates CLI Council Seats for `SWEEP-003`. It focuses on `step_sweep_cli_pool` using `multi-seat-dispatch.cjs#dispatchCouncilSeats` to fan CLI seats out concurrently, with correct per-kind flags: closed stdin (`</dev/null`) for cli-opencode, `--sandbox read-only` for cli-codex, and `--permission-mode plan` for cli-claude-code.

### Why This Matters

CLI seat dispatch flags are critical for safety and performance. A cli-opencode seat without closed stdin hangs waiting for TTY input in non-interactive automation. A cli-codex seat without `--sandbox` can mutate files. These flags are the outer wall preventing CLI seats from violating the read-only seat contract.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SWEEP-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `step_sweep_cli_pool` uses the correct per-kind CLI dispatch flags and that `multi-seat-dispatch.cjs` provides `dispatchCouncilSeats`.
- Real user request: `Verify that CLI seats are dispatched with the correct flags and through the council scaffold.`
- Prompt: `As a manual-testing orchestrator, validate the CLI council seats dispatch contract for deep-context against the auto YAML, loop_protocol.md, and SKILL.md §4 ALWAYS rules. Verify cli-opencode seats use closed stdin and omit top-level --agent; cli-codex seats use --sandbox read-only; and multi-seat-dispatch.cjs provides dispatchCouncilSeats. Return a concise verdict.`
- Expected execution process: Read loop_protocol.md §5 for CLI seat dispatch requirements; read SKILL.md §4 ALWAYS rule 5 for cli-* contract compliance; check `multi-seat-dispatch.cjs` for `dispatchCouncilSeats` export; read auto YAML for `step_sweep_cli_pool`.
- Expected signals: `multi-seat-dispatch.cjs` is referenced in loop_protocol.md §5; SKILL.md ALWAYS rule 5 mandates `</dev/null` for cli-opencode; `dispatchCouncilSeats` export is present in the file; `step_sweep_cli_pool` appears in the auto YAML.
- Desired user-visible outcome: CLI seats are dispatched concurrently and read-only, with per-kind flags enforced by the dispatch scaffold so no CLI seat can hang, mutate files, or start an interactive session.
- Pass/fail: PASS if `dispatchCouncilSeats` is exported from `multi-seat-dispatch.cjs` and SKILL.md documents the closed-stdin rule; FAIL if either is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; doc-verification plus source file inspection.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SWEEP-003 | CLI Council Seats | Verify CLI seats use per-kind flags and council scaffold | `Verify that CLI seats are dispatched with the correct flags and through the council scaffold.` | 1. `rg "step_sweep_cli_pool\|multi-seat-dispatch" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml .opencode/skills/deep-context/references/protocol/loop_protocol.md` -> 2. `rg "dispatchCouncilSeats" .opencode/skills/deep-loop-runtime/lib/council/multi-seat-dispatch.cjs` -> 3. `rg "</dev/null\|dev/null\|closed.*stdin" .opencode/skills/deep-context/SKILL.md .opencode/skills/deep-context/references/protocol/loop_protocol.md` -> 4. `rg "sandbox.*read.only\|permission.mode.*plan" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Step 1: step name and scaffold referenced; Step 2: export found; Step 3: closed-stdin rule found; Step 4: per-kind sandbox flags found | Grep outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if dispatchCouncilSeats or closed-stdin rule is absent | 1. Confirm multi-seat-dispatch.cjs path in deep-loop-runtime. 2. Check for alternative export naming (dispatchSeats, dispatchPool). 3. Per-kind CLI flags (`--sandbox read-only`, `--permission-mode plan`) live in the auto YAML `step_sweep_cli_pool` cli_contract. |

### Optional Supplemental Checks

Verify that `node --check` passes on `multi-seat-dispatch.cjs`:

```bash
node --check .opencode/skills/deep-loop-runtime/lib/council/multi-seat-dispatch.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/02--by-model-parallel-sweep/cli-council-seats.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | `step_sweep_cli_pool`: CLI fan-out step in the loop phase |
| `.opencode/skills/deep-loop-runtime/lib/council/multi-seat-dispatch.cjs` | `dispatchCouncilSeats` export and CLI per-kind spawn logic |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | §5: CLI seat dispatch requirements and per-kind flag documentation |
| `.opencode/skills/deep-context/SKILL.md` | §4 ALWAYS rule 5: cli-* contract compliance including closed stdin |

---

## 5. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Playbook ID: SWEEP-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--by-model-parallel-sweep/cli-council-seats.md`
