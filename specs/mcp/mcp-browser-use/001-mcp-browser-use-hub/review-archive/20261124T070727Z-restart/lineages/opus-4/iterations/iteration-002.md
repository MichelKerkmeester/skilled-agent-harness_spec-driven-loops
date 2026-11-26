# Iteration 002 - Security

## Dispatcher
- Lineage opus-4, session fanout-opus-4-1795495435655-lf6jf3, generation 1. steer.md absent.
- Dimension: security. Operator focus: every phase's shipped work against its goal criteria.
- Focus coverage: checked the shipped safety surfaces that the 004 (R-SEC-1/2/3), 006 (digest before first run, operator install yes), 007 (installer and doctor scripts at Aside parity, mutation guard) and 008 (signed-in runs record no page text, workspace or cookie name) goals promise.

## Files Reviewed
- .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:15-154
- .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:7-22,104-140,164-169
- .skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:30-75
- .skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md:40-66
- .skilled/skills/mcp-browser-use/mcp-bladebro/examples/attach-read.sh
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:2,74-78, doctor.sh:36
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/agent-task-session.sh:30-70
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:83-95,142
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:836-849, install.sh:235
- .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:43-72
- .skilled/skills/mcp-browser-use/*/benchmark/reports/** (evidence hygiene sweep)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (security slice): the Bladebro installer enforces R-SEC-3 as written: exact pin 4.8.2, macOS-only with recorded arm64/x64 digests, digest compared before the binary first runs, uninstall on mismatch or missing native package, existing installs never replaced (install.sh:17-22,96-103,121-139). BLADE_NO_UPDATE_CHECK=1 is exported in both scripts. Pass.
- Prior R2-P1-001 fix holds: the teardown reads the root from `bladebro doctor`, waits for operator confirmation and asserts `root absent` (uninstall-and-data-root.md:47-52).
- 008 evidence hygiene: an rg sweep for e-mail addresses, tokens, cookies, session ids, home paths and long numeric ids over every benchmark report folder printed no hit.
- `--account` appears only in documented direct-task forms; SKILL.md:142 forbids it on `aside mcp` / `aside repl` (R-SEC-1).
- Mutation manifest classifies all three hub installers as mutating and doctors as read-only; Bladebro doctor uses mktemp + trap cleanup and never writes .utcp_config.json (doctor.sh:120-121,169).

## Integration Evidence
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` (guard input for `/doctor:mcp`).

## Edge Cases
- `npm install -g` runs before the digest check. The packet records that v4.8.2 ships no postinstall script (install-and-verify.md:47, npm-install.md:15), so no package code runs before verification at the pinned version; adding `--ignore-scripts` would enforce it but the current state matches R-SEC-3's "before use". Not raised.
- `auto` rb lane attaching to any reachable endpoint (browser-lanes.md:56) and the Chrome `sudo npm` hint (install.sh:235) are the prior generation's deferred C2-I2-P2-003 and out-of-scope R2-P2-003; not re-raised.

## Confirmed-Clean Surfaces
- Bladebro install/doctor scripts, teardown scenario, Aside agent-task example (array-built argv, no eval), Bladebro attach example, benchmark evidence hygiene.

## Ruled Out
- Teardown `rm -rf` on an arbitrary BLADE_HOME: guarded by the step-2 `ls -la` plus operator confirmation before removal.
- `eval` in Chrome `_utils.sh verify_command`: called only with script-internal literal commands, no external input reaches it.

## Next Focus
- Dimension: traceability.
- Focus area: goal checkbox state, parent spec status and phase map, handoff table, implementation-summary claims against the shipped tree for each phase.
- Reason: correctness and security criteria hold; packet-doc state is the remaining goal-criteria surface.
- Rotation: correctness, security done; traceability, maintainability remain.

Review verdict: PASS
