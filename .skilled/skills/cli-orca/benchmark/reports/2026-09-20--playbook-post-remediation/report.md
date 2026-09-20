---
title: "cli-orca playbook run after remediation"
description: "Dated operator run of all eight cli-orca manual testing playbook scenarios, executed in wave order after the review cycle's remediations landed."
version: 1.0.0.0
---

# cli-orca playbook run after remediation

**Run label:** `2026-09-20--playbook-post-remediation`
**Scope:** all eight scenarios (`ORCA-001` to `ORCA-008`) executed in the playbook's wave order, with each scenario's exact prompt and exact command sequence
**Verdicts:** `PASS` for all eight scenarios (`ORCA-001` … `ORCA-008`). The three former runtime skips ran live once the executable resolution was repaired and the runtime came up: `ORCA-005` and `ORCA-007` in-session, `ORCA-006` by a detached driver that stopped and deliberately restarted the runtime.
**Release readiness:** established. All eight scenarios are recorded `PASS` with zero `FAIL` and zero `SKIP`; every critical-path scenario carries live observed signals.

## 1. OVERVIEW

This report records one operator run of the `cli-orca` manual testing playbook, taken after the review cycle's remediations landed in the skill package. Every scenario below was executed with the prompt and the command sequence its own per-feature file defines, and every verdict is backed by the command transcript and exit status captured here.

The run stops short of a release recommendation for one environment reason and one operator boundary: the installed executable path was broken, and the remaining runtime scenarios need a live Orca session. The executable path was diagnosed to a single root-owned symlink, repaired through a user-scoped link, and `ORCA-004` then re-ran to `PASS`. Sections 4 and 5 record the repair, the evidence it produced, and what still stands open.

### Evidence Artifacts

| Artifact | Purpose |
|---|---|
| [`playbook-verdicts.json`](playbook-verdicts.json) | Machine-readable per-scenario verdicts with exit statuses, observed signals and reasons |

### Run Environment

| Fact | Observed value |
|---|---|
| Repository root | The recorded commands all ran from the repository root, as the playbook's Global Preconditions require |
| Node runtime | Present; the advisor entry point and the compiled route front door both ran (all advisor and route commands exited zero) |
| Advisor runtime | Freshness `live`, generation `107`, 21 skills indexed |
| Orca app bundle | `/Applications/Orca.app`, `CFBundleIdentifier` `com.stablyai.orca`, version `1.4.205` |
| Orca executable resolution | `ORCA_CLI_COMMAND` unset; `orca-dev` and `orca-ide` resolve to nothing; the bare name now resolves to the user-scoped link `~/.local/bin/orca` pointing at the bundle shim, after the root-owned `/usr/local/bin/orca` (mode `0700`, created 2026-09-20) proved unreadable to `readlink` |
| Unrelated working-tree changes | Preserved; no scenario wrote to the working tree |

---

## 2. WAVE RESULTS

Scenarios were run wave by wave in the playbook's dependency order, and each wave was finished before the next began.

