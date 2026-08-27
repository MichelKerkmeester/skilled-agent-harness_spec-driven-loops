---
title: "Implementation Summary: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi"
description: "Final state and verification for adding deterministic per-kind branches (cli-cursor/devin/pi) to the single-executor path of the three auto loop YAMLs, closing the silent-native gap by reusing the fan-out command builder."
trigger_phrases:
  - "executor kind routing summary cli-cursor devin pi"
  - "single executor silent native fix deep loop"
  - "phase_main_loop cli branches buildLineageCommand"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-executor-kind-routing"
    last_updated_at: "2026-08-27T09:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Added cli-cursor/devin/pi branches to 3 auto YAMLs; dispatch + fail-loud proven"
    next_safe_action: "Commit; push v4 + main"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep-review-auto.yaml"
      - ".opencode/commands/deep/assets/deep-research-auto.yaml"
      - ".opencode/commands/deep/assets/deep-alignment-auto.yaml"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Per-kind branches (deterministic branch_on) are the fix, not fanout-routing — config.fanout is model-resolved at setup, so routing would reintroduce model-dependence."
      - "The branches reuse buildLineageCommand so each CLI's binary preflight + model allowlist + write flags stay one source of truth and fail closed, never silent native."
---
# Implementation Summary: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-executor-kind-routing |
| **Completed** | 2026-08-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~3 hours (dispatch-model investigation + parameterized insertion + proof) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the silent-native gap where a single `--executor=cli-cursor/cli-devin/cli-pi` on `/deep:review`, `/deep:research`, or `/deep:alignment` matched no `phase_main_loop` executor branch and degraded to a native review. Added explicit `if_cli_cursor/devin/pi` branches to the single-executor `branch_on` of the three auto loop YAMLs. Each branch reads the iteration prompt and dispatches that CLI per iteration through `fanout-run.cjs`'s exported `buildLineageCommand` (binary preflight, enforced model allowlist, headless write-mode flags), then `runAuditedExecutorCommand` (INTENT + COMPLETION receipts) and `enforceWriteContainment` — mirroring the existing `cli-codex` branch. Because `buildLineageCommand` throws when the binary is absent or the model is off the allowlist, the branch exits non-zero rather than silently running native.

The approach reverses an earlier "route through fanout-run" choice. Investigation found `config.fanout` is resolved in the model-driven setup with no deterministic promotion hook, so routing a single executor through the fan-out path would reintroduce the model-compliance dependence this program has been removing. The single-executor `branch_on` is deterministic (the engine matches the resolved kind), so per-kind branches — reusing the fan-out builder for the CLI contract — are the correct, lower-risk fix. The reversal was surfaced and approved before implementation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `commands/deep/assets/deep-review-auto.yaml` | Modified | Added `if_cli_cursor/devin/pi` (field `config.executor.kind`, dispatchId `review-*`) |
| `commands/deep/assets/deep-research-auto.yaml` | Modified | Added the three branches (field `config.executor.type`, dispatchId `research-*`) |
| `commands/deep/assets/deep-alignment-auto.yaml` | Modified | Added the three branches (field `config.executor.kind`, dispatchId `alignment-*`) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The dispatch model was traced first: `phase_main_loop` dispatches one iteration at a time (the `cli-codex` branch reads `iteration-N.md` and calls `runAuditedExecutorCommand`), whereas a fan-out CLI lineage runs the whole loop in a single `runLineageProcess` call. So the branches mirror `cli-codex` (per-iteration) but defer the CLI-specific command to `buildLineageCommand`, which is exported and `require`-safe (`fanout-run.cjs` guards main) and whose cursor/devin/pi adapters read only `options.env`/`options.cwd`.

The reuse was proven before touching any YAML: `buildLineageCommand` called with a sample iteration prompt returned `cursor-agent`/`devin`/`pi` with the prompt wired, and a disallowed model threw the allowlist error. The three branches share one body (kind flows from the YAML's executor field), inserted by a parameterized script that keys off each YAML's own field (`config.executor.kind` vs `config.executor.type`), dispatchId prefix, and the first non-`if_` sibling step as the insertion boundary. Each inserted body was then run end-to-end with a stubbed dispatch against an in-worktree artifact dir: it printed the correct `command`/`dispatchId`, passed write-containment, and a disallowed model failed loud before any dispatch.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Per-kind branches, not fanout-routing | `config.fanout` is model-resolved at setup with no deterministic promotion hook; routing would reintroduce model-dependence. `branch_on` is deterministic. |
| Reuse `buildLineageCommand` rather than inline per-CLI args | Keeps each CLI's binary preflight, model allowlist, and headless write flags one source of truth shared with the fan-out path; no drift, less duplication. |
| Mirror the `cli-codex` branch (per-iteration + containment) | The single-executor path is per-iteration; the codex branch is the proven template for it. |
| Scope to the three auto loops | The reported gap and the headless CLI-executor path are the auto loops; confirm variants carry separate pre-existing inconsistencies. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `buildLineageCommand` reuse (positive) | PASS — `cursor-agent`/`devin`/`pi`, prompt wired, exit 0 |
| Fail-loud negative control | PASS — disallowed `cli-devin` model throws before dispatch, non-zero exit |
| Stubbed end-to-end per branch | PASS — `command=cursor-agent`, `dispatchId=review-*`/`research-*`, containment clean |
| YAML validity (all three) | PASS — `python3 yaml.safe_load` |
| Targeted auto-YAML vitest tests | PASS — 6 files, 71/71 |
| Runtime vitest whole suite | PASS — the 5 stress/integration failures are pre-existing (a `git stash` baseline run of those files fails 4/4 on the clean tree; fanout proven pre-existing in 023); 0 new |
| `run-node-tests.mjs` | PASS — 767 pass / 17 fail == baseline 767/17 (same 2 pre-existing contract failures; a transient cache-TTL flake cleared on re-run); 0 new |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Confirm-mode YAMLs and `deep-ai-council` are unchanged.** They carry the same class of per-kind branch gaps (and additional pre-existing omissions such as a missing `cli-codex` in some confirm variants). Extending the deterministic branches there is a reasonable follow-up but was out of scope for the reported headless (auto) path.
2. **Live CLI dispatch was proven via a stubbed harness, not a full loop run.** The three binaries are installed and `buildLineageCommand` produced real invocations, but the end-to-end proof stubs `runAuditedExecutorCommand` to avoid a real, billed CLI run; a live smoke against a real target remains an operator step.

<!-- /ANCHOR:limitations -->
