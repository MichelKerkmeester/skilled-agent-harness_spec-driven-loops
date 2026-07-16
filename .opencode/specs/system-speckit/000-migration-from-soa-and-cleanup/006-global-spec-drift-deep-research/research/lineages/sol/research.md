# Research: Global Spec Drift and Prior Context Optimization

> **SOL lineage synthesis** for `006-global-spec-drift-deep-research`.
> Executor: `cli-opencode` / `openai/gpt-5.6-sol-fast` / high reasoning.
> Session: `fanout-sol-1784206807603-dm75z2`, generation 1.
> Converged at iteration 9 of 10. This is one independent input to the GLM/SOL/LUNA fan-out merge, not the merged phase-006 report.

## 1. Executive Summary

The `.opencode/specs` tree is large and heterogeneous: this lineage counted 3,015 directories containing `spec.md` across 12 top-level tracks and classified 2,168 as active after excluding 847 archive, backup, fixture, scratch, and sandbox copies. The dominant risk is not missing metadata. All 2,168 active candidates had parseable `description.json` and `graph-metadata.json`; the dominant risk is semantic disagreement among spec status, graph status, checklists, continuity fields, and phase-parent rollups.

The highest-impact confirmed classes are:

1. Completion-state and continuity drift at fleet scale, including 212 terminal-spec/nonterminal-graph conflicts, 19 inverse conflicts, 1,093 all-zero continuity fingerprints, 13 literal status placeholders, and 60 contradictory direct parent/child graph projections.
2. Explicitly deferred topology debt in `sk-doc` and `system-deep-loop`, including six duplicated sibling prefixes under `sk-doc/015-sk-doc-parent` and stale deep-loop `children_ids`.
3. A packet-wide ownership pointer in `system-speckit/040-base-files-renumbering-name-cleanup` that targets a deleted archive path.
4. Fifteen active phase parents retaining heavy root documents without a defined grandfather/migration policy.
5. Smaller derived-index residue that a rebuild can address, such as 152 stale code-graph rename entries and stale sk-design track-root child metadata.

Prior context optimization used bounded compaction cache/injection, source-aware session priming, pointer-based snapshots, minimal resume/bootstrap, in-memory quality scoring, continuity fingerprints, and a deliberate migration away from standalone deep-context. Current source confirms these mechanisms remain implemented. It also confirms that automatic narrative compaction did not ship. Several reported benefits, including approximately 50% dedup token savings and sub-second resume, remain design/research claims rather than longitudinal outcome measurements.

For phase 007, teardown can rebuild a functional search index from canonical spec documents and regenerate vectors, but it cannot restore evaluation history, learned constitutional-rule provenance, drift ledgers, or search-decision audit trails. It also cannot repair contradictory canonical source documents; a clean index will faithfully reindex those contradictions.

## 2. Scope and Method

The lineage used nine focused iterations:

| Iteration | Focus | newInfoRatio |
|---:|---|---:|
| 1 | Quantitative full-tree inventory | 1.00 |
| 2 | Active topology and migration residue | 0.80 |
| 3 | Completion and metadata drift | 0.90 |
| 4 | Prior context-optimization programs | 0.90 |
| 5 | Memory-database teardown implications | 0.70 |
| 6 | Global drift and migration-residue taxonomy | 0.35 |
| 7 | Independent exact-path verification | 0.04 |
| 8 | Current optimization-surface verification | 0.03 |
| 9 | Final negative-knowledge check | 0.02 |

Evidence combined repository-wide inventory commands, direct spec and metadata reads, migration summaries, current command inventories, and current TypeScript implementation. High-impact claims were independently rechecked against current paths in iterations 7-9.

### Measurement Boundary

- A "raw candidate" is a directory containing `spec.md`; this intentionally includes historical and test surfaces before classification.
- An "active candidate" excludes paths classified as archive, backup, fixture, scratch, or sandbox. It is a research denominator, not a claim that every candidate is an independently governed top-level packet.
- Source packet files were read-only. No repair, renumber, rebuild, daemon stop, or database deletion occurred.
- Trigger-memory retrieval timed out, so direct repository evidence was used.
- The code graph had zero nodes and refused structural caller analysis; direct imports and source reads were used without claiming graph-derived coverage.

