# Probe results T027 to T035

Date: 2026-10-24. Raw observations per task. Probe branches, PRs and scratch worktrees are deleted after each task. Run ids are GitHub Actions workflow run ids. A step's duration is completed_at minus started_at from the jobs API (1 s resolution).

Environment notes that apply to all probes: a fresh worktree lacks node_modules and dist, so the toolchain directories were cloned copy-on-write from the packet worktree before committing. Pushes of a new probe branch used SPECKIT_ALLOW_REMOTE_PUSH=<branch>, the pre-push gate's own approval path, and branch deletes used SPECKIT_ALLOW_REMOTE_PUSH=1. Git ran with core.fsmonitor=false from the coordinator's instruction after fsmonitor IPC hung the pre-push hook. No --no-verify and no hook skip variable was used.

## T027 Concurrency group (AC-002)

Branch: branches/019-probe-concurrency, PR #74 (closed unmerged, branch deleted). Probe worktree under the scratch dir, removed.
Setup note: a fresh worktree has no node_modules or dist, so the pre-commit hook (gate:mirror-parity, gate:template-phrase-lint) blocked the first commit with "Cannot find module". No hook skip was used. The ignored toolchain dirs were cloned copy-on-write (`cp -cR`) from WT into the probe worktree, then the commit passed through all hooks.
Push note: pre-push permission gate requires SPECKIT_ALLOW_REMOTE_PUSH=<branch> for a new non-allowlisted branch (operator approval recorded in probe-branch-approval.md). Used for the push of that probe branch only.

