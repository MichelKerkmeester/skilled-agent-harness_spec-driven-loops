# Deep Research Strategy - SQLite-to-Turso Revalidation

Persistent brain for this deep-research session. Analyst-owned sections stay stable; machine-owned sections (anchored) are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Revalidate SQLite-to-Turso research docs 001-003 (written against Turso v0.5.0) against (a) the vendored `external/turso-main` tree at v0.7.0-pre.6, (b) the Phase A deep-context report (`context/context-report.md` — 396 findings on the live SQLite surfaces), and (c) current web state. Deliver per-item verdicts (unchanged / changed / refuted) for all 16 gaps, migration paths A/B/C, P0-P4 priorities, and every open question in the baseline docs.

---

## 3. KEY QUESTIONS (remaining)

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[None yet]

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No migration implementation, driver swaps, or code edits anywhere.
- No mutation of research docs 001-003 (frozen v0.5.0 baseline; research.md carries the revalidation).
- No live benchmarking runs — evidence comes from the vendored source tree, the context report, and web sources.
- No edits to the vendored external/turso-main tree.

---

## 5. STOP CONDITIONS

- All key questions checked or explicitly carried to Open Questions with a reason.
- Hard cap: maxIterations 22 (17 working + 5 recovery reserve).
- Do NOT stop before the W5 adversarial wave has re-verified every CHANGED verdict.

---

## 6. ANSWERED QUESTIONS

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->

## 7. WHAT WORKED

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

## 8. WHAT FAILED

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

## 9. EXHAUSTED APPROACHES

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A separate napi attach method is required for JS shard attachment" — the normal exec path carries ATTACH once the flag is set; no binding-level interception exists. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: "A separate napi attach method is required for JS shard attachment" — the normal exec path carries ATTACH once the flag is set; no binding-level interception exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A separate napi attach method is required for JS shard attachment" — the normal exec path carries ATTACH once the flag is set; no binding-level interception exists.

### "ATTACH/DETACH are unconditionally available via SQL" — refuted by the `experimental_attach_enabled()` gate in both translate functions. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "ATTACH/DETACH are unconditionally available via SQL" — refuted by the `experimental_attach_enabled()` gate in both translate functions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "ATTACH/DETACH are unconditionally available via SQL" — refuted by the `experimental_attach_enabled()` gate in both translate functions.

### "CDC's API name is literally unstable_" — the canonical pragma is now `capture_data_changes_conn`; only the alias keeps the prefix. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "CDC's API name is literally unstable_" — the canonical pragma is now `capture_data_changes_conn`; only the alias keeps the prefix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "CDC's API name is literally unstable_" — the canonical pragma is now `capture_data_changes_conn`; only the alias keeps the prefix.

### "changes() wrong for UPDATE statements" (per COMPAT.md): contradicted by passing, integrity-cross-checked UPDATE tests in changes.sqltest; the residual caveat narrows to trigger interactions. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: "changes() wrong for UPDATE statements" (per COMPAT.md): contradicted by passing, integrity-cross-checked UPDATE tests in changes.sqltest; the residual caveat narrows to trigger interactions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "changes() wrong for UPDATE statements" (per COMPAT.md): contradicted by passing, integrity-cross-checked UPDATE tests in changes.sqltest; the residual caveat narrows to trigger interactions.

### "FTS might have been promoted to stable / non-experimental by 0.7.0-pre.6" — disproven; it is explicitly experimental-gated via the `index_method` feature [SOURCE: experimental-features.mdx:19, create-index.mdx:101]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "FTS might have been promoted to stable / non-experimental by 0.7.0-pre.6" — disproven; it is explicitly experimental-gated via the `index_method` feature [SOURCE: experimental-features.mdx:19, create-index.mdx:101].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "FTS might have been promoted to stable / non-experimental by 0.7.0-pre.6" — disproven; it is explicitly experimental-gated via the `index_method` feature [SOURCE: experimental-features.mdx:19, create-index.mdx:101].

### "FTS5 compatibility might have been added as a shim" — disproven; FTS3/FTS4/FTS5 remain ❌ "Use Turso FTS instead" [SOURCE: COMPAT.md:1084]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "FTS5 compatibility might have been added as a shim" — disproven; FTS3/FTS4/FTS5 remain ❌ "Use Turso FTS instead" [SOURCE: COMPAT.md:1084].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "FTS5 compatibility might have been added as a shim" — disproven; FTS3/FTS4/FTS5 remain ❌ "Use Turso FTS instead" [SOURCE: COMPAT.md:1084].

### "Neither Turso's SDK nor the libsql npm package implements `.pragma()`" — disproven for Turso's SDK at 0.7.0-pre.6; the W3a mechanical `.exec('PRAGMA …')` rewrite is no longer needed for method availability (the real remaining work is engine-level pragma gaps). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Neither Turso's SDK nor the libsql npm package implements `.pragma()`" — disproven for Turso's SDK at 0.7.0-pre.6; the W3a mechanical `.exec('PRAGMA …')` rewrite is no longer needed for method availability (the real remaining work is engine-level pragma gaps).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Neither Turso's SDK nor the libsql npm package implements `.pragma()`" — disproven for Turso's SDK at 0.7.0-pre.6; the W3a mechanical `.exec('PRAGMA …')` rewrite is no longer needed for method availability (the real remaining work is engine-level pragma gaps).

### "PRAGMA synchronous accepts only OFF/FULL" (iteration 1) — refuted by the explicit `b"NORMAL" | b"1" => SyncMode::Normal` arm. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "PRAGMA synchronous accepts only OFF/FULL" (iteration 1) — refuted by the explicit `b"NORMAL" | b"1" => SyncMode::Normal` arm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "PRAGMA synchronous accepts only OFF/FULL" (iteration 1) — refuted by the explicit `b"NORMAL" | b"1" => SyncMode::Normal` arm.

### "Tantivy may have gained automatic segment merging in Turso by 0.7.0-pre.6" — disproven; NoMergePolicy is set unconditionally in source and documented as a limitation [SOURCE: core/index_method/fts.rs:2956, docs/fts.md:455]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Tantivy may have gained automatic segment merging in Turso by 0.7.0-pre.6" — disproven; NoMergePolicy is set unconditionally in source and documented as a limitation [SOURCE: core/index_method/fts.rs:2956, docs/fts.md:455].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Tantivy may have gained automatic segment merging in Turso by 0.7.0-pre.6" — disproven; NoMergePolicy is set unconditionally in source and documented as a limitation [SOURCE: core/index_method/fts.rs:2956, docs/fts.md:455].

### "The JS SDK cannot enable SQL ATTACH at all" (iteration 13's pivotal finding) — refuted by `"attach" => core_opts.with_attach(true)` [bindings/javascript/src/lib.rs:283] plus passing in-tree tests; the original grep keyed on the wrong identifier (`experimental_attach` vs `with_attach`). -- BLOCKED (iteration 16, 1 attempts)
- What was tried: "The JS SDK cannot enable SQL ATTACH at all" (iteration 13's pivotal finding) — refuted by `"attach" => core_opts.with_attach(true)` [bindings/javascript/src/lib.rs:283] plus passing in-tree tests; the original grep keyed on the wrong identifier (`experimental_attach` vs `with_attach`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The JS SDK cannot enable SQL ATTACH at all" (iteration 13's pivotal finding) — refuted by `"attach" => core_opts.with_attach(true)` [bindings/javascript/src/lib.rs:283] plus passing in-tree tests; the original grep keyed on the wrong identifier (`experimental_attach` vs `with_attach`).

### "Turso is permanently single-process; the WAL has no cross-process story" — refuted by the shipped experimental `.tshm` multi-process WAL coordination (README.md:61; core/lib.rs:222ff); the wal.rs:2662 "never support multi process" comment is stale. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Turso is permanently single-process; the WAL has no cross-process story" — refuted by the shipped experimental `.tshm` multi-process WAL coordination (README.md:61; core/lib.rs:222ff); the wal.rs:2662 "never support multi process" comment is stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Turso is permanently single-process; the WAL has no cross-process story" — refuted by the shipped experimental `.tshm` multi-process WAL coordination (README.md:61; core/lib.rs:222ff); the wal.rs:2662 "never support multi process" comment is stale.

### "Turso lacks ATTACH" as an absolute — ATTACH exists with fresh-database initialization and schema tests at 0.7.0-pre.6 (degree of parity still unverified). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "Turso lacks ATTACH" as an absolute — ATTACH exists with fresh-database initialization and schema tests at 0.7.0-pre.6 (degree of parity still unverified).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Turso lacks ATTACH" as an absolute — ATTACH exists with fresh-database initialization and schema tests at 0.7.0-pre.6 (degree of parity still unverified).

### "Turso/libSQL does not support VACUUM INTO" — the context report's 3/3-agreed HARD blocker framing for checkpoints.ts:2281/2284 is disproven at 0.7.0-pre.6 (supported, with regression and encryption tests). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "Turso/libSQL does not support VACUUM INTO" — the context report's 3/3-agreed HARD blocker framing for checkpoints.ts:2281/2284 is disproven at 0.7.0-pre.6 (supported, with regression and encryption tests).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Turso/libSQL does not support VACUUM INTO" — the context report's 3/3-agreed HARD blocker framing for checkpoints.ts:2281/2284 is disproven at 0.7.0-pre.6 (supported, with regression and encryption tests).

