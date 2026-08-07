DEEP-RESEARCH

# Deep-Research Iteration 063 — 026-dedup: 005 metadata-promoter vs shipped relation-backfill.ts

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite every claim `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 026 is CLOSED. It SHIPPED `relation-backfill.ts` (causal relation inference: promotes spec-document chains + lineage links into `created_by='auto'` causal edges; bounded, dry-run default, reversible; similarity `supports` + structural `contradicts` collectors; a conflict guard refuses to invalidate a valid edge).
- 027 Phase 005 (`005-metadata-edge-promoter`) planned to promote validated frontmatter metadata (`graph-metadata.json` parent/children/parentChain + manual.depends_on/supersedes/related_to) into causal edges.
- The 2026-06-05 audit said: 005 partially OVERLAPS relation-backfill.ts but relation-backfill scans doc-chain/lineage/similarity, NOT index-time promotion from packet metadata; `manual.*` already wired as `created_by='manual'`; `parent_id`/`children_ids`/`parentChain` parsed but NOT promoted; no `extraction_method`/`confidence` columns. VERIFY this against live code.

## FOCUS — answer only this
Determine exactly what 005's remaining scope is after the shipped relation-backfill.ts, and what is now redundant.
Read:
1. `005-metadata-edge-promoter/spec.md`
2. The live `relation-backfill.ts` (find it: `grep -rl "relation-backfill\|relationBackfill\|created_by.*auto" .opencode/skills/system-spec-kit/mcp_server/lib/ | head`; also try `lib/storage/`, `lib/governance/`, `lib/causal/`).
3. Where `manual.depends_on`/`supersedes`/`related_to` and `parent_id`/`children_ids`/`parentChain` are parsed/promoted (grep the mcp_server lib).

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-063-NN] <claim>` + `file:line`. Must answer:
- What does relation-backfill.ts actually promote, and from what sources? (cite)
- Is the `manual.*` triplet already wired? as `manual` or `auto`? (cite)
- Are `parent_id`/`children_ids`/`parentChain` promoted today, or only parsed? (cite)
- Do `extraction_method`/`confidence` provenance columns exist? (cite the schema)

### NARROWED_SCOPE_005
The precise residual 005 scope after dedup (bullet list), and what to DROP as redundant-with-relation-backfill.

### VERDICT
005 = {KEEP-NARROWED | REFINE | MERGE-INTO-relation-backfill | REMOVE} + one-line justification.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
