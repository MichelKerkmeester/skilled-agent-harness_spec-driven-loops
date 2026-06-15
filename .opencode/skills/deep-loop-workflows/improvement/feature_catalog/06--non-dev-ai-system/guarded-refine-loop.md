---
title: "Guarded packaging refine loop"
description: "Routes loop-host to the non-dev-ai-system-refine mode, which delegates to a packaging-owned benchmark/_loop/loop.py host; the adapter is a thin env/argv shim and the loop enforces frozen-surface, different-family-grader, held-out-promotion, and worktree-isolation guardrails."
trigger_phrases:
  - "guarded refine loop"
  - "non-dev-ai-system-refine"
  - "run-non-dev-ai-system.cjs"
  - "lane d"
  - "--mode=non-dev-ai-system-refine"
  - "benchmark/_loop/loop.py contract"
  - "frozen scoring surface"
---

# Guarded packaging refine loop

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Lane D benchmarks an AI-system **packaging** (the same prompt system shipped as CLI runtime, claude.ai Project and native skill), then runs a **guarded autonomous refine loop**: propose a bounded edit to the packaging's technique docs, verify it against an independent grader on held-out fixtures inside an isolated git worktree, and promote or roll back. It exists because self-reported quality scores are not a safe optimization target — the pilot measured self-grades inflated by about +6 of 25 versus independent graders. Promotion-accept was proven via a synthetic-deficit run in an isolated worktree; the red-team gauntlet passes its dispatch-free battery (9 attacks, 10 checks).

