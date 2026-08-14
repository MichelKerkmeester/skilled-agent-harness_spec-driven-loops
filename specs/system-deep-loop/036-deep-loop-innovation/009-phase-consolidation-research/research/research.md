# Deep Research: Consolidating the 036 Phase Tree

## 1. Executive Summary

Consolidation is feasible and recommended. The live parent has 45 numbered directories on disk: 44 registered children plus this `009-phase-consolidation-research` host. The repository's phase-parent health model treats more than 40 children as an error and recommends nested phase parents or archival. Both independent research lineages reached the same feasibility verdict and identified the same migration hazards. [SOURCE: lineages/ds-a/research.md:5-25] [SOURCE: lineages/ds-b/research.md:5-29]

The recommended target is **8 new phase parents plus the existing 057 research packet**, reducing the direct-child list from 45 to 9 while keeping every existing child basename unchanged. This reconciles the lineages' 7-group and 9-group proposals: it preserves the compact 7-group shape, but splits the mixed remediation band at the real blocker boundary identified by the 9-group proposal. No existing phase content should be merged, deleted, flattened, or renumbered internally. The change is structural grouping only.

The migration is high blast-radius despite being mechanically reversible. It must update graph metadata, generated descriptions, parent phase maps, adjacency references, the hash-locked `validate.sh` manifest and matching test, runtime fixtures, cross-packet references, and the memory/index surfaces in one governed migration. The chronological record must be generated and committed before the first move.

## 2. Scope And Method

The run used two independent `cli-opencode` lineages (`ds-a`, `ds-b`) with `opencode-go/deepseek-v4-flash`, five iterations each, and `stop_policy=max-iterations`. Each iteration was mechanically revalidated through the workflow's canonical narrative + route-proof + delta gate after the initial full-lineage adapter omitted route-proof fields and delta files. The original rows remain append-only evidence; corrected rows are later records for the same iteration number, as required by the verifier's latest-record-wins retry contract. [SOURCE: orchestration-summary.json:1-117] [SOURCE: lineages/ds-a/deep-research-state.jsonl] [SOURCE: lineages/ds-b/deep-research-state.jsonl]

The research was proposal-only. No folder was moved, renamed, regrouped, deleted, or otherwise restructured.

## 3. Current-State Census

- On disk: 45 numbered directories, `001-033`, `035`, and `047-057`.
- Registered by the parent: 44 `children_ids`; the new 057 host is not yet registered.
- Existing nested phase parents: 13 (`004`, `006-014`, `047-049`), containing about 61 grandchildren.
- Existing leaves: 32 when the 057 host is included, 31 among the registered 44.
- The parent's hardcoded strict-validation manifest contains only 40 entries and omits `053-056`.
- `manifest/phase-tree.json` declares 44 live children but describes only the original `001-017` program.
- The global `specs/descriptions.json` cache contains 133 entries related to 036 and must be regenerated rather than hand-edited.
- Existing references use both canonical `specs/...` and legacy `.opencode/specs/...` spellings.

[SOURCE: lineages/ds-a/iterations/iteration-001.md] [SOURCE: lineages/ds-b/iterations/iteration-001.md] [SOURCE: lineages/ds-a/iterations/iteration-003.md:68-107]

## 4. Feasibility And Benefit

### Feasibility

The structure is supported. Existing descendants already prove that phase parents may contain phase parents, and recursive validation traverses numbered child directories at arbitrary depth. Moving a whole child directory preserves its own descendants; only path-bearing metadata and references change. [SOURCE: lineages/ds-a/research.md:29-33] [SOURCE: lineages/ds-b/research.md:31-45]

### Benefit

The direct-child inventory drops from 45 to 9. Every proposed group remains below the 20-child warning threshold. Parent-level context becomes a short thematic map rather than a 45-row mixed historical inventory. Retrieval can target one thematic group before loading its members.

### Limits

