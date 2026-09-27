---
title: "Implementation Summary: Remediating the Cross-CLI Test Findings"
description: "OpenCode now loads the advisor plugin, a sandboxed advisor keeps every state file inside its sandbox, and the scenarios phase 8 failed now observe what they expect. The related scenarios were rerun in all five CLIs."
trigger_phrases:
  - "test findings remediation summary"
  - "opencode advisor plugin loads"
  - "sandboxed advisor state containment"
  - "cross cli rerun results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation"
    last_updated_at: "2026-09-27T06:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Deleted the stale jcode Codex hook entry"
    next_safe_action: "None. Phase 10 ran the installer and restored the trust"
    blockers: []
    key_files:
      - ".skilled/bin/install-codex-hooks.mjs"
      - ".opencode/plugins/system-skill-advisor.js"
      - ".opencode/plugins/lib/skill-advisor-render.js"
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-27-030-009-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Remediating the Cross-CLI Test Findings

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-test-findings-remediation |
| **Completed** | 2026-09-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An OpenCode session now gets the advisor brief and the status tool, which it never did before, because OpenCode refused the plugin module. A test or scenario that starts its own advisor now keeps every state file in its own sandbox, so it can no longer mark the live advisor unavailable. The scenarios phase 8 failed now run commands that show the signals they check.

### Phase 9: test-findings-remediation

**The OpenCode plugin loads (F10, F15, CL-005 gap).** OpenCode 1.18.32 treats every named export of a plugin module as a plugin, and it rejected the advisor plugin with `Plugin export is not a function`. The module now exports only its default factory, and the constants and helpers the tests use live in `.opencode/plugins/lib/skill-advisor-render.js`. The `.opencode/bin` symlink the plugin resolves its CLI through is back. CL-005 now loads the plugin in a live OpenCode run, since a unit-test pass is what let F10 go unseen.

**A sandboxed advisor stays in its sandbox (F3, F17).** When `SYSTEM_SKILL_ADVISOR_DB_DIR` is set, the generation file, the watcher's quarantine database, the launcher state file and lock, and the model-server directory all move under that override. Without it, every path is where it was. The launcher also gives its daemon child `HF_EMBED_SERVER_URL`, so the child's embedding client finds the model-server socket the launcher arms rather than looking one directory lower.

**A second launcher no longer shuts down the live advisor (F21).** The launcher reclaimed any owner lease whose process had pid 1 as its parent, and the CLI starts every launcher detached, so every healthy owner qualified. A second launcher on the same database then deleted the owner lease, and the healthy owner shut itself and its daemon down at its next heartbeat. The reruns caught it when scenario 433 cold-started a launcher on a sandbox socket against the live database. A lease is now reclaimable only for a dead pid or a stale heartbeat, which is what the lease contract always said. Scenario 433 also sandboxes its database and stops only its own launcher, as CP-004 does.

**Tests and harnesses match the code (F11, F13, F14, F16, F20).** The Pi debug test expects the current `fallback(headless)` label. The Pi preflight test expects a missing stdin redirect to block, since that rule became a hard rule, and it tests the advisory path with a rule that is still advisory. The directive-lifecycle harness spawns the current dist tree. The stale compiled `deep/review` contract was regenerated. The local-native divergence ledger records `rr-iter3-093`, where the Python scorer drifted on the live skill graph and the native scorer kept the gold skill.

**The disabled reason names the flag that is set (F7).** `advisor_recommend` reports whichever disable flag is set to `1`, the current name or the legacy `SPECKIT_` name.

**Scenarios and docs observe what they claim (F1, F2, F4, F9, F12, F18, F19, F22).** CL-001 and CP-003 read the advisor diagnostic from the diagnostics JSONL, because the spec-kit shim does not forward its child's stderr. CL-006 keeps the trust-grant output it checks. CP-004 runs in its own sandbox with its own socket and database directories and the model server off. It stops its launcher by the pid recorded in the sandbox state file, and only when that launcher's socket lives inside the sandbox. NC-004 states the score-gap or confidence-gap rule the scorer uses. Scenario 457 runs the Pi suite under its config and records step 6 by hand. CL-005 passes on a green suite rather than a fixed test count, and reads the brief's `live` or `stale` freshness instead of a route label that only the plugin's internal metadata carries. The advisor state README, four advisor references and READMEs, and the Codex hook parity playbook now state where each state file lives and how Codex loads hooks.

