# Iteration 4 — D4: Blast Radius of a Metadata Repair

- **Dimension:** D4 (schema: security — blast-radius/safety framing) — would regenerating `graph-metadata.json` touch or lose any real authored content in this phase?
- **Mode:** review (single iteration; iteration 4 of 10; stop_policy=max-iterations — no early convergence)
- **Agent:** deep-review (LEAF, GLM-5.2)
- **sessionId:** rv-phase009-audit-20260701-184748
- **Status:** complete (read-only diagnostic; no phase-009 file modified outside `review/`)

## Dimension (D4)

Four sub-questions: (1) determine PRECISELY what a LIVE `refreshGraphMetadataForSpecFolder()` would WRITE to `graph-metadata.json`, without running it against the real file; (2) does a graph-metadata repair touch/read/require modifying any of spec.md/plan.md/tasks.md/implementation-summary.md/handover.md — trace the derive-vs-write code path; (3) is `description.json` at risk; (4) final verdict: pure metadata-layer fix (safe, independent of D2 ownership), or any risk to authored content / the ownership question.

## Method (adversarial toward the seeded dry-run claim)

The seeded D4 context (strategy.md:116-118) cites a prior `--dry-run` returning `{created:0, refreshed:1, existing:1, failed:[]}` with an empty `git diff`, and concludes a live run "would likely regenerate ... rather than erroring out." That summary only proves the dry-run did not write. It does NOT state what the live write would contain. Per the brief's adversarial mandate, I did NOT trust the counters — I (a) traced the actual derive-vs-write code path in source, and (b) replayed `refreshGraphMetadataForSpecFolder`'s exact compute path (load → derive → merge → serialize) against the REAL phase-009 folder via a read-only probe (`review/scratch-d4/probe-derive.mjs`, since deleted) that imported `deriveGraphMetadata`/`mergeGraphMetadata`/`serializeGraphMetadata`/`loadGraphMetadata` from the compiled api barrel and printed the merged payload **without ever calling `writeGraphMetadataFile`**. `deriveGraphMetadata` is read-only by construction (it only `readFileSync`s canonical docs and computes), so running it against the real folder is safe and reproduces the live merged output exactly.

## Files Reviewed

- `skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` (full, 404 lines — `runBackfill` 312-389; `collectReviewFlags` 273-299; `resolveScopedTarget` 108-129)
- `skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` (full, 1629 lines — `refreshGraphMetadataForSpecFolder` 1487-1532; `writeGraphMetadataFile` 1456-1478; `deriveGraphMetadata` 1252-1314; `collectPacketDocs`/`CANONICAL_PACKET_DOCS` 663-697, 51-62; `deriveStatus` 1167-1224; `deriveImportanceTier` 1234-1242; `deriveCausalSummary` 1138-1160; `mergeGraphMetadata` 1358-1398; idempotency guard `graphMetadataEqualIgnoringVolatile` 1429-1438)
- `graph-metadata.json` (the malformed D1 file, 7 lines plain-text legacy)
- `description.json` (25 lines, valid JSON, placeholder content)
- `010-.../graph-metadata.json` (valid sibling, 216 lines — comparison shape)

Probe runs (read-only, against real folder): `loadGraphMetadata` → legacy-tolerant migration; `deriveGraphMetadata` → in-memory refreshed snapshot; `mergeGraphMetadata` → merged; inline `graphMetadataEqualIgnoringVolatile` → write-vs-no-write decision.

## Findings by Severity

### P0 (Critical): none.

### P1 (Major): 1 new.

---

#### D4-P1-001 — Live backfill would flip `status` planned → complete (FALSE completion); deriveStatus treats scaffold implementation-summary.md presence as completion with no checklist gate

