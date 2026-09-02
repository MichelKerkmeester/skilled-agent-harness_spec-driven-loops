---
title: "Implementation Summary: Official Obsidian CLI agent-usage support"
description: "The official obsidian CLI was already installed but undocumented in the ways that matter: it answers nothing when the desktop app is down, and it exits 0 on every in-app failure. This packet measured the binary, wrote the agent contract from that evidence, and removed the false auto-launch claim from nine files."
trigger_phrases:
  - "official obsidian cli summary"
  - "obsidian cli exit 0 contract"
  - "obsidian cli preflight implementation"
  - "app-backed cli documentation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/019-official-obsidian-cli"
    last_updated_at: "2026-09-02T08:25:00Z"
    last_updated_by: "session"
    recent_action: "Authored official-CLI agent contract"
    next_safe_action: "Operator review, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/examples/official-cli-workflow.sh"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Install or verify: verify, the registration symlink already existed"
      - "One reference file or two: one, since preflight and command surface are one topic"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-official-obsidian-cli |
| **Completed** | 2026-09-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The official `obsidian` CLI was already on PATH and already named as one of this skill's three surfaces, yet an agent could not have used it correctly from what the skill said. Two facts decide everything about this CLI and neither was written down: it answers nothing while the desktop app is closed, and once the app is open it reports every failure with **exit status 0**. Meanwhile the skill asserted nine times, once as `Confirmed behavior`, that the CLI launches the app for you. It does not. This packet replaced the guesses with measurements taken from the binary, added the agent-facing layer built on them, and made the skill's own diagnostic tell the truth.

### The agent contract

`.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md` is the new centrepiece. It answers, in order, the four questions an agent has to resolve before touching this surface: which CLI profile to reach for, how to prove the official one will answer, how to read a result that always exits 0, and what the real command surface is. Every behavioral sentence came from running the binary. Five things could not be checked on this machine and are listed as UNKNOWN with the check that would settle each, rather than filled in from the vendor page.

### A diagnostic that can fail

`scripts/doctor.sh` previously ran `command -v obsidian` and printed a green check. That check passes on a machine where the CLI cannot answer a single command. It now runs `obsidian version` and reports three distinct states: not registered, registered but the app is down, and live with its version. This is the change most likely to save someone an hour.

### The contract in executable form

`examples/official-cli-workflow.sh` runs the pattern the reference describes, so the doctrine is tested rather than asserted. It preflights, wraps every call in a function that turns the CLI's own `Error:` text back into a non-zero status, reads the created filename back out of the `Created:` line because a name collision silently produces a numbered sibling, and deletes its own note through an exit trap.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md` | Created | The agent contract: preflight, exit-0 result handling, `key=value` syntax, surface selection, 106-command surface, five safety invariants, vendor disagreements, UNKNOWN register |
| `.opencode/skills/mcp-tooling/mcp-obsidian/examples/official-cli-workflow.sh` | Created | Executable round trip that tests the contract in both app states |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.23.0.0.md` | Created | Release entry naming every touched file and wiring point |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modified | `OFFICIAL_CLI` router intent, resource map, loading map, surface tables, an 11-row quick reference replacing 2 unverified rows, version 0.23.0.0 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh` | Modified | Live `obsidian version` probe replacing a PATH-only check |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md` | Modified | §8 rewritten from a `VERIFY` stub to a confirmed capability table; §3 gained four app-only rows; version 0.2.0.0 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md` | Modified | New §5b (app not running) and §5c (exit 0 on error), the two failure modes with no prior coverage |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh` | Modified | Corrected the auto-launch claim and the verification command |
| `.opencode/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-cli/setup.sh` | Modified | Same correction, duplicated text |
| `.opencode/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-cli/README.md` | Modified | `obsidian --help` corrected to `obsidian help` |
| `.opencode/skills/mcp-tooling/mcp-obsidian/INSTALL-GUIDE.md` | Modified | Corrected claims; troubleshooting rows added for app-down and POSIX-flag misuse |
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | Modified | Corrected verification commands and added the app-down troubleshooting row |
| `.opencode/skills/mcp-tooling/mcp-obsidian/examples/README.md` | Modified | Indexed the new script as §3.3 and updated the example count |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md` | Modified | Replaced the auto-launch claim with the measured command count |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/cli/open-note-or-vault.md` | Modified | `VERIFY` stub replaced with the confirmed `obsidian open file=` form |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/cli/register-cli.md` | Modified | Verification step now `obsidian version` |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/cli/uri-actions.md` | Modified | Noted the `command`/`commands` families that cover many URI cases |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modified | Corrected command notation and the official-CLI precondition |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/official-cli/register-and-help.md` | Modified | OBS-009 preflights with `obsidian version` |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/official-cli/open-app-action.md` | Modified | OBS-010 uses the real command form and judges by stdout |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/*.md` (3 files) | Modified | `obsidian --help` corrected to `obsidian help` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Measurement came first, because the existing documentation was written from the vendor page and copying it forward would have reproduced its errors. The binary was probed with the app closed, then with it open, and the difference between those two states turned out to be the whole story.

Verification used a real negative control. The Obsidian desktop app was **not** running when this work started, which is the state a reader on a fresh machine hits. `doctor.sh` was run in that state first and printed a green check, reproducing the exact defect. After the change it warns. The app was then started, both scripts were run again for the positive control, and the app was quit at the end so the machine was left as it was found.

Nothing was installed. The registration symlink at `/usr/local/bin/obsidian` already pointed into the app bundle, so an install step would have mutated the environment to reach a state that already held.

