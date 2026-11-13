# Review Iteration 002

## Dispatcher

- Lineage: `doctor-docs-3`, session `fanout-doctor-docs-3-1794593402980-zhrui5`, generation 1.
- Mode: review, dimension `traceability`, budget profile `verify`.
- Operator review focus: pass-three narrow review of the doctor-docs files changed by the pass-two remediation commits, judging each change against its task line and callers. This iteration addresses the focus by checking the three doctor contract changes (T031, T032, T033) against the engine and workflow they describe, and by running the two contract suites that pin them.
- Sources read: `git diff ec1869dae8..HEAD` for `_routes.yaml`, `assets/doctor-agents-md-embed.yaml`, `setup.md`, `tests/doctor-agents-md-contract.test.cjs` and `tests/doctor-setup-contract.test.cjs`; current `agents-md-embed.cjs:940-1010, 1300-1445`; `doctor-setup.yaml` advisor step; the scope file.

## Files Reviewed

- `.skilled/commands/doctor/_routes.yaml:543-546` (embed `gate3_location` backup folder)
- `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:34, 101-104` (mutation boundary and exit-3 reading)
- `.skilled/commands/doctor/setup.md:79-82` (unrecorded hook health reason)
- `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs:468-495`
- `.skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs:78-87`
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:943-1010, 1300-1445` (caller: backup naming and restore-failure output)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | T031's `ERROR: the restore failed` branch matches `agents-md-embed.cjs:1434`; T032's `<first 16 characters of the plan digest>/` matches `backupDirectoryOf` at `agents-md-embed.cjs:954-955` with `BACKUP_NAME_CHARS = 16`; T033's reason matches the advisor step in `doctor-setup.yaml:59` and no doctor asset still names `SKILL_ADVISOR_DEBUG`. |
| `checklist_evidence` | pass | CHK-040 and CHK-041 claim the route, workflow and router match the code; the two contract suites pass on the final tree (`39` and `4` tests, `fail 0`). |
| `feature_catalog_code` | notApplicable | The catalog page is reviewed in iteration 3. |
| `playbook_capability` | notApplicable | The playbook page is reviewed in iteration 3. |

## Integration Evidence

- `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` reports `pass 39`, `fail 0`.
- `node --test .skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs` reports `pass 4`, `fail 0`.
- The engine prints the backup line from `plan.dir` and the undo line after the restore catch (`agents-md-embed.cjs:1242-1243, 1426-1438`), so the workflow's instruction to show both stays executable.

## Edge Cases

- The route text for other doctor routes still holds `<timestamp>` placeholders (`_routes.yaml:72, 99, 506`). Those routes are outside the embed route and outside the changed lines, so the T032 assertion correctly scopes to the embed route and the embed workflow.
- `restored:` and `ERROR: the restore failed` cannot both come from one `restoreFromBackup` call, because `restored:` is printed only on the path that returns normally. The workflow's precedence sentence is therefore a reading rule for a combined transcript, not a claim that both lines always co-occur; recorded, not reported.
- The hash-mismatch path prints `ERROR: the backup copy ... does not match its recorded hash, so nothing was restored` and returns null without throwing, so it stays under the existing `nothing was restored` branch. The new sentence does not capture that line, and does not need to.

## Confirmed-Clean Surfaces

- Backup folder naming is the first 16 characters of the plan digest in both the output directory and the temporary-directory fallback (`agents-md-embed.cjs:954-982`).
- The exit-3 reading names both ERROR lines, the backup and undo lines, `STATUS=FAIL` and the undo command, in the order the engine emits them.
- The setup router and the setup workflow now carry the same reason for absent hook health, and neither names the debug setting.

## Ruled Out

- A clock reading (`<timestamp>`) for the embed backup folder is ruled out as a current defect: both changed documents and the engine use the plan digest.
- `OpenCode has no prompt hook that writes one` is ruled out as a false claim: `persistAdvisorHookDiagnosticRecord` is imported only by `hooks/claude/user-prompt-submit.ts`, and no OpenCode plugin path calls it.
- The contract tests are not tautologies: each newly asserted sentence was absent before the change, so each test failed on the pre-change tree.

## Next Focus

- Dimension: maintainability.
- Focus area: the changed README, playbook and catalog pages (T008, T018 to T024, T030, T043) against the code they describe, plus the baseline recapture disclosure.
- Reason: the doctor contracts are closed and clean; the remaining changed doctor-docs surface is prose that names code.
- Rotation status: correctness and traceability complete; maintainability next; security held for iteration 4 with the caller sweep.
- Blocked/productive carry-forward: doc-to-code citation checking is productive; continue with exact field, path and flag checks.
- Required evidence: the command-bridges row fields, the routing-accuracy flags and refusal codes, the playbook inventory and persistence path, the catalog schema anchors, and the baseline metric arithmetic.

Review verdict: PASS
