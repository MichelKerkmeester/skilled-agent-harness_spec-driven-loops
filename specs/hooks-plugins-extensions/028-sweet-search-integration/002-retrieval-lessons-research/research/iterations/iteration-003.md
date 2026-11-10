# Iteration 3: Q3 — Meaningful-Line Preference Over Template Boilerplate

## Focus

Whether sweet-search's line-class preference (`core/search/grep-line-classes.js`) transfers to Skilled's retrieval beyond the existing evidence-field order (`trigger_phrases`, title/description, anchor, body), specifically: would demoting template boilerplate (FILL comments, stock template sentences repeated in every packet) improve results? The hard constraint holds — no embeddings, no vector/BM25 fusion, no MCP, no daemon, no persistent index beyond the committed trigger index. This iteration answers Q3 only; the other four lessons are sibling iterations.

## Actions Taken

1. Read `grep-line-classes.js` end to end to establish what its classes actually depend on.
2. Read `lookup-trigger-index.mjs` to establish the keyed lane's result shape and whether it carries lines at all.
3. Read `retrieval-conventions.md` sections 1, 5, 8 and 9 for the normative ranking tuple, the phrase-quality classes and the two-lane coverage split.
4. Read `rg-lane.mjs` sections 5-6 (`frontmatterFieldLines`, `rankMatches`) for the free-text lane's evidence-field classifier and sort.
5. Ran four real measurements against this repository: a keyed trigger lookup for a boilerplate-shaped prompt, the free-text count and structured recipes for a stock template sentence, and a judge sweep over every phrase in the committed index.

## Findings

1. **The keyed lane has no lines to classify.** A lookup result is `{matchClass, path, phrases, score}` and the human format prints score, class and path only; nothing in the answer is a line. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:226] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:335] So sweet-search's line-class mechanism has no surface in the Gate 1 lane at all — the lesson can only apply to the free-text lane.

