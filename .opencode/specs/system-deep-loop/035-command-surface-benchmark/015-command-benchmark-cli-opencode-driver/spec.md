---
title: "Command-benchmark cli-opencode driver leg (phase parent)"
description: "Phase-parent packet: add a cli-opencode driver leg to the command-surface behavior benchmark so command scenarios run under cli-opencode executors alongside the frozen claude-cli and gpt-fast legs. Decomposed into three Level-2 phases — matrix/driver-leg schema, scheduler dispatch wiring, and integration/evidence/tests. Runtime-affecting."
trigger_phrases:
  - "command benchmark cli-opencode driver parent"
  - "add cli-opencode leg to command benchmark"
  - "deep command-benchmark opencode executor phases"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver"
    last_updated_at: "2026-07-22T11:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Decomposed into three L2 child phases"
    next_safe_action: "Plan and execute 001 through 003"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-command-benchmark-opencode-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->

# Command-benchmark cli-opencode driver leg

## 1. METADATA

- **Track:** system-deep-loop
- **Packet:** 015-command-benchmark-cli-opencode-driver (phase parent)
- **Parent program:** `035-command-surface-benchmark`
- **Governing engine:** the behavior benchmark (`deep-alignment/assets/command-benchmark/command-benchmark-matrix.json` + its runner)

## 2. PROBLEM & PURPOSE

The `/deep:command-benchmark` behavior matrix has three **frozen** driver legs — `claude-cli`,
`gpt-fast-high`, `gpt-fast-med`. There is no way to exercise command scenarios under a **cli-opencode**
executor (the surface that reaches deepseek-v4-pro, mimo-v2.5-pro, MiniMax, GLM, and the GPT-5.6 catalog).
This packet adds a cli-opencode driver leg so command behavior can be measured across the cli-opencode
provider surface. Because it touches shipped benchmark runtime and a frozen matrix
(`requiredCellCount: 52`), the work is split into three ordered Level-2 phases: the declarative schema
layer, the runner dispatch wiring, then integration + evidence + regression proof.

## 3. SCOPE

- **In:** the three child phases below — matrix/driver-leg schema, scheduler dispatch wiring, and
  integration/evidence/tests — all within the benchmark engine.
- **Out:** the deterministic conformance axis (no models run there); rewriting the frozen fixture set
  (DAB-012..027) except where a leg needs a fixture hook; the interface commands' own logic; adding
  non-opencode providers.

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

| Phase | Child | Purpose | Gate | Status |
|---|---|---|---|---|
| 1 | `001-driver-leg-and-matrix-schema` | Add the cli-opencode driver-leg definition + executor-carrying cells; reconcile `requiredCellCount` (52 → 52+N) and hashes. Declarative layer only. | Matrix schema stays valid; existing legs' cells byte-stable. | Planned |
| 2 | `002-scheduler-opencode-dispatch` | Wire the runner/scheduler to dispatch via the canonical `opencode run …` invocation, honoring cli-opencode SKILL.md rules (child spec-gate env, no `--agent`, auth pre-flight). | A scenario dispatches through the cli-opencode leg; dispatch matches the SKILL.md contract. | Planned |
| 3 | `003-integration-evidence-and-tests` | End-to-end run through the leg, evidence emission, tests, and byte-stable regression proof for the frozen legs. | Leg produces evidence; claude-cli/gpt-fast legs unchanged; tests pass. | Planned |

<!-- /ANCHOR:phase-map -->

## 5. PHASE TRANSITION & HANDOFF

Phases are ordered 001 → 002 → 003: the schema layer must exist before dispatch is wired, and dispatch
before integration/regression. The whole packet touches shipped runtime, so implementation runs on an
isolated worktree with the frozen legs held byte-stable throughout. Resume follows
`graph-metadata.json.derived.last_active_child_id`.

## 6. OPEN QUESTIONS

- Extend the existing frozen matrix (new cells + updated `requiredCellCount`/hashes) or run a parallel driver set? Resolved in child 001.
- Which scenarios does the cli-opencode leg cover first (leaf sentinel DAB-012, or a design-command scenario)? Resolved in child 001/003.
- The benchmark test-tree path for child 003 (not yet located) — resolve at planning.

## 7. RELATED DOCUMENTS

- Parent program: `../` (`035-command-surface-benchmark`).
- Dispatch contract: `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md`.
- Phase children: `001-driver-leg-and-matrix-schema/`, `002-scheduler-opencode-dispatch/`, `003-integration-evidence-and-tests/`.