**cli-cursor (F6, F8).** Commit `ac156a7112` names `gemini-3.8-flash-high` and documents that a `--sandbox enabled` dispatch cannot reach the advisor daemon and gets a degraded `local-scorer` answer.

**The installer removes the duplicate Codex hook entries (F5).** The writer was `.skilled/bin/install-codex-hooks.mjs` in write mode, which copied all 18 project entries into `~/.codex/hooks.json`. Codex also loads `.codex/hooks.json` for this trusted checkout, so every hook ran twice. A live Codex run from the checkout started 16 SessionStart hooks: the project file's 6, the global copy's 6 and 4 third-party ones. The global copy's commands also `cd` into this checkout, so they ran this repository's hooks in Codex sessions started anywhere. The operator chose a removal-only installer on 2026-09-27. It now removes repo-owned entries and orphans from the global file, keeps every third-party entry, never adds, and backs up before any write. `--check` reports `duplicate=N` while a copy remains. Eleven docs that described the old copy contract, or told a tester to look for the repo hooks in the global file, now say Codex reads the checkout's `.codex/hooks.json`. The installer's one write to `~/.codex/hooks.json` is the operator's, under Known Limitations. At the operator's request the session deleted one stale third-party entry there, the jcode SessionStart hook.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/system-skill-advisor.js` | Modified | Default export only |
| `.opencode/plugins/lib/skill-advisor-render.js` | Created | Brief rendering constants and helpers |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modified | Import the helpers and assert the default-only export and the CLI symlink |
| `.opencode/bin` | Created | Symlink to `../.skilled/bin` |
| `runtime/lib/freshness/generation.ts`, `runtime/lib/daemon/watcher.ts` | Modified | Generation file and quarantine database follow the override |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | State file, lock and model server follow the override; the child gets the model-server address |
| `runtime/handlers/advisor-recommend.ts` | Modified | Disabled reason names the flag that is set |
| `.skilled/bin/system-skill-advisor-launcher.cjs`, `runtime/tests/launcher-reap-pid-reuse.vitest.ts` | Modified | A live owner with a fresh heartbeat is never reclaimed for its parent pid |
| Seven advisor runtime tests (`state-containment`, `advisor-status`, `daemon-freshness-foundation`, `advisor-recommend`, `launcher-lease`, `launcher-model-server-default`, `launcher-bootstrap`) | Modified | Each new behavior, and each fails against the base code |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Ledger entry `rr-iter3-093` |
| `.skilled/hooks/dispatch/pi/directive-dedup.test.ts`, `dispatch-preflight-lint.test.ts` | Modified | Current label and rule classes |
| `specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/runtime/run-registered-adapter-cadence.mjs`, `deterministic-advisor-target.mjs` | Modified | Current dist paths |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.md` | Modified | Regenerated from the current sources |
| Six advisor scenarios (CL-001, CL-005, CL-006, CP-003, CP-004, NC-004), spec-kit `directive-lifecycle-dedup.md` and `cli-hook-transport-down-fail-open.md` (433) | Modified | Observable commands and signals, and a fully sandboxed 433 |
| `.skilled/skills/.state/advisor/README.md`, advisor `db-path-policy.md`, `daemon-lease-contract.md`, `runtime/README.md`, `runtime/database/README.md` | Modified | State file locations and the sandbox override |
| cli-external-orchestration `codex-hook-parity.md` | Modified | Current Codex hook loading, adapter count and packet path; step 4 runs from the checkout and step 5 checks removal |
| `.skilled/bin/install-codex-hooks.mjs`, `.skilled/bin/tests/install-codex-hooks-source-root.test.cjs` | Modified | Removal-only installer, with its tests rewritten to the new contract |
| `.codex/SYNC.md`, `.codex/hooks/README.md`, `.skilled/bin/README.md`, `.skilled/hooks/README.md`, `hook-install/README.md`, `codex-watchdog/README.md`, cli-codex `README.md`, `references/hook-contract.md`, scenario CX-016 and its index row | Modified | Codex reads the trusted checkout's `.codex/hooks.json`, and the installer removes copies of it from the global file |
| `~/.codex/hooks.json`, the operator's global file outside the repository | Modified | The stale jcode SessionStart entry removed at the operator's request, after a backup to `~/.codex/hooks.json.bak-jcode-2026-09-27T05-48-23Z` |
| `evidence/` | Created | Rerun reports, the dispatch ledger, the briefs and the native hook records |

