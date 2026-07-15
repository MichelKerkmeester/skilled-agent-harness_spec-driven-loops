# Adversarial Fix Verification — L3 receipt trio + TTL (code) and L4 doc batch

> **Verifier:** Fable 5 (fresh context) · **Date:** 2026-06-12
> **Scope:** Batch 1 = uncommitted L3 idempotency code (tri-000/001/002/048); Batch 2 = uncommitted L4 doc-only batch (tri-082/094/095/096/097/149/165/167/185/187).
> **Method:** every claim re-read against the working-tree diff AND the current code it documents; tests run locally; line numbers re-derived.

---

## Verdicts

```
tri-000: CLOSED
tri-001: CLOSED
tri-002: CLOSED
tri-048: CLOSED   (replay-time validity deliberately deferred — recorded below)
tri-082: INCOMPLETE
tri-094: INCOMPLETE
tri-095: CLOSED
tri-096: CLOSED
tri-097: CLOSED
tri-149: CLOSED   (duplicate of tri-096)
tri-165: CLOSED   (duplicate of tri-096)
tri-167: CLOSED
tri-185: CLOSED
tri-187: CLOSED
```

**Roll-up: 12 CLOSED, 2 INCOMPLETE, 0 REGRESSION.** Both INCOMPLETEs are narrow residuals of otherwise-correct fixes, not failed fixes.

**Tests:** `npx vitest run tests/memory-idempotency-and-near-duplicate.vitest.ts tests/handler-memory-crud.vitest.ts` → **2 files, 40/40 passed** (run 2026-06-12, includes the 3 new tests: force-key divergence, conflict marking + fail-open, TTL prune window).

---

## Batch 1 — L3 idempotency evidence

### tri-000 — CLOSED

- `handlers/memory-save.ts:3474` adds `force: force === true` to the `requestFingerprint`. The field reaches key material: `deriveIdempotencyReceiptKey` (`lib/storage/idempotency-receipts.ts:87-102`) hashes the fingerprint into `requestFingerprintHash`, which is part of the `receiptKey` material (`:90-94`). A force-flipped retry now derives a different receipt key — proven by the new test ("derives a DIFFERENT receipt key when only force flips"), green.
- **Hunt for surviving same-class args (payload-only flags with legitimate retry semantics):**
  - `dryRun` / `plannerMode`: NOT exposed — dry-run returns at `memory-save.ts:3329`, and planner mode is excluded by the `!shouldPlanCanonicalSave` guard at `:3458`, both before the receipt pre-lookup. No receipt interaction.
  - `skipPreflight`: the realistic flip happens only after a preflight FAILURE, which throws before any receipt read/write and stores nothing (`shouldStoreMemorySaveReceipt` requires a non-error indexed/updated/deferred result, `idempotency-receipts.ts:104-114`). No false-conflict path for the real retry pattern.
  - `asyncEmbedding`, governance identity fields (`sessionId`, `tenantId`, etc.): payload-only; flipping one on a retry of a previously-successful identical save yields a fail-closed `idempotency_key_conflict` instead of a replay. Unlike pre-fix `force`, none of these represent "execute a NEW write" intent — the caller's mutation already landed and a byte-identical retry replays — so this is the intentional fail-closed PRE-lookup design, not the tri-000 class. **No surviving arg blocks an intentional write the way `force` did.** Noted as design-consistent, not a defect.

### tri-001 — CLOSED (semantics judged honest)

- Implementation verified: `markResponseWithReceiptStoreConflict` (`idempotency-receipts.ts:192-222`) patches `content[0]` only when it is parseable JSON text, adds `data.idempotencyStoreConflict` (`receiptKey`, `payloadHash`, `storedPayloadHash`) and a plain-language hint, and **fails open** (returns the response unmodified) on non-text/unparseable envelopes — covered by the new test's opaque-envelope assertion. Save-handler wiring: `memory-save.ts:3636-3641` on the lost-store `conflict` branch.
- **Semantics judgment:** the finding's complaint was *silent* divergence — the loser reported an unqualified success the receipt system would later contradict. Of the four options: an error response would lie (the mutation landed), replaying the winner would answer a different payload, and rollback from the post-mutation window is genuinely dangerous (embeddings, governance rows, and file writes have already happened; the rejection rationale is recorded in the function doc comment). Returning the loser's own response with a visible, machine-readable conflict block plus a hint that a later retry will replay/conflict against the canonical receipt is the honest remaining option. **The "silent" in "silent divergence" is closed; the divergence itself is inherent to the same-key/different-payload race and is now disclosed to the caller.** Verdict: closes the finding honestly.
- Micro-edge (recorded, not blocking): if the winner's receipt row vanishes between the lost store and the lookup (e.g. a racing TTL prune), `winner.status === 'miss'` falls through to the unmarked own response at `memory-save.ts:3645` — silent again. Window is vanishingly narrow (requires a ≥30-day-old receipt winning a store race milliseconds earlier).