Grouping optimizes navigation and context selection, not total corpus size. It adds one path segment and one lean trio per group. Benefits are strongest for dependency spines and weakest for unrelated completed leaves. Historical content must remain available through `timeline.md`, git history, and unchanged packet contents.

## 5. Recommended Eight-Group Topology

| New direct child | Existing children moved beneath it | Rationale |
|---|---|---|
| `001-research-inputs-and-architecture` | `001-004` | Research inputs, baseline/taxonomy, and the architecture/transition contract |
| `002-substrate-and-orchestration` | `005-011` | Live-tools unblock, ledger substrate, evidence/control services, rollback bridge, orchestration, novelty, convergence |
| `003-mode-contracts-migration-and-cutover` | `012-015` | Shared mode contracts, lane migrations, authority cutover, legacy-writer retirement |
| `004-gate-closeout-and-drift` | `016-018` | Whole-system gate, integration closeout, and later drift revalidation |
| `005-blocker-closeout` | `021-024` | Four explicitly named cutover/blocker closeouts |
| `006-runtime-docs-and-integrity-hardening` | `019`, `020`, `025-033` | Runtime docs/alignment followed by certificate, integrity, routing, promotion, harness, docs, and lock hardening |
| `007-executor-and-cli-hardening` | `035`, `047-052` | CLI stress/playbooks, executor wiring, containment, alignment integrity, state records, residual findings, Devin repair |
| `008-review-and-rollback-followup` | `053-056` | Runtime review, drift remediation, rollback hash hardening, containment exemption |

`009-phase-consolidation-research` stays a direct child until an implementation packet supersedes or absorbs it. Existing child basenames remain unchanged beneath their new parent. For example, `013-mode-and-lane-migrations` becomes `003-mode-contracts-migration-and-cutover/013-mode-and-lane-migrations`; its existing children remain beneath it unchanged.

This topology has group sizes `4, 7, 4, 3, 4, 11, 8, 4`. It preserves the two research lineages' common boundaries while avoiding the 14-child mixed remediation bucket in the 7-group option and the finer-than-needed splits in the 9-group option.

## 6. Exact Move Map