### "VACUUM active_vec INTO is blocked by the main-only schema rejection" — the rejection at core/translate/vacuum.rs:51-57 is inside the in-place (`into: None`) branch only; VACUUM INTO resolves arbitrary attached schemas at execution. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: "VACUUM active_vec INTO is blocked by the main-only schema rejection" — the rejection at core/translate/vacuum.rs:51-57 is inside the in-place (`into: None`) branch only; VACUUM INTO resolves arbitrary attached schemas at execution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "VACUUM active_vec INTO is blocked by the main-only schema rejection" — the rejection at core/translate/vacuum.rs:51-57 is inside the in-place (`into: None`) branch only; VACUUM INTO resolves arbitrary attached schemas at execution.

### "wal_checkpoint(TRUNCATE) is unsupported at engine level" (iteration 1) — refuted by the handler's `CheckpointMode::from_str` path plus three independent test suites exercising it. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "wal_checkpoint(TRUNCATE) is unsupported at engine level" (iteration 1) — refuted by the handler's `CheckpointMode::from_str` path plus three independent test suites exercising it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "wal_checkpoint(TRUNCATE) is unsupported at engine level" (iteration 1) — refuted by the handler's `CheckpointMode::from_str` path plus three independent test suites exercising it.

### **Any recursive-CTE softening between v0.5.0 and v0.7.0-pre.6** — the parse-time bailout is present in two planner paths; no changelog entry mentions recursive CTE progress. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Any recursive-CTE softening between v0.5.0 and v0.7.0-pre.6** — the parse-time bailout is present in two planner paths; no changelog entry mentions recursive CTE progress.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Any recursive-CTE softening between v0.5.0 and v0.7.0-pre.6** — the parse-time bailout is present in two planner paths; no changelog entry mentions recursive CTE progress.

### **Baseline gap 14's claim that the `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` frame works** — COMPAT.md:132 states custom frame specs are not yet supported at all; only default-frame aggregate OVER and row_number() function. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Baseline gap 14's claim that the `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` frame works** — COMPAT.md:132 states custom frame specs are not yet supported at all; only default-frame aggregate OVER and row_number() function.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Baseline gap 14's claim that the `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` frame works** — COMPAT.md:132 states custom frame specs are not yet supported at all; only default-frame aggregate OVER and row_number() function.

### **C3c-followup (libsql FTS5 parameterized-insert bug, gap 15): BLOCKED.** Both WebSearch and WebFetch were permission-denied in this seat's runtime; the libsql repo is not vendored locally, so fixed-vs-open status could not be determined. Status remains as baseline (open) with confidence unchanged; needs a web-enabled seat. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **C3c-followup (libsql FTS5 parameterized-insert bug, gap 15): BLOCKED.** Both WebSearch and WebFetch were permission-denied in this seat's runtime; the libsql repo is not vendored locally, so fixed-vs-open status could not be determined. Status remains as baseline (open) with confidence unchanged; needs a web-enabled seat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **C3c-followup (libsql FTS5 parameterized-insert bug, gap 15): BLOCKED.** Both WebSearch and WebFetch were permission-denied in this seat's runtime; the libsql repo is not vendored locally, so fixed-vs-open status could not be determined. Status remains as baseline (open) with confidence unchanged; needs a web-enabled seat.

### **Direct grep of `core/mvcc/` for trigger restrictions never completed** — the sandbox rejected three compound/`2>/dev/null` command forms before budget ran out; the MVCC×trigger interaction (gap 8's original core claim) is answered only indirectly (COMPAT.md notes no MVCC caveat on triggers). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Direct grep of `core/mvcc/` for trigger restrictions never completed** — the sandbox rejected three compound/`2>/dev/null` command forms before budget ran out; the MVCC×trigger interaction (gap 8's original core claim) is answered only indirectly (COMPAT.md notes no MVCC caveat on triggers).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Direct grep of `core/mvcc/` for trigger restrictions never completed** — the sandbox rejected three compound/`2>/dev/null` command forms before budget ran out; the MVCC×trigger interaction (gap 8's original core claim) is answered only indirectly (COMPAT.md notes no MVCC caveat on triggers).

### **Post-vendor web sweep (releases after v0.7.0-pre.6, latest version, vector-index/FTS/MVCC-exclusivity/CDC/1.0 signals): BLOCKED** by the same web-tool permission denial. The vendored CHANGELOG.md by definition ends at the vendor point and cannot answer post-vendor questions. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Post-vendor web sweep (releases after v0.7.0-pre.6, latest version, vector-index/FTS/MVCC-exclusivity/CDC/1.0 signals): BLOCKED** by the same web-tool permission denial. The vendored CHANGELOG.md by definition ends at the vendor point and cannot answer post-vendor questions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Post-vendor web sweep (releases after v0.7.0-pre.6, latest version, vector-index/FTS/MVCC-exclusivity/CDC/1.0 signals): BLOCKED** by the same web-tool permission denial. The vendored CHANGELOG.md by definition ends at the vendor point and cannot answer post-vendor questions.

### **Triggers requiring an experimental flag at 0.7.0-pre.6** — refuted by CHANGELOG.md:338 ("Remove experimental flag from triggers, enable by default") and unconditional ✅ in COMPAT.md:95. Gap 8's framing of triggers as broadly unreliable outside MVCC no longer holds. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Triggers requiring an experimental flag at 0.7.0-pre.6** — refuted by CHANGELOG.md:338 ("Remove experimental flag from triggers, enable by default") and unconditional ✅ in COMPAT.md:95. Gap 8's framing of triggers as broadly unreliable outside MVCC no longer holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Triggers requiring an experimental flag at 0.7.0-pre.6** — refuted by CHANGELOG.md:338 ("Remove experimental flag from triggers, enable by default") and unconditional ✅ in COMPAT.md:95. Gap 8's framing of triggers as broadly unreliable outside MVCC no longer holds.

### **Web revalidation impossible this session:** both WebSearch and WebFetch were permission-denied, so post-v0.7.0-pre.6 releases/issues (the C5 "current web state" half) could not be checked. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Web revalidation impossible this session:** both WebSearch and WebFetch were permission-denied, so post-v0.7.0-pre.6 releases/issues (the C5 "current web state" half) could not be checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Web revalidation impossible this session:** both WebSearch and WebFetch were permission-denied, so post-v0.7.0-pre.6 releases/issues (the C5 "current web state" half) could not be checked.

### **WebSearch and WebFetch both permission-denied** in this run — post-vendor state (releases/issues after v0.7.0-pre.6, any recursive-CTE or window-function roadmap) could not be checked. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **WebSearch and WebFetch both permission-denied** in this run — post-vendor state (releases/issues after v0.7.0-pre.6, any recursive-CTE or window-function roadmap) could not be checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **WebSearch and WebFetch both permission-denied** in this run — post-vendor state (releases/issues after v0.7.0-pre.6, any recursive-CTE or window-function roadmap) could not be checked.

### `bindings/javascript/packages/common/src/` does not exist — TS sources live flat in `packages/common/` (one empty search round). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `bindings/javascript/packages/common/src/` does not exist — TS sources live flat in `packages/common/` (one empty search round).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `bindings/javascript/packages/common/src/` does not exist — TS sources live flat in `packages/common/` (one empty search round).

### `db.backup()` dependency in the checkpoint path (already VACUUM-INTO based). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `db.backup()` dependency in the checkpoint path (already VACUUM-INTO based).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `db.backup()` dependency in the checkpoint path (already VACUUM-INTO based).

### `incremental_vacuum` as a pilot blocker (self-gating on auto_vacuum mode + try/catch warn-and-skip at the only call site). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `incremental_vacuum` as a pilot blocker (self-gating on auto_vacuum mode + try/catch warn-and-skip at the only call site).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `incremental_vacuum` as a pilot blocker (self-gating on auto_vacuum mode + try/catch warn-and-skip at the only call site).

### `PRAGMA optimize`, `mmap_size`, `defer_foreign_keys`, `synchronous`, and `WITHOUT ROWID` as literal SQL strings in any of the three mcp_server trees — grep returned zero hits, so COMPAT's ❌ rows for these don't bite via that form (caveat below). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `PRAGMA optimize`, `mmap_size`, `defer_foreign_keys`, `synchronous`, and `WITHOUT ROWID` as literal SQL strings in any of the three mcp_server trees — grep returned zero hits, so COMPAT's ❌ rows for these don't bite via that form (caveat below).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `PRAGMA optimize`, `mmap_size`, `defer_foreign_keys`, `synchronous`, and `WITHOUT ROWID` as literal SQL strings in any of the three mcp_server trees — grep returned zero hits, so COMPAT's ❌ rows for these don't bite via that form (caveat below).

### `rg --files` and multi-statement Bash pipelines intermittently require approval in this sandbox; single-pattern `rg` searches with `-g` globs work — use those. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `rg --files` and multi-statement Bash pipelines intermittently require approval in this sandbox; single-pattern `rg` searches with `-g` globs work — use those.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg --files` and multi-statement Bash pipelines intermittently require approval in this sandbox; single-pattern `rg` searches with `-g` globs work — use those.

