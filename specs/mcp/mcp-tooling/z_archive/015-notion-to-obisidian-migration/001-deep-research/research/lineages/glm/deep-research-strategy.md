---
title: "Deep Research Strategy — GLM Lineage (Track A)"
trigger_phrases: []
---
# Deep Research Strategy — GLM Lineage (Track A)

> Lineage `glm` (cli-devin / GLM-5.2 High). Sibling lineage: `deepseek`. Stop policy: `max-iterations` (10); convergence is telemetry only — broaden review angles instead of synthesizing early.

---

## Research Topic

Flawless complex Notion→Obsidian migration leveraging `mcp-notion` (read surface) and `mcp-obsidian` (write surface) plus Obsidian plugins that close feature gaps. Full scope is bound in the spec folder `spec.md`.

## Known Context (seeded from prior-findings.md + spec.md)

- **Prior verdict (provisional):** Notion **API** import for a database-heavy workspace — the only path that reconstructs databases as Bases automatically. HTML `.zip` only when a token cannot be minted. [SOURCE: prior-findings.md §1]
- **Bases** is core since Obsidian v1.9 (mid-2025); `.base` files + frontmatter; no native two-way relational schema or rollups out of the box (per prior note — TO BE REFINED). [SOURCE: prior-findings.md §2]
- **Plugin stack (prior):** Notion Bases community plugin (`bgarciamoura/obsidian-notion-bases-plugin`) for relations/rollups/formulas/extra views; Dataview for rollups without a new plugin; Tasks for recurring tasks; Kanban/Calendar optional. [SOURCE: prior-findings.md §3]
- **Process shape:** inventory → test vault → import → reconstruct → acceptance checklist. [SOURCE: prior-findings.md §4]
- **AI agent role:** file-layer work around the import — `mcp-obsidian` "operate the data, not the UI" doctrine. [SOURCE: prior-findings.md §5]
- **mcp-notion surface:** official `@notionhq/notion-mcp-server`, 24 tools (pages 7, blocks 5, data sources 6, comments 2, users 3, search 1) + 5 API gaps (file uploads, views, page property items, async tasks, daily notes). API 2.0: data sources replace databases; relations single/dual; rollups 14 functions; Formulas 2.0 ~50 functions. [SOURCE: mcp-notion/SKILL.md, database-model.md, api-gap-tools.md]
- **mcp-obsidian surface:** notesmd-cli (headless, filesystem), official `obsidian` CLI (app-backed), cyanheads MCP (14 tools, needs Local REST API + running app); plugin file-layer knowledge (Dataview, etc.). [SOURCE: mcp-obsidian/SKILL.md, mcp-tools.md]
- resource-map.md not present; skipping coverage gate.

## Key Questions

1. **Q1 Importer choice:** For a complex, database-heavy Notion workspace, which importer path (Notion API vs HTML zip) preserves the most, and exactly what does each preserve vs drop? *(Refine the prior provisional verdict.)*
2. **Q2 mcp-notion read surface:** Exactly which mcp-notion tools (24 MCP + 5 API gaps) read each Notion artifact during the inventory phase, and what are their limits (truncation, title-only search, rate limits)?
3. **Q3 mcp-obsidian write surface:** Exactly which mcp-obsidian tools (notesmd-cli / MCP / plugin file-layer) write each Obsidian artifact during reconstruction, and what are their limits (headless vs app-backed, no pixels)?
4. **Q4 Relations & rollups recovery:** How do Notion single/dual relations and the 14 rollup functions map to Obsidian? What does the importer auto-convert, what needs the Notion Bases plugin vs Dataview vs hand-authored `.base` formulas, and what is the verified recovery path per relation/rollup type?
5. **Q5 Formulas 2.0 recovery:** How do Notion Formulas 2.0 (~50 functions across logical/text/math/date/person/list families) map to Obsidian Bases formulas / Dataview / Notion Bases plugin formulas? What converts automatically, what needs hand-translation, what has no equivalent?
6. **Q6 Files, attachments & comments:** What is the verified path for Notion file uploads/attachments and discussion comments into Obsidian? What does the importer carry, what is a gap, and how do mcp-notion reads + mcp-obsidian writes close each gap?
7. **Q7 Multi-view databases & nested hierarchy:** What happens to Notion's 10 view types, multi-view databases, and nested page/sub-page hierarchy on import? What survives, what needs reconstruction, and via which tools?
8. **Q8 Required vs optional plugins:** Which Obsidian plugins are REQUIRED to close a feature gap vs OPTIONAL, ranked against `mcp-obsidian`'s existing plugin knowledge? Install/config notes per plugin.
9. **Q9 Division of labor:** The exact mcp-notion-reads / mcp-obsidian-writes mapping for each migration step (inventory, import, relation reconstruction, file/attachment carry-over, comment carry-over, view reconstruction, verification).
10. **Q10 Parity & verification:** How to confirm a migrated workspace matches the source with no silent loss — programmatic pass/fail checks via mcp-notion reads + mcp-obsidian/grep verification.

