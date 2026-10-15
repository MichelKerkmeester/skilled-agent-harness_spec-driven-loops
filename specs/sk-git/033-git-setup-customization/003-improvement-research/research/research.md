---
title: "Research: improving /doctor:git setup and the /doctor:git command family"
description: "Five-iteration deep research into missing checks, false-healthy readings, wrong repairs, untrusted-repository vectors, doc drift, test gaps and the deferred items for the read-only /doctor:git setup battery."
trigger_phrases:
  - "doctor git setup improvement research"
  - "git-setup-check improvements"
importance_tier: "normal"
contextType: "research"
---

# Research: improving /doctor:git setup and the /doctor:git command family

<!-- ANCHOR:deep-research-doctor-git-setup-improvements -->

## 1. Answer

The battery's biggest weakness is that it can say STATUS=OK when it does not know. A check that throws becomes UNKNOWN, and both the exit code and the summary count only FAIL rows. The gates, AI-tool and worktree checks can also each pass on input they never really verified. The second weakness is in the repairs. Four of the nine named repairs either do not fix the failure they follow or cross the trust boundary the battery itself guards. The deferred CI items are concrete, small fixes, not open design work. On main today, Gate Inputs fails because its workflow never installs the `@spec-kit/shared` package that the doc-version engine imports. sk-doc Script Tests fails because one frozen manifest is out of date, and the sk-git catalog leaf title drifted from its root H3.

## 2. Scope and Method

- Executor: cli-codex `gpt-6-luna`, reasoning `max`, service tier `fast`, one iteration per dispatch, five iterations (the configured maximum).
- Questions: Q1 false-healthy readings and missing checks, Q2 untrusted-repository vectors, Q3 wrong repairs, Q4 doc drift and test gaps, Q5 deferred items.
- Every finding below cites `path:line`. The orchestrator re-read the top claims against the source at synthesis time (Section 10). It also pulled the current CI logs, which the iteration sandbox could not reach.
- Research only. No code, skill, command or doc outside this spec folder was changed.

## 3. Q1: False-Healthy Readings and Missing Checks

| # | Finding | Impact / Effort | Evidence |
|---|---------|-----------------|----------|
| 1.1 | UNKNOWN-only runs report healthy. `runCheck` turns a throw into UNKNOWN, but `main` sets status and exit from `rows.some(FAIL)` alone, and `renderHuman` prints `STATUS=OK` when no row is FAIL. The setup workflow promises that exit 0 means every check passed. No test covers an UNKNOWN row with no FAIL. | High / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:651] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:681] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:684] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:753] [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:52] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:137] |
| 1.2 | An incomplete gate report reads as no disabled gates. Valid JSON without a `gates` array becomes `[]` and PASS. The helper takes its registry from an inherited `GATE_REGISTRY`, and the battery passes the caller's environment through. | High / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:303] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:305] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:126] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:210] |
| 1.3 | Saved-off gates are listed as details but the row still returns PASS. A turned-off gate is a degraded setting, not a healthy one. | Medium / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:306] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:309] |
| 1.4 | The worktree check tests the wrong directory. It probes the nearest existing parent of `dirname(base.dir)`, so an existing but unwritable base, or a file sitting at the base path, still passes. | Medium-high / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:466] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:415] |
| 1.5 | With no `--tool` and no `CLAUDECODE`, no tool counts as active. A missing adapter is then informational only, so the row passes without checking the running tool. | Medium-high / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:588] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:599] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:630] |
| 1.6 | Registration counts as health on presence alone. OpenCode and Pi pass when their adapter file exists. The other four pass when the file text contains `git-preflight-advisory`, even if that entry is disabled or unrelated. | Medium / Medium | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:604] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:610] |
| 1.7 | An allowlist evaluation error still passes. A launch error renders as "not checked", and any nonzero helper exit counts as "refused", unexpected codes included. | Medium / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:352] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:360] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:376] |
| 1.8 | The hook check proves linkage only. It compares realpaths and never inspects contents or the executable bit. The test's `exit 0` hooks pass. | Medium / Medium | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:221] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:247] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:398] |

## 4. Q2: Untrusted-Repository Vectors

