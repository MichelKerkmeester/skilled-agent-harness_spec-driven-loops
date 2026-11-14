# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-4`, pass four)
- Session: `fanout-render-hooks-plugin-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the seven rows of `review/review-scope-4.txt` for this area, plus the shared docs that state their contract.
- Operator review focus addressed this iteration: the brief's "docs that disagree with code" and the changed-test surface. This iteration read the three changed test files against the branches they pin, the plugin renderer module's split and its new dead-line comment, and the adapter README's mapper claim. It also rechecked the two carried findings for a regression in the changed tests. No new defect was found.
- Budget profile: `verify` (9 analysis actions)

## Files Reviewed

- `.opencode/plugins/lib/skill-advisor-render.js:1-159` — fallback directive, setup regex, compiled-route summary and digest, the new comment at `:111-117`
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:360-470`, `:519-607`, `:650-675` — renderer helpers, first-passing-row, top-only request and timeout cases
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:1-187` — policy, child, repeat and sanitizer cases
- `.skilled/hooks/shared/tests/session-readers/codex.test.mjs:1-155` — custom body, function arguments, containment and failure cases
- `.opencode/plugins/README.md:76`, `:157` — renderer module and mapper claims
- `.skilled/hooks/shared/session-readers/README.md:24-32` — reader contract and Codex body sentence
- `.skilled/skills/system-skill-advisor/README.md:121` — carried finding R4-P2-003
- `.skilled/hooks/shared/session-readers/codex.mjs:103-133`, `:142-192` — carried finding R4-P2-001
- `.opencode/plugins/system-skill-advisor.js:848-862` — carried finding R4-P2-002

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The two carried code/doc findings remain active; no new finding was found in the changed tests, the renderer module split or the adapter README claims.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | The two active P2s are the only spec/code gaps: the Codex contained-open contract and the head command under a failing row 0. The tests pin every changed branch they claim to cover. |
| `checklist_evidence` | core | notApplicable | Code pass; phase 021 tasks are the change record. |
| `skill_agent` | overlay | notApplicable | No agent definition changed. |
| `agent_cross_runtime` | overlay | pass | The renderer is shared; the plugin's top-only request matches the hooks; the child rule matches the spec-gate core; the Codex reader is the only reader with the unresolved-path read (finding R4-P2-001). |
| `feature_catalog_code` | overlay | partial | `advisor-recommend.md`'s top-only sentence remains the open phase 025 item; the changed tests and mapper claims agree with the code. |
| `playbook_capability` | overlay | notApplicable | No playbook surface changed. |

## Integration Evidence

- Dispatcher: `.skilled/commands/deep/review.md` owns the loop; this lineage writes only under `review/lineages/render-hooks-plugin-4/`.
- Append gateway: the iteration-2 receipt is `event-027859dd-1bcf-439d-a32c-cd637197e651`; the projection refreshed and the reducer reported 3 open P2, `corruptionCount: 0`.
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` owns the registry, dashboard and strategy anchors.
- Renderer module split: the plugin imports only `renderPluginFallbackDirective`, `SETUP_WORDING` and `FALLBACK_DIRECTIVE` from `lib/skill-advisor-render.js`; the compiled-route summary functions have no production caller (search returns only the test file), and the new comment at `:111-117` states that accurately.
- Test surface: the plugin test's first-passing-row case (`:519-553`) exercises the plugin's own parsing; the renderer's `doctor-brief-render` cases exercise the public renderer; the Codex test exercises both the custom-call and function-call shapes through `loadSession`.

## Edge Cases

- **A future typed-command companion.** `companionCommandLabel` reads the generated row's policy, not a recommendation's own policy; no producer today attaches a doctor-bridge companion with a differing policy. Recorded in iteration 2; unchanged.
- **A future enriched cache.** The prompt cache stores the un-enriched scorer output, so the route-option omission in the key is harmless today. If the cache ever stores enriched output, the key must include `includeCompiledRoute`, `compiledRouteTopOnly` and `surfaceHint`; recorded as a future risk, not a live finding.
- **A custom call with both `arguments: "{}"` and `input`.** The body would be dropped by the `??` chain; Codex's current schema carries only `input`. Recorded in iteration 1; no finding.
- **The plugin README's "shared by the advisor plugin and its tests."** The module is shared as a module; the compiled-route half is test-only today, and the plugin README does not claim the plugin calls it. No finding.
- **The `delays.includes(0)` timeout assertion.** It proves the SIGTERM timer is scheduled at the deadline minus the grace; `child.kills` still proves both signals were delivered. The case is robust to a busy machine, and no production branch is asserted away.

## Confirmed-Clean Surfaces

- The plugin's timeout test now asserts the scheduled timer values and the delivered signal pair, so a machine-load flake no longer masks a wrong grace (`system-skill-advisor.test.cjs:650-675`).
- The plugin's first-passing-row test asserts both the label and the two scores (`:533-534`), which is the exact wrong-result shape the old code produced.
- The renderer's companion tests cover the policy word, the child marker, the repeated head command and the next-bridge fallback (`doctor-brief-render.vitest.ts:61-116`).
- The Codex tests cover the custom body, the parsed function arguments, the outside-store refusal and the header-id precedence (`codex.test.mjs:28-155`).
- The mapper keeps `command`, `policy`, `ownerSkillId` and `needsMode` under the names `renderAdvisorBrief` reads; `kind` is not kept, but the plugin always passes the precomputed `ambiguous` boolean, so the renderer's `kind`-based re-derivation is not used (`render.ts:305-313`, `system-skill-advisor.js:626-632`).
- No changed file contains a holdout or prompt-corpus reference; the search is clean for a third pass.

## Ruled Out

- **The plugin's top-only request is untested.** `tests/system-skill-advisor.test.cjs:575-585` asserts the request key; `handlers/advisor-recommend-compiled-route-option.vitest.ts` asserts the handler behaviour. The remaining gap is finding R4-P2-002, not a missing test.
- **The compiled-route summary line is dead code that should be removed.** It is documented as intentionally kept for a future wiring at `lib/skill-advisor-render.js:111-117`; the plugin README says the module is shared, and the tests pin its behavior. No change request.
- **The codex reader's custom body is untested through `readSession`.** The projection is generic over a valid `arguments` object, and the existing pairing test covers the tool-call/result path; the raw loader test is the right level for the body shape. No finding.
- **The `parseCliResponse` first-passing selection duplicates the renderer's filter.** The two predicates use the same normalized threshold values (`normalizeThreshold` guarantees a number), and the plugin test pins the shared result. No finding.
- **The new `delays.includes(0)` assertion can pass without a timer firing.** `child.kills` is asserted as `['SIGTERM', 'SIGKILL']`, so the timer firing is observed. No finding.

## Next Focus

- Dimension: synthesis
- Focus area: compile the lineage report from the registry and the three iterations; no further code review.
- Reason: convergence reached with all four dimensions covered and three active P2 advisories.
- Rotation status: all four dimensions complete.
- Blocked/productive carry-forward: R4-P2-001, R4-P2-002 and R4-P2-003 are active.
- Required evidence: the reducer-owned registry, the three iteration files and their deltas.

Review verdict: PASS
