---
title: "PR-001 -- Synthetic-Deficit Promotion And Red-Team Gauntlet"
description: "Manual validation scenario for PR-001: Synthetic-Deficit Promotion And Red-Team Gauntlet via loop-host --mode=non-dev-ai-system-refine."
feature_id: "PR-001"
category: "Non-Dev-AI-System Mode"
version: 1.17.0.5
---

# PR-001 -- Synthetic-Deficit Promotion And Red-Team Gauntlet

This document captures the canonical manual-testing contract for `PR-001`.

---

## 1. OVERVIEW

This scenario validates three things about Lane D: (1) that `loop-host --mode=non-dev-ai-system-refine` reaches the packaging's `benchmark/_loop/loop.py` in dry-run mode, exits clean, and produces a gap analysis without dispatching any models; (2) that the dispatch-free red-team gauntlet (`benchmark/_loop/gauntlet.py`) resists the full battery (9 attacks, 10 checks) - frozen-surface edit, same-family grader, stale lock, and seven additional vectors - without a single model dispatch; (3) that a live synthetic-deficit run in an isolated worktree injects harmful guidance into technique docs, runs the guarded loop, and produces a journaled `promote_accept` that lifts the deficit and restores the grade to baseline. The feature backs each of these with the pilot evidence from Barter Copywriter.

---

## 2. SCENARIO CONTRACT

- Objective: Validate dry-run conformance, dispatch-free red-team gauntlet resistance, and synthetic-deficit live promotion.
- Real user request: `Confirm that non-dev-ai-system-refine dry-runs cleanly, that the red-team gauntlet passes its dispatch-free battery (9 attacks, 10 checks), and that a synthetic-deficit run produces a journaled promote_accept.`
- Prompt: `Verify that Lane D passes dry-run conformance, the dispatch-free gauntlet (9 attacks, 10 checks), and the synthetic-deficit promotion test.`
- Expected execution process: Run `loop-host.cjs --mode=non-dev-ai-system-refine --packaging-root <path>` for the dry-run; run `benchmark/_loop/gauntlet.py` for the red-team gauntlet; inject harmful guidance into an isolated worktree and run `loop-host.cjs --mode=non-dev-ai-system-refine --packaging-root <path> --live --max-iters 1` for the synthetic-deficit test; capture exit codes, journal output, and worktree state.
- Expected signals: dry-run exits 0, produces gap analysis on stdout, zero model dispatches; gauntlet exits 0 with `GAUNTLET: 10/10 passed` (10 checks from 9 attacks) on stdout; live run exits 0, `benchmark/_loop/state/loop-journal.jsonl` contains an `event: "promote_accept"` entry, the worktree branch carries the promoted edit, and the independent grade on held-out fixtures is at or above baseline.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence from the command output and verification checks.
- Pass/fail: PASS when the dry-run gauntlet produces a fully green dispatch-free battery (10 checks), the live synthetic-deficit run journals a `promote_accept`, and the promoted edit brings the independent grade to at least baseline; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Ensure the packaging root has `benchmark/_loop/loop.py`, `benchmark/_gates/gates.py`, `benchmark/_gates/derive.py`, and `benchmark/_loop/gauntlet.py`.
3. Run the dry-run command sequence; capture stdout, stderr, exit code.
4. Run the red-team gauntlet; capture stdout, exit code.
5. In an isolated worktree, inject the synthetic deficit, run the live loop, and verify journal + worktree state.
6. Compare observed output against expected signals and pass/fail criteria.
7. Record the scenario verdict with decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PR-001 | Synthetic-Deficit Promotion And Red-Team Gauntlet | Validate dry-run conformance, dispatch-free gauntlet, and synthetic-deficit promotion | `Verify that Lane D passes dry-run conformance, the dispatch-free gauntlet (9 attacks, 10 checks), and the synthetic-deficit promotion test.` | <pre># Dry-run conformance<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \<br>  --mode=non-dev-ai-system-refine \<br>  --packaging-root /path/to/Copywriter ;<br><br># Red-team gauntlet (dispatch-free)<br>python3 /path/to/Copywriter/benchmark/_loop/gauntlet.py ;<br><br># Synthetic-deficit live test<br>git -C /path/to/packaging-repo worktree add --detach /tmp/pr-001-wt HEAD \<br>  &amp;&amp; echo &quot;inject harmful guidance&quot; &gt;&gt; \<br>    &quot;/tmp/pr-001-wt/&lt;packaging-subdir&gt;/&lt;technique-doc&gt;.md&quot; \<br>  &amp;&amp; CW_ROOT=&quot;/tmp/pr-001-wt/&lt;packaging-subdir&gt;&quot; \<br>  node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \<br>    --mode=non-dev-ai-system-refine \<br>    --packaging-root &quot;/tmp/pr-001-wt/&lt;packaging-subdir&gt;&quot; \<br>    --live --max-iters 1 \<br>    --fixtures T1-write --variants project \<br>    --held-out T7-stat --samples 3 ;<br><br># Verify journal<br>grep promote_accept &quot;/tmp/pr-001-wt/&lt;packaging-subdir&gt;/benchmark/_loop/state/loop-journal.jsonl&quot; ;<br><br># Cleanup<br>git -C /path/to/packaging-repo worktree remove /tmp/pr-001-wt --force</pre> | Dry-run exits 0 with gap analysis on stdout, zero dispatches.<br>Gauntlet exits 0 with `GAUNTLET: 10/10 passed` (10 checks from 9 attacks) on stdout.<br>Live run exits 0.<br>`benchmark/_loop/state/loop-journal.jsonl` contains an `event: "promote_accept"` entry.<br>Worktree branch carries the promoted edit.<br>Independent grade on held-out fixtures >= baseline. | Terminal transcript, command output, journal entries, worktree state, PASS/FAIL verdict. | PASS when the gauntlet reports a fully green dispatch-free battery (10 checks), the live run promotes one worktree-backed candidate, and the journal records `promote_accept` without frozen-surface or held-out regression failures. | Check missing `benchmark/_loop/loop.py`, same-family grader guard, frozen-surface drift, held-out gradeability, and worktree cleanup first. |

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
| `non-dev-ai-system/synthetic-deficit-and-gauntlet.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane D: Non-Dev-AI-System Refine) |
| `../../scripts/shared/loop-host.cjs` | Mode-switching entry point; resolves `--mode=non-dev-ai-system-refine` and plans the single adapter step |
| `../../scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` | Thin adapter that maps flags to `benchmark/_loop/loop.py` env/argv and spawns `python3` |
| `../../references/non_dev_ai_system/operator_guide.md` | Canonical invocation, guardrails, contract conformance checklist, pilot notes |
| `<packaging-root>/benchmark/_loop/loop.py` | Packaging-owned loop host |
| `<packaging-root>/benchmark/_loop/gauntlet.py` | Packaging-owned red-team gauntlet (9 attacks, 10 checks, dispatch-free) |
| `<packaging-root>/benchmark/_loop/state/loop-journal.jsonl` | Append-only run journal |

---

## 5. SOURCE METADATA

- Group: Non-Dev-AI-System Mode
- Playbook ID: PR-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `non-dev-ai-system/synthetic-deficit-and-gauntlet.md`
