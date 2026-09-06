# Iteration 20: Successor declared-loss vs leftover harness

## Focus
Angle 6 wrap before synthesis. The declared-loss table is honest; leftover harness still grades or writes the retired store. No early synthesis in prior iterations; this is the last research pass.

## Findings

### F-I20-001 — Declared-loss table is honest; leftover writers contradict it. CONFIRMED. P1
Section 9 says semantic match, fusion, decay, access tracking, session dedup, causal graph, checkpoints are gone, each a loss not a migration. [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:207-218]
That matches F-I8-003/005. The contradiction is operational: `rebuildAutoEntities` / `storeEntities` still write `memory_index` (F-I11, F-I18-002), `legacy-lane.mjs` still queries `memory_index` (F-I5-006), and `/doctor update` still snapshots `mcp-server/database/*.sqlite` (F-I14-001). The docs declare loss; the leftover code still serves the store.
Smallest fix: delete or quarantine the leftover writers and doctor snapshot glob so the tree matches the loss table.

### F-I20-002 — Session-dedup row overstates the loss (restated). CONFIRMED. P2
The table says "Nothing fingerprints a session". [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:217]
Continuity still stores `session_dedup.fingerprint` (F-I8-004). Search-result dedup is gone; continuity fingerprinting is not.
Smallest fix: split the row: retrieval dedup gone; continuity fingerprint remains.

### F-I20-003 — No P0 found across 20 iterations. CONFIRMED. P2 (negative)
Nothing in this lineage is a live registered memory MCP, spec-memory launcher, or zvec lane serving operators today (F-I2-005, F-I3-001, F-I10-004, F-I16-002). The misses are leftover writers, leftover directories, weakened tests, doctor/CI names, and gates that pass while skipping. Those are P1/P2 under D6, not a secretly-running server.
Smallest fix: none. Do not escalate the leftover set to P0 without a live MCP registration.

### F-I20-004 — Synthesis input is complete for max-iterations. CONFIRMED. P2
Twenty iterations cover the seven charter angles. Convergence before 20 was treated as telemetry only. Remaining UNKNOWN: onnxruntime-common fresh install (F-I15-002); whether a full T011 sweep with untracked dirs is already scripted; attempt-1 stalled review report still missing (F-I1-006).
Smallest fix: record those as open questions in synthesis. Do not run validate.sh or generate-context.js from this lineage.

## Sources Consulted
- .opencode/skills/system-spec-kit/references/memory/memory-system.md:207-218
- Prior findings F-I5-006, F-I8-003/004, F-I11, F-I14-001, F-I18-002

## Assessment
- newInfoRatio: 0.25
- Novelty justification: loss-table versus leftover-writer contradiction is the wrap. No new file path beyond memory-system.md:207-218.
- Confidence: high on the contradiction. P0-negative is a judgment on the leftover set.

## Reflection
- Worked: stop at the loss table instead of grepping "memory" again.
- Failed: none.
- Ruled out: a hidden live memory MCP as the programme miss.

## Dead Ends
- Expanding every remaining `memory_*` SQL string without a caller (already covered by entity-extractor / legacy-lane / folder-detector).

## Recommended Next Focus
Synthesize `research.md` in this lineage. Do not save continuity.
