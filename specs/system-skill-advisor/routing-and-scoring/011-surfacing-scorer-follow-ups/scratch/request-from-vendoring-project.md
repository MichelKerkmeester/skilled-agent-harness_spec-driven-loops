Barter measured Skilled's skill and command surfacing on 36 Barter prompts and tuned its own overlays: top-1 went from 17 to 30, avoid violations from 10 to 0 and surfaced commands from 1 of 7 to 6 of 7, with the advisor suite unchanged at 2411 passed. What is left is scorer behavior that only Skilled can change. Each item below was traced in v4.1.0.0 by a read-only Opus 5.5 run and, where marked, re-checked by Barter.

1. **Command bridges match exact phrases only.** `explicit.ts:405-421` uses `hasPlainMention`, so "re-pin my vendored Skilled" surfaces `/doctor:overlay repin` at 0.8962 while "re-pin the vendored skilled tree" surfaces nothing (re-checked). Paraphrases such as "bring our skilled copy up to date with upstream" still miss after Barter's phrase overlays. Token-tolerant matching, or a phrase-variant generator, would close most of this.

2. **The wide-cluster floor drops a clear winner on short prompts.** Before Barter's fix, "commit my changes" scored sk-git at confidence 0.8258, yet returned nothing. The prompt has three tokens and no task intent, so `fusion.ts:1480-1484` treats it as low-information. `ambiguity.ts:100-109` then builds the cluster with `applyFloorException=false`, so two skills floored at 0.82 count as ties. With no phrase anchor (`fusion.ts:1496-1502`), every candidate gets uncertainty 0.42 (`scoring-constants.ts:211`), above the 0.35 cut-off. A rival that only reached the 0.82 floor should not be able to tie a real match.

3. **A command ranks below its skill even on an exact bridge match.** `fusion.ts:1421` subtracts 0.08, and `fusion.ts:1052-1075` orders the command after its owner. "link this project to ai-speckit" attaches `/doctor:symlink link` at 0.90 but stays second.

4. **Skill-name variants match inside hyphenated names.** `explicit.ts:393-396` reads the `speckit` variant inside "ai-speckit", so system-spec-kit wins any prompt naming Barter's repository.

5. **The `review` token boost catches ticket-status wording.** `TOKEN_BOOSTS.review` sends `sk-code` 0.85 (`explicit.ts:62`), so "move my clickup ticket to in review" goes to code review instead of mcp-tooling.

6. **Bridges are compiled in, so a vendoring project must run the deriver and rebuild.** The runtime reads the constant in `projection.ts:80` and `:1238`, not `command-bridges.generated.json`. A project that overlays `_routes.yaml` or `command-metadata.json` also has to regenerate three files and rebuild `dist/`. Barter added the deriver to its overlay manifest. Loading the JSON at runtime would remove that step for every vendoring project.

7. **Index staleness only hashes `graph-metadata.json`.** `advisor-status.ts:276-300` reports `fresh` after a `SKILL.md` keywords edit, although the keywords line feeds the `explicit_author` lane. Barter had to force `advisor_rebuild`.

8. **The CLI JSON has no per-lane scores.** `advisor_recommend --format json` returns `dominantLane` but not `laneContributions`, so diagnosing a routing result needs an in-process trace.

9. **The deep-research state log drops route-proof fields.** Each iteration's delta file carries `target_agent`, `resolved_route`, `agent_definition_loaded` and `mode`, but the state-log record keeps only `mode`, so a correct run fails the command's own route-proof check. Separately, a relative state-log path passed to `pre_dispatch_audit` resolves through a `.skilled` symlink and writes outside the packet.

Barter's corpus, scorer and before and after results are in `specs/skilled-barter-overlays/002-spec-tracks-restructure/035-barter-surfacing-alignment/scratch/` in ai-speckit, if a shared regression set would help.