validate-message.mjs: exit 0 for both messages.
Commits: 5586429cef (first), 09ab649f5d (second, pushed after the PR's first run appeared and was in_progress).
Message Contract runs on the branch (gh run list --workflow message-contract.yml --branch ...):
- 40100004699 pull_request head 5586429cef: cancelled
- 40100024617 pull_request head 09ab649f5d: success
- 40099994803 push head 5586429cef: success (push is not cancelled, cancel-in-progress false for push)
- 40100020162 push head 09ab649f5d: success
gh pr checks: "Commit messages, branch names and PR description follow the templates" SUCCESS (two entries listed, push and pull_request) on the newest head.
Verdict: met.

## T028 command-tree-parity filter both ways (AC-003)

Drift: the workflow's push trigger is `branches: [main, 'skilled/**']`, so a push of a `branches/NNN-probe-*` branch starts no parity run whatever the paths. Both cases therefore opened a test PR (base main) so the pull_request filter is what is observed. `gh run list --branch` for the positive branch showed `[]` after the push and before the PR.
Drift: task path `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` is stale, used `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` (wrote 1 of 66 Hermes copies).
Drift: the spec-remint pre-commit gate re-derived the packet metadata on the negative commit, so that commit holds spec.md and graph-metadata.json (both under specs/, matching no parity path).

Positive: branch branches/020-probe-parity-positive, PR #75, commit e54cb748d5 (.skilled/skills/system-spec-kit/SKILL.md and .hermes/skills/system-spec-kit/SKILL.md). validate-message exit 0. One pull_request run 40100373828, conclusion success. Jobs: "Hermes skill and prompt copies match their sources" success. "OpenCode and Claude command trees stay identical" success.
Negative: branch branches/021-probe-parity-negative, PR #76, commit 15f1bf7844 (spec.md plus re-derived graph-metadata.json). validate-message exit 0. `gh run list --workflow command-tree-parity.yml --commit 15f1bf7844...` returned `[]`, while 12 other PR workflows (Message Contract, Changed Packet Validation, etc.) had started on the same PR head, so the PR was live and the parity filter excluded it.
Verdict: met.

## T029 D10 answer (AC-004)

D10=skip (scratch/decisions.md). Expected under skip: one run, the pre-phase behaviour.
Drift: changed-packet-validation.yml has `push: branches: [main, 'skilled/**']` and `pull_request: branches: [main]` with no paths filter, so a bare push of a probe branch starts nothing. A test PR (base main) was opened so the pull_request behaviour is what is observed.
Branch branches/022-probe-d10, PR #78, commit 4b184b7b7b (appends one newline to .github/scripts/check-gate-inputs.sh). validate-message exit 0.
`gh run list --workflow changed-packet-validation.yml --commit 4b184b7b7bfdd186317317246f7e244d178e36fd` returned exactly one run: 40101181490, event pull_request, conclusion success.
Verdict: met (no filter exists, the unfiltered pre-phase behaviour).

## T030 dispatch guard (AC-005, AC-006)

Suite list. `<change-sha>` is 7482f4e880 (ci(dispatch-enforcement-guard): drop the duplicate dispatch audit run). `gh run list --workflow dispatch-enforcement-guard.yml --commit 7482f4e880` returns `[]` because that commit was pushed with later commits and only the push tip gets a run. The first main run that contains the change is 40026353792 (push, tip 3ab67b70cb, 2026-10-23T21:23Z). It concluded success. Both jobs success: "Every declared dispatch rule is reachable and discriminates" and "Every hook vitest suite passes" (steps: Run the dispatch rule engine suite, Install the hooks test runner, Run the hooks vitest tree, all success).
The grep over the log returned eight paths. Seven are the vitest tree job's suites (dispatch-audit, dispatch-preflight-lint, session-relaunch, directive-dedup, classifier-injection-screen, devin-dispatch-audit, codex-shell-tool) and the eighth, dispatch/lib/dispatch-rule-checks.test.mjs, appears only in the rule-engine job's `SUITE=` line. So the vitest tree holds the seven T013 named.
Fail-closed guard. Drift: dispatch-enforcement-guard.yml runs on push for `main` and `skilled/**` only, so a PR (base main) was opened.
Branch branches/023-probe-guard-deleted, PR #77, commit 19e80ea464 (git rm of .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs, 1037 deletions). validate-message exit 0.
Run 40101163105 (pull_request) concluded failure. Job "Every declared dispatch rule is reachable and discriminates" failed at step "Run the dispatch rule engine suite" with the annotation `##[error]Dispatch rule suite not found at .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs — failing closed.` Job "Every hook vitest suite passes" concluded success.
Verdict: met. The log holds the error text (the `::error::` command surfaces as the `##[error]` annotation, and the `::error::` source text sits in the echoed script lines).

## T031 report-only steps (AC-007)

Drift: advisory-checks.yml runs on push for `main` and `skilled/**` only, and its pull_request trigger is unfiltered, so a PR (base main) was opened.
Drift: the task's `.opencode/skills/sk-doc/SKILL.md` path is `.skilled/skills/sk-doc/SKILL.md` (`.opencode/skills` resolves to it). The mirror-parity pre-commit gate blocked the first commit (stale `.hermes/skills/sk-doc/SKILL.md`), so `sync-skills-hermes.cjs` was run and its output staged, as the gate's Fix line says. The route-remint gate then re-minted sk-doc and staged two manifests, so the commit holds four files.
Branch branches/024-probe-report, PR #79, commit 244d13db2f. validate-message exit 0.
Local check before pushing: `node .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` printed `DRIFT: sk-doc/SKILL.md:189: cites 'BAAI/bge-base-en-v1.5' as default` and exited 1.
Advisory Checks run 40101235126 (pull_request, head 244d13db2f): job 120893637299 "Advisory - test suites and doc-model references" concluded success. Steps in the REST API: Node test suites (report-only) success, Doc-model reference drift (report-only) success, Trigger index freshness (report-only) success.
Mismatch with Expected: Expected `{"job":"success","steps":["failure"]}`, observed `{"job":"success","steps":["success"]}`. Cause: the steps keep `continue-on-error: true`, and GitHub's REST `conclusion` reports a failed continue-on-error step as `success` (the real result is only in the `outcome` context, which the REST jobs API does not expose). The failure itself is visible: the step log holds `DRIFT DETECTED`, the drift line for sk-doc/SKILL.md:189, `##[error]doc-model drift found; fix by citing canonical model names from registry.ts` and `##[error]Process completed with exit code 1.`, and check-run 120893637299 carries 5 annotations at level failure (three `Process completed with exit code 1`, `trigger index drift found` and `doc-model drift found`) and one runner-image notice. A pre-change run could not have produced these error lines for the doc-model step, because the old command ended with `|| echo ...` and always exited 0.
Also seen: the Node test suites and Trigger index freshness steps also reported failure annotations on this run. Not isolated here: the trigger-index step is expected to fail on a PR that edits a skill doc, the Node test suites failure was not compared against main.
Strict Pass Freshness Report, dispatched by hand with `gh workflow run strict-pass-freshness-report.yml --ref branches/024-probe-report` (read-only workflow, contents and actions read). Run 40101537374 (workflow_dispatch, 14:13 to 15:05 UTC, about 52 min, the sweep step took 26 min and the derived-repair step 24 min) concluded success. All steps success in the REST API, including "Derived-repair drift report". Log of that step: 175 "would repair <packet>" entries are still printed (inside the stop-commands block) and the step ends with `##[error]Process completed with exit code 1.` The same continue-on-error API quirk applies, the step conclusion reads success while the log shows the nonzero exit. The report text survived. The job's check-run annotations endpoint returned 404 for the job id, so the log is the evidence.
Second half verdict: report text preserved and exit status surfaced as an error line while the job stays green. Literal `steps[].conclusion == failure` is not observable through the REST API for a continue-on-error step.
Verdict: behaviour met (job green, step shows the error, no suppression), literal API Expected not met. Stop condition "the step concludes success" matches the literal API value, so this is escalated for a wording fix: assert on the annotations or log, not `.steps[].conclusion`.

## T032 checkout depth (AC-009)

scratch/phase-baseline.md does not exist. Baselines are the newest main runs before the change commit 9794ad69cc (2026-10-23T21:22Z), read with the same job-steps query (step "Run actions/checkout...", completed_at minus started_at, 1 s resolution).
Drift: rule-canary-sync, repo-rules-corpus and deep-loop-runtime all trigger on push for `main` and `skilled/**` only, so PRs (base main) were opened. Paths cited by the task are `.skilled/...` equivalents of `.opencode/...`.
Drift: doc-version-bump pre-commit gate raised the version of ARCHITECTURE.md (1.0.1.0 to 1.0.2.0) and unstaged it, so the deep-loop probe commit holds 2 insertions and 1 deletion. The repo-rules probe commit is one blank line.

Rules probe: branch branches/025-probe-depth-rules, PR #80, commit 5039e47f10. validate-message exit 0.
- rule-canary-sync run 40101304274 (pull_request) success. Job 24 s, checkout 21 s. Baselines (main, depth 0): 40021863689 job 77 s checkout 73 s, 40020331318 job 94 s checkout 88 s, 40018919176 job 71 s checkout 68 s. After the change on main (depth 1, push): 40090109028 job 55 s checkout 51 s.
- repo-rules-corpus run 40101304407 (pull_request) success. Job 57 s, checkout 51 s. Baseline: 38363499132 (main, 2026-10-13, newest pre-change main run, depth 0) job 74 s, checkout 62 s.
Deep-loop probe: branch branches/026-probe-depth-deep-loop, PR #81, commit 2f2dbe5ce1. validate-message exit 0.
- deep-loop-runtime run 40102189314 (pull_request) success. Job 679 s, checkout 50 s. Baseline: 39909844320 (main, 2026-10-23T06:09Z, depth 0) job 537 s, checkout 63 s. After the change on main: 40026353683 job 679 s, checkout 49 s.
Overall: rule-canary-sync job is 24 s (under 60 s, bills one minute).
Verdict: met on direction. Every checkout step shortened (canary -47 to -67 s, corpus -11 s, deep-loop -13 s) but the shortening is not a uniform 20 s: samples are single runs on different days and checkout time varies by tens of seconds run to run (the three pre-change canary samples span 68 to 88 s, the post-change main run took 51 s against 21 s on the probe).

## T033 agent-mirror-sync filter three ways (AC-010)

PR-based as the task says (workflow runs on pull_request only).
Positive, agent file: branch branches/027-probe-agent-file, PR #82, commit 0eae5a540a. Drift: mirror-parity pre-commit gate blocked the first commit (stale .codex/agents/code.toml and .hermes/skills/agent-code/SKILL.md), so `codex/sync-agents.cjs` and `hermes/sync-skills-hermes.cjs` were run and their output staged, per the gate's Fix lines. Commit holds 3 files. validate-message exit 0. `gh run list --workflow agent-mirror-sync.yml --commit 0eae5a540a...`: one run 40102573620, event pull_request, success ("Agent runtime mirrors stay in sync" success).
Positive, verifier only: branch branches/028-probe-agent-lib, PR #83, commit 0e566ed9c2 (one newline appended to .skilled/bin/lib/mirror-sync-verify.cjs). validate-message exit 0. One run 40102589221, event pull_request, success.
Negative: branch branches/029-probe-agent-negative, PR #84, commit 4d4e797b83 (plan.md plus re-derived graph-metadata.json by the spec-remint gate). validate-message exit 0. `gh run list --workflow agent-mirror-sync.yml --commit 4d4e797b83...` returned `[]` while 14 other runs from the same PR head existed (Message Contract, Changed Packet Validation, Rule Canary Sync and others), so the PR was live and the filter excluded it.
Verdict: met.

## T034 skill-doc-frontmatter filter (AC-011)

Drift: the push list on main does name the guard (`.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh` and the `.opencode` twin), but push only runs for `main` and `skilled/**`, so a probe-branch push starts nothing and a PR is needed either way.
Branch branches/030-probe-frontmatter-guard, PR #85, commit ea214ad3ab (one newline appended to the guard). validate-message exit 0.
`gh run list --workflow skill-doc-frontmatter.yml --commit ea214ad3ab...`: one run 40102614545, event pull_request, success. Job "Skill reference/asset frontmatter contract" success (55 s), step "Run skill-doc frontmatter guard (coverage mode)" success. The second job "Changed skill docs raise their version" also ran and succeeded.
Verdict: met.

## T035 inventory against the hook (AC-012)

Read-only greps run from WT on 2026-10-24 (pre-commit last changed by 7648ae8b56, unmodified in the tree):
1. `grep -oE 'gate:[a-z-]+' .skilled/scripts/git-hooks/pre-commit | sort -u | wc -l` -> 13 (agent-mirror-sync, comment-hygiene, doc-version-bump, hook-flags, hook-trust, mcp-mutation-class, mirror-parity, private-skill, prompt-card-sync, route-remint, skill-authoring, spec-remint, template-phrase-lint)
2. `grep -cE '^\| (agent-mirror-sync|...|template-phrase-lint)' scratch/pre-commit-inventory.md` -> 13
3. `grep -cE '\| (keep CI|drop CI|local only) \|' scratch/pre-commit-inventory.md` -> 13
Verdict cells: 8 keep CI, 0 drop CI, 5 local only, 13 rows in all, no row without a verdict.
Verdict: met (13, 13, 13).
