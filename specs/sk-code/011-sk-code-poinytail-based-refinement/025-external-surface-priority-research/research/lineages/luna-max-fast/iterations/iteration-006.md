# Iteration 6: Persistent precedence for user-added surfaces

## Focus

Compare the existing surface-order mechanism with per-mode rank, a native/fallback flag, mint-derived order, and the existing --surface-hint path. The dispatch selects Q3 even though the reducer’s previous Next Focus named Q6. The explicit dispatch focus wins. Iteration 5 proposed tieBreak provisionally; this pass checks the compiler, runtime, doctor, and fixture contracts that determine whether that remains the cheapest option.

## Actions Taken

- Read the lineage config, state log, strategy, registry, dashboard, and iteration 5 before selecting the focus. The config supplies session identity dr-025-luna-max-fast-2026-10-12T16:28:06.444Z; five iteration records were present.
- Read the current mode registry and hub router, the sk-code compiled registry compiler and runtime, the surface-hint front door and resolver, the doctor tie-break checks, the canary fixtures and hint test, and the overengineering rule.
- Did not repeat the external-copy deletion probe. That probe belongs to the completed Q2 focus, not this Q3 comparison.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| ORDER | routerPolicy.tieBreak is the current persistent precedence source: the compiler copies it into routingModel.tieBreak, and the compiled scorer uses it to order equal scores. A custom surface can lead OpenCode for a matched tie by placing its registered mode before OpenCode in this list. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4-7]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:287-291] | P1 |
| OK | The doctor already checks the list as an exact permutation of registered modes and separately requires workflow modes before surface modes. A priority field would need new schema/compiler and doctor behavior or leave the existing list as a second authority. | [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1142-1156]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:6-20] | P1 |
| OK | --surface-hint is call-scoped: the front door forwards it, the runtime applies it after route evaluation, and the helper only reorders surfaces already in the targets. It cannot create persistent project precedence or add a surface the prompt did not match. | [SOURCE: .skilled/bin/compiled-route.cjs:47-59]; [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:97-107]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:248-260] | P1 |
| DOC | Existing tests and canary fixtures encode both behaviors that must stay distinct: no hint follows tieBreak, while a supplied matching hint moves that surface to the lead slot. These are the nearest existing assertions for any precedence change. | [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-90]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:117-175]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:101-134] | P1 |
| DOC | A registry rank or native/fallback flag is not present in the documented mode discriminator or in the compiler’s routing-model projection. Adding either would require changing the compiler contract and extending the doctor and tie/hint fixture coverage. | [SOURCE: .skilled/skills/sk-code/mode-registry.json:6-15]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088] | P2 |

## Options and Recommendation

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Recommended: keep explicit routerPolicy.tieBreak; put each registered user surface before sk-code-opencode in that repository’s list. | Existing value in .skilled/skills/sk-code/hub-router.json:7; compiler copies and uses it at .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266; doctor validates it at .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088,1142-1156. The change must keep the surface registration, router signal/resource and generated canary/manifest inputs aligned. | Lowest: change the existing precedence data and refresh the existing compiled outputs. | A tieBreak edit only orders modes already registered and matched; it does not scaffold a missing surface or make its signals/resources valid. | --surface-hint is cheaper per invocation, but fails as repository policy because it only reorders targets when the caller supplies a hint for a surface the prompt already matched. |
| Add a numeric priority/rank to each mode. | Add a field to .skilled/skills/sk-code/mode-registry.json:6-15 and consume it in registry-compiler.cjs:247-266; update doctor and tie/hint fixtures. | High: new field semantics, compiler plumbing, validation, fixtures, and likely dual-order cleanup. | It duplicates tieBreak unless that existing permutation check and every compiler consumer are replaced. | Editing the existing tieBreak does not fail for the current requirement; the added rank has no demonstrated second caller with a different value. |
| Mark OpenCode native or fallback and always sort it last. | Add a mode property in mode-registry.json:16-20,79-95 and sorting behavior in registry-compiler.cjs:247-266; update doctor, runtime and canary tests. | Medium to high: a new classification and ordering branch. | The flag can put all non-native surfaces ahead of OpenCode, but cannot decide order among multiple user surfaces; it also hardcodes a role distinction into runtime policy. | The existing tieBreak handles any number of registered surfaces in one explicit list, so the flag solves no observed gap. |
| Derive tieBreak when minting compiled manifests from registry order. | Replace the current projection at registry-compiler.cjs:259-266 and its composition-rule input at registry-compiler.cjs:335-339; update doctor and canary/hint snapshots. | High: compiler and artifact-generation behavior changes, plus new expected ordering rules. | mode-registry.json array order is not currently declared as precedence; deriving from it makes order implicit and can change on list reorganization. | Keeping the authored list does not fail; it already supplies the compiler and doctor with an explicit, checked order. |
| Use --surface-hint as the default. | Reuse .skilled/bin/compiled-route.cjs:47-59 and runtime handling at compiled-route.cjs:99-107; tests are in compiled-route-surface-hint.test.cjs:61-90. | Lowest code cost, but requires every caller to discover and pass a session surface. | Session hints are conditional, per-call and only reorder already matched surfaces. Missing hints retain the compiled tieBreak. | Nothing cheaper than this needs to be built, but it fails the requirement for a persistent repository default when a caller omits the hint. |

