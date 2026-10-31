# Iteration 003 — Spec-kit search and navigation

- **Focus (charter 3):** Trigger index, ripgrep recipes, skill advisor, `/speckit:search`, `/speckit:resume`, graph traversal. What an agent can and cannot find today.
- **Status:** complete
- **NewInfoRatio:** 0.80
- **Novelty:** First live-tested picture of the two retrieval lanes plus the second, separate routing graph (skill advisor over skill `graph-metadata.json`), including an observed no-hit on a domain query that is obviously relevant.

## Findings

### F1 — Two retrieval lanes, deliberately disjoint

- Keyed lane: the committed trigger index at `runtime/data/trigger-index.json` read by `lookup-trigger-index.mjs`, matching a prompt only against author-declared `trigger_phrases` (`retrieval-conventions.md:32-43`; `/speckit:search` lanes at `search.md:66-74`).
- Free-text lane: the literal ripgrep recipes over `specs .skilled` (`retrieval-conventions.md:84-119`), with `--no-config --hidden` mandatory and four exclusion globs (`retrieval-conventions.md:71-78`).
- `/speckit:search` is a direct-dispatch thin router over exactly these two lanes; the named third lane (lineage, drift, semantic matching) is "Unsupported" and must render a notice (`search.md:66-74`; `search.md:16-25`).
- No-hit discipline: a literal absent phrase is a clean no-hit, never a nearest guess (`retrieval-conventions.md:39`; `search.md:31`).

### F2 — Observed behavior of the two lanes (first-hand, 2026-10-04)

- Trigger-index lookup for the domain query `open knowledge format adoption`: 593 candidate phrases considered, `results: []` — a clean no-hit, because no indexed document declares those trigger phrases. This is the declared-vocabulary bound in action.
- Same query via the free-text recipe (`--files-with-matches`, the literal string `Open Knowledge Format`): 4 packet documents matched under `specs/system-speckit/050-open-knowledge-format-adoption/` — including documents whose `trigger_phrases` never declare the words.
- Declared-phrase lookup for `folder structure reference`: 1 exact hit at `references/structure/folder-structure.md`, match class `exact`, score 1.
- Index shape: `schemaVersion`, `manifestHash`, `normalization`, `paths` (13,150 entries), `phrases` (33,666 phrase entries); file size ~3.7 MB (observed read of `runtime/data/trigger-index.json`).
- Conclusion: the keyed lane answers "who declared this vocabulary"; the scan lane answers "where does this string occur". Neither ranks by meaning.

### F3 — The skill advisor is a second graph over skill metadata, not over spec docs

- Daemon-backed CLI with 9 stable command ids: `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, `skill_graph_propagate_enhances` (`system-skill-advisor/SKILL.md:320-334`).
- Routing phrases for skills come from each skill's `graph-metadata.json` (`intent_signals` + `derived.trigger_phrases`); the `trigger_phrases` in a skill's `SKILL.md` frontmatter are **not** read by any runtime routing reader, and per-doc `trigger_phrases` feed routing only when `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (`system-skill-advisor/SKILL.md:340`).
- Degraded-mode contract: daemon unreachable → local Python scorer with a `degraded` mark; exit taxonomy `0/1/64/69/75` (`system-skill-advisor/SKILL.md:297`, `:338`).
- Graph commands exist (`skill_graph_query` is read-safe, no trusted arg; scan/propagate mutations are trust-gated) (`cli-front-door-contract.md:48-52`).

### F4 — `/speckit:resume` is the continuity front door, not a search surface

- Resume is a thin router to two workflow YAMLs (`speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml`); session detection, continuity loading, progress and continuation behavior live in the YAML (`resume.md:12-23`, `resume.md:40-46`).
- The recovery ladder it walks is `handover.md` → `_memory.continuity` → packet spec docs → bounded context recipe (`SKILL.md:464`; `save-workflow.md:406`).
- Consequence for the OKF comparison: spec-kit navigation has **two indexes** (trigger index over doc phrases; advisor soup over skill `graph-metadata.json`) and one graph-ish metadata network (packet `graph-metadata.json` parent/children + manual edges), but no consumer-facing traversal command over the packet graph itself.

### F5 — Declared losses that bound any OKF "search" idea

- Semantic paraphrase, vector/BM25 fusion, decay, access tracking, session dedup and causal traversal are declared losses with no file-based successor (`SKILL.md:470`; `retrieval-conventions.md:55-65`). OKF's `index.md`/link-graph ideas must be judged against this baseline, not against a semantic-retrieval ideal.

## Sources

- `[SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:32-43, 55-78, 84-119]`
- `[SOURCE: .skilled/commands/speckit/search.md:16-25, 31, 66-74]`
- `[SOURCE: .skilled/commands/speckit/resume.md:12-23, 40-46]`
- `[SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:297, 320-334, 338, 340]`
- `[SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:48-52]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json]` (observed shape: schemaVersion 2; 13,150 paths; 33,666 phrase entries)
- `[SOURCE: live run] node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "open knowledge format adoption"` → 0 results, 593 candidate phrases (2026-10-04)
- `[SOURCE: live run] same lookup -- "folder structure reference"` → 1 exact hit, folder-structure.md
- `[SOURCE: live run] rg recipe §2.2 for literal "Open Knowledge Format"` → 4 packet docs

## Open questions carried forward

- Does anything today traverse `graph-metadata.json` edges for consumption (as opposed to refresh)? (iteration 7; candidate-idea feasibility)
- Would OKF-style `index.md` per folder beat the trigger index for agent navigation, or duplicate it? (iteration 6 crosswalk, iteration 7 candidates)

## Next focus

Iteration 4 — OKF specification deep read: reserved filenames, concept types, `sources`, `generated`, `verified`, `status`, `stale_after`, index and log files, conformance. Compare the seeded copy against the upstream repository with `curl`.

## Negative knowledge (tried, failed / dead ends)

- The keyed lane cannot find this packet's own domain ("open knowledge format adoption") because no author declared the phrase: confirmed by live run, not inferred. Any adoption idea that assumes index coverage of undeclared vocabulary is contradicted by this observation.
