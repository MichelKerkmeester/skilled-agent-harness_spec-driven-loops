# Iteration 004 - Maintainability: release history and shared-code hygiene after 013

## Dispatcher
- Lineage opus-1, iteration 4, dimension maintainability. steer.md: not present.
- Review focus: checked whether 013's shipped work kept the hub's release history and shared helpers maintainable, the property later phases depend on (parent-skill-check version invariants, changelog coverage named by 007's goal).

## Files Reviewed
- .skilled/skills/mcp-browser-use/SKILL.md:5, mcp-*/SKILL.md:5 (versions)
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md:12-30 (and its diff in 1a350b1512b)
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/changelog/ (newest entry predates 013)
- `git show --stat 1a350b1512b` file list (36 chrome-devtools, 21 aside-devtools files)
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30,96-148; scripts/_utils.sh:159-171

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None new.

### P2 Findings
1. **013 shipped behavior changes without a version or changelog entry, and rewrote a released entry in place** -- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md:15 -- 011 released mcp-chrome-devtools 1.0.27.0 for the port note. 013 then changed 36 chrome-devtools files, including `scripts/install.sh` (macOS Chrome detection, Node 20 gate) and `scripts/_utils.sh`, and edited the v1.0.27.0 entry's body instead of adding 1.0.28.0. mcp-aside-devtools had 21 files changed by 013, including `SKILL.md`, `INSTALL-GUIDE.md` and its playbook, with no changelog entry at all; its newest changelog commit is 2026-11-22, before 013. parent-skill-check passes only because the version still equals the newest (rewritten) entry.
   Finding class: release-history drift.
   Scope proof: changelogs and SKILL.md versions are in scope; the file counts come from the 013 commit stat.
   Affected surface hints: mcp-chrome-devtools/changelog, mcp-aside-devtools/changelog, both SKILL.md and JSON routing version stamps.
   Case: an operator on chrome-devtools 1.0.27.0 from before 013 sees the same version after pulling 013 although install.sh behaves differently.

## Traceability Checks
- feature_catalog_code: pass for counts touched this iteration. 013 D3 keeps the chrome-devtools catalog at 31 features and no new port leaf was added (feature-catalog not grown in the 013 stat).
- spec_code: partial. 013's `_utils.sh` default change is redundant for install.sh, which passes `MIN_NODE_VERSION="20"` explicitly (install.sh:30, used at :315), so the parity break in O1-I1-P1-001 bought no behavior; reverting the default or syncing the Code Mode copy both close it.

## Integration Evidence
- Commit-level evidence: `git show --stat 1a350b1512b` (read-only).

## Edge Cases
- The changelog topology under `.skilled/changelog/mcp-browser-use/` (007) exists with parent and per-mode folders; per-mode entries for 013 were not checked line by line.

## Confirmed-Clean Surfaces
- Hub root and Bladebro versions match their newest changelog entries (parent-skill-check 13a/13b/13d, iteration 1 run).
- install.sh macOS Chrome detection covers Chrome, Canary and Chromium app bundles (install.sh:96-98).

## Ruled Out
- Version stamp mismatch across JSON routing files: parent-skill-check 13a passes.

## Next Focus
- Dimension: correctness (second pass, all four covered). Focus: compiled routing and hub-router behavior after 013's advisor lift and prior fixes (forbidden reject, canaries), and recorded playbook run tallies vs results.csv (008 criterion 1). Required evidence: file:line plus read-only command output.

Review verdict: CONDITIONAL
