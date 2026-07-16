# Iteration 5: Memory-Database Teardown Implications

## Focus

Determine which research findings affect the planned memory, vector, and evaluation database teardown and classify them as hard gates, preserve-before-delete evidence, rebuild expectations, or deferred source-tree remediation.

## Actions Taken

1. Read the owning phase 006 and parent handoff contracts to identify the authorization boundary.
2. Audited phase 007's exact delete allowlist, excluded databases, daemon-stop ordering, irreversible-loss statement, and optional rebuild path.
3. Cross-checked migration-phase residue and active metadata contradictions against what an index rebuild can and cannot repair.

## Findings

1. The teardown authorization gate is stricter than lineage completion: phase 006 must produce a durable merged `research/research.md`, triage every finding as remediated or explicitly deferred, and obtain acceptance before phase 007 begins. This SOL lineage is evidence input only and cannot independently clear that gate. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md:88-99,115-141] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md:132-151]
2. Phase 007 already defines the correct destructive boundary: a fresh operator confirmation, both memory and code-index daemons stopped, and an explicit path-by-path allowlist. Code-graph, skill-advisor, and deep-loop databases are excluded and must remain unchanged. The teardown packet is still a scaffold; no daemon stop or deletion has occurred. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/spec.md:85-119,124-143] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/implementation-summary.md:45-69,94-109]
3. The rebuild boundary is asymmetric. `/doctor:update` can rescan spec documents and lazily regenerate vector shards, restoring a functional but historyless search index. It cannot restore evaluation history, `memory:learn` constitutional-rule provenance, drift ledgers, or search-decision audit trails. The fresh confirmation must therefore acknowledge loss of these classes, not only disk files. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/spec.md:127-143,162-173] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/plan.md:100-115,197-202]
4. The active-tree completion contradictions found in iteration 3 are source-document problems, not merely database staleness. A clean rebuild will reindex terminal/nonterminal status conflicts, all-zero continuity fingerprints, literal status placeholders, and contradictory parent/child states unless those source packets are remediated separately. They should be explicit deferred findings with owners and should not be described as repaired by teardown. [SOURCE: iterations/iteration-003.md:13-25] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/plan.md:107-115]
5. Some known residue is specifically derived-index staleness and is suitable for the rebuild path: 152 stale `descriptions.json` entries from code-graph renames and the stale sk-design track-root `children_ids` are documented reindex follow-ups. These support rebuilding after teardown, but do not prove that all source-tree drift is derived-only. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup/implementation-summary.md:78-105] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct/implementation-summary.md:119-124]
6. Operator-skipped migration work remains intentionally unresolved: `system-deep-loop` preserves a full renumber plan and stale `children_ids`, while `sk-doc` retains active sibling-number collisions. The parent contract explicitly permits those skips as resolved handoff states, so they are not implicit teardown blockers, but the merged research must record them as accepted/deferred risk rather than silently treating the tree as drift-free. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/implementation-summary.md:94-112] [SOURCE: iterations/iteration-002.md:13-29] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md:122-137]
7. The two checkpoint directories in phase 007 contain tracked manifest pointers but no local snapshot payload, and the plan states there is no restore path after deletion. They are not a rollback for this teardown. Before execution, checkpoint-manifest tracking and the potentially shared HF embedder socket remain explicit decisions; neither should be guessed by an unattended delete. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/spec.md:107-119,138-143] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/plan.md:119-138,197-202]

## Questions Answered

- Q5 answered: phase 006 durability/triage, fresh confirmation, daemon stop, named-path deletion, exclusion-boundary proof, irreversible-history acknowledgement, and source-vs-derived drift classification are the teardown controls. Source metadata contradictions and accepted migration residue must be deferred explicitly; they are not repaired by rebuilding the database.

## Questions Remaining

- Q1 needs a final severity-ranked global drift summary.
- Q2 needs final classification of migration residue by accepted decision, derived-index staleness, and unresolved source topology.

## Ruled Out

- Treating the SOL lineage alone as authorization for phase 007.
- Treating `/doctor:update` as a restoration of deleted history or learned-rule provenance.
- Treating a fresh database as evidence that source metadata contradictions were repaired.
- Treating checkpoint manifests without payloads as a rollback snapshot.

## Dead Ends

- A binary blocker/non-blocker classification loses the distinction between authorization gates, irreversible evidence, rebuildable derived state, and accepted source-tree deferrals.

## Sources Consulted

- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/{spec.md,plan.md,implementation-summary.md}`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/implementation-summary.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup/implementation-summary.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct/implementation-summary.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`

## Assessment

- New information ratio: 0.70
- Novelty justification: four teardown-specific control classes and three source-versus-derived implications are new, while the underlying drift evidence refines prior iterations.
- Confidence: high for documented teardown scope and rebuild boundaries; medium for execution readiness because phase 007 remains an unexecuted scaffold and exact daemon-stop mechanics are unresolved there.

## Reflection

- What worked and why: comparing the teardown allowlist with source-tree drift distinguished rebuildable indexes from persistent source contradictions and permanently lost history.
- What did not work and why: the term `teardown blocker` was too coarse for evidence that must instead be acknowledged, deferred, or baselined.
- What I would do differently: require phase 007's execution record to enumerate irreversible data classes and source-drift deferrals beside the path allowlist.

## Recommended Next Focus

Close Q1 and Q2 with a severity-ranked global drift taxonomy that separates immediate integrity risks, accepted/operator-owned exceptions, rebuildable derived-index residue, and informational historical artifacts.