### tri-002 — CLOSED

- `handlers/memory-crud-update.ts:553-567`: the store result is now checked (`const won = storeIdempotencyReceipt(...)`); lost + `replay` returns the winner (`:559-562`), lost + `conflict` returns the marked own response (`:563-565`) — an exact mirror of the save handler's semantics, per the tri-001 interlock requirement.
- Imports resolve: `lookupIdempotencyReceiptByKey` and `markResponseWithReceiptStoreConflict` added at `memory-crud-update.ts:31-36`; the suite (including `handler-memory-crud.vitest.ts`) compiles and passes 40/40.

### tri-048 — CLOSED, with the deliberate deferral recorded

- `pruneExpiredIdempotencyReceipts` (`idempotency-receipts.ts:231-246`): `DELETE FROM memory_idempotency_receipts WHERE updated_at < datetime('now', ?)` with `-<days> days`. Schema compatible: `updated_at TEXT NOT NULL DEFAULT (datetime('now'))` (vector-index-schema.ts, `ensureIdempotencyReceiptSchema`) — same lexicographically-comparable UTC format. New TTL test proves the window (45-day-old row pruned, fresh row replays).
- **Cannot block boot:** double-protected — the SQL runs inside the function's own try/catch (returns 0 on failure, e.g. table-missing on a degenerate DB), and the call site in `context-server.ts:1771-1775` (inside `registerInitTasks`, after `initializeDb()` at `:1754`) is wrapped in a second try/catch with an explicit best-effort comment. No await, no throw path to init failure.
- **Env parse:** `SPECKIT_IDEMPOTENCY_RECEIPT_TTL_DAYS` via `parseInt`; non-numeric/zero/negative env values fall back to the 30-day default; the explicit `ttlDays` parameter is floored at 1 (`Math.max(1, ...)`, `:236`). Minor asymmetry noted: env values < 1 revert to 30 rather than flooring to 1 — safe direction, recorded below.
- **Deferred item confirmed still open (as intended):** replay-time validity. `lookupIdempotencyReceiptByKey` (`idempotency-receipts.ts:123-144`) performs no check on `memory_id`; with `ON DELETE SET NULL`, a receipt pointing at a deleted memory still replays its stored response verbatim for up to the TTL window. This was deliberately deferred from this batch — recorded in Deferred Items, not lost.

---

## Batch 2 — L4 doc batch evidence

Each doc change was read against the launcher/manifest code it now describes, hunting specifically for NEW claims the code does not satisfy.

### tri-082 — INCOMPLETE

- **Fixed and code-verified:** `002-hardening-and-tests/spec.md:65` now appends "Addressed/superseded by later hardening: `mk-skill-advisor-launcher.cjs` now has a `.skill-advisor-owner.json` owner lease and bridges secondaries through the session proxy via `maybeBridgeLeaseHolder`; it still does not implement spec-memory's transparent recycle or detached re-election architecture." All three new claims hold: `OWNER_LEASE_FILE_NAME = '.skill-advisor-owner.json'` (`mk-skill-advisor-launcher.cjs:74`); `maybeBridgeLeaseHolder` is real and is the bridge path (`:693-699`, fallback inline definition `:150`, proxy `bridgeStdioThroughSessionProxy` `:207`); no transparent recycle / no detached re-election in the advisor launcher (zero `SPECKIT_DAEMON_REELECTION` matches). The retained "(default 2)" deep-probe clause is also accurate (`launcher-ipc-bridge.cjs:48`: attempts = 1 + retries, default retries 1).
- **Why INCOMPLETE:** the clause the L4 report explicitly flagged as wrong for this daemon — "re-election is gated by `SPECKIT_DAEMON_REELECTION`" — survives verbatim in the same bullet, and the closing instruction "Tests/drills MUST pin `SPECKIT_DAEMON_REELECTION`" remains. `rg SPECKIT_DAEMON_REELECTION .opencode/bin/mk-skill-advisor-launcher.cjs` → zero matches: the advisor launcher never reads that env, so the bullet now contradicts itself (gated-by X vs. does-not-implement re-election) and still directs test authors to pin a no-op variable. Residual is a one-sentence edit.