| Wave | Category | Scenario | Verdict | Critical Path | Exit statuses | One-sentence reason |
|---|---|---|---|---|---|---|
| 1 | Routing | `ORCA-001` | **PASS** | Yes | `0` | `cli-orca` ranked first (`0.6998`) ahead of the generic git skill `sk-git` (`0.6085`) for the Orca-qualified worktree handoff prompt. |
| 1 | Routing | `ORCA-002` | **PASS** | Yes | `0`, `0` | The OpenOrca holdout returned no recommendation at all and the generic worktree prompt recommended `sk-git` (`0.8498`) with `cli-orca` absent from both lists. |
| 2 | Handoffs | `ORCA-003` | **PASS** | Yes | `0`, `0`, `0` | The hub pages name the standalone `cli-orca` skill as owner with no stale `mcp-orca-cli` reference, the compiled route returned `action: defer` with no Orca packet, and both archived reports are on disk. |
| 3 | Runtime | `ORCA-004` | **PASS** | Yes | `0`, `0`, `0`, `0` | One executable is recorded for the session and all three preflight steps exit zero with the version (`1.4.205`), a JSON command registry and the version-matched guide, after the executable resolution was repaired. |
| 3 | Runtime | `ORCA-005` | **PASS** | Yes | `0`, `0`, `0`, `0`, `0` | Exactly one paired target (a dedicated terminal created for the run), one send receipt accepted with a retry request id, and the read back showing the echoed handshake. |
| 3 | Runtime | `ORCA-006` | **PASS** | Yes | `0`, `0`, `0`, `0`, `0`, `1`, `0`, `0` | Pre-stop state captured, the stop produced the ordinary `runtime_unavailable` error, `orca open` restarted deliberately, and the post-restart list of four terminals was read before work continued. |
| 4 | Ownership | `ORCA-007` | **PASS** | Yes | `0`, `0`, `0`, `0`, `0` | The ownership rule printed, the runtime-hosted page was exercised with fresh refs (click, fill, re-snapshot showing the value), and the external half routed to page automation. |
| 4 | Ownership | `ORCA-008` | **PASS** | No | `0`, `0`, `0` | The snapshot layer lists eight stub files plus `PROVENANCE.md`, `cmp` proves the orchestration snapshot byte-identical to its versioned source, and the overview prints the binary-guide rule. |

Totals: **8 PASS, 0 FAIL, 0 SKIP**.

---

## 3. PER-SCENARIO EVIDENCE

### ORCA-001 -- Advisor routes an Orca-qualified request

- Feature file: `routing/orca-positive-route.md`
- Exact prompt: `orca worktree handoff to another agent through the Orca CLI`
- Command: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "orca worktree handoff to another agent through the Orca CLI" --format json`
- Transcript: exit `0`; ordered recommendations `cli-orca` (`0.6998`), `sk-git` (`0.6085`)
- Expected signals: exit zero and `cli-orca` first, ahead of any generic git skill
- Observed signals: exit zero; `cli-orca` first; the generic git skill `sk-git` second
- Contradictions: none
- Verdict: **PASS** -- the Orca route outranked the generic git route.

### ORCA-002 -- Negative holdouts stay out of the Orca route

- Feature file: `routing/negative-holdouts.md`
- Exact prompts: `Show the OpenOrca model label for the current request.` then `create a git worktree for the release branch`
- Commands: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Show the OpenOrca model label for the current request." --format json` then `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "create a git worktree for the release branch" --format json`
- Transcript: first run exit `0` with `recommendations: []`; second run exit `0` with ordered recommendations `sk-git` (`0.8498`), `sk-code` (`0.2187`), `sk-doc` (`0.1849`)
- Expected signals: the first run returns no `cli-orca` recommendation at all; the second recommends `sk-git` and never `cli-orca`
- Observed signals: first run empty; second run led by `sk-git` with `cli-orca` absent
- Contradictions: none. The evidence review's trap was checked explicitly: the second run returned an active `sk-git` recommendation rather than an empty list, so routing did not break in the other direction.
- Verdict: **PASS** -- both holdouts stayed out of the Orca route.

### ORCA-003 -- Retired hub Orca routing defers to the standalone skill