- **Closed already.** Helpers resolve under `OWN_ROOT`, and git runs with `core.fsmonitor=false` and `log.showSignature=false`. The tests plant fsmonitor and `gpg.program` markers and assert that neither runs. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:43] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:121] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:156] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:216]
- **2.1 Repository-steered paths are read without containment (Medium / Medium).** Three config values pick paths the battery then reads or probes. `core.hooksPath` picks the hooks directory. `skgit.contractDir` is joined to the repository root, and an absolute value stays absolute. `speckit.worktreeBase` picks a probed path. The fixed AI-tool config paths follow symlinks too. Nothing here is executed, but the battery reads files outside the repository. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:231] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:283] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:317] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:597]
- **2.2 Environment vector (Medium / Low).** The production `safeGitEnv` keeps the caller's environment, where the test fixture strips `GIT_DIR`, `GIT_WORK_TREE` and `GIT_CONFIG_*`. `GATE_REGISTRY` can also redirect the gate helper. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:126] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:140] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:53]
- **2.3 The trust boundary leaks through a repair (High / Medium).** The battery deliberately avoids running the inspected repository's installer. Yet when that repository carries the toolchain sentinel, the hooks repair tells the operator to run `bash <repo>/scripts/install-git-hooks.sh`. That installer picks its source tree from the repository and links those hooks in. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:225] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:229] [SOURCE: .skilled/scripts/install-git-hooks.sh:29] [SOURCE: .skilled/scripts/install-git-hooks.sh:175]

## 5. Q3: Repairs That Are Wrong or Unsafe

| # | Repair | Problem | Impact / Effort | Evidence |
|---|--------|---------|-----------------|----------|
| 3.1 | install: `git restore .skilled/skills/sk-git, or run /doctor:update` | A bare `/doctor:update` only runs a read-only check. The restore targets the whole skill subtree, so it can discard tracked local edits. | High / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:72] [SOURCE: .skilled/commands/doctor/update.md:16] |
| 3.2 | hooks: the repository's own installer | Crosses the trust boundary (finding 2.3). | High / Medium | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:229] |
| 3.3 | gates: `/doctor:git hooks` | It is named for helper or parse errors, but that target starts by running the same `list` helper, so it repeats the failure. Saved-off gates, which the hooks target can actually change, are never failed. | High / Medium | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:301] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:304] [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:81] |
| 3.4 | contract: `/doctor:git standards` for a missing `skgit.contractDir` | Every git-standards mode resolves the same setting first and aborts on the missing path, so it never reaches `init`. | High / Medium | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:330] [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:167] [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:172] |
| 3.5 | worktrees: `git config speckit.worktreeBase <dir>` | `SPECKIT_WORKTREE_BASE` wins over git config, so when the environment variable is the source, this repair changes nothing. | Medium / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:74] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:407] |
| 3.6 | Commit-Id: `git config --local skilled.commitId false` | This is a waiver that turns the policy off, not a repair. It should be labeled as one. | Medium / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:77] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:25] |
| 3.7 | advisory rules: "fix the check name" | The same text is shown for invalid JSON and a non-array root. | Medium / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:73] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:534] |
| 3.8 | suppression: `unset ...` | This only works when the variable came from the current shell. A value injected by the host needs a host restart. | Low / Low | [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:562] |

## 6. Q4: Drift Between Docs and Behavior, and Test Gaps

- **4.1 The presentation says setup mutates (Medium / Low).** The shared route-setup panel hardcodes `Mutation class: mutates`, while the route manifest and the workflow mark setup read-only. [SOURCE: .skilled/commands/doctor/assets/doctor-git-presentation.txt:89] [SOURCE: .skilled/commands/doctor/_routes.yaml:280] [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:15]
- **4.2 The workflow over-promises adapter checks (Medium-high / Medium).** `doctor-git-setup.yaml` says every configured adapter registers the advisory, but OpenCode and Pi are checked for presence only (finding 1.6). [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:41] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:604]
- **4.3 DOC-384's precondition cannot support its all-PASS expectation (Medium / Low).** The scenario requires only installed hooks, then runs `--tool claude` and expects every row to pass. A checkout without the Claude adapter fails correctly. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:26] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:28]
- **4.4 The catalog leaf title drifted from the root, and CI fails on it (Medium / Low; orchestrator-verified).** The leaf title is "Repository settings and setup check (/doctor:git)" but the root H3 is "Repository settings and setup check". The Feature catalog validation job reports `root_leaf_title_mismatch` for sk-git on main. [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:2] [SOURCE: .skilled/skills/sk-git/feature-catalog/feature-catalog.md:155]
- **4.5 Test gaps.** No test covers an UNKNOWN-only run (1.1), a gate report with no `gates` key (1.2), an existing unwritable base (1.4), no active tool (1.5), OpenCode or Pi branches with bad content (1.6), an allowlist helper error (1.7), or an emitted repair checked against its target's real behavior (Q3). [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:329] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:454]

## 7. Q5: The Deferred Items

### Per-repository `hard-rules.json` overlay (Medium / Medium)