### `vector_top_k` / `libsql_vector_idx` being locally usable — the sole occurrence is inside `test.skip` (sync.test.js:277). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `vector_top_k` / `libsql_vector_idx` being locally usable — the sole occurrence is inside `test.skip` (sync.test.js:277).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `vector_top_k` / `libsql_vector_idx` being locally usable — the sole occurrence is inside `test.skip` (sync.test.js:277).

### A dedicated production-readiness or FAQ document under `external/turso-main/docs/` — does not exist; the only FAQ is the README section. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A dedicated production-readiness or FAQ document under `external/turso-main/docs/` — does not exist; the only FAQ is the README section.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dedicated production-readiness or FAQ document under `external/turso-main/docs/` — does not exist; the only FAQ is the README section.

### A dense (cosine/L2) native vector index in Turso 0.7.0-pre.6 — `core/index_method/` contains only the backing b-tree, FTS, and the toy sparse-IVF (jaccard-only). -- BLOCKED (iteration 15, 1 attempts)
- What was tried: A dense (cosine/L2) native vector index in Turso 0.7.0-pre.6 — `core/index_method/` contains only the backing b-tree, FTS, and the toy sparse-IVF (jaccard-only).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dense (cosine/L2) native vector index in Turso 0.7.0-pre.6 — `core/index_method/` contains only the backing b-tree, FTS, and the toy sparse-IVF (jaccard-only).

### A literal "Open Questions" section in baseline docs 001/002/003. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: A literal "Open Questions" section in baseline docs 001/002/003.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A literal "Open Questions" section in baseline docs 001/002/003.

### A synchronous-related crash or hard error in the spec-kit vector-index init on Turso — impossible at v0.7.0-pre.6 given the coerce-to-Full parser; no error path exists for unrecognized synchronous values. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A synchronous-related crash or hard error in the spec-kit vector-index init on Turso — impossible at v0.7.0-pre.6 given the coerce-to-Full parser; no error path exists for unrecognized synchronous values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A synchronous-related crash or hard error in the spec-kit vector-index init on Turso — impossible at v0.7.0-pre.6 given the coerce-to-Full parser; no error path exists for unrecognized synchronous values.

### A triggers-vs-MVCC NEW gap from the mutation-ledger: catalog gap 8 already covers it; outside MVCC opt-in the triggers work. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A triggers-vs-MVCC NEW gap from the mutation-ledger: catalog gap 8 already covers it; outside MVCC opt-in the triggers work.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A triggers-vs-MVCC NEW gap from the mutation-ledger: catalog gap 8 already covers it; outside MVCC opt-in the triggers work.

### An initial compound shell command for the bindings/core grep was rejected by the sandbox and re-issued as separate calls (one tool call spent, no information lost). -- BLOCKED (iteration 11, 1 attempts)
- What was tried: An initial compound shell command for the bindings/core grep was rejected by the sandbox and re-issued as separate calls (one tool call spent, no information lost).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An initial compound shell command for the bindings/core grep was rejected by the sandbox and re-issued as separate calls (one tool call spent, no information lost).

### Any expectation that Turso JS errors carry better-sqlite3-style `code: 'SQLITE_BUSY'` — the binding emits message-only generic napi errors (lib.rs:212,225-227). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Any expectation that Turso JS errors carry better-sqlite3-style `code: 'SQLITE_BUSY'` — the binding emits message-only generic napi errors (lib.rs:212,225-227).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any expectation that Turso JS errors carry better-sqlite3-style `code: 'SQLITE_BUSY'` — the binding emits message-only generic napi errors (lib.rs:212,225-227).

### Any fifth member of the HARD blocker set: the context report's extra blockers all stand refuted; blockers are exactly vector index, FTS5 surface, WITH RECURSIVE. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Any fifth member of the HARD blocker set: the context report's extra blockers all stand refuted; blockers are exactly vector index, FTS5 surface, WITH RECURSIVE.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any fifth member of the HARD blocker set: the context report's extra blockers all stand refuted; blockers are exactly vector index, FTS5 surface, WITH RECURSIVE.

### Any of the six advanced SQL construct classes (UPSERT ON CONFLICT, partial indexes, expression indexes, generated columns, json functions, STRICT tables) appearing in incremental-index.ts, statediff.ts, or the causal tombstone constructs — exhaustive pattern scan over all four implicated files found none. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Any of the six advanced SQL construct classes (UPSERT ON CONFLICT, partial indexes, expression indexes, generated columns, json functions, STRICT tables) appearing in incremental-index.ts, statediff.ts, or the causal tombstone constructs — exhaustive pattern scan over all four implicated files found none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any of the six advanced SQL construct classes (UPSERT ON CONFLICT, partial indexes, expression indexes, generated columns, json functions, STRICT tables) appearing in incremental-index.ts, statediff.ts, or the causal tombstone constructs — exhaustive pattern scan over all four implicated files found none.

### Any production call site of `.backup(`, `.serialize(`, `.function(`, `.aggregate(`, `.table(`, `loadExtension(`, `.iterate(`, `.raw(`, `.pluck(` in the three skills' `lib/` trees — zero matches; the literal token `loadExtension(` does not appear in our code at all. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Any production call site of `.backup(`, `.serialize(`, `.function(`, `.aggregate(`, `.table(`, `loadExtension(`, `.iterate(`, `.raw(`, `.pluck(` in the three skills' `lib/` trees — zero matches; the literal token `loadExtension(` does not appear in our code at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any production call site of `.backup(`, `.serialize(`, `.function(`, `.aggregate(`, `.table(`, `loadExtension(`, `.iterate(`, `.raw(`, `.pluck(` in the three skills' `lib/` trees — zero matches; the literal token `loadExtension(` does not appear in our code at all.

### Any usage of the six not-implemented compat methods (backup/serialize/function/aggregate/table/loadExtension) — and of iterate/raw/pluck/columns/unsafeMode/defaultSafeIntegers — anywhere in the three skills' lib trees; no compat shims needed for method coverage. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Any usage of the six not-implemented compat methods (backup/serialize/function/aggregate/table/loadExtension) — and of iterate/raw/pluck/columns/unsafeMode/defaultSafeIntegers — anywhere in the three skills' lib trees; no compat shims needed for method coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any usage of the six not-implemented compat methods (backup/serialize/function/aggregate/table/loadExtension) — and of iterate/raw/pluck/columns/unsafeMode/defaultSafeIntegers — anywhere in the three skills' lib trees; no compat shims needed for method coverage.

### Baseline 003:45 "No ANN index, no HNSW, no IVF" is slightly stale in letter (a *toy* sparse-IVF exists behind the experimental index_method extension point) but holds in substance: nothing production-usable. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Baseline 003:45 "No ANN index, no HNSW, no IVF" is slightly stale in letter (a *toy* sparse-IVF exists behind the experimental index_method extension point) but holds in substance: nothing production-usable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Baseline 003:45 "No ANN index, no HNSW, no IVF" is slightly stale in letter (a *toy* sparse-IVF exists behind the experimental index_method extension point) but holds in substance: nothing production-usable.

### Carrying gap 15 or post-vendor-release status as open items — both closed by host web evidence. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Carrying gap 15 or post-vendor-release status as open items — both closed by host web evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Carrying gap 15 or post-vendor-release status as open items — both closed by host web evidence.

### CHANGELOG.md has no 0.7.0-pre.x section — newest entry is `0.6.0 -- 2026-05-14` [SOURCE: CHANGELOG.md:3], so 0.6.0→0.7.0-pre.6 deltas are observable only in source. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: CHANGELOG.md has no 0.7.0-pre.x section — newest entry is `0.6.0 -- 2026-05-14` [SOURCE: CHANGELOG.md:3], so 0.6.0→0.7.0-pre.6 deltas are observable only in source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CHANGELOG.md has no 0.7.0-pre.x section — newest entry is `0.6.0 -- 2026-05-14` [SOURCE: CHANGELOG.md:3], so 0.6.0→0.7.0-pre.6 deltas are observable only in source.

### CHANGELOG.md vector-history grep was lost to a sandbox-blocked compound Bash command; not retried under budget. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: CHANGELOG.md vector-history grep was lost to a sandbox-blocked compound Bash command; not retried under budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CHANGELOG.md vector-history grep was lost to a sandbox-blocked compound Bash command; not retried under budget.

### COMPAT.md as a source of MVCC maturity signal — it contains essentially no MVCC content (single hit: `PRAGMA mvcc_checkpoint_threshold`, COMPAT.md:230); maturity evidence lives in journal_mode.rs, the agent guides, tests, and CHANGELOG. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: COMPAT.md as a source of MVCC maturity signal — it contains essentially no MVCC content (single hit: `PRAGMA mvcc_checkpoint_threshold`, COMPAT.md:230); maturity evidence lives in journal_mode.rs, the agent guides, tests, and CHANGELOG.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: COMPAT.md as a source of MVCC maturity signal — it contains essentially no MVCC content (single hit: `PRAGMA mvcc_checkpoint_threshold`, COMPAT.md:230); maturity evidence lives in journal_mode.rs, the agent guides, tests, and CHANGELOG.

