---
title: "Feature Specification: per-mode executor parity"
description: "The deep-loop fan-out runtime supports all seven executor kinds, but three modes with their own dispatch scripts (model-benchmark, skill-benchmark, ai-council) only cover a subset and even carry stale per-kind flag logic. This phase gives those modes cli-cursor/cli-devin/cli-pi parity by delegating command construction for those CLIs to the shared buildLineageCommand, reusing the fan-out's hardened sandbox/permission/trust flags instead of forking or stubbing them."
trigger_phrases:
  - "per-mode executor parity"
  - "model-benchmark cursor devin pi dispatch"
  - "reuse buildLineageCommand in benchmark modes"
  - "skill-benchmark ai-council executor parity"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/043-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/043-cli-executor-fanout-parity/004-per-mode-executor-parity"
    last_updated_at: "2026-07-29T13:20:00Z"
    last_updated_by: "claude"
    recent_action: "Consolidated model-benchmark cursor/devin/pi onto the shared builder"
    next_safe_action: "SOL-verify leaf 1, land, then skill-benchmark and ai-council leaves"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs"
    completion_pct: 35
    open_questions: []
    answered_questions:
      - "deep-research/review/alignment already have full 7-executor parity via the shared fan-out"
      - "cursor/devin/pi have no mode-specific arg divergence, so buildLineageCommand fits those kinds"
      - "opencode/claude keep each mode's own arg contract; only the three gap kinds are consolidated"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Per-Mode Executor Parity

> Phase adjacency under the `043-cli-executor-fanout-parity` parent (grouping order, not a runtime dependency): predecessor `003-devin-cursor-exec-hardening`; successor `005-combo-test-matrix`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-29 |
| **Branch** | `system-deep-loop/0125-043-cli-parity` |
| **Parent** | `system-deep-loop/043-cli-executor-fanout-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An audit of every deep mode's executor coverage found that the fan-out modes (deep-research, deep-review, deep-alignment) already dispatch all seven executor kinds through the shared `fanout-run.cjs` builders, but three modes run their OWN dispatch scripts and cover only a subset:

- **model-benchmark** (`dispatch-model.cjs`): cli-devin absent; cli-pi a stub that throws; cli-cursor used the pre-hardening read-only fiction (`omitting --auto-review` blocks writes), which live testing disproved.
- **skill-benchmark** (`executor-dispatch.cjs` + `live-executor.cjs`): only codex + an opencode-nailed "else" branch; cursor/devin/pi/claude-code have no path.
- **ai-council** (`orchestrate-session.cjs`): a hardcoded allowlist (`native`, `cli-opencode`) with a bespoke opencode-only seat spawn; cursor/devin/pi rejected (cli-codex deliberately excluded).

### Purpose
Give these three modes cli-cursor/cli-devin/cli-pi parity by delegating command construction for those CLIs to the shared `buildLineageCommand` — the single source of the live-verified, hardened sandbox/permission/trust flags — instead of forking, stubbing, or carrying stale copies. Those CLIs (unlike opencode) have no mode-specific arg divergence, so the fan-out command drops cleanly into each mode's spawn.

### Non-Goals
- Changing cli-opencode / cli-claude-code / cli-codex dispatch in any mode (they have mode-specific arg contracts and stay as-is; ai-council keeps its deliberate cli-codex exclusion).
- The end-to-end combo matrix (phase 005) and cursor ambient-config isolation (phase 005).
- agent-improvement (dispatches no executor — native-static by design) and ai-system-improvement (does not exist yet).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Leaf 1 — model-benchmark:** cli-cursor/cli-devin/cli-pi delegate to `buildLineageCommand`; `cli-devin` added to `KNOWN_EXECUTORS` and the profile validator; the stale local allowlists removed (the shared builder enforces them).
- **Leaf 2 — skill-benchmark: EXEMPT by design (documented, no parity build).** Its live score signal (skill activation + observed resource reads) is extracted from the executor's structured tool-use event stream, which only opencode and codex emit. Text-only executors (cursor/devin/pi) produce no equivalent trace, so routing them here would score every run as "no activation" — false benchmark data. Documented at the dispatch branch; opencode+codex remain the supported live transports. Real parity needs an executor-agnostic observation model (a separate change).
- **Leaf 3 — ai-council:** seat spawn for cursor/devin/pi via the shared builder (read-only deliberation); extend the executor allowlist (keep the deliberate cli-codex exclusion and the opencode/native seats).

### Out of Scope
- Rewiring the shared `fanout-run.cjs` builders (reused as-is, never forked).
- opencode/claude/codex dispatch in any mode; the combo matrix (005); docs closeout (006).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** — In each of the three modes, a cli-cursor/cli-devin/cli-pi dispatch produces the same hardened command the fan-out produces (read-only genuinely read-only; workspace-write stall-free and confined).
- **R2** — Command construction for those three kinds is delegated to the shared `buildLineageCommand`, not duplicated; the fan-out builders are reused unchanged.
- **R3** — Each mode's read-only-by-default posture is preserved: write-capable is the explicit opt-in that maps to `workspace-write`.
- **R4** — No regression to that mode's existing cli-opencode/cli-claude-code/cli-codex dispatch, envelope parsing, or test suite (verified by a stash-baseline delta with zero new failures).
- **R5** — Model allowlists remain equivalent (the removed local lists match the shared builder's), so no previously-valid model is rejected and no invalid model accepted.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. All three modes dispatch cli-cursor/cli-devin/cli-pi through the shared builder with the hardened flags.
2. Each leaf's targeted tests pass and a stash-baseline delta shows zero new failures (strict subset of pre-existing).
3. Whole-runtime tsc is 0; each changed CJS module requires cleanly.
4. An independent cli-opencode GPT-5.6-SOL review of each leaf finds no surviving P0/P1.
5. `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shared-builder coupling** — the modes now `require` `fanout-run.cjs`; its `main()` is guarded by `require.main === module`, so requiring it is side-effect-free, but the modes inherit the builder's binary-availability throw (a fail-fast, acceptable).
- **Pre-existing lane failures** — the model-benchmark/skill-benchmark suites carry unrelated failing tests (fixtures, scorers, routing, design lint); the baseline delta isolates this phase's effect from that noise.
- **ai-council seat contract** — the council's seat I/O (prompt shaping, seat timeout, model-set rotation) must be preserved; only the per-kind command args are delegated.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should model-benchmark and skill-benchmark also gain native/cli-codex dispatch parity, or is cursor/devin/pi the intended scope for this phase (native-static and codex-via-helper are pre-existing design choices)?
<!-- /ANCHOR:questions -->
