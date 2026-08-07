---
title: "Implementation Plan: MCP Config 1:1 Alignment and Daemon Re-election Default-On"
description: "Flip the launcher re-election code default to on, and sort/clean/align the four MCP runtime configs 1:1 — trimming the drift-prone note trivia (keeping the operational notes) and renaming the legacy advisor env."
trigger_phrases:
  - "mcp config alignment plan"
  - "reelection default on plan"
  - "config 1:1 align plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default"
    last_updated_at: "2026-06-14T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan executed in full"
    next_safe_action: "None; complete"
---
# Implementation Plan: MCP Config 1:1 Alignment and Daemon Re-election Default-On

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces** | One launcher function, one vitest, four runtime configs, five living docs |
| **Change kind** | One-line default flip + config sort/clean/align; no protocol change |
| **Single read site** | `daemonReelectionEnabled` in `mk-spec-memory-launcher.cjs` is the only reader of the flag; the other two launchers never read it |
| **Adoption** | Next session / launcher respawn; no live process touched |

### Overview
Re-election was on only because every runtime config set `SPECKIT_DAEMON_REELECTION=1`; the launcher's own default was off. Flipping the one read site to default-on (off only on explicit `0`/`off`) makes the configs' explicit entry redundant, which lets the config-alignment pass drop it. The four configs are then made valid, trimmed of the drift-prone note trivia (operational notes kept), and byte-identical per server; the five docs that described code-default-off are corrected.
<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Single flag read site confirmed (`mk-spec-memory-launcher.cjs`); stress tests set the flag explicitly so the default flip cannot break them
- [x] Per-file env divergences enumerated (syntax error, notes, legacy name, ordering, codex-only doc-triggers)

### Definition of Done
- [x] Default-on in code; unit suite inverted and green (5/5); five docs synced; historical changelog untouched
- [x] All four configs parse; env blocks byte-identical per server; no banned keys
- [x] Comment hygiene clean; scoped commit landed
<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single source of truth for a default: the launcher code carries the on-by-default, the configs carry only non-default overrides, and the docs describe the code as the source rather than the configs.

### Key Components
- `mk-spec-memory-launcher.cjs` — `daemonReelectionEnabled` is the lone gate; `contextServerSpawnIo` / `shouldReleaseDaemonForReelection` are unchanged pure helpers
- `.mcp.json` (→ `.claude/mcp.json` symlink), `opencode.json`, `.codex/config.toml` — three distinct real files; `.mcp.json` is a symlink to the claude one
- `EMBEDDINGS_PROVIDER=auto` + `HF_EMBED_SERVER_URL` — provider selection vs the hf-local fallback socket address (kept distinct, unchanged)

### Data Flow
1. Launcher reads `SPECKIT_DAEMON_REELECTION`; unset → on (new default), `0`/`off` → off.
2. MCP clients read their runtime config's env block at session start and pass it to the launcher.
3. Each server's env block is identical across the three real config files, expressed in each file's schema (`env` / `environment` / `[mcp_servers.X.env]`).
<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the single flag read site; verify the two stress tests set the flag explicitly (no reliance on the unset default)

### Phase 2: Core Implementation
- [x] Flip `daemonReelectionEnabled` to `!== '0' && !== 'off'`; rewrite the comment (durable WHY, no ids)
- [x] Invert the unit test's default assertion; sync ENV_REFERENCE, README, feature_catalog (×2), playbook
- [x] Rewrite the three real configs: fix JSON syntax, strip notes, drop redundant reelection entry, rename legacy advisor env, align doc-triggers, alphabetise

### Phase 3: Verification
- [x] vitest 5/5; node truth-table spot check; node --check launcher
- [x] Parse-and-compare script: four files parse + 1:1 per server + zero banned keys
- [x] Doc-sync grep clean; comment-hygiene clean
<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | reelection default contract | `launcher-daemon-reelection.vitest.ts` |
| Spot check | truth table for the flag | `node -e` |
| Config parity | parse + per-server env equality + banned-key scan | python3 (json + tomllib) |
| Doc-sync | no stale on-switch claims outside changelog | grep |
<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| python3.11+ (tomllib) for the parity check | Internal | Green | Would need a node TOML parser instead |
| Concurrent 027 spec-tree restructure | Cross-session | Green | Spec-folder doc was deferred until it landed |
<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: unexpected resource pressure from default-on re-election across unconfigured launchers.
- **Procedure**: revert the one-line `daemonReelectionEnabled` change (back to `=== '1' || === 'on'`) and its test/doc edits; the config alignment is independently revertible. Both are config/source only and apply on next spawn.
<!-- /ANCHOR:rollback -->
