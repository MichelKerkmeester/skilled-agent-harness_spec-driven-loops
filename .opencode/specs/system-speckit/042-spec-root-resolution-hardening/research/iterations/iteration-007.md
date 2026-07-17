# Iteration 7: Read-Only Collision, Persisted-Identity, and Test-Gap Inventory

## Focus

This iteration adversarially checked the staged remediation prerequisite from iteration 6 without changing the live `specs` symlink, source code, tests, Git state, or reducer outputs. The narrow scope was the current checkout's collision/legacy-only inventory, persisted identity spelling, and existing versus missing root-precedence test coverage.

## Route Proof

- Exact rendered route: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:1-3]
- This is `iteration: 7`, `run: 7`; the dispatch authorizes exactly this narrative, one canonical state append, and `deltas/iter-007.jsonl`. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:4-12]

## Findings

1. **The current checkout has no distinct legacy-only packet tree or divergent root collision to migrate.** Git records `specs` as one mode-`120000` entry and 45,224 tracked descendants under `.opencode/specs`, with zero tracked `specs/` descendants. The working-tree inventory likewise reported 777 untracked and 68,282 ignored canonical descendants versus zero legacy descendants. `lstat`, `realpath`, and inode comparison confirmed that live `specs` is a symlink and both spellings resolve to the same physical canonical root. Therefore content accessed through `specs/...` is not legacy-only in this checkout; a distinct-root collision manifest is empty while this alias remains intact. [SOURCE: command result `node` read-only `git ls-tree`/`git ls-files` plus `lstat`/`realpath`/inode inventory, 2026-07-17T08:51Z]
2. **Persisted primary identities are root-spelling-neutral, but generated path caches are not.** A read-only parse of 6,267 `graph-metadata.json` and `description.json` files found 6,297 identity fields (`packet_id`, parent/child IDs, and last-active-child IDs), all root-relative and none qualified by `specs/` or `.opencode/specs/`. The same files contained 1,039 root-spelling path references: 909 canonical-qualified, 115 legacy-qualified, and 15 other root-relative matches. The concrete legacy example keeps `packet_id` and `spec_folder` root-relative while `derived.key_files` and `derived.entities[].path` persist `specs/anobel.com/...`. A resolver-order migration therefore does not need an ID rewrite, but regeneration/canonicalization tests must account for mixed derived path spellings. [SOURCE: command result `node` recursive JSON identity/path inventory, 2026-07-17T08:51Z] [SOURCE: .opencode/specs/anobel.com/002-contact-form-logic/graph-metadata.json:1-6,43-64,91-112]
3. **Existing tests cover canonical MCP preference and same-inode alias deduplication, but not a divergent same-relative collision.** `T520-9a` creates different packet identities in canonical and legacy roots and proves that MCP discovery returns only canonical; `T520-9b` proves a symlinked root is deduplicated. Folder-discovery integration separately proves both distinct roots are enumerated, the alias is realpath-deduplicated, and root-relative folder identity remains stable when alias order is reversed. These are valuable precedence and alias tests, but their fixtures either use different packet IDs or one physical inode. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:500-555] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:160-226]
4. **The scripts-side resolver order has no behavioral regression test in the targeted test inventory.** Exact test-symbol searches for `getSpecsDirectories`, `getAllExistingSpecsDirs`, and `findActiveSpecsDir` found only an export-surface assertion that `findActiveSpecsDir` is a function; no test asserts legacy-first order, canonical-first order, unique legacy fallback, or same-relative duplicate selection. This is the highest-priority test gap because changing the shared scripts list would otherwise have no direct before/after contract. [SOURCE: targeted test-symbol grep under `.opencode/skills/system-spec-kit`, 2026-07-17] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:274-304]
5. **The remaining root-collision matrix is test work, not live-data migration work.** Missing focused cases are: distinct roots containing the same relative packet with identical content; the same relative packet with divergent content and metadata; canonical absent with a unique legacy-only fallback; mixed generated `derived.*.path` spellings; absent/dangling/plain-file alias behavior; and a symlink-permission path that asserts fallback instead of returning success after `EPERM`. Existing canonicalization tests prove symlink-versus-real-path identity consistency, including non-existent leaf handling, but do not model two physical spec roots. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:20-82,84-160] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-226] [INFERENCE: the missing cases are the set difference between iteration 6's acceptance matrix and the targeted root-selection fixtures found in this iteration]

## Ruled Out

- Removing, replacing, or repointing the live symlink was ruled out by dispatch; Git tree/index reads and filesystem metadata provided the safe current-state inventory instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:8-10]
- Broad test-keyword search produced unrelated uses of “legacy,” “canonical,” and “duplicate”; exact root-selector symbols and the identified root-discovery suites were used for the final inventory. [SOURCE: targeted grep results for root-selector symbols and precedence phrases under `.opencode/skills/system-spec-kit`, 2026-07-17]
- The first two bounded Git-tree scans exceeded Node's default `spawnSync` output buffer; the successful retry raised only the in-memory read buffer and made no filesystem or Git-state mutation. [SOURCE: command results from the three read-only `node` Git-tree inventory attempts, 2026-07-17]