### tri-094 — INCOMPLETE

- **Fixed and code-verified:** `mcp_server/README.md:269` now reads "adopts it through the bridge when the recorded child is alive and bridgeable; reap + respawn runs only when that daemon is dead or unbridgeable"; `ENV_REFERENCE.md:179` mirrors it ("adopts the released daemon through the bridge … only reaps + respawns when that daemon is dead or unbridgeable"). This is exactly what the code does: `mk-spec-memory-launcher.cjs:1568-1577` (live `childPid` + `bridgeReadiness(...).ready` → "stale-reclaim adopting live daemon pid … via bridge instead of reaping"), with reap+respawn only on the dead/unbridgeable fall-through (`:1579-1604`).
- **Why INCOMPLETE:** the finding's fix scope explicitly included the in-code design comment carrying the same stale wording, and it is untouched: `mk-spec-memory-launcher.cjs:200` still says "A fresh session that finds the released daemon under a stale lease **reaps it before respawn**" — directly above `daemonReelectionEnabled()`, contradicting the adoption code 1,360 lines below it and both now-corrected docs. Residual is a two-line comment edit (code-file touch, which this doc-only batch avoided — but the finding stays open until it lands).

### tri-095 — CLOSED

- `mcp_server/README.md:262` (front-proxy recycle row) now carries: "Known gap: a replay after the primary insert but before secondary-index writes can append duplicate secondary-index rows because that path is not yet keyed by an idempotency token." This matches the source-of-truth comment in `.opencode/bin/lib/launcher-session-proxy.cjs:146-153` (primary-row dedup via content-hash + v28 active-row unique index; KNOWN GAP = secondary index; fix requires request-id threading, out of proxy scope) — the caveat is no longer discoverable only from a source comment. The retained "replayable because it relies on primary-row dedup" clause is accurate per the same comment.

### tri-096 / tri-149 / tri-165 — CLOSED (one rewrite, as banked)