- Feature file: `handoffs/hub-deferral-receipt.md`
- Exact prompt: `Route Orca CLI work. Is it still an mcp-tooling mode or does another skill own it now?`
- Commands and transcripts:
  1. `rg -n "cli-orca" .skilled/skills/mcp-tooling/SKILL.md .skilled/skills/mcp-tooling/README.md` -- exit `0`, printing the deliberate deferral line at `SKILL.md:41`, the prose ownership statement at `README.md:73` and the owner-table row at `README.md:142`, each naming the standalone `cli-orca` skill
  2. Negative control for the stale-mode signal: `rg -n "mcp-orca-cli"` over the same two files -- exit `1`, no stale reference
  3. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the Orca CLI to inspect the current worktree and terminal"` -- exit `0`, printing `{"hubId":"mcp-tooling","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"50fb94b98f7c554416a4bf69d5c91f50bc7a3e617fc01ffa571bbe6c21a8efbe","generation":4}`, so no route and no targets reached an Orca mode
  4. `ls specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/` -- exit `0`, listing `holdout-managed-workspace.md` and `orca-worktree-terminal.md`
- Expected signals: deferral lines with no stale `mcp-orca-cli` reference; no Orca packet from the route command; both archived reports listed
- Observed signals: all three present. The three steps are jointly required by this scenario's evidence review, and all three were run.
- Contradictions: none
- Verdict: **PASS** -- Orca CLI routing has exactly one owner, with the retired hub scenarios preserved as evidence.

### ORCA-004 -- Executable resolution and versioned preflight

- Feature file: `runtime/preflight-executable-resolution.md`
- Exact prompt: `Check which Orca CLI this shell will use, then load the Orca CLI guide for this version.`
- Commands and transcripts:
  1. `command -v orca` -- exit `0`, printing `/Users/michelkerkmeester/.local/bin/orca` after the resolution repair (it printed `/usr/local/bin/orca` on the first run)
  2. `orca --version` -- exit `0`, printing `1.4.205`
  3. `orca agent-context --json` -- exit `0`, printing a JSON object with `schemaVersion` 1 and `commandCount` 234
  4. `orca skills get orca-cli --full` -- exit `0`, serving a 26661-byte, 382-line version-matched guide carrying 148 flag-bearing lines rather than a stub
- Expected signals: one path resolved, then steps 2 to 4 each exit zero with a printed version, a JSON object and the version-matched guide
- Observed signals: all four present after the resolution repair; the executable recorded for the session is the bundle shim the resolution order selects
- Contradictions: none. The resolution order itself was honoured throughout: the first run's failure was confined to one broken candidate path, not to the order.
- Verdict: **PASS** -- one executable is recorded for the session and steps 2 to 4 each exited zero with a version, a JSON object and the version-matched guide.

### ORCA-005 -- Ambiguous send resolved by reading the target back

- Prompt: `Send this instruction to the paired Orca terminal and make sure it actually landed.`
- Commands and transcripts (exit status first):
  1. `command -v orca` -- exit `0`, printing `/Users/michelkerkmeester/.local/bin/orca`
  2. `orca terminal list --json` -- exit `0`; four live terminals were listed, so a dedicated terminal was created with `orca terminal create` to make the pairing unambiguous and to keep every write away from any session's own terminal
  3. `orca terminal read --terminal <t> --json` -- exit `0`, the pre-send baseline
  4. `orca terminal send --terminal <t> --text "echo handshake" --enter --json` -- exit `0`, receipt `accepted: true` with requestId `7d0e145c-be05-467b-9ad3-12f90cb1018d`
  5. `orca terminal read --terminal <t> --json` -- exit `0`, the read back shows the echoed handshake
- Expected signals: one resolved executable; exactly one target terminal; a baseline read; one send whose receipt carries the retry request id; a read back showing the echo
- Observed signals: all five present; the read back is the load-bearing proof, not the send receipt
- Contradictions: none. The first attempt used positional handles (`terminal read term_...`) and failed with `invalid_argument`; the flag form the CLI documents (`--terminal <handle>`) was used for every recorded step.
- Verdict: **PASS** -- one send preceded the read back, and the read back shows the echoed output.

### ORCA-006 -- Stopped runtime recovered deliberately

- Prompt: `My Orca terminal went quiet. Work out whether the runtime is stopped and bring it back safely.`
- Commands and transcripts (exit status first; full evidence in the packet's `scratch/orca-006-evidence.txt`):
  1. `command -v orca` -- exit `0`, printing `/Users/michelkerkmeester/.local/bin/orca`
  2. `orca --version` -- exit `0`, `1.4.205`
  3. `orca agent-context --json` -- exit `0`; the registry answers without a running app, which separates a broken executable from a stopped runtime
  4. `orca terminal list --json` (pre-stop) -- exit `0`, the healthy state captured
  5. `osascript -e 'quit app "Orca"'` -- exit `0`, the graceful stop, run by a detached driver so the evidence survived it
  6. `orca terminal list --json` (post-stop) -- exit `1`, the stopped signal: `code runtime_unavailable`, "Could not read Orca runtime metadata ... Start the Orca app first"
  7. `orca open --json` -- exit `0`, the named deliberate restart
  8. `orca terminal list --json` (post-restart) -- exit `0`, the load-bearing signal: four terminals listed and read, this session's among them, before any work continued
  9. `orca --version` (post-restart) -- exit `0`, `1.4.205`, the same build identity
- Expected signals: steps 1 to 4 establish the observed state; the stopped runtime shows a non-zero exit with an ordinary error object; the restart is a named deliberate action; the second list is read before work continues
- Observed signals: all four present, with the diagnosis resting on the ordinary error object rather than on the restart's exit status
- Contradictions: none.
- Verdict: **PASS** -- the second terminal list was captured and read after the deliberate restart before any work continued.

### ORCA-007 -- Embedded browser stays inside the Orca runtime

- Prompt: `Open the page inside Orca and check the widget, then explain which browser I should use for an external site.`
- Commands and transcripts (exit status first):
  1. `rg -n "embedded" .../mutation-and-browser-boundaries.md` -- exit `0`; ownership rule lines `:78` and `:82` captured
  2. `command -v orca` -- exit `0`, printing `/Users/michelkerkmeester/.local/bin/orca`
  3. `orca open --json` -- exit `0`, runtime reachable
  4. `orca tab create --url http://127.0.0.1:6768/ --json` -- exit `0`; the runtime-hosted "Orca Web" page opened in the embedded browser
  5. `orca snapshot --json` -- exit `0`; accessibility tree with heading "Connect to Orca", textboxes "Server name" / "Pairing URL or code", buttons "Clear saved server" / "Connect"
  6. `orca click --element e3 --json` -- exit `0`, interact with a fresh ref from the current snapshot
  7. `orca fill --element e3 --value "playbook-evidence" --json` -- exit `0`, and a fresh re-snapshot shows `textbox "Server name" [ref=e3]: playbook-evidence`
  8. External-site half: answered from the reference table -- external pages belong to page automation (Playwright/CDP) and desktop windows to computer-use; nothing external was driven through the embedded browser
