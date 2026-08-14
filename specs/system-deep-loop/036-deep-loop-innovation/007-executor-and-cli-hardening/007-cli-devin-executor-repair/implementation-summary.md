---
title: "Implementation Summary: cli-devin Executor Repair"
description: "cli-devin lineages run again on the installed devin CLI. buildDevinLineageCommand now always passes --respect-workspace-trust false, and DEVIN_DEFAULT_MODEL plus both model lists are reconciled to devin's live catalog. Landed in commit dfdd41f531 with a hermetic unit test and a live red-before/green-after reproduction."
trigger_phrases:
  - "cli-devin executor repair implementation summary"
  - "respect-workspace-trust false landed"
  - "devin model list reconciliation shipped"
  - "dfdd41f531"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/007-cli-devin-executor-repair"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/007-cli-devin-executor-repair"
    last_updated_at: "2026-08-13T14:27:57.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconciled packet to Complete against commit dfdd41f531 evidence"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 100
    open_questions:
      - "Does the live devin model catalog change often enough to warrant a periodic drift-check?"
    answered_questions:
      - "Is the workspace-trust flag conditional? No, it is unconditional in buildDevinLineageCommand since cli-devin always runs in print mode."
      - "Is DEVIN_ALLOWED_MODELS identical to DEVIN_SUPPORTED_MODELS after pruning? Yes, both dropped swe and deepseek-v4 and now match."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> This packet is Complete. The fix landed and was verified in a separate process (commit `dfdd41f531`); the evidence below is reproduced from that verification, not re-derived by this documentation pass.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-cli-devin-executor-repair |
| **Level** | 1 |
| **Status** | Complete |
| **Completion** | 100% |
| **Completed** | 2026-08-12 |
| **Commit** | `dfdd41f531` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

cli-devin lineages run again on the currently installed devin CLI. The adapter's `buildDevinLineageCommand` now always passes `--respect-workspace-trust false`, so non-interactive fan-out dispatch no longer hits devin's workspace-trust gate in a fresh, never-trusted worktree/lineage directory. Separately, the adapter's default and allowed models are reconciled to devin's live catalog, so lineages no longer default to a retired model id.

### Workspace-trust flag (REQ-001)

`buildDevinLineageCommand` (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1895`) now does `args.push('--respect-workspace-trust', 'false');`, unconditionally, because the adapter is always print mode and can never answer an interactive trust prompt.

### Model-list reconciliation (REQ-002)

`DEVIN_DEFAULT_MODEL` changed from the dead `'swe'` alias to the live `'glm-5-2'` uid in both `fanout-run.cjs` and `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`. The CJS `DEVIN_ALLOWED_MODELS` and the TS `DEVIN_SUPPORTED_MODELS` were pruned to live-only uids (dropping the dead `swe` and `deepseek-v4` ids) and are now identical to each other. Every surviving id was confirmed present in `devin models list`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Added the workspace-trust flag; reconciled `DEVIN_DEFAULT_MODEL` and pruned `DEVIN_ALLOWED_MODELS` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | Reconciled `DEVIN_DEFAULT_MODEL` and pruned `DEVIN_SUPPORTED_MODELS` to match `DEVIN_ALLOWED_MODELS` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added the hermetic unit cell plus two CJS/TS alignment cells |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix landed as commit `dfdd41f531`, owned and verified by a parallel process outside this documentation pass. Verification: pinned `tsc` returned code 0; the per-file `vitest` suite for `fanout-run.vitest.ts` went from 114 to 115 passed with the new cell and no regression; and a live reproduction confirmed the real devin CLI behavior before and after the fix.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Make the workspace-trust flag unconditional | `buildDevinLineageCommand` is always print mode (`-p`), which can never answer an interactive trust prompt, so there is no case where the flag should be omitted |
| Prune both model lists to the same live-only set | `DEVIN_ALLOWED_MODELS` (CJS) and `DEVIN_SUPPORTED_MODELS` (TS) must stay identical so a model accepted on one side is never rejected on the other |
| Add a negative-assertion test for the retired `swe` alias | Confirms the pruned allowlist actually rejects the dead id, not just that it accepts the new default |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 workspace-trust flag present in built command | PASS, `fanout-run.cjs:1895`, `args.push('--respect-workspace-trust', 'false')` |
| REQ-002 `DEVIN_DEFAULT_MODEL` reconciled to `glm-5-2` (both files) | PASS |
| REQ-002 `DEVIN_ALLOWED_MODELS` / `DEVIN_SUPPORTED_MODELS` pruned and identical | PASS, dropped `swe` and `deepseek-v4`; all surviving ids confirmed in `devin models list` |
| REQ-003 hermetic unit test: trusted command for an allowed model, retired `swe` alias rejected | PASS, new cell in `fanout-run.vitest.ts` plus two CJS/TS alignment cells |
| REQ-003 pinned `tsc` | PASS, return code 0 |
| REQ-003 per-file `vitest` | PASS, 115 passed (was 114, +1 cell, no regression) |
| REQ-004 live red-before (no flag, fresh dir) | PASS as a negative control: `devin -p ... --model glm-5-2 --permission-mode auto` exited 1, "Refusing to run in an untrusted workspace" |
| REQ-004 live green-after (`--respect-workspace-trust false`) | PASS, exit 0, devin returned "PONG" |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Model catalog is a point-in-time snapshot.** `DEVIN_DEFAULT_MODEL`, `DEVIN_ALLOWED_MODELS`, and `DEVIN_SUPPORTED_MODELS` reflect devin's live catalog as of commit `dfdd41f531`. A future devin release could retire or add models again, requiring another reconciliation pass; no periodic drift-check exists yet.
2. **Workspace-trust behavior is version-specific.** `--respect-workspace-trust false` mitigates the gate as observed on the installed devin version at fix time; a future devin release could change trust semantics again.

<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE (~40 lines)
- Post-implementation documentation
- Created AFTER implementation completes
-->