`runtime/` means `.skilled/skills/system-skill-advisor/runtime/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator verified each phase 8 finding against the code or a rerun before writing a brief. Each code finding got an implementer brief and a verifier brief with disjoint file sets and base commit `fa4f76d881`. Grok 4.7 xhigh fast through cli-cursor implemented, and GPT-6 Luna max fast through cli-codex verified, including a reverse check that the new test fails against the base code. Opus agents wrote the scenario and doc fixes. The orchestrator treated every verifier verdict as a claim and reran the gate itself when a verifier could not, since the Codex workspace sandbox refuses socket `listen` with EPERM and has no network for `npx`.

F5's installer change followed the same pattern on base `44dcdc2f82`. Grok implemented it, Luna verified it, and an Opus agent rewrote the docs. The orchestrator ran the read-only checks against the real global file itself. When the operator then asked for the stale jcode entry to go, the orchestrator backed the file up, deleted that one group, and reran the read-only checks and a live Codex run.

The rerun dispatched each of the nine scenarios in cli-pi (MiMo v2.6 Pro high), cli-opencode (MiMo v2.6 Pro high), cli-devin (SWE 2 high), cli-cursor (Grok 4.7 high) and cli-codex (GPT-6 Luna high), with `SKILL_ADVISOR_DEBUG=1` so each runtime's native advisor calls land in the diagnostics JSONL.

| Scenario | pi | opencode | devin | cursor | codex |
|---|---|---|---|---|---|
| CL-001 | PASS | PASS | PASS | PASS | PASS |
| CL-005 | PASS | PASS | PASS | PASS | PASS |
| CL-006 | PASS | PASS | PASS | PASS | PASS |
| CP-003 | PASS | PASS | PASS | PASS | PASS |
| CP-004 | PASS | PASS | PASS | PASS | PASS |
| NC-001 | PASS | PASS | PASS | PASS | PASS |
| NC-004 | PASS | PASS | PASS | PASS | PASS |
| 433 | PASS | PASS | PASS | PASS | PASS |
| 457 | PASS | PASS | PASS | PASS | PASS |

Three Codex CL-005 runs came before this final PASS. The first failed on the pinned 40-test count (F19). The second was blocked when Codex returned the live OpenCode step after 30 s with no exit code, and its rerun got a 180 s command timeout. The third failed on a route label no step shows (F22). The Pi and OpenCode 433 runs made before F21 passed on the old scenario but displaced the live advisor, so both reran on the sandboxed scenario. `evidence/excluded-windows.tsv` lists each superseded run.

Native delivery during the reruns, from the diagnostics JSONL and each tester's view of its own context:

| Runtime | Native advisor line | Records |
|---|---|---|
| Pi | Every prompt | 20 records, all `ok/live` or a `skipped` casual prompt |
| OpenCode | Every prompt, through the plugin | The plugin writes no JSONL records. Each tester saw the `Advisor:` line and CL-005 listed the status tool |
| Devin | Every prompt | 9 records, 8 `ok/live` and 1 fail-open at the 2.2 s budget while the full advisor suite loaded the machine |
| Cursor | None | `beforeSubmitPrompt` never fires under `cursor-agent -p`, re-probed on this Cursor version |
| Codex | Every prompt, twice | 20 records in 10 pairs whose two calls finished within 350 ms of each other (F5). 1 pair failed open together at 2.2 s |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the plugin helpers to a sibling module, not an `export default` object | OpenCode calls every export of a plugin module. A helper module keeps one factory export and lets the tests import the helpers directly |
| Honor `SYSTEM_SKILL_ADVISOR_DB_DIR` for every state file, not only the database | Phase 8 showed each shared file (generation, launcher state, quarantine database, model server) letting a sandbox reach the live advisor |
| Keep an explicit empty quarantine path winning over the override (`override != null`) | The base code used `??`, so an explicit empty string was a caller's choice. The verifier showed a truthiness check dropped it |
| Leave the spec-kit shim silent and read the diagnostic from the JSONL | The shim has not forwarded its child's stderr since before July 2026, and the JSONL is the observable channel |
| Record `rr-iter3-093` in the divergence ledger instead of changing a scorer | Neither scorer changed. The Python side drifted with the live skill graph and native stayed on the gold skill, which the ratchet's own contract says to record |
| Make the installer removal-only, and leave its one run against the real file to the operator | The operator chose this on 2026-09-27 over removing the copy by hand, which a later write-mode run would have undone. Codex never needs a global copy while it loads the project file. The session never writes `~/.codex/hooks.json`, so it proved the change with read-only `--check` and `--dry-run` runs |
| Delete the jcode entry from `~/.codex/hooks.json`, and nothing else there | The operator asked for it on 2026-09-27. Its binary is gone and it failed at every Codex session start. The request named that one entry, so the 18 repository copies stay with the installer run |
| Keep a `structure` drift flag | A change that names no entry, such as an empty group being dropped, would otherwise print `DRIFT` with an empty list |
| Run the parity scenario's live Codex step from the checkout, under a perl alarm | Once the global copy is gone, a fresh temp project has no repo hooks, and `timeout` is not installed on macOS. The perl form is what the dispatch harness already uses |
| Add no daemon-side deduplication of identical requests | Removing the duplicate registration removes the race |
| Drop the parent-pid orphan rule instead of teaching the launcher that it was started detached | The documented lease contract never had the rule. A dead pid and a stale heartbeat already cover a launcher that stopped serving, and a lingering launcher that still heartbeats is still a valid owner |
| Stop the queued 433 reruns once F21 was confirmed | Each run would have shut the live advisor down again for every other session. They reran after the fix |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor runtime typecheck (`npm run typecheck`) | PASS, exit 0 |
| Advisor runtime suite (`npx vitest run`, final state) | PASS, 127 files, 959 passed, 6 skipped, 0 failed |
| OpenCode plugin tests (`node --test`) | PASS, 31 of 31 |
| Pi dispatch suite (`--config hooks/vitest.config.ts --dir hooks/dispatch/pi`) | PASS, 50 of 50 |
| Spec-kit hook, shim and directive-lifecycle test files | PASS, 236 passed, 7 skipped, 0 failed |
| Plugin bridge and hooks parity stress pair | PASS, 6 of 6 |
| 457 registered-adapter cadence harness | PASS, `passed: true` for claude, codex, cursor and devin |
| Launcher lease tests after F21, outside the Codex sandbox | PASS, 4 files, 47 of 47. With the base launcher restored, the new test fails on `ppid-1-orphan` |
| Isolated two-launcher reproduction | Before F21 the incumbent died by t+25 s. After it, the incumbent kept its lease through t+60 s |
| Live advisor state during every gate | The live generation and launcher state files were byte-identical before and after each run |
| OpenCode loads the plugin | PASS in all five CLIs: CL-005 step 4 exits 0, prints no load failure and lists `spec_kit_skill_advisor_status` |
| Removal-only installer tests (`node --test`) | PASS, 19 of 19. Against the pre-change installer the new tests fail 13 and pass 6. Luna's verify passed with confidence HIGH |
| Installer against the real `~/.codex/hooks.json`, read-only | `--check` prints `DRIFT (duplicate=18)` and exits 1. `--dry-run` removes 18, finds 0 orphans and keeps 26 third-party entries. The file was byte-identical before and after |
| Codex loads the checkout's `.codex/hooks.json` | A live `codex exec -C <checkout>` started 16 SessionStart hooks: the project file's 6, the global copy's 6 and 4 third-party ones. Its gate state file decodes to the run's session id. A plain `codex exec` from the checkout, without the hook-trust bypass flag, started the same 16 |
| The eleven F5 docs | `validate_document.py` 0 issues on each. A list of 24 stale phrases matches the old text in every file at HEAD and nothing now. Luna's first verify failed on two true points, both fixed. Its re-check confirmed the fixes |
| jcode entry removal (`evidence/f5/jcode-removal.txt`) | The diff from the backup removes only the jcode group. `--check` still prints `DRIFT (duplicate=18)`, and `--dry-run` removes 18, finds 0 orphans and keeps 25. A plain `codex exec` from the checkout then ran UserPromptSubmit 7 of 7 and Stop 9 of 9, as before, and SessionStart 6 of 6, where the run before the removal started 16 and one failed. Six is the project file's own count. The installer, run on a temp copy, moves none of the 25 hooks it keeps |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Resolved in phase 10: Codex ran every repository hook twice until the installer ran once (F5).** On 2026-09-27 phase 10 ran it on the operator's direction and restored trust for the three moved hooks. `--check` now prints `OK`, and a live `codex exec` starts each hook once (`../010-review-advisories-and-codex-cleanup/evidence/`). What follows is the record of the steps it took, from the checkout root:

   ```bash
   node .skilled/bin/install-codex-hooks.mjs --dry-run   # expect 18 entries under "removed", "orphaned": [] and only third-party entries under "kept"
   node .skilled/bin/install-codex-hooks.mjs             # backs up to ~/.codex/hooks.json.bak-<timestamp>, then writes
   node .skilled/bin/install-codex-hooks.mjs --check     # expect: install-codex-hooks: OK ~/.codex/hooks.json
   ```

   Rollback: copy the backup the run names back over `~/.codex/hooks.json`. Until that run, every session-start `--check` (Claude, Cursor, Devin, Pi and the OpenCode watchdog) reports drift, which is the prompt to run it. Afterwards Codex runs the repository's hooks only in a trusted checkout, so a new worktree or clone runs none until `~/.codex/config.toml` trusts it.

   The 18 entries it removes each start with `bash -c 'cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public" && ` and run:

   | Event | Matcher | Timeout | Adapter |
   |---|---|---|---|
   | UserPromptSubmit | none | 3 | `node .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js` |
   | UserPromptSubmit | none | 3 | `node .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` |
   | SessionStart | none | 3 | `node .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js` |
   | SessionStart | none | 3 | `bash .skilled/bin/worktree-guard.sh` |
   | SessionStart | none | 3 | `bash .skilled/bin/check-git-hooks.sh` |
   | SessionStart | none | 3 | `bash .skilled/bin/git-primary-reconcile.sh` |
   | SessionStart | none | 3 | `bash .skilled/bin/git-live-follow.sh --start` |
   | SessionStart | none | 5 | `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all` |
   | PreToolUse | `exec` | 5 | `node .skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs` |
   | PreToolUse | `exec` | 5 | `node .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` |
   | PreToolUse | `exec\|apply_patch\|edit` | 5 | `node .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` |
   | PreToolUse | `mcp__.*` | 5 | `node .skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs` |
   | PostToolUse | `apply_patch\|edit` | 10 | `node .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` |
   | PostToolUse | `exec` | 5 | `node .skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` |
   | PreCompact | none | none | `node .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js` |
   | Stop | none | none | `node .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js` |
   | Stop | none | 10 | `node .skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` |
   | Stop | none | 10 | `bash .skilled/scripts/session-cleanup.sh` |

   It keeps every other entry, each at the position it holds now: the nodeterm `codex.sh` hooks, the GitKraken `gk ai hook run --host codex` hooks and the orca `codex-hook.sh` hooks. The stale jcode `setup-hotkey` SessionStart entry failed at every Codex session start, because `~/.local/bin/jcode` no longer exists. The operator had the session delete it on 2026-09-27, after a backup to `~/.codex/hooks.json.bak-jcode-2026-09-27T05-48-23Z`.

   Codex keys hook trust by position: `~/.codex/config.toml` holds a `trusted_hash` for each `<file>:<event>:<group>:<hook>`. Deleting the first SessionStart group moved every later one up a place, so Codex now treats the global SessionStart hooks as new or changed and skips them. A plain `codex exec` from the checkout started 6 SessionStart hooks, the project file's count, where 16 ran before. The installer moves none of the hooks it keeps. Run it first, then start `codex` once in a terminal and trust the hooks its startup review lists, or trust them later with `/hooks`. Expect three: nodeterm, GitKraken and orca. Trusting before the installer run would also re-trust the six SessionStart copies, and every session would run them twice again until the installer removes them. To undo the jcode deletion instead, copy the backup back over `~/.codex/hooks.json`.
