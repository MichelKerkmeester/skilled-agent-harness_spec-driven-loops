# Opus 4.8 Cross-Review (claude2) — 013/014 session work + deployed runtime

<!-- Independent second-model deep review. Executor: cli-claude-code claude-opus-4-8 via the claude2 account, read-only (--permission-mode plan). 4 sessions across 5 lineages (L4 split for timeout). All P1s verified against source by the orchestrator. -->

## Executive Summary

- **Verdict: CONDITIONAL** — **P0=0, P1=4, P2=17**. Independent Opus 4.8 cross-check of the gpt-5.5-fast review + remediation AND a first review of the **deployed 013 runtime code** (which the gpt-5.5 pass never examined).
- **Headline:** the remediation held, and Opus found **3 net-new real bugs in shipped runtime code** + 1 incomplete-sweep doc gap. Two are high-impact (a checkpoint-restore **data-loss** crash window; a front-proxy **UTF-8 corruption** regression). All 4 P1s were **verified against source** by me before reporting.
- L2 (stress tests) came back **PASS** and independently confirmed my remediation: isolation hermetic, assertions strong, and the recycle re-scoping I wrote is **honest/accurate** (not overclaiming).

## P1 findings (all verified against source)

1. **L4a — Checkpoint restore: data-loss crash window** · `mcp_server/lib/storage/checkpoints.ts:2645`
   The swap-failure catch (2645) rolls back via `restoreBackups` but does **not** demote the restore journal `swap-done→swap-pending` first — unlike the sibling init-failure catch (2699-2706), which demotes deliberately (with a comment explaining the crash-vs-in-process symmetry it protects). With the journal left at `swap-done`, a crash inside `restoreBackups`' `rmSync(live)`→`rename(backup→live)` gap leaves live missing **and** boot recovery's swap-done branch deletes the `.bak` → both copies destroyed. **Verified:** 2645 handler lacks the demote that 2692 has.
   *Fix:* write the swap-pending journal before the 2645 rollback reopen (mirror 2699-2706); optionally drop the rm-before-rename (POSIX `rename` replaces atomically).

2. **L4b — Front-proxy: UTF-8 multibyte frame corruption** · `.opencode/bin/lib/launcher-session-proxy.cjs:73`
   `buffer += chunk.toString('utf8')` decodes each socket chunk independently, so a multibyte char (CJK/emoji) split across chunk boundaries becomes U+FFFD on both sides — silently, forwarded as valid JSON. Regression vs the old byte-exact `socket.pipe`. Hits `memory_save` content and `memory_search` results; same flaw in `internalHandshake`/`probeDaemon`. **Verified:** line 73 is per-chunk `toString('utf8')` accumulation (no `StringDecoder`).
   *Fix:* use `string_decoder.StringDecoder` so partial sequences are held until complete.

3. **L3 — `reconcileMoves` omits `spec_folder` on in-place move** · `mcp_server/lib/storage/incremental-index.ts:566`
   The move UPDATE sets `file_path` + `canonical_file_path` but **not** `spec_folder`, leaving the stored grouping key stale after a folder rename; the mtime fast-path then blocks self-heal. Material in this repo given documented folder renumbering. **Verified:** the SET clause (566-567) has no `spec_folder =`.
   *Fix:* include `spec_folder = ?` in the reconcile UPDATE.

4. **L1 — Version / tool-count sweep incomplete** · `feature_catalog/02--mutation/026-…:31` ("41-tool"), `references/config/environment_variables.md:26` ("54-tool"), `mcp_server/INSTALL_GUIDE.md:3` ("v1.7.2") (+ 1.7.2 inside 014/002+003 specs)
   The remediation corrected the cited files but other present-tense `mk-spec-memory` tool-count / version references survive, now inconsistent with the corrected **36 / 1.8.0**. **Verified:** all three stale strings present.
   *Fix:* sweep remaining present-tense tool-count → 36 and current-version → 1.8.0.

## P2 clusters (17, advisory)

- **Checkpoint (L4a, 4):** orphan snapshot dir on failed post-publish INSERT (`checkpoints.ts:2264`); swap-done crash before `mergeCheckpointCatalogRows` loses post-snapshot catalog rows (2665); pruned dirs removed post-commit → orphans on crash (2312); v1 restore omits `.needs-rebuild` sentinel (asymmetry, 3130).
- **Front-proxy (L4b, 4):** double `initialize` to fresh backend when handshake never completed (607-637); `recycleDaemonInPlace` clears lease during backoff → competing-launch window (mk-launcher:733); permanent reattach give-up leaves `state='REATTACHING'` (669); `memory_save` at-least-once replay can duplicate v30 secondary-index rows (33,125 — already a known follow-up in-code).
- **Index/enrichment (L3, 4):** `memory-index.ts:665` doc-vs-source (claims packet_id+docType; code keys grandparent+basename); fail-open lease catch in `acquireIndexScanLease`; + 2 hardening items.
- **Docs (L1, 3) + tests (L2, 2):** residual version/tool-count prose; enrichment stress asserts a self-built index mirror not the real constant; README row-4 slightly overstates per-request -32001 emission.

## What's clean (independently confirmed)
- Remediation `1663527f79` correct on every claim it touched; the `includeEmbeddings` false-positive rightly left unchanged.
- Stress isolation hermetic (mkdtemp/`:memory:`, injected reopen, no production DB/socket access); snapshotFormat now a hard assertion; recycle re-scoping honest.
- Checkpoint two-phase journal write + swap-pending boot recovery, sentinel atomic write/clear, DB-consumer rebind, VACUUM busy-retry, v2 gate, table allowlist; serverInfo 1.8.0 + SPECKIT_BACKEND_ONLY gate; keepalive id-reservation + -32002 fail-closed.

## Scope & method
4 deep-review sessions (Opus 4.8 / claude2, read-only), split into 5 lineages (L4→L4a/L4b after a 900s timeout): L1 docs, L2 stress tests, L3 index/enrichment code, L4a checkpoint code, L4b front-proxy code. Each a thorough single convergent Opus pass; all P1s adversarially verified against source by the orchestrator (convergence step). The 3 code P1s are in the **deployed 013 runtime** — out of the original 014 docs/tests scope, surfaced because this review covered the implementation.

## Recommended next steps
- **Code P1s (data-loss, UTF-8, reconcileMoves):** deployed-runtime fixes — need code change + targeted tests + a rebuild/redeploy. Highest value: the checkpoint data-loss window and the UTF-8 corruption.
- **Doc P1 (sweep):** quick — finish the 36 / 1.8.0 sweep across the flagged files.
- These are a new remediation scope (deployed code), distinct from the already-shipped 014 docs/tests work.
