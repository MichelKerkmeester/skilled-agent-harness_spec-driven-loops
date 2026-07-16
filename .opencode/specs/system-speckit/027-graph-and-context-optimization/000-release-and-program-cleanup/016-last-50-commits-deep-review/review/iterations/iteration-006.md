# Iteration 006 — Security / A5 security & input robustness (dimension: security)

## Dispatcher
- **Run:** 6 (pre-assigned parallel slot; see Edge Case 1 on JSONL-derived numbering)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** security
- **Angle:** A5 security & input robustness
- **Budget profile:** verify (target 11-13 tool calls; evidence rereads + adversarial P0 testing)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`, base `f05bdac2cf`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-006.md` + `deltas/iter-006.jsonl`. Did NOT touch `deep-review-state.jsonl`, `deep-review-strategy.md`, findings-registry, or config.

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` — CLI entry-guard (lines 459-473), `validateFolder` export (line 365), `collectKnownSessionIds` filesystem walk (lines 292-321), `detectLevel`/`readIfExists` (lines 66-93). Verified by direct Read. **In-range** (`git diff --name-only`).
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` — `canonicalizePath` (lines 77-99), `isWithinRoot` (101-110), `resolveIpcSocketPath` (130-141), `canUnlinkExistingSocket` (143-179), dir uid/mode hardening + bind sequence (235-359). Verified by direct Read. **In-range** (added/hardened by `3d1667dd68`).
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` — full 402-line fork (the F-003 copy). `diff -q` vs shared = **BYTE-IDENTICAL**; shares every A5 posture below. **In-range.**
- `.opencode/skills/system-spec-kit/mcp_server/api/index.ts` — re-exports `validateFolder` (lines 78-83). Read for the entry-guard-bypass reachability question. **NOT in-range** as a content change (export predates range; last touched by the `6647661f32` plural-rename). Treated as read-only context.
- `.opencode/skills/system-spec-kit/shared/utils/path-security.ts` — `validateFilePath` (lines 18-108). Read for coverage. **NOT in-range** (unchanged by the 50 commits). Treated as read-only context; no in-range finding asserted against it.

## Findings — New

### P0 Findings
None. The charter's A5 P0 candidate — "validator entry-guard bypass via programmatic `validateFolder()` import" — was adversarially tested and is **NOT a security vulnerability** (see Ruled Out #1). The socket-tail TOCTOU was tested against a real privilege-escalation/hijack model and lands at P1 (the existing uid/mode/lstat fences bound the blast radius to same-uid / DoS), not P0.

### P1 Findings

1. **Socket bind path is never canonicalized before `listen()`/`chmod` — a symlink planted at the resolved socket tail is followed, defeating the unlink-hijack fence (tail-symlink TOCTOU)** -- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:238` (with `:355`, `:130-141`, `:147-179`) and the byte-identical fork `system-code-graph/mcp_server/lib/ipc/socket-server.ts:238` -- The bind path is computed as `path.resolve(options.socketPath)` (line 238) — `path.resolve` normalizes `..` and `.` but does **not** dereference symlinks. `resolveIpcSocketPath` (130-141) canonicalizes only the socket **directory** via `canonicalizePath`, and `canonicalizePath` itself (77-99) realpaths only the nearest *existing ancestor* and re-appends the **raw, un-canonicalized tail** (`SOCKET_FILE_NAME = daemon-ipc.sock`, line 16). So if an attacker (or a benign racing process) plants a symlink at `<socketDir>/daemon-ipc.sock` pointing outside the allowed root, three things follow it: (a) the bind itself — `net.Server.listen(socketPath)` on a symlinked path; (b) `fs.chmodSync(socketPath, 0o600)` at line 355 — **chmod follows symlinks**, so the daemon chmods the symlink *target*; (c) the close-path `fs.unlinkSync(socketPath)` (378) — unlink does NOT follow, so it removes the symlink, not the target, leaving the chmod'd target altered. The `canUnlinkExistingSocket` fence (147-179) DOES `lstatSync` (line 163, no-follow) and rejects non-sockets / foreign-uid nodes — but that fence is only consulted on the **EADDRINUSE reclaim branch** (335). On a clean first bind (no pre-existing node, the common case the planted symlink targets) the fence never runs, and the dir uid/mode check (249-256) guards the *directory* not the *tail node*. Net: the documented anti-hijack hardening protects the directory and the stale-reclaim path but leaves the fresh-bind socket-tail unprotected against a symlink swap between `resolveIpcSocketPath` and `listen()`/`chmod`.
   - Finding class: defect (TOCTOU / symlink-following on a privileged fs op)
   - Scope proof: `socket-server.ts` is in-range (`git log a9e9bdb0a5^..HEAD` → hardened by `3d1667dd68`); line 238 uses `path.resolve` (no realpath); line 355 `chmodSync(socketPath,...)` follows symlinks; `lstatSync` exists only at line 163 inside `canUnlinkExistingSocket`, gated behind the EADDRINUSE branch (335). code-graph fork `diff -q` BYTE-IDENTICAL → same defect in both consumers (compounds F-003).
   - Affected surface hints: canonicalize the *full* socket path (realpath/lstat the tail) before `listen()`; or `lstatSync(socketPath)` + reject `isSymbolicLink()` on the fresh-bind path too (not only on reclaim); or use `fs.lchmod`-style no-follow semantics / open-then-fchmod for the 0o600 step; or bind into an `O_NOFOLLOW`-protected dir the daemon exclusively owns.

   ```json
   {
     "id": "F-A5-01",
     "type": "toctou-symlink",
     "severity": "P1",
     "claim": "The fresh-bind path resolves the socket tail with path.resolve (no symlink dereference) and then chmods it, so a symlink planted at <socketDir>/daemon-ipc.sock is followed by listen() and chmod, bypassing the lstat-based unlink-hijack fence which only runs on the EADDRINUSE reclaim branch.",
     "evidenceRefs": ["shared/ipc/socket-server.ts:238 (path.resolve, no realpath)","shared/ipc/socket-server.ts:355 (chmodSync follows symlink)","shared/ipc/socket-server.ts:77-99 (canonicalizePath re-appends raw tail)","shared/ipc/socket-server.ts:163 (lstatSync only inside canUnlinkExistingSocket)","shared/ipc/socket-server.ts:335 (fence gated behind EADDRINUSE)","system-code-graph/.../socket-server.ts:238 (byte-identical fork)"],
     "counterevidenceSought": "Checked whether the dir uid/mode guard (249-256) covers the tail — it stats socketDir (parent) only. Checked whether canUnlinkExistingSocket runs on fresh bind — it runs only on the EADDRINUSE catch (335), not the first listenOnce (308). Checked chmod no-follow — Node fs.chmodSync follows symlinks (no lchmod used). Confirmed os.tmpdir()/'/tmp' are allowed roots (118-124), and /tmp is a world-writable sticky dir where a same-host attacker can pre-create the tail before the daemon binds.",
     "alternativeExplanation": "The 0o700 mkdir + dir-ownership check makes the socketDir attacker-proof, so no one can plant a tail inside it. Rejected for the /tmp case: when SPECKIT_IPC_SOCKET_DIR=/tmp/<service> and the service dir does not pre-exist as same-uid-owned, OR on the documented short-/tmp fallback, the parent (/tmp) is world-writable+sticky; a same-host local attacker who wins the create race plants the symlink tail before the daemon's mkdir/stat sees an owned dir. Sticky-bit blocks deleting others' files but not pre-creating a node at a not-yet-existing name. Same-uid only (local attacker), so privilege escalation is bounded — hence P1 not P0.",
     "finalSeverity": "P1",
     "confidence": 0.7,
     "downgradeTrigger": "If deployment guarantees SPECKIT_IPC_SOCKET_DIR is always a pre-created daemon-owned 0700 dir (never bare /tmp) AND the host is single-tenant (no untrusted local users), drop to P2 hardening. If a test/guard already lstat-rejects a symlink tail on fresh bind (none found this pass), drop to P2."
   }
   ```

