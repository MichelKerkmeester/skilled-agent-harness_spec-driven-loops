---
title: "Tasks: command lane integration"
description: "Task breakdown for lane registration and full-corpus convergence."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/004-command-lane-integration"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the lane-integration child for the full-corpus deterministic run"
    next_safe_action: "Register the peer adapter lane and run scoping against the command scope"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command lane integration

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. Part A (source/config/tests) and Part B (the convergence run) are both complete.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Author the lane-config entry selecting the command adapter over the command scope. Evidence: the command-surface lane config contains one `sk-doc` / `docs` lane with `adapter: sk-doc-command` and scope `.opencode/commands`.
- [x] T002 — Confirm scoping resolves sk-doc over docs with the command adapter. Evidence: `node scripts/scoping.cjs --lane-config assets/conformance_benchmark/command-surface/lane-config.json --json` exits 0 and returns `adapter: sk-doc-command`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Run all canonical commands through the deterministic lane. Evidence: the run checked 36 of 36 discovered artifacts (8 slices at batch size 5: 5×7 + 1), `artifactsChecked` ratio 1.0.
- [x] T004 — Prove convergence over the full corpus. Evidence: `check-convergence.cjs` returned `CONVERGED` at iteration 8 — coverage 36/36 = 1.0 ≥ threshold AND the last two iterations both reported `newFindingsRatio` 0.
- [x] T005 — Hard-gate raw-delta and reduced-report agreement. Evidence: the delta finding lines (3, three distinct dedup keys over the reducer's own fallback key) equal the reduced registry's open findings (3, P0:3/P1:0/P2:0) exactly — proven on the adapter's verbatim `check()` output after its finding shape was made reducer-compatible.

Convergence run driven through the deep-alignment workflow (its plan-workflow lock forbids a hand-rolled dispatcher), writing state only under `alignment/`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Confirm the generic lane runs separately from the peer lane. Evidence: the run resolved `1/1` lanes — `sk-doc:docs:sk-doc-command` over `.opencode/commands` — and the generic `sk-doc` adapter never audited that scope (config isolation + runtime proof in the two sub-items below).
  - [x] Config isolation: the benchmark lane config contains only `sk-doc-command`, so the peer adapter and generic `sk-doc` adapter do not share the command scope in this config.
  - [x] No-single-run runtime proof: the convergence run resolved exactly one lane (`sk-doc`/`docs`/`sk-doc-command`); the generic `sk-doc` adapter never audited the command scope in the run — the corpus and every iteration record carry only the peer adapter's lane id.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Scoping resolves the peer lane, the full corpus converges, raw-delta and reducer agree exactly, and the peer lane stays isolated from generic validation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark`. Predecessor: 003-command-contract-adapter. Successor: 005-command-behavior-evaluator.
<!-- /ANCHOR:cross-refs -->
