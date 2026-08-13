---
title: Deep Research Strategy - 036 Phase Consolidation (lineage ds-b)
description: Research strategy for determining whether the 036 phase-parent children can be merged into fewer larger multi-phase groups, with clustering, migration plan, and timeline design.
trigger_phrases:
  - "036 phase consolidation"
  - "phase consolidation research ds-b"
  - "merge 036 children"
  - "multi-phase parent grouping"
importance_tier: normal
contextType: research
version: 1.14.0.19
---

# Deep Research Strategy - 036 Phase Consolidation (lineage ds-b)

## 1. OVERVIEW

### Purpose
Determine whether the 036-deep-loop-innovation phase-parent's ~45 child phase folders can be merged/grouped into fewer, larger multi-phase parents for context optimization. Deliver: (1) feasibility/benefit analysis, (2) a concrete clustering proposal grounded in on-disk folders + metadata, (3) a full migration plan covering every reference surface, and (4) a timeline.md design that preserves chronological lineage across any renumbering. Research/proposal only — no restructuring.

### Usage
- **Init:** Populated from config + on-disk census of the 036 parent.
- **Per iteration:** Each of 5 iterations investigates one sub-topic (census/feasibility, clustering part 1, clustering part 2 + reference surface, migration plan, timeline design). Iteration findings land in `iterations/iteration-NNN.md`.
- **Mutability:** Mutable — analyst-owned sections stable; machine-owned sections (Sections 3, 6-11A) rewritten by the reducer after each iteration.
- **Protection:** Shared state with explicit ownership boundaries.

---

## 2. TOPIC
Analyze the 036 phase-parent (`specs/system-deep-loop/036-deep-loop-innovation`) child phase folders (currently ~45 matching `^[0-9]{3}-`). Determine (1) feasibility/benefit of merging into fewer larger multi-phase groups for context optimization; (2) HOW — which children cluster into which multi-phase parents by theme/dependency with optimized names; (3) the full migration plan — renames plus every reference surface (parent+child graph-metadata children_ids, spec.md phase documentation map, cross-refs, description.json, validate.sh manifest); (4) CRITICAL — a timeline.md design preserving chronological lineage across renumbering (derive from git history + graph-metadata timestamps). Ground in on-disk folders + metadata. Research/proposal only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry.

