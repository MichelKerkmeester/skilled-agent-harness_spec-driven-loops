---
title: "Implementation Summary: 014/007 voyage-cleanup-and-egress-monitoring"
description: "Deleted 463MB of stale Voyage + legacy sqlite from the spec-kit-memory DB dir. Added a runtime warn-once egress guard in factory.ts that surfaces if VOYAGE_API_KEY appears in env when the resolved provider is hf-local. Documented a 24h tcpdump verification command for the user to run post-merge."
trigger_phrases:
  - "014/007 voyage cleanup done"
  - "voyage egress guard shipped"
  - "factory voyage drift warn"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring"
    last_updated_at: "2026-05-12T22:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Voyage + legacy sqlite removed; egress guard live"
    next_safe_action: "Strict validate; user runs tcpdump post-merge"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140070c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "014-007-voyage-cleanup-2026-05-12"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-voyage-cleanup-and-egress-monitoring |
| **Completed** | 2026-05-12 (deletes + guard); 24h tcpdump verification deferred to user |
| **Level** | 1 |
| **Status** | In Progress (60%) — deletes shipped + egress guard live; user verifies 0 Voyage egress post-merge |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-kit-memory database directory used to carry two ghosts: a 322MB Voyage 1024-dim sqlite from before the local-embeddings migration and a 141MB generic-filename `context-index.sqlite` from before filename-keying landed. Both are gone now (463MB reclaimed), and the only context-index sqlite remaining is the filename-keyed hf-local one with 2112 live rows. On top of the cleanup, factory.ts now warns once per process startup if `VOYAGE_API_KEY` shows up in env while the resolved provider is `hf-local` — so a future regression that re-exports the key surfaces immediately at the next MCP child spawn instead of silently flipping back to Voyage egress.

### Cleanup

Four sqlite files removed from `.opencode/skills/system-spec-kit/mcp_server/database/`:

| File | Size | Reason |
|------|------|--------|
| `context-index__voyage__voyage-4__1024.sqlite` | 318MB | Stale 1024-dim Voyage vectors |
| `context-index__voyage__voyage-4__1024.sqlite-shm` | 32KB | WAL shared-memory companion |
| `context-index__voyage__voyage-4__1024.sqlite-wal` | 4.0MB | WAL log |
| `context-index.sqlite` | 141MB | Pre-filename-keying legacy DB |

Verified via `lsof` first that nothing held open file handles. Confirmed `memory_health` post-delete still reports `vectorSearchAvailable: true` and `memoryCount: 2112`.

### Egress guard

Added a small warn-once helper in `factory.ts`:

```typescript
let voyageDriftWarned = false;
function warnIfVoyageDriftDetected(effectiveProvider: string): void {
  if (voyageDriftWarned) return;
  if (effectiveProvider !== 'hf-local') return;
  if (process.env.VOYAGE_API_KEY) {
    voyageDriftWarned = true;
    console.warn('[factory] VOYAGE_API_KEY is set in process.env but the resolved provider is hf-local. ...');
  }
}
```

Called from `getProviderInfoForResolution()` after metadata resolution. Fail-soft by design — the warn doesn't throw, because users may intentionally keep `VOYAGE_API_KEY` for other tooling (e.g. cocoindex's litellm path or an unrelated app). The warning still surfaces the drift so the user knows it's an option rather than a default.

### tcpdump verification

