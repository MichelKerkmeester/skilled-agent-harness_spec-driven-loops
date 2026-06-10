---
title: "Lane D Guardrails and Teachings"
description: "The twelve pilot teachings (T1-T12) with the guardrail that encodes each one and where it lives in the deep-improvement kit."
---

# Lane D Guardrails and Teachings

The twelve pilot teachings derived from the Barter Copywriter pilot. Each teaching produced a concrete guardrail encoded somewhere in the kit.

---

## 1. OVERVIEW

### Purpose

Documents the twelve pilot teachings (T1-T12) and the concrete guardrail each one produced, with pointers to where each guardrail lives in the deep-improvement kit.

### When to Use

- Understanding why a specific guardrail exists
- Diagnosing which teaching applies to a loop failure
- Onboarding a new packaging and reviewing required guardrails

### Core Principle

Every guardrail in the kit traces back to a measurable failure observed in the pilot.

---

## 2. T1 — SELF-SCORES ARE UNSAFE TO OPTIMIZE

The pilot measured self-grades inflated by about +6 of 25 versus independent graders. Self-reported quality scores are not a safe optimization target.

**Guardrail:** The loop optimizes the independent grade, never the model's self-reported score. The phantom gap (self minus independent) is tracked per iteration and surfaced in the journal.

**Lives in:** `loop.py` (the `analyze_gap` and convergence logic), `benchmark/grader/regrade.py` (records both self and independent scores).

---

## 3. T2 — FROZEN SCORING SURFACE

The rubric, floors and hard-blocker rules the grader scores against must be content-hashed and immutable. The optimizer must never write its own ruler.

**Guardrail:** `benchmark/_gates/gates.py freeze` snapshots the scoring surface. `check` exits 1 on any drift. The proposer may only edit technique docs. Any diff to the frozen region halts the loop (kill-switch).

**Lives in:** `benchmark/_gates/gates.py`, `packaging_config.schema.json` (`frozen_surface` field), `loop.py` (`preflight_gates`).

---

## 4. T3 — DIFFERENT-FAMILY GRADER

The blind re-grader must not share a model family with the proposer. A same-family grader would inherit the proposer's biases.

**Guardrail:** The loop refuses a same-family pair (e.g. a deepseek grader for a deepseek proposer). The check compares `GRADER_MODEL` against `PROPOSER_FAMILY` substring. Hard rules are checked by a deterministic code linter, never by a model.

**Lives in:** `loop.py` (`assert_grader_family`), `packaging_config.schema.json` (`models.proposer_family`).

---

## 5. T4 — N-SAMPLE AVERAGING

Single benchmark runs are stochastic. The pilot saw one fixture swing from 16 to 22 independent across runs.

**Guardrail:** Targeting and promotion use `LOOP_SAMPLES` (default 3) averaged grades. All-samples pass semantics are required for floors and the hard-rule linter.

**Lives in:** `loop.py` (`sample` and `_aggregate` functions), env knob `LOOP_SAMPLES`.

---

## 6. T5 — DELIVERABLE OUTPUT CONTRACT

Fixtures must produce a delimited deliverable (`<DELIVERABLE>` contract) so the grader can find and score the output deterministically.

**Guardrail:** The `<DELIVERABLE>` output contract text is embedded in benchmark prompts. The grader parses only content within the delimiter.

**Lives in:** `benchmark/run.sh`, `benchmark/grader/regrade.py`, fixture prompts.

---

## 7. T6 — GRADEABLE HELD-OUT FIXTURES

Note: the two T6 layers deliberately differ on unrecorded fixtures - skill-side `fixture-lint.cjs` fails them closed (exit 1), packaging-side `lint_held_out()` passes them because the first live run records them.

Interactive fixtures that answer with a clarifying question cannot be graded. They turn into false gate failures.

**Guardrail:** two distinct layers gate held-out lists before any paid dispatch. Skill-side, `scripts/shared/fixture-lint.cjs` classifies fixtures from recorded outputs (deliverable, uncontracted or unrecorded) and exits non-zero on ungradeable entries. Packaging-side, `lint_held_out()` in the loop host re-checks run-tagged recorded outputs for a `<DELIVERABLE>` region at pre-flight and halts the loop on failures. They are separate implementations with the same teaching, not one tool.

