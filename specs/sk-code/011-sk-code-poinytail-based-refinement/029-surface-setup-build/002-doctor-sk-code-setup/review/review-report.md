# Deep Review Report: Doctor sk-code setup

Review of commit `79f5dacc52` on origin/main (diff `49cfd5c89f..79f5dacc52`, merged in `c5b3bd9355`): the read-only `/doctor:sk-code setup` command, its check script `sk-code-setup-check.cjs` with eight legs and a nine-case suite, the route row, workflow YAML and presentation, the command-contract router list, the index rows and the three reference lines.

## 1. Executive Summary

- **Verdict:** CONDITIONAL at synthesis, from reducer search debt only; PASS once the three debt items were closed by observed runs (section 9)
- **hasAdvisories:** true
- **Active findings at synthesis:** P0 0, P1 0, P2 11
- **Scope:** 16 files (13 in the commit, plus the phase `spec.md`, `goal.md` and `acceptance-criteria.md`), four dimensions, five iterations on cli-devin `deepseek-v4-1-flash-max`. Stop reason `maxIterationsReached` under stop policy `max-iterations`.
- Every finding is a P2 on the check script, its suite or the spec's file list. Five are fixed (`49554a1672` and the closeout spec amendment), and six are rejected with a reason below.

## 2. Planning Trigger