2. **Cursor delivers no native advisor line under `cursor-agent -p`.** A probe on Cursor `2026.09.26-dd393fe`, with its own workspace and hook file, logged `sessionStart` and `sessionEnd` but never `beforeSubmitPrompt` or `stop`. The repository registers the advisor hook under `beforeSubmitPrompt` and the 457 harness passes the Cursor adapter, so this is a host limit, as cli-cursor scenario CU-014 records. The Cursor scenario runs pass on the CLI and test paths.
3. **A Cursor `--sandbox enabled` dispatch gets a degraded advisor answer.** The sandbox cannot reach the daemon socket under `/tmp/system-skill-advisor/`, so the CLI answers from its local scorer. cli-cursor documents this, and a dispatch that needs the live answer runs with the sandbox disabled.
4. **The Codex workspace-write sandbox cannot run the socket tests.** `listen` returns EPERM there, so the launcher tests ran outside it.
5. **`.opencode/changelog` is missing.** `.opencode/SYNC.md:35` documents it as a symlink. No advisor or spec-kit doc links into it, so this phase leaves it alone.
6. **`.opencode/plugins/README.md` does not list the new `lib/` module.** Another session has that file open with uncommitted edits, so the inventory line waits for that session.
<!-- /ANCHOR:limitations -->

---
