# Iteration 1: sk-code hub surface inventory and ordering

## Focus

This pass maps the hub-specific portion of Q1: where the three surface packets are ordered or registered, how the hub describes their availability, and which process resources are stack-agnostic. The prompt's next focus names the hub itself, so compiled routing, doctor behavior, and deletion testing remain outside this iteration.

## Actions Taken

- Read the lineage config, state log, strategy, and findings registry. The lineage is new, the state contains only its config record, and the registry has no prior findings.
- Confirmed the iteration and delta files were absent before writing.
- Searched and inspected the hub router, mode registry, root skill docs, shared detection and README, leaf manifest, graph metadata, and the three surface plus two workflow packets.

## Findings

| class | claim | evidence: repo path:line | severity |
|---|---|---|---|
| ORDER | The explicit surface tie-break is OpenCode, then Obsidian, then Webflow, after the quality and review workflow modes. The skill says a matching session surface hint can lead a tie; otherwise the tie-break applies. | [SOURCE: .skilled/skills/sk-code/hub-router.json:7], [SOURCE: .skilled/skills/sk-code/SKILL.md:63], [SOURCE: .skilled/skills/sk-code/SKILL.md:74] | P1 |
| ORDER | Several inventories list Webflow, OpenCode, Obsidian instead: the hub skill's surface table and exact-three sentence, the registry surface array, the README, and the graph summary. The shared detector separately states OpenCode > Obsidian > Webflow > Unknown. These sequences may be display order rather than precedence, so their routing effect is unresolved. | [SOURCE: .skilled/skills/sk-code/SKILL.md:15], [SOURCE: .skilled/skills/sk-code/SKILL.md:36], [SOURCE: .skilled/skills/sk-code/SKILL.md:40], [SOURCE: .skilled/skills/sk-code/mode-registry.json:19], [SOURCE: .skilled/skills/sk-code/README.md:23], [SOURCE: .skilled/skills/sk-code/graph-metadata.json:282], [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:39] | P1 |
| PRESENCE | All three surfaces are registered as current packets. The hub router names resources for Webflow, OpenCode, and Obsidian; the registry lists the three surface entries; the leaf manifest has all three packets; and the advisor graph says the hub bundles three read-only evidence packets. | [SOURCE: .skilled/skills/sk-code/hub-router.json:31], [SOURCE: .skilled/skills/sk-code/hub-router.json:36], [SOURCE: .skilled/skills/sk-code/hub-router.json:42], [SOURCE: .skilled/skills/sk-code/mode-registry.json:19], [SOURCE: .skilled/skills/sk-code/mode-registry.json:61], [SOURCE: .skilled/skills/sk-code/mode-registry.json:79], [SOURCE: .skilled/skills/sk-code/mode-registry.json:98], [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:35], [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:114], [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:270], [SOURCE: .skilled/skills/sk-code/graph-metadata.json:282] | P1 |
| DOC | The hub skill says it has exactly three surfaces and names Webflow and Obsidian as members without calling either an example or optional. This frames them as the shipped set; the claim that this misleads external users is an interpretation of that explicit inventory. The router's phrase “such as sk-code-obsidian” is more open-ended, which leaves the two docs at different levels of extensibility. | [SOURCE: .skilled/skills/sk-code/SKILL.md:40], [SOURCE: .skilled/skills/sk-code/ROUTER.md:41], [SOURCE: .skilled/skills/sk-code/README.md:23], [SOURCE: .skilled/skills/sk-code/README.md:55] | P2 |
| OK | sk-code-review explicitly calls its baseline stack-agnostic. The shared layer labels its workflow doctrine and universal checklists surface-agnostic. sk-code-quality is a workflow mode that uses the shared surface router, then selects checklists for the detected surface, so its process is separate from surface evidence while its current inputs remain surface-aware. | [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:3], [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:13], [SOURCE: .skilled/skills/sk-code/shared/README.md:21], [SOURCE: .skilled/skills/sk-code/shared/README.md:38], [SOURCE: .skilled/skills/sk-code/shared/README.md:52], [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:15], [SOURCE: .skilled/skills/sk-code/mode-registry.json:18] | P2 |

## Questions Answered

No strategy question is fully answered yet. This iteration maps the hub-specific part of Q1; the broader Q1 inventory remains open.

## Questions Remaining

- Q1 remains open for compiled routing, canary fixtures, advisor scoring and batteries, doctor checks, install guides, the release note, and runtime behavior when packets are absent.
- Q2 through Q6 remain open.

## Next Focus

Inspect the remaining Q1 surfaces outside the hub packet: compiled-routing manifests and runtime, canaries, advisor sources, doctor checks, install documentation, and the v4.0.0.4 note. Then use the authorized throwaway copy for Q2 deletion and replacement-surface behavior.

## Ruled Out

None. No approach was tried and eliminated in this iteration.

## Dead Ends

None identified.

## Edge Cases

- Contradictory ordering evidence: explicit priority is OpenCode > Obsidian > Webflow, while several inventories list Webflow, OpenCode, Obsidian. The source text does not establish that those inventory sequences affect routing.

## Sources Consulted

- .skilled/skills/sk-code/hub-router.json:7,31,36,42
- .skilled/skills/sk-code/mode-registry.json:5,18-19,61,70-71,79,88-89,98,107-108
- .skilled/skills/sk-code/SKILL.md:15,36-42,63,74,139
- .skilled/skills/sk-code/ROUTER.md:26,30,37,41,602-609
- .skilled/skills/sk-code/README.md:23,55-57,74
- .skilled/skills/sk-code/shared/README.md:17,21-22,38,52-53
- .skilled/skills/sk-code/shared/references/stack-detection.md:3,16,28-30,39,42,45,53,65,77-83
- .skilled/skills/sk-code/leaf-manifest.json:35,114,270
- .skilled/skills/sk-code/graph-metadata.json:223-254,282
- .skilled/skills/sk-code/sk-code-review/SKILL.md:3,13-15
- .skilled/skills/sk-code/sk-code-quality/SKILL.md:15,27-29
- .skilled/skills/sk-code/sk-code-opencode/SKILL.md:2-18
- .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:2-42
- .skilled/skills/sk-code/sk-code-webflow/SKILL.md:2-22

## Assessment

- New information ratio: 1.0 (five of five findings are new in the initial lineage).
- Questions addressed: the hub-specific portion of Q1.
- Questions answered: none fully; full Q1 requires the remaining runtime, advisor, doctor, and documentation inventory.

## Reflection

- What worked and why: targeted repository search located the explicit tie-break and all three packet registrations, while the source reads separated runtime precedence from display inventories.
- What did not work and why: this focus did not test missing-packet behavior. That experiment belongs to Q2 and requires the external throwaway copy.
- What I would do differently: the next pass should enumerate the compiled route and doctor consumers before testing deletion, so each breakage probe has a source-backed expected result.

## Recommended Next Focus

Complete Q1's remaining source inventory for compiled routing, canaries, the advisor, doctor checks, install guides, and release notes.