2. **The keyed lane's boilerplate enters only as declared phrases, and its volume is small but its rank effect is real.** The generator reads `trigger_phrases` out of frontmatter and interns phrase keys; the artifact stores only `paths` and `phrases` at schema version 2, so no per-phrase quality class is carried into the lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:172] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/artifact.mjs:146] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/artifact.mjs:160] Judging all 42,211 committed phrases with the repo's own judge: 230 are negative-class (0.54%) — 187 single-token, 27 numeric-only, 19 prose-sentence, 19 template-default, 3 generic-workflow-word, 1 stop-word-only, 1 editor-fallback. 409 of 17,653 documents own at least one such phrase; 30 documents own *only* negative-class phrases, so the keyed lane can reach them only through boilerplate (mostly `summary`, which owns 39 documents, and `feature`, 30). [INFERENCE: judge sweep over `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` using `judgeTriggerPhrase`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:108`]

3. **Real keyed query: template copies take three of six slots and outrank a real packet.** Query `acceptance criteria closure gate` returned two real packets at `exact` 1.0, then the level-2, level-3 and level-3+ acceptance-criteria template copies at `query-containment` 0.88, then a real packet at `token-overlap` 0.75. The three template copies are indexed by their own placeholder phrases (`acceptance criteria`, `closure gate`, `ac traceability`, `waiver adr`). [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md:5] The judge names those same phrases `template-default` and only warns — a warning never deletes an author's phrase. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:121] Because the class is not persisted in the index, the lookup cannot distinguish a template copy from an authored declaration, and path order decides inside the tie.

4. **The free-text lane is where boilerplate genuinely floods.** The stock sentence `This document decides whether the packet may close` returned 784 matches across 784 paths at exit 0, and the structured recipe ranked all 784 as `body`. [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md:17] The same sentence is stock in all three template levels, and it is copied into real packets' acceptance-criteria files. In contrast, the literal `FILL` marker is not a packet-wide pollutant: the count recipe found it once per template example file, not across authored packets. [INFERENCE: `rg --count -- 'FILL' .skilled/skills/system-spec-kit` returned 1 per template example file]

5. **The match-class component is degenerate for fixed-string matches.** `rankMatches` scores the matched *line text* against the query, and a fixed-string hit always contains the query, so every hit lands in the same containment class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:396] The sort then falls through to evidence field, path and line. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408] Observed directly: 784 `body` rows ordered by path. Inside `body` the tuple carries no content signal, which is exactly the gap a line class would fill.

6. **The sweet-search mechanism does not transfer; its principle does.** Its classes come from code-graph entities — class 0 declaration, class 1 inside a symbol span, class 2 outside — and are gated on the file being no newer than the published index. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-line-classes.js:6] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-line-classes.js:21] `stampGrepLineClasses` requires `entitiesInFile` and `isFresh`, i.e. a persistent per-file symbol index — banned by this topic's constraint and meaningless for Markdown, which has no symbols. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-line-classes.js:144] What transfers is the selection rule: prefer structural lines, demote boilerplate shapes, and take one line per section before filling the rest so one section cannot flood the answer. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-line-classes.js:198]

7. **Feasibility in the free-text lane is unusually cheap.** `rankMatches` already reads the whole file per path to compute frontmatter line ranges. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:387] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:418] A Markdown line class — heading or table row or list item versus blockquote guidance, HTML template marker, or prose — is computable from that same string: no new I/O, no index, no dependency, deterministic by construction.

## Ruled Out

- **Applying line classes to the keyed lane.** It returns documents, not lines (Finding 1). No code change there can express the lesson.
- **Porting `classifyGrepLines` / `selectGrepLinesByClass` as written.** Both need a symbol entity list and an index-freshness predicate (Finding 6); adopting them would require the persistent index the topic forbids.
- **Treating `FILL` as the boilerplate to demote.** It survives once per template example file and not across authored packets, so demoting it would buy almost nothing (Finding 4). The stock prose sentences are the real pollutant.

## Dead Ends

- **Demoting `template-default` phrases by deleting them.** The convention explicitly refuses to delete an author's phrase, so any fix must demote at rank time, not remove at generation time. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:91]

## Edge Cases

- **Ambiguous input:** none. The focus named the module, both Skilled surfaces and the query requirement.
- **Contradictory evidence:** none. The keyed lane's small boilerplate volume and its visible rank effect are both true and are reported together rather than collapsed.
- **Missing dependencies:** `generation-diagnostics.json` is not committed under `runtime/data/`, so the phrase-quality bucket counts were re-derived by judging the committed index directly instead of reading the generator's diagnostics.
- **Partial success:** none. All four measurements exited 0.

## Questions Answered

- Q3: Meaningful-line preference (core/search/grep-line-classes.js): beyond the existing evidence-field order (trigger_phrases, title/description, anchor, body), would demoting template boilerplate (FILL comments, stock template sentences repeated in every packet) improve results? Show real queries where boilerplate matches crowd out real content.

## Questions Remaining

- Q1: Zero-hit fallback to git-changed files (sibling iteration).
- Q2: Per-file caps with an elision line (sibling iteration).
- Q4: Out-of-scope hit hint (sibling iteration).
- Q5: Dedup plus final-k cut (sibling iteration).

## Sources Consulted

- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-line-classes.js:6-26, :144, :198
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:190, :226, :335
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:318, :387, :396, :408, :418
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/artifact.mjs:146, :160
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:91, :108, :121
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:172, :196
- .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:206, :263
- .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md:5, :14, :17
- Committed index: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json (42,211 phrases, 17,653 paths)
- Query: `lookup-trigger-index.mjs --json --scoring-only -- "acceptance criteria closure gate"`
- Query: `rg-wrapper.mjs count|structured "This document decides whether the packet may close"`

## Assessment

- New information ratio: 0.93
- Questions addressed: Q3
- Questions answered: Q3

## Reflection

- **What worked and why:** measuring the *actual* artifact rather than reasoning from the module names. The judge sweep turned "template boilerplate might pollute the index" into 230/42,211 phrases and 30 documents reachable only by boilerplate, and the two rg recipes turned "one large file might flood" into 784 identical `body` rows. Reading `rankMatches` before claiming a gap also prevented a wrong recommendation: the evidence-field order already handles frontmatter and anchors, so the proposal had to be a sub-order *inside* `body`, not a new top-level field.
- **What did not work and why:** the first framing — "add a line-class field like sweet-search" — collapsed once `grep-line-classes.js` was read: its classes depend on a code-graph entity list and a freshness gate, so the mechanism is a persistent-index feature, not a ranking tweak.
- **What I would do differently:** the 784-row query is boilerplate-shaped by construction, so it proves the ranker's degeneracy but not a specific user-visible miss. A follow-up should pick a domain term that appears in both a template sentence and real content, to measure the crowd-out on a query a user would actually type.

## Next Focus

No further iteration on Q3. A build phase should **adapt** the lesson, scoped to the free-text lane:

- **Adopt:** a Markdown line-class sub-order inside `body` plus one-line-per-section spread, in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`. Prefer heading and table-row lines, demote blockquote guidance and HTML template markers, then fill in path/line order.
- **Amend:** `retrieval-conventions.md` section 5, adding the body sub-order to the normative tuple so the document and the code stay one contract.
- **Drop:** any keyed-lane change (no lines exist there) and any port of the symbol-span/freshness mechanism.
- **Size:** roughly 80-120 lines in `rg-lane.mjs`, ~30 lines of contract text, ~80-120 lines of rank fixtures and tests — about 200-270 lines total, no schema change, no new index, no new dependency.
