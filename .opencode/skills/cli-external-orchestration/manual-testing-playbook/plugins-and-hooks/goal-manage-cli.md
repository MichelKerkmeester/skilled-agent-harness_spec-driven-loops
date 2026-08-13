---
title: "Goal Manage CLI: Session Isolation And Legacy Cutover"
description: "Manual proof for concurrent session isolation, missing identity, explicit legacy migration, aggregate privacy, and rollback."
trigger_phrases:
  - "goal manage cli"
  - "goal session isolation"
  - "legacy goal migration"
  - "goal rollback"
id: CE-P03
stage: routing
expected_intent: UNKNOWN
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 2.0.0.0
---

# Goal Manage CLI: Session Isolation And Legacy Cutover

<!-- sk-doc-template: manual_testing_playbook -->

## 1. OVERVIEW

This scenario validates the runtime-neutral goal core without touching operator state. It proves that two sessions keep different goals, missing identity never writes or injects, aggregate diagnostics do not reveal raw session ids, legacy state requires explicit ownership, malformed legacy data can only be archived, and rollback disables injection while preserving every state layout.

OpenCode's native `mk-goal` plugin is a separate regression control. Pi is the fully supported cross-runtime path. Cursor is injection-only because its prompt command does not receive the hook's native session id. Codex has no goal adapter. Claude Code has no repository adapter or goal command; any separate live native capability is outside this scenario.

---

## 2. SCENARIO CONTRACT

- Preconditions: Node is available; the goal core, CLI, Pi adapter, and Cursor adapter exist; every command uses a fresh `MK_GOAL_STATE_DIR`.
- Real user request: `Keep two Pi sessions focused on different goals without either session seeing or replacing the other goal.`
- Prompt: `Verify the goal system keeps two native sessions isolated, refuses unbound access, migrates legacy state only to an explicit owner, archives malformed legacy state without data loss, and can be disabled without deleting state.`
- Expected signals: Session A and B show distinct objectives; all unbound current-session actions fail with `MISSING_SESSION_ID`; `doctor` reports counts but not raw ids; legacy-only scoped reads return no goal; explicit migration binds exactly one empty target and archives the singleton; an occupied target stays unchanged; malformed legacy bytes survive `legacy-archive`; disabled adapters emit no goal block.
- Desired user-visible outcome: One PASS or FAIL verdict per boundary with the exact envelope lines or file comparisons used as evidence.
- Pass/fail: PASS only when every boundary above is observed from an isolated final state. Any cross-read, implicit legacy selection, target overwrite, leaked raw id, changed non-owner file, or disabled-state injection is a FAIL.

---

## 3. TEST EXECUTION

### A. Create isolated state

```bash
GOAL_TEST_ROOT="$(mktemp -d /tmp/goal-isolation.XXXXXX)"
export MK_GOAL_STATE_DIR="$GOAL_TEST_ROOT"
GOAL_CLI=.opencode/hooks/goal/bin/goal.cjs
WORKSPACE="$PWD"
```

Do not run these scenarios without `MK_GOAL_STATE_DIR`. Snapshot the real legacy path before and after if operator state already exists.

### B. Concurrent sessions and non-owner preservation

```bash
node "$GOAL_CLI" --runtime pi --session session-a --workspace "$WORKSPACE" set "Goal A"
node "$GOAL_CLI" --runtime pi --session session-b --workspace "$WORKSPACE" set "Goal B"

node "$GOAL_CLI" --runtime pi --session session-a --workspace "$WORKSPACE" show
node "$GOAL_CLI" --runtime pi --session session-b --workspace "$WORKSPACE" show

node "$GOAL_CLI" --runtime pi --session session-a --workspace "$WORKSPACE" pause "A only"
node "$GOAL_CLI" --runtime pi --session session-a --workspace "$WORKSPACE" resume
node "$GOAL_CLI" --runtime pi --session session-a --workspace "$WORKSPACE" complete
node "$GOAL_CLI" --runtime pi --session session-b --workspace "$WORKSPACE" show
```

Expected: A shows only `Goal A`; B shows only `Goal B`; A's pause/resume/complete operations do not change B; B remains active after A completes.

### C. Missing identity and privacy-safe diagnostics

```bash
node "$GOAL_CLI" set "Must not persist"
node "$GOAL_CLI" show
node "$GOAL_CLI" history
node "$GOAL_CLI" doctor
```

Expected: the first three commands fail with `code=MISSING_SESSION_ID`. `doctor` succeeds without a binding and reports `active_state_file_count`, `archive_file_count`, `legacy_state_present`, and `legacy_state_status`. Its output must not contain `session-a` or `session-b`.

