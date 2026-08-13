# 036 Phase Consolidation Research — Final Synthesis (lineage ds-b)

> Research/proposal only. No restructuring was performed. All findings grounded in the on-disk folders and metadata of `specs/system-deep-loop/036-deep-loop-innovation/`.

## 1. Executive Summary

The 036 phase-parent holds **45 on-disk child folders** (001-033, 035, 047-057). The spec-kit's own phase-parent health model classifies this as an **`error`** (`45 children exceeds error threshold (40)`) and explicitly recommends *"Split into nested phase parents or move historical phases under z_archive/"*. Grouping the 45 children into **9 multi-phase grandparents** is feasible, beneficial, tooling-endorsed, and safe — the dependency spine is linear, so grouping in program order introduces no cross-group cycles. The migration (M0-M7) is mechanical `git mv` + a documented lockstep update of every machine-readable surface (parent/child graph-metadata, description.json, spec.md phase maps, manifest/phase-tree.json, the hash-locked validate.sh manifest, the regenerated `specs/descriptions.json`, runtime code + tests, cross-packet specs). The CRITICAL requirement — chronological lineage surviving renumbering — is satisfied by a new append-only `timeline.md` keyed on `created_at` (a `seq`/`stable_id`/`moved_to` schema), because the numeric prefix is **already** non-chronological (proven: `050-trustworthy-state-records` was created 2026-07-27, before 019-032, but numbered 050).

## 2. Problem Statement

The 036 phase-parent's direct-child listing has grown to 45 folders plus 61 nested grandchildren (13 children are themselves phase-parents). The parent `spec.md` PHASE DOCUMENTATION MAP is ~50 table rows; parent-level docs (goal.md 41KB, handover.md 46KB, spec.md 33KB) must be read to resume the packet. `memory_context`/`@context` for "resume 036" pulls a very wide net. The tooling (is-phase-parent.ts) classifies a 45-child manifest as an error.

## 3. Research Questions & Answers

| # | Question | Answer |
|---|----------|--------|
| Q1 | Is merging/grouping feasible and beneficial? | **Yes.** Tooling classifies 45 children as `error` (threshold 40) and recommends splitting into nested phase parents. Grouping drops the direct listing 45 → 10 and every level under the healthy threshold. (iter 1) |
| Q2 | Which children cluster into which grandparents? | **9 grandparents** covering all 45 children, program-ordered and dependency-safe (iter 2-3, §5). |
| Q3 | What is the full migration plan? | **M0-M7** ordered plan with per-surface lockstep updates, hash recompute, regeneration (not hand-edit) of `specs/descriptions.json`, verification gates, lossless rollback (iter 4, §6). |
| Q4 | How should timeline.md preserve chronology? | `seq`=created_at ASC (only sort key), `stable_id`=slug-without-prefix, `moved_to` column, append-only renumber ledger (iter 5, §7). |
| Q5 | Risks, rules, gates? | validate.sh hash-lock; pre-existing 053-056/057 drift; symlink; regenerated index; M6/M7 gates (iter 4-5, §6.3, §7.3). |

## 4. Key Findings (consolidated)

- **Census:** 45 on-disk children (001-033, 035, 047-057); 13 already phase-parents (004, 006-014, 047, 048, 049) holding 61 grandchildren; 32 leaves. Parent `children_ids` lists 44 (057 not yet registered). (iter 1, F1.1)
- **Tooling verdict:** `is-phase-parent.js health` → `error 45 ... Split into nested phase parents or move historical phases under z_archive/`. (iter 1, F1.2)
- **Constraint surface:** 11 distinct machine-readable surfaces must update in lockstep (iter 1 F1.3, iter 3 F3.5). External editable references ≈ 27 files (iter 3).
- **Precedent:** 036 was renumbered from 034 on 2026-07-17 (commit 8d3b5b21d57); the 2026-08-07 specs-root flip (606e55cb8a9) re-touched every child path, making raw git first-commit dates unusable as per-child chronology. (iter 1, iter 5)
- **Chronology proof:** `050-trustworthy-state-records.created_at = 2026-07-27` — before 019/020 (07-29) and the entire 021-032 tree (07-31) — yet numbered 050. The numeric prefix is not chronological. (iter 5, F5.1)

## 5. Proposed Grouping (Q2) — 9 Multi-Phase Grandparents

