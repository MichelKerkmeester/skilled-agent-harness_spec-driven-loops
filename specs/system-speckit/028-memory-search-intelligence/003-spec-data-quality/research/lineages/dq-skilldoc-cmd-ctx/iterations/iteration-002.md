# Iteration 002 — KQ2: SKILL DOCS cross-skill consistency

**Focus:** Cross-skill automation — trigger/keyword collision, advisor-routing ambiguity, `[[wikilink]]` skill-graph integrity, enhances-edge propagation hygiene.

## Findings

### F2.1 — THREE divergent skill keyword/trigger surfaces with no coherence gate
A skill's routing identity is spread across three independently-authored surfaces that no automation reconciles:
1. **`<!-- Keywords: ... -->`** HTML comment in `SKILL.md` — hand-curated, present in only **17 of 20** skills. `deep-loop-runtime` (confirmed) and two others carry none. `[SOURCE: grep "<!-- Keywords:" → 17 hits; grep -L on deep-loop-runtime/SKILL.md → no match]`
2. **Frontmatter `trigger_phrases`** — used on references and handler docs (e.g. `propagate_enhances.md:4-7`), NOT on the SKILL.md hub frontmatter.
3. **Advisor `signals`** in `skill-graph.json` — the *actual* routing surface (e.g. `cli-claude-code: ["claude code","claude cli","delegate to claude"]`). `[SOURCE: skill-graph.json signals slot]`
- **Granular feature (net-new):** an on-write coherence assertion that every high-weight advisor `signal` traces back to a Keywords/`trigger_phrases` token, and that every SKILL.md carries the Keywords comment. This is subset/superset coherence across the three surfaces — more specific than dq-deep's A5 (which asserted `trigger_phrases` coherence across the *metadata JSONs*; this is the *skill-routing* surface).

### F2.2 — Cross-skill routing collision is a LIVE, measured phenomenon — and ungated
The advisor already emits routing **ambiguity** at runtime: this very session's `UserPromptSubmit` hook reported `ambiguous: deep-loop-workflows 0.95/0.16 vs sk-code 0.92/0.16`. `[SOURCE: UserPromptSubmit hook brief, this session]` The `skill-graph.json` carries first-class **`conflicts`** (currently `[]`) and **`topology_warnings`** (present, count 1) slots, and `advisor_validate` is a live MCP tool. `[SOURCE: skill-graph.json conflicts:[] + topology_warnings key]`
- **Granular feature (net-new):** an on-write collision gate — when a SKILL.md's Keywords/signals change, recompute the advisor signal set and **fail if it introduces a new high-confidence near-tie** (two skills within a small delta on the same prompt class), persisting it into the `conflicts` slot. The substrate (ambiguity scoring + conflicts slot + advisor_validate) is fully shipped; only the gate wiring is missing. This is the smart-router *quality* lever the topic names, and it is invisible to any per-file DQI scorer.

### F2.3 — CORRECTION of dq-probe F5: the skill `[[wikilink]]` validator ALREADY EXISTS
dq-probe F5 proposed "extend the wikilink/anchor integrity validators to the skill `[[name]]` reference graph" as if unbuilt. In fact `system-spec-kit/scripts/rules/check-links.sh` is titled "Validates wikilinks across skill markdown files," has a `scan_wikilinks()` function, is **fence-aware** (strips fenced/inline code, handles escaped backticks), and exits 0 (resolve) / 1 (broken). `[SOURCE: check-links.sh:5,9-10,25,40-50]`
- **Corrected granular gap:** the lever is built and even robust; the real gap is that it is a spec-kit *rules* script not wired into (a) the on-write commit-hook lane that runs the 5 code/tool gates, nor (b) a scheduled corpus sweep. The feature is **wiring + scope**, not building. Negative knowledge: do NOT re-spec a wikilink validator.

### F2.4 — enhances-edge reciprocity hygiene is detectable today
`skill_graph_propagate_enhances` "detects and optionally applies missing inbound `enhances` edges across skills," report-first, write only on trusted-caller intent. `[SOURCE: propagate_enhances.md:1-30; handlers/skill-graph/propagate-enhances.ts]`
- **Granular feature:** run it in **detect mode** as an on-write check after any SKILL.md `enhances`/`depends_on` edit and assert zero missing inbound edges (graph stays reciprocal). Reuse-first; the handler exists.

## Dead Ends / Ruled Out
- **Re-spec a skill wikilink validator (dq-probe F5)** — already exists, fence-aware, exit-coded. `[SOURCE: check-links.sh:5,25]`
- **Treating `conflicts:[]` being empty as "no collision risk"** — ambiguity is measured live (0.95 vs 0.92) yet not persisted to the slot; empty means *ungated*, not *clean*.

## Assessment
- **newInfoRatio:** 0.80 — four cross-skill primitives, one of which corrects a prior-lineage claim (negative knowledge), grounded in the live ambiguity readout and the advisor's shipped conflict slots.
- **Novelty justification:** cross-skill collision/coherence and enhances reciprocity are structurally invisible to per-file scorers; the correction of dq-probe F5 narrows the program from "build" to "wire."
- Questions answered: KQ2.
