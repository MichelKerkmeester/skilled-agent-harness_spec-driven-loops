# Packaging-Benchmark-Refine (Lane D) - Operator Guide

Lane D benchmarks an AI-system **packaging** (the same prompt system shipped as CLI runtime, claude.ai Project and native skill), then runs a **guarded autonomous refine loop**: propose a bounded edit to the packaging's technique docs, verify it against an independent grader on held-out fixtures inside an isolated git worktree, and promote or roll back. It exists because self-reported quality scores are not a safe optimization target (the pilot measured self-grades inflated by about +6 of 25 versus independent graders).

## 1. THE CONTRACT

Unlike Lanes A-C, the loop host lives **with the packaging under test**, not in this skill. A packaging opts in by implementing:

```
<packaging-root>/_loop/loop.py     the guarded loop host (argv: --dry-run | --run [--max-iters N])
<packaging-root>/_gates/gates.py   frozen scoring surface: freeze | check (exit 1 on drift)
<packaging-root>/_gates/derive.py  source-of-truth -> derived-copies regeneration: derive | check
```

`loop.py` env knobs: `LOOP_FIXTURES`, `LOOP_VARIANTS`, `LOOP_HELD_OUT`, `LOOP_SAMPLES`, `PROPOSER_MODEL`, `GRADER_MODEL`, `LOOP_ACCEPT_MARGIN` (required held-out improvement beyond non-regression, default 0), `LOOP_POLISH` (=1 targets the lowest-margin dimension when all floors pass; default declines-when-clean), `LOOP_LOCK_TTL`, `LOOP_SKIP_PROBE`. The skill-side adapter (`scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`) only maps loop-host flags onto this surface and spawns `python3`. Loop logic stays packaging-owned so it can evolve without touching deep-improvement.

## 2. INVOCATION

```bash
# Safe default: dry-run (gates + grader-family guard + gap analysis, zero dispatches)
node scripts/shared/loop-host.cjs --mode=non-dev-ai-system-refine \
  --packaging-root "/path/to/Copywriter"

# Live guarded loop (dispatches models; may promote into a worktree branch)
node scripts/shared/loop-host.cjs --mode=non-dev-ai-system-refine \
  --packaging-root "/path/to/Copywriter" --live --max-iters 1 \
  --fixtures T1-write --variants project --held-out T7-stat --samples 3
```

## 3. NON-NEGOTIABLE GUARDRAILS (council-derived)

1. **Frozen scoring surface.** The rubric, floors and hard-blocker rules the grader scores against are content-hashed (`_gates/`). The proposer may only edit technique docs. Any diff to the frozen region halts the loop (the optimizer must never write its own ruler).
2. **Independent different-family grader.** The blind re-grader must not share a model family with the proposer (the loop refuses, e.g. a deepseek grader for a deepseek proposer). The packaging's hard rules are checked by a deterministic code linter, never by a model.
3. **Held-out promotion gate.** Candidates are accepted only on non-regression of the independent grade on held-out fixtures the proposer never sees, measured against a pre-edit baseline in the same worktree. Held-out fixtures must produce gradeable deliverables (interactive fixtures that answer with a question cannot be graded).
4. **N-sample averaging.** Single benchmark runs are stochastic (the pilot saw one fixture swing 16 to 22 independent across runs). Targeting and promotion use `LOOP_SAMPLES` (default 3) averaged grades.
5. **Worktree isolation, always cleaned.** Edits happen in a worktree detached at HEAD (`loop.py --run` refuses a dirty source tree, including uncommitted edits to symlinked shared-global docs). Accepted candidates stay in their kept worktree (detached at the candidate state) for deliberate operator merge; rejected ones are removed, including on kill-switch exits.
6. **Resume + observability.** Every per-sample grade is journaled; a killed run resumes from its journal (grade reuse is guarded by a config hash + the packaging HEAD sha; candidate-phase grades are never reused). Held-out gating uses N-sample averages with all-samples pass semantics for floors and the hard-rule linter. Stop reasons map onto the deep-improvement journal taxonomy (`converged`, `blockedStop`, `stuckRecovery`, `error`, ...).