### P2 Findings

2. **`validateFolder` walks `_memory` lineage across the whole `.opencode/specs` tree on every strict validation with no node/time/depth bound — DoS-amplification on a large or adversarially-deep tree** -- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:292-321` (`collectKnownSessionIds`, reached from `validateSpecDocRule` `:328` → `validateFolder` `:380`) -- When validating any folder under `.opencode/specs`, `collectKnownSessionIds` rewinds to the `.opencode/specs` root (293-297) and does an **unbounded DFS over the entire specs subtree**, `readFileSync`-ing every `*.md` and regex-scanning it for session ids (302-317). There is no max-node count, no time budget, and no max-depth cap; the only prunes are `node_modules`/`.git`/`scratch` (311). On the current repo this is already 2161+ changed files this range and a multi-hundred-doc specs tree, so every `--strict` validation re-reads the whole corpus. A caller who can create folders/files under `.opencode/specs` (the normal write surface) can inflate this into an O(total-md-bytes) scan per validation; combined with the programmatic `validateFolder` API export (api/index.ts:79) it is a cheap amplification primitive. Not a memory-corruption/auth issue — pure resource-exhaustion — hence P2.
   - Finding class: defect (unbounded resource consumption / DoS amplification)
   - Scope proof: `orchestrator.ts` is in-range; the walk loop (300-319) has no count/time/depth guard; `collectKnownSessionIds` is called unconditionally for the `FRONTMATTER_MEMORY_BLOCK` rule on every `validateFolder` (380). `validateFolder` is also exported programmatically (`api/index.ts:78-83`), widening the trigger surface beyond the CLI.
   - Affected surface hints: cap the walk (max nodes / max files read / max wall-clock), short-circuit once all packet `parent_session_id`s are resolved instead of pre-collecting the entire tree, or scope the walk to the validated folder's nearest packet ancestor rather than the whole `.opencode/specs` root.

   ```json
   {
     "id": "F-A5-02",
     "type": "resource-exhaustion",
     "severity": "P2",
     "claim": "collectKnownSessionIds performs an unbounded DFS readFileSync over the entire .opencode/specs tree on every strict validation, with no node/time/depth cap, enabling DoS amplification — reachable both via the CLI and the programmatic validateFolder export.",
     "evidenceRefs": ["orchestrator.ts:292-321 (unbounded walk, only node_modules/.git/scratch pruned)","orchestrator.ts:328 (called for FRONTMATTER_MEMORY_BLOCK)","orchestrator.ts:380 (rule run on every validateFolder)","mcp_server/api/index.ts:78-83 (programmatic export)"],
     "counterevidenceSought": "Looked for a depth/count/time guard in the while-loop (300-319) — none. Confirmed the only prunes are the three dir names at line 311. Confirmed the walk root is the .opencode/specs root, not the single folder (293-297).",
     "alternativeExplanation": "The tree is trusted (only repo authors write specs), so input is not attacker-controlled. Accepted as a mitigant for the *malicious* framing (downgrades from a security P1 to a P2), but the unbounded scan is still a real correctness/perf liability that worsens monotonically as the specs corpus grows, so it remains an actionable P2.",
     "finalSeverity": "P2",
     "confidence": 0.75,
     "downgradeTrigger": "If a bound already exists upstream (e.g. the rule is only run on small packets) or the specs tree is contractually small, this is advisory-only."
   }
   ```

3. **`canonicalizePath` swallows `realpathSync` failures and silently falls back to the non-canonical `resolved` path — a symlinked ancestor can slip past `isWithinAllowedSocketRoot`** -- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:94-98` (consumed by `resolveIpcSocketPath` `:134-139`) and the byte-identical code-graph fork -- `canonicalizePath` wraps `fs.realpathSync.native(current)` in a bare `try { ... } catch { return resolved; }` (94-98). If realpath throws for any reason other than the leaf-not-existing case the loop handles (e.g. EACCES on a directory the daemon can stat but not realpath, or a transient FS error), it returns the **literal `path.resolve` output** instead of the canonical path. `isWithinAllowedSocketRoot` (126-128) then prefix-compares a possibly-non-canonical candidate against canonicalized roots — so a candidate whose canonical form would land OUTSIDE the allowed roots can pass the check when its realpath silently failed, or conversely a legitimate path can be rejected. The allowed-root check is the only containment gate for the socket directory; degrading it to best-effort on realpath failure weakens the boundary it exists to enforce. Lower severity than F-A5-01 because it requires a realpath failure to coincide with a symlinked-ancestor escape, but it is the same root weakness (incomplete canonicalization) and should be fixed alongside it.
   - Finding class: defect (fail-open canonicalization / weakened containment boundary)
   - Scope proof: in-range; the bare `catch { return resolved; }` at 96-98 returns the non-canonical path; `isWithinAllowedSocketRoot` (126-128) is the sole containment gate and consumes that value at 134-135.
   - Affected surface hints: on realpath failure, fail **closed** (reject the bind) rather than returning the literal resolved path; or distinguish ENOENT (already handled by the existence loop) from EACCES/other and treat the latter as a hard error.

   ```json
   {
     "id": "F-A5-03",
     "type": "fail-open-canonicalization",
     "severity": "P2",
     "claim": "canonicalizePath catches all realpath errors and returns the non-canonical resolved path, so a realpath failure on a symlinked ancestor lets a candidate bypass (or wrongly fail) the isWithinAllowedSocketRoot containment check that is the only gate on the socket directory.",
     "evidenceRefs": ["shared/ipc/socket-server.ts:94-98 (bare catch returns resolved)","shared/ipc/socket-server.ts:126-128 (isWithinAllowedSocketRoot is the sole gate)","shared/ipc/socket-server.ts:134-139 (resolveIpcSocketPath consumes it)","system-code-graph/.../socket-server.ts (byte-identical fork)"],
     "counterevidenceSought": "Checked whether the existence loop (86-93) already handles the only realistic failure (leaf missing) — it does, which makes the catch reachable only on EACCES/other; that narrows but does not eliminate the fail-open. Confirmed no second containment check downstream of canonicalizePath.",
     "alternativeExplanation": "realpath only fails on ENOENT in practice, which the loop already covers, so the catch is dead in the common case. Partially accepted — this is why it is P2 not P1 — but EACCES/EIO/ELOOP remain reachable and the fail-open direction (return non-canonical) is the unsafe default for a security boundary.",
     "finalSeverity": "P2",
     "confidence": 0.6,
     "downgradeTrigger": "If realpath provably cannot fail with anything but ENOENT for the daemon's own socket dir in all supported deployments, this is advisory."
   }
   ```