## 3. Global Inventory and Structural Drift

### 3.1 Inventory

- 12 top-level tracks.
- 44,470 files and 28,297 Markdown files.
- 3,015 raw `spec.md` candidates, including 657 under `z_archive`.
- 2,168 active candidates after excluding 847 historical/test copies.
- Topology reaches depth 10, with most candidates concentrated at depths 4-6.

[SOURCE: iterations/iteration-001.md:7-20] [SOURCE: iterations/iteration-002.md:7-20]

### 3.2 Track-Level Numbering

Completed migration tracks are structurally clean at the track level: system-speckit uses active `026-041` above archive ceiling `025`; system-code-graph uses `025-035` above `024`; sk-design is `001-009`; sk-code and sk-git begin above their archive ceilings. Coordinator `000` and documented sentinel numbers are explicit exceptions, not defects.

The unresolved live concentration is in skipped work:

- `sk-doc` retains active/archive overlap and six duplicated sibling prefixes (`010` through `015`) under `015-sk-doc-parent`. Current path enumeration confirmed twelve sibling specs across those six prefixes.
- `system-deep-loop` retains its selected-but-skipped active renumber and stale `children_ids`, including one untraceable entry.

[SOURCE: iterations/iteration-002.md:14-20] [SOURCE: iterations/iteration-007.md:13-18]

### 3.3 Ownership and Policy Shape

The `040-base-files-renumbering-name-cleanup` packet repeats a deleted `skilled-agent-orchestration/z_archive/090-...` packet pointer across `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`; the target path has no current files. This is canonical ownership drift rather than harmless historical prose.

Fifteen active phase-parent candidates retain heavy root documents despite the current lean-trio contract. Because those documents may contain canonical history, remediation needs an explicit grandfather/migration policy rather than mechanical deletion.

[SOURCE: iterations/iteration-006.md:13-24] [SOURCE: iterations/iteration-007.md:13-19]

## 4. Completion and Metadata Drift

Metadata coverage is strong but semantic freshness is not:

| Drift class | Count / evidence | Implication |
|---|---:|---|
| Active candidates with parseable description + graph metadata | 2,168 / 2,168 | File absence is not the primary problem. |
| Terminal spec, nonterminal graph | 212 | Completion gates can under- or over-report depending on authority. |
| Nonterminal spec, complete graph | 19 | Reverse disagreement also exists. |
| Complete graph with unchecked checklist | 2 | Graph complete does not imply checklist complete. |
| Fully checked checklist with nonterminal graph | 54 | Checklist complete does not imply graph complete. |
| All-zero continuity fingerprints | 1,093 | Strict freshness cannot rely on the placeholder value. |
| Completion 100 with nonterminal graph | 164 | Continuity percentages conflict with generated state. |
| Literal status template placeholders | 13 | Direct unfilled-template residue. |
| Contradictory direct parent/child graph status | 60 | Aggregate phase state lacks consistent semantics. |

Two direct examples remain current:

- Rust research reports complete and 100% in its spec while graph metadata says `planned`.
- End-user scope reports draft/70% and an implementation next action while graph metadata says `complete`.

[SOURCE: iterations/iteration-003.md:13-25] [SOURCE: iterations/iteration-007.md:13-20]

No single current surface is a safe universal completion authority. Reconciliation needs provenance and explicit precedence, not a blanket "graph wins" or "spec wins" rule.

## 5. Prior Context-Optimization Efforts