| Current child | Proposed parent |
|---|---|
| `001-deep-loop-market-research` | `001-research-inputs-and-architecture` |
| `002-deep-loop-effectiveness-and-fanout` | `001-research-inputs-and-architecture` |
| `003-baseline-taxonomy-and-state-census` | `001-research-inputs-and-architecture` |
| `004-architecture-coverage-and-transition-contract` | `001-research-inputs-and-architecture` |
| `005-fanout-live-tools-unblock` | `002-substrate-and-orchestration` |
| `006-transition-authorized-ledger-core` | `002-substrate-and-orchestration` |
| `007-shared-evidence-and-control-services` | `002-substrate-and-orchestration` |
| `008-compatibility-shadow-and-rollback-bridge` | `002-substrate-and-orchestration` |
| `009-fanout-fanin-durable-orchestration` | `002-substrate-and-orchestration` |
| `010-novelty-claims-continuity-and-projections` | `002-substrate-and-orchestration` |
| `011-convergence-termination-and-health` | `002-substrate-and-orchestration` |
| `012-shared-mode-contracts-and-fixtures` | `003-mode-contracts-migration-and-cutover` |
| `013-mode-and-lane-migrations` | `003-mode-contracts-migration-and-cutover` |
| `014-staged-state-migration-and-authority-cutover` | `003-mode-contracts-migration-and-cutover` |
| `015-legacy-writer-retirement` | `003-mode-contracts-migration-and-cutover` |
| `016-whole-system-gate` | `004-gate-closeout-and-drift` |
| `017-integrate-latest-and-closeout` | `004-gate-closeout-and-drift` |
| `018-drift-census-and-plan-revalidation` | `004-gate-closeout-and-drift` |
| `021-completion-evidence-reconcile` | `005-blocker-closeout` |
| `022-shadow-parity-independent-derivation` | `005-blocker-closeout` |
| `023-legacy-compat-event-vocabulary` | `005-blocker-closeout` |
| `024-durable-write-boundaries` | `005-blocker-closeout` |
| `019-runtime-code-readmes` | `006-runtime-docs-and-integrity-hardening` |
| `020-sk-code-opencode-alignment` | `006-runtime-docs-and-integrity-hardening` |
| `025-artifact-certificate-binding` | `006-runtime-docs-and-integrity-hardening` |
| `026-alignment-coverage-integrity` | `006-runtime-docs-and-integrity-hardening` |
| `027-mode-gate-and-contract-binding` | `006-runtime-docs-and-integrity-hardening` |
| `028-fanout-dispatch-integrity` | `006-runtime-docs-and-integrity-hardening` |
| `029-improvement-promotion-authority` | `006-runtime-docs-and-integrity-hardening` |
| `030-runtime-mirror-and-routing-parity` | `006-runtime-docs-and-integrity-hardening` |
| `031-silent-failure-and-harness-repair` | `006-runtime-docs-and-integrity-hardening` |
| `032-docs-drift-and-p2-batch` | `006-runtime-docs-and-integrity-hardening` |
| `033-identity-and-lock-ownership-hardening` | `006-runtime-docs-and-integrity-hardening` |
| `035-cli-adapter-stress-and-playbooks` | `007-executor-and-cli-hardening` |
| `047-executor-wiring-and-parity` | `007-executor-and-cli-hardening` |
| `048-write-containment-hardening` | `007-executor-and-cli-hardening` |
| `049-deep-alignment-integrity` | `007-executor-and-cli-hardening` |
| `050-trustworthy-state-records` | `007-executor-and-cli-hardening` |
| `051-residual-finding-closeouts` | `007-executor-and-cli-hardening` |
| `052-cli-devin-executor-repair` | `007-executor-and-cli-hardening` |
| `053-runtime-code-review` | `008-review-and-rollback-followup` |
| `054-review-drift-remediation` | `008-review-and-rollback-followup` |
| `055-rollback-candidate-hash-hardening` | `008-review-and-rollback-followup` |
| `056-review-containment-exemption` | `008-review-and-rollback-followup` |

## 7. Migration Surface Inventory

The migration must inventory and update every in-scope variant, then rescan for residue.

1. Parent `graph-metadata.json`: replace direct `children_ids`, reconcile `last_active_child_id`, retain packet identity.
2. Eight new lean phase-parent trios: `spec.md`, `description.json`, `graph-metadata.json`.
3. Moved child and grandchild `graph-metadata.json`: `packet_id`, `spec_folder`, `parent_id`, nested `children_ids`, derived active-child paths.
4. Moved child and grandchild `description.json`: `specFolder`, `parentChain`, IDs/slugs where path-derived.
5. Child `spec.md` and continuity frontmatter: parent pointers, packet pointers, predecessor/successor and sibling-adjacency paths.
6. Parent `spec.md`: Phase Map, Phase Documentation Map, outcomes, transitions, child-count prose, disambiguation for `dispositions.md`.
7. Parent `manifest/phase-tree.json`: current topology and direct-child count, while preserving the original-program history explicitly.
8. Parent supporting docs: `handover.md`, goals, execution/cutover plans, before/after and sequencing docs.
9. `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`: replace the 036 manifest and recompute its embedded SHA-256 in the same change.
10. `.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts`: update in lockstep with the manifest.
11. Runtime code and tests under the write-set/conflict-graph and deep-loop runtime surfaces that embed child paths.
12. Cross-packet live references in sk-code, sk-design, sk-doc, skill-advisor, and related packets.
13. Per-packet generated descriptions and global `specs/descriptions.json`: regenerate, never hand-edit the cache.
14. Memory/index records: run move reconciliation or re-index after files settle; verify old packet identities no longer surface as live paths.
15. Historical append-only research logs: retain old paths as historical evidence; exclude them from the live-residue failure set.

[SOURCE: lineages/ds-a/iterations/iteration-003.md:68-107] [SOURCE: lineages/ds-b/iterations/iteration-003.md:53-72]