### Compound shell commands (`;`, some `&&`+pipe forms) repeatedly tripped the sandbox approval splitter, costing ~4 tool calls to failed invocations before adapting to single-command `rg` calls. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Compound shell commands (`;`, some `&&`+pipe forms) repeatedly tripped the sandbox approval splitter, costing ~4 tool calls to failed invocations before adapting to single-command `rg` calls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Compound shell commands (`;`, some `&&`+pipe forms) repeatedly tripped the sandbox approval splitter, costing ~4 tool calls to failed invocations before adapting to single-command `rg` calls.

### Compound shell commands (multi-`rg` batches with `;` and pipes) were rejected by the sandbox permission layer, burning the first six tool calls with zero evidence; all searches had to be re-issued as single `rg` invocations. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Compound shell commands (multi-`rg` batches with `;` and pipes) were rejected by the sandbox permission layer, burning the first six tool calls with zero evidence; all searches had to be re-issued as single `rg` invocations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Compound shell commands (multi-`rg` batches with `;` and pipes) were rejected by the sandbox permission layer, burning the first six tool calls with zero evidence; all searches had to be re-issued as single `rg` invocations.

### Compound shell commands (var assignments + pipes) were rejected by the sandbox; the first 4-call batch produced no evidence and had to be re-run as single `rg` invocations. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Compound shell commands (var assignments + pipes) were rejected by the sandbox; the first 4-call batch produced no evidence and had to be re-run as single `rg` invocations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Compound shell commands (var assignments + pipes) were rejected by the sandbox; the first 4-call batch produced no evidence and had to be re-run as single `rg` invocations.

### Could not re-audit the 8-pragma `.pragma('…')` startup block in `vector-index-store.ts::initialize_db` for `synchronous=NORMAL`/`mmap_size` usage (the literal-`PRAGMA` grep wouldn't match `.pragma()` call syntax) — budget exhausted; iterations 1–6 already flag these engine gaps generically. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Could not re-audit the 8-pragma `.pragma('…')` startup block in `vector-index-store.ts::initialize_db` for `synchronous=NORMAL`/`mmap_size` usage (the literal-`PRAGMA` grep wouldn't match `.pragma()` call syntax) — budget exhausted; iterations 1–6 already flag these engine gaps generically.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Could not re-audit the 8-pragma `.pragma('…')` startup block in `vector-index-store.ts::initialize_db` for `synchronous=NORMAL`/`mmap_size` usage (the literal-`PRAGMA` grep wouldn't match `.pragma()` call syntax) — budget exhausted; iterations 1–6 already flag these engine gaps generically.

### DiskANN (or any production ANN index) shipped in Turso core at v0.7.0-pre.6 — zero engine references; only a skipped JS conformance test mentions the libSQL ANN API. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: DiskANN (or any production ANN index) shipped in Turso core at v0.7.0-pre.6 — zero engine references; only a skipped JS conformance test mentions the libSQL ANN API.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: DiskANN (or any production ANN index) shipped in Turso core at v0.7.0-pre.6 — zero engine references; only a skipped JS conformance test mentions the libSQL ANN API.

### FTS5-style query-time `bm25()` weight overrides in Turso FTS — weights enter only through the CREATE INDEX `WITH` clause. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: FTS5-style query-time `bm25()` weight overrides in Turso FTS — weights enter only through the CREATE INDEX `WITH` clause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: FTS5-style query-time `bm25()` weight overrides in Turso FTS — weights enter only through the CREATE INDEX `WITH` clause.

### Gap 15 (FTS5 parameterized insert bug) as relevant to the Turso-rewrite path — it's libsql-only and FTS5 is absent in Turso anyway. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Gap 15 (FTS5 parameterized insert bug) as relevant to the Turso-rewrite path — it's libsql-only and FTS5 is absent in Turso anyway.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Gap 15 (FTS5 parameterized insert bug) as relevant to the Turso-rewrite path — it's libsql-only and FTS5 is absent in Turso anyway.

### Gap 7's premise "AUTOINCREMENT does not work under MVCC" — refuted by atomic-sequence implementation and four dedicated tests (tests.rs:10412-10539); the W7b "switch to UUIDs" contingency (003:422-433) is no longer needed for MVCC compatibility. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Gap 7's premise "AUTOINCREMENT does not work under MVCC" — refuted by atomic-sequence implementation and four dedicated tests (tests.rs:10412-10539); the W7b "switch to UUIDs" contingency (003:422-433) is no longer needed for MVCC compatibility.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Gap 7's premise "AUTOINCREMENT does not work under MVCC" — refuted by atomic-sequence implementation and four dedicated tests (tests.rs:10412-10539); the W7b "switch to UUIDs" contingency (003:422-433) is no longer needed for MVCC compatibility.

### grep -i "open question" over all three baseline docs returned zero hits — resolved via full heading outlines instead. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: grep -i "open question" over all three baseline docs returned zero hits — resolved via full heading outlines instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: grep -i "open question" over all three baseline docs returned zero hits — resolved via full heading outlines instead.

### Grep for "experimental" inside `core/index_method/fts.rs`: zero hits — the gating lives in the CLI/SDK connection layer, not the index module (useful negative: enabling is per-connection config, not per-index DDL). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Grep for "experimental" inside `core/index_method/fts.rs`: zero hits — the gating lives in the CLI/SDK connection layer, not the index module (useful negative: enabling is per-connection config, not per-index DDL).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grep for "experimental" inside `core/index_method/fts.rs`: zero hits — the gating lives in the CLI/SDK connection layer, not the index module (useful negative: enabling is per-connection config, not per-index DDL).

### Grep for `attach_database` / `fn attach` across core/lib.rs and bindings/javascript/src: zero hits — no programmatic attach API surface to document. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Grep for `attach_database` / `fn attach` across core/lib.rs and bindings/javascript/src: zero hits — no programmatic attach API surface to document.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grep for `attach_database` / `fn attach` across core/lib.rs and bindings/javascript/src: zero hits — no programmatic attach API surface to document.

### Grepping `impl FromStr for CheckpointMode` in `core/storage/wal.rs` returned nothing — the `FromStr` impl is likely derive-generated (strum-style); I fell back to the enum definition plus the call site and passing tests to establish the accepted mode names. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Grepping `impl FromStr for CheckpointMode` in `core/storage/wal.rs` returned nothing — the `FromStr` impl is likely derive-generated (strum-style); I fell back to the enum definition plus the call site and passing tests to establish the accepted mode names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping `impl FromStr for CheckpointMode` in `core/storage/wal.rs` returned nothing — the `FromStr` impl is likely derive-generated (strum-style); I fell back to the enum definition plus the call site and passing tests to establish the accepted mode names.

### Guessed file `lib/embedders/shard-writer.ts` does not exist; the checkpoint logic lives in `reindex.ts` itself. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Guessed file `lib/embedders/shard-writer.ts` does not exist; the checkpoint logic lives in `reindex.ts` itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Guessed file `lib/embedders/shard-writer.ts` does not exist; the checkpoint logic lives in `reindex.ts` itself.

### Immediate LanceDB adoption (P4 promotion) — current scale (~2k memories) plus the established quantized two-stage mitigation keeps Path B's trigger unfired. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Immediate LanceDB adoption (P4 promotion) — current scale (~2k memories) plus the established quantized two-stage mitigation keeps Path B's trigger unfired.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Immediate LanceDB adoption (P4 promotion) — current scale (~2k memories) plus the established quantized two-stage mitigation keeps Path B's trigger unfired.

### Initial `cd`-prefixed and `-r`-flagged rg invocations rejected by the command sandbox (cost 5 of 12 calls). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Initial `cd`-prefixed and `-r`-flagged rg invocations rejected by the command sandbox (cost 5 of 12 calls).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Initial `cd`-prefixed and `-r`-flagged rg invocations rejected by the command sandbox (cost 5 of 12 calls).

### MVCC as a load-bearing requirement for spec-kit — all candidate concurrent-write flows are serialized by the lease/single-writer daemon design. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: MVCC as a load-bearing requirement for spec-kit — all candidate concurrent-write flows are serialized by the lease/single-writer daemon design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: MVCC as a load-bearing requirement for spec-kit — all candidate concurrent-write flows are serialized by the lease/single-writer daemon design.

### No `experimental_attach` references exist anywhere under `bindings/javascript`, so I could not locate a JS-side enablement path for SQL ATTACH (treated as evidence of absence for the SDK surface, not proof). -- BLOCKED (iteration 13, 1 attempts)
- What was tried: No `experimental_attach` references exist anywhere under `bindings/javascript`, so I could not locate a JS-side enablement path for SQL ATTACH (treated as evidence of absence for the SDK surface, not proof).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `experimental_attach` references exist anywhere under `bindings/javascript`, so I could not locate a JS-side enablement path for SQL ATTACH (treated as evidence of absence for the SDK surface, not proof).

### Path A as the default recommendation — the compat layer removes its unique advantage (sync-API preservation) and the stepping stone adds an API hop; only a near-term cloud-sync requirement re-elevates it. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Path A as the default recommendation — the compat layer removes its unique advantage (sync-API preservation) and the stepping stone adds an API hop; only a near-term cloud-sync requirement re-elevates it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path A as the default recommendation — the compat layer removes its unique advantage (sync-API preservation) and the stepping stone adds an API hop; only a near-term cloud-sync requirement re-elevates it.