## Answered Questions

All 10 key questions answered with cited evidence (10/10). See `findings-registry.json` for per-question verdicts and `research.md` for the synthesis.

- Q1 Importer choice — answered (iter 1): API import primary; HTML fallback only when no token.
- Q2 mcp-notion read surface — answered (iter 2): 24 MCP + 5 API gaps mapped to a 7-step inventory procedure.
- Q3 mcp-obsidian write surface — answered (iter 3): notesmd-cli (headless primary) + plugin file-layer; MCP optional.
- Q4 Relations & rollups recovery — answered (iter 4): importer auto-converts; dual relations + interactive rollups via Notion Bases plugin; Dataview read-only.
- Q5 Formulas 2.0 recovery — answered (iter 5): hybrid/static strategy; style/name/email no equivalent; VERIFY dateBetween/dateRange.
- Q6 Files, attachments & comments — answered (iter 6): attachments carried; comments confirmed gap (MCP comment-list → ## Comments + comment_count).
- Q7 Multi-view databases & nested hierarchy — answered (iter 7): only table view imports; core 4/10, plugin 7/10, 3/10 lost; hierarchy preserved.
- Q8 Required vs optional plugins — answered (iter 8): required = Core Bases + Notion Bases plugin + Dataview.
- Q9 Division of labor — answered (iter 9): 7-step method, Mode A (human Importer) + Mode B (agent gap-closing), headless-capable.
- Q10 Parity & verification — answered (iter 10): 11 parity checks + auto-preserved-vs-reconstruct matrix + final method decision.

## What Worked

_(populated per iteration)_

## What Failed

_(populated per iteration)_

## Exhausted Approaches

_(populated per iteration)_

## Ruled-Out Directions

_(populated per iteration)_

## Next Focus

**Iteration 1:** Q1 — Importer choice deep-dive. Verify the prior provisional verdict (API import for database-heavy spaces) against the live Obsidian Importer source/docs; enumerate exactly what the API importer preserves (databases→Bases, formulas, relations, rollups, attachments, hierarchy) vs drops (comments, secondary views, linked data sources), and contrast with the HTML zip route.

## Non-Goals

- Implementing anything in `mcp-notion` or `mcp-obsidian` (phase 002+).
- Installing any Obsidian plugin or wiring new tooling (phase 002+).
- A live migration of any real Notion workspace (phase 002+ build/verification).
- Replacing the seeded `prior-findings.md` conclusions — this loop extends and refines them, citing evidence where it supersedes.

## Stop Conditions

- `max-iterations` reached (10) — the configured stop policy. Convergence signals are telemetry only and MUST NOT trigger early synthesis; instead broaden the review angle for the next iteration.
- Unrecoverable state corruption (not expected in this fan-out lineage).
- All 10 key questions answered with cited evidence before iteration 10 (telemetry only — still continue to broaden angles per the stop policy).

## Active Risks

- The Notion API importer is comparatively new; relational data flagged "verify" upstream — treat imported relations/rollups as suspect until independently verified. [SOURCE: prior-findings.md §1]
- WebFetch blocklist / rate limits may reduce source diversity — fall back to WebSearch + cached docs.
- Two-track fanout may finish tracks at different iteration counts — the parent orchestrator verifies both ledgers reach 10/10 before merging.