## 8. Ordered Migration Plan

### M0: Freeze And Prove Baseline

- Create a named memory checkpoint.
- Record `git status`, commit baseline, phase-parent health result, strict/recursive validation results, and current manifest hash.
- Generate and commit the canonical root `timeline.md` before any move.
- Generate a machine-readable old-path to new-path manifest from Section 6.

### M1: Create Group Parents

- Create the eight lean phase-parent trios using contract-backed templates.
- Validate their declared child memberships before moving content.

### M2: Move Direct Children

- Use `git mv` group by group.
- Preserve each existing child basename.
- Do not flatten or rename existing grandchildren.
- Stop immediately on an unrecognized child, collision, or concurrent change.

### M3: Update Packet-Local Metadata

- Update moved children and every descendant path-bearing metadata field.
- Update adjacency and continuity pointers.
- Regenerate descriptions from canonical content.

### M4: Update Parent Topology

- Update the parent graph, phase maps, phase-tree manifest, supporting docs, and 057 registration.
- Keep the original `001-017` historical program narrative as history, not as the live direct-child map.

### M5: Update External Consumers

- Update `validate.sh` manifest + hash and its test together.
- Update runtime fixtures and live cross-packet references.
- Regenerate global descriptions and memory/index data.
- Leave historical append-only evidence unchanged.

### M6: Verify Final State

- Phase-parent health reports `ok` for the 036 parent and all eight new parents.
- Strict recursive validation exits 0.
- Manifest-specific tests and affected runtime tests pass.
- Every old live path maps exactly once to a new path.
- Residue scan reports only allowlisted historical records.
- `timeline.md` stable identities and chronological sequence are byte-stable from the pre-move baseline.

### M7: Commit And Roll Back

- Prefer one dedicated migration commit after the full gate is green; this gives `git revert` one lossless rollback boundary.
- If operational limits require group commits, keep every intermediate state green and record the exact rollback order.
- Never rewrite history or delete the pre-move checkpoint until post-migration validation and memory reconciliation are confirmed.

[SOURCE: lineages/ds-b/iterations/iteration-004.md:11-66] [SOURCE: lineages/ds-a/iterations/iteration-003.md:95-107]

## 9. `timeline.md` Design

The canonical file should live at `specs/system-deep-loop/036-deep-loop-innovation/timeline.md`. It is generated and committed before M1, then treated as an append-only identity ledger.

### Schema

| Field | Contract |
|---|---|
| `seq` | Stable chronological sequence, assigned once; never reused or reordered |
| `stable_id` | Slug without the numeric prefix; durable identity across renumbering |
| `created_at` | Graph-metadata creation timestamp captured before migration |
| `git_first_add` | Earliest attributable add timestamp using `--follow` across path migrations |
| `last_save_at_at_baseline` | Save timestamp captured at M0; evidence, not chronology |
| `path_at_baseline` | Full pre-migration path |
| `current_path` | Current live path; updated through append-only move events or a current projection |
| `status_at_baseline` | Status captured at M0 |
| `evidence_quality` | `confirmed`, `batch-tied`, `inferred`, or `missing` |
| `notes` | Timestamp anomalies, batch ties, renumber precedents |

Use `created_at` as the primary sort, `git_first_add` as an independent cross-check, and the original numeric prefix only as a deterministic tie-break for the 001-017 batch. Do not sort by current number. `last_save_at` measures later work, not creation order.

### Baseline Chronology