## Dead Ends

- No new research direction is exhausted. Dynamic symlink-absent and divergent-root cases belong in isolated implementation-test fixtures, not in this read-only live-checkout iteration. [INFERENCE: based on the dispatch prohibition and the missing test cells identified above]

## Edge Cases

- Ambiguous input: “legacy-only” was interpreted as a distinct physical packet tree, not merely a canonical file reached through the legacy symlink spelling.
- Contradictory evidence: primary IDs are uniformly root-relative, while derived path caches contain both canonical and legacy root spellings; these are different persistence layers rather than a contradiction.
- Missing dependencies: a live divergent-root manifest cannot exist while both roots are the same inode, and the dispatch prohibits changing that state. The smallest next evidence is an isolated temporary fixture in a later implementation/test phase.
- Partial success: none. Two bounded command attempts hit output-buffer limits, but the read-only retry succeeded and the requested inventory was completed.

## Sources Consulted

- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:1-12`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-config.json:1-85`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-state.jsonl:1-9`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:24-44,56-216,267-297`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/findings-registry.json:8-132`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:1-69`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:500-555`
- `.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:160-226`
- `.opencode/skills/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:1-216`
- `.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:274-304`
- `.opencode/specs/anobel.com/002-contact-form-logic/graph-metadata.json:1-6,43-112`
- Read-only command inventory: Git tree/index, untracked/ignored path counts, live symlink metadata, JSON identity/path spelling counts, and targeted test-symbol searches.

## Assessment

- New information ratio: 0.90 (4 fully new findings and 1 partially new refinement across 5 findings; no simplicity bonus)
- Novelty justification: Four findings add measured live-tree, persisted-path, and test-coverage evidence; one finding refines the previously proposed acceptance matrix into concrete missing fixtures.
- Questions addressed: Do legacy-only or divergent packets exist now; are persisted identities root-spelling-dependent; which precedence/collision cases are covered or missing?
- Questions answered: The live roots are one inode with no distinct legacy descendants; primary IDs are root-relative while derived paths are mixed; existing and missing root-selection cases are inventoried.

## Reflection

- What worked and why: Git object/path counts plus inode evidence distinguished alias spelling from physical ownership without touching the symlink; parsing generated JSON exposed a persistence distinction that source-only identity reasoning missed.
- What did not work and why: The initial Git-tree process used Node's default output buffer, which was too small for 45,224 tracked entries; a bounded larger in-memory buffer resolved it without changing the query or repository.
- What I would do differently: Have the collision inventory aggregate counts from the start instead of allowing the child Git process to inherit its default buffer.

## Recommended Next Focus

Design the isolated fixture table and expected assertions for the six missing root-collision cells, including how a future collision preflight should distinguish identical duplicates from divergent metadata, without yet changing resolver behavior.
