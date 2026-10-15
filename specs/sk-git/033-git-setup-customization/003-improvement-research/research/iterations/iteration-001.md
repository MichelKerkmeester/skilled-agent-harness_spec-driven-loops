# Iteration 1: Setup battery false-healthy states and repository-steerable inputs

## Focus

Q1 and Q2: inspect the setup battery and test end to end, then map its checks, subprocesses, repository-derived paths, false-healthy results, and remaining path-control surface.

## Actions Taken

- Read config, state log, strategy, and registry before selecting focus. Strategy selected Q1 and Q2; state had no completed iteration records.
- Inspected all 774 lines of the checker and all 493 lines of its test without executing the suite.
- Traced the gate registry helper, message-contract loader, allowlist validator, and Commit-Id policy helper.
- No builds, tests, Git writes, validation scripts, or target-code changes were run.

## Findings

1. **Rank 1 — P1, high impact, low effort: UNKNOWN can still produce a healthy result.** A thrown check becomes UNKNOWN, but report and exit status count only FAIL. A missing helper or failed import can yield JSON status OK and exit 0; human mode prints STATUS=OK checks=11 if there is no FAIL. Tests permit UNKNOWN but derive status only from FAIL. Require UNKNOWN to block or produce a distinct nonzero status, and add an UNKNOWN-only test. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:651] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:681] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:752] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:137]

2. **Rank 2 — P1, high impact, low effort: the gates check can mistake an incomplete report for zero disabled gates.** Valid JSON without a gates array becomes an empty array and returns PASS. The helper reads its registry from inherited GATE_REGISTRY while the battery copies the caller environment. Pin registry provenance, validate report shape and expected keys, and test missing or empty registry input. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:303] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:126] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:74] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:207] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130]

3. **Rank 3 — P1, medium-high impact, low effort: worktree writability checks the wrong directory when the base already exists.** The battery checks the nearest existing directory above base.dir, not base.dir itself. An existing unwritable base or a file at that path can pass although the allocator creates worktrees beneath the base. Check the existing base directly and add both cases. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:445] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:466] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:415] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:454]

4. **Rank 4 — P1, medium-high impact, low effort: unknown active runtime can pass without verifying an active adapter.** Without --tool, only CLAUDECODE identifies the active runtime. When no runtime is identified, a missing adapter is informational and does not enter the failure list, so the check can PASS without checking the running tool. Detect supported runtimes or return UNKNOWN, and test absent-all/no-tool. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:586] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:599] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:630] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:346]

5. **Rank 5 — P1, medium impact, low effort: adapter registration is weaker than runtime health.** Four tools pass when serialized hooks contain the literal git-preflight-advisory; OpenCode and Pi pass when their adapter file merely exists. A disabled or unrelated node, stale file, or non-runnable command can appear registered without an effective registration. Validate runtime-specific event and command targets, or report registration as evidence rather than health. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:580] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:604] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337] [INFERENCE: the implementation checks presence/text, not whether the runtime will execute the configured adapter]

6. **Rank 6 — P2, medium impact, low effort: allowlist execution failures are reported as healthy.** A process launch error is rendered as not checked; any nonzero validator status is rendered as refused, including unexpected failure codes. The function nevertheless returns PASS. Distinguish expected refusal (exit 1) from helper/runtime error and return UNKNOWN or FAIL when evaluation fails. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:352] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:360] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:376] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:608] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:370]

7. **Rank 7 — P2, medium impact, medium effort: hook checks establish link destination, not hook behavior.** The checker compares realpaths against accepted own-install or repository hook-source paths; it does not inspect contents or executable mode. The test creates repository-owned hooks containing only exit 0 and still observes PASS. State that the check proves linkage only, or add bounded integrity and executable checks. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:221] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:247] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:398] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:412]

8. **Rank 8 — P2, medium impact, medium effort: repository-controlled paths can escape the worktree, though inspected paths are read/probed rather than executed.** core.hooksPath selects the hooks directory; skgit.contractDir is joined with the repo root (absolute values stay absolute) and template files are read; speckit.worktreeBase selects a path whose parent is probed. Fixed AI-tool config paths follow symlinks. Helpers resolve beneath OWN_ROOT, and this call graph reads repo files/config rather than importing repository-owned helper code. Add containment/regular-file checks where external paths are unsupported and label supported external paths. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:43] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:231] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:297] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:597] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:283] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:317] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:45] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:210]

