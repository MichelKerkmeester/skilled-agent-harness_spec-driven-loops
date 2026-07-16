# Research Synthesis - codex-4

## Verdict

The release-gate decision should remain conditional/fail for a governed release until the P0/P1 cluster is remediated and the fan-out runner is rerun. The strongest root causes are not isolated defects: they are contract drift across hand-maintained surfaces, metadata status derivation that trusts stale sources, memory mutation paths without one atomicity/cache contract, scoped APIs that mix scoped and unscoped paths, and fan-out orchestration records that cannot prove executor success or provenance.

Under the default trusted local stdio single-user model, the scope/auth findings should be downgraded from unconditional P0 to conditional P0/P1. Under governed or multi-tenant claims, they remain P0 because the system exposes scope contracts and then bypasses them in specific paths.

## Research Questions

### Q1. Doc/schema-to-code drift

Drift is caused by divergent source-of-truth maintenance across public tool schemas, Zod schemas, handler forwarding, operator docs, and catalog/playbook claims. It is not one stale page.

Evidence:

- `tool-schemas.ts:338-350` exposes `memory_embedding_reconcile` as `mode: dry-run/apply` with `activeOnly`.
- `embedding-reconcile.ts:294-303` reads `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`, not `activeOnly`.
- `INSTALL_GUIDE.md:735-737` still documents `dryRun: false`.
- `tool-input-schemas.ts:233-243`, `:455-462`, and `:472-476` expose governed ingest fields.
- `memory-index.ts:254-333` validates governed ingest fields, but `memory-index.ts:708-725`, `memory-ingest.ts:262-267`, and `job-queue.ts:45-55` / `:253-295` do not carry those fields into the queued ingest job.

The durable fix is a generated or contract-tested boundary across schemas, docs, handler args, queue payloads, and feature catalog claims.

### Q2. Metadata drift systemicness

Metadata drift is systemic. Graph metadata derives status from frontmatter first, then falls back to implementation-summary/checklist signals. Current spec files expose status in markdown metadata tables, so draft/planned specs can be marked complete when implementation-summary placeholders exist.

Evidence:

- `graph-metadata-parser.ts:605-624` extracts YAML frontmatter `status` from canonical docs.
- `graph-metadata-parser.ts:987-1037` derives status from ranked status sources and falls back to implementation-summary/checklist completion.
- `graph-metadata-parser.ts:1066-1088` writes `derived.status`.
- `graph/README.md:72-77` documents fallback status derivation.
- `backfill-graph-metadata.ts:159-180` only flags ambiguous status when derived status is `planned`; it does not catch draft/planned specs being marked complete.
- Read-only scan over `027-graph-and-context-optimization`: 721 spec folders, 714 graph metadata files, 163 strong status contradictions. The exact count is medium confidence because free-form status prose needs classification.

Representative contradictions:

- `028-xce-research-based-refinement/003-incremental-index-foundation/spec.md:41-48` says Draft while `graph-metadata.json:35-43` says complete.
- `027-graph-and-context-optimization/.../002-phase-parent-generator-pointer-polish/spec.md:31-39` says Draft while its graph metadata says complete, driven by completion continuity.

### Q3. Memory correctness impact

Two memory issues have different severity shapes. Entity-density staleness is a transient query-routing correctness bug. Atomic save ordering is a durable DB/file consistency risk.

Evidence for transient routing staleness:

- `memory-crud-update.ts:90-94` accepts update fields that can change title and trigger phrases.
- `memory-crud-update.ts:304-316` runs post-mutation hooks.
- `mutation-hooks.ts:20-105` clears trigger, tool, constitutional, graph, degree, and coactivation caches, but not entity-density.
- `entity-density.ts:21-23` and `:153-163` define a 60 second entity-density cache and invalidation API.
- `query-router.ts:247-252` preserves graph/degree channels when entity density is high enough.
- `memory-save.ts:2703` and `vector-index-mutations.ts:699-704` invalidate entity-density on save/delete, so update is the exposed gap.

Evidence for durable save risk:

- `atomic-index-memory.ts:360-378` writes the pending file, indexes prepared content, then promotes the pending file.
- `memory-save.ts:2637-2640` commits the DB row inside the prepared-memory processing path.
- `atomic-index-memory.ts:387-444` cleans failed files but has no DB compensation if final promotion fails after the DB commit.

### Q4. P0 severity calibration

The two scope/auth P0s are conditional, not universally P0. They remain P0 for governed or multi-tenant isolation claims and downgrade to P1/security-hardening under the default trusted local stdio single-user deployment.

Evidence:

- `memory-search.ts:946-984` carries tenant/user/agent/spec scope through the main search pipeline.
- `memory-search.ts:987-1031` runs community fallback after the scoped pipeline and fetches `memory_index` rows by raw IDs without scope predicates.
- `tool-schemas.ts:442-463` exposes causal graph operations with bare IDs and no scope fields.
- `causal-graph.ts:520-565`, `:689-757`, and `:955-996` traverse/create/delete by supplied IDs without scope authorization.
- `context-server.ts:573-585` treats local stdio as a same-user trusted process boundary, while HTTP/WS carry validated session IDs.
- `changelog/v3.2.0.0.md:179-181` and `:373` frame access-scope enforcement as opt-in for multi-tenant deployments.
- `scope-governance.ts:521-534` and `:710-711` define exact-match, fail-closed scope predicates once scope governance is active.

### Q5. Fan-out blast radius

Prior artifacts are suspect at the orchestration/provenance layer, but not wholly invalid as review content.

Evidence:

- `fanout-run.cjs:362-363` returns child output with `exitCode`, `timedOut`, and `salvage`.
- `fanout-pool.cjs:85-99` marks any returned worker output as `fulfilled`.
- `fanout-pool.cjs:207-217` counts fulfilled promises, not child `output.exitCode`.
- `fanout-run.cjs:376-378` can exit 0 when no promise rejected, even if a child exit code was non-zero.
- `executor-config.ts:292-299` documents `iterations` as a per-lineage max-iterations override, but `fanout-run.cjs:122-146` does not include that limit in child prompts; `fanout-run.cjs:154-157` uses it only for timeout sizing.
- `fanout-merge.cjs:328-336` can only infer attribution from sparse executor-start events or aggregate per-label summaries; current attribution rows across review slices 001-008 are `unknown`.

Artifact trust policy:

- Use lineage reports, per-slice registries, and merged findings as remediation evidence.
- Do not use orchestration summaries or attribution tables as proof of executor success, model provenance, concurrency, or iteration-bound compliance.
- Rerun fan-out after runner fixes before using the result as a final release gate.

## Root-Cause Clusters

1. Contract surfaces are hand-maintained and drift across schemas, handlers, docs, feature catalog entries, and queue payloads.
2. Metadata derivation trusts stale frontmatter/fallbacks over the visible status metadata used by current spec templates.
3. Memory mutation paths do not share one post-commit invalidation and atomicity contract.
4. Scope governance is optional in the default local model, but scoped APIs mix scoped and unscoped retrieval once governance is used.
5. Fan-out runner and merge records are not authoritative for child exit status, provenance, concurrency, or depth control.

## Severity Calibration

- Fan-out accounting/provenance is P0 for release-gate orchestration because it can report success without proving child success.
- Scope/auth bypasses are conditional P0 for governed/multi-tenant deployments and P1 under default trusted stdio.
- Atomic save ordering is P1 durable consistency risk, potentially higher if memory index integrity is a release criterion.
- Metadata status drift is P1 for program tracking and release readiness.
- Schema/docs/handler drift is P1 because operator-facing contracts are no longer reliable.
- Entity-density update invalidation is P2/P1 depending on how strongly graph-channel routing freshness is part of expected behavior.

## Recommended Remediation Order

1. Fix fan-out exit accounting, provenance capture, iteration-bound propagation, and non-blocking concurrency semantics; then rerun the release-gate fan-out.
2. Fix governed scope fallback and causal graph authorization, or explicitly downscope release claims for single-user local stdio only.
3. Fix graph metadata status parsing so current spec metadata tables win over stale fallback evidence; add write-path/backfill regression tests.
4. Add generated schemas or contract tests across MCP tool schemas, Zod schemas, handler args, queued job payloads, docs, and catalog/playbook surfaces.
5. Add entity-density invalidation to update hooks and change atomic save ordering or compensation so DB rows cannot commit ahead of final file promotion.

## Eliminated Alternatives

- One stale doc page: ruled out by drift spanning schemas, runtime args, docs, handlers, and queue payloads.
- Isolated parent-pointer metadata drift: ruled out by broad strong contradictions and representative non-parent examples.
- Entity-density staleness as durable corruption: ruled out because the cache affects routing decisions and has TTL/invalidation semantics.
- Unconditional P0 for local stdio scope/auth findings: ruled out by the documented same-user trusted boundary.
- Discard prior review artifacts wholesale: ruled out because per-lineage reports and registries exist; the weak layer is orchestration proof.

## Caveats

- The official reducer was not run because this fan-out lineage was explicitly bound to an override artifact directory and the checked-in reducer resolves artifact roots itself.
- No writes were made outside this lineage artifact directory.
- The metadata contradiction count is high-signal but not exact because status prose is free-form.
- The exact original fan-out invocation topology is medium confidence because aggregate summaries appear overwritten or collapsed.
