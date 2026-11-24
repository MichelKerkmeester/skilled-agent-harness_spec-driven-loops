# Iteration 004 - Maintainability

## Dispatcher
- Lineage opus-4, session fanout-opus-4-1795495435655-lf6jf3, generation 1. steer.md absent.
- Dimension: maintainability. convergence.cjs before this iteration: CONTINUE (noStopCandidate; maintainability still uncovered).
- Focus coverage: checked whether the docs, examples and version metadata that 007-013 shipped still match the tools they describe and can be changed safely, against those phases' goal criteria (changelog topology, version parity, bdg/Code Mode forms, Aside REPL forms).

## Files Reviewed
- .skilled/skills/mcp-browser-use/SKILL.md and each mode SKILL.md `version:` against its latest changelog file
- .skilled/changelog/mcp-browser-use/ (topology from 007)
- .skilled/bin/compiled-route-sync.cjs --check output (served copies)
- .skilled/skills/mcp-browser-use/*/ docs mentioning call_tool_chain (Code Mode form)
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:25-29
- .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:4-12,60-71,160
- .skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:81; scripts/install.sh:21-22; scripts/doctor.sh:19-20
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/README.md:45-60,73,92; examples/repl-evidence-capture.sh:12-15
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md:17,48,53
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/008-live-runs-and-playbook-fixes/implementation-summary.md:140-147
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs/implementation-summary.md:130

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Aside example script still defaults its evidence folder to /tmp, a form its own README says fails on the current Aside** -- .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:12 -- `OUT_DIR="${2:-/tmp/aside-evidence}"` remains the default, and examples/README.md:51 annotates that invocation "fails on 1.26.626.1517". The playbook scenario was rewritten to the working form (repl-screenshot-artifact.md:17,48: write to `./tmp/` under the session folder and check with the REPL's `fs` inside the same evaluation) and verified live, but the shipped example was left on the broken default. 008's summary lists this as an open consumer (implementation-summary.md:142) and 013 did not take it up.
   - Finding class: stale example after a verified fix
   - Scope proof: one example script and its README row in mcp-aside-devtools/examples.
   - Affected surface hints: examples/repl-evidence-capture.sh default OUT_DIR and its PNG checks; examples/README.md section 2.2.
   - Case: an agent runs `./repl-evidence-capture.sh` with no arguments on Aside 1.26.626.1517; the REPL redirects the /tmp write into the session folder, the file is gone when the REPL exits, and the script's artifact check fails.

## Traceability Checks
- spec_code (maintainability slice): pass. Hub 1.1.1.0, Chrome 1.0.27.0, Aside 1.1.12.0 and Bladebro 1.2.0.0 each match their latest changelog file; 011's named Chrome version 1.0.27.0 matches; 007's .skilled/changelog/mcp-browser-use topology lists parent plus the three modes.
- feature_catalog_code: pass. The Lighthouse leaf tells the reader to confirm tool names with list_tools/tool_info instead of freezing a count.
- compiled-route-sync --check: all 8 hubs resolve; the one out-of-sync file is 007-sk-doc's registry-compiler.cjs, the same pre-existing failure the 006 summary records; no mcp-browser-use file differs.

## Integration Evidence
- `.skilled/bin/compiled-route-sync.cjs --check` (read-only).
- `.skilled/changelog/mcp-browser-use/`.

## Edge Cases
- The Bladebro digest constants live in both install.sh:21-22 and doctor.sh:19-20 plus three docs. They agree today. A shared source would cut the edit count on a version bump, but two script copies do not yet justify the abstraction; noted, not raised.
- Out-of-scope top-level await in mcp-code-mode and other mcp-tooling docs is 013's declared adjacent defect (implementation-summary.md:130), outside the hub; not raised.

## Confirmed-Clean Surfaces
- Version/changelog parity for all four SKILL.md files, Bladebro pin and digest consistency across scripts and docs, Code Mode call guidance in Chrome and Bladebro docs, compiled-routing served copies for this hub.

## Ruled Out
- Top-level await in hub Code Mode guidance: hub docs describe call_tool_chain usage without top-level-await code blocks.

## Next Focus
- Dimension: correctness (stabilization pass across all dimensions).
- Focus area: re-check the five P2 findings against current files and probe one more goal-criterion surface not yet exercised (012/013 alignment run artifacts and 009 sk-code router row).
- Reason: all four dimensions covered; one stabilization pass before stop.

Review verdict: PASS