- `system-code-graph/references/runtime/launcher_lease.md:37` rewritten: bridge-first through the session proxy, `LEASE_HELD_BY:<pid>` demoted to a fallback diagnostic for missing/refused sockets or disabled bridging, respawn path when the socket is confirmed dead, stale-reclaim sentence retained.
- **Every new claim verified in code:** bridge-first — `mk-code-index-launcher.cjs:893-907` (owner-lease holder) and `:910-914` (PID-lease holder) both route through `bridgeOrReportLeaseHeld`; session proxy is real (`bridgeStdioThroughSessionProxy` `:166`, wired at `:637`); fallback diagnostic is real (`writeLeaseHeldDiagnostic` `:536-540`, emitted on disabled/no-socket/superseded paths); **the respawn path really exists** — `respawnAfterDeadSocket` (`:579-622`), reached from the bridge decision at `:639-640` with `respawnChildPid` threaded from `launcherMain` (`:905`), guarded by the respawn lock and `reapOwnerBeforeRespawn` (`:551`). Stale-reclaim sentence still accurate (`:915-917`).
- **Sequencing-hazard check (the doc-fix failure mode):** the rewrite makes NO claim about lease-carried socket paths or owner-lease heartbeats, so it does not pre-claim the unshipped tri-030/032/043 code work. The PID-lease payload section (`launcher_lease.md:47-56`, `{pid, startedAt}`) remains accurate for the PID lease as shipped.
- Residual recorded (not blocking these verdicts): the doc still does not document the `.code-graph-owner.json` owner-lease sidecar payload/lifecycle (tri-149's secondary evidence), and a second pass is owed when tri-030/032/043 land.

### tri-097 — CLOSED

- `system-skill-advisor/references/runtime/daemon_lease_contract.md:46-49` rewritten: owner-lease sidecar + launcher PID lease combined; bridge through `maybeBridgeLeaseHolder` with `LEASE_HELD_BY` as fallback; guarded respawn on dead/refused socket. Failure-mode row (`:119`) and shared-DB contention row (`:133`) updated consistently.
- **Code-verified:** `maybeBridgeLeaseHolder` is the actual exported hook the launcher calls (`mk-skill-advisor-launcher.cjs:693-694`); the proxy bridge is `bridgeStdioThroughSessionProxy` (`:207`, passed at `:699`); the guarded respawn path is `respawnAfterDeadSocket` (`:608`, invoked at `:703`); owner lease `.skill-advisor-owner.json` (`:74`); both the owner-lease and PID-lease holders route through the bridge (`:712`, `:720`, `:739`, `:762`). No new claim exceeds the code.

### tri-167 — CLOSED

- `.opencode/bin/README.md:25` now says "default-on daemon re-election **for mk-spec-memory**" (was "experimental default-off"), which reconciles with `ENV_REFERENCE.md:179` ("default `1` set by the committed runtime configs … launcher's code default stays off"). Verified in all three committed runtime configs: `.mcp.json:17`, `opencode.json:28`, `.codex/config.toml:69` all set `SPECKIT_DAEMON_REELECTION` to `"1"`; the code default is off (`mk-spec-memory-launcher.cjs:204-206`, enabled only on `'1'`/`'on'`). The "for mk-spec-memory" scoping is also correct — neither sibling launcher reads the variable.

### tri-185 — CLOSED

- `.opencode/bin/README.md:87` adds the lifecycle parity note: spec-memory as the hardened reference (persistent launcher logging, detached re-election/adoption, owner-release-on-shutdown); code-index and skill-advisor "stop with their child and rely on fresh-session reload plus bridge/respawn paths instead."
- **Every clause code-verified:** `persistLauncherLogLine`/`SPECKIT_DAEMON_REELECTION`/`LAUNCHER_LOG` have zero matches in `mk-code-index-launcher.cjs` and `mk-skill-advisor-launcher.cjs`; both stop with their child (`mk-code-index-launcher.cjs:831-840`, `mk-skill-advisor-launcher.cjs:1148-1165` — child-exit → clear leases → `process.exit`); both have real bridge/respawn paths (`:579` / `:608` respectively). Shape note: a prose note rather than the suggested matrix table, but it states the asymmetry accurately — the finding's doc-only minimum is met.

### tri-187 — CLOSED

- `system-code-graph/changelog/v1.2.0.0.md:13` adds: "Correction (2026-06-12): the CLI does have an asserted manifest in `mcp_server/code-index-cli-manifest.ts`; command generation still uses the server tool definitions, but the manifest exists to lock the expected eight-tool surface."
- **All three claims code-verified:** `EXPECTED_TOOL_NAMES` lists exactly the eight tools (`code-index-cli-manifest.ts:10-19`); `assertCodeIndexCliManifest()` hard-fails on any mismatch (`:23-37`); `CODE_INDEX_CLI_TOOL_DEFINITIONS = CODE_GRAPH_TOOL_SCHEMAS` (`:21`) — command generation does derive from the server tool definitions.
- Accepted deviation, recorded: the L4 report recommended correcting the false sentence in place (the claim was wrong at publication, not later drift); the fix instead retains "no manifest to drift" at `:11` with the dated correction immediately below. The misleading effect is removed — a reader cannot take the false sentence away without reading its correction — so this closes the finding; flagging the shape difference for the record.

---

## Deferred / residual items (recorded so they are not silently lost)

1. **Replay-time receipt validity (from tri-048, deliberately deferred):** a receipt whose `memory_id` is NULL (memory deleted, `ON DELETE SET NULL`) or stale still replays its stored response verbatim until TTL expiry — `idempotency-receipts.ts:123-144` has no validity check. Design should follow the trio's settled conflict semantics. OPEN by intent.
2. **tri-094 residual:** stale "reaps it before respawn" design comment at `mk-spec-memory-launcher.cjs:200` (two-line comment edit; the reason tri-094 is INCOMPLETE).
3. **tri-082 residual:** "re-election is gated by `SPECKIT_DAEMON_REELECTION`" + "Tests/drills MUST pin `SPECKIT_DAEMON_REELECTION`" survive in `002-hardening-and-tests/spec.md:65` although the advisor launcher never reads that env (the reason tri-082 is INCOMPLETE).
4. **launcher_lease.md second pass owed:** the doc still omits the `.code-graph-owner.json` owner-lease payload/lifecycle; re-visit when the tri-030/032/043 code changes (lease socketPath + heartbeat) land, per the L4 sequencing hazard.
5. **TTL sweep scope (tri-048, minor):** the prune runs only at daemon init — a long-running warm daemon accumulates receipts until its next boot; and env values < 1 day fall back to the 30-day default rather than the 1-day floor (the floor applies to the explicit parameter path only). Both are safe-direction limitations of the shipped best-effort design.
6. **tri-001 micro-edge:** lost-store winner row pruned between store and lookup → `miss` fall-through returns an unmarked loser response (`memory-save.ts:3645`, `memory-crud-update.ts:567` region). Vanishingly narrow; note only.
