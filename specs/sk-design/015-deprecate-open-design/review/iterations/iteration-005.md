# Deep Review Iteration 005

## Dispatcher
- Route proof: `Resolved route: mode=review target_agent=deep-review`
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus live references and the deprecation plan.
- Focus: traceability overlay protocols `feature_catalog_code` and `playbook_capability`.
- Budget profile: `verify`.
- Lifecycle: session `rvw-2026-08-10-deprecate-open-design`, generation `1`, lineage `new`.

## Files Reviewed
- `specs/sk-design/015-deprecate-open-design/plan.md:72-82,107-113`
- `specs/sk-design/015-deprecate-open-design/tasks.md:46-58`
- `.opencode/skills/system-deep-loop/deep-alignment/feature-catalog/feature-catalog.md:238`
- `.opencode/skills/system-deep-loop/deep-alignment/feature-catalog/adapter-contract/adapter-sk-design-live-render.md:19,25`
- `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-design-adapter.md:28`
- `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-design-live-render-adapter.md:24,51,122-124,174`
- `.opencode/skills/system-deep-loop/deep-alignment/manual-testing-playbook/discovery-and-adapters/sk-design-live-render-adapter.md:15,48-53,75-77`
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs:41-45,94,456-490`
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/coverage-integrity.test.cjs:522-545`
- `.opencode/skills/sk-design/feature-catalog/feature-catalog.md:67`
- `.opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:36,68,188,262,331-336`
- `.opencode/skills/sk-design/manual-testing-playbook/mode-routing/mcp-open-design-mode.md:3-6,29-64,79`

## Findings - New

### P0 Findings
None.

### P1 Findings

1. **Live-render playbook and catalog use a dispatch token the executable adapter rejects** -- `.opencode/skills/system-deep-loop/deep-alignment/manual-testing-playbook/discovery-and-adapters/sk-design-live-render-adapter.md:48-53` -- The documented render-result payload uses `"dispatchedThrough":"design-mcp-open-design"`, while the implementation defines the required exact boundary as `sk-design-mcp-open-design` at `scripts/adapters/sk-design-live-render.cjs:94` and rejects any other value at lines 488-495. Running the documented payload produced `dispatch-boundary-violation` rather than the claimed threshold finding; the companion coverage test uses the prefixed token at `coverage-integrity.test.cjs:526-538`, confirming the mismatch is in the catalog/playbook documentation, not an implementation ambiguity. The deep-alignment and sk-design catalogs repeat the abbreviated token (`feature-catalog.md:238` and `.opencode/skills/sk-design/feature-catalog/feature-catalog.md:67`). T027 says “deep-alignment: adapters, feature-catalog, playbook, scripts/adapters..., tests” (`tasks.md:53`) and T023 broadly says `sk-design feature-catalog/, manual-testing-playbook/, shared/` (`tasks.md:49`), but neither names the scenario/catalog files or requires a documented-token consistency check. This is a P1 traceability/capability defect because the current operator scenario cannot execute as its own expected PASS path and a broad removal task can leave inconsistent residue.
- Finding class: `cross-consumer`
- Scope proof: The exact token appears in the executable constant and rejection branch, in the playbook command/expected output, in both feature catalogs, and in the passing test's corrected payload; the targeted focus-file existence sweep confirmed all ten named surfaces are tracked.
- Affected surface hints: [`deep-alignment/manual-testing-playbook/discovery-and-adapters/sk-design-live-render-adapter.md`, `deep-alignment/feature-catalog/feature-catalog.md`, `sk-design/feature-catalog/feature-catalog.md`, `deep-alignment/scripts/adapters/sk-design-live-render.cjs`, `deep-alignment/scripts/tests/coverage-integrity.test.cjs`]
- Claim adjudication:
```json
{"type":"traceability","claim":"The documented live-render scenario claims a valid design-mcp-open-design dispatch token, but the executable adapter accepts only sk-design-mcp-open-design; the documented command therefore fails and the removal inventory lacks a token-consistency assertion.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-alignment/manual-testing-playbook/discovery-and-adapters/sk-design-live-render-adapter.md:48-53",".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs:94,488-495",".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/coverage-integrity.test.cjs:526-538",".opencode/skills/system-deep-loop/deep-alignment/feature-catalog/feature-catalog.md:238",".opencode/skills/sk-design/feature-catalog/feature-catalog.md:67","specs/sk-design/015-deprecate-open-design/tasks.md:49,53"],"counterevidenceSought":"Ran the documented CLI payload and inspected the executable rejection branch plus the companion test payload; the documented abbreviated token was rejected while the prefixed test token is the accepted form.","alternativeExplanation":"The abbreviated token may be intended prose shorthand, but it is embedded in an executable JSON payload and expected-output claim, so shorthand cannot explain the observed failure.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Remove/strip every transport scenario and catalog claim under T023/T027, or align any retained scenario payload to the executable constant and add a consistency assertion."}
```

