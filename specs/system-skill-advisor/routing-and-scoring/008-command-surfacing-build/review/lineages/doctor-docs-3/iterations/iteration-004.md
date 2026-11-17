# Review Iteration 004

## Dispatcher

- Lineage: `doctor-docs-3`, session `fanout-doctor-docs-3-1794593402980-zhrui5`, generation 1.
- Mode: review, dimension `security`, budget profile `adjudicate`.
- Operator review focus: pass-three narrow review of the doctor-docs files changed by the pass-two remediation commits, each change judged against its task line and its callers. This iteration addresses the focus by walking the callers of both changed check engines, re-reading the carried P1 against its counterevidence, and auditing the changed surfaces for execution, path or secret exposure.
- Sources read: `doctor-setup.yaml:40,61`, `doctor-symlink-check.yaml:37,60`, `doctor-agents-md-check.yaml:34,54-58`, `doctor-agents-md-embed.yaml:48,74,110`, `doctor-agents-md-restore.yaml:42,62,95`, `doctor-agents-md-presentation.txt:71,268,284`, `hook-wiring-check.cjs:300-347`, `agents-md-check.cjs:1070-1080`, and the carried finding at `hook-wiring-check.cjs:264-269`.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:300-347` (caller surface: `main`, `inspect`, exports)
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:1040-1080` (export surface)
- `.skilled/commands/doctor/assets/doctor-setup.yaml:40,61` (caller: delivery leg)
- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:37,60` (caller: symlink route)
- `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml:34,54-58`
- `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:48,74,110`
- `.skilled/commands/doctor/assets/doctor-agents-md-restore.yaml:42,62,95`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The carried finding `DR3-P1-001` stays active: re-reading `hook-wiring-check.cjs:264-269` confirms that `NODE_FLAGS_WITHOUT_RUN.has(flag)` tests the whole token, so `--eval=0`, `-e"1"` and `-p"1"` never match, and the marker is then accepted as node's script word. The counterevidence searched is unchanged: no later re-test of the marker as an argument, and no test covers the attached spelling. Final severity stays P1 because the check's stated contract is to read the command the way a shell runs it, and the caller at `doctor-setup.yaml:61` turns the false `ok claude` into a PASS delivery leg.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The caller surface matches the changed behavior: both doctor routes read the check's printed lines and its exit codes, and neither parses the internal flag tables. |
| `checklist_evidence` | partial | CHK-FIX-005's matrix covers the space-separated forms only, which is the exact gap the carried P1 names; no checklist row claims the attached form. |
| `feature_catalog_code` | pass | Closed in iteration 3. |
| `playbook_capability` | pass | Closed in iteration 3. |

## Integration Evidence

- `doctor-setup.yaml:61` maps exit 0 to PASS and a `hook-missing` line to DEGRADED, so the false `ok claude` has a named consumer and a user-visible status effect.
- `doctor-symlink-check.yaml:60` maps exit 0 to an unchanged status and exit 1 to WARN, the second consumer of the same wrong result.
- `hook-wiring-check.cjs` holds no `spawnSync`, `execSync` or `exec` call: it parses the settings JSON and never runs the command string, so the reader adds no execution surface.
- `agents-md-check.cjs` exports `main` and its row helpers; the four doctor assets that call it read the printed rows and never parse the A10 detail's first number.

## Edge Cases

- A `--root` that names another checkout is still read-only: `inspect` joins the constant runtime file names onto the root and reads them, with no write path.
- The temporary-directory backup fallback is printed by the embed engine and consumed by the restore route as a path, not evaluated; no shell interpolation reaches it.
- The changed docs name no credentials, tokens or environment values that would expose a secret; `SKILL_ADVISOR_DEBUG` was removed from the setup router rather than added.

## Confirmed-Clean Surfaces

- No changed line in the doctor scripts executes, eval-loads or interpolates the shell command it reads.
- The two check engines keep their exported surface (`main`, `eventPayload`), so every caller keeps working.
- The A10 detail change has no machine parser outside its own test.

## Ruled Out

- A security finding on the reader is ruled out: it treats the settings file as data and never spawns a process.
- A caller regression from the A10 detail change is ruled out: the doctor assets render rows and read states, and no asset reads the detail's leading count.
- A path-traversal finding on `--root` is ruled out: the joined names are constants from the runtime table, and the check only reads them.

## Next Focus

- None: all four dimensions are covered, the convergence ratio is 0 for the last three iterations and the only open finding is the carried P1. Synthesis follows.

Review verdict: CONDITIONAL
