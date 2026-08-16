---
title: "Implementation Plan: Phase 2 install-transition"
description: "Capture rollback state, replace the colliding extension, and verify installed command ownership."
trigger_phrases:
  - "install-transition plan"
  - "pi install remove fast mode"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/002-install-transition"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Planned install transition"
    next_safe_action: "Capture pre-state before settings mutation"
    blockers: []
    key_files: ["../../../../../.pi/settings.json", "../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Phase 2 install-transition

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Pi CLI and npm scopes |
| **Framework** | `pi install`, `pi remove`, `pi list`, RPC `get_commands` |
| **Storage** | Canonical `.pi/settings.json` and operator npm directories |
| **Testing** | Pre/post inventory and ownership probe |

### Overview
Record the exact pre-state, remove `pi-gpt-fast-mode`, install the decided fork source, and query command ownership. Keep this child limited to installation and loader state; live UI and docs happen after ownership passes.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Deterministic suite and typecheck pass.
- [ ] Rollback snapshot path is writable and excludes secrets.
- [ ] Install source decision is recorded.

### Definition of Done
- [ ] Fork is present and legacy package absent.
- [ ] Bare `/fast` belongs to the fork.
- [ ] Settings/npm post-state matches the intended transition.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Replace-and-verify transition with pre-state snapshot.

### Key Components
- Pre-state inventory: settings, `pi list`, user/project npm scopes.
- Removal/install operation: one bounded mutation window.
- Loader probe: `get_commands` source and suffix assertion.

### Data Flow
Pre-state → remove legacy → install fork → reload/query commands → post-state/rollback receipt.

### Install Source Decision
First install uses a LOCAL PATH source (`pi install -l <local-package-path>`), not a pinned git ref or a published npm package. Rationale: smallest rollback surface and no registry/publication dependency; npm publication stays deferred (parent-scope open question).

### Transition Sequence
(a) **Capture pre-state**: copy `.pi/settings.json` and record `pi list` + `npm ls` (user `~/.pi/agent/` and project `.pi/` scopes) into the rollback snapshot.
(b) **Remove** `pi-gpt-fast-mode` (it does NOT register `/fast`; `pi-openai-fast-mode` and TBG `pi-fast-mode` do, so only the fork and any legacy `fast`-command extension compete for the bare name).
(c) **Install** the fork from the local path (`pi install -l <local-package-path>`), ensuring it loads before any legacy `fast`-command extension.
(d) **Verify** bare `/fast` ownership via `pi.getCommands()` / RPC `get_commands`, filtering extension entries and asserting BOTH the expected fork source path AND bare-command ownership; confirm suffix renumbering with a live probe.
(e) **Record post-state** inventory and the rollback receipt.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.pi/settings.json` | Canonical project settings | Replace the colliding package entry with the local-path fork | Pre/post settings diff; valid JSON |
| Installed-extension set (user) | `~/.pi/agent/` user scope | Inventory captured; restored unchanged unless present | `npm ls` user scope |
| Installed-extension set (project) | `.pi/` project scope | Remove legacy, install fork | `pi list` + `npm ls` agreement |
| `/fast` command registry | Duplicate `/fast` entries with load-order suffixes | Fork owns bare `/fast` | RPC `get_commands` source + suffix |
| Rollback snapshot | Captured pre-state receipts | Restore on failure | `scratch/rollback-snapshot/` receipt |

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture pre-state (`.pi/settings.json` copy + `pi list` + `npm ls` inventory) and record the local-path source decision.

### Phase 2: Core Implementation
- [ ] Remove `pi-gpt-fast-mode` and install the fork from the local path as ONE bounded operation.
- [ ] Reconcile `.pi/settings.json` and npm scopes.

### Phase 3: Verification
- [ ] Run `pi list`, npm inventory, settings inspection, and `get_commands`; assert fork source path and bare `/fast` ownership.
- [ ] Stop before live checks if bare ownership is wrong.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Pre/post package and settings state | `pi list`, `npm ls`, JSON inspection |
| Runtime | Bare `/fast` source ownership | RPC `get_commands` / `pi.getCommands()` |
| Safety | Rollback receipt and no stray `.pi` files | `git status` |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-extension-integration-suite/` | Internal | Green | Do not mutate settings |
| Pi CLI | Runtime | Green | No install transition |
| Possible npm peer-dependency conflict | Environment | Open | May require documented npm fallback |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Install fails, legacy package remains, or the fork does not own bare `/fast`.
- **Exact rollback** (restore the captured `.pi/settings.json` and the prior installed-extension inventory):
  1. Remove the fork: `pi remove pi-fast-mode-w-subagent-support`.
  2. Restore the settings snapshot: `cp <snapshot>/settings.json.before .pi/settings.json`.
  3. Reinstall the captured legacy source recorded in pre-state (e.g. `pi install -l npm:pi-gpt-fast-mode`).
  4. Verify restored pre-state: `pi list` and `npm ls` agree with the captured inventory, and `get_commands` shows no unexpected `/fast` suffix residue before retrying.
<!-- /ANCHOR:rollback -->
