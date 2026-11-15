---
title: "Implementation Plan: env secret guard for every runtime"
description: "One CommonJS core decides whether a tool call exposes a dotenv file. Thin adapters run it on OpenCode, Pi, DSH and the four command-hook runtimes, and a CLI gives every runtime a value-free way to inspect a dotenv file."
trigger_phrases:
  - "env secret guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: env secret guard for every runtime

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS core, ESM and TypeScript adapters |
| **Framework** | OpenCode plugin bridge, Pi extension API, DSH plugin context, stdin JSON command hooks |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
The core in `.skilled/hooks/env-secret-guard/lib/` owns every rule. The overlay guard is the model: one core and one thin adapter per transport. Claude Code, Codex, Cursor and Devin share one command-hook script, as the git message gate already does, and the hook registry renders their four configs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The CI hook node:test collection, the hooks vitest tree and `node --test '.opencode/plugins/tests/*.test.cjs'` each report zero failures
- [ ] Both runtime-mirror `--check` runs print `PASS`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared policy core with per-transport adapters.

### Key Components
- **Core** (`lib/env-secret-guard.cjs`): dotenv name and symlink matching, path extraction from any tool input, the shell rule, and the list, validate and fingerprint functions.
- **Command hook** (`command-hook/env-secret-guard.cjs`): reads stdin JSON, answers with the PreToolUse envelope, or with Cursor's permission envelope when the payload carries `workspace_roots`.
- **OpenCode plugin**: throws to deny and registers the three inspection tools.
- **Pi extension and DSH adapter**: return each host's own block shape.
- **CLI** (`cli/env-secret.cjs`): the inspection functions for any shell.

### Data Flow
Host tool call, then the adapter, then `evaluateToolCall({ tool, input, cwd })`, then allow or a deny reason that names the value-free way to inspect the file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hook-registry.json` | Source of the four JSON hook configs | One entry added | `sync-hook-registrations.cjs --check` |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` | Generated runtime configs | Regenerated, not hand-edited | Same check |
| `.dsh/plugins/repo-guards/` | DSH guard bundle | One import and one register call, one adapter link | `sync-runtime-mirrors.cjs --check` |
| `.pi/extensions/` | Pi extension links | One link | Registry check reports every Pi extension resolves |

Algorithm invariant: no function in the core returns a dotenv value or the pepper. Adversarial cases: a symlink with an innocent name, a patch `Move to` a dotenv file, Codex's argv form, a quoted path and a `.env*` glob.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core rules and inspection functions | `node --test` |
| Integration | Command hook spawned with each runtime's payload shape, Pi extension imported from a `.pi/extensions` path, DSH adapter on the plugin harness, OpenCode plugin through its v1 factory | `node --test` |
| Manual | An independent review of each surface by DeepSeek v4.1 Flash at max reasoning | dsh headless |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hook registry and sync scripts | Internal | Green | Configs would need hand edits |
| `lib/v2-bridge.js` | Internal | Green | The plugin would run on OpenCode 1 only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard denies ordinary work on a runtime.
- **Procedure**: Set `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` at once. To remove it, revert the commit and rerun both sync scripts so the configs and links follow the registry.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Worktree and spec packet | Implementation |
| Implementation | The core, before any adapter | Verification |
| Verification | Every adapter registered and synced | Completion |
<!-- /ANCHOR:phase-deps -->

---