## Path and Process Map

- OWN_ROOT derives from the checker install path. Gate, contract, allowlist, Commit-Id, rules, and hook helpers resolve from that root. The main Git probe resolves --repo or cwd to a repository top level. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:43] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:297] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:734]
- Git queries resolve the top level, hooks path, common Git dir for installed and inspected repos, local skilled.trustRepoHooks, saved gate keys, skgit.contractDir, remote allowlist, speckit.worktreeBase, local skilled.commitId, and up to 50 recent commits for Commit-Id trailers. The Commit-Id helper pipes Git log output to grep. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:231] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:260] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:284] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:299] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:405] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:493] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:261] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:46] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:25] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:38]
- Repository-derived paths include Git's hooks path; optional .skilled/.opencode hook sources selected by marker; configured/fallback contract directories; main-worktree allowlist; configured/default worktree base; provision package paths; Commit-Id markers; and six AI-tool config locations plus Claude local settings. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:225] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:382] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:449] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:479] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:586]
- core.fsmonitor=false is both a Git flag and injected config; log.showSignature=false is injected to prevent signature-helper execution. Tests plant fsmonitor and gpg.program markers and assert neither runs. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:121] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:156] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:216] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:379]
- Child processes inherit caller environment. The fixture removes GIT_DIR, GIT_WORK_TREE, GIT_CONFIG_* and runtime switches, while production safeGitEnv retains other variables. This is an invocation-environment vector, separate from repo config; GATE_REGISTRY can redirect the gate helper registry. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:126] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:140] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:53] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:210]

## Questions Answered

- **Q1:** False-healthy cases found: UNKNOWN collapsing into OK; incomplete gate reports; caller-selected gate registry; existing unusable worktree base; undetected active runtime; shallow adapter registration; and allowlist helper failures reported as PASS.
- **Q2:** Repo config/filesystem can steer hooks, contract, worktree-base, allowlist, marker, and adapter paths. In this call graph these inputs are read or probed; helper implementations resolve from OWN_ROOT. Caller environment remains inherited, including GATE_REGISTRY and Git redirection variables. No repo-owned helper execution was found in the enumerated subprocess/import sites.

## Questions Remaining

- Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix?
- Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded?
- Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests?

## Next Focus

Q3: audit repairs named by the battery and /doctor:git targets against the failure each claims to fix, especially whether a repair preserves the actual setting and addresses the producer.

## Reflection

Tracing subprocesses into their helpers distinguished paths read from code executed. The full test file exposed asserted healthy behavior for no active tool and missing negative cases for UNKNOWN status, malformed gate reports, unwritable bases, and adapter runtime validity. Tests were not run because the dispatch forbids tests that write into this repository.

## Recommended Next Focus

Continue with Q3, then focus Q4 on docs and test gaps describing the same behaviors. Carry Q5's overlay design and outstanding CI failures into a separate evidence-backed pass.

## SCOPE VIOLATIONS

No out-of-scope write was attempted. The progressive-synthesis document is outside the bound allowed-write paths, so it was left to the workflow owner.

## Assessment

- New information ratio: 0.86 (five fully new findings and two partially new; no synthesis bonus applied).
- Questions answered: Q1 and Q2.
- Questions remaining: Q3, Q4, and Q5.
- Findings: 8, ranked by impact and effort above.

## Sources Consulted

- .skilled/commands/doctor/scripts/git-setup-check.cjs:121
- .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:216
- .skilled/commands/doctor/scripts/git-hook-gates.cjs:74
- .skilled/skills/sk-git/scripts/lib/message-contract.mjs:283
- .skilled/skills/sk-git/scripts/worktree-naming.sh:46
- .skilled/scripts/git-hooks/lib/commit-id-policy.sh:25
- specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md:20

## Edge Cases

- Ambiguity: none; dispatch selected Q1 and Q2.
- Contradictory evidence: none found.
- Missing sources: none for scoped questions.
- Partial success: none; checker/tests were inspected, not executed.

## Status

Iteration 1 recorded complete. The overall research topic still has three unanswered questions.
