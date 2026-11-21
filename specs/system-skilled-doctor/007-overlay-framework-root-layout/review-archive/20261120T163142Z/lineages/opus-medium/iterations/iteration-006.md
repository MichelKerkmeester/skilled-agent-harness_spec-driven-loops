# Iteration 006 - Frontier node F-1-004: security

## Dispatcher
- Lineage opus-medium, iteration 6 (5 prior iteration records). steer.md absent. Node F-1-004, dimension security.
- Review focus addressed: whether the changed doctor docs, workflow YAML and playbook steps introduce an unsafe command or path for old-layout and sibling-folder consumers (path safety in the operator-facing workflow, not only in the engine).

## Files Reviewed
- .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:60,76,107 (rollback path, setting resolution, engine call)
- .skilled/commands/doctor/overlay.md (rollback and relayout steps)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:96 (RUN_ID_PATTERN), :5340 (run id check)
- .skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/sibling-folder-relayout.md (mktemp-scoped steps)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (pass): the repin YAML's rollback path resolves `../<name>` against the tree root as createContext does (overlay-engine.cjs:480-483), and the engine call quotes `{run_id}` and validates it against RUN_ID_PATTERN before reading the run folder.

## Integration Evidence
- /doctor:overlay repin workflow, doctor-overlay-repin.yaml:76: lists `<overlay folder>/repin-runs/{rollback_run_id}/` with `find` before the engine validates the run id; read-only.

## Edge Cases
- The YAML's find listing runs on the operator's run id before RUN_ID_PATTERN applies. A run id holding `..` lists a folder outside repin-runs, read-only, then the engine refuses it at :5340. This listing predates the change; the change only added the sibling resolution. Not raised.
- resolveOverlayDir accepts a sibling name holding shell metacharacters (only '/', NUL and backslash are refused), and the YAML asks the agent to build a find command from that folder. The engine itself never shells out with it. Agent-side quoting is outside this target; recorded only.

## Confirmed-Clean Surfaces
- Playbook SKD-013 builds every path under `mktemp -d` and writes nothing outside it.
- No secret, token or credential path is introduced in the changed docs; the release note and overlays.md describe refusals, not bypasses.

## Ruled Out
- Run-id traversal reaching a write: the engine refuses before any read or write (:5340).

## Next Focus
- Dimension: security
- Focus area: F-1-006 Barter hooks and gates after the move
- Reason: frontier rotation

Review verdict: PASS
