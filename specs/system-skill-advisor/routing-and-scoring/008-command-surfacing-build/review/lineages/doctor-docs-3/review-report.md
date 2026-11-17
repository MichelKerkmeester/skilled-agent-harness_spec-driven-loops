# Deep Review Report: doctor-docs-3

Lineage `doctor-docs-3` of the command-surfacing pass-three fan-out. Session `fanout-doctor-docs-3-1794593402980-zhrui5`, generation 1, lineage mode `new`. Review target `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`, review target type spec-folder. Base commit `ec1869dae8`, head `1ca14a4498`.

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: false
- Active findings: P0 = 0, P1 = 1, P2 = 0
- Review scope: the 16 doctor-docs files changed by the two pass-two remediation commits, each read through `git diff ec1869dae8..HEAD`, plus the callers of their changed functions. Pass-one and pass-two findings whose fixes hold are excluded, as are the four coordinator-left items.
- Operator review focus: Code review of command surfacing, PASS THREE (narrow). FIRST read the full instructions in /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-instructions-3.txt and follow them exactly. Scope file: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-scope-3.txt (area TAB path). Review only the files whose area equals your lineage label without its -3 suffix, by reading git diff ec1869dae8..HEAD for each. Every finding is P0, P1 or P2 with file:line and a concrete input. Never open holdout-prompts.jsonl or read holdout prompt text. Change no code, write only inside your lineage folder.
- Four iterations covered correctness, traceability, maintainability and security. The changed doctor contracts, READMEs, playbook, catalog and baseline are clean; the one defect is in the new node-flag reader in the doctor hook-wiring check.

## 2. Planning Trigger

