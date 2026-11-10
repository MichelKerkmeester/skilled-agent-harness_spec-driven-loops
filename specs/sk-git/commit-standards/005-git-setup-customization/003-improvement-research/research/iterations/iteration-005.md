# Iteration 5: Deferred CI evidence and hard-rules overlay

## Focus

Close Q5 by checking the two CI items and specifying a safer per-repository hard-rules overlay. The strategy leaves Q5 as the sole unanswered question [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md:19].

## Actions Taken

- Read the config, state projection, strategy, registry, and previous iteration notes before selecting Q5.
- Located the sk-doc Script Tests and Gate Inputs workflows and their local test producers. The sk-doc workflow says four failures previously went unseen, names the two whole-repository cases, and now installs its Python and Node dependencies before running the suite [SOURCE: .github/workflows/sk-doc-script-tests.yml:3] [SOURCE: .github/workflows/sk-doc-script-tests.yml:34] [SOURCE: .github/workflows/sk-doc-script-tests.yml:42] [SOURCE: .github/workflows/sk-doc-script-tests.yml:50].
- Tried read-only `gh run list --workflow sk-doc-script-tests.yml --limit 5` and `gh run list --workflow gate-inputs.yml --limit 5`. Both returned a GitHub API network error. No run ID was available, so `gh run view <id> --log-failed` could not be issued. Historical failure names and present workflow status are therefore unverified.
- Statically traced the Gate Inputs sentinel handling and tests. I did not run the suite; this pass confirms the recorded fix from source and prior packet evidence only.

## Findings

1. **P1 · Medium-high impact · Small effort — sk-doc CI is wired with prerequisites, but the four historical failures and present status are still unverified.** The workflow says four failures went unseen, names two repository-wide cases (durable-directory manifest and README verdict baseline), installs PyYAML plus the spec-kit, sk-doc and deep-loop packages, then runs the shared script suite. The manifest test calls audit_readmes discovery/build functions; the verdict test invokes validate_document.py and compares each result with its frozen baseline. Workflow comments also identify scaffolder and root-name consumers needing those packages, but do not bind them to the unnamed failures. GitHub API access failed, so the other two identities and current CI result remain UNKNOWN. The `test_rename_tooling_fixture_harness.py` file is skipped from this workflow and has a separate ten-minute workflow [SOURCE: .github/workflows/sk-doc-script-tests.yml:3] [SOURCE: .github/workflows/sk-doc-script-tests.yml:4] [SOURCE: .github/workflows/sk-doc-script-tests.yml:34] [SOURCE: .github/workflows/sk-doc-script-tests.yml:39] [SOURCE: .github/workflows/sk-doc-script-tests.yml:42] [SOURCE: .github/workflows/sk-doc-script-tests.yml:50] [SOURCE: .github/workflows/sk-doc-script-tests.yml:52] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py:22] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py:49] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py:19] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py:78] [SOURCE: .github/workflows/sk-doc-rename-harness.yml:3].

2. **P1 · Medium impact · Small effort — Gate Inputs' sentinel fix is present and the adjacent-path regression is explicit; no residual failing case is evidenced.** The checker removes only the `/dev/null/.skilled` or `.opencode` trust sentinel before it continues scanning the rest of the command. Test 48 covers the sentinel-only pass, and test 49 requires a missing repository input in the same command to fail. Packet 034 records 49/49 tests and Gate Inputs green; this iteration did not rerun them, so that is recorded packet evidence, not a fresh test result. I found no residual failing case in the inspected sources [SOURCE: .github/scripts/check-gate-inputs.sh:283] [SOURCE: .github/scripts/check-gate-inputs.sh:286] [SOURCE: .github/scripts/check-gate-inputs.sh:288] [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:477] [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:483] [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:487] [SOURCE: specs/sk-git/034-standards-template-round-trip/tasks.md:52] [SOURCE: specs/sk-git/034-standards-template-round-trip/implementation-summary.md:50].

3. **P2 · Medium impact · Medium effort — hard-rules overlay contract.** Keep installed rules authoritative. Put repository additions at the fixed root path `.sk-git/hard-rules.json`; load it only after an operator-owned trust decision keyed to the canonical repository path and remote identity. Never let repository config self-authorize trust or steer the overlay path. Merge in deterministic order: built-ins first, then additions. Permit only registered existing checks and `warn` severity; require repository-namespaced IDs; reject duplicates against built-ins and within the overlay. Reject symlinks, traversal and oversize files. On parse, schema, check or ID failure, ignore the overlay as a unit while retaining built-ins and report the invalid state. The setup battery should display built-in count, overlay count, and one explicit state: absent, active, ignored-untrusted or invalid. This is needed because the current dispatch loader reads one sibling sidecar, returns an empty list on read/parse/shape errors, skips unknown checks and treats throwing checks as passed; the advisory resolves the inspected repository's skill path, while the setup battery checks the installed copy [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:14] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:18] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:21] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:280] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:287] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:106] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:107] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:108] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:524] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:526].

## Ranked Improvements Across Q1–Q5

