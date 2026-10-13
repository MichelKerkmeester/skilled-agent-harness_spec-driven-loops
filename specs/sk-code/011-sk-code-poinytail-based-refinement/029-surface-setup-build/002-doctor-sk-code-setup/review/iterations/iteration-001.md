# Deep Review — Iteration 001: Correctness

## Dimension

Correctness (D1 of 4) of the new read-only `/doctor:sk-code` setup battery: leg ordering and verdicts, repair lines, the provisioning skip gate, exit codes, and the probe's decision parsing in `sk-code-setup-check.cjs`, read against its nine-case suite and the route/workflow contracts that invoke it.

The review was read-only. The battery, its tests and `route-validate.sh` were not executed; every behavioral verdict below rests on a direct read of the target files and is labeled that way. No reviewed artifact carried instructions aimed at the reviewer; router-contract text was treated as data.

## Files Reviewed

| File | Scope read |
|------|------------|
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | full, 328 lines |
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | full, 208 lines |
| `.skilled/commands/doctor/sk-code.md` | full, 61 lines |
| `.skilled/commands/doctor/_routes.yaml` | full, 338 lines (route rows 220-234) |
| `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` | full, 60 lines |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md` | full, 184 lines |
| `.../002-doctor-sk-code-setup/review/deep-review-config.json`, `deep-review-strategy.md` | run state |

Not read this iteration (deferred; low correctness risk or owned by later dimensions): the presentation contract, the script and test READMEs, `.skilled/commands/README.txt`, `command-contract.json`, root `README.md`, sk-code `README.md`/`SKILL.md`, runtime mirrors, `goal.md`, `acceptance-criteria.md`.

## Findings by Severity

### P0 — none

### P1 — none

### P2 — 4

#### R1-P2-001 [P2] A hung leg blocks the battery forever

- Case: a leg's child process never exits — the drift guards blocked on a lock, or the probe waiting on a socket — so the battery never reaches `report()` and the operator sees no verdict at all.
- File: [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:76]
- Evidence: `spawnLeg` passes only `cwd`, `encoding` and `maxBuffer` to `spawnSync`; no `timeout` is set, so a hung child blocks the synchronous call indefinitely. Every other failure mode is normalized (a missing binary becomes status 1), but a hang produces no status, no output and no exit.
- User impact: the diagnostic appears frozen; the operator cannot tell a hang from a slow run and gets no repair line.
- Finding class: class-of-bug — all eight spawned legs share the single `spawnLeg` call site.
- Scope proof: `LEGS` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:89] routes every spawned leg through `spawnLeg`; only the provisioning precheck runs in-process.
- Recommendation: pass a per-leg `timeout` (e.g. 120 s) and map `result.error.code === 'ETIMEDOUT'` to a leg failure whose repair names the leg's rerun command.

#### R1-P2-002 [P2] A nonzero probe exit is reported as "printed no route decision"

- Case: the probe exits nonzero after printing a decision line (a crash after print, or a change in the front door's exit convention); the probe row reads "the probe printed no route decision" and the repair is only "rerun".
- File: [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:177]
- Evidence: `probeDecision` returns null whenever `status !== 0`, before it looks at stdout; the probe judge maps any null to that one detail [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:242]. The exit status never appears anywhere in the report.
- User impact: the diagnosis can be factually wrong, and the probe's exit code — the primary signal for a failing front door — is lost.
- Finding class: instance-only.
- Recommendation: branch the detail: nonzero exit → `exit <status>`; empty or unparseable stdout → "no route decision"; keep the rerun repair for both.

#### R1-P2-003 [P2] The detail cap truncates FAIL lines while the repair says "each"

- Case: a failing leg prints more than ten FAIL lines (the drift guards are the noisiest leg); the report shows the first ten and silently drops the rest.
- File: [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:155]
- Evidence: `failLines` applies `.slice(0, DETAIL_LIMIT)` with `DETAIL_LIMIT = 10` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:67] and adds no "… N more" marker; the drift-guards repair then says "fix each FAIL guard above" [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:222], which is false for the hidden lines.
- User impact: the operator can believe the visible list is complete; hidden failures resurface only after a rerun.
- Finding class: instance-only.
- Recommendation: when the slice drops lines, append a detail such as `… N more FAIL lines; rerun <command> for the full output`.

#### R1-P2-004 [P2] Repair and diagnostic branches lack test cases

- Case: a later edit breaks one of the untested repair mappings and the suite stays green.
- File: [SOURCE: .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs:107]
- Evidence: the nine cases cover the happy path (107), the custom prompt (116), the legacy probe (126), guard-with-fix (140), derived stale and errored (159, 167), the drift FAIL filter (174), the skip path (187) and the bad argument (203). No case drives: `root-metadata`'s "is not built here" → provision mapping [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:197]; the sync repair [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:218]; a `parent-skill` failure's detail filter; the malformed-JSON fallbacks for the guard and derived-freshness legs; the probe's non-legacy, non-route detail; or a run with several simultaneous failures.
- User impact: silent regressions in the repair text, which is the command's only actionable payload.
- Finding class: matrix/evidence.
- Recommendation: add cases for the listed branches, asserting the repair text and the `failed=`/`skipped=` counters.

## Traceability Checks

- `spec_code`: partial. REQ-001's route shape — target `setup`, `mutating: read-only` — is present at [SOURCE: .skilled/commands/doctor/_routes.yaml:220] and [SOURCE: .skilled/commands/doctor/_routes.yaml:225]; REQ-002's eight legs match `LEGS` and the workflow's leg list [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:49]; REQ-003's guard repair and legacy-probe failure are implemented at [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:203] and [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:239] and covered by cases at 126 and 140; REQ-004's provisioning repair and skip gate are implemented at [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:185] and covered at 187. Runtime execution (live tree, pristine copy, stale copy, unprovisioned clone) was not performed — read-only review; strategy §13 records the orchestrator's reproduction of the 8-PASS/STATUS=OK claim.
- `checklist_evidence`: pending — `acceptance-criteria.md` is deferred to the traceability iteration.

## Verdict

No P0 and no P1 findings. Four P2 advisories, all confined to the new battery script or its suite. The behaviors required by REQ-001 to REQ-004 are present in the code and, where the suite covers them, asserted by it.

PASS, advisories only (P2).

## Next Dimension

Security (D2), per the strategy's planned order: the argv → displayed-command rendering, the read-only claim (no filesystem writes on any path), and the trust boundary in how the battery parses the spawned legs' output.

## Scope Violations

None. All writes this iteration were confined to the review state files.

Review verdict: PASS