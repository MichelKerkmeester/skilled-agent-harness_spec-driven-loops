---
title: "Implementation Plan: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings"
description: "Add an opt-in Claude SessionStart step that copies the project hooks block into ~/.claude/settings.json, and render a .skilled presence guard into every Claude hook command. Proven with node:test and vitest suites plus a dry sync over a copy of the real user file."
trigger_phrases:
  - "claude user hook sync plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules and CommonJS, JSON |
| **Framework** | None. Claude Code hook settings rendered from `hook-registry.json` |
| **Storage** | `~/.claude/settings.json` (user file) and `.claude/settings.json` (project file) |
| **Testing** | `node --test` and vitest |

### Overview
Add `.skilled/bin/sync-claude-user-hooks.mjs`, which copies the project's Claude `hooks` block into the user file, and register it as a default-off SessionStart step. Render a `{ [ -e .skilled ] || exit 0; } && ` guard into every Claude hook command so the copy stays quiet outside a Skilled repo and both files keep byte-identical strings. Prove it with `.skilled/bin/tests/sync-claude-user-hooks.test.cjs`, the registry and parity vitest suites, and a sync over a copy of the real user file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: `spec.md` sections 2 and 3 name the stale paths and the files to change.
- [x] Success criteria measurable: `spec.md` section 5 names one command per criterion.
- [x] Dependencies identified: the Claude Code dedupe of identical commands is measured in `spec.md` under Measured Behavior.

### Definition of Done
- [ ] All acceptance criteria met: every row in `acceptance-criteria.md` is `Met` except the live enable, which waits for the push.
- [x] `node --test .skilled/bin/tests/sync-claude-user-hooks.test.cjs .skilled/bin/tests/install-codex-hooks-source-root.test.cjs` prints `fail 0`.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-rendered hook step.

### Key Components
- **`.skilled/bin/sync-claude-user-hooks.mjs`**: replaces every Skilled-owned hook in the user file with the project's `hooks` block. Without it, nothing keeps the hand-made copy current.
- **`.skilled/bin/lib/user-hook-file.mjs`**: hook identity, ownership, primary-checkout and atomic-write helpers shared with `install-codex-hooks.mjs`. Without it, the two scripts would carry two copies of the same rules.
- **`requireTree` in `hook-registry.json` and `sync-hook-registrations.cjs`**: renders the `.skilled` presence guard into every Claude command. Without it, the copy warns on every call in a project with no `.skilled` tree.
- **`claude-user-hook-sync` in `hook-flags.cjs` `DEFAULT_OFF`**: the opt-in switch `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED`. Without it, every install would touch user settings.

### Data Flow
At SessionStart, Claude Code runs the guarded command. The script exits quietly unless the switch is on and the checkout is primary. It reads `.claude/settings.json` from its own real checkout, reads the user file, drops every hook whose identity is under `.skilled/` or `.opencode/`, adds the project hooks, and writes through a temp file and a rename only when the result differs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The original bug was stale hook paths in a hand-made copy. The surfaces below own or observe the hook strings.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/sync-claude-user-hooks.mjs` | Owns the user-file copy | Create | `sync-claude-user-hooks.test.cjs` 8 pass, 0 fail |
| `.skilled/bin/lib/user-hook-file.mjs` | Owns identity and ownership rules | Create (moved from `install-codex-hooks.mjs`) | `install-codex-hooks-source-root.test.cjs` 20 pass before and after |
| `.skilled/bin/install-codex-hooks.mjs` | Consumer of the moved helpers | Update, no behavior change | `install-codex-hooks.mjs --check` OK on main and worktree |
| `sync-hook-registrations.cjs` and `hook-registry.json` | Produce every rendered Claude command | Update | `sync-hook-registrations.cjs --check` PASS on the 36-hook registry |
| `.claude/settings.json` | Rendered output read by Claude Code | Update by the renderer only | `hook-registration-sync.vitest.ts` 9/9 |
| Hook parity suites | Observe rendered commands | Update counts | `hook-adapter-path-parity` 153/153, advisor settings parity 41/41 |
| `ENV-REFERENCE.md`, `doctor-env.yaml`, `.env.example`, `hook-flags.env.example` | Document the switch | Update | `env-reference-drift.vitest.ts` 5/5 |
| Codex, Cursor, Devin, Pi, OpenCode and Vibe settings | Other runtimes | Not a consumer | Their registry runtimes name no `requireTree` |

Required inventories:
- Same-class producers: `rg -n 'requireTree' .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/` names the registry and the renderer only.
- Consumers of changed symbols: `rg -n 'user-hook-file' .skilled/bin` names the two scripts and the test.
- Matrix axes: switch (on, off), checkout (primary, linked worktree), mode (session, manual, check, dry run), user file (missing, valid, not an object).
- Algorithm invariant: after a sync, the owned hooks in the user file equal the project hooks, and every non-owned hook and key is unchanged. Adversarial cases: owned and non-owned hooks in one group, a renamed hook, a malformed file.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup measures the Claude dedupe and the stale paths. Implementation adds the script, the helper module, the flag, the registry binding, the guard and the docs. Verification runs the suites, the rendered-command check and a sync over a copy of the real user file.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The main command is `node --test .skilled/bin/tests/sync-claude-user-hooks.test.cjs`, which must print `pass 8` and `fail 0`.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Merge, switch, worktree, backup, check and malformed-file cases in `sync-claude-user-hooks.test.cjs`; Codex helpers in `install-codex-hooks-source-root.test.cjs` | `node --test` |
| Integration | Registry rendering in `hook-registration-sync.vitest.ts`, command parity in `hook-adapter-path-parity.vitest.ts` and the advisor `settings-driven-invocation-parity.vitest.ts` | vitest |
| Manual | Every rendered Claude command run in an empty folder; a sync over a copy of `~/.claude/settings.json` | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude Code runs an identical hook command once across settings files | External | Green, measured with a `claude -p` debug log | Every Skilled hook would run twice in a Skilled repo |
| Node.js built-ins `fs`, `path`, `child_process` | Internal | Green, no new package | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a Skilled hook runs twice, the user file loses a non-owned key or hook, or a hook warns outside a Skilled repo.
- **Procedure**: unset `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED` in `hook-flags.env`, restore `~/.claude/settings.json.pre-skilled-hook-sync` over the user file, then revert the commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup: the dedupe measurement decides the guard goes into the project file too | Verification |
| Verification | Implementation | Commit, push and the live enable |
<!-- /ANCHOR:phase-deps -->

---
