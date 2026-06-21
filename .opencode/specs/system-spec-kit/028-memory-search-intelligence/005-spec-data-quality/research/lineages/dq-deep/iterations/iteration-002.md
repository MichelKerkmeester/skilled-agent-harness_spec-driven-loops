# Iteration 002 - KQ2: Retroactive / sweep automation and its gaps

**Focus:** Inventory retroactive automation (reindex, backfill, retention, doctor, ingest, drift) and find the missing quality-maximizing retroactive features.
**newInfoRatio:** 0.82
**Novelty:** Maps the retroactive surface and shows it is index-drift-focused detect-and-recommend, operator-triggered, with no continuous content-quality sweep and (almost) no auto-remediation.
**Status:** complete

## What I examined
- Retroactive scripts: `backfill-frontmatter.ts`, `backfill-research-metadata.ts`, `reindex-embeddings.ts`, `migrate-trigger-phrase-residual.ts`, `ops/process-sweep.ts` [SOURCE: file listing]
- `/doctor memory` route YAML (full read) [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:1-243]
- `doctor/scripts/audit_descriptions.py` (header) [SOURCE: .opencode/commands/doctor/scripts/audit_descriptions.py:1-40]
- MCP retroactive tool surface: `memory_retention_sweep`, `memory_embedding_reconcile`, `memory_drift_why`, `memory_index_scan`, `memory_validate` [SOURCE: deferred-tool inventory]

## Findings

### F1. Retroactive automation exists but is three things at once: drift-focused, operator-triggered, detect-only
- `/doctor memory` is **read-only by contract** (`doctor_memory.yaml:21-27,45`). It classifies seven drift signals — `embedding_drift`, `fts_miss`, `chunk_boundary_drift`, `trigger_phrase_drift`, `embedding_provider_change`, `divergent_alias_groups`, `hard_exclusion_risk` (`:118-139`) — and only **recommends** `/doctor:update`; it never remediates (`:188-198`).
- The drift signals measure **index freshness vs source**, not **content quality**. `trigger_phrase_drift` = "frontmatter trigger_phrases updated but indexed alias rows stale" (`:128-129`) — it catches the index lagging the doc, never that the trigger phrases themselves are weak or duplicated.
- The backfill scripts (`backfill-frontmatter.ts`, `backfill-research-metadata.ts`) DO refine documents (normalize frontmatter, dry-run/apply), but they are **one-shot manual migrations**, not a standing sweep.

### F2. THE GAP: no retroactive content-quality sweep
There is no automated pass that scores or improves the *substance* of the corpus over time:
- No corpus-wide detector for generic/duplicate `trigger_phrases`, generic `description`, empty/placeholder executive summaries, or stale status claims as a *quality* signal (distinct from index drift).
- The single closest tool, `audit_descriptions.py`, audits description **budget/length bloat** across skills/commands/agents (`:6-31`) — a length-and-drift signal, not a semantic-quality signal.
- Net: the retroactive layer keeps the **index** honest; nothing keeps the **content** good.

### F3. THE GAP: no scheduled / hook-driven invocation ("most automated")
Every retroactive tool is invoked by hand (an operator runs `/doctor`, `/doctor:update`, or a backfill script). The topic asks for "the most automated and perfected data quality possible." There is no cron/scheduled DQ sweep and no post-merge hook that runs a corpus quality pass. Automation headroom: a standing scheduled sweep that (a) runs the quality detectors from F2, (b) auto-applies safe remediations, (c) files the rest as a report.

### F4. Auto-remediation is nearly absent
`/doctor memory` forbids writing into packet docs (`:65-83`); remediation is quarantined to `/doctor:update` (index rebuild only). So even where a fix is mechanical and safe (regenerate a malformed graph-metadata.json, normalize frontmatter), the retroactive path stops at "recommend." A guarded auto-fix tier (safe-fix on write/sweep, report-only for risky) is the missing capability.

### F5. Floor-law placement (inherited)
Retroactive content-quality fixes to adherence/logic fields (summary, requirements, status, frontmatter) bypass the truncation floor and ship on cost. Retroactive `trigger_phrases`/`description` quality improvements touch the retrieval surface but are field-hygiene on already-weighted fields, not new floor-cut rows. Only a retroactive *re-embed* (reindex-embeddings.ts) is the floor-taxed, prod-mode-proof-gated class — consistent with the parent's Stage 5 gate.

## Dead Ends / Ruled Out
- `/doctor memory` as a content-quality tool: ruled out — read-only, index-drift-scoped, forbids packet-doc writes (`doctor_memory.yaml:65-83`).
- Treating existing backfill scripts as "continuous automation": ruled out — they are one-shot manual migrations, not standing sweeps.

## Answers
- **KQ2 answered:** Retroactive automation = drift-detection (`/doctor memory`, read-only) + manual one-shot backfills + index rebuild (`/doctor:update`). Missing: a continuous content-quality sweep, scheduled/hook invocation, and a guarded auto-remediation tier.

## Next focus
KQ3: how the two metadata JSONs can be auto-enriched on write for retrieval/adherence/logic, respecting which fields bypass the floor.
