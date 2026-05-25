---
title: "DOC-345 -- Version migration 3.3.0.0 to 3.4.1.0"
description: "Manual scenario validating /doctor:update --migrate two-hop migration from v3.3.0.0 to v3.4.1.0 with legacy files flagged but not deleted."
---

# DOC-345 -- Version migration 3.3.0.0 to 3.4.1.0

## 1. OVERVIEW

This scenario validates the end-to-end declared migration path from `3.3.0.0` to `3.4.1.0`. The operator starts from a fresh clone at tag `v3.3.0.0`, updates to current, runs `/doctor:update --migrate`, and verifies the manifest chain `3.3.0.0 -> 3.4.0.0 -> 3.4.1.0`.

Legacy `memory/*.md` files must be detected and recommended for cleanup, not deleted. If no `v3.3.0.0` fixture or tag is available, this scenario is truthfully `UNAUTOMATABLE`.

---

## 2. SCENARIO CONTRACT

- Objective: Two-hop version migration from `3.3.0.0` to `3.4.1.0`.
- Playbook ID: DOC-345.
- Real user request: `Simulate a new user at v3.3.0.0. They git-pull to current. Run /doctor:update --migrate.`
- Prompt: `Simulate a new user at v3.3.0.0. They git-pull to current. Run /doctor:update --migrate.`
- Preconditions: A fresh clone or fixture at tag `v3.3.0.0` exists; after updating to current, the runtime can invoke `/doctor:update --migrate`.
- Expected execution process: Create the `v3.3.0.0` fixture, pull or switch to current code, run migration, verify two-hop state log, and confirm legacy files remain present but flagged.
- Expected signals: manifest chain `3.3.0.0 -> 3.4.0.0 -> 3.4.1.0`, legacy `memory/*.md` files detected but not deleted, new schema active, and final status OK.
- Desired user-visible outcome: A migration verdict proving the declared chain completes and legacy cleanup remains opt-in.
- Pass/fail: PASS if the two-hop migration runs, new schema is active, and legacy files are flagged but preserved.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Simulate a new user at v3.3.0.0. They git-pull to current. Run /doctor:update --migrate.
```

### Commands

1. Verify a `v3.3.0.0` tag, fixture, or archived checkout is available.
2. If no fixture exists, mark `UNAUTOMATABLE` with that concrete reason and stop.
3. Create a fresh disposable clone at `v3.3.0.0`.
4. Confirm doctor update commands are absent or not yet current in the pre-upgrade checkout.
5. Create or verify representative legacy `memory/*.md` files if the fixture does not already contain them.
6. Update the clone to current `3.4.1.0` code.
7. Run `/doctor:update --migrate` through the real runtime.
8. Capture migration output, legacy detection output, and `.doctor-update.last-run.json`.
9. Verify new schema state and confirm legacy files still exist unless a separate cleanup command was run.

### Expected

The command reads `migration-manifest.json`, recognizes `3.3.0.0` as a valid source, and executes the declared chain `3.3.0.0 -> 3.4.0.0 -> 3.4.1.0`. It runs or falls back through the declared migration operations for continuity, graph metadata, code graph, context index, skill graph, deep-loop graph, and Code Graph refresh. Legacy `memory/*.md` files are detected and flagged under ADR-008 detect-and-recommend semantics but are not deleted.

### Evidence

- Fixture proof showing source checkout or tag `v3.3.0.0`.
- Migration manifest excerpt showing the `3.3.0.0 -> 3.4.0.0 -> 3.4.1.0` chain.
- `/doctor:update --migrate` transcript.
- State log showing the two-hop migration and executed migration IDs or fallback operations.
- Legacy `memory/*.md` files present before and after, plus output flagging them for optional cleanup.
- New schema evidence for current DBs and required metadata files.

### Pass / Fail

- **PASS**: migration follows the two-hop manifest chain, final status is OK, new schema state is active, and legacy files are flagged but preserved.
- **FAIL**: migration skips a declared hop, deletes legacy files without `--cleanup-legacy`, leaves schema inactive, or reports success without state-log evidence.
- **SKIP**: temporary git or sandbox setup failure after a valid `v3.3.0.0` fixture is confirmed.
- **UNAUTOMATABLE**: no `v3.3.0.0` fixture, tag, or archived checkout is available.

### Failure Triage

If no fixture exists, do not fabricate the scenario; record `UNAUTOMATABLE`. If legacy files are deleted, inspect ADR-008 handling and `doctor_update.yaml` Phase 9 cleanup gating. If the chain omits `3.4.0.0`, inspect `migration-manifest.json` `upgrade_paths` for `3.3.0.0`.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../mcp_server/database/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-345
- Feature name: Version migration 3.3.0.0 to 3.4.1.0
- Command mode: `/doctor:update --migrate`
- YAML asset: `doctor_update.yaml`
- Manifest asset: `migration-manifest.json`
- Migration chain: `3.3.0.0 -> 3.4.0.0 -> 3.4.1.0`
- Runtime policy: Real fixture-based migration only.
- Destructive: Yes; disposable clone only.
- Feature file path: `23--doctor-commands/345-version-migration-3.3.0.0-to-3.4.1.0.md`