Today the dispatch loader reads one sibling `hard-rules.json`. It returns an empty list on read, parse or shape errors, skips unknown checks and treats a throwing check as passed. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:14] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:21] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:280] The advisory also resolves the inspected repository's skill path, while the battery checks the installed copy. [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:107] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:524] Recommended contract:

1. A fixed path at `.sk-git/hard-rules.json` that no config value can redirect.
2. Load it only after an operator-owned trust decision keyed to the canonical repository path. A repository can never authorize itself.
3. Additive merge, built-ins first. Overlay rules may use registered checks at `warn` severity only. Their IDs must be repository-prefixed, and duplicates are rejected.
4. Reject symlinks, path traversal and oversized files. An invalid overlay is ignored as a whole, the built-ins stay active, and the state is reported.
5. The battery shows the built-in count, the overlay count and one state: absent, active, ignored-untrusted or invalid.

### Gate Inputs hook tests (High / Low; orchestrator-verified on main)

The iterations relied on packet 034's record that Gate Inputs was green (49 of 49) and found no residual case statically. [SOURCE: .github/scripts/check-gate-inputs.sh:283] [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:483] [SOURCE: specs/sk-git/034-standards-template-round-trip/implementation-summary.md:50] The live run disagrees. Gate Inputs run 38743966791 on main fails `pre-commit gates: 106 passed, 5 failed` with `ERR_MODULE_NOT_FOUND`, in the doc-version cases at [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:954] [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:969] [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:977] [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:983]. The cause is that the linked engine imports `@spec-kit/shared/frontmatter/parse-frontmatter.js`. [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:32] The Gate Inputs workflow runs the tests without installing any package, so that import fails. [SOURCE: .github/workflows/gate-inputs.yml:18] The same file passes locally (111 passed, 0 failed), where the package is installed. Fix: add the package-install step that the sk-doc workflow already uses. [SOURCE: .github/workflows/sk-doc-script-tests.yml:42]

### sk-doc Script Tests (Medium / Low; orchestrator-verified on main)

Run 38743966468 shows one failing file, `test_readme_manifest.py`. The frozen durable-directory manifest no longer reproduces because a new directory was added: `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands`. [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py:22] `test_readme_verdict_parity.py` and the remaining files pass. Fix: refresh the manifest with `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write`, after confirming the new directory is intended. The workflow's own note about "four unseen failures" is historical and does not describe the current state. [SOURCE: .github/workflows/sk-doc-script-tests.yml:3]

## 8. Ranked Improvements (Top Ten)

| Rank | Improvement | Impact | Effort | Primary evidence |
|------|-------------|--------|--------|------------------|
| 1 | Make UNKNOWN non-healthy: a distinct status and a nonzero exit, plus a test | High | Low | git-setup-check.cjs:681, :753 |
| 2 | Fix the Gate Inputs CI: install `@spec-kit/shared` in gate-inputs.yml | High | Low | frontmatter-version.mjs:32, gate-inputs.yml:18 |
| 3 | Stop sending operators to the inspected repository's installer; point at the verified own-install installer or add a trust step | High | Medium | git-setup-check.cjs:229 |
| 4 | Validate the gate report shape, pin `GATE_REGISTRY`, and fail or degrade on saved-off gates | High | Low | git-setup-check.cjs:303-309 |
| 5 | Replace the install repair: exact missing-file restore or an explicit update-apply route | High | Low | git-setup-check.cjs:72 |
| 6 | Give a missing `skgit.contractDir` a real recovery (unset or correct it first) | High | Medium | git-standards.cjs:167-172 |
| 7 | Check the existing worktree base itself, and make the repair follow the winning source | Medium-high | Low | git-setup-check.cjs:466, :74 |
| 8 | Return UNKNOWN when no active tool is detected, and verify OpenCode and Pi content or narrow the claim | Medium-high | Medium | git-setup-check.cjs:588, :604 |
| 9 | Fix doc drift: the presentation mutation class, the DOC-384 precondition, and the catalog leaf title (the last also fails CI) | Medium | Low | doctor-git-presentation.txt:89, doctor-git-settings.md:2 |
| 10 | Refresh the sk-doc README manifest; then add the trust-gated `hard-rules.json` overlay | Medium | Low / Medium | test_readme_manifest.py:22, dispatch-rule-checks.mjs:14 |

## 9. Proposed Implementation Phases