**Lives in:** `scripts/shared/fixture-lint.cjs` (skill-side) and each packaging's `benchmark/_loop/loop.py` `lint_held_out()` (loop pre-flight).

---

## 8. T7 — MEASUREMENT GAPS ARE NOT FAILURES

When no gradeable output is produced (n=0), that is a measurement gap, not a quality signal. Treating it as a failure would produce false rejections.

**Guardrail:** The `measure` function returns `None` for independent score, floors and HVR when `n_measured == 0`. Callers distinguish "no gradeable output" from an actual failure. The journal records `visibleUnmeasurable` or `promote_reject` with reason "held-out unmeasurable".

**Lives in:** `loop.py` (`measure`, `guarded_promote`, `run`).

---

## 9. T8 — CLEANUP IN FINALLY

Worktrees and locks must be cleaned up even when the loop is killed mid-iteration.

**Guardrail:** The `run` function wraps its main loop in `try/finally`. The `finally` block always calls `release_lock()`. Worktree cleanup (`cleanup_worktree`) runs in a per-iteration `finally` block.

**Lives in:** `loop.py` (`run` function, `finally` blocks).

---

## 10. T9 — SURVIVE SESSION TEARDOWN VIA LOCK+RESUME

A killed run must not lose its work. The loop must be able to resume from its journal.

**Guardrail:** The lock+resume system detects orphaned `session_start` entries, sweeps leaked worktrees, and builds a resume cache of per-sample grades guarded by config hash and HEAD sha. Candidate-phase grades are never reused.

**Lives in:** `loop.py` (`acquire_lock`, `release_lock`, `find_orphans`, `build_resume_cache`, `sweep_stale_worktrees`).

---

## 11. T10 — DECLINE-WHEN-CLEAN

When all floors pass and there is no actionable deficit, the loop should stop rather than chase diminishing returns.

**Guardrail:** `analyze_gap` returns `dimension: None` when no floor deficits exist and `LOOP_POLISH` is not set. The loop ends with reason `noTarget` (canonical: `converged`). Setting `LOOP_POLISH=1` opts in to lowest-margin targeting.

**Lives in:** `loop.py` (`analyze_gap`), env knob `LOOP_POLISH`.

---

## 12. T11 — AUTH PROBES BEFORE BATCHES

An expired credential must fail the run in one probe, not burn N benchmark or grading dispatches returning auth errors.

**Guardrail:** `probe_provider()` sends one minimal dispatch ("Reply with exactly: OK") to both the proposer and grader models before any batch work. An auth failure raises a kill-switch immediately. Skippable via `LOOP_SKIP_PROBE=1`.

**Lives in:** `loop.py` (`probe_provider`, called at the top of `run`).

---

## 13. T12 — PROVE PROMOTION-ACCEPT WITH A SYNTHETIC DEFICIT

The promotion gate must be validated end-to-end before trusting it on real improvements. A synthetic deficit injects harmful guidance into an isolated worktree and confirms the loop detects, rejects and rolls back.

**Guardrail:** The red-team gauntlet (`benchmark/_loop/gauntlet.py`) runs 9 attacks producing 10 checks, all dispatch-free: frozen-surface edit, derived-copy or empty-derive integrity, same-family grader, unmeasurable held-out, hard-rule lint, synonym-laundering boundary, kill-switch cleanup, dirty tree, and the lock pair (concurrent refusal plus stale eviction). Promotion-accept was proven via a synthetic-deficit run in the pilot.

**Lives in:** `benchmark/_loop/gauntlet.py`, pilot evidence in `feature_catalog/06--non-dev-ai-system/guarded-refine-loop.md`.

---

## 14. RELATED RESOURCES

- [loop_contract.md](./loop_contract.md) — the formal benchmark/_loop/loop.py contract
- [operator_guide.md](./operator_guide.md) — invocation, guardrails, conformance checklist
- [fixture_authoring.md](./fixture_authoring.md) — how to author visible, held-out and gold fixtures
- [grader_calibration.md](./grader_calibration.md) — the calibration protocol for independent graders
