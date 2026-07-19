# Iteration 17: Namespace Migration and Compatibility

## Focus
Introduce coherent public creation names without breaking existing command consumers or internal routing.

## Findings
1. **Canonical public mapping:** `/interface:design -> workflowMode=interface`; `/interface:foundations -> foundations`; `/interface:motion -> motion`; `/interface:audit -> audit`; `/interface:design-reference -> md-generator`. Public language describes user intent; internal IDs stay registry-stable.
2. **Additive rollout:** add canonical commands first and test them. Keep existing `/design:interface`, `/design:foundations`, `/design:motion`, `/design:audit`, and `/design:md-generator` as thin compatibility aliases that forward the unchanged argument payload to the canonical command or shared template. This is justified backward compatibility because the current commands are shipped surfaces.
3. **Single source:** canonical command templates should share a small declarative contract or literal include pattern only if the command runtime supports it. Otherwise old routers remain tiny forwarders; never maintain two full prompt bodies. Internal `mode-registry.json` is unchanged.
4. **Deprecation evidence:** log alias usage if the runtime offers telemetry; announce canonical replacements in command descriptions; remove aliases only after a documented release window, zero/acceptable usage, and repository-wide reference migration. No immediate removal date should be invented.
5. **Parity gate:** for each alias/canonical pair, test argument preservation, selected `workflowMode`, stage/output contract, tool permissions, and downstream handoff. Add collision/discoverability checks for the new `interface` namespace and update documentation/search references atomically with implementation.

## Rollout Sequence
1. Add canonical commands and shared tests.
2. Convert old command bodies to forwarding aliases.
3. Migrate internal docs/examples and inspect command discovery.
4. Measure alias use and publish deprecation notice.
5. Remove only under an independently approved breaking-change packet.

## Ruled Out
- In-place rename/removal of shipped commands.
- Renaming stable internal workflow modes.
- Duplicating full templates under old and new paths.

## Assessment
- New information ratio: 0.39
- Novelty justification: Establishes additive aliases, a no-duplication migration sequence, deprecation evidence, and pairwise parity gates.

## Recommended Next Focus
Make proof and output labels machine-testable across all five canonical commands.
