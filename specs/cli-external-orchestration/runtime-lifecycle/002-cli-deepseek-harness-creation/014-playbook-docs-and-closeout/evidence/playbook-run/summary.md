# Manual testing playbook run summary

Run scope: all 25 indexed scenarios (the original categories and 14 stress scenarios). Each scenario's commands, exit codes, captured output, verdict, and reason are recorded in its adjacent `.txt` file. Provider-key checks were skipped where required because phase 013 keys are pending. No environment values were recorded.

| ID | Category | Verdict | One-line reason |
|---|---|---|---|
| CLI-001 | cli-invocation | PASS | Both isolated keyless routes returned their expected `MISSING_CREDENTIAL` result. |
| CLI-002 | cli-invocation | PASS | Dispatch-rule suite passed 50 tests; both repo-root refusal variants are present. |
| PAT-001 | patches | PASS | Saved captures show the expected provider/model rows, disabled telemetry, and clean dump exits. |
| PAT-002 | patches | PASS | Saved keyless capture shows `MISSING_CREDENTIAL` with no guard failure. |
| PAT-003 | patches | PASS | Saved captures show MCP row count 0→1 and stdio/node configuration; timeout field is absent from the saved excerpt. |
| MIR-001 | mirrors | FAIL | Skill and prompt mirror checks report missing generated outputs; agent mirror check passes. |
| GRD-001 | guards | PASS | Repo-guard suite passed all 37 tests. |
| GRD-002 | guards | PASS | Dispatch-rule suite passed all 50 tests. |
| FAN-001 | fanout | SKIP | Provider-key lineage and fanout execution are pending phase 013 keys. |
| MDL-001 | model-dispatch | SKIP | Gateway keyed route check is pending phase 013 keys. |
| MDL-002 | model-dispatch | SKIP | Endpoint string was checked; keyed OpenCode request is pending phase 013 keys. |
| EC-001 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-002 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-003 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-004 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-005 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-006 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-007 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-008 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-009 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-010 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-011 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-012 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-013 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |
| EC-014 | stress | PASS | Named hermetic test passed; its separate live provider confirmation is skipped pending phase 013 keys. |

## Counts

- PASS: 21
- FAIL: 1
- SKIP: 3 scenario-level verdicts
- Additional skipped substeps: 14 stress-scenario live confirmations, all pending phase 013 provider keys.

## Failure

**MIR-001 — generated mirror state is incomplete.** The skill mirror check reports missing `.dsh/skills/system-skilled-doctor`; the prompt mirror check reports missing `.dsh/prompts/doctor-overlay.md`; the agent mirror check passes. Read-only checks confirm both source files exist and the corresponding generated targets do not. The scenario is correct; the current code/worktree-side generated mirror state is wrong. This run does not confirm a sync-generator defect. See [mirrors__MIR-001.txt](mirrors__MIR-001.txt).

## Skip reason classes

- **Scenario-level (3):** FAN-001 requires a keyed lineage and fanout run; MDL-001 requires the gateway key; MDL-002 requires the OpenCode key for its live request. All are pending phase 013 keys.
- **Stress live confirmations (14 additional substeps):** EC-001 through EC-014 each have a hermetic test that passed, while the separate provider-backed confirmation is skipped pending phase 013 keys.

## Findings that did not change scenario verdicts

- The playbook root says patch scenarios read saved captures without launching `dsh`, while PAT-001 through PAT-003 scenario command sections list dump-config `dsh` commands. The saved-capture policy was followed; those dump commands were not run because the permitted keyless `dsh` shape does not include dump-config.
- PAT-003's saved composed-config excerpt omits `startupTimeoutMs`, although the source MCP patch sets it to `60000`. Formal row-count and stderr criteria pass; the saved capture leaves that field unverified.