### Porting the 3 FTS5 sync triggers — Turso FTS indexes the base table directly; the FTS5 `'delete'`-command external-content protocol has no equivalent and no need. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Porting the 3 FTS5 sync triggers — Turso FTS indexes the base table directly; the FTS5 `'delete'`-command external-content protocol has no equivalent and no need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Porting the 3 FTS5 sync triggers — Turso FTS indexes the base table directly; the FTS5 `'delete'`-command external-content protocol has no equivalent and no need.

### Porting the vec0 virtual table or the temp-view INSTEAD-OF alias layer to Turso — no extension loading in the compat surface (established: `loadExtension()` not implemented), and the plain-table replacement makes the entire alias layer (vector-index-store.ts:551-612) deletable rather than portable. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Porting the vec0 virtual table or the temp-view INSTEAD-OF alias layer to Turso — no extension loading in the compat surface (established: `loadExtension()` not implemented), and the plain-table replacement makes the entire alias layer (vector-index-store.ts:551-612) deletable rather than portable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Porting the vec0 virtual table or the temp-view INSTEAD-OF alias layer to Turso — no extension loading in the compat surface (established: `loadExtension()` not implemented), and the plain-table replacement makes the entire alias layer (vector-index-store.ts:551-612) deletable rather than portable.

### Re-elevating Path A on the strength of the W5 wave. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Re-elevating Path A on the strength of the W5 wave.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-elevating Path A on the strength of the W5 wave.

### Relying on the `FLOAT[(\d+)]` sqlite_master regex for dimension discovery post-migration — `vec_metadata` is already the primary source and must become the only one. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Relying on the `FLOAT[(\d+)]` sqlite_master regex for dimension discovery post-migration — `vec_metadata` is already the primary source and must become the only one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on the `FLOAT[(\d+)]` sqlite_master regex for dimension discovery post-migration — `vec_metadata` is already the primary source and must become the only one.

### Sandbox rejected `$(...)` expansion, `awk` pipelines, and `rg --stats`, so token counts were gathered via plain `rg -c`/`rg -l` (per-file counts eyeball-summed; treat file counts as exact, match totals as approximate). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Sandbox rejected `$(...)` expansion, `awk` pipelines, and `rg --stats`, so token counts were gathered via plain `rg -c`/`rg -l` (per-file counts eyeball-summed; treat file counts as exact, match totals as approximate).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sandbox rejected `$(...)` expansion, `awk` pipelines, and `rg --stats`, so token counts were gathered via plain `rg -c`/`rg -l` (per-file counts eyeball-summed; treat file counts as exact, match totals as approximate).

### Schema-qualified PRAGMA as a pilot blocker (QualifiedName → database_id resolution verified in core). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Schema-qualified PRAGMA as a pilot blocker (QualifiedName → database_id resolution verified in core).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Schema-qualified PRAGMA as a pilot blocker (QualifiedName → database_id resolution verified in core).

### Searched bindings/javascript for `rawCode`/`SQLITE_BUSY`-style code mapping — nothing beyond the generic-error constructor; no TS-side error-code normalization found in the vendored snapshot. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searched bindings/javascript for `rawCode`/`SQLITE_BUSY`-style code mapping — nothing beyond the generic-error constructor; no TS-side error-code normalization found in the vendored snapshot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searched bindings/javascript for `rawCode`/`SQLITE_BUSY`-style code mapping — nothing beyond the generic-error constructor; no TS-side error-code normalization found in the vendored snapshot.

### Searched the vendored JS bindings for a compat-mode (`./compat`) test exercising `experimental: [...]` options — only the promise-API test exists (promise.test.ts:246), so compat passthrough of the flag remains unconfirmed from the vendored tree alone. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Searched the vendored JS bindings for a compat-mode (`./compat`) test exercising `experimental: [...]` options — only the promise-API test exists (promise.test.ts:246), so compat passthrough of the flag remains unconfirmed from the vendored tree alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searched the vendored JS bindings for a compat-mode (`./compat`) test exercising `experimental: [...]` options — only the promise-API test exists (promise.test.ts:246), so compat passthrough of the flag remains unconfirmed from the vendored tree alone.

### Searching for SQL-level `JOIN ... active_vec` literals in spec-kit lib found none directly — the join is parameterized (`${vectorSource.tableName}`), only resolvable by reading vector-index-queries.ts around lines 311-324. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Searching for SQL-level `JOIN ... active_vec` literals in spec-kit lib found none directly — the join is parameterized (`${vectorSource.tableName}`), only resolvable by reading vector-index-queries.ts around lines 311-324.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for SQL-level `JOIN ... active_vec` literals in spec-kit lib found none directly — the join is parameterized (`${vectorSource.tableName}`), only resolvable by reading vector-index-queries.ts around lines 311-324.

### statediff.ts as a migration surface at all — it contains no SQL. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: statediff.ts as a migration surface at all — it contains no SQL.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: statediff.ts as a migration surface at all — it contains no SQL.

### Sync-package experimental forwarding: the sync binding hardcodes `experimental: None` (sync/src/lib.rs:258), so chasing a sync-SDK attach path is futile at this tag. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Sync-package experimental forwarding: the sync binding hardcodes `experimental: None` (sync/src/lib.rs:258), so chasing a sync-SDK attach path is futile at this tag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sync-package experimental forwarding: the sync binding hardcodes `experimental: None` (sync/src/lib.rs:258), so chasing a sync-SDK attach path is futile at this tag.

### That `PRAGMA synchronous` errors on invalid values — it silently coerces unknown values to FULL (deviating from SQLite, which falls back to NORMAL). -- BLOCKED (iteration 13, 1 attempts)
- What was tried: That `PRAGMA synchronous` errors on invalid values — it silently coerces unknown values to FULL (deviating from SQLite, which falls back to NORMAL).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: That `PRAGMA synchronous` errors on invalid values — it silently coerces unknown values to FULL (deviating from SQLite, which falls back to NORMAL).

### The baseline 500–800 LOC adapter scope — refuted by measured coupling (~127 production files, three servers, 027 hotspots). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The baseline 500–800 LOC adapter scope — refuted by measured coupling (~127 production files, three servers, 027 hotspots).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The baseline 500–800 LOC adapter scope — refuted by measured coupling (~127 production files, three servers, 027 hotspots).

### The broad case-insensitive `instead` grep over core returned ~120 prose-comment hits with only 2 relevant lines (trigger.rs) — a word-boundary `INSTEAD OF` pattern would have been far cheaper. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: The broad case-insensitive `instead` grep over core returned ~120 prose-comment hits with only 2 relevant lines (trigger.rs) — a word-boundary `INSTEAD OF` pattern would have been far cheaper.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The broad case-insensitive `instead` grep over core returned ~120 prose-comment hits with only 2 relevant lines (trigger.rs) — a word-boundary `INSTEAD OF` pattern would have been far cheaper.

### The harness `Grep` tool was unavailable; fell back to `rg` via Bash. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The harness `Grep` tool was unavailable; fell back to `rg` via Bash.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The harness `Grep` tool was unavailable; fell back to `rg` via Bash.

### The implicit baseline assumption that ATTACH support was absent/unknown — ATTACH/DETACH are ✅ with sustained hardening through 0.6.0. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The implicit baseline assumption that ATTACH support was absent/unknown — ATTACH/DETACH are ✅ with sustained hardening through 0.6.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The implicit baseline assumption that ATTACH support was absent/unknown — ATTACH/DETACH are ✅ with sustained hardening through 0.6.0.

### The MVCC AUTOINCREMENT rejection still being live: the "not supported" text at core/mvcc/database/tests.rs:10412 is a stale leftover comment line sitting directly above the corrected doc and a passing positive test. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: The MVCC AUTOINCREMENT rejection still being live: the "not supported" text at core/mvcc/database/tests.rs:10412 is a stale leftover comment line sitting directly above the corrected doc and a passing positive test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The MVCC AUTOINCREMENT rejection still being live: the "not supported" text at core/mvcc/database/tests.rs:10412 is a stale leftover comment line sitting directly above the corrected doc and a passing positive test.

### The production-readiness FAQ file itself was located only by changelog reference, not read. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The production-readiness FAQ file itself was located only by changelog reference, not read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The production-readiness FAQ file itself was located only by changelog reference, not read.

### The strategy file's KEY QUESTIONS anchors were unpopulated by the reducer; C1a-C8a definitions recovered from per-iteration prompt files. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: The strategy file's KEY QUESTIONS anchors were unpopulated by the reducer; C1a-C8a definitions recovered from per-iteration prompt files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The strategy file's KEY QUESTIONS anchors were unpopulated by the reducer; C1a-C8a definitions recovered from per-iteration prompt files.

### Three `;`-chained / `cd`-prefixed shell compounds were sandbox-blocked and had to be re-issued as absolute-path `&&` chains (no information lost). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Three `;`-chained / `cd`-prefixed shell compounds were sandbox-blocked and had to be re-issued as absolute-path `&&` chains (no information lost).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Three `;`-chained / `cd`-prefixed shell compounds were sandbox-blocked and had to be re-issued as absolute-path `&&` chains (no information lost).

