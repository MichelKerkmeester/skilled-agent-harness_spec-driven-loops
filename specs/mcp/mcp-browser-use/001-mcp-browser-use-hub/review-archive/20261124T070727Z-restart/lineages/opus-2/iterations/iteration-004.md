# Iteration 004 — Maintainability: hub and mode documentation consistency

## Dispatcher
- Lineage opus-2, iteration 4 (3 prior iteration rows). steer.md absent.

## Dimension
maintainability

## Review Focus Coverage
Checked the documentation that phases 005, 007, 008 and 013 shipped against their goals: ROUTER.md ↔ hub-router.json sync (005), version stamps and the `.skilled/changelog/mcp-browser-use/` topology (007), catalog and playbook counts (005 "totals 31", 007 "30 of 30", 008 "scenarios=15"), and 013's bdg 0.6.10 / Code Mode doc fixes. 008 also recorded the Aside live results that the finding below shows were not carried into every Aside doc.

## Files Reviewed
- `.skilled/skills/mcp-browser-use/ROUTER.md:40-70` vs `hub-router.json` (scripted keyword diff)
- `.skilled/skills/mcp-browser-use/{SKILL.md,mode-registry.json,hub-router.json,description.json}` version stamps; mode SKILL.md versions
- `.skilled/changelog/mcp-browser-use/` symlinks and latest entries
- `mcp-chrome-devtools/SKILL.md:226`, feature-catalog and playbook leaf counts for the three modes
- `mcp-aside-devtools/SKILL.md:145-147,202-205`, `README.md:187-189`, `feature-catalog/feature-catalog.md:122-142`, `feature-catalog/devtools-parity/console-and-network-capture.md:17-41`, `feature-catalog/devtools-parity/cookies-and-storage.md:19-33`, `manual-testing-playbook/manual-testing-playbook.md:35,47`, `changelog/v1.1.12.0.md:30`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Aside docs still teach `page.on(...)` capture and `page.context()` cookies after the live run proved both throw on the pinned version** -- .skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:147 -- SKILL.md:147 says "Console/network capture IS reachable through Playwright `page.on(...)` events in the repl", while the same file's table at :202-203 says `page.on` rejects those events on 1.26.626.1517 and :205 says `page.context()` is undefined. README.md:189 tells the reader to "Register `page.on('console', ...)` or `page.on('request', ...)`". feature-catalog.md:139-142 lists `page.on(...)` and `page.context().cookies()` / `addCookies()` as the call forms. The two devtools-parity leaves state the live failure (console-and-network-capture.md:19, cookies-and-storage.md:19) yet keep code blocks that call the failing APIs (console-and-network-capture.md:32-41, cookies-and-storage.md:29,33). changelog v1.1.12.0.md:30 says "Do not rely on" either API, so the shipped guidance contradicts itself.
   Finding class: doc drift after a live result.
   Scope proof: rg of `page.on(` and `page.context()` across the Aside packet.
   Affected surface hints: mcp-aside-devtools SKILL.md rules section, README FAQ, feature-catalog.md index rows, the two devtools-parity leaves.
   Case: an agent following SKILL.md:147 or README.md:189 calls `page.on('console', ...)` in `aside repl` on 1.26.626.1517 and gets the unsupported-event error instead of `page.console.logs()`.

## Traceability Checks
- feature_catalog_code (partial): Chrome DevTools catalog has 31 leaves and SKILL.md:226 says 31 features (005 criterion holds); Aside catalog index rows contradict the live result (finding 1).
- playbook_capability (pass): Chrome DevTools 30 playbook leaves (007), Bladebro 15 scenarios as manual-testing-playbook.md:20 says (008), Aside 29 scenarios as manual-testing-playbook.md:35 says.
- skill_agent (pass): hub SKILL.md, mode-registry.json, hub-router.json and description.json all read 1.1.1.0 and the parent changelog head is v1.1.1.0; mode SKILL.md versions (1.0.27.0, 1.1.12.0, 1.2.0.0) equal their changelog heads.

## Integration Evidence
- `.skilled/changelog/mcp-browser-use/{parent,mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro}` are symlinks into the skill changelog folders (007 topology), so there is one source per changelog.
- rg for `bdg cdp <Method> '{` (positional JSON) over the hub printed no match, so 013's fix holds; all 10 chrome-devtools-mcp pins read 0.26.0.

## Edge Cases
- ROUTER.md `CHROME_DEVTOOLS` lacks "chrome live manual" and "core web vitals" from hub-router.json; "lighthouse" and "performance trace" sit in ROUTER.md's `LIGHTHOUSE_TRACE` intent instead. The first two are the prior generation's R1-P1-001, downgraded to P2 and left unchanged by operator decision, so they are not re-raised.
- Top-level `await` in Aside catalog snippets runs inside `aside repl`, which accepts it; 013's "drop top-level await" applies to Code Mode blocks only.

## Confirmed-Clean Surfaces
- Version stamps and changelog heads agree across hub and modes.
- Catalog and playbook counts match the numbers in their docs.

## Ruled Out
- Changelog duplication between skill folders and `.skilled/changelog/`: symlinks, single source.

## Next Focus
- Dimension: correctness (second pass, all four dimensions covered)
- Focus area: shipped scripts and Code Mode examples against the bdg 0.6.10 and Bladebro 4.8.2 contracts (doctor.sh lane checks, chrome-devtools install.sh macOS Chrome detection from 013, Bladebro attach scenario from 008).
- Reason: dimension coverage complete; residual risk sits in executable scripts the doc passes only sampled.
- Required evidence: script file:line.

Review verdict: PASS
