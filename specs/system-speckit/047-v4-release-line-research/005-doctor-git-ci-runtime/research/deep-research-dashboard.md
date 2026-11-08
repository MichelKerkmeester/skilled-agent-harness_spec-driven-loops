---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Audit the Skilled v4 doctor, git, CI and runtime layer across releases v4.0.0.0 to v4.0.2.0: .skilled/skills/system-skilled-doctor/** and .skilled/commands/doctor/, Skilled in your project and vendored overlays, .skilled/skills/sk-git/** and its git hooks, .github/workflows, .skilled/agents and the runtime mirrors in .claude/ .opencode/ .codex/ .cursor/ .pi/ .devin/ .dsh/, .skilled/repo-rules/** and AGENTS.md. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes.
- Started: 2026-11-08T19:57:09.370Z
- Status: INITIALIZED
- Iteration: 22 of 10
- Session ID: 2026-11-08T19:57:09.370Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Iteration 1: doctor command routing (Q1) and v4.0.0.3/v4.0.0.8/v4.0.1.0 doctor claims vs code (Q8) | - | 0.78 | 0 | insight |
| 2 | Runtime mirrors vs .skilled sources and the doctor runtime-mirrors battery; sk-git commit-msg/pre-commit/pre-push behavior against the v4.0.0.3 and v4.0.0.10 notes | - | 0.72 | 0 | insight |
| 3 | Q5 workflows vs v4.0.0.16 CI and /doctor:ci; Q6 AGENTS.md vs REPO RULES.md and the 16,384-byte runtime cut; carried sk-git commit-id repro | - | 0.55 | 0 | insight |
| 4 | Q5 workflow claim-by-claim audit; Q7 agent roster versus AGENTS.md section 9 and cli-* counts | - | 0.62 | 0 | insight |
| 5 | unknown | - | 0.00 | 0 | error |
| 6 | v4.0.2.0 Skilled in Your Project install/symlink/overlay flow run in check and plan modes against /tmp repos, plus sk-git commit-msg hook repros for v4.0.0.3 and v4.0.0.10 | - | 0.68 | 0 | insight |
| 7 | Correct the symlink record; read v4.0.0.1/.2/.13/.14/.15 over the doctor, git, CI and runtime cluster and test the worktree, hook-bypass and /doctor:env claims | - | 0.52 | 0 | insight |
| 8 | Read code, not notes: overlay engine status/exit-code contract, .github/workflows job-to-script wiring, runtime mirror --check, and the two carried hook-battery and wedged-git questions | - | 0.58 | 0 | insight |
| 9 | repo-rules reachability and frontmatter shape (Q6 half), and doctor command format against sk-doc canon (Q11); v4.0.0.1 and v4.0.0.14 | - | 0.56 | 0 | insight |
| 10 | Ran the full /doctor:* engine battery in read-only modes, quoted exit code and byte length per engine, and mapped pass/fail legibility plus mirror body-parity blindness | - | 0.62 | 0 | insight |
| 11 | Correct f-iter010-007 with per-runtime symlink counts and copy-versus-link per mirrored kind; reproduce f-iter010-002 with the exact doctor-install.yaml:59 command and its exit; one tested claim each from v4.0.0.11, v4.0.0.12 and v4.0.0.14 | - | 0.60 | 0 | insight |
| 12 | Repro the four carried P1s in /tmp repos, then test the v4.0.0.12 /doctor:git setup export-default-binding claim | - | 0.55 | 0 | insight |
| 13 | Attribution pass over every finding the run has logged: map each imprecise release value to its introducing commit and first containing tag, verified with merge-base --is-ancestor | - | 0.58 | 0 | insight |
| 14 | Run the existing body-parity checkers (check-agent-mirror-sync --all, every upstream_assets sync script --check, cross-tree hash comparison) and report real drift, then the Q11 canon comparison of three doctor commands and two sk-git references against the sk-doc templates. | - | 0.52 | 0 | insight |
| 15 | Improvement, over-engineering and extension pass: one improvement row per confirmed P1, duplication counts with wc -l, one cheap CI wiring | - | 0.61 | 0 | insight |
| 16 | Final pass: symlink re-check of the duplicate claims, the zero-or-one-finding release gaps, and re-running the five strongest P1 repros | - | 0.38 | 0 | insight |
| 17 | Bug pass on /doctor:env, /doctor:update, /doctor:overlay, /doctor:install and /doctor:ci: exit codes, check-route writes, flag and positional mismatches, wrong-root resolution | - | 0.44 | 0 | insight |
| 18 | CI workflow pass: read every uncited .github/workflows file, record trigger, SKILLED_CI switch, scripts and whether each resolves; find a step that cannot fail, a switch a workflow ignores, and a suite on disk that no workflow runs | - | 0.52 | 0 | insight |
| 19 | Final sweep before the depth checkpoint: hooks and runtime wiring — git hook scripts, the hook installer, .claude/.codex/.opencode hook configs; find an exit-0-on-failure hook, a config-named hook missing on disk, or an unread documented env switch; re-run the strongest check-mode repros. | - | 0.55 | 0 | insight |
| 20 | Symlink-alias sweep: judge every path comparison under doctor scripts, .skilled/scripts and .skilled/bin for whether an alias path on one side makes it wrong; reproduce read-only. | - | 0.50 | 0 | insight |
| 21 | Final iteration: re-run the six confirmed P1 repros, rank three cheap changes by findings closed, and close out release attribution for v4.0.0.5-v4.0.0.7. | - | 0.38 | 0 | insight |
| 22 | Uncited doctor scripts: exit codes that hide failures, writes in check-only routes, flag/asset mismatches across the ten never-cited engines | - | 0.45 | 0 | insight |

- iterationsCompleted: 22
- keyFindings: 329
- openQuestions: 1
- resolvedQuestions: 11

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 11/12
- [x] Does each /doctor:* command in .skilled/commands/doctor/ route to a system-skilled-doctor mode or script that exists, and do the checks it lists actually run?
- [x] Does the Skilled in Your Project and vendored overlay flow from v4.0.2.0 (/doctor:install, /doctor:symlink, /doctor:overlay) hold up when read end to end and run only in check or plan modes, and which step would fail?
- [x] Do the runtime mirrors in .claude .opencode .codex .cursor .pi .devin .dsh match their .skilled sources, and does /doctor:runtime-mirrors detect the drift that exists?
- [x] Do the workflows in .github/workflows match the v4.0.0.16 CI and GitHub Actions note and /doctor:ci switch state, and does any workflow call a missing script?
- [x] Does AGENTS.md match REPO RULES.md and the .skilled/repo-rules files it routes, and does any runtime limit (such as Devin's 16,384-byte rule cut) truncate a binding rule?
- [x] Do the .skilled/agents definitions match AGENTS.md section 9 and the agent counts the cli-* skills claim?
- [x] Which claims in the v4.0.0.3 Doctor Commands, v4.0.0.8 Install and First Use and Symlink Safety, and v4.0.1.0 Doctor Commands sections are true in code?
- [x] Which doctor checks, hooks, workflows or mirror files have no caller or duplicate another, and what breaks if each is removed?
- [x] What friction do the operator and the AI user hit in doctor output, hook rejections and CI failures?
- [x] Where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing?
- [x] What concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap found in this run?
- [ ] Do the sk-git hooks behave as the v4.0.0.3 (commit message rules, hook safety), v4.0.0.10 (commit-id) and v4.0.0.15/v4.0.0.16 (worktrees) notes say, with a repro for any wrong accept or reject? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Do the sk-git hooks behave as the v4.0.0.3 (commit message rules, hook safety), v4.0.0.10 (commit-id) and v4.0.0.15/v4.0.0.16 (worktrees) notes say, with a repro for any wrong accept or reject?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▆▆▆▆▆▆▆▆▆▅▅▆▆▅▅
- score sparkline: █▇▆▅▄▆▆▆▆▆▆▆▆▆▅▅▆▆▅▅
- Last 3 ratios: 0.50 -> 0.38 -> 0.45
- Stuck count: 1
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.45
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **33 vs 32 workflows is drift.** The note describes the pre-release count and the same release merged two workflows into one; no post-tag deletion. (iteration 3)
- **Root `repo-rules/` duplicate is over-engineering.** Removal would break the "read either layout" compatibility introduced by `7a948d79b4` (2026-09-20). It is byte-identical today, so it is a maintenance watch item, not a defect. (iteration 3)
- **Workflow calls a missing script.** False positive from a root-relative scan; all four paths resolve after their `cd`/`working-directory`. (iteration 3)
- **Zero-plus-valid Commit-Id is a bug.** The policy's intent is that a real id satisfies the gate; the placeholder is a sentinel for "no id", not a contradiction. Accepting the pair is consistent with that intent. (iteration 3)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
New: which other doctor scripts emit a `--json` trailer (the grep counts 12 files containing `STATUS=`), and does any route asset instruct a JSON parse of the whole stream? F22-01 measured two; the family is larger.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
