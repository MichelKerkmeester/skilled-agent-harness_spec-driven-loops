---
title: "Command Meaning Matching"
description: "A command row can pass on meaning when the prompt's real embedding sits close to the row's own vector, so a paraphrase that shares no words with a command can still reach it."
trigger_phrases:
  - "command meaning matching"
  - "command row embedding"
  - "vec_cmd table"
  - "command meaning anchor"
version: 1.0.0.0
---

# Command Meaning Matching

## 1. OVERVIEW

A command row can pass on meaning when the prompt's real embedding sits close to the row's own vector, so a paraphrase that shares no words with a command can still reach it.

A command row used to pass only on one of its own phrases or its slash string. A paraphrase shares none of those words, so it reached nothing. Meaning matching adds a second way in. It works only when the local embedder runs. Without it the advisor returns the phrase-only result.

---

## 2. HOW IT WORKS

### Command Vectors

`derive-command-bridges.cjs` writes an `embeddingText` for each command row the TypeScript scorer serves, 45 rows in all. A metadata row leads with its `userIntent.job` sentence and adds its owned phrases. The `description` stands in only when the record states no job. A doctor row uses its router's frontmatter `description` and the route's trigger phrases. Slash command strings are stripped from the text.

`skill_graph_scan` embeds that text into a separate `vec_cmd_<dim>` table. The table carries no foreign key, and the skill vector table is left untouched. A row whose text hash has not changed is skipped. A stored row that the deriver no longer generates is pruned.

### Passing on Meaning

`requireCommandPhraseAnchor` in `fusion.ts` keeps a command row passing when it matched its own phrase. A row with no phrase match can still pass when the semantic lane reports a real embedder cosine of at least `COMMAND_MEANING_MIN_COSINE` (0.72). It must also lead the strongest other command row by `COMMAND_MEANING_MARGIN` (0.02). The row is then lifted to the confidence threshold and marked as a meaning pass. The word-overlap stand-in used under test reports its score differently, and it never counts.

### Eligibility

A meaning pass lifts a command past the read-only confidence floor, so `commandMeaningEligible` asks the question that floor asks of a phrase match. A prompt matching `NO_EDIT_REQUEST`, such as "no edits", "do not change", "just show" or "just list", rules out every command on meaning. A read-only explainer prompt admits only a command marked `readOnly`, because running it is the answer. `readOnlyRouteAllowed` reads the same pattern, so the two gates cannot drift apart.

### Ranking

`rankMeaningPassedCommandFirst` moves the best meaning-passed command to first place only when its cosine leads the top passing skill's cosine by the same 0.02. Otherwise the skill keeps its place and the command follows it.

### Measuring It

`capture-command-routing-baseline.mjs --real-embedding` scores the command corpus against this machine's skill graph and live embedder. It first checks that the embedder serves `nomic-embed-text` and that a `vec_cmd_*` table holds vectors, and it refuses `--write`. The committed baseline still comes from the fixture run, which has no real cosine.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | Script | Builds each row's `embeddingText` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Generated | Carries `embeddingText` per TypeScript-served row |
| `.skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts` | Shared | Names and creates the `vec_cmd_<dim>` table |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Shared | Embeds, skips and prunes command vectors during a scan |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Shared | Meaning pass, its two bars, eligibility and the ranking rule |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Script | The `--real-embedding` measurement |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts` | Vitest | 17 cases: cosine bar, margin, stand-in refusal, eligibility and ranking rule |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts` | Vitest | Generated bridge file matches the deriver |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/command-meaning-matching.md`

Related references:

- [doctor-command-routing.md](./doctor-command-routing.md) - The phrase anchor that command rows pass on by default.
- [five-lane-fusion.md](./five-lane-fusion.md) - The semantic lane that supplies the cosine.