### D. Legacy-only negative control and explicit migration

Use a new isolated state root:

```bash
GOAL_MIGRATION_ROOT="$(mktemp -d /tmp/goal-migration.XXXXXX)"
export MK_GOAL_STATE_DIR="$GOAL_MIGRATION_ROOT"

node -e '
const fs = require("node:fs");
const path = require("node:path");
const record = {
  goalId: "goal-legacy-manual",
  objective: "Legacy objective with explicit ownership",
  status: "active",
  createdAtMs: 1,
  updatedAtMs: 1
};
fs.writeFileSync(path.join(process.env.MK_GOAL_STATE_DIR, "active-goal.json"), JSON.stringify(record) + "\n", { mode: 0o600 });
'

node "$GOAL_CLI" --runtime pi --session target-session --workspace "$WORKSPACE" show
node "$GOAL_CLI" legacy-inspect
node "$GOAL_CLI" legacy-migrate
node "$GOAL_CLI" --runtime pi --session target-session --workspace "$WORKSPACE" legacy-migrate
node "$GOAL_CLI" --runtime pi --session target-session --workspace "$WORKSPACE" show
node "$GOAL_CLI" --runtime pi --session other-session --workspace "$WORKSPACE" show
node "$GOAL_CLI" --runtime pi --session target-session --workspace "$WORKSPACE" legacy-migrate
```

Expected:

- The first scoped `show` reports `goal_present=false`; legacy state is never a fallback.
- `legacy-inspect` reports `legacy_state_status=valid` and the operator-visible objective.
- Unbound `legacy-migrate` fails with `MISSING_SESSION_ID` and leaves the source present.
- Bound migration reports `legacy_migrated=true`, target-session receives the objective, other-session remains empty, and the source moves under `.archive/.legacy/`.
- Repeating migration reports `legacy_migrated=false` and `reason=no_legacy_state`.

Before migrating into an occupied target, record the target file bytes. The command must fail with `TARGET_SCOPE_OCCUPIED`, and both target and legacy bytes must remain identical.

### E. Malformed legacy archive

```bash
GOAL_MALFORMED_ROOT="$(mktemp -d /tmp/goal-malformed.XXXXXX)"
export MK_GOAL_STATE_DIR="$GOAL_MALFORMED_ROOT"
printf '{broken-legacy\n' > "$GOAL_MALFORMED_ROOT/active-goal.json"
chmod 600 "$GOAL_MALFORMED_ROOT/active-goal.json"

node "$GOAL_CLI" legacy-inspect
node "$GOAL_CLI" --runtime cursor --session target-session --workspace "$WORKSPACE" legacy-migrate
node "$GOAL_CLI" legacy-archive
```

Expected: inspect reports `malformed`; migrate fails with `LEGACY_GOAL_MALFORMED`; archive succeeds without session identity and preserves the exact bytes under `.archive/.legacy/` at mode `0600`.

### F. Rollback and disabled state

```bash
MK_GOAL_PLUGIN_DISABLED=1 node "$GOAL_CLI" --runtime pi --session session-b --workspace "$WORKSPACE" show

printf '%s' '{"session_id":"session-b","workspace_roots":["'"$WORKSPACE"'"]}' \
  | MK_GOAL_PLUGIN_DISABLED=1 node .opencode/hooks/goal/cursor/goal-inject.mjs
```

Expected: CLI management fails with `PLUGIN_DISABLED`; Cursor returns only `{"permission":"allow"}` with no `agent_message`. Pi rollback uses `-extensions/goal-context.ts` in `.pi/settings.json`; preserve the state root and do not merge scoped files into `active-goal.json`.

### Automated companion gate

```bash
node --test \
  .opencode/hooks/goal/lib/goal-core.test.cjs \
  .opencode/hooks/goal/bin/goal.test.cjs \
  .opencode/hooks/goal/pi/goal-pi.test.mjs \
  .opencode/hooks/goal/cursor/goal-cursor.test.mjs
```

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `.opencode/hooks/goal/lib/goal-core.cjs` | Scope validation, isolated lifecycle, aggregate diagnostics, and legacy quarantine. |
| `.opencode/hooks/goal/bin/goal.cjs` | Session-bound management and explicit legacy action envelope. |
| `.opencode/hooks/goal/pi/goal-context.ts` | Pi native identity and `/goal-pi`. |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Cursor session-bound injection. |
| `.opencode/hooks/goal/README.md` | Current state layout, support matrix, failure contract, and rollback. |

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: CE-P03
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/goal-manage-cli.md`
