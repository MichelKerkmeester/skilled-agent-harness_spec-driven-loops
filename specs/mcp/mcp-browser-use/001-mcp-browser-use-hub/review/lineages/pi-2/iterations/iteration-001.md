# Review Iteration 001 - mcp-browser-use hub

## Dispatcher

- Mode: review (LEAF, single iteration)
- Run: fanout-pi-2-1795511024070-2cuwlj, generation 4, lineageMode new
- Iteration: 1 of 7
- Dimension: correctness
- Artifact dir: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/pi-2`
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addresses it for one hub-level goal criterion: that `hub-router.json` and `mode-registry.json` route a request to exactly one mode (or an ordered bundle / defer), and that the compiled front door reproduces that policy.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/pi-2/review-scope-files.txt:1`
- `.skilled/skills/mcp-browser-use/SKILL.md:1-140`
- `.skilled/skills/mcp-browser-use/ROUTER.md:1-123`
- `.skilled/skills/mcp-browser-use/hub-router.json:1-190`
- `.skilled/skills/mcp-browser-use/mode-registry.json:1-120`
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1-40`
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1-10`
- `.skilled/skills/mcp-browser-use/description.json:1-30`
- `.skilled/skills/mcp-browser-use/graph-metadata.json:1-120`
- `.skilled/skills/mcp-browser-use/README.md:1-90`
- `.skilled/bin/compiled-route.cjs:1-52`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:1-157`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs:1-57`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md:118-210`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:3-41`

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The `reject` outcome is documented as reachable from the compiled front door, but the documented command has no way to supply the constraint that produces it** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/pi-2/review-scope-files.txt:1` (scope) via `.skilled/skills/mcp-browser-use/SKILL.md:62` -- `SKILL.md:62` tells the reader to act on four compiled decisions, "`route` loads its targets, `clarify` and `defer` ask, `reject` refuses", and `ROUTER.md:107` repeats it. The compiled router emits `reject` only when `input.constraints` contains `forbidden` (`.../010-mcp-browser-use/lib/router.cjs:107-111`), and constraints are the only source of a reject (a prompt that merely mentions the word Forbidden stays routable, per the comment at `router.cjs:107-108`). The front door the docs name, `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<task>"`, accepts only `--hub`, `--prompt`, `--prompt-stdin` and `--surface-hint` (`compiled-route.cjs:29-37`), and neither `compiled-route.cjs` nor the promoted resolver threads a constraint into `evaluateRoute` (no `constraints` reference in `014-runtime-engine/lib/compiled-route.cjs` or `resolve.cjs`). So in the documented CLI workflow `reject` can never arrive, and a reader who implements the four-arm switch implements one arm that is dead. This is a documented-behavior/implementation mismatch, not a wrong route: every route, orderedBundle and defer probe below produced the correct decision.
   - Finding class: doc-behavior-mismatch
   - Scope proof: both cited docs are in the pre-bound review scope; both cited router files are in the pre-bound review scope (compiled-routing library and hub skill tree).
   - Affected surface hints: `.skilled/skills/mcp-browser-use/SKILL.md`, `.skilled/skills/mcp-browser-use/ROUTER.md`, `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
   Case: a consumer follows `SKILL.md:62`, writes the four-arm switch, and then finds no CLI invocation, exit code or sentinel that yields `reject`; the arm is unreachable in the documented workflow and the doc gives no in-process alternative.
   ```json
   {"type":"claim-adjudication","claim":"SKILL.md:62 and ROUTER.md:107 document a reject outcome reachable from the compiled-route CLI, but the CLI cannot pass the constraints that are the only reject source.","evidenceRefs":["SKILL.md:62","ROUTER.md:107",".../010-mcp-browser-use/lib/router.cjs:107-111","compiled-route.cjs:29-37"],"counterevidenceSought":"Checked every flag compiled-route.cjs accepts (lines 29-37, 49-52), grepped the promoted runtime engine (compiled-route.cjs, resolve.cjs) for any constraints plumbing, and grepped the policy-card/card replay path; constraints exist only in the library API.","alternativeExplanation":"The compiled router's caller may be a library consumer that passes constraints directly, so the outcome is not dead code in the library, only undocumented from the CLI.","finalSeverity":"P2","confidence":0.82,"downgradeTrigger":"Confirms P2 or lower: this is reachable from no documented hub caller, so it is a doc/behavior gap, not a wrong decision. Would raise to P1 only if a shipped caller trusted the four-arm contract and dropped a required refusal."}
   ```

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `SKILL.md:58-62`, `ROUTER.md:22-24`, `router.cjs:101-131` | Hub router claims match the compiled router for route, orderedBundle and defer; the reject arm is the one claim without a producer (P2 above). |

## Integration Evidence

- `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<task>"` (the SKILL.md:62 / ROUTER.md:105 front door), nine probes:
  - "inspect the dom of the pricing page" -> `route` single `mcp-chrome-devtools`
  - "use aside and capture repl evidence on the billing page" -> `route` single `mcp-aside-devtools`
  - "automate the browser for me" -> `defer`
  - "check core web vitals on the landing page" -> `route` single `mcp-chrome-devtools`
  - "fill in the form in my signed-in session" -> `route` single `mcp-aside-devtools`
  - "set that aside for now" -> `defer` (the bare-aside exclusion at `hub-router.json:117` holds)
  - "run a lighthouse audit on the checkout page" -> `route` single `mcp-chrome-devtools`
  - "attach to the browser i have open and click through" -> `route` single `mcp-bladebro`
  - "use devtools and use aside on the same page" -> `route` orderedBundle [chrome-devtools, aside-devtools] (tie-break order at `hub-router.json:8-12`)
  - "chrome devtools and bladebro for the same task" -> `route` orderedBundle [chrome-devtools, bladebro]