The recommendation is a repository-local tieBreak edit after the custom surface is fully registered. This is a repository-grounded judgment: the compiler and runtime already consume that order, and doctor already validates it. I would revisit a rank field only if two real callers need different precedence policies or maintaining the existing list becomes a measured recurring source of errors.

## Ruled Out

- A priority/rank field: the existing ordered list expresses the requirement without another schema and ordering source.
- A native/fallback sort flag: one flag cannot order multiple custom surfaces, while the list already can.
- Deriving order from registry-array position: the registry does not currently define that position as precedence.
- --surface-hint as the project default: it is conditional on each caller passing a matched surface hint.

## Dead Ends

None. This pass did not repeat exhausted deletion or route-sync probes from Q2.

## Edge Cases

- Ambiguous input: none. The dispatch focus names Q3 explicitly.
- Contradictory evidence: none.
- Missing dependencies: none for this source comparison.
- Partial success: none. This pass did not run tests; it mapped the tests and fixtures a follow-up implementation must update.

## Questions Answered

- Q3: How should a user-added surface outrank sk-code-opencode, and which option is cheapest at acceptable risk?

## Questions Remaining

- Q1: complete the order and installed-presence inventory across advisor, doctor, install guides and documentation.
- Q4: verify how operator-local registrations stay separate from a shipped starter that omits example surfaces.
- Q5: specify doctor and onboarding wording, including the supported surface-scaffolding path.
- Q6: complete the rejected-ideas pass.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-code/mode-registry.json:6-20,61-114]
- [SOURCE: .skilled/skills/sk-code/hub-router.json:4-7,20-46]
- [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266,335-339]
- [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:248-260,287-291]
- [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:117-175]
- [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:101-134]
- [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:97-107]
- [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:102-122]
- [SOURCE: .skilled/bin/compiled-route.cjs:47-59]
- [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-90]
- [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088,1142-1156]
- [SOURCE: .skilled/repo-rules/prevent-overengineering.md:43-65,94-100,117-119]

## Assessment

- New information ratio: 0.90 (four findings add direct runtime/compiler/doctor/fixture evidence beyond iteration 5; one refines its provisional recommendation).
- Questions addressed: Q3.
- Questions answered: Q3.
- Questions remaining: Q1, Q4, Q5 and Q6.

## Reflection

- What worked and why: reading the compiled router and doctor together showed the same authored list drives runtime ordering and an existing completeness gate; this grounds the recommendation in a real caller and contract.
- What did not work and why: a registry-only reading would miss that --surface-hint is a post-route reorder, not a precedence input.
- What I would do differently: the follow-up should inspect operator-versus-shipped data boundaries (Q4) before turning the configuration recommendation into a default-install policy.
- Scope and verification limit: this was source inspection, not test execution; the named tests and fixtures are impact evidence, not passing results.

## Recommended Next Focus

Q4: verify the boundary between operator-local registrations and the shipped starter configuration, because the recommended tieBreak value is per-repository data.

## SCOPE VIOLATIONS

None. Only this iteration narrative and delta were written inside the authorized lineage. The gateway will own the state-log append.