### P2 Findings
None.

## Traceability Checks

| Protocol ID | Level | Status | Counts | Evidence | Finding refs |
|---|---|---|---|---|---|
| `feature_catalog_code` | overlay | `partial` | pass 3, partial 2, fail 0, total 5 | The adapter's discover/check behavior and threshold implementation are real (`sk-design-live-render.cjs:167-203,456-541`), but catalog claims use the unprefixed boundary (`deep-alignment/feature-catalog/feature-catalog.md:238`, `adapter-contract/adapter-sk-design-live-render.md:19,25`; `sk-design/feature-catalog/feature-catalog.md:67`). | P1-008 |
| `playbook_capability` | overlay | `partial` | pass 3, partial 1, fail 1, total 5 | All focus playbook files exist; discover and unavailable paths are runnable, but the documented measured command at `discovery-and-adapters/sk-design-live-render-adapter.md:50` produces a boundary-violation because code requires `sk-design-mcp-open-design` (`scripts/adapters/sk-design-live-render.cjs:94,488-495`). The sk-design mode-routing scenario remains an explicit transport-removal target (`mode-routing/mcp-open-design-mode.md:3-6,52-64,79`). | P1-008 |
| `spec_code` | core | `partial` | pass 7, partial 2, fail 0, total 9 | Existing P1-001..P1-007 remain active; T023/T027 name broad directory classes but omit exact path-level consistency and scenario assertions (`tasks.md:49,53`). | P1-001,P1-002,P1-003,P1-004,P1-005,P1-006,P1-007,P1-008 |
| `checklist_evidence` | core | `partial` | pass 0, partial 3, fail 0, total 3 | No new checklist evidence was claimed in this overlay pass; prior unchecked evidence requirements remain. | P1-004 |
| `skill_agent` | overlay | `pass` | pass 2, partial 0, fail 0, total 2 | Prior runtime/agent inventory remains the accepted evidence boundary; no new agent claim was needed for this focus. | |
| `agent_cross_runtime` | overlay | `pass` | pass 8, partial 0, fail 0, total 8 | Prior four-runtime parity result remains valid; no new parity defect found. | |

## Integration Evidence
- `specs/sk-design/015-deprecate-open-design/tasks.md:49,53` (T023/T027 broad removal scope).
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs:94,488-495` (exact runtime boundary and rejection).
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/coverage-integrity.test.cjs:526-545` (correct prefixed test fixture and receipt assertions).
- `.opencode/skills/sk-design/manual-testing-playbook/mode-routing/mcp-open-design-mode.md:52-64,79` (transport mode scenario and packet path to strip).

## Edge Cases
- T023 and T027 are directory-level inventories broad enough to include the named catalog/playbook/test files, so this iteration does not claim a separate missing path finding; the actionable defect is the absent exact-token consistency/removal assertion.
- The documented `discover` and no-render-result CLI paths execute against the current tree; only the measured example fails because of the token mismatch.
- No P0 was established: the mismatch causes a false negative/manual failure, not an exploit, auth bypass, or destructive data loss.
- Memory/code graph was unavailable; direct repository reads, grep, and live Node CLI execution were used.

## Confirmed-Clean Surfaces
- All ten requested focus files exist.
- `discover` returned URL and component-entry artifacts; no-render-result returned `render-unavailable`.
- The companion coverage test uses the implementation's exact prefixed boundary token.
- No review-target file was modified.

## Ruled Out
- No additional omitted deep-alignment catalog/playbook directory was proven beyond the broad T023/T027 scopes.
- No new P0 security or data-loss issue.
- No agent cross-runtime parity defect; prior pass carries forward.

## Next Focus
- dimension: traceability
- focus area: final cross-reference synthesis for exact transport-token consistency and complete removal inventory
- reason: overlay protocols were exercised; P1-008 is new and P1-001..P1-007 remain active
- rotation status: overlay pass completed conditionally in iteration 005
- blocked/productive carry-forward: productive — preserve P1-001..P1-008; do not retry exhausted approaches
- required evidence: corrected or removed live-render catalog/playbook files, explicit T023/T027 path inventory including mode-routing and shared test files, and post-removal residue proof

Review verdict: CONDITIONAL