`scratch/tcpdump-verify.sh` captures HTTPS traffic to `api.voyageai.com` for 24h. User runs this post-merge (post-008) and confirms 0 packets. Script is chmod +x and self-contained — needs only `sudo` for tcpdump.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite{,-shm,-wal}` | Deleted | 322MB stale Voyage vectors |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` | Deleted | 141MB legacy generic-name DB |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | Added `voyageDriftWarned` flag + `warnIfVoyageDriftDetected()` helper; wired into `getProviderInfoForResolution` |
| `.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.{js,d.ts}` | Regenerated | `npx tsc --build` |
| `007/scratch/tcpdump-verify.sh` | Created | 24h post-merge verification script |
| `007/*.md` + `description.json` + `graph-metadata.json` | Modified | Filled scaffold templates with actual content |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Native main-agent execution. Five steps: `lsof` sanity → `rm` the four sqlite files → `Edit` factory.ts to add the helper + call site → `npx tsc --build` → write the tcpdump script. Total wall time ~3 minutes of mechanical work, ~2 minutes of doc-writing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete legacy `context-index.sqlite` alongside the Voyage one | Same dead-data category. Filename-keying is the active scheme; the unkeyed legacy was a confusion source. |
| Warn-once instead of throw | Users may intentionally keep VOYAGE_API_KEY for cocoindex's litellm fallback or unrelated tools. A loud warning surfaces the drift without breaking the user's setup. |
| Module-level `voyageDriftWarned` flag instead of per-instance | Provider resolution can run many times during a process lifetime; flooding stderr with duplicate warnings would obscure the signal. |
| `scratch/` for the tcpdump script (not a project script) | Single-purpose post-merge verification; doesn't belong in a permanent script dir. Lives with the packet that documents its rationale. |
| 24h verification is user-driven, not session-driven | Single Claude Code session can't realistically wait 24h. The script + spec captures what the verification IS; the user runs it when convenient. |
| Did NOT add a network-level firewall rule | Out of scope (system-level config, not application). The TS-level warn is the right layer for in-app egress detection. |
| Did NOT remove the litellm/voyage code path from `factory.ts` | The provider IS still supported for users who want Voyage; only the *default* and the leftover sqlite are gone. Removing the code path would be a bigger backwards-compatibility decision. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls .opencode/skills/system-spec-kit/mcp_server/database/ \| grep -i voyage` | PASS — empty |
| `ls .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` | PASS — file not found |
| `memory_health()` post-delete | PASS — `vectorSearchAvailable: true`, `memoryCount: 2112`, hf-local sqlite intact |
| `npx tsc --noEmit -p tsconfig.json` after factory.ts edit | PASS — clean (no output) |
| `npx tsc --build` regenerates dist | PASS — `dist/embeddings/factory.js` contains `warnIfVoyageDriftDetected` (grep ≥1) |
| Reclaim total | PASS — 463MB (318 + 0.032 + 4 + 141) |
| tcpdump script executable | PASS — `chmod +x` applied |
| Strict validate | (pending T014) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **24h tcpdump verification is user-driven.** A single Claude Code session can't run a 24h capture. The script + spec document the procedure; user runs it after 008 ships. If the script reports any captured packets, that's the regression signal.
2. **The egress guard logs, doesn't enforce.** Intentional: some users may keep VOYAGE_API_KEY for cocoindex's litellm path or unrelated tooling. A noisy warn-once is the right tradeoff vs. a hard fail that blocks setups.
3. **The guard only fires once per process lifetime.** If the warn is missed in noisy launcher output, it won't repeat. Pair with the 24h tcpdump for hard confirmation.
4. **Legacy `context-index.sqlite` is NOT recoverable from git.** It was already gitignored; the only copy was on disk. If anything still depends on it (none found in grep), that consumer must be re-pointed at the filename-keyed sqlite or re-embedded under hf-local.
5. **The litellm Voyage code path in factory.ts is intentionally left in place.** Users can still opt into Voyage by setting `EMBEDDINGS_PROVIDER=voyage` + a valid `VOYAGE_API_KEY`. Removing the code path entirely would be a backward-compatibility decision outside 014's scope.
6. **Cocoindex daemon has its own embedding config layer.** It reads `~/.cocoindex_code/global_settings.yml` and a separate env var (`COCOINDEX_CODE_EMBEDDING_MODEL`). 007 doesn't touch that side — the factory guard is only for spec-kit-memory. Cocoindex's litellm Voyage fallback was already disabled by 004's YAML update.
<!-- /ANCHOR:limitations -->
