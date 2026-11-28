---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "per bot apps implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/007-per-bot-apps"
    last_updated_at: "2026-11-25T07:13:42Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-per-bot-apps"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-per-bot-apps |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bot now names the connector servers it may reach with `apps: [github]`, and each run gets a UTCP config holding only those servers. Leave the key out and the run reaches no server. A name the config does not hold is refused and never dropped, and the run record says which servers were honored.

### Phase 7: per-bot-apps

`apps.ts` is the one reader of the checkout's `.utcp_config.json` and the one writer of a run's filtered copy. Every run writes `<runFolder>/utcp.json` before any tree exists. It keeps every top-level key of the source, filters `manual_call_templates` to the honored names in source order and makes each relative dotenv path absolute. A run that declares nothing writes `{"manual_call_templates": []}` without reading the source, so a missing or broken config can never widen it. A worktree run also gets the same bytes at `<worktree>/.utcp_config.json` as the last step before dispatch, which is the path the project MCP pins already name, and the tree's own file is put back in a `finally` around the dispatch. A resumed run restores a reopened tree whose file differs from the checkout's from the tree's own git index before it writes anything, which covers a run killed between the write and the restore.

The child gets `UTCP_CONFIG_FILE` on the one new `DispatchInput.extraEnv` field. `dispatchInLineage` merges it into `dispatchEnv` and passes its key names as `dispatchEnvKeys`, and the deep-loop gate admits a listed key only when it is `UTCP_CONFIG_FILE` or matches `^SKILLED_BOT_SECRET_[A-Z0-9_]+$`. A bot that declares `apps` on a run without its own tree is refused `apps-unenforceable` before any config is read. A declaration the config cannot honor is refused `apps-refused` with the resolver's reason as its detail. The checker fails `apps-unknown-server` with the same resolver, and a checkout with no config prints an `INFO` line instead.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/apps.ts` | Created | `readUtcpServerNames`, `resolveApps` and `writeRunUtcpConfig`, each returning a named refusal, and the after-exit restore `restoreTreeUtcpConfig` |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modified | `apps` in the closed key set, `Posture.apps` and the untrimmed list predicate refusing `apps-invalid` |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modified | `HonoredPosture.apps: string[]`, validator unchanged |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Modified | Seeds `apps: []` in the honored posture |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modified | `DispatchInput.extraEnv`, merged into `dispatchEnv` and named as `dispatchEnvKeys` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | The two causes, the seed, the isolation test, the resolve and run-folder write, the tree write with the after-exit restore, the child key and the next-open restore |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | `dispatchEnvKeys` on the input and the bounded caller namespace in `assertDispatchEnvAllowed` |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modified | `apps-unknown-server` in the hard invariants and one resolver call per declaring definition |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/` | Created | The defect fixture, its own one-server `.utcp_config.json` included |
| `.skilled/skills/system-skilled-bots/runtime/tests/apps.vitest.ts` | Created | Six describe blocks and twenty tests over the matrix, the goldens, the record, the child key, both refusals and the planted-link cases |
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Modified | The defect row, the fixture's root config copied and kept out of the one-defect count |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modified | The exact-shape posture assertion gains `apps: []` |
| `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts`, `posture.vitest.ts`, `activity.vitest.ts`, `run-record.vitest.ts` and `status-support.ts` | Modified | One posture literal each gains the new field, outside the planned file list (see Key Decisions) |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modified | `apps: null` with its default in a comment |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modified | The field in the template list and the shared-run limit |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md` | Modified | The field in the field list |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` | Modified | The invariant and the `INFO` case |

### Follow-up: a planted link at the tree config

