# Deep Research Strategy: sk-design Styles Tree Restructure

## 2. TOPIC
Restructure the sk-design styles tree so 1,290 downloaded style-data folders are separated from backend code, with a concrete runtime-aligned layout, migration path, and `git mv` plan.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What is the exact current ownership and dependency topology across style data, engine, database, harness, manifests, tests, docs, and consumers?
- [x] Which parts of system-deep-loop/runtime transfer directly, and where should styles intentionally differ?
- [x] What target layout cleanly separates data, library code, runtime databases, manifests, tests, scripts, and documentation?
- [x] What dependency-ordered migration preserves behavior and avoids a flag day across imports, path constants, fixtures, commands, and docs?
- [x] What exact git mv sequence, verification ladder, rollback boundary, and compatibility policy should implementation use?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not move or modify the 1,290 data folders during research.
- Do not decide whether persistent SQLite becomes the default retrieval mode; preserve the current `legacy|shadow|persistent` contract.
- Do not redesign retrieval algorithms or database schemas.
- Do not add compatibility shims unless a concrete external or persisted-path consumer requires them.

## 5. STOP CONDITIONS
- Complete exactly five evidence iterations; convergence before iteration five is telemetry only.
- Produce a concrete target tree, dependency-ordered migration, and explicit `git mv` plan.
- Stop early only for unrecoverable state corruption or a write-boundary violation.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What is the exact current ownership and dependency topology across style data, engine, database, harness, manifests, tests, docs, and consumers?
- Which parts of system-deep-loop/runtime transfer directly, and where should styles intentionally differ?
- What target layout cleanly separates data, library code, runtime databases, manifests, tests, scripts, and documentation?
- What dependency-ordered migration preserves behavior and avoids a flag day across imports, path constants, fixtures, commands, and docs?
- What exact git mv sequence, verification ladder, rollback boundary, and compatibility policy should implementation use?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Exact path/import searches plus focused reads exposed both positional path consumers and the engine/database cycle without scanning bundle contents. (iteration 1)
- Comparing lifecycle and authority for each artifact class produced clearer transfer rules than matching directory names. (iteration 2)
- Authority/lifecycle classification yielded one shallow tree and resolved the three naming ambiguities without introducing compatibility directories. (iteration 3)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Broad repository searches were dominated by historical specs and generated research records, so they were useful for classifying documentation blast radius but not for an implementation checklist. (iteration 1)
- Probing `runtime/package.json` failed because the file is absent, preventing a claim that the reference is a complete standalone npm package. (iteration 2)
- A class-level tree cannot by itself guarantee a shell-safe move for all tracked files; exact inventory and command ordering belong in the migration-focused iteration. (iteration 3)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A literal runtime-tree copy remains exhausted because it has no authoritative committed-corpus boundary. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A literal runtime-tree copy remains exhausted because it has no authoritative committed-corpus boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A literal runtime-tree copy remains exhausted because it has no authoritative committed-corpus boundary.

### Aliases, old-database fallback, or database creation: no concrete consumer justifies them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Aliases, old-database fallback, or database creation: no concrete consumer justifies them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Aliases, old-database fallback, or database creation: no concrete consumer justifies them.

### Chunked, `xargs`, wildcard, shell-expanded, or per-bundle moves: unnecessary under measured limits and add failure boundaries. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Chunked, `xargs`, wildcard, shell-expanded, or per-bundle moves: unnecessary under measured limits and add failure boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Chunked, `xargs`, wildcard, shell-expanded, or per-bundle moves: unnecessary under measured limits and add failure boundaries.

### CLI wrappers during relocation: duplicate an existing dual-purpose contract without need. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: CLI wrappers during relocation: duplicate an existing dual-purpose contract without need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CLI wrappers during relocation: duplicate an existing dual-purpose contract without need.

### Committed example database artifacts: mutable and rebuildable. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Committed example database artifacts: mutable and rebuildable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Committed example database artifacts: mutable and rebuildable.

