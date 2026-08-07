# Iteration 013 — Adversarial verify: F-A5-01 / F-A5-03 socket-tail TOCTOU (dimension: security)

## Dispatcher
- **Run:** 13 (pre-assigned parallel slot; canonical `deep-review-state.jsonl` is reducer-lagged at runs 1-2 — see Edge Case 1)
- **Mode:** review (read-only — verdicts only, no code modification)
- **Dimension:** security
- **Angle:** A5-verify (adversarial verification of F-A5-01 P1 + F-A5-03 P2 from iter 6)
- **Budget profile:** adjudicate (target 8-10 tool calls; referee work + exploit-trace construction + fork byte-equality)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`, base `f05bdac2cf`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-013.md` + `deltas/iter-013.jsonl`. Did NOT touch `deep-review-state.jsonl`, `deep-review-strategy.md`, findings-registry, or config.

## Files Reviewed
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` — re-read the full bind sequence with the adversarial lens. **NEW evidence vs iter 6:** the bind-time directory hardening fence at **lines 244-260** (`mkdirSync mode:0o700` + post-mkdir `statSync` uid/mode refusal) — iter 6 acknowledged this fence but under-weighted it as a "directory-only" check; this pass proves it is the decisive severity hinge. Verified by direct Read. **In-range** (`3d1667dd68`).
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` — the F-003 fork. `diff -q` + **`shasum -a 256` both = `ab625f473c0054dfe77557b488e23396bd2877917c476be4a6a45c902c831239`** → BYTE-IDENTICAL. Both copies inherit the verdict below. **In-range.**
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:40-67` (`defaultDbDirForService`, `getIpcSocketPath`) — the actual socket-dir resolver every launcher calls. Verified by direct Read. **In-range** (A1 surface).
- `.opencode/bin/worktree-session.sh:108-155` — the worktree wrapper that sets `SPECKIT_IPC_SOCKET_DIR`. Verified by direct Read. **In-range** (operator tooling).
- `.opencode/bin/mk-spec-memory-launcher.cjs:82,228` / `mk-code-index-launcher.cjs:195,201` / `mk-skill-advisor-launcher.cjs:181` — db-dir creation mode (`mkdirSync 0o700`). Verified by Read/Grep. **In-range.**
- `.opencode/skills/system-spec-kit/constitutional/memory-db-file-topology.md:37` + `006-mcp-launcher-concurrency/011/tasks.md` T004-T006 — the **shipped deployment guarantee** that iter 6 could not resolve from the diff. Read-only context (resolves the `downgradeTrigger`).

## Findings — New
No net-new findings this pass — this is an adversarial-verification iteration. It RE-ADJUDICATES two carried findings and downgrades one. Refinement of an existing P1 → P2.

### P0 Findings
None.

### P1 Findings
None new. **F-A5-01 is DOWNGRADED out of P1 → P2** (see verdict below).

### P2 Findings

1. **[DOWNGRADE from P1] Socket-tail TOCTOU on fresh bind is real at the code level but is NOT a reachable cross-uid hijack — the bind-time directory fence (`:244-260`) converts every cross-uid attempt into a refuse-to-bind DoS, leaving only a same-uid self-race** -- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:238,355,335,163` (the TOCTOU surface) gated by `:244-260` (the decisive fence) and the byte-identical fork `system-code-graph/mcp_server/lib/ipc/socket-server.ts` -- **All iter-6 code facts are CONFIRMED**: `path.resolve(socketPath)` at :238 does not deref symlinks; `chmodSync(socketPath,0o600)` at :355 follows symlinks; the `lstatSync` hijack fence (`canUnlinkExistingSocket` :147-179, lstat at :163) runs ONLY on the EADDRINUSE reclaim branch (:335), never on fresh bind; `/tmp` is an allowed root (:118-124) and the **shipped** convention is `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` (constitutional topology :37; commit `9ae9a6f4e` T004-T006). **What iter 6 under-weighted:** before `listen()`, fresh bind runs `mkdirSync(socketDir,{recursive:true,mode:0o700})` (:244) then `statSync(socketDir)` and **THROWS if `st.uid !== process.getuid()` (:251) OR `(st.mode & 0o022) !== 0` (:254)**. The exploit needs an attacker-writable `socketDir` to plant the tail; but (a) if the daemon wins the create race, the dir is 0700 daemon-owned and no other uid can write the tail inside it; (b) if the attacker pre-creates the dir, `mkdirSync(recursive)` is a **no-op** (empirically verified: an existing 0777 dir stays 0777, never re-chmod'd), so the stat fence sees foreign uid (:251) or `mode & 0o022` (:254) and **refuses to bind**. Net: the symlink tail is only ever *followed* when `socketDir` is daemon-owned-0700 — i.e. only the **same uid** can plant it (the daemon's own user), which is no privilege boundary. The cross-uid case degrades to a **DoS** (daemon refuses to start), not a chmod-of-arbitrary-target or a socket hijack. Real residual severity = P2 (defense-in-depth: close the same-uid self-race + the contested-subdir DoS by `lstat`-rejecting a symlink tail on fresh bind, and `open(O_NOFOLLOW)`+`fchmod` instead of `chmodSync`).
   - Finding class: defect-defense-in-depth (TOCTOU hardening gap; not a reachable cross-trust-boundary exploit)
   - Scope proof: `socket-server.ts` in-range (`3d1667dd68`); fence at :244-260 is unconditional on the unix-socket fresh-bind path (guarded only by the `!startsWith('tcp://')` at :242); empirically confirmed `mkdirSync(recursive,0o700)` does not re-chmod an existing dir; code-graph fork sha256-identical → identical posture in both consumers.
   - Affected surface hints: on fresh bind, `lstatSync(socketPath)` and reject `isSymbolicLink()` before `listen()` (mirror the reclaim fence); replace `fs.chmodSync(socketPath,0o600)` (:355) with `open(socketPath, O_NOFOLLOW)` + `fchmodSync` so the 0o600 step cannot follow a planted symlink; bind into the daemon-exclusive 0700 dir only after re-asserting its mode (the fence already does the uid/mode check — extend it to the tail node).

   ```json
   {
     "id": "F-A5-01",
     "type": "toctou-symlink",
     "claim": "iter-6 claim re-tested: the fresh-bind path follows a planted symlink tail and chmods its target, bypassing the lstat fence. CONFIRMED at the code level, but the bind-time directory fence (:244-260) makes every cross-uid plant either impossible (daemon-owned 0700 dir) or a refuse-to-bind DoS (foreign-uid/world-writable dir caught by :251/:254), so the symlink is only ever followed in a same-uid self-race — not a cross-trust-boundary exploit.",
     "confirmed": "partial",
     "finalSeverity": "P2",
     "previousSeverity": "P1",
     "evidenceRefs": ["shared/ipc/socket-server.ts:238 (path.resolve, no realpath) CONFIRMED","shared/ipc/socket-server.ts:355 (chmodSync follows symlink) CONFIRMED","shared/ipc/socket-server.ts:163 (lstat only in canUnlinkExistingSocket) CONFIRMED","shared/ipc/socket-server.ts:335 (fence gated on EADDRINUSE reclaim) CONFIRMED","shared/ipc/socket-server.ts:244-260 (NEW: mkdirSync 0o700 + statSync uid/mode refusal — the decisive fence)","launcher-ipc-bridge.cjs:40-67 (socketDir = in-workspace db dir by default; never bare /tmp)","worktree-session.sh:110,148 (override = $HOME/.spk-wt-sock/<slug>, mkdir -p, never bare /tmp)","constitutional/memory-db-file-topology.md:37 + 006/011 tasks T004-T006 commit 9ae9a6f4e (shipped convention = /tmp/<service> subdir)","empirical: mkdirSync(recursive,0o700) is a no-op on an existing 0777 dir — does NOT re-chmod"],
     "exploitTrace": "ATTEMPTED cross-uid hijack, BLOCKED. Precondition: socketDir = /tmp/mk-spec-memory (a subdir of world-writable /tmp), not yet existing (fresh boot / post-reaper). Step 1 attacker (uid_B != daemon uid_A) pre-creates /tmp/mk-spec-memory and plants symlink daemon-ipc.sock -> /etc/victim. Step 2 daemon (uid_A) starts: mkdirSync(/tmp/mk-spec-memory,{recursive,mode:0o700}) is a NO-OP because the dir exists (verified: existing mode preserved). Step 3 statSync(/tmp/mk-spec-memory): st.uid == uid_B != uid_A -> THROW at :251 -> daemon REFUSES to bind. Outcome = DoS, NOT hijock; chmod at :355 is never reached. ALT precondition: attacker makes /tmp/mk-spec-memory world-writable (uid match impossible without owning it, but if somehow group/world-writable) -> (st.mode & 0o022) != 0 -> THROW at :254 -> refuse to bind. ONLY-FOLLOWED case: dir is daemon-owned-0700 (daemon won the create race) -> no other uid can create the tail inside a 0700 dir -> the planter must BE uid_A (same uid) -> same-uid self-TOCTOU, no privilege boundary crossed. Severity hinge resolved: cross-uid = DoS-only (P2-class availability), same-uid = no boundary (defense-in-depth). NOT the P1 privilege/hijack model.",
     "counterevidenceSought": "Hunter pushed: 'bare /tmp is an allowed root and the convention literally uses /tmp/<service>'. CONFIRMED the convention (topology :37, T004-T006). Skeptic: but socketDir is the /tmp/<service> SUBDIR, not bare /tmp; the fence at :251/:254 applies to that subdir. Tested mkdirSync no-op empirically (existing 0777 dir unchanged). Tested foreign-uid path (st.uid 501 vs cur 501 demo; logic: !=  -> throw). Confirmed no launcher ever sets socketDir = bare /tmp (rg: only docs/playbooks set /tmp/<service>; default db dir is in-workspace; worktree override is $HOME/.spk-wt-sock). Confirmed /tmp on this host is 0755 (not even world-writable) — the worst-case model assumed a 1777 /tmp and STILL the subdir fence blocks it.",
     "alternativeExplanation": "iter-6 alt 'the 0700 mkdir + dir-ownership check makes socketDir attacker-proof' was REJECTED by iter-6 on the lazy-create race. This pass RE-ACCEPTS it: the post-mkdir statSync fence (:248-260) is the real guard, and it runs on EVERY fresh bind, not only on first-ever create. Because mkdirSync(recursive) is a no-op on an existing dir, a pre-planted attacker dir keeps its foreign uid / writable mode and is rejected at :251/:254 BEFORE listen()/chmod. The lazy-create window iter-6 worried about closes here: there is no bind that proceeds past a foreign-owned or world-writable socketDir.",
     "confidence": 0.85,
     "downgradeTrigger": "RESOLVED toward P2. Re-escalate to P1 ONLY if a deployment is found that (a) sets socketDir to a path whose PARENT the daemon does not exclusively own AND (b) somehow bypasses the :251/:254 fence (e.g. a future code change that drops the statSync, or a uid-0 daemon where st.uid checks are vacuous). None found this pass."
   }
   ```

