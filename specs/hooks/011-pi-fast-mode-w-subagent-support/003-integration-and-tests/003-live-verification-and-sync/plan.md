---
title: "Implementation Plan: Phase 3 live-verification-and-sync"
description: "Verify live UI and child handoff behavior, then update plugin docs and sync receipts."
trigger_phrases:
  - "live-verification-and-sync plan"
  - "fast-mode custom footer verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/003-live-verification-and-sync"
    last_updated_at: "2026-08-17T03:36:31Z"
    last_updated_by: "claude-code"
    recent_action: "Live verification + sync closeout complete; sync --check exit 0"
    next_safe_action: "Close out the 003-integration-and-tests workstream"
    blockers: []
    key_files: ["../../../../../.pi/PLUGINS.md", "../../../../../.pi/SYNC.md", "../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 3 live-verification-and-sync

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Pi TUI/RPC and shell sync tooling |
| **Framework** | Pi Extension API status/widget surfaces |
| **Storage** | Session state, settings, PLUGINS.md |
| **Testing** | Live session logs and sync gate |
| **Evidence Anchors** | `extensions.md:2556-2595` (`setStatus` persistent entry vs `setFooter` full replacement); `rpc.md:1157-1173` (footer methods are no-ops in RPC; `setStatus`/`setWidget` are request-based) |

### Overview
After install ownership passes, run the real `/fast` and child-session probes. Treat namespaced `setStatus` as the default indicator contract and capture the RPC `setStatus` request JSON as the required proof (TUI capture optional); observe a widget only as an optional richer path. Finish with sorted plugin docs, sync validation, final diff, and an authorized commit receipt.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Install child proves the fork owns bare `/fast`.
- [x] Research identifies `setStatus` as composable and RPC-safe compared with `setFooter`.

### Definition of Done
- [x] Live toggle, status, and child handoff evidence exists.
- [x] PLUGINS.md and sync checks pass.
- [x] Rollback and final no-stray-file checks are recorded.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observe → document → sync, with no production repair hidden in closeout.

### Key Components
- Live session: `/fast`, model, status, and config/env output.
- Child session: inherited env and applied supported-model state.
- Closeout: sorted plugin docs and sync check.

### Data Flow
Installed fork → live toggle → namespaced status/env → child session → runtime evidence → PLUGINS.md → sync/diff.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `setStatus` | Default indicator | Observe stable namespaced key | TUI/RPC receipt |
| `setWidget` | Optional richer indicator | Observe only if enabled | Live UI note |
| `setFooter` | Exclusive built-in footer | Not the default contract | Custom-footer coexistence note |
| Child spawn | Process handoff consumer | Observe inherited `1`/`0` | Child output |
| PLUGINS.md/SYNC.md | Repository documentation | Update after runtime proof | Sort and sync commands |

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm install post-state and choose supported model/session mode.
- [x] Define evidence filenames without storing credentials.

### Phase 2: Core Verification
- [x] Run `/fast on`, `/fast off`, and explicit flag checks.
- [x] Run an RPC-mode session and capture the namespaced `setStatus("pi-fast-mode-w-subagent-support", ...)` request JSON as the indicator proof; record a TUI capture only as an optional supplement.
- [x] Spawn a real child on `openai-codex/gpt-5.6-luna` (serviceTier priority) and capture that it inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applied the handoff state.

### Phase 3: Closeout
- [x] Alpha-sort `.pi/PLUGINS.md` (fork in, legacy removed) and run `sync-pi-configs.sh --check`; require exit 0.
- [x] Inspect the final diff/status and record the rollback receipt (fork removal, legacy reinstall, settings/docs revert).


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live TUI | Toggle and status under custom footer | Pi session logs/visual note (optional) |
| Live RPC | Namespaced `setStatus` request JSON as the indicator evidence | RPC transcript with the `setStatus` request |
| Live process | Child on `openai-codex/gpt-5.6-luna` inherits and applies handoff | Pi/subagent output |
| Repository | Docs sort, sync, final diff | shell gates |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-install-transition/` | Internal | Green | Do not run live claim |
| Custom statusline setup | Environment | Open | TUI indicator evidence may need RPC fallback |
| `sync-pi-configs.sh` | Repository | Green | Closeout cannot be claimed |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live behavior fails, docs drift, or sync check fails.
- **Procedure**: Stop closeout, restore settings/docs from the install snapshot, reinstall the legacy package if needed, and rerun ownership before retrying.
<!-- /ANCHOR:rollback -->