The live vault was touched only through one scratch note per run, permanently deleted afterwards, with the vault's markdown file count reconciled to its pre-change baseline of 233.

Nothing was committed and nothing was pushed. All 23 skill files and the 8 packet files are staged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verify rather than install | `readlink -f /usr/local/bin/obsidian` showed the symlink already present. Installing would change the environment to reach a state that already held |
| One new reference, not two | Preflight doctrine and command surface are one topic, and the router loads one resource instead of two |
| Leave exhaustive command signatures to `obsidian help` | Transcribing 106 signatures creates a second source of truth that goes stale against the binary. The grouped index plus the 13 confirmed commands an agent actually uses covers the need |
| Correct the auto-launch claim everywhere, not just in the file being extended | It behaved like a shared contract. Fixing one copy would have left the skill asserting both "the app launches automatically" and "the app must already be running" |
| No new feature-catalog cards | The three existing official cards were false rather than missing. Adding cards renumbers the index and changes the counts the catalog asserts, for no requirement that exists today |
| Historical changelogs left unedited | A changelog records what was believed at a release. Rewriting `v0.1.0.0.md` would falsify that record. Noted explicitly in `v0.23.0.0.md` §4 |
| `OFFICIAL_CLI` weight 6, not 5 | `NOTES_CLI` at weight 5 owns the shared verbs (`open`, `search`, `create`, `delete`, `vault`). At equal weight official-CLI questions lose the tie and load the wrong reference |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `readlink -f /usr/local/bin/obsidian` | PASS. `/Applications/Obsidian.app/Contents/MacOS/obsidian-cli`, exit 0. Already registered |
| `obsidian version` with app closed | Message on **stderr**, exit **1**, app not launched. Confirms the vendor page's auto-launch claim is wrong |
| `obsidian version` with app open | `1.13.7 (installer 1.13.4)`, exit 0 |
| `obsidian help` | 106 commands enumerated, exit 0 |
| `obsidian read file="ZZZ-does-not-exist"` | `Error: File "ZZZ-does-not-exist" not found.` on **stdout**, exit **0** |
| `obsidian bogusnonsense` | `Error: Command "bogusnonsense" not found.` on stdout, exit **0** |
| `obsidian vault="NoSuchVault999" files total` | `Vault not found.` on stdout, exit **0** |
| Bare `obsidian read` (no target) | Returned the note open in the UI. Confirms the active-file hazard |
| `create` twice with the same name | `Created: zz-agent-probe-scratch.md` then `Created: zz-agent-probe-scratch 1.md`, both exit 0. Confirms silent duplicate forking |
| `vault=` before and after the command word | Both returned 235, exit 0. The vendor page's "must be first" constraint is not real |
| `doctor.sh` with app closed | PASS (negative control). Warns: `obsidian: /usr/local/bin/obsidian is registered but the desktop app is NOT running`. Previously printed a green check |
| `doctor.sh` with app open | PASS. `✓ obsidian: /usr/local/bin/obsidian (1.13.7 (installer 1.13.4)) — app is running, CLI is live` |
| `examples/official-cli-workflow.sh` with app closed | PASS. Exit 1 with the launch-and-wait instruction |
| `examples/official-cli-workflow.sh` with app open | PASS. Full round trip, exit 0, demo note removed by the exit trap |
| `bash -n` on the 4 touched shell scripts | PASS, all four |
| Router execution (`route_obsidian_resources` extracted from `SKILL.md`) | PASS. Five official-CLI phrasings resolve to `OFFICIAL_CLI` and load the new reference |
| Router regression across 6 existing intents | PASS. `NOTES_CLI`, `MCP_ADVANCED`, `PLUGIN_DATAVIEW`, `INSTALL`, `TROUBLESHOOT`, `NOTION_MIGRATION` unchanged |
| Vault reconciliation | PASS. `obsidian files ext=md total` = 233 before and after; both scratch searches return `No matches found.` |
| False-claim sweep | PASS. `grep -rn "launches it if not\|can launch it when\|launches/focuses"` outside `changelog/` returns nothing |
| POSIX-flag sweep | PASS. No `obsidian --help` outside deliberate counter-examples and historical changelogs; `notesmd-cli --help` preserved |
| `validate.sh <packet> --strict` | PASS. `RESULT: PASSED`, Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Windows and Linux behavior is unverified.** Everything here was measured on macOS. The vendor page describes a Windows terminal redirector and a Linux copy to `~/.local/bin/obsidian`, neither exercised. Settle it by running `obsidian version` after registering on each platform.
2. **Only the app-down case is known to exit non-zero.** Every observed in-app failure exited 0, but that is an observation across the command families exercised, not a proof about all 106. Settle it by exercising a failing case per command family and recording the status.
3. **Output shapes for the sync, history, Bases, plugin, theme and dev groups are undocumented.** Their presence is confirmed from `obsidian help`; their result shapes were not exercised. Settle it by calling each with `format=json` where offered.
4. **`delete` without `permanent` was not exercised.** Only the `permanent` form was used, to guarantee cleanup. Whether the trash path can block on a GUI confirmation is unknown; a `permanent` delete during probing did once appear to stall, though the stall was traced to an unrelated iCloud directory listing in the same command chain.
5. **Single-vault machine.** `vault=` targeting was tested against one real vault and one deliberately invalid name. Multi-vault behavior is inferred, not observed.
6. **The `INSTALL` intent still wins on "register cli" phrasing.** That routes to `troubleshooting.md`, which now carries the registration and app-down sections, so the reader still lands somewhere correct. Left as-is rather than re-weighting a working intent.
<!-- /ANCHOR:limitations -->

---