2. **[CONFIRM P2, no change] Fail-open canonicalization returns the non-canonical resolved path on any realpath error, weakening `isWithinAllowedSocketRoot`** -- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:94-98` and the byte-identical fork -- CONFIRMED unchanged: `canonicalizePath` wraps `fs.realpathSync.native(current)` in `try { ... } catch { return resolved; }` (:94-98). On EACCES/EIO/ELOOP (anything but the ENOENT the existence loop at :86-93 already handles) it returns the literal `path.resolve` output, which `isWithinAllowedSocketRoot` (:126-128) then prefix-compares — a candidate whose canonical form lands outside the allowed roots can pass when realpath silently failed. Severity HOLDS at P2: it requires a realpath failure to coincide with a symlinked-ancestor escape, and it is gated behind the same bind-time uid/mode fence as F-A5-01, so it never independently grants a cross-uid hijack. The fail-open *direction* (return non-canonical instead of failing closed) remains the wrong default for a security boundary and should be fixed alongside F-A5-01.
   - Finding class: defect-fail-open (weakened containment boundary; defense-in-depth)
   - Scope proof: in-range; bare `catch { return resolved; }` at :96-98 returns the non-canonical path; `isWithinAllowedSocketRoot` (:126-128) is the sole containment gate and consumes it at :134-135; fork sha256-identical.
   - Affected surface hints: on realpath failure, fail CLOSED (reject the bind); or distinguish ENOENT (already handled by the existence loop) from EACCES/EIO/ELOOP and treat the latter as a hard error.

   ```json
   {
     "id": "F-A5-03",
     "type": "fail-open-canonicalization",
     "claim": "iter-6 claim re-tested: canonicalizePath catches all realpath errors and returns the non-canonical resolved path, so a realpath failure on a symlinked ancestor lets a candidate bypass isWithinAllowedSocketRoot. CONFIRMED unchanged; severity holds at P2 because the downstream bind-time uid/mode fence still has to pass.",
     "confirmed": "yes",
     "finalSeverity": "P2",
     "previousSeverity": "P2",
     "evidenceRefs": ["shared/ipc/socket-server.ts:94-98 (bare catch returns resolved) CONFIRMED","shared/ipc/socket-server.ts:86-93 (existence loop handles ENOENT, narrows catch to EACCES/EIO/ELOOP)","shared/ipc/socket-server.ts:126-128 (isWithinAllowedSocketRoot sole gate) CONFIRMED","shared/ipc/socket-server.ts:244-260 (downstream uid/mode fence still gates the bind)","system-code-graph fork sha256-identical"],
     "exploitTrace": "A realpath failure (EACCES/EIO/ELOOP) on a symlinked ancestor of socketDir lets a non-canonical path pass isWithinAllowedSocketRoot. But the bind then still runs the :248-260 statSync fence on the (resolved-but-non-canonical) socketDir; a foreign-owned or world-writable dir is still rejected. So the fail-open widens the allowed-root surface but does not by itself yield a cross-uid bind — confirming P2, not P1.",
     "counterevidenceSought": "Checked the existence loop (:86-93) already covers ENOENT (the only common realpath failure), narrowing the catch to rarer EACCES/EIO/ELOOP — narrows but does not eliminate the fail-open. Confirmed no second containment check downstream of canonicalizePath, but the uid/mode fence (:248-260) is an independent later gate that bounds the blast radius.",
     "alternativeExplanation": "realpath only fails on ENOENT in practice (handled by the loop), making the catch near-dead. Partially accepted (why it is P2 not P1), but the fail-open direction stays the unsafe default and EACCES/EIO/ELOOP remain reachable, so it stays an actionable P2.",
     "confidence": 0.75,
     "downgradeTrigger": "If realpath provably cannot fail with anything but ENOENT for the daemon's own socket dir across all supported deployments, this is advisory-only."
   }
   ```

## Traceability Checks
- **Iteration number:** canonical `deep-review-state.jsonl` has only 2 `type:"iteration"` lines on disk (runs 1-2) — the reducer has not folded the per-iteration `deltas/iter-NNN.jsonl` (iters 1-10 present) back into shared state. Dispatch pre-assigned run 13 + `iteration-013.md` + `deltas/iter-013.jsonl`. Honored the dispatch slot (parallel-safety contract) over the JSONL-derived number; recorded as Edge Case 1.
- **Range integrity:** HEAD `12de3d3a7e`, base `a9e9bdb0a5^` = `f05bdac2cf` (consistent with iters 1-6).
- **Provenance:** `socket-server.ts` hardening in-range `3d1667dd68`; `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` shipped in-range-adjacent `9ae9a6f4e` (006/011 T004-T006); the verified facts are all current-tree (HEAD).
- **Lineage:** sessionId `2026-06-05T11:16:17Z`, generation 1, lineageMode new — consistent across config/state.

## Integration Evidence
- **`launcher-ipc-bridge.cjs:getIpcSocketPath` (named):** `defaultDbDirForService` (:40-57) returns in-workspace db dirs (`<repo>/.opencode/.../database`) for all three services; `getIpcSocketPath` (:59-67) sets `socketDir = SPECKIT_IPC_SOCKET_DIR || dbDir`, then `path.join(socketDir, 'daemon-ipc.sock')`. **No code path produces bare `/tmp` as `socketDir`** — it is always a service-specific subdir or an in-workspace dir.
- **`worktree-session.sh:110,148,151` (named):** the only in-tree setter of `SPECKIT_IPC_SOCKET_DIR` points it at `$HOME/.spk-wt-sock/<runtime>-<slug>`, created via `mkdir -p` (line 148). `worktree-reaper.sh:100-101` owns its lifecycle. Confirms the override is a $HOME subdir, not world-writable `/tmp`.
- **`constitutional/memory-db-file-topology.md:37` + `006/011 tasks T004-T006` (named):** the SHIPPED runtime-config convention is `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` (commit `9ae9a6f4e`). This is the closest deployment gets to "/tmp" — and it is a SUBDIR of /tmp, so the :251/:254 fence applies to the subdir. This is the evidence iter-6 Edge Case 2 said it "could not determine from the diff"; now resolved.
- **code-graph socket-server fork (named, F-003 overlap):** `shasum -a 256` both = `ab625f473c...c831239` → BYTE-IDENTICAL. The downgraded F-A5-01 (P2) and confirmed F-A5-03 (P2) exist identically in both consumers; any fix must reach both (F-003 drift hazard persists, now with a P2 not P1 payload).

## Edge Cases
1. **Iteration-number vs slot ambiguity (resolved toward dispatch):** JSONL-derived next iteration = 3 (2 iteration lines in canonical state), but the deltas dir already holds iters 1-10 and dispatch pre-assigns run 13. Safest in-scope interpretation: write the assigned slot (13) to avoid clobbering a peer's iteration and let the reducer reconcile ordering. The canonical JSONL being reducer-lagged is a state-integrity observation for the orchestrator, not a blocker for this read-only verify pass.
2. **`/tmp` mode on the review host is 0755, not the worst-case 1777:** the adversarial analysis assumed the worst case (a multi-tenant 1777 `/tmp`) and STILL found the subdir fence (:251/:254) blocks the cross-uid plant. So the verdict does not depend on this host's benign `/tmp` mode — it holds on a hostile-`/tmp` host too.
3. **Same-uid residual is not zero, just not a privilege boundary:** on a daemon-owned 0700 socketDir, a same-uid process could still race a symlink tail in the window between `mkdirSync`/`statSync` and `listen()`/`chmodSync`. That is a real but P2-class self-TOCTOU (the attacker already has the daemon's privileges), which is why the finding lands at P2 hardening rather than being fully ruled out.
4. **F-003 drift hazard unchanged:** the byte-identical fork means the (now P2) defect lives in both copies; the missing CI byte-equality guard (F-003, iter 2) still means a one-sided fix would silently diverge. Carry-forward to A6 (iter 12 maintainability) is unaffected — payload severity drops P1→P2 but the drift-guard rationale stands.

## Confirmed-Clean Surfaces
- **Bind-time directory fence (`socket-server.ts:244-260`):** CLEAN and decisive for the cross-uid hijack model. `mkdirSync(0o700)` + post-mkdir `statSync` refusal on foreign uid (:251) or `mode & 0o022` (:254) converts every cross-uid socketDir into a refuse-to-bind DoS before `listen()`/`chmod` are reached. This is the guard that downgrades F-A5-01 to P2. (Residual: it checks the directory, not the tail node, so a same-uid tail-race survives — the P2 hardening gap.)
- **`getIpcSocketPath` / launcher socket-dir resolution (`launcher-ipc-bridge.cjs:40-67`):** CLEAN — no path produces a bare world-writable `/tmp` socketDir; default is in-workspace, override is `/tmp/<service>` subdir or `$HOME/.spk-wt-sock/<slug>`.

## Ruled Out
1. **F-A5-01 as a P1 cross-uid socket-hijack / arbitrary-target-chmod:** RULED OUT at P1. Hunter: "fresh bind follows a planted symlink and chmods its target on a world-writable /tmp/<service>." Skeptic: the bind-time statSync fence (:248-260) refuses any socketDir not daemon-owned-and-0700; a pre-planted attacker dir is a mkdirSync no-op and is caught at :251/:254 (empirically verified the no-op). Referee: cross-uid attempt = refuse-to-bind DoS (availability, P2-class), never a hijack; the only path that follows the symlink needs a daemon-owned 0700 dir writable only by the same uid → no privilege boundary. Verdict: downgrade to P2 defense-in-depth. (DoS-on-contested-subdir is itself only a nuisance, since the contested name is the daemon's own service dir.)
2. **F-A5-03 escalation to P1:** RULED OUT. The fail-open widens the allowed-root check, but the downstream uid/mode fence (:248-260) still independently gates the bind, so the fail-open cannot by itself yield a cross-uid bind. Holds at P2.

## Next Focus
- **Dimension:** security (adversarial-verify track)
- **Focus area:** Re-adjudicate F-002 (EPERM owner-lease un-reclaimable, P1) and F-004 (reclaim durability, P2) under the same skeptic discipline applied here — confirm whether the EPERM-before-heartbeat ordering (`mk-spec-memory-launcher.cjs:339-348`) is reachable in a real cross-session reap or whether a later gate neutralizes it (mirror of the fence discovery here).
- **Reason:** This pass showed that a code-level TOCTOU can be neutralized by a downstream gate iter-6 under-weighted; the same "is there a later gate?" question should be applied to the carried correctness P1 (F-002) before it converges as a release blocker.
- **Rotation status:** security-verify 1 of N (A5 settled: F-A5-01 P1→P2, F-A5-03 P2 confirmed; F-003 fork byte-identity re-confirmed sha256). Correctness-verify (F-002/F-004) queued.
- **Blocked/productive carry-forward:** Productive. Do NOT retry F-A5-01 as a cross-uid P1 (BLOCKED — the :248-260 fence makes it DoS-only / same-uid). DO keep F-A5-01 + F-A5-03 as a paired P2 hardening item (lstat-reject symlink tail on fresh bind + O_NOFOLLOW fchmod + fail-closed canonicalization), and keep F-003's drift-guard need (now a P2 payload in both forks).
- **Required evidence for next:** `mk-spec-memory-launcher.cjs` classifyOwnerLease ordering (:339) vs heartbeat-staleness gate (:346-348) vs acquireOwnerLeaseFile bucketing (:361); whether any caller ages out an EPERM lease via 2xTTL before treating it as live.
