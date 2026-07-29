# Iteration 4: Effectiveness — Does the JSON Drive Routing Well?

## Focus
Fleet-wide intent-signal coverage evenness, how the JSON fields combine into a score, whether dead fields harm routing, and whether declared data (command-metadata.json) actually reaches the advisor's routing.

## Findings

### F4.1 — HIGH-LEVERAGE: extreme fleet-wide variance in intent-signal coverage
Fleet measurement (graph-metadata.json field counts):
| skill | dom | intSig | dTrig | kTop | kFile | ent | srcDoc |
|-------|----|--------|-------|------|-------|-----|--------|
| cli-external-orchestration | 10 | 29 | 114 | 70 | 54 | 7 | 16 |
| mcp-code-mode | 4 | 3 | 12 | 10 | 7 | 7 | 5 |
| mcp-tooling | 20 | 50 | 41 | 31 | 12 | 7 | 15 |
| sk-code | 28 | 64 | 20 | 17 | 21 | 4 | 15 |
| sk-design | 7 | 27 | 59 | 12 | 2 | 2 | 2 |
| sk-doc | 18 | 18 | 16 | 13 | 11 | 9 | 9 |
| sk-git | 10 | 21 | 41 | 19 | 9 | 9 | 7 |
| sk-prompt | 13 | 9 | 32 | 18 | 9 | 5 | 4 |
| system-deep-loop | 12 | 15 | 34 | 15 | 9 | 3 | 9 |
| system-skill-advisor | 5 | 4 | 10 | 10 | 8 | 5 | 2 |
| system-spec-kit | 6 | 5 | 12 | 10 | 10 | 10 | 5 |
[SOURCE: python3 over .opencode/skills/*/graph-metadata.json]

Variance is ~20x (intent_signals 3→64; derived triggers 10→114). Two effectiveness problems:
1. **The advisor's own skill has thin signal** — system-skill-advisor: 4 intent_signals, 10 derived triggers, 2 source_docs. Routing TO the advisor (e.g. "which skill handles skill routing?") relies on the weakest signal set in the fleet.
2. **Thin-signal skills are structurally harder to route to** — mcp-code-mode (3 intent_signals), system-spec-kit (5), system-skill-advisor (4) will lose lexical-lane matches to rich-signal hubs regardless of relevance. There is no normalization for signal-set size, and the derived lane caps via Math.min (derived.ts:68) but the lexical lane has no per-skill normalization (lexical.ts:64-90).
[SOURCE: lexical.ts:64-90; derived.ts:62-106]

### F4.2 — Scoring architecture: two lanes consume the JSON; dead fields are routing-neutral
- **lexical lane** (lexical.ts:64-71): scores on id, name, description, `domains`, `intentSignals`, `keywords` (SKILL.md frontmatter).
- **derived lane** (derived.ts:62-87): scores on `derivedTriggers` (derived.trigger_phrases) + `derivedKeywords` (derived.key_topics+entities+key_files+source_docs) + affordance triggers + doc triggers.
- `derived.causal_summary`, `derived.supported_surfaces`, `derived.peer_resource_categories`, `manual.*` never enter any projection (confirmed in projection.ts:200-239). They are routing-NEUTRAL (no noise added to scores) — their cost is JSON bloat + validation overhead + authoring/maintenance burden, not routing harm. This refines F2.1/F2.2/F2.3: the optimization case is maintenance/bloat, not routing quality.
[SOURCE: lexical.ts:64-71; derived.ts:62-87; projection.ts:200-239]

### F4.3 — domains∩intent_signals double-counting confirmed in the lexical lane
lexical.ts:68-69 puts `...skill.domains` and `...skill.intentSignals` in the SAME `scoreTokenOverlap` call. For sk-code, 8 of 28 domains also appear in intent_signals (e.g. "code","opencode","typescript"); each shared token contributes overlap twice. This is a real effectiveness distortion favoring skills with overlapping domains+intent_signals. No dedup between the two arrays before scoring.
[SOURCE: lexical.ts:64-71; sk-code overlap computation (iter 2)]

### F4.4 — File paths scored as routing keywords in the derived lane
`derivedKeywords` = key_topics + entities + key_files + source_docs (projection.ts:216-221). key_files and source_docs are file PATHS (e.g. ".opencode/skills/sk-code/code-webflow/SKILL.md"). The derived lane tokenizes them (derived.ts:86, scoreTokenOverlap) into generic tokens like "opencode","skills","sk","code","webflow","SKILL","md". Generic path tokens ("skills","opencode","SKILL","md") appear across nearly every skill's key_files, so they risk false cross-skill matches while contributing little discriminative signal. The discriminative value of path-as-keyword is questionable vs the noise from shared path vocabulary.
[SOURCE: projection.ts:216-221; derived.ts:62-87; sk-code/graph-metadata.json:207-229 key_files]

### F4.5 — HIGH-LEVERAGE: command-metadata.json does NOT drive advisor command routing
The advisor routes commands via a hardcoded TS array `COMMAND_BRIDGES` in projection.ts:58-145 (command-spec-kit, memory:save, create:agent, deep:model-benchmark, ...). These carry inline `intentSignals`/`keywords`/`domains` and empty `derivedTriggers`/`derivedKeywords`. command-metadata.json (the per-hub authored data the fleet gate validates for schema) is NOT ingested by the advisor for command routing — a grep for `command-metadata`/`command_metadata` in skill_advisor.py returned no read, and the scorer consumes COMMAND_BRIDGES, not the JSON. So:
- command-metadata.json's `userIntent`/`choreography`/`argumentHint` fields are gated for schema but do not reach routing.
- COMMAND_BRIDGES is a parallel, hand-maintained-in-code signal source that must be kept in sync with command-metadata.json manually — a drift surface with no gate.
[SOURCE: projection.ts:58-145; skill_advisor.py grep (no command-metadata read); contract §3 command-metadata schema lines 77-81]

## Sources Consulted
- python3 fleet count over all 11 graph-metadata.json
- lexical.ts:60-94, derived.ts:51-106, projection.ts:40-145,200-239
- skill_advisor.py grep for command-metadata (empty)

## Assessment
- **newInfoRatio:** 0.80 — five effectiveness findings; F4.1 (variance + advisor's own thin signal) and F4.5 (command-metadata not driving routing) are high-leverage and new. F4.2 refines earlier dead-field findings (routing-neutral). F4.3 confirms iter-2 hypothesis with the exact lane.
- **Novelty justification:** First fleet-wide quantitative coverage measurement; first trace of JSON→lane→score; first discovery that command-metadata.json is gated but not routing-consumed.
- **Confidence:** High on F4.1 (computed), F4.2 (lane reads), F4.3 (lane code), F4.5 (grep + read). Medium on F4.4's false-match impact (inferred from tokenization, not from a routing-accuracy regression — would need the routing-accuracy fixtures to quantify, carried to iter 5).

## Reflection
- **What worked:** The fleet count table made the variance and the advisor's-own-thin-signal problem immediately visible.
- **What failed:** Expected command-metadata.json to be the advisor's command-routing input; it is a hardcoded TS array instead.
- **Ruled out:** "dead fields harm routing" — refuted (F4.2): they are routing-neutral, the case is maintenance/bloat.

## Recommended Next Focus
Iteration 5 — TESTING & INTEGRATION: (a) per-JSON test/CI coverage map (which JSON types have vitest fixtures, which have CI gates); (b) end-to-end scaffold→gate→advisor-ingest→routing — where does the chain break (F3.4 validation split, F4.5 command-metadata not ingested); (c) the routing-accuracy fixtures under mcp-server/scripts/routing-accuracy — do they exercise the JSON surfaces and would they catch F4.4 false matches; (d) failure modes when graph-metadata is malformed/absent.
