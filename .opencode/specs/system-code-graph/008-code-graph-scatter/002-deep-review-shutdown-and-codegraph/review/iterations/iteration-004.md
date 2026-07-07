# Iteration 004 — Spec-Alignment/Traceability

**Verdict:** CONDITIONAL | **Findings:** P0=0 P1=1 P2=1 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P1] SA-001 — completion-metadata-inconsistency  (confidence 0.9)
- **[SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/implementation-summary.md:84-94 (verification table); 22-23 (continuity completion_pct: 90 / next_safe_action)]** · finding_class: `docs-vs-code`
- **Evidence:**
```
Verification table rows all read 'Pending': `| node --check ../../../../bin/mk-spec-memory-launcher.cjs | Pending |` ... `| validate.sh --strict | Pending |`; and continuity frontmatter `completion_pct: 90` with `next_safe_action: "Run staged verification"`. Yet spec.md METADATA line 42 reads `| **Status** | implemented |` and impl-summary line 40 `| **Status** | implemented |`.
```
- **Why:** 009 claims 'implemented' status but its own verification evidence is entirely Pending and completion is 90%. The shipped code IS correct (verified: SIGHUP/SIGQUIT handlers at context-server.ts:1553-1558, closeDb-after-drain at 1452-1458, RESPAWN_REAP_GRACE_MS=7000 used at launcher 835-836), so the gap is unreconciled completion metadata, not a code defect. This violates the COMPLETION VERIFICATION RULE's metadata-reconciliation requirement: a packet marked implemented must not carry an all-Pending verification table and sub-100 completion_pct.
- **Fix:** Reconcile 009: either run/record the staged verification (node --check, build, vitest, regex, validate.sh) and fill the table with PASS rows + set completion_pct: 100, OR downgrade spec/impl Status to 'in-progress' until evidence exists.

### [P2] SA-002 — verification-evidence-gap  (confidence 0.85)
- **[SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/implementation-summary.md:117]** · finding_class: `matrix/evidence`
- **Evidence:**
```
Verification table: `| bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <010-folder> --strict | Pending |` while the packet header (line 42) asserts `Status | Implemented (... strict-validate 0/0)` and continuity `completion_pct: 100`.
```
- **Why:** Status line claims 'strict-validate 0/0' but the verification table row for validate.sh is still 'Pending' — an internal contradiction within the same doc about whether strict validation actually ran. Code-side claims (autocheckpoint 256 at vector-index-store.ts:1230 and :479, shard-before-main close order at 1305-1307, checkpointAllWal at 1313-1317, 300_000ms interval at context-server.ts:1994) are all verified present, so this is purely a stale evidence-table cell.
- **Fix:** Update 010 impl-summary line 117 to record the actual validate.sh --strict result (PASS / 0 errors) to match the header's '0/0' claim, or correct the header if it did not run.

## Coverage
COVERED: Full bidirectional traceability of packets 008, 009, 010 against on-disk code. Verified every concrete code claim. 008: close_db() runs wal_checkpoint(TRUNCATE) best-effort in try/catch before db.close() (vector-index-store.ts:1306-1308) — matches REQ-001/REQ-002/SC-001. 009: all four signal handlers SIGTERM/SIGINT/SIGHUP/SIGQUIT route to fatalShutdown(...,0) (context-server.ts:1547-1558) — matches REQ-001; closeDb runs AFTER awaited fileWatcher drain with invariant comment (1444-1458) — matches REQ-002/SC-002; closeDb precedes transport/ipcBridge/shutdownHooks/timers (1458 vs 1460/1467/1473/1476) — matches SC-002; launcher uses RESPAWN_REAP_GRACE_MS (imported from model-server-supervision.cjs:19 = 7000ms) at both wait paths (launcher:835-836) and SHUTDOWN_DEADLINE_MS=5000 (context-server.ts:1414) — matches REQ-003/SC-003; launcher forwards SIGHUP/SIGQUIT (launcher:848). 010: wal_autocheckpoint=256 on main (vector-index-store.ts:1230) and active_vec (:479) — matches REQ-002/SC-001/SC-002; synchronous=NORMAL preserved (:1229) — matches REQ-001; close order shard-TRUNCATE then main-TRUNCATE then detach then close (:1305-1309) — matches REQ-003/REQ-004/SC-003; checkpointAllWal() checkpoints both schemas (:1313-1317) and registered at 300_000ms unref after server.connect (context-server.ts:1993-1994) — matches REQ-005/SC-004. NOT VERIFIED: did not run the vitest/build/validate.sh suites myself (read-only review) — so the two findings flag the packets' OWN unreconciled verification tables (009 all-Pending despite 'implemented'; 010 validate.sh Pending despite '0/0' header claim), not test failures. Did not read the .vitest.ts test files or the 010 benchmark scratch script. No P0 code/spec contradictions found — code and spec intent align across all three packets.

Review verdict: CONDITIONAL
