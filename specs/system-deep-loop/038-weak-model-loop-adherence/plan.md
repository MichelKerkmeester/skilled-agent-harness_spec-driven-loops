---
title: "Implementation Plan: Weak-Model Loop Adherence"
description: "Approach and sequencing for hardening the deep-loop observation-only write boundary so DeepSeek Flash completes runs across all eight modes."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-weak-model-loop-adherence"
    last_updated_at: "2026-08-16T10:57:01Z"
    last_updated_by: "claude"
    recent_action: "Authored the plan: approach, phases, testing strategy, rollback"
    next_safe_action: "Operator approves approach, then implement Phase 1 contract text"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Weak-Model Loop Adherence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The deep-loop dispatches a fresh leaf per iteration through `fanout-run.cjs`, which renders a prompt (partly from `prompt-pack.ts`, partly inline in the fan-out lineage builder). The rendered prompt tells the model to write only inside its lineage artifact directory. The `write-containment.ts` layer is the enforced backstop: after each dispatch it detects out-of-scope dirty paths, reverts in-HEAD breaches from HEAD (fatal to the iteration), and preserves untracked out-of-scope paths as advisories. A strong model (codex/luna) respects the boundary and finishes clean; DeepSeek Flash ran `generate-context.js`/`validate.sh`/`git` and edits during a review, breached, and was failed by containment.

### Overview

Harden what the model is told, tuned for weak models, and prove it with a red-then-green regression test — without weakening the containment net or over-constraining modes that legitimately write. Ship prompt-hardening + per-mode coverage + the test in this packet. Evaluate the larger hard-pre-write-jail change in `decision-record.md`; if adopted it becomes its own safety-critical phase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Root cause confirmed (weak-model tooling breach, not a runtime defect) — done, with session evidence.
- The rendered-prompt surfaces to change are identified (`prompt-pack.ts`, the `fanout-run.cjs` lineage-prompt block, per-mode leaf surfaces).
- The small-model dispatch rules packet (`sk-prompt/sk-prompt-models`) is the agreed home for the weak-model wording.

### Definition of Done
- REQ-001..003 (P0) satisfied with evidence.
- Regression test is red against the old prompt and green against the hardened one.
- A DeepSeek review lineage completes with zero out-of-scope reverts.
- Strong-model runs unchanged (SC-004).
- `validate.sh <spec-folder> --strict` passes; checklist all-checked with evidence.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Defence in depth: (1) a clearer instruction the weak model can follow, backed by (2) the existing enforced containment net. This packet strengthens layer 1; it does not remove layer 2.

### Key Components

- **Rendered leaf prompt** — the observation-only prohibition text (naming the specific forbidden tooling) lives here, applied per mode by write surface.
- **Weak-model directive** — the reinforced wording routed via `sk-prompt/sk-prompt-models` so DeepSeek/MiniMax/Qwen pick it up.
- **write-containment.ts** — unchanged in this packet (the net); its behavior is the fallback and the test's oracle.
- **Regression test** — reproduces a weak-model leaf attempting out-of-scope tooling and asserts scope is held.

### Data Flow

Dispatch → rendered prompt (now carries the explicit prohibition) → model runs its pass → write-containment post-check. Success = model stayed in scope, no revert. The test drives this flow against old vs hardened prompt text.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract text
- Draft the explicit observation-only prohibition (names `generate-context.js`, `validate.sh`/`--recursive`, `git` write ops; "write only inside your lineage directory").
- Place it in `prompt-pack.ts` and reinforce the `fanout-run.cjs` lineage-prompt block.

### Phase 2: Per-mode + weak-model routing
- Apply the hardened wording to each of the eight modes by its real write surface (review strictest; research/benchmarks keep their legitimate artifact writes).
- Add the weak-model directive to `sk-prompt/sk-prompt-models` (consult that packet first per the small-model dispatch rule).

### Phase 3: Verification
- Add the regression test (red-then-green).
- Re-run a DeepSeek review lineage in an isolated worktree; confirm `fulfilled` + zero reverts.
- Confirm a strong-model run is unchanged.
- Record the per-mode adherence table (REQ-006).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Regression (primary):** a test that renders the leaf prompt and asserts the prohibition is present; and a behavioral test/simulation where a weak-model stand-in attempts out-of-scope tooling — must be blocked/kept-in-scope under the hardened path.
- **Negative control:** the same test against the *old* prompt text reproduces the breach → containment fatal (proves the test is real).
- **Non-regression:** a strong-model review run still completes clean (no new constraints break it).
- **Live per-mode:** one DeepSeek-via-cli-pi lineage per mode where feasible; record pass/fail.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-prompt/sk-prompt-models` — owns weak-model prompt-craft; must be consulted before composing the directive.
- `write-containment.ts` — the enforced net and the test oracle (read, not modified here).
- cli-pi executor (`PI_SUPPORTED_MODELS`, `buildPiLineageCommand`) — already dispatches DeepSeek; used for per-mode verification.
- Isolated git worktree for any live DeepSeek re-run (RM-8 safety: DeepSeek runs `danger-full-access` under opencode).

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive prompt text plus tests; rollback is reverting the prompt edits. Because write-containment is untouched, the enforced net remains at every point — even a partial or reverted state cannot make a weak model's out-of-scope write land. Any live DeepSeek verification runs in an isolated worktree with a recorded recovery baseline commit, so a misbehaving lineage is fully recoverable by `git reset --hard <baseline>`. No shipped runtime behavior changes for strong models (SC-004), so the blast radius on rollback is limited to the prompt text.

<!-- /ANCHOR:rollback -->
