---
title: "Pre-Existing Findings Investigation [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/review/pre-existing-findings-investigation]"
description: "Read-only investigation of the 8 pre-existing findings the deep review flagged (real but not this session's authorship). Confirms ownership via git blame, characterizes root cause / trigger / exploitability for each, identifies a systemic read-then-unlink race class, and recommends disposition. No code changed."
trigger_phrases:
  - "code graph pre-existing findings investigation"
  - "launcher lock race class"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_DOC: review-report -->

# Pre-Existing Findings — Investigation (read-only)

> Investigates §4 of `review-report.md`: findings the deep review confirmed REAL but attributed to baseline / earlier commits / operator WIP — **not** this session's authorship. **Ownership verified via `git blame`**: every cited line blames to `michelkerkmeester-barter` (old pre-extraction paths) or non-session `MichelKerkmeester` commits (`57f6aa6`, `759bc3d`, `d5dbd39`, `e85fb49`, `c44f3ca`), never the session commits (`69e7bf12`/`4f1dc0ed`/`574267cf67`/`016f47b4`/`6f6c6595`). No code was modified.

---

## Systemic insight: one race class covers 3 of the 8

`DR-001-03`, `DR-008-02`, `DR-008-03` — and the already-fixed `DR-002-03` — are the **same bug**: a lease/lock file is **read, classified, then unlinked/deleted by path without re-verifying identity under exclusion**. A successor that acquires between the read and the unlink loses its file. One shared helper (identity-checked removal: re-read token immediately before unlink; or a lockdir/rename protocol) fixes all of them. This should be **one follow-on packet**, not four.

---

## Finding-by-finding

### 1. DR-001-03 — `releaseOwnerLease` unlocked read-then-unlink (P1, race class)
- **File:** `mcp_server/lib/owner-lease.ts:457-465`. **Owner:** `57f6aa6` (pre-session).
- **Confirmed:** reads holder → checks `ownerPid` → `unlinkSync(leasePath)` with **no mutation lock** (the CG-016/017 lock guards acquire/refresh, not release). A concurrent reclaim that writes a successor lease between the check and the unlink gets its lease deleted → owner left lease-less → split-brain.
- **Trigger:** owner exits/releases exactly while another launcher reclaims. **Exploitability:** not an attack; a rare concurrency window.
- **Fix:** wrap release in the owner-lease mutation lock + re-read identity (pid + startedAtIso) before unlink. Part of the race-class packet.

### 2. DR-008-02 — bootstrap-lock stale reclaim deletes a live successor (P1, race class)
- **File:** `.opencode/bin/mk-code-index-launcher.cjs:~727-730`. **Owner:** old `system-code-graph-launcher.cjs` (`c44f3ca`, pre-rename).
- **Confirmed:** `statSync` staleness check → `fs.rmSync(lockDir, …)` → `continue`. Between the check and the rmSync a successor can acquire the lockdir; rmSync then removes the **live** successor lock.
- **Mitigation (important):** the launcher's outer `writeLeaseFile()` + **lease re-probe** (`reprobe.pid !== process.pid → exit`) is the ultimate single-winner gate, so this race does **not** actually launch two servers — impact is bounded to lock churn, not split-brain.
- **Fix:** identity-checked reclaim (re-read lockdir mtime/owner immediately before rmSync, or rename-then-delete). Part of the race-class packet.

### 3. DR-008-03 — launcher `clearOwnerLeaseFile` read-then-unlink (P1, race class)
- **File:** `.opencode/bin/mk-code-index-launcher.cjs:~390-406`. **Owner:** `57f6aa6` (pre-session).
- **Confirmed:** `readOwnerLeaseFile()` → `if (lease.ownerPid === ownerLeasePid) unlinkSync()` — same read-then-unlink, no re-verify under lock.
- **Mitigation:** runs mostly on this process's own exit cleanup; window is small. **Fix:** same identity-checked removal. Part of the race-class packet.

---

### 4. DR-003-02 — `resolveCanonicalDbDir` creates dirs before the post-realpath reject (P1 sec → realistically P2)
- **File:** `mcp_server/lib/canonical-db-dir.ts:34-41`. **Owner:** `57f6aa6` / `759bc3d` (pre-session).
- **Confirmed:** the pre-check (`isWithinWorkspace(resolvedWorkspace, resolvedDir)`) is **lexical** (no symlink resolution); then `mkdirSync(resolvedDir, {recursive})` **creates the dirs**, and only **after** does `realpathSync.native` + the post-check reject a symlink escape. So a symlink-escaping path creates directories outside the workspace before being rejected.
- **Trigger:** requires `SPECKIT_CODE_GRAPH_DB_DIR` set to a symlink-escaping path. Per `database_path_policy.md` that override is "tests / disposable CI only" — **not a normal-use path**, so real-world likelihood is low.
- **Fix:** realpath-resolve and re-check **before** `mkdirSync` (or mkdir into a temp + validate + rename). Low urgency; security-correctness.

