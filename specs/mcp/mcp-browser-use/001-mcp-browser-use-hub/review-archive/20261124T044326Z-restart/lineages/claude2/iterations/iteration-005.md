# Iteration 005 — Correctness (second pass): stage-one advisor routing and the feature-catalog overlay

## Dispatcher

- Lineage: claude2, sessionId `fanout-claude2-1795300286921-qfagh7`, iteration 5 of 5 (max-iterations stop)
- Dimension: correctness, as a cross-reference pass after all four dimensions were covered
- Operator focus coverage: this pass took the stage-one half of the "advisor routing at both stages" commit: the explicit and lexical lanes, the fusion lift, the compiled-routing cohort flag and the Python scorer. It ran the `feature_catalog_code` overlay on the new Lighthouse catalog entry, and re-read the P1 from iteration 1 at the documented front door, `compiled-route.cjs`.
- Sources: `steer.md` absent; strategy Next Focus from iteration 4.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:31-124` (merge-base diff)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` (diff)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:739-745`
- `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` (diff)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (diff)
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:1-60`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md:169-171`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/lighthouse-performance-audit.md:1-12`
- `.skilled/bin/compiled-route.cjs` (live run)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. C2-I1-P1-001 was re-verified at the front door SKILL.md:62 names: `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "why do my network requests return 403 Forbidden in chrome devtools"` returned `"action":"reject"` (exit 0). The finding stays active at P1.

### P2 Findings

1. **The Lighthouse and trace catalog entry cites a playbook that has no Lighthouse or trace scenario** -- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:47 -- The entry's "Validation And Tests" row points at `mcp-chrome-devtools/manual-testing-playbook/manual-testing-playbook.md` for "Code Mode scenarios for the MCP lane". A search of that playbook folder finds no Lighthouse or performance-trace scenario. The only Lighthouse scenario is hub routing MT-013 (`manual-testing-playbook/hub-routing/lighthouse-performance-audit.md`), which checks that the request lands on the mode and loads this catalog leaf. It never calls `lighthouse_audit` or the trace tools. The catalog's tool claims rest on a `list_tools()` fixture alone (each of the four tool names appears in `discovery-fixture-2026-07-16.json`), so the entry's central claim, that `lighthouse_audit` excludes performance and the trace tools supply Core Web Vitals, has no capability check.
   - Finding class: traceability / feature catalog to playbook
   - Scope proof: the catalog entry was added in the routing-and-surfaces phase on this branch.
   - Affected surface hints: `lighthouse-and-performance-trace.md` §3, `mcp-chrome-devtools/manual-testing-playbook/`, hub MT-013.
   - Case: the Chrome DevTools MCP changes `lighthouse_audit` to include performance; the catalog keeps telling agents to run a separate trace, and no playbook scenario fails.

## Traceability Checks

- `feature_catalog_code` (partial): every file the Lighthouse entry cites exists (`assets/utcp-chrome-devtools-manuals.md`, the discovery fixture, the two related catalog leaves, the playbook). The four tool names are present in the fixture, and `feature-catalog.md:169-171` links the entry. The validation row points at a playbook with no matching scenario (P2-001).
- `spec_code` (pass for stage one): every `mcp-tooling` browser alias in `explicit.ts`, `lexical.ts`, `fusion.ts` and `skill_advisor.py` now names `mcp-browser-use`. The Python `chrome devtools` / `browser console` phrases moved out of the `mcp-code-mode` group into a `browser` group that boosts both, and `compiled-routing-flag.ts` adds the hub to both cohort lists. This matches 005's routing plan. The Python `inspect` synonym shrinking to `["debug"]` explains 005 Known Limitation 5, which is recorded as an approved divergence.
- `skill_agent` (notApplicable): no agent references the hub in scope.

## Integration Evidence

- Live front-door run: `.skilled/bin/compiled-route.cjs --hub mcp-browser-use` with a 403 Forbidden prompt returned reject, the same as `resolve.cjs` in iteration 1.
- The advisor CLI was not run: it is daemon-backed and may write cache or telemetry outside the lineage directory. Stage-one claims rest on the diffs and on 005's recorded replays.

## Edge Cases

- Stage one now sends "browser automation" to the hub at weight 1 (`explicit.ts:124`), and stage two defers that phrase as discovery-only. The two stages agree: the hub is chosen, then asks which mode. This is consistent with SKILL.md:50, not a finding.
- No `aside` or `bladebro` entry exists in `explicit.ts`. 005 says stage one gets `use aside`, `run aside` and similar aliases from the graph metadata instead. That source was not opened in this iteration.

## Confirmed-Clean Surfaces

- No `mcp-tooling` browser alias is left in the four stage-one scorer files' diffs.
- `fusion.ts:742` lifts `mcp-browser-use` off the explainer floor only on devtools-specific vocabulary, so the same narrow regex carries over.

## Ruled Out

- A browser alias stranded on `mcp-tooling` at stage one: none in the diffs.
- Catalog entry citing missing files: all cited files exist.

## Next Focus

- Dimension: none (max iterations reached, synthesis next)
- Focus area: synthesis. Carry forward C2-I1-P1-001 as the one active required fix.
- Reason: stopPolicy max-iterations, 5 of 5 complete.
- Rotation status: all four dimensions covered, plus one cross-reference pass.
- Verdict basis: C2-I1-P1-001 remains active.

Review verdict: CONDITIONAL
