# Iteration 005 — Parent metadata reconciliation

## Focus

Reconcile parent `graph-metadata.json` and `description.json` with the live direct-child tree and current parent scope.

## Actions Taken

1. Compared `children_ids` with numbered direct directories.
2. Compared generated description text with the parent problem and purpose.
3. Checked derived status, source documents, active-child routing, and hashes.

## Findings

1. **P1 — `children_ids` contains a ghost phase.** The graph declares `000-migration-plan`, but no such path exists; the parent map and live tree begin at `001` and contain 21 children. This makes the metadata child count 22 and can send graph traversal to a nonexistent packet. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:92]
2. **P1 — `description.json` still describes the narrow predecessor.** Its synopsis says the problem is the ten sk-doc `create-` packets, while the parent purpose now spans fleet routing, compiled serving, and documentation quality across 21 children. Memory search can therefore rank the packet for only its oldest slice. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/description.json:4] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:49]
3. **P1 — resume routing has no active child.** `last_active_child_id` is null even though the parent map marks direct children and nested programs active/in progress. Automated phase-parent resume cannot land on an active child. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:123] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:110]
4. **P2 — derived source coverage is narrower than the parent’s declared bridge.** `source_docs` contains only `spec.md`, while `key_files` recognizes `context-index.md` and the packet also maintains two routing references. Metadata regeneration did not incorporate all parent surfaces named in the audit contract. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:57] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:116]

## Questions Answered

- Parent metadata is not synchronized with the live tree or current scope.
- The stored `spec.md` hash does match the current file; the defect is inventory and description drift, not a stale `spec.md` hash.

## Questions Remaining

- Which active child should `last_active_child_id` select when multiple workstreams remain open?

## Ruled Out

- A stale `spec.md` content hash was ruled out: the stored hash equals the current SHA-256. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:120]

## Sources Consulted

- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:6]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/description.json:4]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:49]

## Assessment

- New information ratio: 0.88
- Novelty: four metadata defects, including a nonexistent child and stale generated synopsis.

## Reflection

Direct tree-to-metadata comparison separated real inventory drift from a correctly stored spec hash.

## Recommended Next Focus

Cross-reference, handoff, and resume-pointer integrity.
