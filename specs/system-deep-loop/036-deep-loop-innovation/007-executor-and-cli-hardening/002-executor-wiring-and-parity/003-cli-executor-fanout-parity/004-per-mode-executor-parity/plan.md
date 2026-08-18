---
title: "Implementation Plan: Per-Mode Executor Parity"
description: "Implementation plan for giving model-benchmark, skill-benchmark, and ai-council cli-cursor/cli-devin/cli-pi parity by delegating those kinds' command construction to the shared buildLineageCommand."
trigger_phrases:
  - "per-mode executor parity plan"
  - "model-benchmark cursor devin pi plan"
  - "buildLineageCommand delegation plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/004-per-mode-executor-parity"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Confirmed the three-leaf parity plan landed for model-benchmark and ai-council"
    next_safe_action: "Await SOL verdicts and operator review before the combo-matrix phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Per-Mode Executor Parity

<!-- ANCHOR:summary -->
## 1. SUMMARY
Give the three modes that run their own dispatch (model-benchmark, skill-benchmark, ai-council) cli-cursor/cli-devin/cli-pi parity by delegating those kinds' command construction to the shared `buildLineageCommand`. Built as three independent leaves, each verified by a stash-baseline delta (zero new failures) plus SOL cross-verify, and landed per leaf.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Each leaf's targeted lane test passes (FULL output, never through `tail`).
- Stash-baseline delta: the post-change failure set is a strict subset of the pre-change set (zero new failures).
- Whole-runtime tsc is 0; the changed CJS module requires cleanly.
- Independent cli-opencode GPT-5.6-SOL review with no surviving P0/P1.
- `validate.sh --strict` passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The fan-out builders in `fanout-run.cjs` are the single source of the hardened per-kind flags. `buildLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options)` returns `{command, args, input}` — exactly a spawn spec. Because `fanout-run.cjs` guards its `main()` behind `require.main === module`, a mode script can `require` it side-effect-free and call the builder. Each mode maps its own read-only/write-capable posture to a sandbox mode, calls the builder for cursor/devin/pi, and feeds `command`/`args`/`input` into its existing spawn — keeping its own I/O contract (envelope parsing, seat prompts). opencode/claude/codex stay on each mode's own logic (they have mode-specific arg divergence the fan-out shape does not serve).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit
Audit per-mode executor coverage; confirm the shared builder fits cursor/devin/pi (no mode divergence) but not opencode.

### Phase 2: Leaf 1 — model-benchmark
Delegate cursor/devin/pi to `buildLineageCommand`; register cli-devin; drop the stale local allowlists.

### Phase 3: Leaf 2 — skill-benchmark
Document the observation-model exemption at the dispatch branch: text-only executors emit no structured tool-use trace, so routing them would score every run as no-activation. No parity build; opencode and codex stay the live transports.

### Phase 4: Leaf 3 — ai-council
Shared-builder read-only seat spawn for cursor/devin/pi; extend the allowlist (keep the deliberate codex exclusion).
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Per leaf: update the mode's targeted tests to assert the real hardened args for cursor/devin/pi (read-only + write-capable); run the mode's full lane suite twice — once with the change stashed (baseline) and once with it applied — and require the post-change failure set to be a strict subset of the baseline. Whole-runtime tsc and a require smoke test guard the wiring. SOL adversarially checks the delegation, the posture mapping, allowlist parity, and no-regression.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- The shared `buildLineageCommand` (phases 002/003) with all seven builders wired and hardened.
- Each mode's own vitest config (e.g. `deep-improvement/scripts/vitest.config.mjs`, run from that dir).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Each leaf is confined to one mode's dispatch script + validator + tests; rollback is reverting that leaf's hunks. The shared fan-out builders are never modified, so no leaf can regress the fan-out modes. The stash-baseline delta is the per-leaf tripwire.
<!-- /ANCHOR:rollback -->