- `.skilled/skills/mcp-browser-use/leaf-manifest.json` vs `ROUTER.md:59-76` RESOURCE_MAP: every stage-two path is present in the generated manifest for its packet (aside `references/aside-cli-reference.md`, `references/mcp-wiring.md`; bladebro `references/cli-reference.md`, `references/mcp-wiring.md`; chrome `references/cdp-patterns.md`, `references/session-management.md`, `feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md`, `assets/utcp-chrome-devtools-manuals.md`).
- `SKILL.md:36-46` capability matrix tool names vs `mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:17-28`: `lighthouse_audit`, `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight` match; `bdg console --list` and `bdg network har <path>` match `mcp-chrome-devtools/SKILL.md:207-210`.
- Registry/router alignment (`SKILL.md:122` "bidirectionally aligned"): `hub-router.json:52-78` routerSignals keys are exactly the three `mode-registry.json:36-112` modes, every `mode-registry.json` alias appears in the matching `hub-router.json` vocabulary class, and the two discovery-only classes are referenced by no mode signal (`hub-router.json:14-20`).

## Edge Cases

- Dispatch iteration number and the state-log-derived number agree (no prior `type:"iteration"` row before this one; gateway receipt sequence 1 is the run-open row).
- `steer.md` does not exist in this lineage, so no lead ruling applies to this iteration.
- The hub declares no `defaultMode` (`hub-router.json:6`), so a zero-score prompt defers rather than defaulting. This is intentional and was verified by probe, not treated as a gap.
- Cross-dimension observation deferred to its own dimension: `README.md:8` carries `version: 1.1.4.0` while the newest changelog is `v1.1.3.0.md`, and `README.md:68-72` lists only 1.1.1.0/1.1.0.0/1.0.0.0. That is documentation/version drift, recorded here as an edge case and reported under D4 Maintainability in a later iteration, not as a correctness finding.

## Confirmed-Clean Surfaces

- `hub-router.json` vocabulary classes vs `mode-registry.json` aliases: no alias is unreachable, no class is orphaned.
- `leaf-scopes.json` is a deliberate Chrome-DevTools-only narrowing (README.md:58 states it), not a missing entry for the other two modes.
- Bare "aside", "lighthouse", "har" and "rb" exclusions hold: "set that aside for now" defers.
- `graph-metadata.json` intent signals that `hub-router.json` deliberately does not score (for example "click through the ui") take the documented discovery-then-defer path, per `hub-router.json:14-20` discoveryClassesContract.
- No mode carries a dedicated slash command: nothing under `.skilled/commands/` binds `mcp-chrome-devtools`, `mcp-aside-devtools` or `mcp-bladebro` except doctor test fixtures and mutation-class manifests, which matches `mode-registry.json:23` (`command` is null on every entry).
- The advisor graph carries one `mcp-browser-use` identity and lists it under family `mcp`, matching `mode-registry.json:12-18` ("the advisor routes the single identity mcp-browser-use").

## Ruled Out

- "OrderedBundle never fires because the router sorts by score first": ruled out by probe; equal weight 4 and one distinct keyword per mode yields an equal score, and `router.cjs:88-92` keeps every mode within `ambiguityDelta` 1.
- "Compiled policy is stale against hub-router 1.1.3.0": ruled out; 1.1.3.0-era vocabulary ("core web vitals", "fill in the form in my signed-in") routes as authored, and the live decision carries `effectivePolicyHash fc55eafa...` with `generation 1`.
- "Capability matrix overstates the Chrome DevTools MCP surface": ruled out against the Lighthouse/trace leaf and the `bdg` console/HAR lines.

## Next Focus

- Dimension: security
- Focus area: the hub's mutation surfaces -- `mcp-aside-devtools/scripts/install.sh` and `doctor.sh`, `mcp-bladebro/scripts/install.sh` and `doctor.sh`, `mcp-chrome-devtools/scripts/install.sh`, `_utils.sh` and `doctor.sh`, plus `.skilled/scripts/git-hooks/pre-commit` and `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`.
- Reason: installers and hooks are the only surfaces in this packet that write outside a review-only process; the capability matrix promises that CLI installs are pinned and verifiable.
- Required evidence: file:line for each pin, digest check, privilege escalation and unquoted expansion.
- Rotation status: D1 correctness covered by this iteration; D2 next.

Review verdict: PASS
