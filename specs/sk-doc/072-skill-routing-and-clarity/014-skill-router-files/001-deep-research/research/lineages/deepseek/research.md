# Research: Skill Advisor Alignment for a Sibling ROUTER.md

Lineage `deepseek`, run `fanout-deepseek-1793263405044-mwc96z`, scope RQ-6 only.

## 1. Executive Summary

The advisor survives the router move with two code fixes and one measurement, because almost none of it reads SKILL.md body text. The freshness signature probes SKILL.md and graph-metadata.json per skill and nothing else, so a ROUTER.md-only edit leaves a stale graph reporting `live`; that is the real defect and it exists in two files, plus a watcher that never fires on the new filename. The Python parser, the graph compiler, the embedder and all five scorer lanes are already router-blind, so the router move does not change a single score. The accuracy baselines therefore hold by construction, not by luck, and the recorded 155/195, 49/66 and 19/24 become a re-capture check rather than a redesign.

## 2. Scope and Method

In scope: `.skilled/skills/system-skill-advisor` in full, plus the two surfaces outside it that carry copies of its contracts, being `.opencode/plugins/system-skill-advisor.js` and the `ROUTER.md` gate pair in `sk-doc`. One iteration, writes confined to this lineage. Method: read the signature and follow each input to its producer, then read each consumer of that producer. Negative claims were tested by searching for the filename and the section heading separately rather than by reading a file and concluding.

## 3. Current Shape and Baseline

The advisor's signature is a single sha256 over a labelled, newline-delimited list of probes. Per skill slug it adds `SKILL.md` and `graph-metadata.json`; globally it adds three required Python scripts, the SQLite artifact and the JSON artifact. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:162-198]

Freshness is decided by comparing a stored generation signature to the recomputed one, falling back to an mtime comparison only when no stored signature exists. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:278-298]

## 4. RQ-6.1: The Freshness Signature

A ROUTER.md edit is invisible to the signature. The probe set is fixed at two per skill, the hash adds a `missing` marker for an absent file so absence is distinguishable from unchanged, and the comparison at the end is a plain equality of the whole signature. Adding `ROUTER.md` is therefore a third `addSignaturePart` call inside the same loop, not a new hashing scheme. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:131-137] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:177-178]

The loop skips a slug whose `SKILL.md` is missing, so the same loop already carries the rule that a skill root is identified by its marker file. A `ROUTER.md` probe belongs beside the SKILL.md probe and must not replace it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:162-168]

Two further surfaces carry the same decision. The OpenCode plugin reimplements the signature with different delimiters and adds four `implementation:` paths, so it needs the same third probe or the plugin and the daemon will disagree about liveness. [SOURCE: .opencode/plugins/system-skill-advisor.js:330-344] The daemon watcher enumerates watch targets and has no router entry, so a ROUTER.md write produces no event at all, which means even a corrected signature would sit unrecomputed until something else touched SKILL.md. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:263-286]

The fix is one probe in three places and one target in the watcher. A skill with no ROUTER.md keeps its current signature, because the `missing` marker is stable across calls.

## 5. RQ-6.2: Discovery and Parsing

Discovery joins `SKILL.md` and requires it to exist, so the router move cannot orphan a skill as long as SKILL.md remains the marker file. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:211-228]

Parsing reads the frontmatter block, then continues past blank lines and whole-line HTML comments to merge a `<!-- Keywords: ... -->` comment into the keywords field, and returns at the first line that is neither. A MACHINE ROUTER section at the end of the file was never reachable by this parser. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:52-104] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:84-96]

The consequence runs the other way from the freshness case: the cache signature hashes only the discovered SKILL.md files, which is correct while no router content is parsed and becomes a defect the moment someone widens the parser. Recording that makes the constraint explicit for the next author rather than leaving it to be rediscovered. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:232-241] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:316-319]

## 6. RQ-6.3: Skill Graph and Embeddings

The compiler reads `graph-metadata.json` and never SKILL.md, so the graph's nodes, edges, families and signals are unchanged. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:185-240]

Embeddings are built from the SKILL.md frontmatter `description` alone, and that helper feeds the embedding column at both write sites. The semantic-shadow lane scores the same single field. A router move cannot move a vector. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:704-711] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1305] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1399] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:207]

The one body-sensitive path is derived extraction, and its authority is outside the advisor. Extraction reads the whole body and pushes headings, body ngrams and code-block ngrams into buckets, seeds `sourceDocs` and `keyFiles` with SKILL.md, and adds it to the provenance dependency set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:162-174] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:205-217] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:228-238]