| seq | path at baseline | created_at | git first add | status | evidence note |
|---:|---|---|---|---|---|
| 1 | `001-deep-loop-market-research` | 2026-07-15T19:00:45Z | 2026-07-14T22:32:08+02:00 | complete | Confirmed first |
| 2 | `002-deep-loop-effectiveness-and-fanout` | 2026-07-15T19:00:46Z | 2026-07-15T18:45:50+02:00 | complete | Batch |
| 3 | `003-baseline-taxonomy-and-state-census` | 2026-07-16T03:43:57Z | 2026-07-15T18:45:50+02:00 | complete | Batch |
| 4 | `004-architecture-coverage-and-transition-contract` | 2026-07-16T03:43:58Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 5 | `005-fanout-live-tools-unblock` | 2026-07-16T03:43:58Z | 2026-07-15T18:45:50+02:00 | complete | Batch |
| 6 | `006-transition-authorized-ledger-core` | 2026-07-16T03:43:58Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 7 | `007-shared-evidence-and-control-services` | 2026-07-16T03:43:58Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 8 | `008-compatibility-shadow-and-rollback-bridge` | 2026-07-16T03:43:59Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 9 | `009-fanout-fanin-durable-orchestration` | 2026-07-16T03:43:59Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 10 | `010-novelty-claims-continuity-and-projections` | 2026-07-16T03:43:59Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 11 | `011-convergence-termination-and-health` | 2026-07-16T03:43:59Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 12 | `012-shared-mode-contracts-and-fixtures` | 2026-07-16T03:44:00Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 13 | `013-mode-and-lane-migrations` | 2026-07-16T03:44:00Z | 2026-07-15T21:20:48+02:00 | in_progress | Batch |
| 14 | `014-staged-state-migration-and-authority-cutover` | 2026-07-16T03:44:00Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 15 | `015-legacy-writer-retirement` | 2026-07-16T03:44:00Z | 2026-07-15T18:59:03+02:00 | planned | Batch |
| 16 | `016-whole-system-gate` | 2026-07-16T03:44:01Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 17 | `017-integrate-latest-and-closeout` | 2026-07-16T03:44:01Z | 2026-07-15T18:45:50+02:00 | planned | Batch |
| 18 | `018-drift-census-and-plan-revalidation` | 2026-07-19T12:13:37Z | 2026-07-20T10:35:11+02:00 | in_progress | Confirmed later wave |
| 19 | `050-trustworthy-state-records` | 2026-07-27T16:10:09Z | 2026-07-27T18:11:32+02:00 | complete | Number proves prefix is not chronology |
| 20 | `019-runtime-code-readmes` | 2026-07-29T06:45:11Z | 2026-07-29T10:55:11+02:00 | complete | Confirmed |
| 21 | `020-sk-code-opencode-alignment` | 2026-07-29T06:45:18Z | 2026-07-29T10:55:11+02:00 | complete | Confirmed |
| 22 | `021-completion-evidence-reconcile` | 2026-07-30T19:43:41Z | 2026-08-03T16:42:10+02:00 | in_progress | Git add lagged metadata creation |
| 23 | `022-shadow-parity-independent-derivation` | 2026-07-31T01:25:19Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 24 | `023-legacy-compat-event-vocabulary` | 2026-07-31T01:25:19Z | 2026-07-31T03:29:26+02:00 | complete | Batch |
| 25 | `024-durable-write-boundaries` | 2026-07-31T01:25:20Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 26 | `025-artifact-certificate-binding` | 2026-07-31T01:25:20Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 27 | `026-alignment-coverage-integrity` | 2026-07-31T01:25:20Z | 2026-07-31T03:29:26+02:00 | complete | Batch |
| 28 | `027-mode-gate-and-contract-binding` | 2026-07-31T01:25:20Z | 2026-07-31T03:29:26+02:00 | complete | Batch |
| 29 | `028-fanout-dispatch-integrity` | 2026-07-31T01:25:20Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 30 | `029-improvement-promotion-authority` | 2026-07-31T01:25:21Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 31 | `030-runtime-mirror-and-routing-parity` | 2026-07-31T01:25:21Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 32 | `031-silent-failure-and-harness-repair` | 2026-07-31T01:25:21Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 33 | `032-docs-drift-and-p2-batch` | 2026-07-31T01:25:21Z | 2026-07-31T03:29:26+02:00 | in_progress | Batch |
| 34 | `033-identity-and-lock-ownership-hardening` | 2026-08-05T18:42:31Z | 2026-08-08T02:41:45+02:00 | complete | Git add lagged metadata creation |
| 35 | `035-cli-adapter-stress-and-playbooks` | 2026-08-07T07:50:32Z | 2026-08-07T10:10:10+02:00 | planned | Confirmed |
| 36 | `047-executor-wiring-and-parity` | 2026-08-08T07:14:10Z | 2026-08-08T09:25:50+02:00 | in_progress | Batch |
| 37 | `048-write-containment-hardening` | 2026-08-08T07:14:11Z | 2026-08-08T09:25:50+02:00 | in_progress | Batch |
| 38 | `049-deep-alignment-integrity` | 2026-08-08T07:14:12Z | 2026-08-08T09:25:50+02:00 | in_progress | Batch |
| 39 | `051-residual-finding-closeouts` | 2026-08-12T16:44:22Z | 2026-08-12T18:48:53+02:00 | in_progress | Confirmed |
| 40 | `052-cli-devin-executor-repair` | 2026-08-12T20:56:31Z | 2026-08-12T23:12:26+02:00 | complete | Confirmed |
| 41 | `053-runtime-code-review` | 2026-08-13T05:43:08Z | 2026-08-13T08:54:52+02:00 | complete | Review wave |
| 42 | `054-review-drift-remediation` | 2026-08-13T06:44:37Z | 2026-08-13T08:54:52+02:00 | complete | Review wave |
| 43 | `055-rollback-candidate-hash-hardening` | 2026-08-13T06:44:37Z | 2026-08-13T08:54:52+02:00 | complete | Review wave |
| 44 | `056-review-containment-exemption` | 2026-08-13T06:44:37Z | 2026-08-13T08:54:52+02:00 | complete | Review wave |
| 45 | `009-phase-consolidation-research` | unknown | untracked at baseline | unknown | Assign only after canonical metadata exists |

