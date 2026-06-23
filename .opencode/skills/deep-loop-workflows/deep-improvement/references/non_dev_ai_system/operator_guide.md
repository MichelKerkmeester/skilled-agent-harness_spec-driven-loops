---
title: "Lane D Operator Guide"
description: "Operational guide for the Non-Dev-AI-System (Lane D) loop: contract overview, invocation, non-negotiable guardrails, onboarding a new packaging, conformance checklist, and pilot notes."
trigger_phrases:
  - "lane d operator guide"
  - "non-dev ai system loop"
  - "dry-run gap analysis"
  - "onboarding a new packaging"
  - "non-negotiable guardrails"
importance_tier: normal
contextType: implementation
version: 1.17.0.8
---

# Lane D Operator Guide

Operational guide for running the Lane D guarded autonomous refine loop. Lane D benchmarks an AI-system packaging, then proposes bounded edits to technique docs, verifies them against an independent grader on held-out fixtures inside an isolated git worktree, and promotes or rolls back.

---

## 1. OVERVIEW

### Purpose

Provides operational guidance for running the Lane D refine loop: how to invoke it, what guardrails are non-negotiable, how to onboard a new packaging, and how to verify conformance before any live run.

### When to Use

- Running a Lane D refine loop for the first time
- Onboarding a new packaging to Lane D
- Verifying conformance before a live run
- Diagnosing loop behavior or failures

### Core Principle

Self-reported quality scores are not a safe optimization target (the pilot measured self-grades inflated by about +6 of 25 versus independent graders).

### Key Sources

- [loop_contract.md](./loop_contract.md) — formal benchmark/_loop/loop.py contract
- [guardrails_teachings.md](./guardrails_teachings.md) — pilot teachings T1-T12
- [fixture_authoring.md](./fixture_authoring.md) — fixture authoring rules
- [grader_calibration.md](./grader_calibration.md) — grader calibration protocol

---

## 2. THE CONTRACT

Unlike Lanes A-C, the loop host lives **with the packaging under test**, not in this skill. A packaging opts in by implementing:

```
<packaging-root>/benchmark/_loop/loop.py     the guarded loop host (argv: --dry-run | --run [--max-iters N])
<packaging-root>/benchmark/_gates/gates.py   frozen scoring surface: freeze | check (exit 1 on drift)
<packaging-root>/benchmark/_gates/derive.py  source-of-truth -> derived-copies regeneration: derive | check
```

