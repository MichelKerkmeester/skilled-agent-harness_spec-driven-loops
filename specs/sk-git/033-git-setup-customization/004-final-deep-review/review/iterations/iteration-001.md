# Review Iteration 001: Inventory and Correctness

## Dispatcher

Mode: review. Target agent: deep-review. Session: 2026-10-15T13:35:35.122Z, generation 1, lineage new. The completed-iteration count in the state log was zero, matching iteration 1. Review target files remained read-only.

## Dimension

Correctness, with the iteration-1 inventory. Focused on the checker and test file end to end, then read the named hook and helper contracts needed to verify the suppression and runtime-registration checks.

## Files Reviewed

- .skilled/commands/doctor/scripts/git-setup-check.cjs:1-774 — all eleven checks, reporting, argument parsing, exit paths.
- .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:1-493 — all fixtures and assertions.
- .skilled/hooks/shared/hook-flags.cjs:83-89,146-173 — persistent config path and switch precedence.
- .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:55-109 — suppression tiers and kill-switch behavior.
- .skilled/skills/sk-git/scripts/hooks/README.md:77-84,149-155 — runtime event contracts and supported suppressors.
- .skilled/commands/doctor/scripts/git-hook-gates.cjs:74-130 — registry parsing and effective gate state.
- .skilled/skills/sk-git/scripts/lib/message-contract.mjs:283-323 — contract resolution and malformed-contract behavior.
- .skilled/skills/sk-git/scripts/worktree-naming.sh:57-78,140-170,508-519,608-610 — worktree base, allowlist, and CLI behavior.
- .skilled/scripts/git-hooks/pre-push:140-186,193-229 — contract and Commit-Id setup plus push processing.
- specs/sk-git/033-git-setup-customization/002-doctor-git-setup/spec.md:3,40; acceptance-criteria.md:54-62; implementation-summary.md:55-103 — stated purpose and evidence.
- .skilled/skills/sk-code/sk-code-review/references/review-core.md:30-51,90-121 — severity and evidence contract.

The checker and its tests were read fully. The named integration surfaces above were read at the cited sections; the remaining review-scope documents and complete repair-command routes are deferred to later dimensions.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Persistent hook disable flags are invisible to the suppression check** — .skilled/commands/doctor/scripts/git-setup-check.cjs:559-566 — checkSuppression reads only process.env, while the shared hook-flags store also reads the inspected checkout's .skilled/hooks/hook-flags.env. git-preflight-advisory honors that store and exits early when disabled. With SYSTEM_HOOKS_DISABLED=1 saved in the file and absent from the process environment, the battery reports suppression PASS with no detail although the actual hook is disabled. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:559] [SOURCE: .skilled/hooks/shared/hook-flags.cjs:83] [SOURCE: .skilled/hooks/shared/hook-flags.cjs:151] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:76]
Case: The inspected checkout has .skilled/hooks/hook-flags.env containing SYSTEM_HOOKS_DISABLED=1, with the battery process environment unset; the suppression row is PASS and does not report the active disable.
Finding class: cross-consumer
Scope proof: The checker reads process.env at lines 561-565; the shared reader loads hook-flags.env at lines 83-89 and checks persisted values at lines 151-173; the preflight hook consumes isHookEnabled at lines 76-81.
Affected surface hints: checkSuppression, hook-flags.cjs, git-preflight-advisory.mjs, git-setup-check.test.cjs
Claim adjudication: {"type":"claim_adjudication","claim":"The setup battery can report no suppression while the target checkout's persistent hook flag store disables Git hooks.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:559-566",".skilled/hooks/shared/hook-flags.cjs:83-89",".skilled/hooks/shared/hook-flags.cjs:151-173",".skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:76-81"],"counterevidenceSought":"Checked whether the shared hook reader is environment-only and whether the battery reads the persisted file through another path; the reader explicitly loads hook-flags.env, and the checker does not.","alternativeExplanation":"The suppression row may intentionally display only environment values, but that leaves an effective persisted disable invisible and conflicts with the battery's stated coverage of suppression flags.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if the supported hook contract removes persistent hook-flags.env settings for Git preflight or the checker is explicitly scoped and labeled as environment-only."}

2. **AI hook registration passes on a marker string in the wrong event** — .skilled/commands/doctor/scripts/git-setup-check.cjs:580-583 — registersAdvisory accepts the marker anywhere in the hooks section. The Codex positive fixture stores only a marker command under SessionStart and asserts PASS, while the documented integration runs on PreToolUse with matcher exec. A wrong-event or inert entry can therefore pass the active-tool check. [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:580] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:78]
Case: With --tool codex, .codex/hooks.json contains hooks.SessionStart with command echo git-preflight-advisory and no PreToolUse entry; the checker reports registered although Git commands never trigger the advisory.
Finding class: cross-consumer
Scope proof: The checker searches serialized hook content at lines 580-583; the positive Codex fixture is at tests/git-setup-check.test.cjs:337-344; the documented event is hooks/README.md:78.
Affected surface hints: registersAdvisory, checkAiToolHooks, Codex hook configuration, git-setup-check.test.cjs
Claim adjudication: {"type":"claim_adjudication","claim":"The active AI-tool hook check can mark a non-triggering Codex configuration as registered.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:580-583",".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337-344",".skilled/skills/sk-git/scripts/hooks/README.md:78"],"counterevidenceSought":"Compared the positive Codex fixture with the repository's documented adapter contract and checked whether the matcher requires an exact event or command; it only searches serialized hook content for the marker.","alternativeExplanation":"A marker-only probe may have been chosen to avoid depending on every runtime schema, but it cannot establish that the runtime invokes this advisory on Git commands.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if the supported Codex contract makes the tested SessionStart marker invoke the preflight for each Git command, or if the check is relabeled as marker presence rather than registration."}

