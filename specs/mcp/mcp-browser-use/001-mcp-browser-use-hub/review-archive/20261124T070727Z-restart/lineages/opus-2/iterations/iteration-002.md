# Iteration 002 — Security: install supply chain, signed-in profile rules, teardown

## Dispatcher
- Lineage opus-2, iteration 2 (state log held 1 iteration row). steer.md absent.

## Dimension
security

## Review Focus Coverage
Checked phase 004's R-SEC-1/2/3 goal criteria and phase 007's install-script parity against the shipped scripts, the prior generation's teardown fix (R2-P1-001), and the UTCP manuals phase 004 added for the Code Mode fallback.

## Files Reviewed
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:1-150`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:112-116` (R-SEC-1/2/3)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:30-75`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:20-80`, `doctor.sh:36`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:837-850`, `install.sh:230`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:83,89,142`
- `.utcp_config.json` (aside, bladebro, chrome_devtools_1/2/live manuals)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Bladebro installer runs npm lifecycle scripts before the digest gate it exists to enforce** -- .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:111 -- `npm install -g "bladebro@${PINNED_VERSION}"` runs without `--ignore-scripts`, so any install or postinstall hook in the package executes before the SHA-256 check at lines 130-138. The header (lines 5-9, 18-20) says an unverifiable binary "is the thing this wrapper exists to prevent", and R-SEC-3 (SKILL.md:116) says to verify the resolved native package "before use". The check also covers only the native binary; the JS launcher at `$(npm prefix -g)/bin/bladebro`, which is what runs at line 142 and on PATH, is never compared against anything. Reach is a tampered or substituted 4.8.2 tarball on the operator's configured registry; npm version immutability and the operator stop-for-yes keep this at hardening level.
   Finding class: supply-chain hardening gap against a stated security rule.
   Scope proof: install.sh:111 vs install.sh:130-138 ordering; SKILL.md:116.
   Affected surface hints: mcp-bladebro/scripts/install.sh, INSTALL-GUIDE.md install steps, R-SEC-3 wording.
   Case: a registry-served bladebro@4.8.2 whose package.json declares a postinstall hook runs that hook during install.sh line 111 even when the later digest check fails and uninstalls the package.

## Traceability Checks
- spec_code (pass for security surfaces): R-SEC-1 "never pass --account to aside mcp or aside repl" is reflected in Aside SKILL.md:89 and :142 and the examples README; the teardown playbook now reads the root from `bladebro doctor`, waits for operator confirmation and asserts `root absent` (uninstall-and-data-root.md:47-52), so the prior R2-P1-001 fix holds.

## Integration Evidence
- `.utcp_config.json` manuals carry `env: {}` for aside, bladebro and the three chrome_devtools servers; no secret values. chrome-devtools-mcp is pinned at 0.26.0.

## Edge Cases
- Aside's install.sh pipes the vendor installer (`curl -fsSL https://releases.aside.com/install.sh | bash`, line 78) with no pin or digest and honors `ASIDE_CLI_BASE_URL` from the environment. It is operator-invoked and the vendor's documented path; no goal or R-SEC rule covers Aside's install, so it is recorded here rather than as a finding.
- `verify_command` in chrome-devtools `_utils.sh:837` uses `eval "$cmd"` but has no caller in the scripts folder; unreachable today.

## Confirmed-Clean Surfaces
- Bladebro install refuses non-macOS and unknown arch, never replaces an existing install, never runs `npm update`/`bladebro -u`, and uninstalls on digest mismatch.
- R-SEC-2: `blocked:` is terminal in SKILL.md:114.

## Ruled Out
- Unconditional `rm -rf` of the Bladebro data root: fixed (playbook steps 1-6).
- Secrets in UTCP browser manuals: none.

## Next Focus
- Dimension: traceability
- Focus area: each phase's goal.md completion criteria against implementation-summary.md evidence and the parent spec status table; spec_code and checklist_evidence core protocols.
- Reason: operator focus is phase goals vs shipped work; parent spec.md shows Status Complete while the phase map marks 005 Partial and the 006→007 handoff row is TBD.
- Required evidence: goal.md criteria lines and the evidence each implementation-summary cites.

Review verdict: PASS
