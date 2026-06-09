---
title: "PR-001 -- Synthetic-Deficit Promotion And Red-Team Gauntlet"
description: "Manual validation scenario for PR-001: Synthetic-Deficit Promotion And Red-Team Gauntlet via loop-host --mode=packaging-benchmark-refine."
feature_id: "PR-001"
category: "Packaging-Benchmark-Refine Mode"
---

# PR-001 -- Synthetic-Deficit Promotion And Red-Team Gauntlet

This document captures the canonical manual-testing contract for `PR-001`.

---

## 1. OVERVIEW

This scenario validates three things about Lane D: (1) that `loop-host --mode=packaging-benchmark-refine` reaches the packaging's `_loop/loop.py` in dry-run mode, exits clean, and produces a gap analysis without dispatching any models; (2) that the dispatch-free red-team gauntlet (`_loop/gauntlet.py`) resists all 10 attack categories — frozen-surface edit, same-family grader, stale lock, and seven additional vectors — without a single model dispatch; (3) that a live synthetic-deficit run in an isolated worktree injects harmful guidance into technique docs, runs the guarded loop, and produces a journaled `promote_accept` that lifts the deficit and restores the grade to baseline. The feature backs each of these with the pilot evidence from Barter Copywriter.

---

## 2. SCENARIO CONTRACT

- Objective: Validate dry-run conformance, dispatch-free red-team gauntlet resistance, and synthetic-deficit live promotion.
- Real user request: `Confirm that packaging-benchmark-refine dry-runs cleanly, that the red-team gauntlet passes 10/10 dispatch-free, and that a synthetic-deficit run produces a journaled promote_accept.`
- Prompt: `Verify that Lane D passes dry-run conformance, the 10/10 dispatch-free gauntlet, and the synthetic-deficit promotion test.`
- Expected execution process: Run `loop-host.cjs --mode=packaging-benchmark-refine --packaging-root <path>` for the dry-run; run `_loop/gauntlet.py` for the red-team gauntlet; inject harmful guidance into an isolated worktree and run `loop-host.cjs --mode=packaging-benchmark-refine --packaging-root <path> --live --max-iters 1` for the synthetic-deficit test; capture exit codes, journal output, and worktree state.
- Expected signals: dry-run exits 0, produces gap analysis on stderr, zero model dispatches; gauntlet exits 0 with `10/10 PASSED, zero dispatches` on stdout; live run exits 0, `_loop/state/loop-journal.jsonl` contains an `action: "promote_accept"` entry, the worktree branch carries the promoted edit, and the independent grade on held-out fixtures is at or above baseline.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence from the command output and verification checks.
- Pass/fail: PASS when the dry-run gauntlet produces 10/10 dispatch-free passes, the live synthetic-deficit run journals a `promote_accept`, and the promoted edit brings the independent grade to at least baseline; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Ensure the packaging root has `_loop/loop.py`, `_gates/gates.py`, `_gates/derive.py`, and `_loop/gauntlet.py`.
3. Run the dry-run command sequence; capture stdout, stderr, exit code.
4. Run the red-team gauntlet; capture stderr, exit code.
5. In an isolated worktree, inject the synthetic deficit, run the live loop, and verify journal + worktree state.
6. Compare observed output against expected signals and pass/fail criteria.
7. Record the scenario verdict with decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PR-001 | Synthetic-Deficit Promotion And Red-Team Gauntlet | Validate dry-run conformance, dispatch-free gauntlet, and synthetic-deficit promotion | `Verify that Lane D passes dry-run conformance, the 10/10 dispatch-free gauntlet, and the synthetic-deficit promotion test.` | <pre># Dry-run conformance<br>node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \<br>  --mode=packaging-benchmark-refine \<br>  --packaging-root /path/to/Copywriter ;<br><br># Red-team gauntlet (dispatch-free)<br>python3 /path/to/Copywriter/_loop/gauntlet.py ;<br><br># Synthetic-deficit live test<br>git worktree add --detach /tmp/pr-001-wt HEAD \<br>  &amp;&amp; echo &quot;inject harmful guidance&quot; &gt;&gt; \<br>    /tmp/pr-001-wt/technique/some-tech.md \<br>  &amp;&amp; node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \<br>    --mode=packaging-benchmark-refine \<br>    --packaging-root /tmp/pr-001-wt \<br>    --live --max-iters 1 \<br>    --fixtures T1-write --variants project \<br>    --held-out T7-stat --samples 3 ;<br><br># Verify journal<br>cat /tmp/pr-001-wt/_loop/state/loop-journal.jsonl \<br>  | grep promote_accept ;<br><br># Cleanup<br>git worktree remove /tmp/pr-001-wt --force</pre> | Dry-run exits 0 with gap analysis on stderr, zero dispatches.<br>Gauntlet exits 0 with `10/10 PASSED, zero dispatches` on stdout.<br>Live run exits 0.<br>`_loop/state/loop-journal.jsonl` contains an `action: "promote_accept"` entry.<br>Worktree branch carries the promoted edit.<br>Independent grade on held-out fixtures ≥ baseline. | Terminal transcript, command output, journal entries, worktree state, PASS/FAIL verdict. | PASS when the gauntlet reports 10/10 dispatch-free passes, the live run journals `promote_accept`, and the independent post-promotion grade ≥ baseline.<br>FAIL otherwise. | If the dry-run fails before dispatching: confirm `_loop/loop.py` exists and `_gates/gates.py check` exits 0.<br>If the gauntlet fails an attack: inspect the failing category's assertion in `_loop/gauntlet.py` — frozen-surface edits and same-family-grader pairings are the most common real-world triggers.<br>If the live run does not journal a `promote_accept`: verify the held-out fixtures are producing gradable deliverables (interactive fixtures that answer with a question cannot be graded), that `LOOP_SAMPLES` ≥ 3, and that the proposer model has enough context budget to detect the deficit. |

### Optional Supplemental Checks

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[gauntlet stdout, journal grep, worktree branch name]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `11--packaging-refine/synthetic-deficit-and-gauntlet.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane D: Packaging-Benchmark-Refine) |
| `../../scripts/shared/loop-host.cjs` | Mode-switching entry point; resolves `--mode=packaging-benchmark-refine` and plans the single adapter step |
| `../../scripts/packaging-benchmark-refine/run-packaging-refine.cjs` | Thin adapter that maps flags to `_loop/loop.py` env/argv and spawns `python3` |
| `../../references/packaging-benchmark-refine/operator_guide.md` | Canonical invocation, guardrails, contract conformance checklist, pilot notes |
| `<packaging-root>/_loop/loop.py` | Packaging-owned loop host |
| `<packaging-root>/_loop/gauntlet.py` | Packaging-owned red-team gauntlet (10 attack categories, dispatch-free) |
| `<packaging-root>/_loop/state/loop-journal.jsonl` | Append-only run journal |

---

## 5. SOURCE METADATA

- Group: Packaging-Benchmark-Refine Mode
- Playbook ID: PR-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--packaging-refine/synthetic-deficit-and-gauntlet.md`