- **Claim:** A LIVE `refreshGraphMetadataForSpecFolder()` against phase 009 would WRITE `derived.status: "complete"` into `graph-metadata.json`. This is FALSE: phase 009 is the BUILDABLE-BUT-UNAUTHORED scaffold of D3 (every canonical doc a verbatim template, `completion_pct: 0`, generic `T001 Create project structure` tasks). The CORRECT value already lives in the legacy plain-text file (`Status: planned`). So the metadata repair, far from being the benign "regenerate from current docs" the seeded dry-run narrative implied, would REGRESS status accuracy — replacing a correct `planned` with a misleading `complete` that pollutes every consumer of the metadata layer (memory_search, skill/packet graph, packet-status rollups, resume ladders).
- **Root cause (code-confirmed):** `deriveStatus` (graph-metadata-parser.ts:1167-1224). Phase 009's scaffold docs carry only bracketed-placeholder frontmatter (`status: [Draft/In Progress/Review/Complete]`), so `normalizeDerivedStatus` returns `null` for every ranked doc (lines 1186-1192) and `frontmatterStatus` is null. Then: `implementation-summary.md` EXISTS (it is a verbatim scaffold, but the file is present) → `implementationSummaryDoc` is truthy (line 1201). Phase 009 has NO `checklist.md` (Level 1 phase, per strategy §14) → `!checklistDoc` is true → line 1216-1218 unconditionally returns `{ status: 'complete', reviewRequired: false }`. The heuristic assumes "implementation-summary.md present + no checklist ⇒ complete." For an unauthored scaffold this assumption is exactly wrong. The `existing?.derived.status` ("planned") is NOT consulted on this branch — it is only used at line 1207 inside the `!implementationSummaryDoc` (lean phase-parent) branch, which 009 does not take.
- **evidenceRefs:** probe output (`REFRESHED.derived.status === "complete"`); graph-metadata-parser.ts:1201-1218 (`if (!checklistDoc) return { status: 'complete' ...}`); graph-metadata-parser.ts:1186-1192 (all ranked frontmatter statuses null for scaffold); D3 confirmation implementation-summary.md is a verbatim scaffold (iteration-3.md:18); legacy file `Status: planned` (graph-metadata.json:3); idempotency guard returns `WOULD-WRITE` (existing≠merged).
- **counterevidenceSought (and result):** Could a `statusOverride` or the lean-parent branch salvage it? `refreshGraphMetadataForSpecFolder` passes no `statusOverride` by default (line 1505-1508), so `deriveStatus`'s override branch (1173-1176) is not taken. The lean-parent `existingStatus` preservation branch (1207-1212) is only reached when `implementation-summary.md` is ABSENT — 009 has it, so no. No code path produces `planned` for this folder under default invocation. Reproduced empirically — not inferred.
- **alternativeExplanation:** None that rescues accuracy. The closest: if the operator intends "scaffold-with-impl-summary = structurally complete even if content-empty," then `complete` is by-definition correct. But that contradicts the packet's own `completion_pct: 0` and D3's finding, and would make the metadata layer useless for distinguishing authored from scaffold phases.
- **finalSeverity:** **P1** — a false completion signal propagating into the graph/memory index is a real correctness defect with cross-cutting consumers, but blast radius is confined to metadata accuracy (no data loss, no content corruption, no auth/safety impact), and it is cleanly MITIGATED by invoking the refresh with `statusOverride: 'planned'` (supported at graph-metadata-parser.ts:1505-1508 → 1173-1176). The naive `node backfill-graph-metadata.js --spec-folder <009>` invocation is the unsafe form; an override-aware invocation is safe.
- **confidence:** 0.92 (code path traced end-to-end AND empirically reproduced against the real folder)
- **downgradeTrigger / upgradeTrigger:** **Downgrade to P2** if every backfill entrypoint that targets a scaffold phase is documented to require `statusOverride`, or if deriveStatus is patched to consult `completion_pct`/open-tasks before declaring complete. **Upgrade to P0** if a repo-wide sweep (recommended for iteration 5) finds this false-complete heuristic mislabeling many genuinely-incomplete phases — that would elevate it from a phase-009 instance to a systemic tooling defect.

---

### P2 (Minor): 1 new.

---

#### D4-P2-001 — Live backfill regresses derived synopsis/tier fields vs legacy because the source docs are unauthored scaffolds (importance important→normal; causal_summary replaced by spec.md placeholder text)

- **Claim:** Beyond status, two more derived fields degrade vs the legacy values: (a) `importance_tier` flips `important → normal` — `deriveImportanceTier` (1234-1242) reads decision-record/plan/spec/implementation-summary frontmatter `importance_tier`; the scaffold carries a `normal` default and the legacy text's `important` is not preserved; (b) `causal_summary` becomes the literal spec.md placeholder `"[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"` (via `deriveCausalSummary` → `derivePacketSynopsis`/`extractSummary` over the scaffold body) — strictly worse than the legacy `"Phase 1: speckit-command-goal-prompt-offer"`. Neither is a data-loss event (the originals were also low-quality placeholder/derived strings), but both make the regenerated metadata LESS accurate than the legacy text it replaces.
- **evidenceRefs:** probe output (`REFRESHED.derived.importance_tier === "normal"`, `REFRESHED.derived.causal_summary === "[What is broken...]"`); graph-metadata-parser.ts:1234-1242 (deriveImportanceTier, fallback 'important' not reached because scaffold frontmatter supplies 'normal'); 1138-1160 (deriveCausalSummary reads spec.md body); legacy file lines 4-5 (`Importance Tier: important`, `Summary: Phase 1: ...`).
- **counterevidenceSought (and result):** Is the 'normal' coming from a real frontmatter value or the selectFirstValue fallback? The fallback is 'important' (line 1241), yet the output is 'normal' — so a scaffold doc frontmatter DOES carry `importance_tier: normal`. Confirmed by elimination (INFERRED-partial: I did not re-open each scaffold frontmatter this iteration to name which doc; the value is empirically certain, the exact source doc is inferred).
- **alternativeExplanation:** `deriveImportanceTier`/`deriveCausalSummary` are working as designed — they faithfully reflect unauthored source docs. The regression is a symptom of D3 (scaffold sources), not an independent tooling bug.
- **finalSeverity:** **P2** — accuracy regression in low-stakes derived fields; self-corrects once spec.md is authored (D3 pickup). Bundled with D4-P1-001 as the "repair is not semantically neutral" cluster.
- **confidence:** 0.85
- **downgradeTrigger / upgradeTrigger:** **Downgrade to informational** when spec.md is authored on pickup (synopsis/tier re-derive from real content). **No upgrade path** — these fields carry no runtime decision weight.

