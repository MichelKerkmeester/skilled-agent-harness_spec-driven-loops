---
title: "Spec: Extend /deep:command-benchmark to Drive cli-opencode"
description: "Add a cli-opencode driver leg to the command-surface behavior benchmark so command scenarios can run under cli-opencode executors (e.g. deepseek-v4-pro, mimo-v2.5-pro), alongside the existing frozen claude-cli and gpt-fast legs. Touches the behavior-matrix driver config and its scheduler; honors cli-opencode dispatch rules. Runtime-affecting."
trigger_phrases:
  - "command benchmark cli-opencode driver"
  - "add cli-opencode leg to command benchmark"
  - "deep command-benchmark opencode executor"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver"
    last_updated_at: "2026-07-22T11:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded spec-only folder capturing the cli-opencode driver-leg request."
    next_safe_action: "Plan (add plan.md/tasks.md), then implement on an isolated worktree — this touches shipped benchmark runtime."
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

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Extend /deep:command-benchmark to Drive cli-opencode

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-command-benchmark-cli-opencode-driver |
| **Level** | 1 |
| **Status** | Planned |
| **Verification** | A command-benchmark scenario runs through a cli-opencode driver leg and emits evidence; the existing claude-cli and gpt-fast legs remain green; benchmark tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `/deep:command-benchmark` behavior matrix
(`deep-alignment/assets/command-benchmark/command-benchmark-matrix.json`) has three **frozen** driver legs
— `claude-cli`, `gpt-fast-high`, `gpt-fast-med`. There is no way to exercise command scenarios under a
**cli-opencode** executor (the surface that reaches deepseek-v4-pro, mimo-v2.5-pro, MiniMax, GLM, and the
GPT-5.6 catalog). The operator wants the command benchmark to *also* use cli-opencode, so command behavior
can be measured across the cli-opencode provider surface, not just the Claude/GPT legs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Add a **cli-opencode driver leg** to the behavior benchmark — matrix driver-leg config plus whatever
  scheduler/runner wiring (`run-command-behavior-matrix.cjs`, `behavior-bench-run.cjs`) is needed to
  dispatch a scenario through `opencode run --model <m> --variant <v> --format json --dir <root>`.
- Surface a way to select the cli-opencode model/variant for the leg (default the cli-opencode default,
  `deepseek/deepseek-v4-pro --variant high`).
- Honor the cli-opencode dispatch contract (spec-gate env for child dispatches, `</dev/null`, no
  `--agent`, provider auth pre-flight) per `cli-opencode/SKILL.md`.

**Out of scope:** the deterministic **conformance** axis (no models run there); rewriting the frozen
fixture set (DAB-012..027) except where a leg needs a fixture hook; the interface commands' own logic;
adding non-opencode providers.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — The behavior matrix supports a cli-opencode driver leg selectable alongside the existing legs.
- **REQ-002** — The leg dispatches through the canonical cli-opencode invocation and honors its SKILL.md rules (child spec-gate env, `</dev/null`, no `--agent`, auth pre-flight); the cli-opencode SKILL.md is read before composing the dispatch.
- **REQ-003** — The model/variant for the leg is configurable, defaulting to the cli-opencode default.
- **REQ-004** — Existing `claude-cli` and `gpt-fast-*` legs remain unchanged and green; the run stays bounded/deterministic in structure.
- **REQ-005** — The change is isolated to the benchmark engine; no unrelated command or runtime path is altered.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Running the command benchmark with the cli-opencode leg produces a scenario result + evidence for at least one scenario.
- Baseline legs (claude-cli, gpt-fast-high/med) produce identical structure to before (no regression).
- Benchmark unit/integration tests pass; the matrix schema stays valid.
- The dispatch matches the cli-opencode SKILL.md contract (verifiable in the rendered command).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Touches shipped benchmark runtime (blast radius) | Implement on an isolated worktree; keep existing legs byte-stable; gate behind the new leg only |
| cli-opencode fan-out child hangs on an enforced spec gate | Inject `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 … </dev/null` per cli-opencode SKILL.md Rule 17 |
| Frozen matrix hashes / `requiredCellCount` break on a new leg | Decide whether the leg adds cells or a parallel matrix; update counts + fixtures coherently |
| Provider auth / model availability | Run the cli-opencode provider auth pre-flight; ASK on a missing default provider, never silently substitute |
| Alignment fan-out not wired (`ACTIVE_FANOUT_LOOP_TYPES` excludes alignment) | Confirm the driver-leg path does not depend on the unwired alignment fan-out, or scope that wiring explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the cli-opencode leg extend the existing frozen matrix (new cells + updated `requiredCellCount`/hashes) or run as a parallel driver set? Resolve at planning.
- Which scenarios should the cli-opencode leg cover first (the leaf sentinel DAB-012, or a design-command scenario)? Resolve at planning.
<!-- /ANCHOR:questions -->
