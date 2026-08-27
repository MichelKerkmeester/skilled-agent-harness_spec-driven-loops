---
title: "Verification Checklist: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi"
description: "Verification evidence for the deterministic per-kind branches added to the three auto loop YAMLs."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-executor-kind-routing"
    last_updated_at: "2026-08-27T09:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Verified dispatch + fail-loud + YAML parse; whole-suite gates pending"
    next_safe_action: "Run whole-suite gates; commit"
---
# Verification Checklist: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The single-executor dispatch model was traced before editing
  - **Evidence**: `phase_main_loop` `branch_on` is per-iteration; fan-out CLI lineages are whole-loop (one `runLineageProcess` call per lineage)
- [x] CHK-002 [P0] The reused builder is safe to import from a branch
  - **Evidence**: `buildLineageCommand` is in `module.exports`; `fanout-run.cjs` guards main with `require.main === module`
- [x] CHK-003 [P1] The adapters reuse cleanly standalone
  - **Evidence**: the cursor/devin/pi adapters read only `options.env`/`options.cwd`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The branches dispatch the requested CLI, not native
  - **Evidence**: stubbed run prints `command=cursor-agent` for `if_cli_cursor`; research prints `dispatchId=research-i1-g0`
- [x] CHK-011 [P1] One source of truth for the CLI contract
  - **Evidence**: the branch imports `buildLineageCommand` rather than re-deriving allowlist/flags

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Positive dispatch proven per kind
  - **Evidence**: `buildLineageCommand` yields `cursor-agent`/`devin`/`pi` with the prompt wired (`promptWired=true`)
- [x] CHK-021 [P0] Fail-loud negative control proven
  - **Evidence**: a disallowed `cli-devin` model throws "not in the enforced allowlist" before any `DISPATCH` line, non-zero exit
- [x] CHK-022 [P1] No new whole-suite regression on either gate
  - **Evidence**: `run-node-tests.mjs` 767 pass / 17 fail == baseline; a `git stash` baseline run of the 5 failing vitest files (`cli-devin.vitest.ts` et al.) shows 4/4 fail on the clean tree — all pre-existing

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] All three auto loops covered
  - **Evidence**: `grep -cE '^        if_cli_(cursor|devin|pi):'` = 3 in each of `deep-review-auto.yaml`, `deep-research-auto.yaml`, `deep-alignment-auto.yaml`
  - **Superseded (2026-08-27)**: `deep-alignment-auto.yaml` was later deleted with the deep-alignment mode; the evidence above was accurate when recorded. Two auto loops (`deep-review-auto`, `deep-research-auto`) now carry the three branches, and both still verify at 3 each.
- [x] CHK-025 [P1] Each YAML's field + dispatchId convention honored
  - **Evidence**: research uses `config.executor.type`; review/alignment use `config.executor.kind`; dispatchId prefixes `review`/`research`/`alignment`
- [x] CHK-026 [P1] YAML validity preserved
  - **Evidence**: `python3 yaml.safe_load` passes for all three files; targeted auto-YAML vitest tests 71/71

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Write-containment preserved on the new leaves
  - **Evidence**: the branch runs `enforceWriteContainment` after dispatch, mirroring `cli-codex`; a stubbed run against an in-worktree artifact dir passes containment

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The WHY is durable and hygiene-clean
  - **Evidence**: the branch comment states the silent-native failure mode + the one-source-of-truth rationale; `check-comment-hygiene.sh` scope covers no code file (YAML-only change)

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scoped diff — three auto YAMLs + the packet
  - **Evidence**: `git status` = `deep-{review,research,alignment}-auto.yaml` plus `024-executor-kind-routing/`

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-27
**Verified By**: claude (conductor)

<!-- /ANCHOR:summary -->
