# Review Iteration 2 — correctness and traceability

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-2-1794570021136-noekp0`, generation 1, lineageMode new.
- Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/doctor-install-2`.
- Dimension: correctness and traceability. Budget profile: verify.
- Operator review focus: pass two of the command-surfacing review. This iteration verified the five pass-one check-engine fixes and read every changed line in `agents-md-check.cjs`, its test file and the scripts README. It addressed the docs-versus-code part of the focus for the AGENTS.md check and the runtime-copy rules for claude, codex, opencode, pi, devin and dsh, where each runtime's instruction copy is classified. No holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/scripts/agents-md-check.cjs:628-760` (A10 runtime copies, symlink and pointer verdicts, row detail), `:762-852` (A11 router, `parseTableRows`, `missingRows`), `:855-900` (A12 template purity)
- `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:524-600` (pointer wording, absent-path symlink, pointer-missing count), `:736-770` (malformed router row)
- `.skilled/commands/doctor/scripts/README.markdown:99-112` (the check and embed rows, the four-child claim)
- `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` (cross-read of the A10/A11 fixtures used by the check)
- Pass-one verification input: `review/review-report-pass-1.md:169-174` and `:283-294`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | The check's twelve rows were read against the pass-one fix rows; packet spec follows in iteration 4. |
| checklist_evidence | core | pending | No checklist row claimed in this iteration. |
| skill_agent | overlay | notApplicable | No skill or agent definition in this area. |
| agent_cross_runtime | overlay | partial | `hook-wiring-check.cjs --root .` reports claude, codex, cursor and devin wired; opencode, pi and dsh have no advisor hook entry and are skipped by design. |
| feature_catalog_code | overlay | pending | Scheduled for iteration 4. |
| playbook_capability | overlay | notApplicable | No playbook file in this area. |

## Integration Evidence

The check engine was run read-only against this checkout: `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root .` reported `STATUS=OK rows=12 findings=0 unknown=0`. Its owning test file `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` passed 44 of 44. The runtime-copy table was compared with the four prompt-hook files this repository actually carries.

## Edge Cases

- `parseTableRows` treats the first row after the table heading as the column header. A table with no header row would lose its first data row; every shipped router has a header, so the case is outside the current input contract. Recorded, not raised.
- A `CLAUDE.md` pointer is `INFO` when absent, not a failure. The count now prints `5/6 copies as expected, 1 pointer missing`; the row stays PASS, which is the pass-one decision.
- The `.codex/AGENTS.md` absent-only expectation is enforced for a symlink and for a regular copy; the symlink case now reads FINDING, the regular-copy case already did.

## Confirmed-Clean Surfaces

- DR1-P2-001 holds: `copyVerdict` checks `expectsAbsent` before the symlink pass at `agents-md-check.cjs:713-719`, and the new test reports `symlink where none belongs`.
- DR1-P2-002 holds: the pointer detail at `:740-742` reads `names AGENTS.md and carries no shipped line`, which is exactly what `namesRoot` proves.
- DR3-P2-001 holds: `pointerMissing` is subtracted from the expected count at `:650-653`, and the new test pins `5/6 ... 1 pointer missing`.
- DR5-P2-003 holds: `parseTableRows` keeps a width-mismatched row as an object at `:824`, and A11 prints `malformed trigger row at line N: X cells where the header has Y` before deciding FINDING.
- DR3-P2-004 holds: the README row and the module header both say four children and name the A12 manifest generator; `rowTemplatePurity` spawns `tools.generator --check` at `:875-884`.

## Ruled Out

- **A malformed router row still reads as missing** -- ruled out: the row is kept, `missingRows` still finds its rule cell, and A11 prints the malformed line with its line number and width (iteration 2, evidence: `agents-md-check.cjs:803-826`).
- **The pointer-missing count still includes the missing pointer** -- ruled out: `expected` subtracts `pointerMissing`, and the test asserts `5/6` (iteration 2, evidence: `agents-md-check.cjs:649-653`).
- **A symlink at an absent-only path still passes** -- ruled out: `expectsAbsent` is read before the symlink verdict and returns FINDING (iteration 2, evidence: `agents-md-check.cjs:713-719`).
- **The README still says three children** -- ruled out: both the row and the module header say four and name A12 (iteration 2, evidence: `README.markdown:102`).

## Next Focus

- Dimension: correctness and security
- Focus area: `hook-wiring-check.cjs`, `codex-hook-approval-check.cjs`, `doctor-symlink-check.yaml`, `doctor-runtime-mirrors.yaml` and their test files
- Reason: pass-one DR5-P2-001, DR5-P2-002, DR3-P2-002 and DR3-P2-003 live in the hook checks and the two workflow contracts; the new command matcher is the only changed parser with a false-positive history.
- Rotation status: first pass on the hook checks in this lineage.
- Blocked/productive carry-forward: the exit-3 route finding from iteration 1 stays open; the hook checks are a new surface.
- Required evidence: direct read of `runsMarker` and `collectCommands`, a real-repository run, and the owning test files.

Review verdict: PASS
