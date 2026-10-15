# Iteration 2: Deferred overlay and CI work

## Focus

Q5 asks how to resolve the deferred per-repository hard-rules overlay and the reported Gate Inputs and sk-doc Script Tests failures. I checked the current readers, CI workflow definitions and the 034 verification record to distinguish work that is already addressed from work that still lacks a current result.

## Actions Taken

- Read the configured run identity, iteration history, strategy and registry before selecting this focus.
- Compared the current hard-rules readers with the recorded deferred overlay item.
- Traced the Gate Inputs sentinel through its parser and regression test, then checked the 034 verification evidence.
- Read the sk-doc workflow and its test-runner step. I did not run tests because this dispatch prohibits tests that write into the repository.

## Findings

1. **Rank 1, P2, medium impact, medium effort: specify an additive repository overlay.** The current readers use one hard-rules.json beside the selected SKILL.md. The Git advisory resolves that SKILL.md from the project root and filters rules through a fixed registry. The dispatch reader silently drops missing, malformed or unsupported rules, so a second file needs explicit merge and error behavior. I recommend a fixed `.sk-git/hard-rules.json` overlay that adds warning rules only, uses unique repository-prefixed IDs and supported checks, rejects symlinks and paths outside the repository, and reports invalid data through /doctor:git. Keep the shipped rules active if the overlay is invalid. This design is an inference from the single-file reader and the deferred item. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:14] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:18] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:21] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:281] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:282] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:287] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:106] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:107] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:108] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13] [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md:114] [INFERENCE: the repository needs a distinct precedence and trust contract because the current reader consumes one sibling file and silently drops malformed or unsupported rules]

2. **Rank 2, P1, high impact, low effort: Gate Inputs has a recorded fix.** The failing hook-input case treated the untrusted-clone sentinel as a source root. The checker now strips only that sentinel and keeps validating other paths in the same command. Test 49 protects that boundary. Packet 034 records the checker as passed with 49 of 49 tests, and its summary says Gate Inputs is green on main. I did not rerun the suite, so this is packet evidence rather than a result observed in this iteration. [SOURCE: .github/scripts/check-gate-inputs.sh:283] [SOURCE: .github/scripts/check-gate-inputs.sh:286] [SOURCE: .github/scripts/check-gate-inputs.sh:288] [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:477] [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:485] [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:487] [SOURCE: specs/sk-git/034-standards-template-round-trip/tasks.md:52] [SOURCE: specs/sk-git/034-standards-template-round-trip/implementation-summary.md:50]

3. **Rank 3, P1, high impact, medium effort: sk-doc CI visibility is fixed, but the failures are unresolved here.** The workflow says the tests previously ran nowhere and four failures went unseen. It now runs the script-test suite on pull requests and pushes, with the long rename fixture excluded. That fixes discoverability. The workflow definition does not establish that the four cases now pass, and I did not find a current run result in the verification evidence inspected here. Their individual causes and current status are UNKNOWN. The next evidence needed is a current workflow run with the failing test names and output. [SOURCE: .github/workflows/sk-doc-script-tests.yml:3] [SOURCE: .github/workflows/sk-doc-script-tests.yml:4] [SOURCE: .github/workflows/sk-doc-script-tests.yml:5] [SOURCE: .github/workflows/sk-doc-script-tests.yml:34] [SOURCE: .github/workflows/sk-doc-script-tests.yml:50] [SOURCE: .github/workflows/sk-doc-script-tests.yml:53] [SOURCE: .github/workflows/README.md:45]

## Questions Answered

- None fully. Q5 remains open because the current status and root causes of the four sk-doc failures are not established by the workflow definition.

## Questions Remaining

- Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix?
- Q4: Where do the command docs and skill references drift from script behavior, and which test gaps leave it unguarded?
- Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests?

## Sources Consulted

- .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:14-23,281-287
- .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-16,106-108
- .skilled/skills/sk-git/hard-rules.json:1-35
- .github/scripts/check-gate-inputs.sh:283-288
- .github/scripts/tests/check-gate-inputs.test.sh:477-487
- .github/workflows/sk-doc-script-tests.yml:3-53
- .github/workflows/README.md:45
- specs/sk-git/034-standards-template-round-trip/tasks.md:52
- specs/sk-git/034-standards-template-round-trip/implementation-summary.md:50
- specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md:114

## Assessment

- New information ratio: 0.67, based on one new workflow-status finding and two partially new findings.
- Questions answered: none in full.
- Status: complete iteration with partial Q5 evidence. The Gate Inputs defect has a recorded fix. The sk-doc suite still needs a current run result.

## Reflection

Comparing the CI workflow with the 034 verification record separated the already-addressed Gate Inputs defect from the still-unverified sk-doc failures. Reading the hard-rules loader exposed the missing merge contract for a separate repository overlay. The main limitation is that this research dispatch forbids running the suite, so the current sk-doc result remains UNKNOWN.

## Recommended Next Focus

Continue Q5 by obtaining the current sk-doc Script Tests workflow result and the exact failing test output. If the job is green, close Q5 with that evidence. If it is red, trace each failure to the producer and recommend a narrowly scoped fix.

## Next Focus

Continue Q5 for the sk-doc Script Tests result and root causes. Then investigate Q3.