1. **CI green (small).** Add the package-install step to `gate-inputs.yml`. Refresh the sk-doc README manifest. Align the sk-git catalog leaf title with its root H3. Exit criterion: all three workflows pass on main.
2. **Truthful battery.** UNKNOWN handling, gate-report shape validation and saved-off-gate verdicts, the base-dir writability check, no-active-tool handling, allowlist error classification and OpenCode/Pi content checks, with a fixture test for each (finding 4.5).
3. **Safe, correct repairs.** Rework the repairs for install, hooks (trust boundary), gates, contract dir, worktree source, the Commit-Id waiver label, the advisory-rules message split and the suppression source. Add one test per repair that runs the named target in dry-run against the failing fixture.
4. **Containment.** Add a path and symlink policy for `core.hooksPath`, `skgit.contractDir`, `speckit.worktreeBase` and the AI-tool configs. Sanitize the battery's git environment the way the test fixture does.
5. **Overlay.** Build the trust-gated, additive `.sk-git/hard-rules.json` overlay with its battery state row (Section 7).
6. **Docs and playbook sync.** Update git.md, the setup YAML promise, the presentation panel, DOC-384 and the feature catalog to the new behavior.

## 10. Verification by the Orchestrator

- Re-read at synthesis time and confirmed: findings 1.1 (`git-setup-check.cjs:681-686`, `:753-759`), 1.2 (`:303-309`), 1.4 (`:466`), 1.5 (`:588`, `:599`), 3.1, 3.5 and 3.6 repair strings (`:72-77`), 3.4 (`git-standards.cjs:167-172`), and 4.1 (`doctor-git-presentation.txt:89`).
- CI pulled by the orchestrator with `gh run view --log-failed` on 2026-10-15: Gate Inputs 38743966791 (5 pre-commit failures, `ERR_MODULE_NOT_FOUND`) and sk-doc Script Tests 38743966468 (the manifest fails; the catalog job fails on the sk-git leaf title). `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` locally: 111 passed, 0 failed.
- Not verified: findings 1.6-1.8, 2.1-2.2 and 3.7-3.8 rest on the iterations' source reading only.

## 11. Recommendations

Start with phase 1, because it turns three red CI workflows green with three small, independent edits. Next do rank 1, since a battery that can say OK while uncertain undermines every other row. Phase 3's hooks repair (rank 3) is the only finding that hands the operator untrusted code, so it should land before any wider rollout of `/doctor:git setup`.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat Gate Inputs as already fixed by packet 034 | The live run on main fails 5 pre-commit cases; packet evidence predates the doc-version tests | Run 38743966791; pre-commit.test.sh:954 | 2, 5, synthesis |
| Read the "four unseen failures" note as the current sk-doc state | Only `test_readme_manifest.py` fails now | Run 38743966468; sk-doc-script-tests.yml:3 | 2, 5, synthesis |
| Let the repository's config name the overlay path | That reopens the repository-steered path vector of finding 2.1 | git-preflight-advisory.mjs:107 | 5 |
| Running the inspected repository's installer as a repair | It executes untrusted hook sources | install-git-hooks.sh:175 | 4 |
| Running repair targets or test suites inside the research sandbox | Out of scope for read-only research; the sandbox also blocked GitHub API access | iteration-005.md Edge Cases | 5 |

## Divergence Map

- Saturated directions: none recorded (default convergence mode, no pivots).
- Pivots taken: none. Pivot failures and audited overrides: none.
- Remaining frontier: the root cause of the stale manifest entry (whether `sk-code/manual-testing-playbook/doctor-commands` should be durable), and runtime-specific registration shapes for OpenCode and Pi.

## 12. Open Questions

- Should a saved-off gate be FAIL or a new DEGRADED verdict? This decides the exit code contract.
- Is `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands` an intended durable directory, or should it move? The manifest refresh depends on the answer.
- What does a verified OpenCode and Pi advisory registration look like? A content check needs that spec.

## 13. References

- Iterations: `research/iterations/iteration-001.md` to `iteration-005.md`
- Resource map: `research/resource-map.md`
- Prior packets: `specs/sk-git/033-git-setup-customization/001-deep-research/research/research.md`, `specs/sk-git/033-git-setup-customization/002-doctor-git-setup/implementation-summary.md`, `specs/sk-git/034-standards-template-round-trip/implementation-summary.md`

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 4 / 5 (Q5 answered at synthesis with live CI evidence the iteration sandbox could not reach)
- Remaining questions: Q5 as tracked by the reducer
- Last 3 iteration summaries: run 3: Q4 drift and test gaps (0.75); run 4: Q3 repair audit (0.88); run 5: Q5 deferred items (0.50, timeout on GitHub API)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- The graph-convergence signal stayed empty: no iteration emitted graphEvents.

<!-- /ANCHOR:deep-research-doctor-git-setup-improvements -->