### Copying `runtime/` mechanically is exhausted as a design direction; only its ownership rules are transferable. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Copying `runtime/` mechanically is exhausted as a design direction; only its ownership rules are transferable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying `runtime/` mechanically is exhausted as a design direction; only its ownership rules are transferable.

### Database creation during verification: persistent state is opt-in and separate from source rollback. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Database creation during verification: persistent state is opt-in and separate from source rollback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Database creation during verification: persistent state is opt-in and separate from source rollback.

### Fixture-local manifest renames: fixtures intentionally exercise explicit paths. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Fixture-local manifest renames: fixtures intentionally exercise explicit paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixture-local manifest renames: fixtures intentionally exercise explicit paths.

### Independent `_engine`, `_db`, and `_harness` moves remain blocked until the shared path seam and coupled import update are designed together. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Independent `_engine`, `_db`, and `_harness` moves remain blocked until the shared path seam and coupled import update are designed together.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Independent `_engine`, `_db`, and `_harness` moves remain blocked until the shared path seam and coupled import update are designed together.

### New wrappers or production oracle code: contradicted by exports and importers. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: New wrappers or production oracle code: contradicted by exports and importers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New wrappers or production oracle code: contradicted by exports and importers.

### Old-path aliases or database fallback: hide incomplete migration without a concrete consumer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Old-path aliases or database fallback: hide incomplete migration without a concrete consumer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Old-path aliases or database fallback: hide incomplete migration without a concrete consumer.

### Parent-directory derivation should not be preserved as a compatibility strategy because the restructure intentionally breaks the positional relationship it assumes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Parent-directory derivation should not be preserved as a compatibility strategy because the restructure intentionally breaks the positional relationship it assumes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent-directory derivation should not be preserved as a compatibility strategy because the restructure intentionally breaks the positional relationship it assumes.

### Production oracle under `lib/database`: no production importer exists. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Production oracle under `lib/database`: no production importer exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Production oracle under `lib/database`: no production importer exists.

### Root wildcards or negative exclusions for bundles: not inventory-authoritative and can capture backend/docs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Root wildcards or negative exclusions for bundles: not inventory-authoritative and can capture backend/docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Root wildcards or negative exclusions for bundles: not inventory-authoritative and can capture backend/docs.

### Ruled out `corpus/` as the selected committed-data name: technically sound, but `library/` better preserves the subsystem's established product vocabulary while remaining distinct from code-only `lib/`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out `corpus/` as the selected committed-data name: technically sound, but `library/` better preserves the subsystem's established product vocabulary while remaining distinct from code-only `lib/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out `corpus/` as the selected committed-data name: technically sound, but `library/` better preserves the subsystem's established product vocabulary while remaining distinct from code-only `lib/`.

### Ruled out `lib/oracle/` and `tests/oracle-code/` as separate domains: production oracle logic belongs to its database domain, and only golden evidence needs a test-owned oracle directory. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out `lib/oracle/` and `tests/oracle-code/` as separate domains: production oracle logic belongs to its database domain, and only golden evidence needs a test-owned oracle directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out `lib/oracle/` and `tests/oracle-code/` as separate domains: production oracle logic belongs to its database domain, and only golden evidence needs a test-owned oracle directory.

### Ruled out a literal mirror of runtime directory names: styles requires an authoritative corpus and committed corpus manifests that runtime does not own. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out a literal mirror of runtime directory names: styles requires an authoritative corpus and committed corpus manifests that runtime does not own.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a literal mirror of runtime directory names: styles requires an authoritative corpus and committed corpus manifests that runtime does not own.

### Ruled out a top-level `manifests/`: both committed files are metadata for `library/`, whereas generation metadata belongs to `database/`; a shared manifest root would merge lifecycles again. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out a top-level `manifests/`: both committed files are metadata for `library/`, whereas generation metadata belongs to `database/`; a shared manifest root would merge lifecycles again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a top-level `manifests/`: both committed files are metadata for `library/`, whereas generation metadata belongs to `database/`; a shared manifest root would merge lifecycles again.