### P2 Findings

3. **JSON outcome tests do not cover UNKNOWN/SKIP-only runs** — .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130-155 — the JSON aggregation assertion uses a fixture that already has a FAIL. Human mode covers a no-fail run containing SKIP, but JSON has no no-fail SKIP or UNKNOWN case. Current implementation shares the FAIL-only predicate, so this is a test gap, not an observed runtime mismatch. [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:157] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:753]
Case: If a future JSON-only aggregation change treats SKIP or UNKNOWN as failure while the process exit code remains based on FAIL, a no-fail --json run emits status FAIL with exit 0; current JSON tests use a fixture with an actual FAIL and would not detect the mismatch.
Finding class: matrix/evidence
Scope proof: The only JSON status/exit assertion is at test lines 130-155; the no-fail SKIP assertion at lines 174-176 exercises human mode only.
Affected surface hints: JSON status aggregation, git-setup-check.test.cjs
Recommendation: Add JSON cases with no FAIL and a SKIP, and with no FAIL and an UNKNOWN; assert status OK and exit 0.

## Traceability Checks

- Core spec_code: partial. The spec describes a read-only setup report for surfaces that may otherwise appear healthy [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/spec.md:3]. The persistent switch and runtime registration findings leave gaps in that report.
- Core checklist_evidence: partial. AC-007 is marked Met with the AI-tool hook test as evidence [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md:60], but the positive Codex fixture does not use the documented event contract [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337].
- Overlay skill_agent: partial; the hook README documents the shared switch and suppression behavior [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:30]. The sk-git SKILL.md route is deferred.
- Overlay agent_cross_runtime: partial; the README distinguishes each runtime's event and adapter [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77]. Only the Codex false-positive path is adjudicated here.
- Overlay feature_catalog_code and playbook_capability: pending; the feature catalog and manual playbook were not reviewed in this iteration.

## Integration Evidence

The switch producer is .skilled/hooks/shared/hook-flags.cjs, which defaults to .skilled/hooks/hook-flags.env and merges it with environment values. The consumer is .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs, which returns early when isHookEnabled('git-preflight') is false. The documented Codex registration is PreToolUse with matcher exec in .skilled/skills/sk-git/scripts/hooks/README.md:78.

## Edge Cases

- Runtime status: human output, JSON status, and the exit code currently use the same FAIL-only predicate. The human test exercises a no-fail run containing SKIP. JSON no-fail SKIP/UNKNOWN aggregation remains untested and is recorded as P2.
- The non-mutating git probe with core.hooksPath set returned that configured hooks path from rev-parse --git-path hooks, consistent with checkHooks.
- The test suite was not executed. Its fixture cleanup calls fs.rmSync at tests/git-setup-check.test.cjs:71-72 and other cleanup sites, and the dispatch prohibits executing removal operations. The tests were inspected statically.

## Confirmed-Clean Surfaces

- Contract directory precedence and malformed-contract behavior align with message-contract.mjs:283-323.
- The allowlist helper accepts main, exempts skilled/v* before the remote allowlist check, and reads the main worktree's allowlist at worktree-naming.sh:140-170.
- Hook path discovery honors core.hooksPath in the read-only probe and the checker resolves that path at git-setup-check.cjs:231-235.

## Ruled Out

- Exit/status mismatch in the current reviewed branches: the JSON status and return code use the same failed predicate, and human output derives its STATUS line from failed rows.
- A repository-configured fsmonitor or gpg.program executing through the reviewed Git queries: the test fixtures plant both markers; the checker adds a command-line core.fsmonitor=false and overrides fsmonitor and log.showSignature in its child environment. Dynamic execution of those tests was not performed.

## Next Focus

Dimension: security
Focus area: hostile repository configuration and filesystem inputs reaching Git, Bash helpers, and file resolution.
Reason: correctness identified trust boundaries that need an adversarial path review.
Rotation status: productive; no approach is exhausted.
Blocked/productive carry-forward: dynamic test execution was blocked by the no-delete constraint; continue with static source analysis and safe read-only probes.
Required evidence: every child-process path, environment override, repository-controlled file read, and any path that can resolve outside the checkout.
Recovery note: none.

## Verdict

Findings: 0 P0, 2 P1, 1 P2. The iteration verdict is CONDITIONAL because active P1 findings remain.

Review verdict: CONDITIONAL