| Mechanism | Implemented shape | Evidence and limitation |
|---|---|---|
| Compaction recovery | `PreCompact` builds a bounded cached payload; `SessionStart(source=compact)` injects it. | Current code retains `pendingCompactPrime` and a 4,000-token render budget. Verification is bounded, not longitudinal quality measurement. |
| Lifecycle-aware priming | Separate `startup`, `resume`, `clear`, and `compact` routes with pressure-aware budgets. | Current `session-prime.ts` retains all four routes. |
| Hookless bootstrap | Read-only session snapshot, `session_resume(minimal)`, composite `session_bootstrap`, telemetry. | Current code retains composition, structural/skill hints, and completeness telemetry. |
| Context quality metrics | Recency, recovery, graph freshness, continuity factors. | Still process-local/in-memory. Final traffic-light status is calculated separately from quality score. |
| Pointer-first continuity | Small `_memory.continuity` block, resume ladder, fingerprint no-op saves. | Research claims under-100ms resume and ~50% token savings; no longitudinal baseline/post-change series was found. |
| Bounded workflow snapshots | Pointer-based context snapshots inside deep-research/review. | Replaced the separate deep-context loop. |
| Deep-context retirement | Phase 002 redirect, phase 003 discoverability removal, phase 004 dispatch closure. | Current active commands contain no standalone deep-context command; redirect was transitional. Historical artifact parsing remains. |
| Narrative compaction | Growth instrumentation and future policy criteria only. | No current automatic summarizer, pruner, anchor mover, or compaction route was found. |

[SOURCE: iterations/iteration-004.md:13-30] [SOURCE: iterations/iteration-008.md:13-27] [SOURCE: iterations/iteration-009.md:13-21]

One archived limitation is resolved in current source: graph freshness now uses the same 24-hour threshold as session snapshots. The broader limitations remain: metrics are in-memory and final session status is still calculated independently from the quality score.

## 6. Teardown Implications

### 6.1 Hard Authorization Gates

This lineage does not authorize phase 007. Authorization requires:

1. The merged phase-006 `research/research.md` exists durably and all findings are triaged.
2. A fresh operator confirmation is captured at execution time.
3. `mk_spec_memory` and `mk_code_index` daemons are confirmed stopped.
4. Deletion uses the exact named-path allowlist, never a broad database-directory glob.
5. Excluded code-graph, skill-advisor, and deep-loop databases are baselined and verified unchanged.

[SOURCE: iterations/iteration-005.md:13-26] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/spec.md:124-143]

### 6.2 Rebuildable Versus Irreversible State

| State class | After teardown |
|---|---|
| Canonical spec-document search index | Rebuildable by scan. |
| Vector shards | Rebuildable by lazy re-embedding. |
| Stale rename-derived search rows | Expected to clear through a clean rebuild. |
| Contradictory spec/graph/checklist/continuity source state | Not repaired; reindexed as-is. |
| Eval/benchmark history | Permanently lost. |
| `memory:learn` constitutional-rule provenance stored only in deleted tables | Permanently lost. |
| Drift and search-decision ledgers | Permanently lost. |
| Manifest-only checkpoint directories | Not a usable rollback snapshot. |

[SOURCE: iterations/iteration-005.md:13-26] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/plan.md:100-138,197-202]

## 7. Consolidated Findings Triage

