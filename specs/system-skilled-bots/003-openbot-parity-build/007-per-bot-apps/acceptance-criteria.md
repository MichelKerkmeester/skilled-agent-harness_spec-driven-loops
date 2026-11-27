---
title: "Acceptance Criteria: Phase 7: per-bot-apps"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "per bot apps acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/007-per-bot-apps"
    last_updated_at: "2026-11-25T07:13:42Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: per-bot-apps

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `007-per-bot-apps`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a BOT.md whose frontmatter holds `apps: [github]`, When `parseDefinition` reads it, Then `posture.apps` is `["github"]`. Given `apps: github` or `apps: [""]`, Then it is refused as `apps-invalid` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps declaration ")` prints `Tests  3 passed` Observed 2026-11-28: `Tests  3 passed | 15 skipped (18)`. | Met | - |
| AC-002 | REQ-002 | Given a bot declaring `apps: [github, nosuchserver]` and a `.utcp_config.json` holding `github`, When `resolveApps` runs, Then it refuses as `apps-unknown-server` and the detail names `nosuchserver` and not `github` | `grep -n 'apps-unknown-server' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints one line, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps resolution refuses an unknown server name$")` prints `Tests  1 passed` Observed: one line, `.../lib/apps.ts:157`, and `Tests  1 passed | 17 skipped (18)`. | Met | - |
| AC-003 | REQ-003 | Given a run of a bot declaring `apps: [github]`, When the run reaches dispatch, Then `<runFolder>/utcp.json` exists and its `manual_call_templates` holds exactly one entry named `github`, with every other top-level key equal to the repository config's, and each `load_variables_from` entry's `env_file_path` is absolute and names the source config's dotenv file | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file writes the filtered config into the run folder$")` prints `Tests  1 passed` Observed: `Tests  1 passed | 17 skipped (18)`. The case compares the run folder copy with `design/fixtures/utcp-filtered-one.json`, dotenv path substituted. | Met | - |
| AC-004 | REQ-004 | Given a completed run, When its record is read, Then `posture.apps` is the honored names, and for a bot declaring none it is `[]` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps record ")` prints `Tests  2 passed` Observed: `Tests  2 passed | 16 skipped (18)`. | Met | - |
| AC-005 | REQ-005 | Given a run that reaches dispatch, When the call `runAuditedExecutorCommand` receives is read, Then `dispatchEnv.UTCP_CONFIG_FILE` is the absolute path of that run's filtered config and `dispatchEnvKeys` holds exactly that key, while a key outside the kind's list and outside that array is still refused | `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps child environment ")` prints `Tests  2 passed` Observed: `dispatchEnvKeys` count 2, and `Tests  2 passed | 16 skipped (18)`. | Met | - |
| AC-006 | REQ-006 | Given a repository whose bot declares a server the config does not hold, When `bot-check.cjs` runs, Then it prints a line starting `FAIL: apps-unknown-server:` and exits 1 | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` exits 1 and prints that line Observed: `FAIL: apps-unknown-server: bots/nightly-digest/BOT.md: nosuchserver` and exit 1. | Met | - |
| AC-007 | REQ-007 | Given a bot whose `apps` cannot be honored, When the run starts, Then it is refused before dispatch as `apps-refused` with failure class `author`, exits 4, and no `<runFolder>/utcp.json` is written | `grep -c "'apps-refused': { reason: 'apps-refused', class: 'author' }" .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 1, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps refusals refuses apps-refused before dispatch$")` prints `Tests  1 passed` Observed: count 1, and `Tests  1 passed | 17 skipped (18)`. | Met | - |
| AC-008 | REQ-008 | Given the shipped template, When it is read, Then it carries `apps: null` with its default named in a comment | `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line Observed: one line, `35:apps: null`. | Met | - |
| AC-009 | REQ-009 | Given the author reference and the two feature-catalog files, When they are read, Then each names the `apps` field, the checker file names `apps-unknown-server`, and the author reference names the shared-run limit: `apps` narrows a worktree run, a shared run reads the repository config, and a shared bot declaring `apps` is refused `apps-unenforceable` | `grep -l 'apps' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md .skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md .skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` prints all three paths and `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1 Observed: all three paths listed, and `apps-unenforceable` count 1. | Met | - |
| AC-010 | REQ-006 | Given the clean fixture, When `bot-check.cjs` runs, Then it still exits 0, so the new invariant refuses nothing the old checker passed | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0 Observed: exit 0 with no `FAIL` line. | Met | - |
| AC-011 | REQ-003 | Given a bot declaring no `apps` under either isolation, When the run reaches dispatch, Then `<runFolder>/utcp.json` exists with an empty `manual_call_templates` and the record's `posture.apps` is `[]` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file writes an empty template list for a bot that declares nothing$")` prints `Tests  1 passed`, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps record records an empty list for a bot that declares nothing$")` prints `Tests  1 passed` Observed: both filters `Tests  1 passed | 17 skipped (18)`. | Met | - |
| AC-012 | REQ-002 | Given a bot declaring `apps` and a checkout with no `.utcp_config.json`, When `resolveApps` runs, Then it refuses as `utcp-config-missing` rather than passing | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps resolution refuses a missing config$")` prints `Tests  1 passed` Observed: `Tests  1 passed | 17 skipped (18)`. | Met | - |
| AC-013 | REQ-003 | Given a worktree run of a bot declaring `apps: [github]`, When the run reaches dispatch, Then `<worktree>/.utcp_config.json` exists and its `manual_call_templates` holds exactly one entry named `github`, and the working tree's own file is back once the run ends | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file writes the filtered config into the worktree root$")` prints `Tests  1 passed`, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file restores the worktree file after the run$")` prints `Tests  1 passed` Observed: both filters `Tests  1 passed | 17 skipped (18)`. The restore case fails when the after-exit restore is removed. | Met | - |
| AC-014 | REQ-005 | Given a bot declaring `apps` with `isolation: shared`, When the run starts, Then it is refused before dispatch as `apps-unenforceable` with failure class `author`, exits 4, and writes no filtered config | `grep -c "'apps-unenforceable': { reason: 'apps-unenforceable', class: 'author' }" .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 1, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps refusals refuses apps-unenforceable on a shared run$")` prints `Tests  1 passed` Observed: count 1, and `Tests  1 passed | 17 skipped (18)`. | Met | - |
| AC-015 | REQ-003 | Given a worktree run killed between the filtered write and the restore, When the next run opens that tree, Then the tree's own `.utcp_config.json` is back before anything else is written, and the filtered copy is not the base the next run copies from | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts -t "^apps written file restores a tree left holding the filtered file at the next open$")` prints `Tests  1 passed` Observed: `Tests  1 passed | 17 skipped (18)`. The case fails when the next-open restore is removed. | Met | - |
| AC-016 | REQ-010 | Given the five documents under `design/`, When each verify command in them runs with no tty, Then it prints what the document says, and the documents fix every field, the gate order, the file's four states, the six refusal names, the fixture matrix and the text an operator reads | `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design` prints `fixtures`, `fixtures.md`, `mockups.md`, `records.md`, `refusals.md` and `state-machines.md`, and the three commands in `design/fixtures.md` section 5 print their stated lines Observed: `ls design` printed the five documents and `fixtures`, and the three section 5 commands printed `5 goldens parse`, `4 top-level keys, 1 template and 0 templates, absolute dotenv path` and `worktree apps github, shared apps empty`. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All sixteen rows are Met with observed evidence from 2026-11-28. The runtime suite holds 44 files and 567 tests, all passing, against a floor of 43 files and 548 tests. The typecheck exits 0.
<!-- /ANCHOR:closure -->
