# Iteration 002 - Security

## Dispatcher
- Lineage: claude2, session fanout-claude2-1795299580084-7g6zan, generation 1
- Dimension: security
- Review focus coverage: covered the trust surfaces that the hub-scaffold, mode-move and Bladebro commits added or edited: the new `bladebro` Code Mode manual, the mutation-class guard paths widened for the moved modes, the moved Chrome DevTools installer, the Bladebro install/pin/digest contract and its R-SEC rules, and the integrity guard for the newly live compiled hub.
- Sources: steer.md absent.

## Files Reviewed
- `.utcp_config.json` (diff: `bladebro` manual, stdio `bladebro mcp`, empty env)
- `.skilled/scripts/git-hooks/pre-commit:632` (trigger regex widened to `mcp-browser-use/`)
- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:124-134` (HOOK_PATTERN and DISCOVERY_GLOBS)
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:11-12,45,61`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh` (compared against the pre-move copy; the only change is the doc path at line 392)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:20-145`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:39-79`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:36-61`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/live-instance.md:17-23`
- `.skilled/bin/compiled-route-guard.cjs:55-58` (HUBS list), run read-only with `--json`

## Findings by Severity

### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- None new this iteration.

## Traceability Checks
- skill_agent: pass. Bladebro SKILL.md says Gate 2 reaches it only through the hub (`SKILL.md:156`), and the hub router's `bladebro-aliases` class is the only stage-2 entry point (`hub-router.json:150-158`).

## Integration Evidence
- `node .skilled/bin/compiled-route-guard.cjs --json` exited 0 with `mcp-browser-use: ok, fresh` and `failures: 0`. The live activation manifest matches what the current inputs compile to.
- The pre-commit trigger and `check-mcp-mutation-class.sh` HOOK_PATTERN use the same widened alternation `(mcp-tooling/|mcp-browser-use/)`, so the moved chrome-devtools and aside installers keep their manifest-row requirement. Bladebro ships no `scripts/` directory, so it needs no row.

## Edge Cases
- The `bladebro` Code Mode manual resolves `bladebro` from PATH with no version pin at launch. The packet answers this by making the install an operator stop-for-yes pinned to v4.8.2 with SHA-256 sidecar verification (`install-and-verify.md:47-51`), and by forbidding the `npx -y` launch form without operator approval (`mcp-wiring.md:61`). Recorded as accepted design, not a finding.
- The `forbidden` substring reject from iteration 1 is not a security control: it is a canary sentinel and trivially bypassed. Its severity stays tied to correctness.

## Confirmed-Clean Surfaces
- Installer move: content-identical apart from the printed doc path.
- Bladebro guardrails: R-SEC-1 (owned profile default, real-browser lanes only on explicit request, redact cookies), R-SEC-2 (stealth only operator-authorized, `blocked:` is terminal, no CAPTCHA evasion) and R-SEC-3 (pinned version, digest check, no implicit install) are each present and backed by ALWAYS/NEVER rules (`SKILL.md:112-145`).
- `chrome_devtools_live` touches only tabs it opened, by page ID, closed in `finally` (`live-instance.md:23`).

## Ruled Out
- Secret exposure in `.utcp_config.json`: ruled out. The new manual has `"env": {}`.
- Mutation-class guard blind spot for the moved modes: ruled out by the matching regex and globs.

## Next Focus
- Dimension: traceability
- Focus area: packet docs (root spec.md, decision-record.md, child 003-006 spec/tasks/implementation-summary/acceptance-criteria) against the shipped hub, the advisor routing changes (`skill_advisor.py`, `explicit.ts`, `lexical.ts`, `fusion.ts`, graph metadata) and the canary/benchmark evidence.
- Reason: rotation to D3.
- Required evidence: claims in implementation-summary or acceptance rows that the code or benchmark files contradict.

Review verdict: CONDITIONAL
