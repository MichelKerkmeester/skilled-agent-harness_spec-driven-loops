# Iteration 8: Typed resource-contract replay

## Focus
End-to-end resource contract resolution for the seven compiled-routing hubs, including the live replay parser, manifest identity, default resources, and the parent documentation's fleet-wide claims.

## Actions Taken
- Replayed the live router for `sk-code` with a task that selected both IMPLEMENTATION and DEBUGGING surface intents.
- Read `router-replay.cjs::buildResourceContract()` and its manifest cross-check path.
- Compared `sk-code/shared/references/smart-routing.md` default/resource paths with the committed `sk-code/leaf-manifest.json` mode-prefixed leaves and the filesystem.
- Rechecked the other six hubs with representative replay tasks; no equivalent unresolved contract was observed.
- Compared the affected runtime/reference files with commit `140266be3e`; the commit did not modify the `sk-code` router source, manifest, or the parent lines making the path/coverage claim.

## Findings

### P1: PRE-EXISTING — sk-code's live typed resource contract resolves no routed resources

Evidence: the live replay returns `resourceContractVersion: 1`, `pairs: []`, and seven `unresolved` raw paths for `sk-code` when the router selects IMPLEMENTATION and DEBUGGING resources. The resolver's contract code explicitly dual-reads each raw path and rejects any path not present under the declared manifest mode (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:235-261`). The source router emits unqualified defaults and shared paths at `.opencode/skills/sk-code/shared/references/smart-routing.md:317-322`, `:347-350`, `:399-409`, and `:411-417`, while the live manifest registers mode-qualified leaves such as `code-opencode/references/...` and `code-webflow/...` (`.opencode/skills/sk-code/leaf-manifest.json:4-72`). The four default paths are absent at the hub root, confirmed by filesystem checks; the router's own relative links to `./stack-detection.md` and `./phase-detection.md` are also unresolved (`.opencode/skills/sk-code/shared/references/smart-routing.md:17`, `:29`, `:40-41`). This contradicts the parent claim that sk-code paths are surface-prefixed and the seven-hub typed-pair contract is populated (`.opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122-124`, `:128-138`). The defect is PRE-EXISTING: `git diff 140266be3e^ 140266be3e` does not include the sk-code router/manifest or these parent lines.

## Questions Answered
- Parser success is not typed-contract success: the replay parses the router and selects intents, but all selected sk-code resources remain unresolved.
- The other six hubs' representative replays did not produce an equivalent unresolved contract, so this finding is scoped to sk-code.
- The issue predates the recent parent-document fixes and is not a NEW regression from `140266be3e`.

## Questions Remaining
- Does the final citation re-read preserve the P1 classification and distinguish this defect from the already reported parent-document contradictions?
- Are all ten iteration records, registry entries, and synthesis artifacts complete inside the lineage?

## Sources Consulted
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:235-261`
- `.opencode/skills/sk-code/shared/references/smart-routing.md:17,29,40-41,317-322,347-350,399-409,411-417`
- `.opencode/skills/sk-code/leaf-manifest.json:4-72`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122-138`
- Live `router-replay.cjs --skill .opencode/skills/sk-code --task 'review routing implementation and debug the compiled router'` output
- `git diff 140266be3e^ 140266be3e`

## Recommended Next Focus
Perform an independent final re-read of every finding's cited lines and commit classification, then verify the ten-iteration state, registry, resource map, and synthesis outputs.

## Ruled Out
- No fleet-wide manifest identity defect: the seven hub registry/router/manifest sets and check-only generation audit were clean.
- No equivalent unresolved typed contract was found in representative replays for the other six hubs.
- The finding is not based on a missing resource-list entry alone; it is based on the runtime's own `pairs: []` and `unresolved` output after manifest cross-checking.