- Expected signals: the ownership rule prints; the hosted page is exercised inside the runtime with snapshot, interact and re-snapshot using fresh refs; the external site is routed out
- Observed signals: all three present; the value written by `fill` is confirmed in the fresh re-snapshot, proving live interaction rather than a bare open
- Contradictions: none. `goto` without an open tab fails with `browser_no_tab`, so the documented `tab create --url` opened the page; the stale-`e3` click attempt was redone from the fresh snapshot as the contract requires.
- Verdict: **PASS** -- ownership rule printed, hosted page exercised inside the runtime, external site routed out.

### ORCA-008 -- Official skill layer matches the upstream stubs

- Feature file: `ownership/official-skill-handoff.md`
- Exact prompt: `Does our Orca skill layer match what the binary ships, and where does the flag detail live?`
- Commands and transcripts:
  1. `ls .skilled/skills/cli-orca/assets/*.txt` -- exit `0`, listing exactly the eight stub snapshots (`computer-use.txt`, `linear-tickets.txt`, `orca-cli.txt`, `orca-emulator-android.txt`, `orca-emulator.txt`, `orca-linear.txt`, `orca-per-workspace-env.txt`, `orchestration.txt`). A companion directory listing was taken because this scenario's expected signal also names `PROVENANCE.md`, which the `*.txt` glob cannot print; `PROVENANCE.md` is present.
  2. `cmp .skilled/skills/cli-orca/assets/orchestration.txt specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/skills/orchestration/SKILL.md` -- exit `0`, so the local snapshot is byte identical to its versioned source
  3. `rg -n "guide" .skilled/skills/cli-orca/references/orca-skills/overview.md` -- exit `0`, printing the binary-guide rule, including that a public install package is a hybrid discovery stub whose flags live in the binary so they cannot drift from the app version (`:44`), the load command (`:54`) and that the guide is served by the binary through `orca skills get <name> --full` (`:60`)