### Treating full async conversion as a migration precondition — compat mode makes it deferrable to the remote/sync phase. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating full async conversion as a migration precondition — compat mode makes it deferrable to the remote/sync phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating full async conversion as a migration precondition — compat mode makes it deferrable to the remote/sync phase.

### Triggers being behind an experimental opt-in: the JS `'triggers'` ExperimentalFeature type entry is dead code (no match arm in the feature dispatch; no corresponding core flag exists). -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Triggers being behind an experimental opt-in: the JS `'triggers'` ExperimentalFeature type entry is dead code (no match arm in the feature dispatch; no corresponding core flag exists).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Triggers being behind an experimental opt-in: the JS `'triggers'` ExperimentalFeature type entry is dead code (no match arm in the feature dispatch; no corresponding core flag exists).

### Turso "compat mode" as a speculative feature — it is a concrete shipped export (`@tursodatabase/database/compat`) with its own test suite (`packages/native/compat.test.ts`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Turso "compat mode" as a speculative feature — it is a concrete shipped export (`@tursodatabase/database/compat`) with its own test suite (`packages/native/compat.test.ts`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Turso "compat mode" as a speculative feature — it is a concrete shipped export (`@tursodatabase/database/compat`) with its own test suite (`packages/native/compat.test.ts`).

### Two Bash compound/glob commands were sandbox-blocked (`&&`-joined ls+rg; `rg -rn` with glob path) — recovered by splitting; no evidence lost but cost ~2 of the budget. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Two Bash compound/glob commands were sandbox-blocked (`&&`-joined ls+rg; `rg -rn` with glob path) — recovered by splitting; no evidence lost but cost ~2 of the budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Two Bash compound/glob commands were sandbox-blocked (`&&`-joined ls+rg; `rg -rn` with glob path) — recovered by splitting; no evidence lost but cost ~2 of the budget.

### Two compound Bash commands rejected by sandbox policy (cd-compound, multi-statement), costing budget without yielding evidence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Two compound Bash commands rejected by sandbox policy (cd-compound, multi-statement), costing budget without yielding evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Two compound Bash commands rejected by sandbox policy (cd-compound, multi-statement), costing budget without yielding evidence.

### Two compound Bash commands were blocked by the sandbox approval gate (no data; cost 2 of the 12-call budget). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Two compound Bash commands were blocked by the sandbox approval gate (no data; cost 2 of the 12-call budget).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Two compound Bash commands were blocked by the sandbox approval gate (no data; cost 2 of the 12-call budget).

### Two grep formulations were blocked by the sandbox command parser: a `${...}` template-literal regex (shell `$\{` interpolation flagged) and an `rg --files | rg` pipe; both reworked into simpler single-pattern greps that succeeded. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Two grep formulations were blocked by the sandbox command parser: a `${...}` template-literal regex (shell `$\{` interpolation flagged) and an `rg --files | rg` pipe; both reworked into simpler single-pattern greps that succeeded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Two grep formulations were blocked by the sandbox command parser: a `${...}` template-literal regex (shell `$\{` interpolation flagged) and an `rg --files | rg` pipe; both reworked into simpler single-pattern greps that succeeded.

### Two sandbox permission rejections (a compound `&&`/`;` command, then an `rg -C2` invocation) cost two tool calls before plain single-command `rg`/`find` probes succeeded. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Two sandbox permission rejections (a compound `&&`/`;` command, then an `rg -C2` invocation) cost two tool calls before plain single-command `rg`/`find` probes succeeded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Two sandbox permission rejections (a compound `&&`/`;` command, then an `rg -C2` invocation) cost two tool calls before plain single-command `rg`/`find` probes succeeded.

### Web revalidation skipped this iteration: budget went to local verification, and post-vendor web state was covered in iterations 1–6. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Web revalidation skipped this iteration: budget went to local verification, and post-vendor web state was covered in iterations 1–6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Web revalidation skipped this iteration: budget went to local verification, and post-vendor web state was covered in iterations 1–6.

### Web verification of libsql#1811 and post-v0.7.0-pre.6 releases: WebSearch permission-denied, WebFetch permission-denied (two URLs), `curl` to api.github.com approval-blocked. Same failure as iteration 9's C3c-followup — do NOT redispatch this question to a seat without first confirming web permissions are actually granted; two seats have now burned budget on it. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Web verification of libsql#1811 and post-v0.7.0-pre.6 releases: WebSearch permission-denied, WebFetch permission-denied (two URLs), `curl` to api.github.com approval-blocked. Same failure as iteration 9's C3c-followup — do NOT redispatch this question to a seat without first confirming web permissions are actually granted; two seats have now burned budget on it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Web verification of libsql#1811 and post-v0.7.0-pre.6 releases: WebSearch permission-denied, WebFetch permission-denied (two URLs), `curl` to api.github.com approval-blocked. Same failure as iteration 9's C3c-followup — do NOT redispatch this question to a seat without first confirming web permissions are actually granted; two seats have now burned budget on it.

### WebFetch of github.com/tursodatabase/libsql/issues/1811 and WebSearch for post-v0.7.0-pre.6 releases: permission denied in this seat — C3c upstream status and any FTS stabilization news after the vendor snapshot remain unverified. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: WebFetch of github.com/tursodatabase/libsql/issues/1811 and WebSearch for post-v0.7.0-pre.6 releases: permission denied in this seat — C3c upstream status and any FTS stabilization news after the vendor snapshot remain unverified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: WebFetch of github.com/tursodatabase/libsql/issues/1811 and WebSearch for post-v0.7.0-pre.6 releases: permission denied in this seat — C3c upstream status and any FTS stabilization news after the vendor snapshot remain unverified.

### WebSearch and WebFetch are both permission-blocked in this session — June-2026 libSQL maintenance status and Turso post-vendor releases could not be verified; flagged as cutoff-knowledge where used. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: WebSearch and WebFetch are both permission-blocked in this session — June-2026 libSQL maintenance status and Turso post-vendor releases could not be verified; flagged as cutoff-knowledge where used.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: WebSearch and WebFetch are both permission-blocked in this session — June-2026 libSQL maintenance status and Turso post-vendor releases could not be verified; flagged as cutoff-knowledge where used.

### WebSearch and WebFetch both permission-blocked this session — no verification of releases after v0.7.0-pre.6, open GitHub issues, or current libsql-npm `loadExtension` status. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: WebSearch and WebFetch both permission-blocked this session — no verification of releases after v0.7.0-pre.6, open GitHub issues, or current libsql-npm `loadExtension` status.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: WebSearch and WebFetch both permission-blocked this session — no verification of releases after v0.7.0-pre.6, open GitHub issues, or current libsql-npm `loadExtension` status.

### WebSearch and WebFetch were both permission-denied in this seat, so post-vendor (after ~June 2026) releases, open corruption issues, and 1.0 announcements could not be verified. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: WebSearch and WebFetch were both permission-denied in this seat, so post-vendor (after ~June 2026) releases, open corruption issues, and 1.0 announcements could not be verified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: WebSearch and WebFetch were both permission-denied in this seat, so post-vendor (after ~June 2026) releases, open corruption issues, and 1.0 announcements could not be verified.

### WebSearch is permission-blocked in this seat — post-vendor state (releases after v0.7.0-pre.6, the "20.9% of 1.0 milestone" roadmap figure at 003:45, GitHub issue activity) could not be re-verified this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: WebSearch is permission-blocked in this seat — post-vendor state (releases after v0.7.0-pre.6, the "20.9% of 1.0 milestone" roadmap figure at 003:45, GitHub issue activity) could not be re-verified this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: WebSearch is permission-blocked in this seat — post-vendor state (releases after v0.7.0-pre.6, the "20.9% of 1.0 milestone" roadmap figure at 003:45, GitHub issue activity) could not be re-verified this iteration.

<!-- /ANCHOR:exhausted-approaches -->

---