1. **P1 · High impact · Small effort — stop reporting uncertain or malformed checks as healthy (Q1).** UNKNOWN-only output and incomplete gate JSON can currently pass; make uncertainty distinct and nonzero, validate expected fields, and test both paths [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:651] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:681] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:752] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:303] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:137].
2. **P1 · High impact · Medium effort — bound repository-selected paths and recovery code (Q2/Q3).** The battery intentionally avoids invoking the inspected repository's hook installer, but one emitted repair points the operator to that installer; repository-controlled hook, contract and worktree paths also need explicit containment/symlink policy [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:213] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:216] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:225] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:229] [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-001.md:30] [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-004.md:18].
3. **P1 · High impact · Medium effort — make every repair address the condition it diagnosed (Q3).** Replace broad install restore, separate broken gate reporting from disabled-gate repair, and give a missing standards directory a resolver-level recovery before invoking the standards target [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-004.md:16] [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-004.md:20] [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-004.md:22].
4. **P1 · Medium-high impact · Medium effort — align registration, documentation and scenario expectations (Q4).** Verify runtime adapter shape or narrow the claim to file presence; correct the shared presentation's mutation class and DOC-384's all-PASS precondition [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-003.md:18] [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-003.md:20].
5. **P1 · Medium-high impact · Small effort — close the sk-doc CI evidence gap (Q5).** Retrieve the workflow log when GitHub is reachable and map all four historical failures before claiming the suite is green; current workflow setup has prerequisites but is not itself evidence of a successful run [SOURCE: .github/workflows/sk-doc-script-tests.yml:3] [SOURCE: .github/workflows/sk-doc-script-tests.yml:34] [SOURCE: .github/workflows/sk-doc-script-tests.yml:50].
6. **P2 · Medium impact · Medium effort — add the trust-gated, additive overlay described above (Q5).** Keep local rules warning-only and prevent them from replacing built-ins [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:14] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:107].

## Proposed Implementation Phases

1. **Truthful battery and safe recovery:** change UNKNOWN and malformed helper output handling; scope repository-derived file reads; replace unsafe or source-blind recovery text; test each uncertain/failing row.
2. **Overlay contract:** add the fixed path, operator trust source, schema/check/ID validation, deterministic additive merge and explicit battery status. Built-ins remain active if local data is invalid.
3. **Contract and documentation coverage:** add focused tests for overlay trust, parse/schema/collision behavior, and each repair's target; synchronize git command text, route YAML, presentation and DOC-384.
4. **CI closure:** when API access is available, inspect the latest sk-doc Script Tests run and failed logs, name the four cases, fix their producers if still failing, and capture the successful run. Gate Inputs has a recorded 49/49 pass; no failing residual case is currently evidenced.

## Questions Answered

- None fully. Q5 is partially answered: the overlay contract is concrete and the Gate Inputs fix is source-confirmed, but the four historical sk-doc failures and current CI state could not be verified.

## Questions Remaining

- Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests? The two identified repository-wide sk-doc cases are statically traced, but the remaining historical failure names and present run status need a successful GitHub API lookup.

## Ruled Out

- No repair command or test suite was executed in this research iteration. The Gate Inputs fix was checked statically against its test assertions and the recorded packet result.

## Edge Cases

- **Missing dependency:** GitHub API connectivity failed for both workflow queries; no run ID was available to inspect.
- **Partial success:** Gate Inputs source and prior packet evidence confirm the sentinel fix; sk-doc historical CI status remains unknown.
- **Contradiction:** None found in the inspected source. The workflow's statement that failures existed historically does not establish their current state.

## Sources Consulted

- .github/workflows/sk-doc-script-tests.yml
- .github/workflows/sk-doc-rename-harness.yml
- .opencode/skills/sk-doc/scripts/tests/run-script-tests.sh
- .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py
- .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py
- .github/scripts/check-gate-inputs.sh
- .github/scripts/tests/check-gate-inputs.test.sh
- .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs
- .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
- .skilled/commands/doctor/scripts/git-setup-check.cjs
- specs/sk-git/034-standards-template-round-trip/tasks.md
- specs/sk-git/034-standards-template-round-trip/implementation-summary.md
- Prior iteration findings from iterations 001–004 in this packet

## Assessment

- New information ratio: 0.50 (four partially new findings; the Gate Inputs fix and overlay foundation were already known, while the live CI lookup and exact source mapping add bounded evidence).
- Questions addressed: Q5.
- Questions answered: none fully.
- Questions remaining: Q5.
- Status: timeout because external CI evidence was unreachable and the exact four historical cases could not be named.

## Reflection

- What worked and why: reading the workflow and producer tests established which local artifacts are relevant without risking a test that might write into the repository.
- What did not work and why: both gh run list calls failed at api.github.com, leaving no run identifiers and no current logs.
- What I would do differently: first retrieve one successful workflow run and its failed-step log, then match each reported test name to its producer before closing Q5.

## Next Focus

When GitHub API access is available, query the most recent sk-doc Script Tests run and inspect its failed log; map all four historical case names to producer lines and record whether the workflow now passes. No code changes were made in this research iteration.