`/speckit:plan` is not required: the phase goal (C3) has every confirmed finding fixed or rejected inside this phase.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 0, "P2": 11 },
  "remediationWorkstreams": ["probe exit detail, FAIL-line cut count, header comment and three tests in 49554a1672", "spec Files to Change amended at closeout"],
  "specSeed": ["list the scripts README, tests README and command-contract.json in Files to Change"],
  "planSeed": ["none"],
  "findingClasses": ["instance-only", "class-of-bug", "matrix/evidence"],
  "affectedSurfacesSeed": ["sk-code-setup-check.cjs", "sk-code-setup-check.test.cjs", "scripts/tests/README.md", "spec.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | Evidence | Disposition |
|----|-----|-------|-----------|----------|-------------|
| R1-P2-001 | P2 | A hung leg blocks the battery forever | correctness | `sk-code-setup-check.cjs:76` | Rejected: no leg has been seen to hang, and every leg is a repository script the README battery already tells the user to run by hand, with no timeout. `spawnSync` gives each child a closed stdin, so no leg waits on input. A timeout would add a branch for a failure no environment shows |
| R1-P2-002 | P2 | A nonzero probe exit is reported as "printed no route decision" | correctness | `sk-code-setup-check.cjs:177` | Fixed in `49554a1672`: the detail is `the probe exited <status>`; test "a probe that exits non-zero is reported by its exit status" fails against the merged script and passes after |
| R1-P2-003 | P2 | The detail cap truncates FAIL lines while the repair says "each" | correctness | `sk-code-setup-check.cjs:155` | Fixed in `49554a1672`: a cut adds `... N more FAIL lines; rerun the command above for the full list`; test "more than ten FAIL lines are cut with a count of the rest" fails before and passes after |
| R1-P2-004 | P2 | Repair and diagnostic branches lack test cases | correctness | `sk-code-setup-check.test.cjs:107` | Fixed in `49554a1672` for the branch that carries a real repair: the root-metadata "is not built here" mapping to the provision command, plus the two changed behaviors. The constant sync repair, the malformed-JSON fallbacks and a multi-failure run are left out because none of them could fail for a reason the current cases miss |
| R2-P2-001 | P2 | Caller-supplied `--prompt` is rendered into report lines unsanitized | security | `sk-code-setup-check.cjs:138` | Rejected: the prompt comes from the operator who runs the command, every spawn is an argv array with no shell, and the real `STATUS` line is always the last line printed. A forged line in one's own report grants nothing |
| R2-P2-002 | P2 | Raw leg output is admitted into report lines without control-character filtering | security | `sk-code-setup-check.cjs:152` | Rejected: the finding states that no current leg echoes text the repository did not author. The legs are repository scripts that already run with the operator's rights. A filter for an unnamed source would be a fallback for a constraint that does not exist |
| R3-P2-001 | P2 | Spec Files to Change omits three files the change modifies | traceability | `spec.md:83` | Fixed at closeout: `spec.md` lists the scripts README, the tests README and `command-contract.json` |
| R4-P2-001 | P2 | Leg wiring invariants are implicit; a missing JUDGES entry crashes | maintainability | `sk-code-setup-check.cjs:319` | Rejected: the happy-path case runs every leg through `JUDGES`, so a leg without a judge fails the suite on the first run. A load-time check would test the module's own tables twice |
| R4-P2-002 | P2 | Header comment calls every leg a child process | maintainability | `sk-code-setup-check.cjs:15` | Fixed in `49554a1672`: the header names the provisioning precheck as the in-process leg |
| R5-P2-001 | P2 | Legacy-stub repair crashes the battery when the guard module is unavailable | correctness | `sk-code-setup-check.cjs:171` | Rejected: the guard is a tracked file in the same `.skilled/bin` the script ships with. The README removal recipe never touches it, and the legacy-stub case loads it on every suite run. The crash needs a hand-deleted tracked file |
| R5-P2-002 | P2 | The probe passes on any hub's route decision | correctness | `sk-code-setup-check.cjs:246` | Rejected: `compiled-route.cjs` routes only the hub named by `--hub` and echoes it (`compiled-route.cjs:68` for the stub). Probe runs on this tree printed `"hubId":"sk-code"` for a routing and a deferring prompt alike |

## 4. Remediation Workstreams

- Script and suite (`49554a1672`): R1-P2-002, R1-P2-003, R1-P2-004 and R4-P2-002, by one cli-devin dispatch. The tests README row went in the same commit through a second dispatch.
- Spec (closeout commit): R3-P2-001.

## 5. Spec Seed

- Files to Change names every file the build touched, the three convention files included.

## 6. Plan Seed

- None.

## 7. Traceability Status

- **spec_code (core): pass.** REQ-001 to REQ-005 each map to an artifact (iteration 3). The one gap is the change-surface table, R3-P2-001.
- **checklist_evidence (core): pass after synthesis.** Rows AC-001 to AC-005 were open at review time; the ledger rows S-1 to S-3 and the goal criteria close them in `implementation-summary.md`.
- **skill_agent (overlay): pass.** The command doc names sk-code and sk-code's `SKILL.md` names the command.
- **agent_cross_runtime (overlay): pass after synthesis.** The mirrors were deferred in iteration 3 (SL-007); `sync-runtime-mirrors.cjs --check` and the command catalog check exit 0.
- **feature_catalog_code (overlay): pass.** `command-contract.json` lists the command doc and its alias.
- **playbook_capability (overlay): not applicable.**
- **AC_COVERAGE:** advisory-shortfall at review time, since the acceptance rows were open; closed with the ledger.

## 8. Deferred Items

- None. Every finding is fixed or rejected above.

## Dimension Expansion Map

No divergent pivots ran (convergence mode `default`, stop policy `max-iterations`). Saturated directions: none recorded. Dimension coverage reached 4 of 4 by iteration 4; iteration 5 rechecked correctness.

## 9. Search Ledger

`hasSearchDebt: true` at synthesis, three items from iteration 3, each closed afterwards by an observed run:

| Item | Iteration | Bug class | Closed by |
|------|-----------|-----------|-----------|
| SL-007 | 3 | mirror_sync | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` and `command-catalog-mirror-check.cjs` exit 0 (goal criterion 4) |
| SL-008 | 3 | reference_line_root_readme | Goal criterion 4's grep prints 3: the root `README.md`, the sk-code `README.md` and `SKILL.md` each name `/doctor:sk-code` |
| SL-009 | 3 | goal_criteria_chain | All seven `goal.md` criteria rerun from the closeout state, recorded in `implementation-summary.md` |

## 10. Audit Appendix

- Convergence: graph convergence ran before each iteration as telemetry; stop policy `max-iterations` held the loop to five iterations. New-findings ratios: 1.0, 0.22, 0.17, 0.2, 0.2.
- Sources: the diff `49cfd5c89f..79f5dacc52`, the 16 scope files, and the neighbours each iteration read (`compiled-route.cjs`, the guard, the parent-skill check).
- Ruled out (iteration 2): command injection through `--prompt` or any leg argv, `SK_CODE_SETUP_ROOT` as a redirect, secret exposure, and code run by `require.resolve`.

### Core Protocols

- `spec_code`: pass. `checklist_evidence`: pass after synthesis.

### Overlay Protocols

- `skill_agent`: pass. `agent_cross_runtime`: pass after synthesis. `feature_catalog_code`: pass. `playbook_capability`: not applicable.