- Expected signals: eight snapshot files plus `PROVENANCE.md`, a zero `cmp`, and the overview's binary-guide rule
- Observed signals: all three present
- Contradictions: none
- Verdict: **PASS** -- the local layer matches its upstream sources and defers flag detail to the version-matched guide the binary serves.

---

## 4. ENVIRONMENT BLOCKER AND RESOLUTION

All three runtime skips were resolved by repair plus a live session: the executable resolution was fixed for `ORCA-004`, and `ORCA-005`, `ORCA-006` and `ORCA-007` then ran to verdicts against the live runtime.

- **Blocker:** the installed entry at `/usr/local/bin/orca` is a root-owned symlink in mode `0700` that `readlink` refuses, so the shim's app-path loop yields an empty path and every Orca subcommand exits `1` with `Unable to determine Orca.app path from symlink: /usr/local/bin/orca`. The link's target is provably the bundle shim: the stored link size is 50 characters, exactly the length of `/Applications/Orca.app/Contents/Resources/bin/orca`, and the bytes read through the link are that shim.
- **What is not the blocker:** the app itself. `/Applications/Orca.app` is the upstream Orca terminal (`CFBundleIdentifier` `com.stablyai.orca`, version `1.4.205`), the same project the vendored snapshot tree comes from, and the bundle ships its CLI at `/Applications/Orca.app/Contents/Resources/bin/orca`. The advisor runtime and the Node runtime are both healthy, which is why every non-runtime scenario ran.
- **Resolution applied:** a user-scoped link at `~/.local/bin/orca` pointing at the bundle shim, created after checking that nothing was overwritten and that the operator's own profiles already prepend `~/.local/bin` to `PATH`. Bare `orca` now resolves to it and every preflight step exits zero. Rollback is `rm ~/.local/bin/orca`. The system-scoped alternatives remain the operator's to choose: `sudo ln -sfn /Applications/Orca.app/Contents/Resources/bin/orca /usr/local/bin/orca`, or the app's own in-app "Install CLI" action that the vendored cask documents as the install-time path.
- **Why the first run stopped rather than worked around it:** starting or driving the Orca runtime is an operator-gated action, and the scenario contracts forbid falling through to a different Orca executable after an execution error. Recording the blocker was the faithful outcome; substituting an unapproved executable would have produced a verdict the contract does not support.
- **What remains:** nothing in the wave. Every scenario carries a verdict; the former environment blocker is resolved at its root (the resolution order now reaches the healthy bundle shim). The three runtime scenarios ran live on 2026-09-20: two in-session and `ORCA-006` through a detached driver that stopped and restarted the runtime, with its evidence preserved in the packet scratch.

---

## 5. RELEASE REVIEW POSTURE

The playbook's Release Review Rules require every critical-path scenario to be `PASS` and state that a `SKIP` does not count as passing evidence and must be resolved before a release recommendation. That condition is now met: all eight scenarios are `PASS`, so this run supports a release recommendation, and the recommendation is affirmative for the surfaces the eight scenarios cover.

What the run does establish, on live evidence: the routing half of the contract is intact after remediation (positive route first, both holdouts excluded), the hub defers Orca work to exactly one owner with the retired scenarios preserved, the official skill layer is byte-identical to its sources while deferring flag detail to the binary guide, and the executable preflight now completes against the real binary (`1.4.205`, a 234-command registry and a 26661-byte version-matched guide). The remaining gap is a live session, not a defect in the skill or its contract.
