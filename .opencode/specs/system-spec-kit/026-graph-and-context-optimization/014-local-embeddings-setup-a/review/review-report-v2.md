# 014 Deep Review v2 (post-commit)

**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Date:** 2026-05-12T21:55:00Z
**Commit reviewed:** 2b767d051
**Iterations:** 24 (`iteration-006.md` through `iteration-029.md`)
**Comparison to v1:** v1 CocoIndex search/indexing and parent `children_ids` findings are resolved/stale; Codex launcher parity, dtype identity, and Voyage egress verification remain active.

## Resolved since v1
| v1 finding | Resolution |
|---|---|
| P0-004-001 | STALE. 009 search patch ships; live DB has source-language rows after sqlite-vec load. Remaining issue is stale 004 documentation, not broken search. |
| P0-009-001 | STALE. The Rust-core indexing blocker was a Codex sandbox artifact; normal-shell indexing is represented by the live `.cocoindex_code/target_sqlite.db` language spread. |
| P1-PARENT-001 | RESOLVED for machine routing. `graph-metadata.json` includes 009 in `children_ids`. Human phase map still has a P2 cleanup. |
| P1-009-001 | STALE. v1 isolated-daemon verification caveat is superseded by post-commit home-daemon evidence. |

## Still-valid v1 findings (re-confirmed)
- `P0-V2-003-001` (`.codex/config.toml:9`): Codex still launches `dist/context-server.js` directly and bypasses `.opencode/bin/spec-kit-memory-launcher.cjs`, so `.env.local` Setup A overrides are not loaded.
- `P1-V2-005-001` (`shared/embeddings/profile.ts:12`, `hf-local.ts:423`): dtype is still absent from `EmbeddingProfile`, serialized profile JSON, and DB filename identity.
- `P1-V2-007-001` (`shared/embeddings/factory.ts:97`, `:242`, `:377`): Voyage drift guard still runs after provider info resolution and misses `auto` selecting Voyage when `VOYAGE_API_KEY` exists.
- `P1-V2-007-002` (`007/.../tcpdump-verify.sh:31`): script still uses `tcpdump -i any`; this macOS host exposes `en0` and `utun*`, not `any`.

## New v2 findings
- `P0-V2-SEC-001` (`.env:12`): a full GitHub PAT remains in the live workspace. The report intentionally does not reproduce the token value.
- `P1-V2-009-001` (`009/implementation-summary.md:57`, `009/tasks.md:77`): 009 docs/tasks still claim the resolved Rust-core indexing blocker is active.
- `P1-V2-009-002` (`daemon.py:389`): search-only mode trusts client-supplied `project_root` when opening `target_sqlite.db`.
- `P1-V2-009-003` (`post-merge-checks.md:28`): post-merge CocoIndex check can pass against an under-indexed DB because it does not assert source-language coverage.
- `P1-V2-009-004` (`daemon.py:440`): `project_status` reports zero chunks when a valid DB is queried through search-only mode without a loaded project object.
- `P1-V2-004-001` (`004/implementation-summary.md:126`, `004/tasks.md:85`): 004 still records the pre-009 search failure as active.
- `P1-V2-005-002` (`post-merge-checks.md:65`): q4 opt-in instructions accept mixed fp32/q4 vectors without a durable completion gate.
- `P1-V2-008-001` (`commit-message.txt:5`): commit message opener says 009 is still needed, while later text says 009 shipped and indexing is confirmed.
- `P1-V2-008-002` (`post-merge-checks.md:43`): post-merge egress check delegates to the non-portable tcpdump script.
- `P1-V2-HANDOVER-001` (`handover.md:19`): handover continuity still names stale CocoIndex blockers.

## Advisory findings
- `P2-V2-003-001`: Codex note names old generic `context-index.sqlite`.
- `P2-V2-003-002`: Node launcher dotenv subset differs from Python `load_dotenv`.
- `P2-V2-004-001`: commit message frames ignored sqlite cleanup as committed file changes.
- `P2-V2-004-002`: post-merge memory row count is point-in-time; equality invariant is the durable check.
- `P2-V2-007-001`: tcpdump `-w` pipe will not log useful capture stats via stdout.
- `P2-V2-007-002`: rollback wording still depends on Voyage re-embedding after local migration.
- `P2-V2-008-002`: post-merge "if 009 hasn't shipped" section is stale.
- `P2-V2-009-001`: IPC debug logs can include response payload bytes.
- `P2-V2-009-002`: 009 frontmatter still names stale blocker.
- `P2-V2-009-003`: `SearchResult.rankingSignals` uses mutable default `[]`.
- `P2-V2-PARENT-001`: parent human phase map still omits 009 and marks 001-008 Pending.
- `P2-V2-PARENT-002`: parent `last_active_child_id` still points at 004.

## Required follow-up order
1. Rotate the live GitHub PAT and update `.env` without reproducing the value.
2. Fix Codex runtime parity by routing `spec_kit_memory` through `.opencode/bin/spec-kit-memory-launcher.cjs` or adding equivalent `.env.local` loading to the direct path.
3. Add dtype to hf-local profile/DB identity, or hard-block dtype flips without a fresh DB boundary.
4. Move the Voyage drift guard into provider resolution or force Setup A local-only.
5. Patch tcpdump verification for macOS (`en0` on this host; explicit `TCPDUMP_IFACE` is safer for VPN `utun*`).
6. Reconcile stale 004/009/handover docs so future resume does not chase solved CocoIndex blockers.
7. Strengthen post-merge checks with source-language coverage and search/status consistency.

## Overall verdict
FAIL.

The post-commit state is materially better than v1: the two CocoIndex P0s and parent `children_ids` P1 should not recur as active findings. The tree is still release-blocking because Codex runtime parity remains a P0 and a live PAT remains in `.env`. After those, the remaining P1s are required operational hardening and documentation consistency work.