- [x] Q1: Is merging/grouping the 036 children into fewer multi-phase parents feasible and net-beneficial for context optimization, given the existing phase-parent mechanics (validate.sh hardcoded manifest, graph-metadata children_ids, spec.md phase map)? (answered iter 1 — YES; tooling classifies 45 children as error and recommends splitting)
- [x] Q2: Which child folders cluster together by theme/dependency into which multi-phase parent, with what optimized names? (answered iter 2 — 001-017 → 5 program-ordered grandparents; 018-033 → 2 grandparents split at blocker boundary; iter 3 completes 035+047-056)
- [x] Q3: What is the complete migration plan — exact rename sequence, and every JSON/markdown/reference surface that must be updated in lockstep? (answered iter 4 — M0-M7: preflight+timeline-first, git mv per grandparent, lean trio per grandparent, child+grandchild metadata lockstep, parent 036 surfaces, external surfaces incl. validate.sh hash recompute + specs/descriptions.json regeneration, verification gates, lossless git-revert rollback)
- [x] Q4: How should timeline.md record chronological lineage (which folder was worked on first vs later) so it survives renumbering? (answered iter 5 — seq=created_at ASC as the only sort key, stable_id=slug-without-prefix as durable identity, moved_to column as migration manifest, append-only renumber ledger; 050 anomaly proves numbering is already non-chronological)
- [x] Q5: What are the risks, rules, and verification gates for the migration (e.g., validate.sh manifest hash, symlink .opencode/specs, specs/descriptions.json index)? (answered — iter 4 gates M6/M7 + iter 5 timeline verification; risks: hash-lock, pre-existing 053-056/057 drift, don't rewrite historical logs)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- **No restructuring of any folder, file, or metadata.** This lineage produces research/proposal artifacts only, inside its own `research/lineages/ds-b` directory.
- **No edits to the 036 parent or any child** — no renames, no graph-metadata writes, no spec.md edits.
- **Not an implementation plan with code** — the migration plan is a documented proposal for a future operator/plan packet.
- **No re-derivation of the 178-recommendation program** — the phases' *content* is taken as given; only their *grouping/structure* is analyzed.
- **No web research** — this is a repo-internal structural analysis grounded in on-disk state.

---

## 5. STOP CONDITIONS
- 5 iterations completed (maxIterations) — stop and synthesize regardless of convergence telemetry.
- State file corruption unrecoverable.
- Security concern in findings (no credentials/proprietary code expected).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 (iter 1): Grouping is feasible AND beneficial. The spec-kit phase-parent health check classifies 45 children as `error` (threshold 40) and recommends "Split into nested phase parents". 45 on-disk children, 13 already parents, 61 grandchildren.
- Q2 (iter 2): Cluster design — 001-017 → 5 program-ordered grandparents (001-research-inputs-and-baseline, 002-ledger-and-spine-architecture, 003-shared-services-and-migration-bridge, 004-orchestration-convergence-and-mode-contracts, 005-mode-migration-cutover-and-gate); 018-033 → 2 grandparents (006-drift-revalidation-and-blocker-closeout = 018+021-024, 007-remediation-docs-integrity-and-hardening = 019,020,025-033). Direct child listing drops 45 → ~10.
- Q2 completed (iter 3): Full 9-grandparent set — 008-executor-and-cli-hardening (035,047,048,049,050,051,052), 009-review-and-rollback-followup (053,054,055,056). Numbering scheme A (001-009, program-ordered). All 45 children covered; 036 direct children → 10.
- Q3 (iter 4): Migration plan M0-M7. M0 preflight (health CLI baseline `error 45`, validate.sh manifest hash capture, create 9 grandparent dirs, timeline.md FIRST). M1 git mv per grandparent. M2 lean trio per grandparent. M3 child+grandchild metadata lockstep (graph-metadata packet_id/spec_folder/parent_id, description.json specFolder/parentChain, spec.md frontmatter parent). M4 parent 036 surfaces (graph-metadata children_ids, spec.md phase map, phase-tree.json, parent docs). M5 external surfaces (validate.sh list+sha256 recompute incl. 053-056 drift fix, recursive-child-manifest.vitest.ts, runtime write-set-conflict-graph + 15 tests, cross-packet specs, regenerate specs/descriptions.json via folder-discovery cache). M6 gates (health ok, validate --strict + --recursive, rg residue, vitest, memory_index_scan). M7 commit + lossless git-revert rollback.
- Q4 (iter 5): timeline.md design — `seq` = created_at ASC (only sort key, never reassigned); `stable_id` = slug without numeric prefix (durable identity); `moved_to` column records post-consolidation path (doubles as migration manifest); append-only renumber ledger. PROOF: 050-trustworthy-state-records created 2026-07-27 (before 019-032) but numbered 050 — numbering already non-chronological. Generation: child graph-metadata created_at primary, git --follow cross-check, script emits table + warns on missing/anomalous timestamps.
- Q5 (iter 4/5): Risks = validate.sh hash-lock (update list+sha256 same commit), pre-existing drift (053-056 absent from manifest, 057 absent from children_ids), .opencode/specs symlink resolves both spellings, specs/descriptions.json must be regenerated not hand-edited. Gates = M6 (health ok, validate --strict --recursive, rg residue, vitest, memory scan) + timeline verification (seq/stable_id identical, moved_to 1:1, only moved_to additions in diff).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Running the spec-kit phase-parent health CLI on the live parent: returned `error 45 45 children exceeds error threshold (40)` — decisive, citable feasibility evidence (iteration 1)
- Reading validate.sh's hardcoded 036 child-manifest block directly (list + sha256) to ground the constraint surface (iteration 1)
- Using git log to confirm the 034<->036 renumber precedent (commit 8d3b5b21d57, 2026-07-17) (iteration 1)
- Using phase-tree.json depends_on chain + the parent spec's own blocker naming (021-024) as the grouping axis — produced program-ordered, dependency-safe grandparents (iteration 2)
- Repo-wide rg scan for child-slug references produced a precise, deduplicated external reference inventory (~27 editable files; historical logs excluded) (iteration 3)
- Tracing folder-discovery.ts proved specs/descriptions.json is a regenerated MCP cache (not hand-editable); confirming the validate.sh hash-lock grounded M5 (iteration 4)
- Sorting all children by derived.created_at exposed the 050 anomaly immediately (created 07-27, numbered 050) — concrete proof that numbering != chronology (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Raw `git log` first-commit dates for per-child chronology: FAILED (iteration 5) — uniform 2026-08-07 after the specs-root flip re-touched every path; had to use `created_at` + `--follow` reasoning instead
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "The 45-child manifest is acceptable / grouping is unnecessary": RULED OUT (iteration 1) — spec-kit's own phase-parent health check classifies it as `error` and recommends splitting into nested phase parents (evidence: is-phase-parent.ts:125-145)
- Numbering scheme B (tail-band reuse 035/047-056 for grandparents): RULED OUT (iteration 3) — reads arbitrarily and fights the program-ordered taxonomy; scheme A (001-009) maps 1:1 to the original program bands and matches the existing nested 001-00N reuse
- Rewriting historical research/lineage logs (iter-*.err, fanout-lineage.out, 037 research artifacts): RULED OUT (iteration 3) — append-only research records, not migration targets
- Hand-editing `specs/descriptions.json`: RULED OUT (iteration 4) — it is the MCP folder-discovery global cache; must be regenerated, not manually edited
- Doing the validate.sh manifest update without recomputing the sha256 in the same commit: RULED OUT (iteration 4) — hash-lock would break validation
- Using the numeric prefix as the timeline sort key: RULED OUT (iteration 5) — refuted by the 050 anomaly (created 07-27, numbered 050)
- Using raw `git log` first-commit as the timeline sort key: RULED OUT (iteration 5) — refuted by the specs-root flip (uniform 08-07 dates)
- Making timeline.md mutable: RULED OUT (iteration 5) — append-only is the only way chronology survives renumbering
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis — compile `research/research.md` with the full report: feasibility (Q1), cluster design (Q2), migration plan (Q3), timeline.md design (Q4), risks/gates (Q5), and the Eliminated Alternatives table.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Populated during initialization from on-disk census (evidence: specs/system-deep-loop/036-deep-loop-innovation/).

### Bounded Context Snapshot
- **Source pointers:** `specs/system-deep-loop/036-deep-loop-innovation/` (parent), its `manifest/phase-tree.json`, `graph-metadata.json`, `spec.md`, `description.json`; child `graph-metadata.json`/`description.json`; `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (hardcoded 036 child manifest); `specs/descriptions.json` (repo-wide index).
- **Ground truth facts (confirmed):**
  - Parent `graph-metadata.json` `children_ids` = **44** entries (001-033, 035, 047-056; 057 excluded — new research host).
  - On-disk dirs matching `0[0-9][0-9]-`: **45** (001-033, 035, 047-057).
  - `manifest/phase-tree.json`: `live_direct_children: 44`, `original_program_range: "001-017"`, notes the 44-child live parent.
  - `validate.sh` `load_child_manifest()` has a **hardcoded 40-entry** manifest for the canonical 036 path (001-033, 035, 047-052) with sha256 `f6cf1e943d39629118c976ac71b5141bb8b85198c47641815b505adf50e732e6` — 053-056 are on disk but NOT yet in the manifest (drift).
  - `.opencode/specs` is a symlink → `../specs`; the recursive validator also references `.opencode/specs/...` paths in `recursive-child-manifest.vitest.ts`.
  - Packet was renumbered `034 <-> 036` on 2026-07-17 (commit 8d3b5b21d57) — a real precedent that renumbering already happened once.
  - Child phase-parents with their own children: 004(3), 006(4), 007(7), 008(5), 009(7), 010(5), 011(5), 012(4), 013(8), 014(3), 047(5), 048(3), 049(2). Total nested grandchildren ≈ 60.
  - `spec.md` PHASE DOCUMENTATION MAP lists 001-033, 035, 047-056 (with statuses) — 057 absent.
- **Constraints and risks:** validate.sh manifest is hash-locked (renames require list + hash update); `specs/descriptions.json` is a repo-wide index of every spec folder; child graph-metadata `spec_folder` + parent chain fields must stay consistent; `.opencode/specs` symlink means paths resolve through `specs/`.
- **Do NOT:** write outside `.../research/lineages/ds-b`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry-only; stop policy = max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (fan-out lineage ds-b)
- Canonical pause sentinel: `research/.deep-research-pause`
- Started: 2026-08-13T09:10:00Z