---

## Traceability Checks

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` (core) | checked | Traced derive-vs-write code path in graph-metadata-parser.ts + backfill-graph-metadata.ts; reproduced derive output empirically against real folder (read-only). |
| `checklist_evidence` (core) | notApplicable | Level 1 phase; no checklist.md. |
| `skill_agent` (overlay) | checked | Confirmed refresh entrypoint + idempotency guard + writer-path classification (`canClassifyAsGraphMetadataPath`) behavior. |
| `agent_cross_runtime` (overlay) | notApplicable | Not an agent-definition review. |
| `feature_catalog_code` (overlay) | notApplicable | Not a feature-catalog review. |
| `playbook_capability` (overlay) | notApplicable | Not a playbook review. |

### Objective-by-objective answers

| # | Objective | Result | Verdict |
|---|---|---|---|
| 1 | What a LIVE refresh would WRITE (vs current placeholder description.json, vs malformed graph-metadata.json, vs sibling 010 shape) | **CONFIRMED empirically.** Write target = a full schema-conformant JSON matching sibling 010's shape (schema_version/packet_id/spec_folder/parent_id/children_ids/manual/derived). Diff vs current legacy-loaded: `parent_id` null→`deep-loops/032-goal-opencode-plugin` (added); `status` planned→**complete** (FALSE, D4-P1-001); `importance_tier` important→normal (D4-P2-001); `causal_summary`→spec.md placeholder (D4-P2-001); `trigger_phrases`/`key_topics`/`key_files`/`entities` re-derived from scaffold (expanded, low-quality); `source_fingerprint`/`source_doc_hashes` added; `source_docs` grows to include handover.md + implementation-summary.md; `migrated:true, migration_source:'legacy'` preserved. Idempotency guard → **WOULD-WRITE** (existing≠merged). | ✓ matches 010 shape; ≠ benign |
| 2 | Does the repair touch/read/require modifying spec.md/plan.md/tasks.md/implementation-summary.md/handover.md? | **CONFIRMED READ-ONLY.** `collectPacketDocs` (663-697) reads the canonical doc set (CANONICAL_PACKET_DOCS, 51-62) to populate derived fields. NO function in the refresh path writes them. The only write is `writeGraphMetadataFile(filePath, merged)` (1525) where `filePath = path.join(folder, GRAPH_METADATA_FILENAME)` (1503) — graph-metadata.json ONLY, guarded by `canClassifyAsGraphMetadataPath(canonicalFilePath)` (1467) which refuses anything that is not a graph-metadata path. derive = READ; write = graph-metadata.json only. | ✓ derive reads, never writes canonical docs |
| 3 | Is description.json at risk? | **CONFIRMED INDEPENDENT.** `description.json` is NOT in `CANONICAL_PACKET_DOCS` (51-62) and is not referenced anywhere in `refreshGraphMetadataForSpecFolder`/`deriveGraphMetadata`/`writeGraphMetadataFile`. It is produced by a separate generator (`generate-context.js` / description generator), already valid JSON (verified), structurally fine. A graph-metadata-only repair cannot reach it. | ✓ independent code path |
| 4 | Final verdict: pure metadata-layer fix vs risk to authored content/ownership | **CONTENT-SAFE (GREEN) but NOT semantically neutral (AMBER).** See Verdict. | ✓ see below |

## Verdict

**D4 is covered** for iteration 4 (genuine, non-duplicate coverage achieved).

### Repair-blast-radius verdict: **CONTENT-SAFE BUT NOT SEMANTICALLY NEUTRAL**

- **Content safety — GREEN (code-confirmed, not inferred).** A graph-metadata regeneration touches EXACTLY ONE file: `graph-metadata.json`. The write path (`refreshGraphMetadataForSpecFolder` → `writeGraphMetadataFile`) computes `filePath` solely from `GRAPH_METADATA_FILENAME` (line 1503) and the writer guard `canClassifyAsGraphMetadataPath` (line 1467) refuses any non-graph-metadata destination. `deriveGraphMetadata` READS the canonical docs (spec/plan/tasks/impl-summary/handover) to populate derived fields but never writes them. `handover.md` — the phase's sole authored artifact (D3) — is read for synopsis/key-file/entity derivation and left byte-identical. `description.json` is on a fully separate code path and is already valid JSON. **No authored content can be lost or altered by the repair.**
- **Ownership decoupling — GREEN.** Regenerating a DERIVED metadata file neither claims nor transfers ownership of SUBSTANTIVE work. The D2 ownership question concerns who will author spec.md/plan.md/tasks.md and execute the handover's plan — none of which a metadata regeneration touches or prejudges. The repair is orthogonal to D2.
- **BUT semantic accuracy — AMBER (D4-P1-001 + D4-P2-001).** The seeded dry-run narrative ("benign regeneration from current docs") is **wrong about outcomes**. A default live invocation would inject `status: complete` (FALSE — the headline regression), downgrade `importance_tier` important→normal, and replace the synopsis with spec.md placeholder text. For an unauthored scaffold phase the derive heuristics systematically produce LESS accurate metadata than the legacy text already held. This is not data loss, but it is a real accuracy regression that propagates into the graph/memory index.

### Decision-relevance for a senior engineer deciding whether to greenlight the repair independent of D2

**GREENLIGHT on the parseability/content axes, independent of D2 — with one mandatory caveat.** An operator may safely run the live backfill to unblock `validate.sh --strict`'s `FILE_UNPARSEABLE` (D1) regardless of the D2 ownership ambiguity: it is a derived-file regeneration that preserves all authored content and does not adjudicate ownership. **HOWEVER**, the operator MUST NOT read the regenerated `status` as truthful: it will say `complete` for a phase that is `completion_pct: 0` and entirely unauthored. Two safe forms: (a) invoke with `statusOverride: 'planned'` (supported via refresh options, graph-metadata-parser.ts:1505-1508) so the correct status is preserved; or (b) run the naive backfill, accept the false `complete` as a known transient, and re-derive once spec.md is authored on pickup (D3). Treat the repair as "fix the parseability defect," NOT "produce accurate status." Accurate status is downstream of authoring.

## SCOPE VIOLATIONS

None. All writes confined to the allowed paths under `review/` (`iterations/iteration-4.md`, `deep-review-state.jsonl` append, `deltas/iter-004.jsonl`, in-place `deep-review-strategy.md` + `deep-review-findings-registry.json`) plus a scratch probe at `review/scratch-d4/probe-derive.mjs` which was DELETED before finishing (confirmed below). No file under `009-.../` outside `review/` (the real graph-metadata.json, description.json, spec.md, plan.md, tasks.md, implementation-summary.md, handover.md) was created, modified, deleted, or renamed — all READ-ONLY as required. The live (non-dry-run) backfill/refresh was NEVER run with `--spec-folder` pointed at the real phase-009 path; the probe replayed the COMPUTE path only (derive+merge+serialize, no `writeGraphMetadataFile`), which is read-only by construction. `git status` scoped to phase 009 remains clean except for the `review/` additions.

## Next Dimension (iteration 5 — broadening, all 4 dimensions now have first-pass coverage)

With D1-D4 each genuinely covered, stop_policy=max-iterations mandates broadening over convergence. **Recommended angle: test the generality of D4-P1-001 across the whole repo, not just packet 032.** The false-complete heuristic (`deriveStatus` lines 1201-1218: implementation-summary.md present + no checklist.md ⇒ `complete`) is a TOOLING-LEVEL rule that could mislabel ANY phase that (i) carries an implementation-summary.md scaffold or stale file, (ii) has no checklist.md, and (iii) is actually incomplete. A read-only repo-wide sweep — derive status in-memory for every spec folder and cross-check against `completion_pct: 0` in frontmatter and/or open `[ ]` items in tasks.md — would determine whether D4-P1-001 is an isolated phase-009 instance or a systemic deriveStatus defect affecting many packets. If systemic, upgrade D4-P1-001 to P0 and file a tooling-level correctness finding (sibling to D1-P2-001's loader/validator split). Secondary angles if time remains: adversarially re-challenge D2's UNVERIFIABLE verdict by re-checking reflog/stash for any change since iteration 2, and re-confirm D1's "isolated 1/2425" sweep count is still exact.

