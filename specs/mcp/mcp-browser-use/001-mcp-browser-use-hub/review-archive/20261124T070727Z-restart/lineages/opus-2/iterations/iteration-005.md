# Iteration 005 — Correctness (second pass): shipped install and doctor scripts

## Dispatcher
- Lineage opus-2, iteration 5 (4 prior iteration rows). steer.md absent. Convergence after iteration 4: CONTINUE (noStopCandidate, weightedStopScore 0.25).

## Dimension
correctness

## Review Focus Coverage
Phases 007 (Bladebro scripts at Aside parity), 011 (bdg port note) and 013 ("the fixed install.sh finds Chrome on macOS and logs CDP domains available: 53 for bdg 0.6.10") each shipped script behaviour as a goal criterion. This pass read those scripts against the version contracts the docs pin.

## Files Reviewed
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:15-150`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:25-35,88-106,255-270`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md:61`, `README.md:60`, `INSTALL-GUIDE.md:11,72,226`
- rg count of "0.6.10" across the Chrome DevTools packet (10 files)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **bdg installs from the floating `@alpha` tag while the packet documents and verifies bdg 0.6.10 behaviour** -- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28 -- `readonly MCP_PACKAGE="browser-debugger-cli@alpha"`, and SKILL.md:61, README.md:60 and INSTALL-GUIDE.md:11/72/226 tell readers to run `npm install -g browser-debugger-cli@alpha`. Ten files in the packet describe 0.6.10-specific behaviour (013's `--params` JSON form and "CDP domains available: 53", 011's `dom eval` port-9222 failure). The other two modes pin exactly (Bladebro `4.8.2` with a digest, chrome-devtools-mcp `0.26.0` in all 10 manual entries). When the alpha tag moves, a fresh install gets a bdg the docs were never checked against, and 013's criterion 3 stops being reproducible.
   Finding class: unpinned dependency against version-specific docs.
   Scope proof: install.sh:28; SKILL.md:61; rg "0.6.10" count.
   Affected surface hints: chrome-devtools install.sh, SKILL.md install line, README, INSTALL-GUIDE package rows.
   Case: once npm moves `browser-debugger-cli@alpha` past 0.6.10, running install.sh installs that newer build, and the 0.6.10 `--params` and port notes may no longer describe the installed CLI.

## Traceability Checks
- spec_code (partial): 013 criterion 3 (macOS Chrome detection, CDP domain count) matches install.sh:88-106 and :261-265, but its reproducibility depends on the unpinned tag (finding 1). 007's Bladebro doctor matches the install script's pin and digests.

## Integration Evidence
- Bladebro doctor.sh shares the pin 4.8.2 and both digests with install.sh (doctor.sh:18-20 = install.sh:17-22), and resolves the native package the same way the installer does.

## Edge Cases
- doctor.sh:91-97: when `bladebro --version` prints nothing and the digest differs, the warn branch says "as expected for " with an empty version instead of flagging the mismatch. Cosmetic; status stays 0 only for a binary that cannot report a version.
- doctor.sh:127-138 kills the probe subshell after 15 s; a `bladebro mcp` that ignores stdin EOF could outlive it. Not observed; recorded as an edge case only.

## Confirmed-Clean Surfaces
- macOS Chrome detection covers Chrome, Canary and Chromium app paths; domain count parsing guards with a numeric regex.
- Bladebro doctor is read-only: no install, update or data-root write.

## Ruled Out
- Doctor/installer pin drift for Bladebro: identical constants.

## Next Focus
- Dimension: security (second pass) or traceability cross-check
- Focus area: hub-level cross-mode claims, e.g. the Aside attach probe and Bladebro attach scenario from 008 against R-SEC-1 "attach whenever the browser must remain caller-owned".
- Reason: only P2 advisories remain; one more pass decides convergence.
- Required evidence: playbook scenario file:line.

Review verdict: PASS
