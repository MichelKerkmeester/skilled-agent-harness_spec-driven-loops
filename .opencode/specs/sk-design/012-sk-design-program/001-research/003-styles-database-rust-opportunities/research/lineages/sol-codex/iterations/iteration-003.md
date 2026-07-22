# Iteration 3: SQLite Vector Extension

## Focus

Assess whether vector search should move into the existing SQLite execution plan, while separating the value of an extension from the choice to author that extension in Rust.

## Findings

1. An in-database vector extension unlocks a coherent capability: store vectors as compact blobs/virtual-table rows, execute distance or ANN inside SQLite, join candidates to lifecycle/provenance/facet tables, and return only top-k rows to JavaScript. That removes per-query vector JSON parsing and whole-eligible-set transfer without replacing existing FTS5. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:232-249] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:221-229]
2. `node:sqlite` can load shared-library extensions, but the capability is explicitly disabled by default. `DatabaseSync` must be constructed with `allowExtension: true`, and extension loading cannot later be enabled if construction denied it. The current `openStyleDatabase()` supplies no such option, so adoption requires a deliberate, feature-flagged connection factory and trusted binary resolution—not an invisible query change. [SOURCE: https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html#databaseloadextensionpath-entrypoint] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:360-391]
3. Rust is not necessary. SQLite's extension ABI is a C interface, and `sqlite-vec` is a C implementation; USearch also exposes SQLite alongside JavaScript, Rust, and WebAssembly. A custom Rust extension would still cross the C ABI, require reviewed FFI/unsafe boundary code and platform artifacts, and compete with existing native extensions. [SOURCE: https://www.sqlite.org/loadext.html] [SOURCE: https://github.com/asg017/sqlite-vec] [SOURCE: https://github.com/unum-cloud/USearch]
4. The strongest current option is an extension evaluation, not a Rust project: prototype exact vector search with a pinned native extension, compare result bytes against the current TypeScript oracle, then test its ANN mode only at growth fixtures. `sqlite-vec`'s ANN indexes are currently alpha/pre-release, with IVF marked experimental/not enabled and DiskANN newly introduced, so maturity risk is material. [SOURCE: https://github.com/asg017/sqlite-vec/releases] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:218-249]
5. In-database search improves transactional fit but does not automatically solve filter-aware ANN. SQLite virtual-table constraints and join pushdown vary by extension; the sqlite-vec maintainer documents limitations around filtering KNN results through joins. The spike must prove that lifecycle/provenance/facet eligibility is pushed before or during candidate generation rather than post-filtering away recall. [SOURCE: https://github.com/asg017/sqlite-vec/issues/196] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:121-169]
6. Security and packaging dominate effort: extension loading executes native code in-process, needs per-platform signed/checksummed binaries, must be enabled only for a fixed path, and must fail closed to the existing JS vector lane. The SQLite and Node defaults both keep extension loading off for security reasons. [SOURCE: https://www.sqlite.org/loadext.html] [SOURCE: https://nodejs.org/api/sqlite.html]

## Ruled Out

- Author a Rust sqlite-vec equivalent: no unique capability and higher FFI/packaging risk.
- Enable arbitrary extension paths: violates the security posture implied by both SQLite and Node defaults.
- Assume SQL joins make ANN filter-aware: must be proven with query plans and recall tests.

## Dead Ends

- “In database” does not imply “Rust”; the best extension may be C/C++ and still satisfy the TypeScript-shell architecture.

## Edge Cases

- Ambiguous input: a “Rust SQLite extension” could mean a Rust-authored extension or any native extension used by a Rust-aware architecture. Only the former is assessed as Rust-specific.
- Contradictory evidence: node:sqlite supports extensions, while current code cannot load them. This is an explicit connection-option gap, not incompatibility.
- Missing dependencies: no platform artifact or extension version is pinned in the repo.
- Partial success: architectural value is established; filter pushdown and production maturity require a spike.

## Sources Consulted

- https://nodejs.org/api/sqlite.html
- https://www.sqlite.org/loadext.html
- https://github.com/asg017/sqlite-vec
- https://github.com/asg017/sqlite-vec/releases
- https://github.com/unum-cloud/USearch
- `.opencode/skills/sk-design/styles/_db/schema.mjs:360-391`

## Assessment

- New information ratio: 0.76
- Questions addressed: SQLite vector extension architecture
- Questions answered: SQLite vector extension architecture

## Reflection

- What worked and why: following the runtime's actual connection constructor exposed the real integration boundary and security switch.
- What did not work and why: extension feature lists alone could not establish filtered-query correctness.
- What I would do differently: run `EXPLAIN QUERY PLAN`, recall@k, and checksum-pinned packaging tests in a dedicated spike.

## Recommended Next Focus

Assess local embedding inference as a net-new offline/privacy capability, comparing Rust candle/ORT options with existing Node native and JavaScript/WASM runtimes.