Unlike Lanes A–C, the loop host lives **with the packaging under test**, not in this skill. A packaging opts in by implementing the `benchmark/_loop/loop.py` contract. The skill-side adapter (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`) is a thin shim that translates loop-host flags onto the packaging's env/argv surface and spawns `python3` — it owns no loop logic.

---

## 2. HOW IT WORKS

`scripts/shared/loop-host.cjs` adds the lane additively. It defines `const LANE_NON_DEV_AI_SYSTEM = new Set(['run-non-dev-ai-system.cjs'])` and includes `'non-dev-ai-system-refine'` in the closed `VALID_MODES` set alongside `agent-improvement`, `model-benchmark`, and `skill-benchmark`. `planInvocation('non-dev-ai-system-refine', args)` fails closed unless `--packaging-root` is present, then returns a single step `{ script: 'run-non-dev-ai-system.cjs', args: [...] }`, forwarding `--live`, `--max-iters`, `--fixtures`, `--variants`, `--held-out`, `--samples`, `--proposer-model`, and `--grader-model`. `resolveScriptPath` maps the bare `run-non-dev-ai-system.cjs` name to `scripts/non-dev-ai-system/` at spawn time.

`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` is the thin adapter (`parseArgs` + `main`). It resolves `--packaging-root`, confirms `benchmark/_loop/loop.py` exists (exit 2 otherwise), maps the recognized flags to the `ENV_FORWARD` table (`LOOP_FIXTURES`, `LOOP_VARIANTS`, `LOOP_HELD_OUT`, `LOOP_SAMPLES`, `PROPOSER_MODEL`, `GRADER_MODEL`), decides `--dry-run` (default, zero dispatches) or `--run` (when `--live` is passed), and spawns `python3 benchmark/_loop/loop.py` with the chosen argv and env.

### 2.1 The packaging contract

A Lane-D-ready packaging implements:

| Component | Path | Role |
|---|---|---|
| Loop host | `<root>/benchmark/_loop/loop.py` | Pre-flight gates → N-sample benchmark → independent re-grade → gap analysis → worktree propose → guarded promote-N → converge/kill-switch |
| Frozen scoring surface | `<root>/benchmark/_gates/gates.py` | `freeze` snapshots the scoring surface (rubric, floors, hard-blocker rules); `check` exits 1 on drift |
| Derived-copy regeneration | `<root>/benchmark/_gates/derive.py` | `derive` regenerates derived copies from the configured source root; `check` exits 1 on drift |

### 2.2 Non-negotiable guardrails

1. **Frozen scoring surface.** The rubric, floors and hard-blocker rules the grader scores against are content-hashed. The proposer may only edit technique docs — any diff to the frozen region halts the loop.
2. **Independent different-family grader.** The blind re-grader must not share a model family with the proposer; the loop refuses a same-family pair (e.g. deepseek grader for a deepseek proposer). Hard rules are checked by a deterministic code linter, never an LLM.
3. **Held-out promotion gate.** Candidates are accepted only on non-regression of the independent grade on held-out fixtures the proposer never sees, measured against a pre-edit baseline in the same worktree.
4. **N-sample averaging.** Single benchmark runs are stochastic (the pilot saw one fixture swing 16 to 22 independent across runs). Promotion uses `LOOP_SAMPLES` (default 3) averaged grades.
5. **Worktree isolation, always cleaned.** Edits happen on a detached worktree from HEAD. Accepted candidates stay on the worktree branch for deliberate operator merge; rejected ones are removed, including on kill-switch exits.

### 2.3 Kill-switches

HARD kill-switches that HALT the loop: scoring-surface drift, derived-copy drift, grader-family violation, hard-blocker lint failure on candidate held-out output, concurrent-run lock. A new floor breach or held-out regression is a promote_reject - the candidate is dropped and the loop continues; the iteration ceiling ends the session.

### 2.4 Pilot evidence

Barter Copywriter (`.../AI_Systems/Barter/Copywriter`) served as the pilot packaging — skill-as-source packaging (`skill/references/` as source of truth, `claude project/` mirrors) with `benchmark/_gates/` frozen scoring surface, `benchmark/_gates/derive.py` derivation, and a `benchmark/` harness with blind re-grader. The pilot confirmed the self-vs-independent phantom gap (~+6/25) and promotion-accept through a synthetic-deficit run injecting harmful guidance into an isolated worktree — the loop journaled a `promote_accept` lifting the deficit and restored the grade to baseline. The red-team gauntlet (`benchmark/_loop/gauntlet.py`) passes its dispatch-free battery (9 attacks, 10 checks), covering frozen-surface edit, same-family grader, the lock pair, and six additional attack vectors.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/improvement/scripts/shared/loop-host.cjs` | Orchestration | Resolves `--mode=non-dev-ai-system-refine`, validates against `VALID_MODES`, plans the single adapter step pointing at `run-non-dev-ai-system.cjs`. |
| `.opencode/skills/deep-loop-workflows/improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` | Adapter | Thin env/argv shim: maps loop-host flags to `benchmark/_loop/loop.py` surface, decides `--dry-run` vs `--run`, spawns `python3`. |
| `<packaging-root>/benchmark/_loop/loop.py` | Loop host (packaging-owned) | Pre-flight gates, N-sample benchmark, blind re-grade, gap analysis, worktree propose, guarded promote-N, converge. |
| `<packaging-root>/benchmark/_gates/gates.py` | Scoring surface (packaging-owned) | Freeze / check the frozen scoring surface. |
| `<packaging-root>/benchmark/_gates/derive.py` | Derived copies (packaging-owned) | Derive / check derived copies from source of truth. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/improvement/scripts/shared/tests/loop-host.vitest.ts` | Automated test | Asserts `VALID_MODES` includes `non-dev-ai-system-refine`, that the plan is a single `run-non-dev-ai-system.cjs` step, that it fails closed without `--packaging-root`, and that Lane A–C plans stay byte-identical. |
| `.opencode/skills/deep-loop-workflows/improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` | Automated test | Verifies `parseArgs`, `ENV_FORWARD` mapping, `--dry-run` default, and failure on missing `benchmark/_loop/loop.py`. |
| `.opencode/skills/deep-loop-workflows/improvement/references/non_dev_ai_system/operator_guide.md` | Documentation | Canonical invocation, guardrails, contract conformance checklist, pilot notes. |

---

## 4. SOURCE METADATA

- Group: Non-dev-ai-system mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--non-dev-ai-system/guarded-refine-loop.md`
Related references:
- [operator_guide.md](../../references/non_dev_ai_system/operator_guide.md) — Canonical invocation, guardrails, and contract conformance checklist