| ID | Finding class | Severity | Disposition | Reason / owner |
|---|---|---|---|---|
| SOL-01 | Fleet-wide completion and continuity contradictions | P1 | DEFER | Requires per-packet authority/provenance decisions; source drift survives rebuild. |
| SOL-02 | sk-doc duplicate prefixes and archive overlap | P1 | DEFER | Explicitly operator-skipped and owned by the concurrent sk-doc migration. |
| SOL-03 | deep-loop discontinuity and stale `children_ids` | P1 | DEFER | High-blast renumber was selected then operator-skipped; future owner must revive the preserved map. |
| SOL-04 | Deleted packet-pointer target in system-speckit/040 | P1 | DEFER | Requires a canonical ownership-target decision; do not guess during research. |
| SOL-05 | Fifteen heavy-doc phase parents | P2 | DEFER | Needs grandfather/migration policy to protect canonical history. |
| SOL-06 | 152 stale rename-derived entries | P2 | REBUILD FOLLOW-UP | Derived search-index residue is suitable for the phase-007 rebuild path. |
| SOL-07 | Stale sk-design track-root `children_ids` | P2 | DEFER / REGENERATE | Track-root metadata needs a supported regeneration path; ordinary packet generation does not cover it. |
| SOL-08 | Historical gaps, sentinels, archive maps, reconstruction banners | Informational | ACCEPT | Provenance-backed history; not defects by themselves. |
| SOL-09 | Context optimization mechanism inventory | Informational | PRESERVE IN SYNTHESIS | Captures prior approaches before irreversible history deletion. |
| SOL-10 | Optimization benefit claims lack longitudinal evidence | P2 | DEFER | Future optimization packets should record baseline, post-change metric, observation window, and failure budget. |
| SOL-11 | Deep-context active removal and historical compatibility | Informational | ACCEPT | Current route is removed; historical parsing is intentional. |
| SOL-12 | Phase-007 irreversible state classes | P0 gate | ACKNOWLEDGE BEFORE DELETE | Fresh confirmation must cover history/provenance loss, not only file removal. |

No source remediation was performed in this detached lineage.

## 8. Recommendations for Merged Synthesis

1. Treat completion reconciliation as the primary source-integrity follow-up; do not characterize teardown/rebuild as its fix.
2. Preserve the accepted ownership of sk-doc and deep-loop deferred work rather than silently reopening high-blast renumbers.
3. Create a small follow-up for the system-speckit/040 packet-pointer target decision.
4. Establish a phase-parent heavy-document grandfather policy before any migration.
5. In phase 007, record irreversible data classes and exclusion baselines beside the delete allowlist.
6. After any rebuild, verify source-derived counts and status disagreements separately from database health.
7. Require future context-optimization claims to include measured baseline/post-change evidence.

## 9. Negative Knowledge

The following approaches were tested and ruled out:

- Every `spec.md` is a live packet.
- Missing heavy documents automatically indicate drift.
- Every numbering gap or legacy name proves data loss or a broken reference.
- A single status surface is universally authoritative.
- Packet completion or projected savings prove longitudinal optimization outcomes.
- `/doctor:update` restores deleted history or repairs canonical source drift.
- Manifest-only checkpoint directories provide teardown rollback.
- The phase-002 deep-context redirect is still the current active endpoint.
- Automatic narrative compaction shipped after its documented deferral.

## 10. Convergence Report

- Stop reason: `converged`.
- Iterations completed: 9 of 10.
- Questions answered: 5 of 5.
- Novelty trend: `1.00 -> 0.80 -> 0.90 -> 0.90 -> 0.70 -> 0.35 -> 0.04 -> 0.03 -> 0.02`.
- Final rolling average: `0.03`, below threshold `0.05`.
- Final MAD noise floor: `0.4448`; latest ratio `0.02` is below the floor.
- Entropy coverage: `1.00`.
- Composite STOP score: `1.00`.
- Quality guards: source diversity PASS; focus alignment PASS; no single weak source PASS.
- Graph gate: not applicable; no graph events were emitted. The separate code-graph caller query was blocked because the index was empty.
- Blocked STOPs: runs 7, 8, and 9 continued until three consecutive low-novelty evidence iterations existed.

## 11. References

- `iterations/iteration-001.md` through `iterations/iteration-009.md`
- `resource-map.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/{001,002,003,004,005}-*/implementation-summary.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/{spec.md,plan.md,implementation-summary.md}`
- `.opencode/specs/system-speckit/z_archive/024-compact-code-graph/{001-precompact-hook,002-session-start-hook,023-context-preservation-metrics,024-hookless-priming-optimization}/implementation-summary.md`
- `.opencode/specs/system-deep-loop/035-deprecate-deep-context-integrate-capabilities/{002,003,004}-*/implementation-summary.md`
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/research/iterations/{iteration-005.md,iteration-040.md}`
- Current implementation under `.opencode/skills/system-spec-kit/mcp_server/handlers/`, `lib/session/`, and `hooks/claude/`