The ordering is independently derived from graph metadata and path-following git history. It corrects a lineaged finding that placed 021 after 022-032 based only on git-add timing: metadata creation shows 021 preceded that batch, while its first git add occurred later. This is why both evidence columns and an `evidence_quality` field are necessary.

### Append-Only Move Events

Do not overwrite historical path cells. Append events instead:

```text
| event_seq | at | stable_id | from_path | to_path | reason | commit |
```

A generated current-path projection may be replaced, but the baseline chronology and move-event ledger remain immutable.

## 10. Risks And Mitigations

| Risk | Failure | Mitigation |
|---|---|---|
| Hash-locked validator manifest | Strict validation exits 2 | Change manifest, hash, and test together |
| Partial path migration | Runtime/tests resolve stale paths | Generated 44-entry move manifest and residue scan |
| Description cache edits | Regeneration overwrites manual changes | Regenerate through the owning workflow |
| Memory stale paths | Search returns moved packets under old names | Checkpoint, move reconciliation, re-index, query verification |
| Historical evidence rewrite | Chronology and audit trail become false | Allowlist immutable logs; never mass-rewrite them |
| Concurrent work during moves | Lost or misattributed changes | Freeze, clean baseline, single-writer migration |
| Over-grouping | Extra navigation hop without context benefit | Keep groups thematic and under 11 members |
| Number-as-time assumption | Renumbering destroys perceived lineage | Canonical timeline with stable IDs and dual timestamps |

## 11. Recommendations