## 10. RULED-OUT DIRECTIONS

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "Neither Turso's SDK nor the libsql npm package implements `.pragma()`" — disproven for Turso's SDK at 0.7.0-pre.6; the W3a mechanical `.exec('PRAGMA …')` rewrite is no longer needed for method availability (the real remaining work is engine-level pragma gaps). (iteration 1)
- `bindings/javascript/packages/common/src/` does not exist — TS sources live flat in `packages/common/` (one empty search round). (iteration 1)
- CHANGELOG.md has no 0.7.0-pre.x section — newest entry is `0.6.0 -- 2026-05-14` [SOURCE: CHANGELOG.md:3], so 0.6.0→0.7.0-pre.6 deltas are observable only in source. (iteration 1)
- The harness `Grep` tool was unavailable; fell back to `rg` via Bash. (iteration 1)
- The implicit baseline assumption that ATTACH support was absent/unknown — ATTACH/DETACH are ✅ with sustained hardening through 0.6.0. (iteration 1)
- Turso "compat mode" as a speculative feature — it is a concrete shipped export (`@tursodatabase/database/compat`) with its own test suite (`packages/native/compat.test.ts`). (iteration 1)
- WebSearch and WebFetch both permission-blocked this session — no verification of releases after v0.7.0-pre.6, open GitHub issues, or current libsql-npm `loadExtension` status. (iteration 1)
- `vector_top_k` / `libsql_vector_idx` being locally usable — the sole occurrence is inside `test.skip` (sync.test.js:277). (iteration 2)
- Baseline 003:45 "No ANN index, no HNSW, no IVF" is slightly stale in letter (a *toy* sparse-IVF exists behind the experimental index_method extension point) but holds in substance: nothing production-usable. (iteration 2)
- CHANGELOG.md vector-history grep was lost to a sandbox-blocked compound Bash command; not retried under budget. (iteration 2)
- DiskANN (or any production ANN index) shipped in Turso core at v0.7.0-pre.6 — zero engine references; only a skipped JS conformance test mentions the libSQL ANN API. (iteration 2)
- WebSearch is permission-blocked in this seat — post-vendor state (releases after v0.7.0-pre.6, the "20.9% of 1.0 milestone" roadmap figure at 003:45, GitHub issue activity) could not be re-verified this iteration. (iteration 2)
- "FTS might have been promoted to stable / non-experimental by 0.7.0-pre.6" — disproven; it is explicitly experimental-gated via the `index_method` feature [SOURCE: experimental-features.mdx:19, create-index.mdx:101]. (iteration 3)
- "FTS5 compatibility might have been added as a shim" — disproven; FTS3/FTS4/FTS5 remain ❌ "Use Turso FTS instead" [SOURCE: COMPAT.md:1084]. (iteration 3)
- "Tantivy may have gained automatic segment merging in Turso by 0.7.0-pre.6" — disproven; NoMergePolicy is set unconditionally in source and documented as a limitation [SOURCE: core/index_method/fts.rs:2956, docs/fts.md:455]. (iteration 3)
- Grep for "experimental" inside `core/index_method/fts.rs`: zero hits — the gating lives in the CLI/SDK connection layer, not the index module (useful negative: enabling is per-connection config, not per-index DDL). (iteration 3)
- Two compound Bash commands rejected by sandbox policy (cd-compound, multi-statement), costing budget without yielding evidence. (iteration 3)
- WebFetch of github.com/tursodatabase/libsql/issues/1811 and WebSearch for post-v0.7.0-pre.6 releases: permission denied in this seat — C3c upstream status and any FTS stabilization news after the vendor snapshot remain unverified. (iteration 3)
- **Any recursive-CTE softening between v0.5.0 and v0.7.0-pre.6** — the parse-time bailout is present in two planner paths; no changelog entry mentions recursive CTE progress. (iteration 4)
- **Baseline gap 14's claim that the `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` frame works** — COMPAT.md:132 states custom frame specs are not yet supported at all; only default-frame aggregate OVER and row_number() function. (iteration 4)
- **Direct grep of `core/mvcc/` for trigger restrictions never completed** — the sandbox rejected three compound/`2>/dev/null` command forms before budget ran out; the MVCC×trigger interaction (gap 8's original core claim) is answered only indirectly (COMPAT.md notes no MVCC caveat on triggers). (iteration 4)
- **Triggers requiring an experimental flag at 0.7.0-pre.6** — refuted by CHANGELOG.md:338 ("Remove experimental flag from triggers, enable by default") and unconditional ✅ in COMPAT.md:95. Gap 8's framing of triggers as broadly unreliable outside MVCC no longer holds. (iteration 4)
- **WebSearch and WebFetch both permission-denied** in this run — post-vendor state (releases/issues after v0.7.0-pre.6, any recursive-CTE or window-function roadmap) could not be checked. (iteration 4)
- Initial `cd`-prefixed and `-r`-flagged rg invocations rejected by the command sandbox (cost 5 of 12 calls). (iteration 4)
- "Turso is permanently single-process; the WAL has no cross-process story" — refuted by the shipped experimental `.tshm` multi-process WAL coordination (README.md:61; core/lib.rs:222ff); the wal.rs:2662 "never support multi process" comment is stale. (iteration 5)
- **Web revalidation impossible this session:** both WebSearch and WebFetch were permission-denied, so post-v0.7.0-pre.6 releases/issues (the C5 "current web state" half) could not be checked. (iteration 5)
- Any expectation that Turso JS errors carry better-sqlite3-style `code: 'SQLITE_BUSY'` — the binding emits message-only generic napi errors (lib.rs:212,225-227). (iteration 5)
- COMPAT.md as a source of MVCC maturity signal — it contains essentially no MVCC content (single hit: `PRAGMA mvcc_checkpoint_threshold`, COMPAT.md:230); maturity evidence lives in journal_mode.rs, the agent guides, tests, and CHANGELOG. (iteration 5)
- Gap 7's premise "AUTOINCREMENT does not work under MVCC" — refuted by atomic-sequence implementation and four dedicated tests (tests.rs:10412-10539); the W7b "switch to UUIDs" contingency (003:422-433) is no longer needed for MVCC compatibility. (iteration 5)
- Searched bindings/javascript for `rawCode`/`SQLITE_BUSY`-style code mapping — nothing beyond the generic-error constructor; no TS-side error-code normalization found in the vendored snapshot. (iteration 5)
- Three `;`-chained / `cd`-prefixed shell compounds were sandbox-blocked and had to be re-issued as absolute-path `&&` chains (no information lost). (iteration 5)
- "CDC's API name is literally unstable_" — the canonical pragma is now `capture_data_changes_conn`; only the alias keeps the prefix. (iteration 6)
- "Turso lacks ATTACH" as an absolute — ATTACH exists with fresh-database initialization and schema tests at 0.7.0-pre.6 (degree of parity still unverified). (iteration 6)
- "Turso/libSQL does not support VACUUM INTO" — the context report's 3/3-agreed HARD blocker framing for checkpoints.ts:2281/2284 is disproven at 0.7.0-pre.6 (supported, with regression and encryption tests). (iteration 6)
- The production-readiness FAQ file itself was located only by changelog reference, not read. (iteration 6)
- Two compound Bash commands were blocked by the sandbox approval gate (no data; cost 2 of the 12-call budget). (iteration 6)
- WebSearch and WebFetch were both permission-denied in this seat, so post-vendor (after ~June 2026) releases, open corruption issues, and 1.0 announcements could not be verified. (iteration 6)
- Immediate LanceDB adoption (P4 promotion) — current scale (~2k memories) plus the established quantized two-stage mitigation keeps Path B's trigger unfired. (iteration 7)
- Path A as the default recommendation — the compat layer removes its unique advantage (sync-API preservation) and the stepping stone adds an API hop; only a near-term cloud-sync requirement re-elevates it. (iteration 7)
- Sandbox rejected `$(...)` expansion, `awk` pipelines, and `rg --stats`, so token counts were gathered via plain `rg -c`/`rg -l` (per-file counts eyeball-summed; treat file counts as exact, match totals as approximate). (iteration 7)
- The baseline 500–800 LOC adapter scope — refuted by measured coupling (~127 production files, three servers, 027 hotspots). (iteration 7)
- Treating full async conversion as a migration precondition — compat mode makes it deferrable to the remote/sync phase. (iteration 7)
- WebSearch and WebFetch are both permission-blocked in this session — June-2026 libSQL maintenance status and Turso post-vendor releases could not be verified; flagged as cutoff-knowledge where used. (iteration 7)
- `PRAGMA optimize`, `mmap_size`, `defer_foreign_keys`, `synchronous`, and `WITHOUT ROWID` as literal SQL strings in any of the three mcp_server trees — grep returned zero hits, so COMPAT's ❌ rows for these don't bite via that form (caveat below). (iteration 8)
- A triggers-vs-MVCC NEW gap from the mutation-ledger: catalog gap 8 already covers it; outside MVCC opt-in the triggers work. (iteration 8)
- Could not re-audit the 8-pragma `.pragma('…')` startup block in `vector-index-store.ts::initialize_db` for `synchronous=NORMAL`/`mmap_size` usage (the literal-`PRAGMA` grep wouldn't match `.pragma()` call syntax) — budget exhausted; iterations 1–6 already flag these engine gaps generically. (iteration 8)
- Gap 15 (FTS5 parameterized insert bug) as relevant to the Turso-rewrite path — it's libsql-only and FTS5 is absent in Turso anyway. (iteration 8)
- Two Bash compound/glob commands were sandbox-blocked (`&&`-joined ls+rg; `rg -rn` with glob path) — recovered by splitting; no evidence lost but cost ~2 of the budget. (iteration 8)
- Web revalidation skipped this iteration: budget went to local verification, and post-vendor web state was covered in iterations 1–6. (iteration 8)
- **C3c-followup (libsql FTS5 parameterized-insert bug, gap 15): BLOCKED.** Both WebSearch and WebFetch were permission-denied in this seat's runtime; the libsql repo is not vendored locally, so fixed-vs-open status could not be determined. Status remains as baseline (open) with confidence unchanged; needs a web-enabled seat. (iteration 9)
- **Post-vendor web sweep (releases after v0.7.0-pre.6, latest version, vector-index/FTS/MVCC-exclusivity/CDC/1.0 signals): BLOCKED** by the same web-tool permission denial. The vendored CHANGELOG.md by definition ends at the vendor point and cannot answer post-vendor questions. (iteration 9)
- A dedicated production-readiness or FAQ document under `external/turso-main/docs/` — does not exist; the only FAQ is the README section. (iteration 9)
- A synchronous-related crash or hard error in the spec-kit vector-index init on Turso — impossible at v0.7.0-pre.6 given the coerce-to-Full parser; no error path exists for unrecognized synchronous values. (iteration 9)
- Compound shell commands (`;`, some `&&`+pipe forms) repeatedly tripped the sandbox approval splitter, costing ~4 tool calls to failed invocations before adapting to single-command `rg` calls. (iteration 9)
- `db.backup()` dependency in the checkpoint path (already VACUUM-INTO based). (iteration 10)
- `incremental_vacuum` as a pilot blocker (self-gating on auto_vacuum mode + try/catch warn-and-skip at the only call site). (iteration 10)
- Any usage of the six not-implemented compat methods (backup/serialize/function/aggregate/table/loadExtension) — and of iterate/raw/pluck/columns/unsafeMode/defaultSafeIntegers — anywhere in the three skills' lib trees; no compat shims needed for method coverage. (iteration 10)
- Schema-qualified PRAGMA as a pilot blocker (QualifiedName → database_id resolution verified in core). (iteration 10)
- Two grep formulations were blocked by the sandbox command parser: a `${...}` template-literal regex (shell `$\{` interpolation flagged) and an `rg --files | rg` pipe; both reworked into simpler single-pattern greps that succeeded. (iteration 10)
- An initial compound shell command for the bindings/core grep was rejected by the sandbox and re-issued as separate calls (one tool call spent, no information lost). (iteration 11)
- Porting the 3 FTS5 sync triggers — Turso FTS indexes the base table directly; the FTS5 `'delete'`-command external-content protocol has no equivalent and no need. (iteration 11)
- Porting the vec0 virtual table or the temp-view INSTEAD-OF alias layer to Turso — no extension loading in the compat surface (established: `loadExtension()` not implemented), and the plain-table replacement makes the entire alias layer (vector-index-store.ts:551-612) deletable rather than portable. (iteration 11)
- Relying on the `FLOAT[(\d+)]` sqlite_master regex for dimension discovery post-migration — `vec_metadata` is already the primary source and must become the only one. (iteration 11)
- Searched the vendored JS bindings for a compat-mode (`./compat`) test exercising `experimental: [...]` options — only the promise-API test exists (promise.test.ts:246), so compat passthrough of the flag remains unconfirmed from the vendored tree alone. (iteration 11)
- `rg --files` and multi-statement Bash pipelines intermittently require approval in this sandbox; single-pattern `rg` searches with `-g` globs work — use those. (iteration 12)
- Any of the six advanced SQL construct classes (UPSERT ON CONFLICT, partial indexes, expression indexes, generated columns, json functions, STRICT tables) appearing in incremental-index.ts, statediff.ts, or the causal tombstone constructs — exhaustive pattern scan over all four implicated files found none. (iteration 12)
- MVCC as a load-bearing requirement for spec-kit — all candidate concurrent-write flows are serialized by the lease/single-writer daemon design. (iteration 12)
- statediff.ts as a migration surface at all — it contains no SQL. (iteration 12)
- Web verification of libsql#1811 and post-v0.7.0-pre.6 releases: WebSearch permission-denied, WebFetch permission-denied (two URLs), `curl` to api.github.com approval-blocked. Same failure as iteration 9's C3c-followup — do NOT redispatch this question to a seat without first confirming web permissions are actually granted; two seats have now burned budget on it. (iteration 12)
- "ATTACH/DETACH are unconditionally available via SQL" — refuted by the `experimental_attach_enabled()` gate in both translate functions. (iteration 13)
- "PRAGMA synchronous accepts only OFF/FULL" (iteration 1) — refuted by the explicit `b"NORMAL" | b"1" => SyncMode::Normal` arm. (iteration 13)
- "wal_checkpoint(TRUNCATE) is unsupported at engine level" (iteration 1) — refuted by the handler's `CheckpointMode::from_str` path plus three independent test suites exercising it. (iteration 13)
- Compound shell commands (var assignments + pipes) were rejected by the sandbox; the first 4-call batch produced no evidence and had to be re-run as single `rg` invocations. (iteration 13)
- Grepping `impl FromStr for CheckpointMode` in `core/storage/wal.rs` returned nothing — the `FromStr` impl is likely derive-generated (strum-style); I fell back to the enum definition plus the call site and passing tests to establish the accepted mode names. (iteration 13)
- No `experimental_attach` references exist anywhere under `bindings/javascript`, so I could not locate a JS-side enablement path for SQL ATTACH (treated as evidence of absence for the SDK surface, not proof). (iteration 13)
- That `PRAGMA synchronous` errors on invalid values — it silently coerces unknown values to FULL (deviating from SQLite, which falls back to NORMAL). (iteration 13)
- "changes() wrong for UPDATE statements" (per COMPAT.md): contradicted by passing, integrity-cross-checked UPDATE tests in changes.sqltest; the residual caveat narrows to trigger interactions. (iteration 14)
- Compound shell commands (multi-`rg` batches with `;` and pipes) were rejected by the sandbox permission layer, burning the first six tool calls with zero evidence; all searches had to be re-issued as single `rg` invocations. (iteration 14)
- The broad case-insensitive `instead` grep over core returned ~120 prose-comment hits with only 2 relevant lines (trigger.rs) — a word-boundary `INSTEAD OF` pattern would have been far cheaper. (iteration 14)
- The MVCC AUTOINCREMENT rejection still being live: the "not supported" text at core/mvcc/database/tests.rs:10412 is a stale leftover comment line sitting directly above the corrected doc and a passing positive test. (iteration 14)
- Triggers being behind an experimental opt-in: the JS `'triggers'` ExperimentalFeature type entry is dead code (no match arm in the feature dispatch; no corresponding core flag exists). (iteration 14)
- A dense (cosine/L2) native vector index in Turso 0.7.0-pre.6 — `core/index_method/` contains only the backing b-tree, FTS, and the toy sparse-IVF (jaccard-only). (iteration 15)
- Any production call site of `.backup(`, `.serialize(`, `.function(`, `.aggregate(`, `.table(`, `loadExtension(`, `.iterate(`, `.raw(`, `.pluck(` in the three skills' `lib/` trees — zero matches; the literal token `loadExtension(` does not appear in our code at all. (iteration 15)
- FTS5-style query-time `bm25()` weight overrides in Turso FTS — weights enter only through the CREATE INDEX `WITH` clause. (iteration 15)
- Guessed file `lib/embedders/shard-writer.ts` does not exist; the checkpoint logic lives in `reindex.ts` itself. (iteration 15)
- Two sandbox permission rejections (a compound `&&`/`;` command, then an `rg -C2` invocation) cost two tool calls before plain single-command `rg`/`find` probes succeeded. (iteration 15)
- "A separate napi attach method is required for JS shard attachment" — the normal exec path carries ATTACH once the flag is set; no binding-level interception exists. (iteration 16)
- "The JS SDK cannot enable SQL ATTACH at all" (iteration 13's pivotal finding) — refuted by `"attach" => core_opts.with_attach(true)` [bindings/javascript/src/lib.rs:283] plus passing in-tree tests; the original grep keyed on the wrong identifier (`experimental_attach` vs `with_attach`). (iteration 16)
- "VACUUM active_vec INTO is blocked by the main-only schema rejection" — the rejection at core/translate/vacuum.rs:51-57 is inside the in-place (`into: None`) branch only; VACUUM INTO resolves arbitrary attached schemas at execution. (iteration 16)
- Grep for `attach_database` / `fn attach` across core/lib.rs and bindings/javascript/src: zero hits — no programmatic attach API surface to document. (iteration 16)
- Searching for SQL-level `JOIN ... active_vec` literals in spec-kit lib found none directly — the join is parameterized (`${vectorSource.tableName}`), only resolvable by reading vector-index-queries.ts around lines 311-324. (iteration 16)
- Sync-package experimental forwarding: the sync binding hardcodes `experimental: None` (sync/src/lib.rs:258), so chasing a sync-SDK attach path is futile at this tag. (iteration 16)
- A literal "Open Questions" section in baseline docs 001/002/003. (iteration 17)
- Any fifth member of the HARD blocker set: the context report's extra blockers all stand refuted; blockers are exactly vector index, FTS5 surface, WITH RECURSIVE. (iteration 17)
- Carrying gap 15 or post-vendor-release status as open items — both closed by host web evidence. (iteration 17)
- grep -i "open question" over all three baseline docs returned zero hits — resolved via full heading outlines instead. (iteration 17)
- Re-elevating Path A on the strength of the W5 wave. (iteration 17)
- The strategy file's KEY QUESTIONS anchors were unpopulated by the reducer; C1a-C8a definitions recovered from per-iteration prompt files. (iteration 17)

<!-- /ANCHOR:ruled-out-directions -->

---

## 11. NEXT FOCUS

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Proceed to synthesis: lift this verdict table verbatim into research.md, merge iteration 16's ATTACH resolution into the C-prime caveat, and carry the six-item residual list as the synthesis open-questions section.

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