## Traceability Checks
- **Iteration number:** JSONL has 2 `type:"iteration"` lines on disk (runs 1-2); iters 3-5 are in-flight in parallel slots. Dispatch pre-assigned run 6 + `iteration-006.md` + `deltas/iter-006.jsonl`. Honored the dispatch slot assignment (parallel-safety contract) rather than the JSONL-derived number (3); recorded as Edge Case 1.
- **Range integrity:** HEAD `12de3d3a7e`, base `a9e9bdb0a5^` = `f05bdac2cf` (consistent with iters 1-2).
- **Provenance:** `socket-server.ts` hardening (F-A5-01, F-A5-03) added in-range by `3d1667dd68`; `orchestrator.ts` collectKnownSessionIds (F-A5-02) in-range. `path-security.ts` + `api/index.ts validateFolder` export are NOT in-range content changes (out of scope as in-range findings; cited only as context for reachability).
- **Lineage:** sessionId `2026-06-05T11:16:17Z`, generation 1, lineageMode new — consistent across config/state.

## Integration Evidence
- **Programmatic `validateFolder` surface (named):** `mcp_server/api/index.ts:78-83` re-exports `validateFolder` — confirms the CLI entry-guard (orchestrator.ts:462) is NOT the only entry; a library import bypasses it. Inspected because the charter framed this as a P0-candidate. **No privileged/write action is gated on `validateFolder().passed`** (grep for `validateFolder().passed`/`.passed` against validation found only unrelated `qualityLoopResult.passed`), so the bypass is by-design library reuse, not a security boundary breach (Ruled Out #1).
- **code-graph socket-server fork (named, F-003 overlap):** `system-code-graph/mcp_server/lib/ipc/socket-server.ts` `diff -q` vs shared = BYTE-IDENTICAL, so F-A5-01 and F-A5-03 exist identically in both consumers. The F-003 drift hazard now has a concrete security payload: any fix to the tail-symlink TOCTOU in `shared/` will not reach code-graph without the missing drift guard.

## Edge Cases
1. **Iteration-number vs slot ambiguity (resolved toward dispatch):** JSONL-derived next iteration = 3 (2 iteration lines on disk), but dispatch + parallel-safety contract pre-assign run 6 and `iteration-006.md`/`iter-006.jsonl` because iters 3-5 run concurrently in other agents. Safest in-scope interpretation: write the assigned slot (6) to avoid clobbering a peer's iteration-003. Flagged so the reducer/orchestrator reconciles the eventual JSONL ordering.
2. **`/tmp` vs daemon-owned-dir is the deciding factor for F-A5-01 severity:** the symlink-tail attack needs a world-writable parent. The allowed roots include `os.tmpdir()` and `/tmp` (118-124), and the project convention documents `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>`. If `/tmp/<service>` is always pre-created daemon-owned-0700 the window closes; if it is bare `/tmp` or created lazily, the window is open for a same-host local attacker. Could not determine deployment guarantee from the diff — recorded `downgradeTrigger` on the finding.
3. **`path-security.ts` out of range (missing-dependency honesty):** the dispatch asked for `validateFilePath` coverage. The file is unchanged by the 50 commits, so no in-range defect is asserted. Read-only assessment: its containment is sound (rejects null bytes + `..` segments pre-resolve, canonicalizes both sides via realpath, uses `path.relative` not `startsWith` per CWE-22). The one residual is the new-file fallback to `path.resolve` (line 69) — same fail-open *flavor* as F-A5-03 but mitigated by the subsequent `path.relative` check (lines 87-88), so not a finding. Notably the socket-server does NOT use this hardened util — it inlines its own weaker `canonicalizePath`/`isWithinRoot` (see F-A5-03).
4. **code-graph MCP disconnected** (per Known Context): structural search unavailable; used Grep+Read+git+diff, sufficient for this diff-scoped security pass.

## Confirmed-Clean Surfaces
- **Socket dir uid/mode hardening on pre-existing dir (`socket-server.ts:248-260`):** CLEAN for the inspected hazard. A pre-existing socket directory not owned by the current uid, or group/world-writable (`mode & 0o022`), is refused before bind. This correctly closes the *directory*-planting attack. (It does NOT cover the tail node — that gap is F-A5-01, a distinct surface.)
- **`canUnlinkExistingSocket` reclaim fence (`socket-server.ts:147-179`):** CLEAN for the reclaim/EADDRINUSE path. It `lstatSync` (no-follow, line 163), rejects non-sockets and foreign-uid nodes, and treats ENOENT as a benign race. The hijack-on-reclaim vector is well guarded. (The gap is that this fence is NOT consulted on fresh bind — F-A5-01.)
- **`validateFilePath` (`path-security.ts:18-108`, out-of-range context):** containment logic is sound (null-byte + `..` rejection pre-resolve, dual-side realpath, `path.relative` containment). No finding.

## Ruled Out
1. **Validator entry-guard bypass via programmatic `validateFolder()` import as a P0/security finding (charter A5 P0-candidate):** RULED OUT as a vulnerability. Hunter: "the CLI guard (orchestrator.ts:462) is bypassable by importing `validateFolder` directly (exported at api/index.ts:79), so all validation can be skipped." Skeptic: validation is only a *vulnerability* if something privileged/trusted is **gated** on it passing — searched `.passed`/`validateFolder(` across `mcp_server/**` (excluding tests/orchestrator); the only `.passed` consumers are `qualityLoopResult.passed` (memory-save quality loop), entirely unrelated to spec-folder validation. No write/auth/privileged action depends on `validateFolder().passed`. Referee: `validateFolder` is a deliberately-exported pure-reporting library function; the CLI guard is a CLI nicety (prevents the module from auto-running validation on import), exactly as its own comment (459-461) states. Bypassing it skips a *report*, not a *gate*. Verdict: by-design, NOT a security finding. The real (lower-severity) artifacts of the same export are F-A5-02 (the export widens the DoS trigger surface).
2. **Symlink-attack / resource-exhaustion P0 in the validator (charter A5 "P0 follow-through"):** Ruled out at P0. `collectKnownSessionIds` uses `readdirSync({withFileTypes:true})` and pushes only `dirent.isDirectory()` (line 310) — symlink-to-dir dirents report `isSymbolicLink()`/`isDirectory()===false`, so the walk does NOT follow directory symlinks (no symlink-loop traversal). The only real liability is the *unbounded* but non-symlink-following walk → demoted to the DoS P2 (F-A5-02). No symlink-traversal P0.
3. **`isWithinRoot` prefix-match boundary bug (charter A5):** Ruled out as a defect. `isWithinRoot` (101-110) appends `path.sep` to the root before `startsWith` (line 108), so `/tmp/specs-evil` does NOT match root `/tmp/specs` (prefix is `/tmp/specs/`). Both inputs are canonicalized first. The classic separator-boundary bug is correctly avoided. (The residual weakness is upstream — canonicalization can fail-open, F-A5-03 — not in the prefix match itself.)

## Next Focus
- **Dimension:** security
- **Focus area:** A4∩A5 lifecycle-security overlap (charter iter 8) — socket `close()` parent-dir fsync / stale-socket EADDRINUSE durability as a *security* surface (a leftover stale socket forces the EADDRINUSE reclaim branch, which is the only path that runs the `canUnlinkExistingSocket` fence — interaction with F-A5-01's fresh-bind gap), plus WAL-checkpoint-on-close data-exposure window (`context-server.ts ~1592/2169`).
- **Reason:** A5 fresh-bind vs reclaim-bind fence asymmetry (F-A5-01) directly couples to A4 shutdown durability — whether close() reliably removes the socket determines which bind branch runs next, and thus whether the lstat fence protects the next start.
- **Rotation status:** security iter 1 of 2 (A5 core done: entry-guard ruled out, socket TOCTOU = F-A5-01 P1 + F-A5-03 P2, validator DoS = F-A5-02 P2). A4∩A5 overlap queued for iter 8.
- **Blocked/productive carry-forward:** Productive — F-A5-01 should be re-asserted in the iter 14-20 adversarial-verify pass with the deployment-guarantee question (is SPECKIT_IPC_SOCKET_DIR ever bare /tmp?) resolved. F-003 now carries a concrete security payload (TOCTOU in both copies) — escalate its drift-guard need in A6 (iter 12). Do NOT retry the entry-guard-bypass as a security finding (BLOCKED — no privileged gate depends on it).
- **Required evidence for iter 8:** socket close() fsync/unlink ordering in `socket-server.ts:363-387`; whether a crash leaves a stale socket that forces the reclaim branch; WAL-checkpoint timing on shutdown in `context-server.ts`.