A review found that the restore after the child exits wrote the tree's own config with a plain write, so a child that replaced the tree's `.utcp_config.json` with a link to a file outside the tree made the restore write that outside file. The tree write had the same root: its temp name was predictable and written with a plain write, and it read the tree's own file through any link. The temp name now carries a random UUID and is created exclusively, the tree write refuses a path that is not a regular file as `utcp-config-unwritten` and the restore moved into `apps.ts`, where it removes a link or a directory before it puts the tree's own file back. The next-open restore removes such an entry before its compare, so git puts the tracked file back (REQ-011, AC-017). Two tests in the `apps written file` block fail against the old code and pass now. A restore that fails leaves the path as it is, and the next open of the tree repairs it.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every change was written by a `cli-mistral-vibe` worker at `deepseek-flash` from a one-change brief with the decisions copied in, and the orchestrator ran each verify command itself before the next wave. Wave 1 ran fourteen workers at once on disjoint files: the parser, the record type, the module, the gate, the dispatch field, the posture seed, the template, the three docs, the fixture, the checker test, the runner test and the collateral test literals. Wave 2 ran the checker beside a serial slot of four runner briefs, each verified before the next started. Wave 3 wrote the test suite. No worker failed a verify, so no retry and no `cli-pi` fallback ran. The two restore tests were then checked against a runner with each restore removed: both failed, so they test the restore and not the setup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Five test files outside the file list gained the new field | `tests/**` is in the typecheck, and `definition.vitest.ts` compares the parsed posture with `toEqual`. A dry run of the two type changes broke the typecheck in `activity.vitest.ts`, `definition.vitest.ts`, `posture.vitest.ts`, `run-record.vitest.ts` and `status-support.ts`, so each gained one field. No unit running beside this one writes those files |
| `bot-check.vitest.ts` copies a fixture's root `.utcp_config.json` and leaves it out of the one-defect count | The suite copied only `bots/`, so the designed fixture would print `INFO` and exit 0, and its added config file would count as a second defect |
| The run folder copy for a bot that declares nothing is `{"manual_call_templates": []}`, while the writer given a source and no names matches `utcp-filtered-none.json` | `records.md` sections 1 and 4.4 read differently on this. The runner never reads the source for an empty declaration, which keeps the fail-closed rule. The golden stays the writer's shape |
| One `writeRunUtcpConfig` writes the run folder copy from a source, or copies those bytes into a tree | The run folder copy must exist before the tree and the tree copy after it. The plan fixes three exports and the module stays the only writer |
| The unknown-name detail has no backticks | The mockups and the matrix print `nosuchserver` bare, while `refusals.md` section 2 says each name in backticks. The literal surfaces win |
| The next-open restore runs only on a reopened tree and removes a file the tree's index does not track | Only a resume reopens a tree, and a fresh tree comes from git with its own file. An untracked copy has no index answer, so it is one a run left |
| Runner literal counts follow the acceptance rows, not the plan's affected-surfaces table | The plan row's bare counts (`apps-refused` 1, `apps-unenforceable` 1, `utcp_config.json` 2) cannot hold with real call sites. The whole-literal counts hold at 1, and the runner names the file through `UTCP_CONFIG_NAME` |
| The no-throw check now matches the whole word | The `throwIfNoEntry` option name holds the letters `throw`, so `grep -c 'throw'` would count it. `grep -cw 'throw'` still finds any real throw statement |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS: `Test Files  44 passed (44)`, `Tests  567 passed (567)`, exit 0. Floor: 43 files and 548 tests |
| `npm run typecheck` in the runtime | PASS: exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS: exit 0, lib 98, cli 8, panes 53 with 1 ignored, render keys 16, the same as the floor |
| Deep-loop executor-audit tests, seven files | PASS: 161 passed before and after, and the deep-loop typecheck exits 0 |
| The six `apps.vitest.ts` filters | PASS: 3, 4, 5, 2, 2 and 2 passed |
| Checker on `apps-unknown-server` and on `clean` | PASS: `FAIL: apps-unknown-server: bots/nightly-digest/BOT.md: nosuchserver` with exit 1, then exit 0 |
| Grep counts the goal names | PASS: `dispatchEnvKeys` 2, `extraEnv` 3 in dispatch and 1 in the runner, `apps: null` one line, `apps-unenforceable` 1 |
| Design section 5 commands | PASS: all three printed their stated lines |
| The link follow-up | PASS: the two new `apps written file` cases failed against the base `apps.ts` and `runner.ts` and pass now, `apps.vitest.ts` 20 passed, `npm test` 57 files and 798 tests against a floor of 57 files and 796 tests, typecheck exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`apps` narrows only a run with its own tree.** A shared run that declares nothing records `[]` while its child reads the repository config through the project pin, and `cli-mistral-vibe` starts its child in a temporary folder, so it reads neither copy. Both are named limits in `design/records.md` section 5.1.
2. **A parse refusal still records the reason only.** The runner folds `apps-invalid` into `definition-malformed` with detail `apps-invalid`, not `apps-invalid: apps: expected a list of server names` as `design/refusals.md` section 1 shows, because the runner passes every parse refusal's reason and not its detail. Changing that would change every parse refusal's detail, so it is left for a later owner of `runner.ts`.
3. **Design text the code does not match.** `design/mockups.md` section 1 shows three checker lines for the defect fixture, while the checker prints its other `PASS` lines too. `design/state-machines.md` section 4.1 draws one write call where the code makes two. `scripts/fixtures/README.md` still says only `duplicate-id` adds a file and lists no `apps-unknown-server` row, and `runtime/lib/README.md` has no `apps.ts` row. None of those files is in this phase's list.
<!-- /ANCHOR:limitations -->

---
