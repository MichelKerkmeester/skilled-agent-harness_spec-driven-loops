# Iteration 001 — Correctness: hub routing against goal criteria 2, 3 and 5

## Dispatcher
- Lineage: opus-2 (fan-out), session fanout-opus-2-1795495435655-lf6jf3, generation 1, lineageMode new.
- Iteration number derived from the state log: 0 prior iteration rows, so iteration 1. steer.md absent.
- Executor: this process (cli-claude-code, claude-opus-5-5), inline; no nested dispatch.

## Dimension
correctness

## Review Focus Coverage
Operator focus "every phase's shipped work against its goal criteria": this pass re-ran the parent goal's routing criteria live (criterion 2 registry counts, criterion 3 stale-path rg, criterion 5 per-mode two-stage routing) and checked the routing fixes that phase 013 and the prior review remediation claim shipped (the 403 Forbidden canary, own-Chrome lift).

## Files Reviewed
- `.skilled/skills/mcp-browser-use/mode-registry.json` (3 modes) and `.skilled/skills/mcp-tooling/mode-registry.json` (6 modes)
- `.skilled/skills/mcp-browser-use/hub-router.json`
- `.skilled/skills/mcp-browser-use/ROUTER.md:22-105`
- `.skilled/skills/mcp-browser-use/SKILL.md:30,45`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:1-157`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:230-260`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`
- `specs/.../001-research/research/research.md:14,162`, `specs/.../013-fix-alignment-findings-for-browser-hub-docs/spec.md:90,122`, `implementation-summary.md:95`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Caller-owned Chrome attach routes to Chrome DevTools while the hub contract gives caller-owned attachment to Bladebro** -- .skilled/skills/mcp-browser-use/hub-router.json:1 -- The `chrome-devtools-aliases` class carries "my own chrome", "signed-in chrome" and "logged in chrome", so `compiled-route.cjs --hub mcp-browser-use --prompt "attach to my own chrome and finish the checkout"` returns `route single mcp-chrome-devtools`. `SKILL.md:30` assigns "caller-owned browser attachment" to mcp-bladebro, and `research.md:162` lists "`rb attach` to a caller-owned browser that must stay open" as a Bladebro case. Phase 013 lifted own-Chrome attach toward Chrome DevTools deliberately (013 implementation-summary.md:95), but neither SKILL.md nor ROUTER.md records that "my own Chrome" now outranks the caller-owned attach rule, so the two documents disagree about who owns the same request.
   Finding class: doc-contract drift between routing vocabulary and hub mode table.
   Scope proof: hub-router.json `chrome-devtools-aliases` keywords; SKILL.md:30; research.md:162; live replay above.
   Affected surface hints: SKILL.md mode table row for mcp-bladebro, ROUTER.md intent notes, hub-router.json bladebro-workflow note.
   Case: the prompt "attach to my own chrome and finish the checkout" routes single to mcp-chrome-devtools although the hub contract names that request shape a Bladebro case.

## Traceability Checks
- spec_code (partial): parent goal criteria 2, 3 and 5 re-verified live. Registry counts 3/6 (`mode-registry.json` modes), criterion 3 rg pair printed no match (rg exit 1 on the mcp-tooling five-file check), and the advisor returned mcp-browser-use with the matching compiledRoute for one prompt per mode (bladebro 0.853, aside 0.888, chrome 0.95). One contract drift (P2 above).
- checklist_evidence: not run this iteration.

## Integration Evidence
- `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use` replayed all 14 unconstrained canary cases from `canary-cases.v1.json`: 14/14 match expected action and modes, including `chrome-devtools-http-403-forbidden`.
- `node .skilled/bin/skill-advisor.cjs advisor_recommend` (stage one) per mode, see spec_code above.
- Activation manifest policy hash `3c55ad21...` equals the hash the live router returns.

## Edge Cases
- Bare substring matching: "summarize the text beside the chart, set aside the rest" routes to mcp-aside-devtools at stage two. hub-router.json documents bare "aside" as deliberate because stage two runs only after stage one picks the hub; not reported.
- "take a screenshot of localhost:3000" defers at stage two and stage one picks local-webflow; no goal criterion covers bare screenshot phrasing.

## Confirmed-Clean Surfaces
- router.cjs `evaluateRoute`: reject now only on the caller constraint `forbidden` (router.cjs:107-110); prompt text "403 Forbidden" routes.
- Near-tie bundling with ambiguityDelta 1 and equal weights 4 only bundles exact score ties; tie-break order matches hub-router.json `tieBreak`.

## Ruled Out
- Prompt-text "forbidden" reject regression in the browser hub: fixed and canaried.
- Observed out of scope: sk-code's own compiled route returns `reject` for the 403 Forbidden prompt at stage one (advisor second recommendation). sk-code's router is not in this review's scope files, so it is not a finding here.

## Next Focus
- Dimension: security
- Focus area: mcp-bladebro safety rules (R-SEC-1/2/3), teardown and install scripts, Aside/Chrome scripts that shell out, secrets in UTCP config.
- Reason: risk order correctness → security; Bladebro acts in signed-in profiles.
- Rotation status: correctness covered at hub-routing depth; scripts not yet covered.
- Required evidence: file:line in scripts and playbooks.

Review verdict: PASS
