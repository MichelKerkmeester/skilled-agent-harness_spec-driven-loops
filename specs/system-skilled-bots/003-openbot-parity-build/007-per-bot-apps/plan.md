---
title: "Implementation Plan: Phase 7: per-bot-apps"
description: "Adds an apps key to the BOT.md parser, a runtime module that filters the repository UTCP config into each run folder, an apps list on the honored posture, the child environment key that points at it, and a fail-closed checker invariant."
trigger_phrases:
  - "per bot apps plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: per-bot-apps

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22+, loaded through the runtime's own `tsx`; the checker is CommonJS |
| **Framework** | None; the bots runtime is a flat module set over the deep-loop executor tables |
| **Storage** | JSON files: the repository `.utcp_config.json`, the per-run `<runFolder>/utcp.json`, and the run record |
| **Testing** | Vitest in `.skilled/skills/system-skilled-bots/runtime`, plus the checker's fixture-driven suite |

### Overview
One new module, `apps.ts`, reads the repository UTCP config, refuses a declared name it does not hold, and writes a filtered copy into the run folder and, for a run with its own worktree, into the worktree root, which is the path the project MCP configs already pin. The runner calls it between the posture check and dispatch, records the honored names on the run record, and hands the child the file's absolute path in `UTCP_CONFIG_FILE`, admitted through a per-dispatch key list rather than a widened kind list. A run that declares `apps` and has no worktree is refused `apps-unenforceable`, because there is nowhere to place the file without dirtying the checkout. A shared run that declares no `apps` still writes the run-folder copy and records `[]`, but its child reads the repository config through the pin, so `apps` narrows a worktree run only; the risk table names that limit rather than claiming a narrowing the pin prevents. The checker imports the same predicate, so a name the runner would refuse fails the check first.
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
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` prints `Test Files` with no failed file and exits 0
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints `FAIL: apps-unknown-server:` and exits 1
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered module set with named refusals.

### Key Components
- **`apps.ts` (new)**: the only reader of `.utcp_config.json` and the only writer of a run's filtered config. Exports `readUtcpServerNames`, `resolveApps` and `writeRunUtcpConfig`, each returning a `Result` with a named reason rather than throwing, so the checker and the runner report the same refusal. `writeRunUtcpConfig` writes `<runFolder>/utcp.json` and, when the run has a worktree, `<worktree>/.utcp_config.json`, and makes each `load_variables_from` entry's `env_file_path` absolute against the source config's folder.
- **`definition.ts`**: gains `apps` in `FRONTMATTER_KEYS` and a list predicate, so a malformed list is refused at parse time like every other field.
- **`runner.ts`**: calls `resolveApps` after `validatePosture` and before the worktree, writes the config, sets `seed.posture.apps`, passes `UTCP_CONFIG_FILE` in the environment handed to `dispatchHeadless` and names it in `dispatchEnvKeys`, restores the worktree's own file after the child exits, which covers the working tree and not a commit the child made, and refuses `apps-unenforceable` when the definition declares `apps` and `isolation` is not `worktree`.
- **`run-record.ts`**: `HonoredPosture` gains `apps: string[]`. The record validator checks the posture block's shape and not its keys, so no validator change is needed.
- **`executor-audit.ts`**: `RunAuditedExecutorCommandInput` gains `dispatchEnvKeys?: string[]`, and `assertDispatchEnvAllowed` accepts a key that is in the kind's list or in that array. A prefix rule is not used: it would admit any future caller's key built from a bot-controlled name.
- **`bot-check.cjs`**: gains `apps-unknown-server` in `HARD_INVARIANTS` and one call to `resolveApps` per definition, so the checker restates no field rule.

### Data Flow
`BOT.md` → `parseDefinition` → `Posture.apps` → `resolveApps` against `.utcp_config.json` → honored names → `writeRunUtcpConfig` writes `<runFolder>/utcp.json` and, for a worktree run, `<worktree>/.utcp_config.json` → `seed.posture.apps` on the record → `UTCP_CONFIG_FILE` in the child environment, named in `dispatchEnvKeys` → the Code Mode server resolves that path instead of the repository config, and the project pin's relative value resolves to the same file because the child's working directory is the worktree. A shared run diverges at the last step: its working directory is the checkout, so the pin resolves to `<checkout>/.utcp_config.json` and the child reads the repository config, which is the limit the risk table names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a field and a fail-closed default, so it touches a shared dispatch-env gate, a record schema and a checker invariant.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Owns `DISPATCH_ENV_KEYS`, the per-kind list of caller-named keys, and `assertDispatchEnvAllowed` | update: add `dispatchEnvKeys?: string[]` to the input and accept a key in that array | `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2, and a test proves a key outside both lists is still refused |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Owns the frontmatter key set and the field predicates | update: add `apps` and its list predicate | `grep -n "'apps'" .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` prints the key-set line |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Owns `HonoredPosture` and the record validator | update: add `apps`; validator unchanged | `grep -n 'apps' .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` prints the interface line |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Owns the run order and the refusal causes | update: resolve, write both copies, record, set the child key and its `dispatchEnvKeys` entry, restore the worktree file, add `apps-refused` and `apps-unenforceable` | `grep -c 'apps-refused' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 1 and `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 1 |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Owns the invariant lists and the audit | update: add the invariant and its call | `grep -n 'apps-unknown-server' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` prints two lines |
| `.skilled/skills/mcp-code-mode/mcp-server/dist/index.js` | Reads `UTCP_CONFIG_FILE` before falling back to the working directory | not a consumer of this change: it already resolves the key | `grep -n 'UTCP_CONFIG_FILE' .skilled/skills/mcp-code-mode/mcp-server/dist/index.js` prints the lookup line |
| `.claude/mcp.json`, `.codex/config.toml`, `opencode.json`, `.cursor/mcp.json`, `.mcp.json` | Pin `UTCP_CONFIG_FILE` to `.utcp_config.json` in each MCP server block | unchanged: the pin stays, and the worktree write is what makes it resolve to the filtered file; for a shared run the pin resolves against the checkout, which is the named limit | `grep -n 'UTCP_CONFIG_FILE' .claude/mcp.json` still prints line 9 |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` | Asserts the pin is present | unchanged: the pin stays | `grep -n 'UTCP_CONFIG_FILE' .skilled/commands/doctor/scripts/mcp-doctor-lib.sh` still prints two lines |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Indexes run rows | not a consumer: it holds no posture column | `grep -c 'posture' .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints 0 |