### Ruled out keeping `_manifest.json` and `_retrieval-manifest.json` at the styles root: root globals preserve the ownership ambiguity the restructure is intended to remove. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out keeping `_manifest.json` and `_retrieval-manifest.json` at the styles root: root globals preserve the ownership ambiguity the restructure is intended to remove.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out keeping `_manifest.json` and `_retrieval-manifest.json` at the styles root: root globals preserve the ownership ambiguity the restructure is intended to remove.

### Ruled out placing `_manifest.json` and `_retrieval-manifest.json` under `database/`: their authority and default-backend lifecycle differ from mutable SQLite publication pointers. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out placing `_manifest.json` and `_retrieval-manifest.json` under `database/`: their authority and default-backend lifecycle differ from mutable SQLite publication pointers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out placing `_manifest.json` and `_retrieval-manifest.json` under `database/`: their authority and default-backend lifecycle differ from mutable SQLite publication pointers.

### Ruled out separate top-level `engine/` and `database-code/` source domains: current bidirectional imports make one `lib/` boundary the more accurate ownership model. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out separate top-level `engine/` and `database-code/` source domains: current bidirectional imports make one `lib/` boundary the more accurate ownership model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out separate top-level `engine/` and `database-code/` source domains: current bidirectional imports make one `lib/` boundary the more accurate ownership model.

### Ruled out treating the runtime as proof that styles needs a standalone npm package: the reference package metadata is incomplete in the checked-in tree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out treating the runtime as proof that styles needs a standalone npm package: the reference package metadata is incomplete in the checked-in tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out treating the runtime as proof that styles needs a standalone npm package: the reference package metadata is incomplete in the checked-in tree.

### Ruled out wrapper layers such as `backend/`, `runtime/`, or `src/`: none adds an ownership distinction beyond the six direct roots. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out wrapper layers such as `backend/`, `runtime/`, or `src/`: none adds an ownership distinction beyond the six direct roots.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out wrapper layers such as `backend/`, `runtime/`, or `src/`: none adds an ownership distinction beyond the six direct roots.

### Whole `_db` move: can carry ignored mutable artifacts. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Whole `_db` move: can carry ignored mutable artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Whole `_db` move: can carry ignored mutable artifacts.

