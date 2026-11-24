# Iteration 002 - Security: install, teardown and consent surfaces against their goals

## Dispatcher
- Lineage opus-1, iteration 2, dimension security. steer.md: not present.
- Review focus: checked the security-bearing goal criteria (004 R-SEC rules, 006 digest-before-run, prior-review P1 R2-P1-001 fix, 013 own-Chrome attach lift) against the shipped scripts and docs.

## Files Reviewed
- .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:112-116 (R-SEC-1/2/3)
- .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:17-154
- .skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:30-75
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:27-28,218-258
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:31-78
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:614-625
- review-archive/20261124T044326Z-restart/review-report.md:52-75 (prior advisories, for dedupe)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Bladebro installer runs npm lifecycle scripts before the digest check** -- .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:111 -- `npm install -g "bladebro@4.8.2"` runs without `--ignore-scripts`, so any install or postinstall script in bladebro or its platform package executes before line 130 compares the native binary's SHA-256. R-SEC-3 (SKILL.md:116) says to verify the digest "before use". The binary itself is not run before the check (good), but package scripts are. Whether 4.8.2 ships a lifecycle script was not checked (no network); the gap is the ordering.
   Finding class: supply-chain ordering gap.
   Scope proof: script and rule both in scope.
   Affected surface hints: mcp-bladebro/scripts/install.sh, references/install-and-verify.md.
   Case: a tampered registry tarball with a postinstall hook runs it during `npm install -g`, before the digest mismatch path uninstalls the package.
2. **The Chrome DevTools installer pulls bdg from the floating `@alpha` tag while 013 makes bdg 0.6.10 the source of truth** -- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28 -- `MCP_PACKAGE="browser-debugger-cli@alpha"` installs whatever alpha is current. 013's D1 pins every documented command and output shape to bdg 0.6.10, and its criterion 3 expects "CDP domains available: 53 for bdg 0.6.10". A later alpha can change flags the docs quote, and no digest or version gate exists, unlike Bladebro's pin. Distinct from prior R2-P2-003 (sudo hint).
   Finding class: unpinned dependency against a version-pinned doc contract.
   Scope proof: installer and 013 goal in scope.
   Affected surface hints: mcp-chrome-devtools/scripts/install.sh, mcp-servers/bdg-cli/README.md:24,43.
   Case: a new `browser-debugger-cli` alpha that renames `--params` is installed by install.sh; the 0.6.10-verified troubleshooting commands then fail.

## Traceability Checks
- spec_code: pass for security rules. R-SEC-1/2/3 text present (SKILL.md:112-116); installer pins 4.8.2 and checks the digest before running the binary (install.sh:130-145); teardown now reads the root from `bladebro doctor` and gates removal on operator confirmation (uninstall-and-data-root.md:46-48), so prior R2-P1-001 stays fixed.
- skill_agent: pass. The own-Chrome lift requires an explicit attach verb plus "my own/signed-in/logged-in chrome" (fusion.ts:623), consistent with 009 D2 (user's signed-in browser only when the user asks).

## Integration Evidence
- Advisor scorer surface: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:614-625 (read only, not executed).

## Edge Cases
- Aside's installer pipes the official curl installer to bash (aside install.sh:78). It is operator-invoked and documented as such; recorded as ruled out rather than a new finding.

## Confirmed-Clean Surfaces
- Bladebro platform gate refuses non-macOS and unknown arch (install.sh:81-90); existing install is never replaced (install.sh:94-103).

## Ruled Out
- Aside curl|bash installer: operator-invoked, documented, official URL.
- Prior R2-P1-001 teardown regression: not regressed.

## Next Focus
- Dimension: traceability. Focus: parent spec phase map, handoff table and status claims vs child implementation-summaries (005 Partial, 006->007 TBD row, 012 decision record, 013 deferred defects). Required evidence: file:line in spec docs.

Review verdict: CONDITIONAL