Its writer, however, declares itself deprecated and off the serving path, and the fleet producer is `sk-doc`'s regenerator, whose stated policy is to preserve hand-curated trigger and topic fields and repair only structural drift. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts:93-99] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:5-19] So committed `derived` does not move with the router unless someone deliberately re-runs the deprecated extractor. That is the check to name in the migration, not a code change.

## 7. RQ-6.4: Leaf Inventory and Root Metadata

The inventory cannot grow a ROUTER.md. Leaf roots are five subdirectories, and a root-level file is outside all of them, so `leaf-manifest.json` and `leaf-aliases.json` stay byte-stable. [SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.config.json:4] [SOURCE: .skilled/skills/system-skill-advisor/leaf-scopes.json:1-13]

Two prose surfaces go stale. The config's note describes the routed leaves as what "the in-SKILL.md INTENT_SIGNALS + RESOURCE_MAP router" selects, and SKILL.md's own pointer sentence announces the router as a section of SKILL.md. [SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.config.json:7] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:61]

The gate has a class gap. `ROUTER.md` is a governed root file, required for the hub class and not forbidden for the standalone class, but the checker runs the root-router contract only inside a hub guard. This skill declares neither discriminator file, so it classifies standalone and a relocated `ROUTER.md` there would be neither required, forbidden nor validated. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:46-55] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:75-108] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:688-694]

The replay that already reads a root `ROUTER.md` is hub-scoped, and the contract's own header reserves that file for parent hubs, so a standalone router move would be replayed by nothing. Whether that is permitted is a policy decision the code does not settle. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:320-330] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:7-19]

## 8. RQ-6.5: Scorer Lanes

Five live lanes, weighted 0.42, 0.28, 0.13, 0.12 and 0.05. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9-15]

None reads body text. The explicit lane scores `intentSignals` and `keywords`; lexical scores id, name, description, domains, `intentSignals` and `keywords`; BM25 weights the same field set; derived scores `derivedTriggers` and `derivedKeywords` from the committed metadata block; semantic-shadow scores description. No lane has a field for a router marker, a fenced block or a section body. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:361] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:68-75] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/bm25.ts:60-77] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts:62] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:207]

Two alias-shaped exposures are worth naming. The explicit lane already demotes `router.md` as a doc filename in both the suffix guard and the write-verb doc list, and the Python scorer mirrors the rule, so a prompt such as "edit ROUTER.md" is already treated as a file edit rather than a skill request. That is a positive check and needs no change. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:230] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:314] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3019-3021] Against that, `'smart router'` is hard-mapped to `sk-code` at 0.65, so a migration-shaped prompt that names the machine router can be captured by the code hub before advisor vocabulary is consulted. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:187] That one has to be replayed against the corpus, not reasoned about.

## 9. RQ-6.6: Hooks, Plugin Bridges and Baselines

Hooks consume freshness, never content. The Claude hook reads freshness off the advisor envelope, and the CLI-fallback helper branches on `live`, `stale`, `absent` and `unavailable` when it decides between a local answer and an outage. [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:395] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:314-368]

The Pi surface is one file, not two: `.pi/extensions/prompt-advisor.ts` is a symlink to the hook inside the skill, so a change there propagates. The OpenCode plugin is the opposite: it duplicates the signature and needs the same edit as the daemon. [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:315] [SOURCE: .opencode/plugins/system-skill-advisor.js:330-344]

The baselines are hash-pinned and reproducible. The record carries corpus, holdout and ambiguity sha256 values, the capture commit, the empty database directory and the filesystem projection, and the three numbers. Re-capturing against the same inputs produces a comparable delta rather than a new argument. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-46] The corpus driver runs the Python scorer as a subprocess, which is why a parser change moves the number and a router move does not. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:27-35]

## 10. Cross-Boundary Notes

No advisor code parses the MACHINE ROUTER section. Searching the package for the section phrase matches only the heading and its pointer sentence, and searching the scoring runtime for the `router.md` filename matches only the doc-file demotion rules. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:220] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:61]

The readers that will need `ROUTER.md` support for other skills live outside this package: the package checker and parent-skill check in `sk-doc` and `doctor`, the replay in `sk-doc`, and the compiled-routing registry. This lineage does not re-derive them; the sibling lineage in this packet owns that inventory.

## 11. Recommendations