### 5. DR-008-01 — `/tmp` IPC socket dir trusted if pre-existing (P1 sec → realistically P2 on single-user)
- **File:** `mcp_server/lib/ipc/socket-server.ts:170-171`. **Owner:** `d5dbd39` (pre-session).
- **Confirmed (nuanced):** `mkdirSync(dirname(socketPath), {mode:0o700})` only applies `0700` **on creation** — a pre-existing `/tmp/mk-code-index` owned by another user with loose perms is **not** re-validated (owner/mode) before use. Note the socket **unlink** path *does* check `stat.uid === process.getuid()` (`canUnlinkExistingSocket`), so the worst abuse (unlinking a foreign socket) is already blocked; the **dir trust** is the residual gap.
- **Trigger:** multi-user host + attacker pre-creates `/tmp/mk-code-index`. **Exploitability:** medium on shared hosts, none on a single-user dev box.
- **Fix:** if the socket dir already exists, verify owner == current uid and mode has no group/other write before using it; else refuse or recreate.

---

### 6. DR-008-04 — idle-timeout watchdog disabled on shutdown failure (P2)
- **File:** `mcp_server/lib/ipc/launcher-idle-timeout.ts:106-116`. **Owner:** `e85fb49` (pre-session).
- **Confirmed:** on idle, `stopped=true` + `clearInterval(timer)` run **before** `await options.onIdle()`; if `onIdle()` throws it's logged but the timer is already gone → the watchdog never re-arms → a process that failed to shut down idles forever with no further attempts.
- **Fix:** on `onIdle()` failure, re-arm the timer (or schedule a bounded retry) instead of leaving `stopped=true`. Low impact (lingering idle process).

### 7. DR-001-01 — `code_graph_status` can throw before the degraded fallback (P1)
- **File:** `mcp_server/handlers/status.ts:204-208`. **Owner:** `michelkerkmeester-barter` (old pre-extraction path — clearly pre-session).
- **Confirmed:** `getGraphReadinessSnapshot()` + `getStoredCodeGraphScope()` + `parseIndexScopePolicyFromFingerprint()` run **outside** the `try` that guards `getStats()`. If the DB is corrupt/locked, these throw and `code_graph_status` returns a generic error instead of the intended degraded readiness envelope. (My CG-001 change moved the snapshot read earlier but did not introduce the unguarded scope read — those predate it.)
- **Fix:** wrap the snapshot/scope reads in the same degraded-envelope handling as `getStats()`. Improves diagnostics on a broken DB.

### 8. DR-010-01 — BUG-06 abort signal can't interrupt a monolithic parse phase (P1, operator WIP)
- **Files:** `lib/ensure-ready.ts:~540`, `lib/phase-runner.ts:~275`, `lib/structural-indexer.ts:~2137`. **Owner:** the active **BUG-06 cooperative-cancellation WIP** (not landed, not this session).
- **Confirmed:** `runPhases` checks `signal?.aborted` only at **phase boundaries**; a single long synchronous parse phase runs to completion regardless of the deadline. This is an inherent limit of phase-boundary cancellation, not a regression.
- **Disposition:** **operator-owned** — it's their in-flight feature. Options for them: add intra-phase signal checks inside the parse loop, or chunk the parse phase. Out of scope here.

---

## Disposition summary

| Finding | Real | Severity (reassessed) | Owner | Recommendation |
|---------|------|----------------------|-------|----------------|
| DR-001-03 / DR-008-02 / DR-008-03 | ✅ | P1 (bounded) | pre-session | **One race-class packet**: shared identity-checked lock/lease removal |
| DR-003-02 | ✅ | P2 (override-gated) | pre-session | Realpath-check before mkdir; low urgency |
| DR-008-01 | ✅ | P2 single-user / P1 multi-user | pre-session | Validate existing `/tmp` dir owner+mode |
| DR-008-04 | ✅ | P2 | pre-session | Re-arm watchdog on onIdle failure |
| DR-001-01 | ✅ | P1 (degraded-mode UX) | pre-session | Wrap scope/snapshot reads in degraded envelope |
| DR-010-01 | ✅ | P1 | **operator BUG-06 WIP** | Operator's call (intra-phase signal checks) |

**None block shipped work**; none were introduced this session. The highest-leverage action is the single race-class hardening packet (covers 3 findings + matches the DR-002-03 fix already landed). The two security items are real but gated (override-only / multi-user). DR-010-01 belongs to the operator's active feature.
