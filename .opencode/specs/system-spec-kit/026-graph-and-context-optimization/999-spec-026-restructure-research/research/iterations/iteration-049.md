# Iter 049 — Track 11: restructure ordering for partial-state safety

## Operation inventory
- Renames: 4
- Merges: 15
- Deletes: 12
- Parent-doc rewrites: 3
- Index refreshes: 3

## Proposed execution order

### Wave 1: Renames (lowest risk)
- Op 1.1: rename `002-resource-map-template` → `002-resource-map-and-deep-loop-fix`
- Op 1.2: rename `006-graph-impact-and-affordance-uplift` → `006-external-project-adoption`
- Op 1.3: rename `014-local-llama-cpp` → `014-local-embeddings-setup-a`
- Op 1.4: rename `015-global-security-sweep-and-supply-chain-audit` → `015-tanstack-security-audit`

### Wave 2: Merges
- Op 2.1: merge `004-runtime-executor-hardening` into `003-continuity-memory-runtime`, preserving child phases and adding a decision record
- Op 2.2: merge `007-code-graph/002-code-graph-self-contained-package` into `007-code-graph/014-system-code-graph-extraction`
- Op 2.3: merge `007-code-graph/016-020` into `007-code-graph/014-system-code-graph-extraction`
- Op 2.4: archive `007-code-graph/022-030` as completed post-extraction cleanup
- Op 2.5: archive `007-code-graph/031-034` as deep-review campaign artifacts
- Op 2.6: archive `007-code-graph/037-039` as comprehensive deep-review artifacts
- Op 2.7: merge `009-hook-parity/006` + `009-hook-parity/007` into `009-hook-parity/002-copilot-hook-parity-remediation`
- Op 2.8: merge `013-doctor-update-orchestrator/001-doctor-commands` + `013-doctor-update-orchestrator/002-sandbox-testing-playbook`
- Op 2.9: merge `014-local-embeddings-setup-a/056-root-readme-deep-research` + `014-local-embeddings-setup-a/057-root-readme-deeper-rewrite`
- Op 2.10: archive one-time documentation alignment packets while retaining `009-hook-parity/008`
- Op 2.11: keep `000-release-cleanup` outside the linear phase sequence as a meta-phase
- Op 2.12: low-priority merge `014/052-mk-spec-memory-rename` + `014/053-mk-spec-memory-rename-remediation`
- Op 2.13: low-priority archive `007-code-graph/035-code-folder-readmes`
- Op 2.14: low-priority rehome template-system followups from `010` to `008/013`
- Op 2.15: low-priority cleanup empty scaffold under `010-template-levels`, only after emptiness verification

### Wave 3: Deletes
- Op 3.1: delete `014-local-embeddings-setup-a/008-finalize-and-commit` with reference cleanup
- Op 3.2: delete `014-local-embeddings-setup-a/023-post-remediation-re-review` with reference cleanup
- Op 3.3: delete `014-local-embeddings-setup-a/025-post-remediation-v2-re-review`
- Op 3.4: delete `014-local-embeddings-setup-a/026-post-batch-11-re-review`
- Op 3.5: delete `014-local-embeddings-setup-a/027-post-batch-12-final-re-review`
- Op 3.6: delete `014-local-embeddings-setup-a/030-post-029-final-re-review`
- Op 3.7: delete `014-local-embeddings-setup-a/031-post-batch-15-final-re-review`
- Op 3.8: delete `014-local-embeddings-setup-a/041-llama-cpp-metal-investigation` with parent graph cleanup
- Op 3.9: delete `014-local-embeddings-setup-a/043-cocoindex-coreml-ep-investigation`
- Op 3.10: delete `014-local-embeddings-setup-a/045-session-deep-review-2026-05-14`
- Op 3.11: delete `014-local-embeddings-setup-a/048-deep-review-cocoindex-wiring`
- Op 3.12: delete `007-code-graph/036-cli-devin-code-graph-hook` with parent graph cleanup

### Wave 4: Parent-doc rewrites
- Op 4.1: update `026/spec.md`
- Op 4.2: update `026/resource-map.md`
- Op 4.3: update `026/graph-metadata.json`

### Wave 5: Index refreshes
- Op 5.1: cocoindex re-scan
- Op 5.2: memory_index_scan
- Op 5.3: strict-validate sweep

## Per-wave partial-state safety
- Wave 1 partial: Safe and recoverable. A halt leaves some folders renamed and some still at old names. Retry by checking path existence; skip completed renames and continue. Do not update parent docs yet.
- Wave 2 partial: Recoverable only if each merge operation commits independently. A halt leaves completed merge packets in final form and later packets untouched. Retry from the failed merge, not from Wave 1.
- Wave 3 partial: Safe if every delete includes same-commit reference cleanup. A halt leaves earlier deletes cleaned up and later candidates still present. Retry by checking whether the packet path still exists.
- Wave 4 partial: Not safe across separate commits. `spec.md`, `resource-map.md`, and `graph-metadata.json` must reflect the same structure. If one write fails, reset to wave start and redo all three.
- Wave 5 partial: Safe but stale. A halt leaves the tree structurally valid but indexes partially stale. Retry refreshes from the failed index step.

## Atomic groups (operations that MUST commit together)
- Group A: each merge op’s content union, source removal/archive, local graph metadata, and local reference cleanup — otherwise the tree can point at half-merged packet identities
- Group B: each `PROCEED_WITH_CLEANUP` delete plus its required reference cleanup — otherwise deleted paths remain referenced
- Group C: Wave 4 parent-doc rewrites — `026/spec.md`, `026/resource-map.md`, and `026/graph-metadata.json` must describe one structure
- Group D: Op 2.1 runtime merge plus decision record — this is the highest-risk top-level merge and needs explicit reversibility evidence

## Recovery baseline procedure
- Before each wave: capture HEAD SHA
- On wave failure: `git reset --hard <wave-start-sha>` and re-attempt from start of that wave

## Recommended batch size per wave
- Wave 1 (renames): 4 ops per batch
- Wave 2 (merges): 1 op per batch for high-risk merges; 2-3 ops per batch for archive-only groups
- Wave 3 (deletes): 3-4 ops per batch for contained deletes; 1 op per batch for cleanup-required deletes
- Wave 4 (parent-doc rewrites): all 3 ops in one batch
- Wave 5 (index refreshes): all 3 ops in one batch, with strict validation last

## JSONL delta row
{"iter_id": "049", "timestamp_utc": "2026-05-16T04:04:36Z", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "waves": 5, "atomic_groups": 4, "primary_evidence_files": ["iter-035/036/045/048"]}