### Whole backend subtree moves: preserve false ownership and may carry ignored state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Whole backend subtree moves: preserve false ownership and may carry ignored state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Whole backend subtree moves: preserve false ownership and may carry ignored state.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Copying `runtime/` mechanically is exhausted as a design direction; only its ownership rules are transferable. (iteration 2)
- Parent-directory derivation should not be preserved as a compatibility strategy because the restructure intentionally breaks the positional relationship it assumes. (iteration 2)
- Ruled out a literal mirror of runtime directory names: styles requires an authoritative corpus and committed corpus manifests that runtime does not own. (iteration 2)
- Ruled out placing `_manifest.json` and `_retrieval-manifest.json` under `database/`: their authority and default-backend lifecycle differ from mutable SQLite publication pointers. (iteration 2)
- Ruled out separate top-level `engine/` and `database-code/` source domains: current bidirectional imports make one `lib/` boundary the more accurate ownership model. (iteration 2)
- Ruled out treating the runtime as proof that styles needs a standalone npm package: the reference package metadata is incomplete in the checked-in tree. (iteration 2)
- A literal runtime-tree copy remains exhausted because it has no authoritative committed-corpus boundary. (iteration 3)
- Independent `_engine`, `_db`, and `_harness` moves remain blocked until the shared path seam and coupled import update are designed together. (iteration 3)
- Ruled out `corpus/` as the selected committed-data name: technically sound, but `library/` better preserves the subsystem's established product vocabulary while remaining distinct from code-only `lib/`. (iteration 3)
- Ruled out `lib/oracle/` and `tests/oracle-code/` as separate domains: production oracle logic belongs to its database domain, and only golden evidence needs a test-owned oracle directory. (iteration 3)
- Ruled out a top-level `manifests/`: both committed files are metadata for `library/`, whereas generation metadata belongs to `database/`; a shared manifest root would merge lifecycles again. (iteration 3)
- Ruled out keeping `_manifest.json` and `_retrieval-manifest.json` at the styles root: root globals preserve the ownership ambiguity the restructure is intended to remove. (iteration 3)
- Ruled out wrapper layers such as `backend/`, `runtime/`, or `src/`: none adds an ownership distinction beyond the six direct roots. (iteration 3)
- CLI wrappers during relocation: duplicate an existing dual-purpose contract without need. (iteration 4)
- Database creation during verification: persistent state is opt-in and separate from source rollback. (iteration 4)
- Old-path aliases or database fallback: hide incomplete migration without a concrete consumer. (iteration 4)
- Production oracle under `lib/database`: no production importer exists. (iteration 4)
- Root wildcards or negative exclusions for bundles: not inventory-authoritative and can capture backend/docs. (iteration 4)
- Whole `_db` move: can carry ignored mutable artifacts. (iteration 4)
- Aliases, old-database fallback, or database creation: no concrete consumer justifies them. (iteration 5)
- Chunked, `xargs`, wildcard, shell-expanded, or per-bundle moves: unnecessary under measured limits and add failure boundaries. (iteration 5)
- Committed example database artifacts: mutable and rebuildable. (iteration 5)
- Fixture-local manifest renames: fixtures intentionally exercise explicit paths. (iteration 5)
- New wrappers or production oracle code: contradicted by exports and importers. (iteration 5)
- Whole backend subtree moves: preserve false ownership and may carry ignored state. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- What exact `git mv` and verification/rollback sequence should implementation use? (iteration 1)
- What concrete kebab-case target layout should represent data, library code, runtime database files, manifests, tests, scripts, and docs? (iteration 1)
- Which `system-deep-loop/runtime` boundaries transfer directly, and which must differ for corpus/manifests? (iteration 1)
- What dependency-ordered migration avoids breaking the facade, root derivation, fixtures, and positional generator paths? (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The confirmed gap analysis reports 1,290 downloaded directories mixed with `_db`, `_engine`, `_harness`, and two root manifests. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:22-42]
- The current corpus README calls `_engine/style-library.mjs` the committed retrieval surface and keeps extraction state in `_harness` plus `_manifest.json`. [SOURCE: .opencode/skills/sk-design/styles/README.md:3-18]
- Persistent retrieval remains opt-in; `legacy` is the default and flat files remain authoritative. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:134-147]
- The proven runtime separates domain code under `lib/`, executable adapters under `scripts/`, and real SQLite files under `database/`. [SOURCE: .opencode/skills/system-deep-loop/runtime/README.md:23-44] [SOURCE: .opencode/skills/system-deep-loop/runtime/database/README.md:10-25]
- `resource-map.md` was absent at initialization; skipping the coverage-map preload.
- Focused memory retrieval returned no canonical packet results, so repository files are the authority for this lineage.

### Bounded Context Snapshot
- Source pointers: `styles/README.md`, `styles/_engine/**`, `styles/_db/**`, `styles/_harness/**`, `sk-design/SKILL.md`, four design-mode corpus consumers, and `system-deep-loop/runtime/**`.
- Reuse candidates: runtime `lib/`, `database/`, `scripts/`, `tests/`, and README ownership boundaries.
- Integration points: import specifiers, manifest constants, database defaults, fixture roots, CLI examples, feature catalog, manual test playbooks, and the design generator's study preparation.
- Constraints: research-only; all writes stay inside this detached lineage directory; shared spec writeback, reducer calls resolving the parent packet, memory save, and git staging are deferred.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05, telemetry only before the hard cap
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false
- Current generation: 1
- Started: 2026-07-21T06:43:40Z
