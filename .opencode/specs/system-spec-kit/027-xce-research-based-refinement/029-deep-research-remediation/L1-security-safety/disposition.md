---
title: "L1 Security/Safety — Disposition"
description: "All six L1 findings closed: source-kind guards (prior session), single-writer kernel DB lock (live-237), CLI save-lane scrubber via shared promotion (tri-016), hash-only query fingerprints (tri-050), truthful write-ingress catalog claims (tri-005). Every fix Fable-adversarially verified; newly discovered same-class gaps recorded as follow-ons."
trigger_phrases:
  - "L1 security disposition"
  - "single writer lock disposition"
  - "scrubber promotion disposition"
importance_tier: "important"
contextType: "implementation"
---
# L1 Security/Safety — Disposition

<!-- ANCHOR:shipped -->
## Shipped (all Fable-adversarially verified before commit)

| Finding | Fix | Verdict | Commit |
|---|---|---|---|
| tri-003 (P0) | reindex-retire source-kind guard with manual-tier carry | CLOSED (prior session) | `61b529fde3` |
| tri-004 (P0) | auto-promotion source-kind guard, TOCTOU-safe atomic predicate | CLOSED (prior session) | `61b529fde3` |
| live-237 (P0) | single-writer kernel fcntl lock at DB-open (sidecar SQLite, EXCLUSIVE + BEGIN IMMEDIATE), exit-86 launcher bridge contract, adoption in 6 standalone RW openers | INCOMPLETE → launcher self-bridge defect fixed exactly as the verdict prescribed (pure decision helper + unit tests); corruption core verified sound | this lane |
| tri-016 (P0) | secret scrubber promoted byte-identical to `@spec-kit/shared/parsing/secret-scrubber`; CLI save lane scrubs all payload fields fail-closed before persistence | CLOSED | this lane |
| tri-050 (P1) | hash-only query fingerprints (no retained prefix) + legacy-row purge in initConsumptionLog | INCOMPLETE → legacy 204-row purge shipped; live DB verified 0 prefix rows post-recycle | this lane |
| tri-005 (P1) | write-ingress claims reconciled across catalog, 022 spec §9, AND 022 implementation-summary (the contradiction the verifier caught); catalog names guarded surfaces honestly | INCOMPLETE → all three doc surfaces reconciled | this lane |

Verdicts: `../verify/live-237-fix-verdict.md`, `../verify/tri-016-fix-verdict.md`, `../verify/l1-p1s-fix-verdict.md`.

Live verification (2026-06-12): one daemon holds the kernel lock (`.lock-info.json` pid matches the sole `context-server.js`); a manually cold-spawned second daemon exits 86 naming the live holder; a raw better-sqlite3 contender gets `SQLITE_BUSY`; the CLI save lane redacts planted fake credentials at runtime through the shared module; `consumption_log` holds zero prefix-bearing fingerprints after the recycle.
<!-- /ANCHOR:shipped -->

<!-- ANCHOR:operational-notes -->
## Operational notes

- The lock is **default-ON** with kill switch `SPECKIT_DB_LOCK_DISABLE=1` (fcntl-hostile filesystems / emergency unblock; logs loudly when disabled).
- Launcher `.cjs` changes (exit-86 handling, self-lease guard) activate only in launchers started after the commit; warm pre-commit launchers treat exit 86 as a crash and back off — bounded, no corruption, self-heals on session restart.
- MEGA sync is NOT a corruption vector and the verifier's "undone exclusion" follow-on is a false alarm: `/Users/michelkerkmeester/MEGA/.megaignore` excludes all three `mcp_server/database` dirs explicitly (defense-in-depth) plus the global `-:.*` dotfile rule covers `.opencode` entirely.
- One daemon SIGBUS death occurred during the first deploy recycle; precedent exists in the pre-change launcher log (same morning, before any lock code), and the lock holds no mmap on its sidecar — not attributable to this change. The kernel lock released cleanly at that death and the respawn acquired it, which is the design working as intended.
<!-- /ANCHOR:operational-notes -->

<!-- ANCHOR:follow-ons -->
## Newly discovered follow-ons (same guard classes, found by adversarial verification — NOT yet remediated)

Tier-mutation paths that do not consult `source_kind` (erode the write-ingress guarantee; candidates for a guard-extension packet):
1. PE SUPERSEDE: `handlers/pe-gating.ts:288-310` (`markMemorySuperseded` deprecates by bare id; PE decision layer never reads source_kind).
2. PE UPDATE discards the retire carry: `handlers/pe-gating.ts:351`.
3. Reconsolidation merge discards the carry and re-stamps `source_kind='system'`: `lib/storage/reconsolidation.ts:324,332,523`.
4. `handlers/save/create-record.ts:327` discards the carry (PE-routed lineage).
5. `lib/scoring/confidence-tracker.ts:262-266` `promoteToCritical` mutates tier with no source-kind check (reachability unverified).

Scrubber coverage (from the tri-016 verdict, non-blocking):
6. Word-boundary evasion inherited from the original pattern set (`__github_pat_…` evades `\b`); mitigated by slugification in the slug path.
7. Object KEYS in scrubbed trees are not scrubbed (values are).

Infrastructure:
8. mk-code-index has the identical dual-writer hazard (`system-code-graph/mcp_server/lib/code-graph-db.ts:502`, launcher-lease-only) — natural L4 lane work; the lock module is reusable.
9. `tests/launcher-ipc-bridge.vitest.ts` is `describe.skip`'d — the bridge path central to exit-86 handling has no active automated coverage.
10. MCP `memory_context` rejects empty-string optional fields (`E_SESSION_SCOPE` etc.), costing mid-tier executors turns on every command dispatch — candidate server-side accept-and-strip (surfaced by the L8 investigation; separate packet).
<!-- /ANCHOR:follow-ons -->