| New grandparent (direct child of 036) | Members (current) | Theme |
|---|---|---|
| `001-research-inputs-and-baseline` | 001, 002, 003 | Research inputs + frozen BASE/taxonomy/census |
| `002-ledger-and-spine-architecture` | 004, 005, 006 | Spine ADR/ledger contract + early fan-out unblock + dark ledger core |
| `003-shared-services-and-migration-bridge` | 007, 008 | Shared evidence/control services + compat/shadow/rollback bridge |
| `004-orchestration-convergence-and-mode-contracts` | 009, 010, 011, 012 | Durable fan-out/fan-in + novelty/claims + convergence/health + mode contracts |
| `005-mode-migration-cutover-and-gate` | 013, 014, 015, 016, 017 | Per-mode migrations → cutover → legacy retirement → whole-system gate → closeout |
| `006-drift-revalidation-and-blocker-closeout` | 018, 021, 022, 023, 024 | Drift revalidation + the four named cutover blockers |
| `007-remediation-docs-integrity-and-hardening` | 019, 020, 025, 026, 027, 028, 029, 030, 031, 032, 033 | Docs/alignment + integrity/hardening bindings |
| `008-executor-and-cli-hardening` | 035, 047, 048, 049, 050, 051, 052 | Executor wiring/containment/parity/repair + stress/playbooks + residual closeouts |
| `009-review-and-rollback-followup` | 053, 054, 055, 056 | Runtime code review + drift remediation + rollback hardening + containment exemption |

- Numbering scheme A (program-ordered 001-009) is recommended; nested children already reuse 001-00N (precedented). Direct 036 children → **10** (9 grandparents + 057). Every grandparent member count ≤ 11 (healthy). (iter 2 F2.3, iter 3 F3.3-F3.4)

## 6. Migration Plan (Q3) — M0-M7

- **M0 Preflight:** capture health CLI baseline (`error 45`) + validate.sh manifest hash (`f6cf1e943d...`); create 9 grandparent dirs; **write timeline.md FIRST** (chronology captured before any rename).
- **M1 Moves:** `git mv` each child into its grandparent, one group at a time in program order; no mid-plan commits.
- **M2 Grandparents:** create each grandparent's lean trio (`spec.md` + `description.json` + `graph-metadata.json`) with `children_ids` = member paths.
- **M3 Child/grandchild lockstep:** update every moved child + grandchild `graph-metadata.json` (`packet_id`, `spec_folder`, `parent_id`), `description.json` (`specFolder`, `parentChain`), and `spec.md` frontmatter (`parent`, `_memory.continuity.packet_pointer`). ~61 grandchildren move with their parent.
- **M4 Parent 036 surfaces:** `graph-metadata.json` `children_ids` → 9-10 grandparent paths; `spec.md` Phase Map + PHASE DOCUMENTATION MAP → grandparent rows; `manifest/phase-tree.json` (`live_direct_children` → 9, add band entries); parent docs (`handover.md`, `goal.md`, `goal-plan-review.md`, `cutover-execution-plan.md`, `033-dispositions.md`, `before-and-after.md`, `execution-sequencing-strategy.md`, `goal-prompt.md`).
- **M5 External surfaces:** (1) `validate.sh` 036 manifest block — replace 40-entry list with 9 grandparent slugs, ADD 053-056 (fix pre-existing drift), **recompute sha256 in the same commit**; (2) `recursive-child-manifest.vitest.ts`; (3) runtime `write-set-conflict-graph/{graph.ts,shipped-census.ts}` + 15 `runtime/tests/unit/*.vitest.ts` + `legacy-real-log.ts`; (4) cross-packet specs (sk-code/021, sk-design/012/004, sk-doc/022, 023, 024, sk-doc/020 baseline manifest); (5) **regenerate** `specs/descriptions.json` via the MCP folder-discovery cache (`memory_index_scan`), never hand-edit.
- **M6 Verification gates:** health CLI → `ok`; `validate.sh --strict` → exit 0 (new hash); `validate.sh --strict --recursive` → exit 0; `rg` residue → only append-only historical logs; vitest suite green; memory scan re-indexes.
- **M7 Commit + rollback:** single documented commit (`refactor(036): consolidate 45 child phases into 9 multi-phase parents`); rollback = `git revert` (lossless — git mv only, no data transformation).

