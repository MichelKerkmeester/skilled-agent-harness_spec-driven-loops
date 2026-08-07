# Deep Research Strategy

## Research Topic

Root-cause synthesis of the system-spec-kit / 026 deep-review audit.

## Known Context

- Target charter: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md` asks for root-cause hypotheses, blast-radius estimates, and calibrated severity for five audit questions. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md:36]
- Parent audit scope: the campaign covers system-spec-kit MCP core, 026 integrity, catalog/playbook, governance, interconnected MCPs, and 027 launch state, with reviewed code treated as read-only and only packet artifacts written. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/spec.md:52]
- Sibling review slices provide merged finding registries under `001-*` through `008-*`; they are the primary evidence inventory for this synthesis.
- `resource-map.md` was not present in the target spec folder at init; skipping the resource-map coverage gate for input context.

## Key Questions

- Q1: Are schemas, handlers, docs, and catalog/playbook generated from one contract or hand-maintained from divergent sources of truth?
- Q2: Is metadata drift a generate-context / graph-metadata-backfill systemic defect or isolated manual edits, and how many packets appear affected?
- Q3: Do entity-density cache staleness and atomic-save ordering corrupt retrieval or graph-channel routing under normal single-user operation?
- Q4: Under a local single-user MCP threat model, how should the community fallback and bare-ID causal tools be severity-calibrated?
- Q5: Could fan-out runtime defects have silently masked failed lineages or under-delivered concurrency, and which artifacts are suspect?

## Answered Questions

- Q1 answered: the recurring doc/schema/handler/catalog/playbook drift is best explained by divergent hand-maintained contracts. Evidence: `memory_embedding_reconcile` public schema, Zod allow-list, handler/runtime, install guide, and feature catalog disagree about `mode`/`dryRun` and `activeOnly`.
- Q3 answered: entity-density staleness can corrupt graph-channel routing signals during the in-process cache window; atomic-save ordering is a narrower crash-window consistency risk, not continuous successful-save corruption.
- Q2 answered: metadata drift is systemic but not one generator defect. Active-child pointers are canonical-save-owned and preserved by graph refresh; draft placeholder summaries can be promoted to `complete` by status heuristics; resource maps and changelog rollups are stale snapshot/catalog surfaces; description metadata can retain stale renumbering when not regenerated.
- Q4 answered: community fallback and ID-only causal graph tools are genuine governed-scope defects, but local single-user MCP calibrates them to P1 high correctness/privacy-boundary risk. P0 requires shared untrusted principals or untrusted remote callers.
- Q5 answered: the fan-out code path can mask nonzero CLI exits and serialize a single multi-lineage process; current eight review slices have per-lineage sentinels, but their orchestration summaries are suspect because each reports one lineage while ledgers record five.

## What Worked

- Initialized from the explicit 009 research charter and the eight sibling merged review registries.
- The merged registries collapse naturally into six recurring families: MCP contract drift, memory write correctness, governed-scope/security boundaries, 026/027 metadata drift, catalog/playbook verification drift, and deep-loop executor reliability.
- Direct source reads separated runtime-impacting drift from purely stale documentation. `activeOnly` is exposed but not consumed; `dryRun:false` is stale relative to `mode:"apply"`.
- Entity-density tests demonstrate stale routing signal behavior without requiring a full MCP session.
- Metadata drift split into five mechanisms with different owners: canonical save chronology, graph status heuristics, resource-map snapshots, description regeneration, and changelog rollups.
- Comparing normal scoped retrieval with community fallback gave a clean severity distinction: the bypass is real, but threat model controls P0 vs P1.
- Cross-checking `orchestration-summary.json`, `orchestration-status.log`, and `fanout-lineage.out` avoided overclaiming missing lineages.

## What Failed

- Code Graph is unavailable in this session; research will use `rg`, direct reads, and existing review artifacts.
- Raw registry rows duplicate near-identical findings from different lineages; synthesis must deduplicate by symptom and evidence.
- No one-stop contract manifest was found that generates public MCP schemas, Zod validation, operator docs, catalog entries, and playbook scenarios from one source.
- A first 027 draft-folder check used stale slugs; the live phase map corrected the names and confirmed the same complete-vs-draft failure across phases 003 through 006.
- Orchestration summaries alone were insufficient to determine fan-out success. The lineage stdout sentinel files were needed.

## Exhausted Approaches

- None yet.

## Ruled-Out Directions

- Re-deriving every slice finding from scratch is out of scope; this loop will verify only the lines needed for root-cause and calibration claims.
- Counting each registry row as a distinct root cause is ruled out because merged lineage phrasing duplicates the same underlying issues.
- Entity-density staleness is not full memory corruption; it is stale graph-channel routing signal corruption.
- Atomic-save ordering is not continuous corruption during successful saves; it is a crash-window or file-persistence-failure inconsistency.
- Metadata drift is not only manual edits; graph status heuristics and pointer-preservation are reproducible systemic mechanisms.
- Graph metadata backfill alone cannot repair resource-map, changelog, and description renumbering drift.
- P0 is not unconditional for local single-user MCP. The scoped defects become P0 only under shared untrusted-principal or untrusted network exposure.
- Current review slices are not proven to have under-delivered concurrency, even though the single-process multi-lineage runner can serialize.

## Active Risks

- The fan-out prompt forbids writes outside this lineage directory, so continuity save and spec anchoring are intentionally not performed from this lineage.

## Non-Goals

- Implement fixes.
- Modify reviewed source code, sibling review packets, parent summaries, or the target spec folder outside this lineage directory.
- Treat prior review severities as final where the local threat model changes the risk.

## Stop Conditions

- All five key questions have evidence-backed answers or are explicitly marked UNKNOWN with a reason.
- The last iteration adds no material new information after source-diversity and focus-alignment checks pass.
- The final synthesis contains root-cause hypotheses, blast-radius estimates, calibrated severity, references, and eliminated alternatives.

## Next Focus

Proceed to phase_synthesis. All five key questions have evidence-backed answers.
