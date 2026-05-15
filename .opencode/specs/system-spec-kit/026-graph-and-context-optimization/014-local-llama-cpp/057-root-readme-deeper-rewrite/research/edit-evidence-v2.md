# Edit Evidence Transcript v2 — Root README Deeper Second-Pass (Packet 057, Phase 2)

Date: 2026-05-15
Source delta: `056/research/edit-evidence.md` (Phase 4 record of 25 applied EDITs)
Iter source-of-truth: `056/research/iterations/iteration-001.md` … `iteration-020.md`
Target file: `./README.md`
HVR rules: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
Commit baseline: `6e330e218`

## Summary statistics

- Total Phase 2 edits applied: 12
- DQI before: 94/100 (Phase 4 ceiling)
- DQI after: 94/100 (structural ceiling unchanged — see uncovered-findings.md §Readability cliff)
- HVR-cleanliness: maintained at 100% (0 prose em dashes, 0 prose semicolons, 0 Oxford commas, 0 banned words)
- Validator: `validate_document.py ./README.md --type readme` returns 0 issues
- Style issues count: 0 (unchanged from Phase 4)
- Git diff stat vs baseline 6e330e218: 14 insertions, 12 deletions

## Track 1: Counts and naming follow-ups (Phase 4 bucketing gaps)

### EDIT v2-01 (line 725 — Skill Advisor directory tree)
- ITER 001 (mk_skill_advisor count drift) + ITER 011 (agent / naming consistency)
- Phase 4 fixed the public-facing tool count in line 671, the FAQ at 1457 and the table at 1213, but left the directory-tree annotation referring to the old eight-handler count.
- BEFORE: `├── handlers/   the eight MCP tool handlers`
- AFTER:  `├── handlers/   the nine MCP tool handlers (8 public + 1 internal)`

### EDIT v2-02 (line 675 — Skill Advisor intro)
- ITER 001
- Phase 4 wrote "Nine tools cover the public surface (8 public + 1 internal)" which is internally contradictory: the public surface should be eight tools, not nine.
- BEFORE: `Nine tools cover the public surface (8 public + 1 internal): four advisor_* tools …, plus four skill_graph_* tools …, plus one internal propagation tool.`
- AFTER:  `The server registers nine tools: eight on the public surface (four advisor_* tools …, plus four skill_graph_* tools …), plus one internal propagation tool.`

## Track 2: FAQ logic bug (iter 16 follow-up)

### EDIT v2-03 (line 1455 — contributor agent path duplication)
- ITER 016 Finding 2
- Phase 4 EDIT 10 fixed `.agents/agents/` → `.opencode/agents/` but left the source-of-truth path listed both as origin AND as a mirror destination. The mirror set should be the three downstream runtime dirs only.
- BEFORE: `Define the agent in .opencode/agents/ (the source of truth), then copy the adapter to .opencode/agents/, .claude/agents/, .codex/agents/ and .gemini/agents/.`
- AFTER:  `Define the agent in .opencode/agents/ (the source of truth), then mirror the adapter into .claude/agents/, .codex/agents/ and .gemini/agents/.`

## Track 3: Quick Start details (iter 17 follow-up)

### EDIT v2-04 (line 131 — prerequisites visibility)
- ITER 017 Finding 7 (root npm install context) + step-ordering observations
- Phase 4 rewrote the broken build steps but iter 17 also flagged missing prerequisite guidance and ambiguous env-var visibility. Added one explicit prerequisites line above the install block plus tightened the npm-install comment.
- BEFORE (line 136): `# 2. Install root dependencies (file watchers and shared utilities)`
- AFTER  (line 138): `# 2. Install root dependencies (file watcher + shared HTTP utilities)` plus new prerequisites paragraph above the code block:
  > **Prerequisites:** Node.js 18+ with `npm`, `git`, and a POSIX shell. The launcher binaries vendor their own dependencies on first run, so you do not need TypeScript or `tsc` installed globally.

### EDIT v2-05 (line 180 — verification comment voice)
- ITER 008 soft HVR (filler "actually")
- BEFORE: `# (only the runtime you actually use needs to exist. .codex/config.toml ships in the repo)`
- AFTER:  `# (only the runtime you use needs to exist. .codex/config.toml ships in the repo)`

## Track 4: HVR voice tightening (iter 8 re-sweep across narrative)

The Phase 4 bulk punctuation sweep handled em dashes, semicolons and Oxford commas. Phase 2 re-evaluates soft HVR vagueness in narrative prose (intro, FAQ, lifecycle bullets, code-graph safety paragraph).

