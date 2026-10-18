# Iteration 5: Registering a user-owned surface packet

## Focus

Q2 part 2: add and register a user-owned sk-code surface in a fresh copy with Obsidian and Webflow removed, refresh routing, and compare it with OpenCode. The explicit dispatch focus takes precedence over the strategy file Next Focus, which points to Q5. Q2 was already checked at the whole-question level after iteration 4; this pass probes the registered custom-packet subcase.

## Actions Taken

- Read config, state, strategy, registry, dashboard, and prior iterations. Four iteration records were present; session identity: dr-025-luna-max-fast-2026-10-12T16:28:06.444Z.
- Built the prescribed external copy at /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i5.dHBY and removed both example packet directories there. The initial shell call yielded before exposing its exit status; a follow-up check exited 0 and confirmed .git/HEAD existed and both packet directories were absent.
- Added a minimal sk-code-myapp packet; manually changed mode-registry.json, hub-router.json signals and tieBreak, hub SKILL.md, root ROUTER.md, and discovery metadata. The copy tieBreak became quality, review, MyApp, OpenCode.
- Regenerated leaf-manifest.json and attempted compiled-manifest mint, then refreshed and checked freshness. Ran parent-skill doctor, compiled-route guard, fleet root-metadata check, canaries, advisor recommend, and three compiled-route prompts. compiled-route-sync --check was not retried because strategy marks it exhausted under this copy recipe.

## Findings

| Class | Claim | Evidence | Priority |
|---|---|---|---|
| DOC | A documented surface addition spans packet files, the one modes[] registry, router signals and a full tie-break permutation, stage-two ROUTER resources, hub discovery and human-facing metadata, and regenerated leaf metadata. | [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:305-327]; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:220-239] | P1 |
| BREAK | The minimal packet leaf manifest generated, but compiled-route-manifest mint refused the already-present activation manifest with causeCode=already-exists; the refresh command was then used for this existing-copy case. | COMMAND node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code exit 0: leaf-manifest.json written; COMMAND node .skilled/bin/compiled-route-manifest.cjs mint --hub sk-code --skill-root .skilled/skills/sk-code exit 1: causeCode=already-exists. | P1 |
| BREAK | Repointing the Webflow stage-two inventory to the tiny MyApp packet leaves unresolved paths; parent-skill-check reported 108 invariant failures in this copy. | COMMAND node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code exit 1: RRC-006 unresolved sk-code-myapp/references/javascript/... paths; final 108 invariant failures. Copy: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i5.dHBY | P1 |
| BREAK | The focused canary suite still expects the Webflow and OpenCode pair and fails after replacing the examples with MyApp. | COMMAND node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs .skilled/bin/tests/compiled-route-front-door.test.cjs .skilled/bin/tests/compiled-route-surface-hint.test.cjs exit 1: expected [sk-code-webflow, sk-code-skilled], actual [sk-code-skilled]. | P1 |
| BREAK | The compiled tie prompt did not expose both packets, so the winning surface remains unverified after refresh; current output: {"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-skilled","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-skilled"}],"effectivePolicyHash":"0c7fd2e14325b69529b96e66716f5706128def74aa78760001f3661d56f0508c","generation":2} | COMMAND node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "MyApp Python application with OpenCode system code" exit 0: {"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-skilled","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-skilled"}],"effectivePolicyHash":"0c7fd2e14325b69529b96e66716f5706128def74aa78760001f3661d56f0508c","generation":2}; copied tieBreak: sk-code-quality, sk-code-review, sk-code-myapp, sk-code-skilled. | P1 |
| OK | The advisor recommend command returned status=ok with no recommendations; nested surface modes remain metadata under one sk-code advisor identity. | COMMAND node .skilled/bin/skill-advisor.cjs advisor_recommend --json with MyApp query exit 0: status=ok, recommendations=[]; [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:58-59,110-117] | P2 |

## Options and Recommendations

| Option | What it changes, path:line | Cost | Risk | Cheaper move and why it fails |
|---|---|---|---|---|
| Recommended: retain explicit hub tieBreak; put each registered user surface before OpenCode in the external configuration. | .skilled/skills/sk-code/hub-router.json:7; parent-skill packet contract: parent-skills-nested-packets.md:222-230. | Low schema cost; authored registrations, stage-two paths, and generated manifests still need updates. | A partial edit leaves stale routes and canaries, as this copy showed. | --surface-hint is cheaper per call but is session-specific and fails as a persistent repository default; .skilled/skills/sk-code/SKILL.md:63. |
| Add numeric priority to mode-registry.json | New schema and compiler/doctor/test behavior. | High. | Creates a second ordering source. | Existing tieBreak already lists every registered mode. |
| Add native/fallback to OpenCode | New flag and compiler behavior. | Medium. | A binary flag does not order several custom surfaces. | Existing tieBreak handles any number of surfaces. |
| Derive order while minting | New priority metadata and generation policy. | High. | Minting must distinguish operator configuration from an external starter. | Authored tieBreak already expresses the required order. |
| Use --surface-hint globally | Reuses current per-call behavior. | Low code cost. | It cannot persist a default for the repository. | Keep it as a session preference only; it fails the stated persistent-order requirement. |

Rejected for now: a registry priority field, native/fallback flag, or mint-derived order adds machinery while the explicit tieBreak remains the cheapest source. Do not use --surface-hint for global precedence because it is per-call.

## Questions Answered

- Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface? Iteration 4 covered deletion and directory-only addition; this iteration extends Q2 to packet registration and precedence.

## Questions Remaining

- Q1: complete order and presence inventory.
- Q3: finish policy comparison after a fully integrated packet passes checks.
- Q4: prove the boundary between operator-local registrations and shipped defaults.
- Q5: finish doctor and onboarding guidance for replacement and scaffolding.
- Q6: complete the rejected-ideas pass.

## Edge Cases

- Focus conflict: dispatch selected Q2 part 2 while strategy Next Focus named Q5.
- Partial integration: the leaf manifest generated, but parent-skill-check and canaries failed on stale stage-two paths and fixture expectations.
- Route tie: unverified.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:305-327]
- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:220-260]
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20,61-114]
- [SOURCE: .skilled/skills/sk-code/hub-router.json:4-18,20-45]
- [SOURCE: .skilled/skills/sk-code/SKILL.md:32-40,55-74]
- Copy command outputs recorded above; copy path: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i5.dHBY.

## Assessment

- New information ratio: 0.8 (five of six findings add evidence about custom registration; the order recommendation extends prior evidence).
- Questions addressed: Q2 part 2.
- Questions answered: Q2 registered-packet subcase; tie winner unverified.

## Reflection

- What worked and why: leaf-manifest generation confirmed the packet inventory can be regenerated from the registry; doctor and canaries exposed separate hand-maintained integration surfaces.
- What did not work and why: mint refuses an existing activation manifest; broad Webflow-map substitution pointed MyApp routing at files the minimal packet does not contain.
- What I would do differently: author a narrow MyApp stage-two map from actual evidence files before rerunning parent-skill-check and canaries.

## Recommended Next Focus

Q3: compare explicit tieBreak with registry rank, native/fallback, mint-derived order, and --surface-hint after a complete custom packet passes parent-skill and route checks.

## SCOPE VIOLATIONS

None. All probe edits and deletions stayed inside the external copy.