### 6.3 Risks, Rules, Gates
- **Hash-lock:** validate.sh 036 manifest breaks if the list changes without sha256 recompute — update together.
- **Pre-existing drift:** 053-056 absent from the manifest; 057 absent from `children_ids` — reconcile during M5/M4.
- **Symlink:** `.opencode/specs` → `../specs`; update the canonical `specs/` path; `.opencode/specs/...` references resolve automatically.
- **Index:** `specs/descriptions.json` is a regenerated cache (`folder-discovery.ts`), 3207 entries, 133 036-related — regenerate, don't hand-edit.
- **Do NOT rewrite** historical research/lineage logs (037 research/, iter-*.err, fanout-lineage.out).
- **Optional:** move genuinely-complete leaf phases to `z_archive/` (tooling-endorsed alternative) for further slimming; the 9-grandparent plan covers everything without it.

## 7. timeline.md Design (Q4)

- **Schema:** `seq` (integer, created_at ASC — the ONLY sort key, never reassigned) · `created_at` · `last_save_at` · `current path (numbered)` · `stable_id` (slug without prefix — durable identity) · `moved_to` (post-consolidation path; doubles as migration manifest) · `status`; plus an append-only **Renumber Ledger** (`date | from | to | reason | ref`).
- **Why required:** numeric prefix is already non-chronological (050 anomaly); raw git first-commit is uniform 08-07 after the specs-root flip. `created_at` is the best single source but a save could rewrite it — timeline.md is the only durable record.
- **Generation:** script reads all child `graph-metadata.json`, sorts by `created_at`, warns on missing/anomalous timestamps or duplicate slugs; cross-check via git `--follow` pre-flip history.
- **Append-only discipline:** migration fills `moved_to` and appends renumber rows only; never rewrites existing rows.
- **Post-migration verification:** `seq`/`stable_id` identical to pre-migration; `moved_to` maps 45 → 45; diff shows only `moved_to` additions + renumber-ledger append.

## 8. References

- `specs/system-deep-loop/036-deep-loop-innovation/` (parent graph-metadata.json, spec.md, manifest/phase-tree.json, description.json)
- Child graph-metadata.json + description.json + spec.md (001-056)
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (load_child_manifest 036 block, hash `f6cf1e943d...`)
- `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts` (thresholds 20/40, health CLI)
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts` (specs/descriptions.json cache)
- `.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts`
- `specs/descriptions.json` (global index)
- git log for 036 children; commits 8d3b5b21d57 (034<->036), 606e55cb8a9 (specs-root flip), 0f38efabe24 (053-056 wave)
- Iteration files: `iterations/iteration-001.md` … `iteration-005.md` in this lineage

## 9. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat the 45-child manifest as acceptable | Spec-kit phase-parent health classifies 45 children as `error` and recommends splitting into nested phase parents | is-phase-parent.ts:125-145; health CLI output | 1 |
| Numbering scheme B (tail-band reuse 035/047-056 for grandparents) | Reads arbitrarily and fights the program-ordered taxonomy; scheme A maps 1:1 to program bands | iter 3 analysis | 3 |
| Rewriting historical research/lineage logs (037 research/, iter-*.err, fanout-lineage.out) | Append-only research evidence, not migration targets | rg inventory | 3 |
| Hand-editing `specs/descriptions.json` | It is the MCP folder-discovery regenerated cache; hand-edits are overwritten and risk corruption | folder-discovery.ts:1236-1330,1463 | 4 |
| validate.sh manifest update without sha256 recompute in the same commit | Hash-lock would break recursive validation | validate.sh:217-246 | 4 |
| Numeric prefix as timeline sort key | Refuted by the 050 anomaly (created 07-27, numbered 050) | child graph-metadata created_at | 5 |
| Raw `git log` first-commit as timeline sort key | Refuted by the specs-root flip (uniform 08-07 dates) | git log | 5 |
| Mutable timeline.md | Rewrites would destroy the chronology guarantee; append-only is required | iter 5 design | 5 |

## 10. Open Questions

- Whether to adopt the optional `z_archive/` sub-split for genuinely-complete leaf phases in addition to the 9-grandparent grouping.
- Whether 057-phase-consolidation-research should be renamed/absorbed into the implementation packet once this proposal is approved.
- Whether the migration should be one commit or one commit per grandparent group (M7 options).

## 11. Next Steps (proposal only)

1. Approve the 9-grandparent grouping + scheme A numbering.
2. Create the timeline.md (M0) and the 9 grandparent dirs.
3. Execute M1-M7 with the gates above.
4. Re-run `validate.sh --strict --recursive` and the health CLI as the authoritative final proof.