`loop.py` env knobs: `LOOP_FIXTURES`, `LOOP_VARIANTS`, `LOOP_HELD_OUT`, `LOOP_SAMPLES`, `PROPOSER_MODEL`, `GRADER_MODEL`, `LOOP_ACCEPT_MARGIN` (required held-out improvement beyond non-regression, default 0), `LOOP_POLISH` (=1 targets the lowest-margin dimension when all floors pass; default declines-when-clean), `LOOP_LOCK_TTL`, `LOOP_SKIP_PROBE`. The skill-side adapter (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`) only maps loop-host flags onto this surface and spawns `python3`. Loop logic stays packaging-owned so it can evolve without touching deep-improvement.

---

## 3. INVOCATION

```bash
# Safe default: dry-run (gates + grader-family guard + gap analysis, zero dispatches)
node scripts/shared/loop-host.cjs --mode=non-dev-ai-system-refine \
  --packaging-root "/path/to/Copywriter"

# Live guarded loop (dispatches models; may promote into a worktree branch)
node scripts/shared/loop-host.cjs --mode=non-dev-ai-system-refine \
  --packaging-root "/path/to/Copywriter" --live --max-iters 1 \
  --fixtures T1-write --variants project --held-out T7-stat --samples 3
```

---

## 4. NON-NEGOTIABLE GUARDRAILS (COUNCIL-DERIVED)

1. **Frozen scoring surface.** The rubric, floors and hard-blocker rules the grader scores against are content-hashed (`benchmark/_gates/`). The proposer may only edit technique docs. Any diff to the frozen region halts the loop (the optimizer must never write its own ruler).
2. **Independent different-family grader.** The blind re-grader must not share a model family with the proposer (the loop refuses, e.g. a deepseek grader for a deepseek proposer). The packaging's hard rules are checked by a deterministic code linter, never by a model.
3. **Held-out promotion gate.** Candidates are accepted only on non-regression of the independent grade on held-out fixtures the proposer never sees, measured against a pre-edit baseline in the same worktree. The baseline is measured once per session and reused for later iterations (HEAD cannot change mid-run, so re-measuring it would burn dispatches for no new signal); candidate measurements are always fresh. Held-out fixtures must produce gradeable deliverables (interactive fixtures that answer with a question cannot be graded).
4. **N-sample averaging.** Single benchmark runs are stochastic (the pilot saw one fixture swing 16 to 22 independent across runs). Targeting and promotion use `LOOP_SAMPLES` (default 3) averaged grades.
5. **Worktree isolation, always cleaned.** Edits happen in a worktree detached at HEAD (`loop.py --run` refuses a dirty source tree, including uncommitted edits to symlinked shared-global docs). Accepted candidates stay in their kept worktree (detached at the candidate state) for deliberate operator merge; rejected ones are removed, including on kill-switch exits. The first accepted promotion ends the session (`promotedStop`, canonical `converged`, with the kept-worktree path printed and journaled) — further iterations would re-sample unchanged HEAD and could never observe the kept improvement, so at most one worktree is kept per run.
6. **Resume + observability.** Every per-sample grade is journaled; a killed run resumes from its journal (grade reuse is guarded by a config hash + the packaging HEAD sha; candidate-phase grades are never reused). Held-out gating uses N-sample averages with all-samples pass semantics for floors and the hard-rule linter. Stop reasons map onto the deep-improvement journal taxonomy (`converged`, `blockedStop`, `stuckRecovery`, `error`, ...).

Kill-switches that halt without promoting: scoring-surface drift, derived-copy drift, grader-family violation, hard-blocker lint failure on graded output, new floor breach, held-out regression (or improvement below `LOOP_ACCEPT_MARGIN`), iteration ceiling, and a concurrent-run lock (single writer; stale locks from dead runs are evicted).

---

## 5. ONBOARDING A NEW PACKAGING (SCAFFOLDER)

Do not copy-edit a sibling packaging (a hand-port once disabled floor enforcement for two dimensions via stale dimension keys). Onboard with the kit:

1. Copy `assets/non_dev_ai_system/packaging_config.example.json`, fill every field for the new system (dimensions, floors, maxes, frozen-surface anchors, technique-doc map, fixtures, models, lexicon). The schema is `packaging_config.schema.json`.
2. Render: `python3 scripts/non-dev-ai-system/init_packaging.py --config <your-config.json> [--check-only]` writes `benchmark/_loop/`, `benchmark/_gates/` and benchmark harness files into the packaging root from `assets/non_dev_ai_system/templates/`. Set `derive_source_root` when derived-copy `src_relpath` values resolve somewhere other than the default `knowledge base` (for example `skill/references`).
3. Author fixtures per `references/non_dev_ai_system/fixture_authoring.md`, then run the conformance checklist below.

Template provenance and versioning: the templates parameterize the pilot implementations, including every deep-review guardrail fix, and carry a kit version (`kit_version` in the config, current 1.3.0; 1.2.0 added derived-copy `mode: symlink` with `link_target` and the `transform: skill_strip` sk-doc alignment for skill copies; 1.3.0 added per-entry `src_root` overrides on `derived_copies` (asset mirrors, SKILL.md byte-mirrors) and the gauntlet's live-packaging overlay — the attack worktree now mirrors the live tree instead of git HEAD, so uncommitted layout changes are testable, with attack resets restoring from the live tree). A packaging owns its rendered instance afterwards. The maintenance model is TEMPLATE-AS-SOURCE for new packagings and instance-owned thereafter: live instances may evolve ahead of the kit (the pilots do), and that drift is accepted, not a defect. When the kit advances: bump `kit_version` in your config, run `init_packaging.py --check-only` against it, and diff the temp render against your live instance to review what the new kit would change before adopting any of it. Fixes that harden guardrails should land in BOTH the kit and the live instances in the same change.

---

## 6. CONTRACT CONFORMANCE CHECKLIST

A new packaging is Lane-D-ready when every box checks. Verify each with the listed command before any live run.

- [ ] `benchmark/_loop/loop.py` exists; `python3 benchmark/_loop/loop.py --dry-run` exits 0 (gates + grader-family guard + gap analysis).
- [ ] `benchmark/_gates/gates.py freeze` snapshots the scoring surface; `check` exits 1 after any edit to a frozen region (test it, then re-freeze).
- [ ] `benchmark/_gates/derive.py derive && benchmark/_gates/derive.py check` exits 0; every derived copy regenerates from the configured source root (a single-packaging system may declare an empty derived set).
- [ ] All paths honor `CW_ROOT` (run the dry-run from a git worktree of the repo: it must read only worktree files).
- [ ] Benchmark fixtures produce a delimited deliverable (`<DELIVERABLE>` contract); held-out fixtures are non-interactive AND sensitive to the dimensions being optimized.
- [ ] A deterministic code linter enforces the packaging's hard rules (never an LLM).
- [ ] The grader model is a different family from the proposer; the loop refuses otherwise.
- [ ] The red-team gauntlet (`benchmark/_loop/gauntlet.py` or equivalent) passes its dispatch-free battery: 9 attacks producing 10 checks, all green.
- [ ] Loop state (`benchmark/_loop/state/`) is gitignored; the staleness guard covers the editable source root and the real targets of any symlinked shared docs.

---

## 7. PILOT

Barter Copywriter: `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter` (skill-as-source packaging: `skill/references/` as source of truth, `claude project/` mirrors). Its `benchmark/grader/regrade.py` writes per-sample grades plus the self-vs-independent phantom gap; `benchmark/_loop/state/loop-journal.jsonl` is the append-only run journal. Dispatch discipline (stdin from `/dev/null`, one dispatch at a time, never `pkill` shared CLI sessions) is encoded in the packaging's `benchmark/run.sh`.

---

## 8. RELATED RESOURCES

- [loop_contract.md](./loop_contract.md) — the formal benchmark/_loop/loop.py contract
- [guardrails_teachings.md](./guardrails_teachings.md) — the twelve pilot teachings and their guardrail encodings
- [fixture_authoring.md](./fixture_authoring.md) — how to author visible, held-out and gold fixtures
- [grader_calibration.md](./grader_calibration.md) — the calibration protocol for independent graders