1. Approve the 8-group topology as the planning baseline.
2. Create a dedicated Level 3 migration child rather than implementing from this research packet.
3. Make canonical `timeline.md` generation and review the first implementation gate.
4. Preserve child basenames and all existing nested structures.
5. Treat validator manifest/hash/test, global descriptions, cross-packet references, and memory reconciliation as blocking migration work, not cleanup.
6. Require strict recursive validation, affected runtime tests, exact move-map coverage, and an allowlisted stale-reference scan before completion.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Keep 45 direct children | Tooling classifies the parent above the 40-child error threshold | phase-parent health source | ds-b 1 |
| Flat renumber without group parents | Same direct-child count and migration cost, no context-selection benefit | analysis | ds-a 3 |
| One giant group | Adds a level but preserves the same mixed inventory | analysis | ds-a 5 |
| 7 groups without blocker split | Leaves a 14-child mixed remediation band | cross-lineage comparison | ds-a 2-3, ds-b 2-3 |
| 9 groups | Valid but splits the original spine more finely than context optimization requires | cross-lineage comparison | ds-b 2-3 |
| Archive completed phases as the primary solution | Changes discoverability and archival semantics; grouping solves the health error without hiding history | tooling alternative analysis | ds-b 4 |
| Renumber existing child basenames | Unnecessary reference churn and chronology loss | move-map analysis | ds-a 3 |
| Hand-edit `specs/descriptions.json` | It is a generated cache | folder-discovery evidence | ds-b 4 |
| Rewrite historical research logs | They are append-only evidence | reference inventory | both 3-4 |
| Sort timeline by numeric prefix | `050` predates `019-033` | graph metadata | both 4-5 |
| Sort timeline only by git first add | Delayed commits and path-root migration distort chronology | independent derivation | both 4-5 |

## Divergence Map

- **7-group branch:** most compact; weak point is the mixed 14-child remediation group.
- **9-group branch:** strongest dependency semantics; weak point is extra fragmentation of the original spine.
- **Selected 8-group branch:** uses the 7-group spine boundaries, splits blocker closeout from docs/integrity hardening, and keeps executor/review waves separate.
- **Remaining frontier:** whether completed leaves should later move under `z_archive/`; this is independent of the proposed grouping and should not block it.

## 12. Open Questions

1. Should 057 become the implementation packet, or should a new migration child supersede it? Recommendation: create a new implementation child and retain 057 as research evidence.
2. Should generated current-path projection rows in `timeline.md` be replaced in place while the baseline/event ledger remains append-only? Recommendation: yes, with machine-owned markers and checksum.
3. Which historical-path files are allowlisted in the final residue scan? Define the list before M1.

## 13. Convergence Report

- Stop reason: `maxIterationsReached` by operator policy.
- Requested iterations: 5 per lineage.
- Completed lineages: 2 of 2.
- Canonically verified iteration numbers: 10 of 10.
- Questions answered: feasibility, topology, migration plan, reference surfaces, chronology design.
- Merge caveat: `fanout-merge.cjs` recorded 14 source findings but emitted an empty structured `keyFindings` array because the lineage registries used string findings. This synthesis reconstructs findings from verified iteration narratives and delta files; the machine merge output remains intact as evidence.
- Timestamp caveat: model-authored iteration timestamps were outside subprocess wall-clock windows. Runtime orchestration timestamps and append order are authoritative; model timestamps are not used to derive the 036 chronology.

## 14. References

- `lineages/ds-a/research.md`
- `lineages/ds-b/research.md`
- `lineages/ds-a/iterations/iteration-001.md` through `iteration-005.md`
- `lineages/ds-b/iterations/iteration-001.md` through `iteration-005.md`
- `lineages/*/deltas/iter-001.jsonl` through `iter-005.jsonl`
- `orchestration-summary.json`
- `findings-registry.json`
- `resource-map.md`
- `specs/system-deep-loop/036-deep-loop-innovation/graph-metadata.json`
- `specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts`

## 15. Implementation Boundary

This report authorizes no restructure. The proposed migration requires a separate approved plan, a named rollback boundary, baseline proof, and a clean single-writer execution window.

## 16. Synthesis Integrity

Confirmed claims cite packet artifacts or independently derived on-disk metadata. Judgments are labeled as recommendations. Conflicting lineage details were resolved through an independent derivation rather than majority vote.

## 17. Final Verdict

**Proceed to planning for an 8-group structural consolidation.** Generate the canonical timeline first, preserve all child basenames and nested packet contents, and treat the full reference/index/validator migration as one governed operation.
