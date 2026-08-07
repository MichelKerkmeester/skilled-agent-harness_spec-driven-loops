# Iteration 008 — Angle 8

**Angle:** Unclean-shutdown marker lifecycle: probe cost on large DBs at every boot after crash; marker staleness semantics across multiple launchers.

**Summary:** The marker lifecycle is safety-conservative, but launcher-side marker resolution drifts under SPEC_KIT_DB_DIR and there is no staleness/probe receipt to bound repeated post-crash quick_check cost. Documentation also lags the implemented default-on FTS auto-heal behavior.

**Findings kept:** 3

## [P2][BUG] Launcher clean-close barrier ignores SPEC_KIT_DB_DIR marker location

- Evidence: .opencode/bin/mk-spec-memory-launcher.cjs:670-673 checks MEMORY_DB_PATH else resolvedDbDir(); .opencode/bin/mk-spec-memory-launcher.cjs:310-312 resolves that dir to the skill-local database; .opencode/skills/system-spec-kit/mcp_server/core/config.ts:67-92 lets the daemon place the DB under SPEC_KIT_DB_DIR; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:376-377 opens that resolved DB path.
- Detail: With SPEC_KIT_DB_DIR but no MEMORY_DB_PATH, the context server writes .unclean-shutdown beside the actual overridden DB, while the launcher checks the skill-local database directory. That makes stale-lease reap logging and cleanClose classification wrong across launcher handoff, although the replacement daemon still probes the actual marker on boot.
- Fix sketch: Teach the launcher to derive the marker path from the same SPEC_KIT_DB_DIR/MEMORY_DB_PATH resolution rules as the daemon, or persist the actual marker path in the lease.

## [P2][REFINEMENT] Crash-loop boots repeat the whole-DB integrity probe until a clean close

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:2059-2083 runs PRAGMA quick_check(1) whenever the marker exists; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1073-1077 marker JSON stores only pid/databasePath/startedAt; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:2174-2186 removes the marker only after successful checkpoint and close.
- Detail: The code is conservative, but there is no persisted 'probe passed for this DB state' or stale-marker epoch. On a large but healthy DB, repeated startup crashes before clean close will pay the synchronous quick_check cost on every boot.
- Fix sketch: Add a crash-probe receipt keyed by DB path plus mtime/size/WAL state, and skip or downgrade repeat probes only when the receipt still matches.

## [P2][DOC-DRIFT] Docs still describe boot FTS handling as detect-only

- Evidence: .opencode/skills/system-spec-kit/mcp_server/README.md:259 says detection only with no auto-rebuild; .opencode/skills/system-spec-kit/README.md:922 says the FTS shadow check remains detect-only; .opencode/skills/system-spec-kit/mcp_server/context-server.ts:379-385 auto-rebuilds and re-verifies by default unless SPECKIT_BOOT_FTS_AUTOHEAL=0.
- Detail: The implementation auto-heals the FTS5 shadow by default, while two docs still claim the boot path only logs corruption and continues degraded. The main README even contradicts itself by documenting the auto-heal restart path at lines 927-930.
- Fix sketch: Update the guardrail and troubleshooting docs to state that boot FTS auto-heal is default-on and detect-only only when SPECKIT_BOOT_FTS_AUTOHEAL=0.