`/speckit:plan` is required because one active P1 remains. Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "DR3-P1-001",
      "severity": "P1",
      "title": "An attached node evaluation flag still reports the hook as wired",
      "dimension": "correctness",
      "file": ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:266",
      "evidence": "NODE_FLAGS_WITHOUT_RUN is tested with exact membership on the whole token, so --eval=0, -e\"1\" and -p\"1\" skip the guard; the marker then matches as node's script word",
      "impact": "node hook-wiring-check.cjs --root . prints ok claude and exits 0 for a command that never runs the marker; doctor-setup.yaml:61 turns that into a PASS delivery leg and doctor-symlink-check.yaml:60 leaves the status unchanged",
      "disposition": "fix before merge",
      "findingClass": "class-of-bug",
      "scopeProof": "the exact-match test is the only membership test at hook-wiring-check.cjs:266; the old reader returned hook-missing for the same command",
      "affectedSurfaceHints": [".claude/settings.json UserPromptSubmit command", "doctor hook-wiring check", "doctor setup status", "doctor symlink status"]
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "severity": "P1",
      "workstream": "Normalize a long node flag to its name before the without-run guard, so the attached value form is rejected as a non-launch; add the attached case to the launch matrix."
    }
  ],
  "specSeed": [
    "State that the hook-wiring reader treats attached long-flag values (--eval=, --check=) and attached short flags (-e, -p) as non-launches."
  ],
  "planSeed": [
    "Test first: add a node --eval=0 <marker> case to tests/hook-wiring-check.test.cjs expecting exit 1 and hook-missing claude.",
    "Change runsNodeOnMarker to compare flag.split('=')[0] against NODE_FLAGS_WITHOUT_RUN and the argument-taking set.",
    "Rerun node --test on hook-wiring-check.test.cjs and node hook-wiring-check.cjs --root ."
  ],
  "findingClasses": ["class-of-bug"],
  "affectedSurfacesSeed": [".claude/settings.json", ".skilled/commands/doctor/scripts/hook-wiring-check.cjs", ".skilled/commands/doctor/assets/doctor-setup.yaml", ".skilled/commands/doctor/assets/doctor-symlink-check.yaml"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | File:line | Title | Disposition |
|----|----------|-----------|-----------|-------|-------------|
| DR3-P1-001 | P1 | correctness | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:266` | An attached node evaluation flag still reports the hook as wired | Active, fix before merge |

Evidence for DR3-P1-001: the reader advances over any word starting with `-` and only rejects an exact member of `NODE_FLAGS_WITHOUT_RUN` (`-c`, `--check`, `-e`, `--eval`, `-p`, `--print`, `-v`, `--version`, `-h`, `--help`). `node --eval=0 <marker>` therefore advances to the marker and returns true. The removed `startsCommand` reader returned `hook-missing` for the same command, so the change introduced the false pass. Counterevidence searched: no later guard re-tests the marker as an argument, and no test in `tests/hook-wiring-check.test.cjs` uses the attached spelling.

## 4. Remediation Workstreams

1. **P1, hook-wiring launch reader.** In `runsNodeOnMarker`, split the flag at `=` and test the name against `NODE_FLAGS_WITHOUT_RUN`; do the same for the argument-taking set so `--require=...` and `--conditions=...` advance by one. Add `node --eval=0 <marker>`, `node -e"1" <marker>` and `node -p"1" <marker>` to the non-launch matrix and keep the existing space-separated cases passing.
2. **P2 advisories.** None active. Do not re-open the docs, playbook, catalog or baseline work: iterations 2 and 3 verified it against the code and data.

## 5. Spec Seed

- Record the supported launch shapes of the doctor hook-wiring reader as a closed list that includes a quoted script, `env`, `env -u`, `node -r`, `bash/zsh -c`, subshell, brace group, `exec`, background first and a backslash continuation, and record that a node flag carrying its value in the same word is a non-launch.
- Keep the A10 wording rule: the first count in the detail is verified copies only, and `reported only` covers INFO entries the check did not grade.

## 6. Plan Seed

- One task: attached node flag in the launch reader, with a failing-then-passing test and a rerun of the seven existing launch cases.
- Out of scope: the four coordinator-left items, the other doctor routes that still carry `<timestamp>` placeholders, and the sealed holdout text.

## 7. Traceability Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | T031, T032, T033 match the embed engine and setup workflow; T034, T035, T044 and T045 match the two check scripts; T008 and T018 to T024 and T030 and T043 match their code pages. Only the attached-flag gap in DR3-P1-001 remains. |
| `checklist_evidence` | partial | CHK-FIX-005 claims the launch matrix and holds every space-separated row; it does not claim the attached flag form, which is the gap DR3-P1-001 names. |
| `skill_agent` | notApplicable | No agent definition changed. |
| `agent_cross_runtime` | notApplicable | No runtime mirror or cross-runtime agent surface changed. |
| `feature_catalog_code` | pass | The three `AdvisorRecommendationSchema` and two `AdvisorRecommendInputSchema` citations resolve; the two include-compiled-route checks exist exactly twice. |
| `playbook_capability` | pass | The playbook count, no-`NNN-*` rule, no-`CL-002` rule and hand-recorded persistence path all match the tree and the inventory suite. |

AC_COVERAGE: not assessed in this lineage. The dispatch forbids running `validate.sh`, so the advisory signal is left to the root synthesis; this is recorded as a scope limit, not a pass.

## 8. Deferred Items

- The four coordinator-left items in the pass-two tasks.md "Verifier follow-ups, coordinator" block stay out of scope by dispatch.
- The other doctor routes' `<timestamp>` placeholders (`_routes.yaml:72, 99, 506`) are unchanged and outside the changed lines.
- The `--eval` space-separated form is already rejected; only the attached form is deferred to the P1 workstream.
- The sealed holdout file was checked by `--numstat` only (0 added, 1 deleted); its prompt text was never read.

## Dimension Expansion Map

- Completed pivots: one per dimension (correctness, then traceability, then maintainability, then security).
- Failed pivots: none.
- Audited overrides: none.
- Swept directions: the changed shell shapes, doctor contracts, doc citations and doc-to-code paths.
- Remaining frontier: none for this narrow pass.

## 9. Search Ledger

- Correctness: read the complete reader diff, both check scripts, their tests and the removed reader; ran four single-file suites (28, 44, 39, 4 tests, all `fail 0`) and both check binaries.
- Traceability: read the embed engine's backup naming and restore failure output, the setup workflow, and the two contract suites; confirmed the holdout `--numstat` and the baseline recapture commit.
- Maintainability: read the six changed prose surfaces and the code each names; ran the playbook suite (2 passed) and the command-bridge field suite (24 passed).
- Security: walked the doctor assets that call both checks; confirmed neither check executes or interpolates the command string it reads.
- Ruled out: quoted `echo` scripts, unclosed quotes, `node --check`, space-form `node -e`, comment launches, shell scripts with their own `-c`, `bash -o pipefail -c` (pre-existing), the other routes' `<timestamp>`, the bridge README's optional fields, the playbook path convention, and any execution surface in the changed checks.

## 10. Audit Appendix

- Iterations: 4 of 4, all `complete`; newFindingsRatio 1.0, 0.0, 0.0, 0.0; convergence reached after the fourth iteration with all four dimensions covered.
- Findings: 1 new (P1), 0 resolved, 0 repeated.
- State: every iteration was recorded through `append-mode-event.cjs` (receipts at stream sequences 2 to 5) and the reducer refreshed the registry, dashboard and strategy after each one. `deep-review-state.jsonl` shows exactly four iteration records.
- Verdict: CONDITIONAL, because DR3-P1-001 stays active and no P0 exists.
- Scope limit: the dispatch forbids `generate-context.js`, `validate.sh` (including `--recursive`) and every git write, so no continuity save or strict-validation claim is made here; the lineage's completion contract is its own files plus the fan-out completion line.
- Conflicts recorded: none beyond the validate.sh scope limit above.
