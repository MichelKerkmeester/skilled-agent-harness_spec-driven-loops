---
title: "Iteration 9: Separate yet integrated — where it lives, spec and skill binding"
trigger_phrases: []
---
# Iteration 9: Separate yet integrated — where it lives, spec and skill binding

## Focus
Angle (g): concrete placement of the replacement system so it is separate from constitutional memory and from spec-doc templates, but integrated with packets and skills.

## Actions Taken
- Combined iters 3–8 into a placement design against content-router, spec-doc versioning (shared fact), skill-advisor identity files, and always-on loaders.
- Checked that a new required spec-doc would hit manifest + content-router + spec-doc-structure.ts + golden + dist.

## Findings

### F-B9.1 Three layers, three directories — do not invent a fourth memory DB
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/routing/content-router.ts:23-32,1086-1094]
[SOURCE: AGENTS.md:39-41]
[SOURCE: .opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md] (advisor identity files at skill root; cited from AGENTS.md skill-routing)

| Layer | Path | Binding |
| --- | --- | --- |
| **Always-on digest** | Repo-root `.opencode/DECISIONS.md` (or `DECISIONS.md`) + Cursor `.cursor/rules/decisions.mdc` with `alwaysApply: true` whose body is "follow `.opencode/DECISIONS.md`" **or** the digest itself if it stays tiny. Claude: one `@.opencode/DECISIONS.md` line in CLAUDE.md (accepts launch-load token cost; keep digest small). | Git. No MCP. No spec-doc manifest. |
| **Per-spec system of record** | Existing `decision-record.md` (L3+) / `implementation-summary.md` decisions (L2). Resume: `_memory.continuity` in implementation-summary only. | content-router + validate.sh anchors. **Do not add a new required packet file.** |
| **On-demand query** | Existing `memory_search` over spec docs (`includeConstitutional: false`). Optional later `/memory:decisions` alias. | MCP when the operator/agent searches. |

"Separate" = digest is not `constitutional/`, not `memory_index.importance_tier`, not learned_triggers. "Integrated" = router still writes ADRs into packets; digest **points at** packet ADRs; skills may cite digest headings; advisor does not ingest the digest (iter 8).

### F-B9.2 Do not put the digest inside a spec packet
[SOURCE: shared fact in strategy]
A packet-local `decisions.md` required file would be a VERSIONED spec-doc change. This lineage's replacement must not depend on that Workstream A change. Even after A, a global always-on file is still required (packet files are not auto-loaded every turn).

### F-B9.3 Skill binding is citations, not a new advisor lane
Skill roots already have `graph-metadata.json` as advisor identity (AGENTS.md §9). Do not add `importance_tier: constitutional` to skills. If a skill must obey a standing decision, SKILL.md links to `DECISIONS.md#id`. Path-scoped Cursor rules / `.claude/rules/` can attach Fable/goal-prompting rules when those surfaces are in play (iter 6) — that is integration via **the vendor's scoped-load bus**, which constitutional search never had.

### F-B9.4 Write path for new standing decisions
Today `/memory:learn` writes `constitutional/*.md` then `memory_save`. Replacement: operator/agent appends a short entry to `DECISIONS.md` (and a packet ADR if it is packet-scoped, via existing `/memory:save` → content-router `decision`). No indexer required for the digest to be active. Optional: a CI check that `DECISIONS.md` stays under N lines and that `supersedes:` IDs exist.

## Questions Answered
Q-B7 answered: `.opencode/DECISIONS.md` + alwaysApply/CLAUDE @-import; packets keep ADR/continuity; search remains on-demand over spec docs; skills cite; no new spec-doc; no new DB tier.

## Ruled Out
- `specs/_global/decision-record.md` as always-on (not loaded by Cursor/Claude unless imported).
- Reusing `constitutional/` as the digest folder while still indexing it (keeps the failed bus).
- Skill-advisor `matchedDocs` harvest of constitutional markdown as the every-turn surface (only on recommend, and not every runtime).

## Assessment
- newInfoRatio: 0.35
- noveltyJustification: Placement constraints against the versioned spec-doc contract and skill-root metadata contract; scoped vendor rules as the home for Fable/goal leftovers.
- confidence: high.

## Recommended Next Focus
Synthesis pass: full-deprecation vs keep-rules-as-docs verdict plus ranked (value × risk) recommendations across all B angles.
