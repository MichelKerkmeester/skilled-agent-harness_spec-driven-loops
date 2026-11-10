# Review Iteration 2

## Dispatcher

- Mode: review; target agent: deep-review.
- Focus: security; run: review-i2-g1.
- Status: complete.
- Carried forward without repetition: R1-P1-001, R1-P1-002, and R1-P2-001.

## Dimension

Security. The pass followed the strategy focus on repository-controlled process lookup, filesystem inputs, and Git environment selection. Review was static and limited to the checker source.

## Files Reviewed

- `.skilled/commands/doctor/scripts/git-setup-check.cjs:127,141,143,360,744` — child environment, executable lookup, and Git/Bash call sites.
- `.skilled/commands/doctor/scripts/git-setup-check.cjs:369-397,678,755` — allowlist selection, file read, and human/JSON output.
- `.skilled/commands/doctor/scripts/git-setup-check.cjs:594-619` — recognized hook paths and synchronous reads.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Relative PATH entries can execute checkout-supplied git or bash** — [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:141]
   - Case: The caller launches with `PATH=.:/usr/bin`, and the inspected checkout contains an executable named `git`; the initial probe runs it with the caller's privileges before checks begin.
   - Evidence: `safeGitEnv` copies `process.env` unchanged [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:127]. `runCommand` passes a bare command to `spawnSync` with the inspected checkout as `cwd` [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:141] and the copied environment [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:143]. Bare `git` is used by the initial probe [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:744], and bare `bash` by the allowlist call [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:360]. The argv array prevents shell expansion, but does not pin executable lookup.
   - User impact: An untrusted checkout can execute code before the battery completes.
   - Finding class: class-of-bug
   - Scope proof: Both observed call sites share `runCommand`; it passes relative command names and inherited PATH.
   - Affected surface hints: [`runCommand`, `initial git probe`, `allowlist bash helper`]
   - Recommendation: Pin git and bash to trusted absolute paths or construct a child PATH from trusted absolute directories.
   - Claim adjudication: `{"type":"claim_adjudication","claim":"A relative inherited PATH entry lets a checkout-provided git or bash win executable lookup in the child cwd.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:127",".skilled/commands/doctor/scripts/git-setup-check.cjs:141",".skilled/commands/doctor/scripts/git-setup-check.cjs:143",".skilled/commands/doctor/scripts/git-setup-check.cjs:360",".skilled/commands/doctor/scripts/git-setup-check.cjs:744"],"counterevidenceSought":"argv arrays prevent shell expansion, but there is no PATH filtering or absolute executable path.","alternativeExplanation":"A trusted absolute PATH avoids the case; exploitation requires a relative PATH component.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"A supported-runtime check proves child lookup is pinned to trusted absolute paths."}`

2. **A symlinked branch allowlist can disclose readable host files** — [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:393]
   - Case: A checkout makes `.skilled/skills/sk-git/scripts/remote-branch-allowlist.txt` a symlink to a readable credential file containing a short line; the checker prints that line as an allowlist pattern.
   - Evidence: A recognized path is accepted when `existsSync` succeeds [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:388] and then read with `readFileSync` [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:393]. Its lines enter report details [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:371] and the human renderer [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:678] and JSON serializer [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:755] emit those details. A short line survives the output cap.
   - User impact: A malicious checkout can expose readable files in terminal output or captured CI logs.
   - Finding class: class-of-bug
   - Scope proof: The selected path flows through read, details, and both output forms.
   - Affected surface hints: [`allowlistFileFor`, `allowlistPatternsIn`, `human report`, `--json report`]
   - Recommendation: Reject symlinks and verify the canonical path stays in the intended checkout before reading or reporting contents.
   - Claim adjudication: `{"type":"claim_adjudication","claim":"The checker follows a repository-controlled allowlist symlink, reads the target, and includes its lines in output.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:371",".skilled/commands/doctor/scripts/git-setup-check.cjs:382",".skilled/commands/doctor/scripts/git-setup-check.cjs:388",".skilled/commands/doctor/scripts/git-setup-check.cjs:393",".skilled/commands/doctor/scripts/git-setup-check.cjs:678",".skilled/commands/doctor/scripts/git-setup-check.cjs:755"],"counterevidenceSought":"The detail renderer caps details, but a short line still passes; the observed path has no containment check or redaction.","alternativeExplanation":"Only two allowlist paths are recognized, but the checkout controls entries at either path.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"A direct path check proves symlinks cannot escape the checkout or their contents are redacted."}`

### P2 Findings

3. **A FIFO in a recognized hook path can block the checker indefinitely** — [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:612]
   - Case: The selected tool's recognized hook configuration path in the checkout is a FIFO; after `existsSync` accepts it, `readFileSync` blocks waiting for a writer.
   - Evidence: Present paths are selected by an existence check [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:598] and synchronously read [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:612] without a type check or timeout.
   - User impact: The doctor command can hang instead of returning results.
   - Finding class: class-of-bug
   - Scope proof: Every file in this loop passes through the same existence filter and synchronous read.
   - Affected surface hints: [`checkAiToolHooks`, `TOOL_FILES`, `recognized hook configuration files`]
   - Recommendation: Reject non-regular files and bound reads of checkout-controlled configuration.

4. **Inherited GIT_DIR and GIT_WORK_TREE can redirect the requested checkout probe** — [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:127]
   - Case: The caller passes `--repo` for checkout A while GIT_DIR and GIT_WORK_TREE name checkout B; the probe can resolve B and remaining checks can use that root.
   - Evidence: `safeGitEnv` copies the full process environment [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:127], `runCommand` passes it to children [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:143], and the requested-target probe uses it [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:743] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:744].
   - User impact: The battery may report results for a different checkout than the operator requested.
   - Finding class: class-of-bug
   - Scope proof: Ambient repository selectors reach the initial Git probe before `repoRoot` is selected.
   - Affected surface hints: [`safeGitEnv`, `runCommand`, `initial git probe`, `--repo` target selection]
   - Recommendation: Clear repository-selector variables for an explicit target, or set them consistently from that target.

## Traceability Checks

- Core `spec_code` and `checklist_evidence`: not assessed in this security pass; prior state remains partial.
- Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not assessed; prior state remains pending or partial.

## Integration Evidence

No integration contract was independently reviewed. The checker source shows the allowlist call site, but the helper implementation and tests were not read.

## Edge Cases

- PATH execution requires a relative PATH entry and a matching checkout-local executable.
- Allowlist disclosure requires a symlink in a recognized location and a readable target; a short line is sufficient.
- The FIFO case requires selecting a tool whose recognized hook path is the FIFO.
- The Git target override requires ambient GIT_DIR/GIT_WORK_TREE values naming another repository.
- No target tests or dynamic fixtures were run; conclusions come from the cited source paths.

## Confirmed-Clean Surfaces

Child arguments use an argv array, so repository text is not shell-expanded by runCommand. PATH lookup remains unpinned.

## Ruled Out

No additional candidates were ruled out in this security pass.

## Verdict

Two P1 and two P2 findings are new. The two active iteration-1 P1 findings also remain open, so the iteration verdict is CONDITIONAL.

## Next Focus

- Dimension: traceability
- Focus area: compare shipped checker behavior with its docs and spec evidence, including setup naming in the feature catalog and manual playbook.
- Reason: correctness and security have focused passes; configured core and overlay traceability protocols remain partial or pending.
- Rotation status: productive.
- Blocked/productive carry-forward: none.
- Required evidence: inspect the exact skill, feature-catalog, playbook, and spec packet files named in scope.
- Recovery note: none.

Review verdict: CONDITIONAL