1. Add a `ROUTER.md` probe to the per-skill signature loop in `runtime/lib/freshness.ts`, beside the SKILL.md probe and keeping the `missing` marker.
2. Add the same probe to the plugin's duplicate signature in `.opencode/plugins/system-skill-advisor.js`.
3. Add a `router-md` target to `discoverWatchTargets` in `runtime/lib/daemon/watcher.ts`.
4. Retarget the pointer sentence in `SKILL.md` and the note in `leaf-manifest.config.json` from "in SKILL.md" to the sibling file.
5. Decide whether a standalone skill may own a root `ROUTER.md`; if yes, widen the root-router gate beyond the hub class, and if no, keep the advisor's router in SKILL.md.
6. Before and after the move, re-capture the three baselines with the recorded corpus and environment, and replay the `'smart router'` alias against a migration-shaped prompt.
7. Do not re-run the deprecated derived extractor as part of the migration; if it must run, expect the derived lane to move and treat that as a scoring change.

## Eliminated Alternatives

- Making the graph compiler read the router: it reads `graph-metadata.json` only and has no SKILL.md read to redirect.
- Adding a router-marker lane: no lane field exists for router content, and inventing one would change the fusion weights the baselines were captured at.
- Adding `ROUTER.md` to the doc-frontmatter harvest: the harvest walks `references/` and `assets/` and is off by default.
- Treating the plugin's signature as the only fix: the daemon recomputes independently and would still report `live`.
- Treating `derived` drift as an expected cost of the move: the serving-path producer preserves curated fields, so the drift only appears if the deprecated extractor is deliberately re-run.

## Divergence Map

- Saturated: none. One iteration was run, so nothing was tried twice.
- Pivots taken: none.
- Failed pivots: none.
- Remaining frontier: whether a standalone skill may own a root `ROUTER.md`, and the measured before/after capture of the three baselines.

## 12. Open Questions

1. Does a standalone skill get a root `ROUTER.md`, or does the router stay in SKILL.md for that class? The contract neither requires nor forbids it and the replay does not enumerate it, so this is a decision rather than a finding. UNKNOWN until decided by the migration owner.
2. Do the baselines hold after the move? Expected to hold, because no lane reads the router; unconfirmed until a capture is run with the recorded corpus hashes and the empty-database environment.
3. Does the `'smart router'` alias capture migration prompts? Unconfirmed; needs a corpus replay.

## 13. Proposed Implementation Phases

1. Signature and watcher: three probes plus the watcher target, with a test that a ROUTER.md-only edit flips freshness to `stale`.
2. Prose: retarget the SKILL.md pointer and the leaf-manifest config note.
3. Gate decision: resolve the standalone-class question, then either widen the root-router gate or scope the migration to hubs.
4. Measurement: capture the three baselines before and after, plus the alias replay.

## 14. Verification Plan

- A freshness test that touches only `ROUTER.md` and asserts `stale`.
- A watcher test asserting a `router-md` target exists for a skill carrying the file.
- A signature-parity test between `freshness.ts` and the plugin, so the two implementations cannot drift again.
- A delta capture of the three baselines against the recorded sha256 inputs.
- The advisor's own scorer tests, unchanged, as the no-regression gate.

## 15. Evidence Strength and Limitations

Observed directly: every cited file and line, the signature composition, the parser's return points, the lane field lists, the contract's class sets, the baseline record. Derived: that no lane reads the router, from the projection's field list plus a grep of each lane. Inferred: that the baselines hold, which no run has yet confirmed. Unconfirmed: the standalone-class policy question, and the alias replay.

The negative claim in section 10 rests on filename and heading searches over the package excluding `node_modules` and build output, not on a line-by-line read of all 921 files. A reader who needs it stronger should widen the search to the build output.

## 16. Convergence and Workflow Notes

One iteration, capped by `config.maxIterations = 1`, so the stop is `maxIterationsReached` and not convergence. The reducer reported one iteration completed with zero corruption and six of six key questions resolved. Two carried-forward open questions were recorded by the reducer alongside the third above.

Two workflow-owned steps were deliberately not run because they write outside this lineage: the `spec.md` generated-findings write-back and its targeted strict validation. The continuity save was likewise skipped. This is the dispatch's write containment, not a failure of the loop.

## 17. References

- `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py`
- `.skilled/skills/system-skill-advisor/leaf-manifest.config.json`
- `.skilled/skills/system-skill-advisor/leaf-scopes.json`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`
- `.opencode/plugins/system-skill-advisor.js`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 1
- Questions answered: 6 / 6
- Remaining questions: standalone-class `ROUTER.md` policy, baseline re-capture, alias replay
- Last 3 iteration summaries: iteration 1 mapped the advisor's signature, parsing, graph, leaf inventory, lanes, hooks and baselines against the router move
- Convergence threshold: 0.05
- Divergence summary: nothing saturated; the frontier is the policy decision and the measurement
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