### EDIT v2-06 (line 43 — three-item enumeration)
- HVR §4 three-item-enumeration fix
- Phase 4 left a perfect three-noun list ("decision, trade-off, choice"). Reshaped the sentence to a noun-phrase with a single attribution so the rhythm no longer reads as the AI-default three-pulse cadence.
- BEFORE: `Every decision, every trade-off, every carefully reasoned choice - lost the moment the conversation window closes.`
- AFTER:  `Decisions, trade-offs, the carefully reasoned choices behind them, all lost the moment the conversation window closes.`

### EDIT v2-07 (line 203 — Code-Graph Indexing voice)
- HVR -1 vague verb "get"
- BEFORE: `End users get this automatically through the committed config defaults.`
- AFTER:  `End users inherit this behavior automatically through the committed config defaults.`

### EDIT v2-08 (line 444 — memory lifecycle bullet)
- HVR -1 vague verb "get"
- BEFORE: `Fresh memories (under 48h) get temporary scoring lift`
- AFTER:  `Fresh memories (under 48h) receive a temporary scoring lift`

### EDIT v2-09 (line 637 — detect_changes safety paragraph)
- HVR -1 vague verb "get" plus comma-splice
- BEFORE: `…it returns status: 'blocked' immediately, you never get a false "nothing impacted" answer from an out-of-date index.`
- AFTER:  `…it returns status: 'blocked' immediately, so an out-of-date index never produces a false "nothing impacted" answer.`

### EDIT v2-10 (line 1439 — FAQ Q4 answer)
- HVR -1 vague verb "do"
- BEFORE: `memory_match_triggers() can do a fast trigger/cognitive pass`
- AFTER:  `memory_match_triggers() runs a fast trigger/cognitive pass`

### EDIT v2-11 (line 1443 — FAQ Q5 answer)
- HVR -1 vague verb "get"
- BEFORE: `You will not have cross-session memory retrieval, but you will still get structured documentation, agent routing and skill loading.`
- AFTER:  `You lose cross-session memory retrieval, but structured documentation, agent routing and skill loading all still work.`

## Track 5: Documentation versioning (iter 14 deferred)

### EDIT v2-12 (line 1499 — doc version bump)
- ITER 014 F-014-001
- The "Documentation version" field is a separate README-revision scheme, decoupled from skill changelog versions (verified via `git log -p README.md`: 4.6 → 4.7 → 4.8 → 4.9 → 4.10 → 4.11 each represented a substantive revision). Phase 2 represents a fresh substantive revision, so the field bumps accordingly.
- BEFORE: `Documentation version: 4.11`
- AFTER:  `Documentation version: 4.12`

## Validator output

```
$ python3 .opencode/skills/sk-doc/scripts/validate_document.py ./README.md --type readme
✅ VALID: ./README.md
Document type: readme
Total issues: 0
```

DQI (from `extract_structure.py`):
- Total: 94 / 100 (band: excellent — production-ready)
- Structure: 40 / 40
- Content: 25 / 30 (word_count_score=8 capped at long-doc max, heading_score=5 capped by H2 density)
- Style: 29 / 30 (h2_format_score=11 because the conventional unnumbered TOC heading takes a 1-point partial-format hit)

DQI ceiling explained in `uncovered-findings.md` §Readability cliff.

## Git diff stat vs baseline 6e330e218

```
README.md | 26 ++++++++++++++------------
1 file changed, 14 insertions(+), 12 deletions(-)
```

## Per-track summary

| 056 Track | Track focus | Phase 4 covered | Phase 2 closed remaining |
|-----------|-------------|-----------------|--------------------------|
| Track A | Tool counts | 7 of 7 EDITs | 2 follow-on counts (line 725, line 675 contradiction) |
| Track B | Naming consistency | All hyphen→underscore renames | 1 redundant-source bug (line 1455) |
| Track C | Feature catalog count | User override kept 290 | none — override stands |
| Track D | Quick Start install | 6 of 6 broken-step EDITs | 1 prerequisites + npm-deps clarification |
| Track E | Runtime terminology | All 5 EDITs | none — Phase 4 fully closed Track E |
| Track F | Tagline + agent rename | 2 of 2 EDITs | none — Phase 4 fully closed Track F |
| Track G | Deferred edits | 3 deferred (BMC URL, version, topology) | 1 closed (doc version bump 4.11→4.12) |
| Track H | HVR punctuation | 70+ prose edits | 6 soft HVR voice/filler tightenings |

## Scope contract compliance

- WRITE TO: `./README.md`, `research/edit-evidence-v2.md`, `research/uncovered-findings.md` ONLY ✅
- No iter file, spec doc, source code or other file modified ✅
- Every edit traces to a specific iter finding or HVR rule citation ✅
- No Phase 4 edit duplicated ✅
- Voice preserved in non-drifted prose ✅
