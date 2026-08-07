# Seat A: Pragmatist Proposal

**Lens**: "Simplest workable, what can we cut"
**Executor**: claude (claude-opus-4-7 via Agent dispatch, operator-constrained to Claude-only)
**Date**: 2026-05-16

---

## Q1 — Flow choice

**Bespoke loop. Do not retarget `deep-agent-improvement`.**

`deep-agent-improvement` is evaluator-first for *bounded agent files* — its profiling, candidate mutation, and promotion gates assume a single agent-surface artifact, not a prompt-scaffolding contract that fans out across `SKILL.md` + `prompt_templates.md` + `prompt_quality_card.md` + recipes. Retargeting it would require gutting its dynamic-profile generator and integration scanner — more work than building a packet-local loop that reuses the patterns we already trust (`deep-research` state.jsonl discipline, signature-dedup from `deep-agent-improvement`, real-model dispatch via cli-devin). The 003 spec already captures the right shape: append-only state, hill-climbing one-axis-per-iter, 3-signal convergence, 7-mode failure recovery. Ship that. Don't shoehorn an agent-improvement skill into a prompt-optimization job.

## Q2 — Rubric (5 dims, weights sum to 1.00)

| Dim | Weight | Method | What it measures |
|-----|--------|--------|------------------|
| **Bundle-gate compliance** | 0.35 | det (3-layer: grep imports / grep exports / smoke-run validation_commands) | Whether the output passes the documented 3-check gate from `feedback_bundle_gate_smoke_run`. Highest weight because this is the single most cited SWE 1.6 failure mode. |
| **Path/cwd correctness** | 0.25 | det (regex + AST: all paths absolute or relative-to-stated-cwd; no wrong-cwd inheritance) | Whether file paths in the output respect the fixture's stated CWD. Directly grounded in the wrong-cwd defect class. |
| **Acceptance criteria met** | 0.25 | grader | Whether the fixture's stated acceptance bullets actually evaluate true on the produced artifact (semantic check the grader handles cheaply). |
| **Hallucination flags** | 0.15 | det (allowlist diff: symbols/flags in output minus fixture's known-real set) | Count of references to symbols/flags not in fixture's allowlist. Cheap deterministic catch for the "plausible-name hallucination" failure mode. |

**Weights total: 0.35 + 0.25 + 0.25 + 0.15 = 1.00.**

**Why 4 dims, not 5.** I cut the "Pre-planning conformance" dim from the seeded proposal. Rationale: pre-planning presence/structure is a *prompt-input* property (we either ask for it or we don't), not an *output-quality* property. Scoring outputs on whether the pre-planning block looks well-structured rewards the prompt variant for asking, not for producing good code. If the operator wants to A/B "ask for pre-planning vs not", that's a knob — the rubric measures whether asking *paid off* via the other 4 dims. Cutting this dim drops 1 deterministic-check script (003 win), simplifies fixture authoring (no per-fixture pre-plan regex), and concentrates signal on what actually matters: did the output pass the gate, hit the right paths, satisfy acceptance, and avoid hallucinating.

**Why bundle-gate is 0.35, not 0.30.** The two memory entries (`feedback_cli_devin_bundle_verification` + `feedback_bundle_gate_smoke_run`) both describe bundle-gate failures, and `feedback_bundle_gate_smoke_run` explicitly says grep-only gates miss real defects — the 3-layer check is the documented mitigation. Weighting this lower than 0.35 risks the loop converging on variants that score well elsewhere but still ship bundle-gate bypasses, which is the exact failure we're trying to prevent. The other 0.05 came from cutting pre-planning conformance.

## Q3 — Fixture catalog (5 entries — Pragmatist minimum-viable set)

### fix-001-hallucinated-cli-flag
- **task**: Generate a shell script that uses `cli-codex` to dispatch a code review against `~/Projects/test-repo/src/auth.ts`. Use only documented `cli-codex` flags from `.opencode/skills/cli-codex/SKILL.md` and `references/cli_reference.md`.
- **scope**: CWD=`/tmp/fix-001-workdir`; allowed files: `dispatch.sh` only.
- **acceptance**: Every `cli-codex` flag in the script grep-verifies against the skill's documented flag list; no `--reasoning-effort` / `--full-auto` / `--ask-mode` (hallucinated examples from prior incidents); script exits 0 on `bash -n dispatch.sh` syntax check.
- **grounded_in**: `feedback_cli_devin_bundle_verification` (hallucinated plausible CLI flags).

### fix-002-wrong-cwd-paths
- **task**: Given the fixture CWD `/tmp/fix-002-workdir/`, produce a Node script that reads `./config/settings.json`, transforms it, and writes `./output/result.json`. The fixture passes a *relative* CWD context but Devin must not inherit a different CWD from prompt template residue.
- **scope**: CWD=`/tmp/fix-002-workdir`; allowed files: `transform.js`.
- **acceptance**: All `fs.readFile` / `fs.writeFile` / `require` path arguments either start with `/tmp/fix-002-workdir/` (absolute) OR are bare relative (`./config/...`, `./output/...`); no paths reference `/Users/`, `~/`, or any absolute path outside the fixture CWD; `node transform.js` does not throw ENOENT under the fixture CWD.
- **grounded_in**: `feedback_bundle_gate_smoke_run` (wrong-cwd path defects inherited from prompt templates).

### fix-003-bundle-gate-three-layer
- **task**: Generate a TypeScript module `src/lib/retry.ts` that exports `retry(fn, opts)` with exponential backoff. Include a smoke-run validation command that exercises the export.
- **scope**: CWD=`/tmp/fix-003-workdir`; allowed files: `src/lib/retry.ts`, `package.json` (if needed for tsx/ts-node).
- **acceptance**: (Layer 1) `grep -E "^import|^const .* = require" src/lib/retry.ts` finds only `'node:'` builtins or no imports (no fabricated dependencies); (Layer 2) `grep -E "^export (function|const) retry" src/lib/retry.ts` finds exactly one match; (Layer 3) `npx tsx -e "import('./src/lib/retry.ts').then(m => m.retry(() => 'ok', {retries:1}).then(console.log))"` prints `ok` and exits 0.
- **grounded_in**: `feedback_bundle_gate_smoke_run` (gate needs 3 checks: imports grep + exports grep + validation_commands smoke-run).

### fix-004-multi-file-acceptance
- **task**: Refactor a single `validate()` function in `src/check.ts` so it accepts an options object (`{strict: boolean}`) instead of positional args, and update its 2 call sites in `src/cli.ts` and `tests/check.test.ts`. Keep behavior identical when `strict=false`.
- **scope**: CWD=`/tmp/fix-004-workdir`; allowed files: `src/check.ts`, `src/cli.ts`, `tests/check.test.ts` (3 files exactly).
- **acceptance**: `grep -c "validate(" src/cli.ts` returns 1 (call site updated); `grep -E "validate\(.*\{" src/cli.ts` returns ≥1 (options-object shape); `grep -c "validate(" tests/check.test.ts` returns the same count as before the refactor (test count preserved); `git diff --stat` shows changes only to the 3 allowed files; `node --check src/check.ts src/cli.ts` passes.
- **grounded_in**: Real failure category — multi-file refactor scope-creep. SWE 1.6 has a documented tendency to touch adjacent files; this fixture forces the scope check.

### fix-005-readonly-review-no-writes
- **task**: Review the security of a small auth module at `src/auth.ts` (provided in fixture). Produce a markdown report at `/tmp/fix-005-workdir/review.md` with P0/P1/P2 findings. Do NOT modify `src/auth.ts` or any other file.
- **scope**: CWD=`/tmp/fix-005-workdir`; allowed files: `review.md` only (writable); `src/auth.ts` (read-only).
- **acceptance**: `git status` after dispatch shows only `review.md` as new/modified; `src/auth.ts` byte-identical to fixture seed; `review.md` contains ≥3 findings each with `### P[012]` heading + `file:line` citation + `Rationale:` + `Fix:` sections; no markdown finding cites a line beyond `wc -l src/auth.ts` line count.
- **grounded_in**: Real failure category — write-when-asked-not-to. SWE 1.6 ignoring read-only intent is documented in cli-devin Rule 11 ("Validate Devin-generated code") and the auto-permission caveat. Tests the prompt's ability to enforce read-only intent under `--permission-mode auto`.

## Concrete picks on open questions

- **Grader**: **claude-sonnet-4.6** (single-grader, no dual). Cheaper, faster, and 4/5 dims are deterministic anyway — the grader only judges fix-004's acceptance-criteria-met dim (semantic refactor correctness) and fix-005's finding-quality. Dispute detection on a 25%-weight dim with 5 fixtures is overkill. If we observe grader noise post-iter-3, the council can escalate to dual-grader for that one dim only.
- **Fixture count**: **5**. Each maps to a distinct documented failure mode or scope-discipline class. Adding fixtures 6-10 would mostly produce correlated signal with 1-5; 5 fixtures × 12 iters × 3 fixture-dispatch-coverage = 180 max dispatches, fits well inside free-tier envelope.
- **Min iters before STOP-allowed**: **6** (keep). Below 6 we don't have enough mutation-axis coverage to trust convergence; above 6 wastes budget if seeds are already strong.
- **Max iters cap (budget)**: **10** (lower from 12). With 5 fixtures and council-seeded variants, 10 iters should be plenty. The 2-iter savings keeps us comfortably under free-tier rate-limit risk and gives operator a clearer wall-clock budget. If we miss convergence at 10, the council can revise — but the budget pressure forces tighter seed quality.
- **Sequential vs parallel seat dispatch**: **Sequential default (ratified)**. Free-tier rate limits and the documented `feedback_cli_dispatch_unreliability` (parallel CLI dispatches silently fail) both argue sequential. For seat dispatch within the *council*, sequential is non-negotiable. For *fixture* dispatch within an iteration (003), parallel wave-of-3 is acceptable per the 003 spec — that's intra-CLI parallelism with cache locks, not cross-CLI.

## What I'd cut if forced (Pragmatist's "what's at risk")

**Cut first: the dual-grader infrastructure (REQ-007 in 002).** Building dispute detection across two grader models costs real implementation time in 002 and burns 2x grader calls in 003. With only 1 grader-judged dim at 25% weight across 5 fixtures, dispute risk is bounded. Cutting it shrinks 002's grader harness by ~40% and halves 003's grader spend. **Risk if cut**: if claude-sonnet-4.6 has systematic bias on the acceptance-criteria-met dim, we won't catch it without manual grader-output spot-check. Mitigation: operator reviews 3 random grader outputs at iter-3 and iter-6; if scoring looks systematically off, escalate to dual-grader mid-loop.

**Cut second: the `state/eval-loop-dashboard.md` auto-generation (REQ-011 in 003).** It's a nice-to-have for operator inspection but not load-bearing — the JSONL state file already has everything. The synthesize.cjs script at the end produces the rankings. A mid-run dashboard saves wall-clock for the operator but costs implementation effort. **Risk if cut**: operator has to grep JSONL to check progress mid-run. Acceptable for a 5-fixture × 10-iter loop that completes in ~2.5 hours wall-clock typical.

**What I would NOT cut**: the 7-mode failure-recovery table, the per-fixture in-flight markers, and the convergence-vote 3-signal weighting. Those are load-bearing for the loop surviving a multi-day pause-resume cycle, which is the realistic scenario given free-tier rate limits. Cutting any of those trades implementation savings for run-fragility, and run-fragility on a real-model loop = scrap and restart = far more expensive than the implementation work.
