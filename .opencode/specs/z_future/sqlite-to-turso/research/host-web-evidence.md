# Host-Gathered Web Evidence (2026-06-10)

The claude2 research seats run without web access, so the host performed the two web-dependent checks directly. Cite as [HOST-WEB: <item>].

## Item 1 — Gap 15: libsql FTS5 parameterized-insert bug

- Issue: tursodatabase/libsql#1811 — "Typescript client can't insert into FTS5 tables"; panic `called Option::unwrap() on a None value` at `src/statement.rs:360`.
- Status checked 2026-06-10: **OPEN**. No comments, no linked fix PR, no assignees, no resolution.
- Implication: baseline gap 15 verdict UNCHANGED; workaround W15a (use the `libsql` sync package rather than `@libsql/client` for FTS5 writes) remains required on any libSQL path.
- Source: https://github.com/tursodatabase/libsql/issues/1811

## Item 2 — Post-vendor Turso releases

- Releases page checked 2026-06-10: latest tags `v0.7.0-pre.6` (Jun 9) ← vendored snapshot IS the newest release; prior: `v0.7.0-pre.5` (Jun 2), `v0.7.0-pre.4` (May 27), `v0.7.0-pre.3` / `v0.6.1` (May 22), `v0.7.0-pre.2` (May 20).
- No stable v0.7.0 yet; latest stable line is v0.6.1.
- No announcements found for: vector-index GA in turso-core, FTS/Tantivy de-experimentalization, CDC default-on, or a 1.0 roadmap date.
- Marketing note: turso.tech/vector advertises "Native Vector Search using DiskANN" — that is the libSQL/Turso-Cloud product line, not turso-core; consistent with the baseline three-product distinction (001 §overview).
- v0.6.x stable-line highlights per releases page: generated columns, multi-process database access, temporary tables, MVCC checkpoint/savepoint fixes.
- Sources: https://github.com/tursodatabase/turso/releases · https://turso.tech/vector

## Net effect on the revalidation

1. The vendored-tree evidence base is current — no post-vendor correction pass needed.
2. Gap 15 stays a live caveat on Path A's libSQL leg (which iteration 7 already demoted).
3. Vector indexing remains cloud/libSQL-only marketing; turso-core stays linear-scan (gap 1 UNCHANGED).