Kill-switches that halt without promoting: scoring-surface drift, derived-copy drift, grader-family violation, hard-blocker lint failure on graded output, new floor breach, held-out regression (or improvement below `LOOP_ACCEPT_MARGIN`), iteration ceiling, and a concurrent-run lock (single writer; stale locks from dead runs are evicted).

## 4. ONBOARDING A NEW PACKAGING (SCAFFOLDER)

Do not copy-edit a sibling packaging (a hand-port once disabled floor enforcement for two dimensions via stale dimension keys). Onboard with the kit:

1. Copy `assets/non_dev_ai_system/packaging_config.example.json`, fill every field for the new system (dimensions, floors, maxes, frozen-surface anchors, technique-doc map, fixtures, models, lexicon). The schema is `packaging_config.schema.json`.
2. Render: `python3 scripts/non-dev-ai-system/init_packaging.py --config <your-config.json> [--check-only]` writes `_loop/`, `_gates/` and `benchmark/` into the packaging root from `assets/non_dev_ai_system/templates/`.
3. Author fixtures per `references/non_dev_ai_system/fixture_authoring.md`, then run the conformance checklist below.

Template provenance and versioning: the templates parameterize the pilot implementations, including every deep-review guardrail fix, and carry a kit version (`kit_version` in the config, current 1.1.0). A packaging owns its rendered instance afterwards. The maintenance model is TEMPLATE-AS-SOURCE for new packagings and instance-owned thereafter: live instances may evolve ahead of the kit (the pilots do), and that drift is accepted, not a defect. When the kit advances: bump `kit_version` in your config, run `init_packaging.py --check-only` against it, and diff the temp render against your live instance to review what the new kit would change before adopting any of it. Fixes that harden guardrails should land in BOTH the kit and the live instances in the same change.

## 5. CONTRACT CONFORMANCE CHECKLIST

A new packaging is Lane-D-ready when every box checks. Verify each with the listed command before any live run.

- [ ] `_loop/loop.py` exists; `python3 _loop/loop.py --dry-run` exits 0 (gates + grader-family guard + gap analysis).
- [ ] `_gates/gates.py freeze` snapshots the scoring surface; `check` exits 1 after any edit to a frozen region (test it, then re-freeze).
- [ ] `_gates/derive.py derive && _gates/derive.py check` exits 0; every derived copy regenerates from the source of truth (a single-packaging system may declare an empty derived set).
- [ ] All paths honor `CW_ROOT` (run the dry-run from a git worktree of the repo: it must read only worktree files).
- [ ] Benchmark fixtures produce a delimited deliverable (`<DELIVERABLE>` contract); held-out fixtures are non-interactive AND sensitive to the dimensions being optimized.
- [ ] A deterministic code linter enforces the packaging's hard rules (never an LLM).
- [ ] The grader model is a different family from the proposer; the loop refuses otherwise.
- [ ] The red-team gauntlet (`_loop/gauntlet.py` or equivalent) passes its dispatch-free battery: 9 attacks producing 10 checks, all green.
- [ ] Loop state (`_loop/state/`) is gitignored; the staleness guard covers the knowledge base AND the real targets of any symlinked shared docs.

## 6. PILOT

Barter Copywriter: `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter` (three packagings: CLI knowledge base as source of truth, `claude project/`, `barter-copywriter/` skill). Its `benchmark/grader/regrade.py` writes per-sample grades plus the self-vs-independent phantom gap; `_loop/state/loop-journal.jsonl` is the append-only run journal. Dispatch discipline (stdin from `/dev/null`, one dispatch at a time, never `pkill` shared CLI sessions) is encoded in the packaging's `benchmark/run.sh`.
