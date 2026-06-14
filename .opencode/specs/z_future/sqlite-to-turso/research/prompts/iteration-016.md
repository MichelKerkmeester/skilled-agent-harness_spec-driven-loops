You are one read-only research seat executing iteration 16 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline v0.5.0 docs) against the VENDORED tree at v0.7.0-pre.6.

THIS ITERATION FOCUS: W6 pivot: ATTACH experimental gate and shard-architecture fallout

THE PIVOTAL NEW FINDING (iteration 13, adversarial): SQL-level ATTACH/DETACH at v0.7.0-pre.6 hard-fails unless the experimental flag is enabled ("ATTACH is an experimental feature. Enable with --experimental-attach flag", core/translate/attach.rs:21-25, :125-129; CLI opt-in experimental_attach via with_attach(...), cli/app.rs:95,244, core/lib.rs:269-272). A grep for experimental_attach under bindings/javascript found ZERO hits, suggesting the JS SDK cannot enable SQL ATTACH at all. The spec-kit vector-shard architecture (ATTACH active_vec; 3-DB shard migration; VACUUM active_vec INTO checkpoint snapshots) depends on ATTACH from JS.

Questions (answer ALL):
- Q1: Exhaustively enumerate which experimental features the JS SDK CAN enable: find the experimental option parsing in bindings/javascript (the experimental: [...] connect option seen for "index_method") and list every accepted feature string and what it maps to in core (with_index_method, with_multiprocess_wal, with_attach?, with_views?, encryption?). Is "attach" among them anywhere (also check the wasm package and the sync packages)? [SOURCE refs required]
- Q2: Read core/translate/vacuum.rs lines ~30-60 precisely: does the non-main-schema rejection apply to VACUUM INTO as well, or only to bare in-place VACUUM? Determine whether "VACUUM active_vec INTO ..." (schema-qualified VACUUM INTO, used by spec-kit checkpoints) works. If rejection applies, does "VACUUM main INTO" remain fine?
- Q3: Is there a programmatic attach path reachable from JS (e.g. a Database/Connection method wrapping conn.attach_database) even though SQL ATTACH is gated? Search the JS binding native layer (bindings/javascript/src/lib.rs and napi exports) for attach.
- Q4: Given your Q1-Q3 answers, restate the REAL blocker list for the spec-kit migration and the consequences for the shard architecture. Evaluate the three fallback shapes: (a) keep ATTACH and require the experimental flag IF JS-enableable; (b) replace attached shards with SEPARATE connections per shard DB (no ATTACH; cross-DB queries become app-level joins — enumerate which spec-kit queries actually join across main and shard); (c) consolidate the vector shard back into the main DB file (undo the shard split — what was the shard split for, per db-shard-migration.ts and vector-index-store comments?). Recommend one with effort notes.

EVIDENCE SOURCES: vendored .opencode/specs/z_future/sqlite-to-turso/external/turso-main/; prior iteration files in .opencode/specs/z_future/sqlite-to-turso/research/iterations/; host web evidence at .opencode/specs/z_future/sqlite-to-turso/research/host-web-evidence.md; the three skills under .opencode/skills/*/mcp_server/lib. No web access in your sandbox. Cite [SOURCE: path:line].

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 16: W6 pivot: ATTACH experimental gate and shard-architecture fallout
## Focus
(one paragraph)
## Findings
(one bullet per finding/verdict-row; EACH starts with NEW|PARTIAL|KNOWN; tables allowed inside the section after the bullets)
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)

