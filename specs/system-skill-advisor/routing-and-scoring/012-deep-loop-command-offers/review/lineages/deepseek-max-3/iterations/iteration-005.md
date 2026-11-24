# Review Iteration 005

## Dispatcher

- Mode: review; dimension `maintainability` (iteration 5 of 7), the last uncovered dimension.
- Operator review focus: traceability carried into the maintainability pass — the requirement seams that make a later change safe (REQ-007's generated contracts, REQ-032's refinement folding, REQ-046's rule-out and enrichment, REQ-048's strategy numbering, REQ-052's Next Focus projection), plus the two overlay protocols that apply to a spec-folder target.
- How this iteration addressed the focus: it verified the generated command contracts against their sources by hash, read the three reducer seams the last three REQs name, checked the hub's mode-registry discipline that the `skill_agent` overlay reads, and swept the advisor source for the one string the two gate layers both need.

## Files Reviewed

- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown` (generated headers, 15 and 16 `sourceDigests`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (`refinesSameLocation` `:1011`, `stripReviewVerdict` `:227`, `replaceAnchorSection` `:2420`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (`:79`, `:147`, `:196`), `lib/scorer/fusion.ts` (`:1055`, import block `:25`-`:35`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` (`:402`-`:406`)
- `.skilled/skills/system-deep-loop/SKILL.md` (`:16`-`:31`, `:103`-`:104`), `mode-registry.json`
- `.skilled/skills/system-deep-loop/manual-testing-playbook/mode-routing/review-routing.md` (presence and subject)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The doctor command string is declared twice, in the two layers that must agree about it** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:196` and `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1055` -- both files declare `const DEEP_LOOP_DOCTOR_COMMAND = '/doctor:deep-loop';`, and the value also appears as a table row (`command-attach.ts:79`, `:147`) and a projection row (`projection.ts:402`, `:406`). `fusion.ts` already imports a dozen symbols from `command-attach.ts` (its import block at `:25`-`:35` pulls in `isRunRefused`, `commandOnlyMentioned`, `commandRowFor`, `isNoEditRequest` and more), so the second copy could be an import rather than a re-declaration.
   Finding class: instance-only
   Scope proof: `rg -n "const DEEP_LOOP_DOCTOR_COMMAND"` over the advisor source returns exactly those two declarations; the remaining six occurrences of the literal are table or projection data, not constants. The duplication is load-bearing in one direction only: `fusion.ts` reads its copy at `:1083` (`typedCommandsIn(promptLower).includes(DEEP_LOOP_DOCTOR_COMMAND)`) to decide whether a typed doctor was asked for, and `command-attach.ts` reads its own at `:1596` for the gate's typed branch.
   Affected surface hints: ["command-attach.ts typed doctor branch", "fusion.ts withholdDeepLoopDoctorWithoutRun", "TRACKED_COMMANDS doctor row"]
   Case: a maintainer renames the command in `TRACKED_COMMANDS` and in `command-attach.ts`'s constant, and misses `fusion.ts`'s copy; `typedCommandsIn` then returns the new string, `includes('/doctor:deep-loop')` is false, and the fused layer withholds the doctor row on a prompt that typed it — a silent behaviour change with no test naming the second constant.
   Alternative explanation: two small constants in two modules is cheap, and the repository's own rule is that two instances are not yet a pattern. The finding survives that rule only because the two copies are read by two layers that answer one question about one prompt, and because the second module already depends on the first.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | `pass` | Carried complete. This iteration added the REQ-007 check the earlier passes could not make cheaply: both generated contracts carry a `sourceDigests` header, and recomputing `sha256` for all 31 listed sources (15 in `deep-review.contract.markdown`, 16 in `deep-research.contract.markdown`) matches every recorded digest, so the compiled contracts are regenerated from the current sources exactly as REQ-007 claims. REQ-032 resolves to `refinesSameLocation` (`reduce-state.cjs:1011`), whose comment states the same rule the requirement does. REQ-052 resolves to `stripReviewVerdict` (`:227`) ending the Next Focus section at the first `review verdict:` line. REQ-048 resolves to `replaceAnchorSection` (`:2420`), whose documented behaviour is that "an existing section keeps the ordinal the file gave it". |
| `checklist_evidence` | `pass` | Carried complete from iteration 4. |
| `skill_agent` | `pass` | The hub states the discipline at `SKILL.md:103`-`:104` ("resolve a mode through `mode-registry.json`; never hardcode a router mapping or packet path in the hub") and its mode table at `:30`-`:31` matches the registry's `research` and `review` modes with the packet path and the public command. `mode-registry.json` names its own drift guard (`routing-registry-drift-guard.vitest.ts`) and says the advisor keeps hardcoded projection maps in sync with the registry by that guard rather than reading the file on the hot path, which is the arrangement the SKILL.md describes. |
| `playbook_capability` | `pass` | The manual-testing playbook carries a `mode-routing/review-routing.md` and an `advisor-integration/` group; both name `/deep:review` as the surface under test, so the capability the packet changes is one the playbook covers. Their scenario preconditions were not read line by line this iteration. |
| `agent_cross_runtime` | `notApplicable` | The target is the advisor's offer packet; none of the 47 scope files is an agent definition, and the advisor's own agent mirrors are outside this packet's subject. `applicable: false`. |
| `feature_catalog_code` | `notApplicable` | No feature-catalog document mentions the deep-loop offer: `grep -rln 'deep-loop\|deep:review' .skilled --include='*catalog*'` prints nothing, so there is no catalog claim to check against the code. `applicable: false`. |

## Integration Evidence

- The generated contracts are a real seam, not a copy: each header names `compile-command-contracts.cjs` as `generatedBy` and lists every source path with its digest, so REQ-007's "regenerated from the edited sources" is verifiable by hash rather than by inspection. It holds for both contracts.
- The reducer's three seams each carry their rule in the function comment rather than in a changelog, which is what makes REQ-046, REQ-048 and REQ-052 readable at the place a maintainer would change.

## Edge Cases

- **`applied/T-*.md` does not exist in this packet**, so the resource-map coverage gate is skipped by the absent-map rule rather than by the `resource-map_present: false` alone. The packet has no `resource-map.md`, which the config records.
- **The playbook overlay was checked for coverage, not for scenario correctness.** Naming the two playbook files that own review routing is what the overlay asks for; reading each scenario's preconditions against the built tree was not done, and the status says so rather than implying a deeper pass.
- **Two instances of a constant is below the abstraction threshold by the repository's own restraint rule.** The finding above justifies itself on the two-layer agreement rather than on the count, which is why it stays P2.

## Confirmed-Clean Surfaces

- Both generated command contracts match every source digest they record (31 of 31), so the compiled artifacts are not stale.
- The hub resolves modes through `mode-registry.json` and declares its projection drift guard, which is the discipline the `skill_agent` overlay reads.
- `refinesSameLocation` (`reduce-state.cjs:1011`) folds a same-place refinement and keeps a different-file one, with the reason stated in the comment — REQ-032's rule at the place it is enforced.
- `stripReviewVerdict` (`:227`) ends a section at the first `review verdict:` line case-insensitively, so a Next Focus projection cannot inherit an iteration's verdict (REQ-052).

## Ruled Out

- *A stale compiled contract, the classic generated-artifact failure.* All 31 recorded digests match the current sources.
- *A hub mode table that hardcodes a packet path the registry does not carry.* The table and the registry agree for both modes.
- *Two candidate seams that would have made a fourth finding.* `replaceAnchorSection`'s ordinal rule and `stripReviewVerdict`'s cut both do what their requirements say, so nothing was filed against them.

## Next Focus

- Dimension: `correctness` (rotation)
- Focus area: re-read the three carried findings for decay and for the fix-completeness question a remediation needs, then take a fresh correctness angle the first pass did not use: the interaction between `attachCommand`'s stuck branch, `withholdDeepLoopDoctorWithoutRun` and the no-edit withhold when a prompt is both stuck and typed (REQ-029, REQ-044), and the `passed_threshold` ordering in `degradedRecommendations`.
- Reason: iteration 6 of 7; all four dimensions are covered, so the remaining passes rotate rather than break new ground.
- Rotation status: all four dimensions reviewed; `correctness` and `traceability` each need one rotation pass before the cap.
- Blocked/productive carry-forward: productive — reading a seam's own comment is the cheapest way to test a requirement about a reducer.
- Required evidence: `command-attach.ts` stuck branch, `fusion.ts` doctor withhold, `skill-advisor-cli.ts` `passed_threshold` filter, and the three carried finding ids.

Review verdict: PASS
