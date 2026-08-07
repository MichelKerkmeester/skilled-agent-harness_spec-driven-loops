# Iteration 001 — KQ1: SKILL DOCS smart-router fidelity + frontmatter uniformity

**Focus:** Granular per-skill on-write DQ checks beyond the DQI band scorer (the dq-probe F1 headline). What can be automated below that headline.

## Findings

### F1.1 — The DQI scorer is real, deterministic, per-type — and cross-skill-blind + manually invoked
`sk-doc/scripts/extract_structure.py` is a 100% deterministic DQI: structure_score = checklist_pass_rate/100*40, plus content_score over word_count / heading_density / code_blocks / structure_data, with per-type `CONTENT_THRESHOLDS` for `skill | readme | asset | reference | command` (`extract_structure.py:892-1048`, `:972`). It parses frontmatter and emits issues (`:33-60`), runs type-specific checklists, and style checks (H2 ALL CAPS, H3 emoji, dividers). `[SOURCE: .opencode/skills/sk-doc/scripts/extract_structure.py:1-60,892-1048]`
- **Granular gap below dq-probe's "wire it into a gate":** the scorer scores ONE file against ONE type threshold. It has **no cross-file, no cross-skill, and no frontmatter-grammar** awareness. Three net-new on-write checks layer on top of it without touching its scoring:
  - **(a) Frontmatter `version` grammar check.** Census of the 20 SKILL.md: the majority use a 4-part `MAJOR.MINOR.PATCH.BUILD` form (`sk-code 3.5.0.0`, `cli-codex 1.4.10.0`, `mcp-figma 1.0.0.0`), but `deep-loop-workflows 1.0.0`, `deep-loop-runtime 1.4.0`, `system-skill-advisor 0.6.0`, `sk-design-md-generator 1.0.0` use a 3-part form. No regex enforces a single grammar. `[SOURCE: grep ^version: .opencode/skills/*/SKILL.md — 20 hits, 2 distinct grammars]`
  - **(b) Frontmatter field-presence uniformity.** All 20 carry `version` + `allowed-tools`, but only **1 of 20** (`sk-git`) carries `argument-hint`. The required-field set is not asserted uniform; DQI checks presence per-type but does not assert a single canonical SKILL.md frontmatter schema across the corpus. `[SOURCE: grep argument-hint: → 1 file; grep allowed-tools: → 20 files]`
  - **(c) The per-type checklist already exists but is unwired to the advisor** — see F1.2.

### F1.2 — The advisor maintains a derived routing graph with EMPTY-by-default defect slots — a ready-made smart-router fidelity gate
`system-skill-advisor/mcp_server/database/skill-graph.json` is a generated snapshot (`"generated_at":"2026-06-05T08:10:20Z"`, `"skill_count":20`) holding `families`, weighted `adjacency` (siblings / enhances / depends_on / prerequisite_for), plus first-class **`topology_warnings`**, **`conflicts`**, `hub_skills`, and `signals` slots. `[SOURCE: skill-graph.json:1 + key census]`
- This is the smart-router fidelity substrate the topic asks for. The graph is **derived from SKILL.md frontmatter/keywords**, generated at a fixed timestamp (2026-06-05), so it **drifts** the moment a SKILL.md's triggers/keywords/enhances edges change without a regenerate.
- The MCP surface to keep it fresh **already ships**: `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_validate`, `skill_graph_propagate_enhances` are all live advisor tools (seen in the tool registry). So a granular on-write feature is fully reuse-first: **regenerate + validate the skill-graph on any SKILL.md frontmatter/keyword edit, asserting zero NET-NEW `topology_warnings` / `conflicts`.** No green-field build — wire `advisor_rebuild`→`advisor_validate` into the same commit-hook lane that already runs the 5 code/tool gates (dq-probe regime #2).
- Distinct from dq-probe F2 (which widens the *post-save-review trigger check* to skill docs): this is a **graph-topology** gate, not a per-doc trigger check. It catches routing-ambiguity and broken-edge defects a per-file scorer structurally cannot see.

## Dead Ends / Ruled Out
- **Treating the DQI scorer as already cross-skill-aware** — it is strictly single-file/single-type; cross-skill consistency is out of its scope by construction. `[SOURCE: extract_structure.py:949-972 — doc_type lookup is per-invocation]`
- **Assuming version/frontmatter grammar is already enforced** — grep finds 2 version grammars live with no linter; the divergence is real and unguarded.

## Assessment
- **newInfoRatio:** 0.85 — first substantive pass; the skill-graph-drift gate and the frontmatter-grammar/field-uniformity checks are net-new granular features the prior lineages named only as "wire the DQI scorer."
- **Novelty justification:** moves below dq-probe's single headline to three concrete, reuse-first on-write primitives grounded in the advisor's already-shipped `topology_warnings`/`conflicts` slots and a counted frontmatter census.
- Questions answered: KQ1 (partial — on-write skill-doc granular checks identified; cross-skill consistency deferred to KQ2).
