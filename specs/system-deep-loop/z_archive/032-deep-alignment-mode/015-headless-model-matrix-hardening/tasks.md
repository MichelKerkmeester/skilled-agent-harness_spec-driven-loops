---
title: "Tasks: headless model-matrix hardening for the deep-alignment loop"
description: "Task breakdown across setup (baseline + census), implementation (Phase A driver forcing, Phase B executor wiring + shared fanout-run extension), and verification (Phase C model matrix + gates)."
trigger_phrases:
  - "deep-alignment hardening tasks"
  - "deep-alignment matrix tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/015-headless-model-matrix-hardening"
    last_updated_at: "2026-07-14T08:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task breakdown"
    next_safe_action: "On approval, start T-A1"
---
# Tasks: headless model-matrix hardening for the deep-alignment loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending · `[x]` complete · `[~]` in progress · `[!]` blocked
- IDs: `T-A*` Phase A (driver forcing), `T-B*` Phase B (executor wiring), `T-C*` Phase C (matrix proof), `T-S*` setup, `T-V*` verification/gates.
- Each task names its evidence (command output / file / live-run artifact).

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-S1: Capture the regression baseline — run deep-review + deep-research existing gates (unit + contract-drift) and record results as the before-state for the shared-runtime edits.
- [ ] T-S2: Snapshot the exact `alignment.md` (72-84) and `deep_alignment_auto.yaml` dispatch region pre-change (for rollback diffing).
- [ ] T-S3: Confirm a clean throwaway `alignment/` target folder for live smokes (avoid clobbering real packets).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A — Driver execution-forcing
- [ ] T-A1: Rewrite `alignment.md` AUTONOMOUS EXECUTION DIRECTIVE — forced first tool call (Read the auto YAML then execute its steps; no prose first) + delete the defer-able "the YAML owns the loop" phrasing.
- [ ] T-A2: Add a mandatory side-effecting step-0 in `deep_alignment_auto.yaml`, surfaced in the directive, so a started run leaves detectable `alignment/` state.
- [ ] T-A3: `validate_document.py --type command` on `alignment.md` → exit 0; contract-drift OK.

### Phase B — External-executor wiring
- [ ] T-B1: `executor-config.ts` — add `ultra` reasoning-effort (additive) + unit assertion.
- [ ] T-B2: Author `deep-alignment/assets/alignment_prompt_pack.md.tmpl` + wire the render step populating `{prompt_dir}/iteration-{N}.md`.
- [ ] T-B3: `deep_alignment_auto.yaml` `step_dispatch_alignment_iteration` — add `resolve_executor`, `pre_dispatch_audit` (skip native), `branch_on kind` (native | cli-codex with `--sandbox workspace-write`), `post_dispatch_validate` (alignment route-proof), `record_executor_audit`.
- [ ] T-B4: `fanout-run.cjs` — additively add `alignment` loop-type (active set, state-log map, lineage paths, prompt builder) + `--coverage-threshold`/`--stability-window` parsing.
- [ ] T-B5: `alignment.md` — unlock executor flags in argument-hint + mode routing (LAST; only after T-B1..T-B4 land).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-V1: Runtime vitest green incl. new `fanout-run` alignment + `executor-config` `ultra` cases; `research`/`review` assertions unchanged.
- [ ] T-V2: Re-run the T-S1 regression baseline after Phase B → zero delta.
- [ ] T-C1: Driver matrix (axis A) — 9 runs `{gpt-5.6, sol, terra, luna} × {medium, xhigh}` + `gpt-5.6-luna-fast` repro each reach REPORT with real findings + non-empty `alignment/`.
- [ ] T-C2: Leaf matrix (axis B) — codex `{gpt-5.5 medium, gpt-5.6-sol xhigh, gpt-5.6-luna max}` + opencode `{gpt-5.6-sol-fast xhigh}` each complete one audited iteration.
- [ ] T-C3: One `gpt-5.6-sol-pro` driver smoke + `--variant low` floor check (REQ-008).
- [ ] T-C4: Record the matrix results table (pass/fail per combo + documented skips) in implementation-summary.
- [ ] T-V3: `validate.sh --strict` Errors:0 for this child; 059 parent rollup.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- REQ-001..REQ-004, REQ-006 satisfied with evidence; REQ-005/REQ-007 satisfied or explicitly deferred with approval.
- Representative driver + leaf matrix all-pass (or failures documented + accepted).
- Sibling loops regression-clean; strict validate Errors:0; 059 parent rolled up.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements REQ-001..REQ-008.
- `plan.md` — phases, affected surfaces, quality gates, rollback.
- `decision-record.md` — ADR-001..ADR-005.
- `checklist.md` — verification protocol.

<!-- /ANCHOR:cross-refs -->
