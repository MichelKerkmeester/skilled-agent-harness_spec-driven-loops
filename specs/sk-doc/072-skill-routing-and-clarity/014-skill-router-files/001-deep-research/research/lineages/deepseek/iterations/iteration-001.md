# Iteration 1: Skill advisor alignment for a sibling ROUTER.md

## Focus

RQ-6 only: what inside `.skilled/skills/system-skill-advisor` (and the two surfaces outside it that carry copies of its contracts) must change or be checked when a skill's MACHINE ROUTER section moves out of `SKILL.md` into a sibling `ROUTER.md`. Six sub-questions were carried in from the strategy: freshness signature, SKILL.md discovery and parsing, skill graph and embeddings, leaf inventory, scorer lanes, hooks and plugin bridges plus the accuracy baselines.

## Actions Taken

1. Enumerated the skill tree and read `runtime/lib/freshness.ts` in full to establish the signature's exact inputs.
2. Read the Python discovery and parsing path in `runtime/scripts/skill_advisor_runtime.py`, then the graph compiler `runtime/scripts/skill_graph_compiler.py`.
3. Read the graph and embedding layer: `runtime/lib/skill-graph/skill-graph-db.ts`, `doc-frontmatter.ts`, and the stage-two lane set under `runtime/lib/scorer/lanes/` with `lane-registry.ts`.
4. Read `runtime/lib/derived/extract.ts` and `sync.ts`, then traced the derived authority outward to `sk-doc`'s `regenerate-skill-derived.cjs`, because `sync.ts` declares itself off the serving path.
5. Read the leaf inventory inputs: `leaf-manifest.config.json`, `leaf-scopes.json`, `leaf-manifest.json`, and the root-metadata contract pair in `sk-doc` that governs `ROUTER.md` presence and validation.
6. Read the hook and plugin surfaces: `hooks/claude/user-prompt-submit.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, `hooks/pi/prompt-advisor.ts` and its `.pi/extensions` symlink, and `.opencode/plugins/system-skill-advisor.js`.
7. Read the routing-accuracy baseline artifacts and drivers: `scorer-eval-baseline.json`, `score-routing-corpus.py`, `gate4`-less `gate3-corpus-runner.mjs`, `capture-scorer-eval-baseline.mjs`.
8. Ran a repo-scoped search for `MACHINE ROUTER` and for `router.md` inside the advisor package to test the negative claim that no advisor code reads the section.

## Findings

1. The freshness signature probes exactly two files per skill, `SKILL.md` and `graph-metadata.json`, and folds both into one hash; a `ROUTER.md` edit alone leaves the signature byte-identical, so `deriveFreshness` returns `live` against a graph that no longer matches the router. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:164] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:168] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:177-178] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:278-287]
2. The per-skill fingerprint loop is keyed on `SKILL.md` existing: `if (!skillMd) continue` skips the slug entirely, so a skill whose router moved out is still enumerated, but a skill whose `SKILL.md` were reduced to a stub or removed would vanish from `skillFingerprints` and from `maxSourceMtimeMs`. A fix therefore has to add `ROUTER.md` as a third `addSignaturePart` probe while keeping the `missing` marker, not replace the `SKILL.md` probe. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:162-179] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:131-137]
3. The mtime fallback in the same file is only reachable when no stored `sourceSignature` exists, and it compares `maxSourceMtimeMs` against the SQLite artifact; a moved router adds no mtime to that maximum, so the fallback path has the same blind spot as the signature path. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:290-298]
4. The OpenCode plugin bridge carries a second, independent implementation of the same signature, hashing `skill:<slug>:SKILL.md` and `graph-metadata.json` plus four `implementation:` paths, so a `ROUTER.md` probe has to be added in both places or the plugin and the daemon will disagree about whether the graph is live. [SOURCE: .opencode/plugins/system-skill-advisor.js:330-344] [SOURCE: .opencode/plugins/system-skill-advisor.js:142-156]
5. The daemon watcher never sees a `ROUTER.md` write: `discoverWatchTargets` pushes a `skill-md` target, a `graph-metadata` target, its derived key files, and optional doc-frontmatter targets, but no router target, so even a corrected signature would not be recomputed on the event that changed routing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:263-286]
6. Python-side discovery and parsing are router-blind by construction, which is why the move does not break them: `_discover_skill_files` joins `SKILL.md` and requires it to exist, and `parse_frontmatter_fast` reads the frontmatter block, then only the leading HTML comments, merging a `<!-- Keywords: ... -->` comment, and returns at the first content line, so the MACHINE ROUTER body was never in scope. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:211-228] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:52-104] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:84-96]
7. The Python record cache is invalidated by mtime and size of the discovered `SKILL.md` files only, so it also cannot see a `ROUTER.md` change; this is harmless only because the parser reads no router content, and becomes a defect the moment the parser is widened to read `ROUTER.md`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:232-241] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:316-319]
8. The graph compiler reads only `graph-metadata.json`: it discovers `graph-metadata.json` per skill directory and compiles from those, with no `SKILL.md` read anywhere in the file, so the compiled graph shape is unchanged by the move, and only the `derived` payload carried inside each metadata file could change. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:185-240] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:1087-1100]
9. Embeddings are description-only, so vectors are unaffected: `skillDescriptionForEmbedding` reads `SKILL.md` frontmatter `description` and nothing else, and that helper feeds the `skill_nodes.embedding` column at both write sites. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:704-711] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1305] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1399]
10. The doc-frontmatter harvest cannot pick up a root `ROUTER.md` either, because it walks only `references/` and `assets/` and is additionally gated off by default behind an env flag. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:170] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:42-46]
11. The leaf inventory is root-scoped, so a sibling `ROUTER.md` is not a leaf and the two generated artifacts stay byte-stable: `leafRoots` names five subdirectories and a root-level file is outside all of them, and `leaf-scopes.json` repeats the same root-scoped leaf list. The only leaf-side change is prose: the config's `_note` states the router is "the in-SKILL.md INTENT_SIGNALS + RESOURCE_MAP router", which goes stale the moment the router file moves. [SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.config.json:4] [SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.config.json:7] [SOURCE: .skilled/skills/system-skill-advisor/leaf-scopes.json:1-13]
12. `ROUTER.md` is already a governed root file, but only a hub's copy is validated: the metadata contract lists it in `METADATA_FILES`, requires it for the hub class, and does not forbid it for the standalone class, while the checker runs the root-router contract inside a `CLASS_HUB` guard. system-skill-advisor declares neither `mode-registry.json` nor `hub-router.json`, so it classifies standalone and a relocated `ROUTER.md` there would be neither required, forbidden, nor checked. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:46-55] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:75-108] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:688-694]
13. No advisor code parses the MACHINE ROUTER section. A package-wide search for that phrase matches only the section heading and the pointer sentence that announces it, and a search for the `router.md` filename inside the scoring runtime matches only the doc-file demotion rules, never a reader of the section. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:61] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:220]
14. No live scorer lane reads `SKILL.md` body text, and the five lane weights are stable inputs to any before/after measurement: the explicit lane scores `intentSignals` and `keywords`, the lexical lane scores name, description, domains, `intentSignals` and `keywords`, BM25 weights those same fields, the derived lane scores `derivedTriggers` and `derivedKeywords`, and the semantic-shadow lane scores `description`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9-15] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:68-75] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:361] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts:62] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:207] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/bm25.ts:60-77]
15. The explicit lane already treats `router.md` as a doc filename in both the doc-file suffix guard and the write-verb doc list, and the Python scorer mirrors it, so the new filename needs no lane change and a prompt like "edit ROUTER.md" is already demoted out of skill mention. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:230] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:314] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3019-3021]
16. The one real accuracy hazard is an alias, not a file read: `'smart router'` is hard-mapped to `sk-code` at 0.65 in the explicit lane, so a migration-shaped prompt that names the machine router can be captured by the code hub before the advisor's own vocabulary is consulted. This has to be replayed against the corpus rather than reasoned about. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:187]
17. Derived extraction does read the whole body, code blocks included, but its writer is off the serving path and the fleet producer preserves curated fields, so the committed `derived` block does not move unless someone re-runs the deprecated extractor. Reading the body feeds headings, body ngrams and code-block ngrams into the buckets, and `SKILL.md` enters `sourceDocs`, `keyFiles` and the provenance dependency set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:162-174] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:205-217] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:228-238] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts:93-99] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:5-19]
18. The hooks carry freshness, never content: the Claude hook and the CLI-fallback helper both read `freshness` out of the advisor envelope and branch on `live`/`stale`/`absent`/`unavailable`, and the Pi extension is a symlink to the hook file inside the skill, so there is one Pi source to change, not two. [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:395] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:314-368] [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:315]
19. The three quoted accuracy numbers are a reproducible baseline, not a survey: they are recorded with the exact corpus, holdout and ambiguity sha256 values, the empty-database and filesystem-projection environment, and the capture commit, so the migration can be measured as a delta against the same inputs rather than re-argued. The recorded values are 155/195 at 0.7949, 49/66 at 0.7424, and 19/24 at 0.7917 with tau 0.03. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-46]
20. The corpus driver runs the Python scorer as a subprocess rather than an in-process API, so any change to discovery or frontmatter parsing shows up as a baseline movement, while a pure `ROUTER.md` move does not. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:27-35]
21. The stage-two replay that already reads a root `ROUTER.md` enumerates hubs only, so a standalone skill's relocated router would be replayed by nothing; whether a standalone skill is allowed a root `ROUTER.md` at all is a policy question the root-router contract's own header reserves for parent hubs. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:320-330] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:7-19]

## Questions Answered

- RQ-6.1: the signature hashes two files per skill, so a `ROUTER.md` edit leaves a stale graph looking `live`; the fix is a third probe in `freshness.ts` plus a watcher target and the plugin's duplicate signature.
- RQ-6.2: discovery requires `SKILL.md` and parsing stops at the first content line, so no parser change is needed to survive the move, and a parser change would be needed to read the router.
- RQ-6.3: the compiler indexes `graph-metadata.json` only and embeddings are description-only, so neither the graph nor the vectors move.
- RQ-6.4: the leaf inventory is root-rooted so the manifest and aliases stay stable, the config's `_note` goes stale, and a standalone root's `ROUTER.md` is unvalidated because the root-router check is hub-guarded.
- RQ-6.5: no lane reads body text, keywords comments or router markers; the exposure is the `'smart router'` alias and a re-run of the deprecated derived extractor, not a lane.
- RQ-6.6: hooks consume freshness only, the Pi extension is a symlink, the OpenCode plugin duplicates the signature, and the baselines are hash-pinned and re-capturable; the fixes are the two signature sites, the watcher target, and a before/after capture.

## Questions Remaining

- Whether a standalone skill may legally own a root `ROUTER.md` is a policy decision, not a code fact: the contract neither requires nor forbids it, and the replay does not enumerate it. Recorded as a decision for the migration owner.
- The accuracy claim is EXPECTED, not measured. Confirming it needs a before/after capture with the recorded corpus and the same empty-database environment.

## Ruled Out

- Treating the graph compiler as a body reader. The file has no `SKILL.md` read; it copies `graph-metadata.json` as authored.
- Treating the derived lane as a live body consumer. Its writer is marked deprecated and off the serving path, and the fleet producer preserves curated trigger and topic fields while pruning only dead paths.
- Adding `ROUTER.md` to the doc-frontmatter harvest. The harvest walks `references/` and `assets/` only and is off by default.
- Adding a lane for router markers. No lane has a field for them, and the projection exposes only frontmatter, keywords, metadata signals and the derived block.

## Dead Ends

A package-wide full-text search for the phrase "machine router" returns the section heading and changelog prose, which reads like heavy coupling and is not. Replacing it with two symbol searches, one for the section heading and one for the `router.md` filename inside the scoring runtime, separated the two real surfaces (the doc-file demotion rules) from the documentation noise.

## Edge Cases

- Ambiguous input: "every skill" includes standalone skills and hub modes, but the root-router contract and its replay are hub-scoped, so the standalone case is reported as an uncovered gate rather than a required change.
- Contradictory evidence: `sync.ts` is the only in-package derived writer and is marked deprecated and off the serving path, while the fleet producer lives in `sk-doc`. Both are consistent once the authority is read as `sk-doc`; recorded rather than halted, because no operator is present.
- Missing dependencies: none. Every cited path resolves.
- Partial success: the workflow-owned spec write-back, temporary event staging outside the lineage, and the continuity save are skipped because the dispatch bounds all writes to this lineage. Recorded here as instructed.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:131-179, 278-298`
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:263-286`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:52-104, 211-241, 316-319`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:185-240, 1087-1100`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:704-711, 1305, 1399`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:42-46, 170`
- `.skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:162-174, 205-217, 228-238`
- `.skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts:93-99`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9-15`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:68-75`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:187, 230, 314, 361`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts:62`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:207, 262, 283`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/bm25.ts:60-77`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3019-3021`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-46`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:27-35`
- `.skilled/skills/system-skill-advisor/leaf-manifest.config.json:4, 7`
- `.skilled/skills/system-skill-advisor/leaf-scopes.json:1-13`
- `.skilled/skills/system-skill-advisor/SKILL.md:61, 220`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:395`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:314-368`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:315`
- `.opencode/plugins/system-skill-advisor.js:142-156, 330-344`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:46-55, 75-108`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:688-694, 738-782`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:7-19`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:320-330`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:5-19`

## Assessment

- New information ratio: 1.0
- Novelty justification: no prior lineage in this packet examined the advisor's signature, watcher, projection or lane inputs, so every finding is new to the packet.
- Questions addressed: RQ-6.1 through RQ-6.6, all answered, with the accuracy leg marked expected rather than measured.
- Questions answered: all six carried key questions.

## Reflection

- What worked and why: starting from the signature and following each hash input to its producer separated the files that are read from the files that only appear to be read. Chasing the deprecated writer outward to the fleet producer turned a would-be accuracy finding into a documented non-change.
- What did not work and why: a phrase search for the section title produced changelog and documentation hits that looked like coupling. The root cause was searching for a human heading instead of a filename or symbol.
- What I would do differently: read the lane registry and lane inputs first, because the lane field list answers "does body text matter" faster than reading each parser.

## Recommended Next Focus

Nothing further is required for this lineage: the run is capped at one iteration. The natural follow-up, for a later packet rather than this run, is a measured before/after capture of the three baselines with the corpus hashes already recorded, plus a decision on whether a standalone skill may carry a root `ROUTER.md`.