Required inventories:
- Same-class producers: `grep -rn 'manual_call_templates' .skilled --include='*.ts' --include='*.cjs'` names every reader of the server list; `apps.ts` must be the only new one.
- Consumers of changed symbols: `grep -rn 'HonoredPosture' .skilled/skills/system-skilled-bots/runtime` names `posture.ts`, `runner.ts` and `run-record.ts`; `grep -rn 'FRONTMATTER_KEYS' .skilled/skills/system-skilled-bots` names `definition.ts` alone.
- Matrix axes: declaration (`absent`, `null`, `[]`, one name, all 14 names, one unknown name) crossed with config state (`present`, `missing`, `malformed`) is the required row set for `apps.vitest.ts`.
- Algorithm invariant: the filtered config's `manual_call_templates` is a subset of the source list, in source order, and every other top-level key is byte-identical to the source except `load_variables_from`, whose `env_file_path` is made absolute against the source config's folder. Adversarial cases: a name differing only by case, a name that is a prefix of another, a duplicate name in the declaration, a config whose `manual_call_templates` is absent, and a relative `env_file_path` that would otherwise resolve inside the run folder.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `definition.ts`, `run-record.ts`, `runner.ts`, `bot-check.cjs` and the deep-loop dispatch-env gate, and records the 14-server count. Implementation adds `apps.ts`, the `apps` field, the record field, the runner call, the `dispatchEnvKeys` entry and the checker invariant. Verification runs the checker on the new defect fixture and on `clean`, then the runtime suite and the typecheck.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveApps` and `writeRunUtcpConfig` over the declaration and config matrix, and `parseDefinition` on a malformed `apps` | Vitest, `runtime/tests/apps.vitest.ts` |
| Integration | One run of a bot declaring `apps: [github]` and one declaring none, asserting the written file, the record's `posture.apps` and the child environment key; the absent-declaration case runs under both isolations, so a shared run's written file and `[]` record are proven even though its child reads the repository config | Vitest, `runtime/tests/apps.vitest.ts` over `runner-support.ts` |
| Integration | A worktree run, asserting `<worktree>/.utcp_config.json` holds one template and the tree's own file is back after the run; and a `isolation: shared` run declaring `apps`, asserting `apps-unenforceable` | Vitest, `runtime/tests/apps.vitest.ts` over `runner-support.ts` |
| Unit | `assertDispatchEnvAllowed` admits a key named in `dispatchEnvKeys` and still refuses one named in neither list | Vitest, `runtime/tests/apps.vitest.ts` |
| Integration | The checker over the new defect fixture and over `clean` | Vitest, `runtime/tests/bot-check.vitest.ts` |
| Manual | `/doctor:bots` over a repository whose bot declares an unknown server | The command, read-only |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `yaml` 2.9.1, already in the runtime manifest | Internal | Green | The parser cannot read frontmatter |
| `vitest` 4.1.12, already in the runtime manifest | Internal | Green | No test can run |
| The deep-loop dispatch-env gate | Internal | Green | The child never sees `UTCP_CONFIG_FILE`, so the filtered config is written and unread |
| The repository `.utcp_config.json` | Internal | Green | No server names to check a declaration against; the run refuses when `apps` is declared |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run that declares `apps` reaches a server it did not declare, or a bot that declares none loses a connector it needs before the follow-up lands.
- **Procedure**: revert the one commit. The `apps` key leaves the parser's key set, so a definition that declares it is refused as `definition.unknown-key` again, the checker's invariant list loses its row, and `dispatchEnvKeys` leaves the executor input. No state file needs cleaning: the filtered config lives inside a run folder, and a run folder is evidence, not input. A worktree whose run was killed before the restore keeps the filtered copy, and the next run of that bot rewrites it.
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
| Setup | Nothing; it reads the five files and records the server count | Implementation, which needs the parser's key set and the runner's refusal-cause table |
| Implementation | Setup, whose reads fix the exact insertion points | Verification, which exercises the written file and the invariant |
| Verification | Implementation, whose module and invariant it runs | Phase 8, which injects secrets into the same per-run config |
<!-- /ANCHOR:phase-deps -->

---
