---
title: "cli-orca playbook run after remediation"
description: "Dated operator run of all eight cli-orca manual testing playbook scenarios, executed in wave order after the review cycle's remediations landed."
version: 1.0.0.0
---

# cli-orca playbook run after remediation

**Run label:** `2026-09-20--playbook-post-remediation`
**Scope:** all eight scenarios (`ORCA-001` to `ORCA-008`) executed in the playbook's wave order, with each scenario's exact prompt and exact command sequence
**Verdicts:** `PASS` for `ORCA-001`, `ORCA-002`, `ORCA-003`, `ORCA-008`; `SKIP` for `ORCA-004`, `ORCA-005`, `ORCA-006`, `ORCA-007`
**Release readiness:** not established. Three of the six critical-path scenarios (`ORCA-004`, `ORCA-006`, `ORCA-007`) are `SKIP`, and the playbook's Release Review Rules treat a `SKIP` as non-passing evidence that must be resolved before a release recommendation.

## 1. OVERVIEW

This report records one operator run of the `cli-orca` manual testing playbook, taken after the review cycle's remediations landed in the skill package. Every scenario below was executed with the prompt and the command sequence its own per-feature file defines, and every verdict is backed by the command transcript and exit status captured here.

The run stops short of a release recommendation for a single, precisely identified environment reason: the resolved Orca executable cannot locate its app bundle in this shell, so every runtime-state scenario was recorded `SKIP` rather than guessed at. Section 4 names the blocker and the smallest operator action that resolves it.

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
| Orca executable resolution | `ORCA_CLI_COMMAND` unset; `orca-dev` and `orca-ide` resolve to nothing; the bare name resolves to `/usr/local/bin/orca`, a root-owned symlink (mode `0700`, created 2026-09-20) |
| Unrelated working-tree changes | Preserved; no scenario wrote to the working tree |

---

## 2. WAVE RESULTS

Scenarios were run wave by wave in the playbook's dependency order, and each wave was finished before the next began.

| Wave | Category | Scenario | Verdict | Critical Path | Exit statuses | One-sentence reason |
|---|---|---|---|---|---|---|
| 1 | Routing | `ORCA-001` | **PASS** | Yes | `0` | `cli-orca` ranked first (`0.6998`) ahead of the generic git skill `sk-git` (`0.6085`) for the Orca-qualified worktree handoff prompt. |
| 1 | Routing | `ORCA-002` | **PASS** | Yes | `0`, `0` | The OpenOrca holdout returned no recommendation at all and the generic worktree prompt recommended `sk-git` (`0.8498`) with `cli-orca` absent from both lists. |
| 2 | Handoffs | `ORCA-003` | **PASS** | Yes | `0`, `0`, `0` | The hub pages name the standalone `cli-orca` skill as owner with no stale `mcp-orca-cli` reference, the compiled route returned `action: defer` with no Orca packet, and both archived reports are on disk. |
| 3 | Runtime | `ORCA-004` | **SKIP** | Yes | `0`, `1` | Executable resolution is honoured and prints one path, but the resolved executable exits non-zero on every subsequent step with `Unable to determine Orca.app path from symlink`, so the version, agent-context and guide steps could not run. |
| 3 | Runtime | `ORCA-005` | **SKIP** | No | `0`, `1` | The terminal listing required to pick exactly one target terminal fails with the same named executable error, so no send and no read back could be performed. |
| 3 | Runtime | `ORCA-006` | **SKIP** | Yes | `0`, `1` | The pre-stop state cannot be established because the terminal listing and the runtime start both fail with the same named executable error. |
| 4 | Ownership | `ORCA-007` | **SKIP** | Yes | `0`, `0`, `1` | The ownership rule prints and the executable resolves, but the live `orca open` half fails with the same named executable error, so the hosted page could not be exercised. |
| 4 | Ownership | `ORCA-008` | **PASS** | No | `0`, `0`, `0` | The snapshot layer lists eight stub files plus `PROVENANCE.md`, `cmp` proves the orchestration snapshot byte-identical to its versioned source, and the overview prints the binary-guide rule. |

Totals: **4 PASS, 0 FAIL, 4 SKIP**.

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

### ORCA-004 -- Executable resolution and versioned preflight (SKIP)

- Feature file: `runtime/preflight-executable-resolution.md`
- Exact prompt: `Check which Orca CLI this shell will use, then load the Orca CLI guide for this version.`
- Commands and transcripts:
  1. `command -v orca` -- exit `0`, printing `/usr/local/bin/orca`
  2. `orca --version` -- exit `1`, `Unable to determine Orca.app path from symlink: /usr/local/bin/orca`
  3. `orca agent-context --json` -- exit `1`, the same error
  4. `orca skills get orca-cli --full` -- not run, because the same blocker had already been established by steps 2 and 3
- Expected signals: one path resolved, then steps 2 to 4 each exit zero with a printed version, a JSON object and the version-matched guide
- Observed signals: the resolution order was honoured and printed one path, and steps 2 and 3 then exited non-zero naming one exact error
- Contradictions: none; the failure is a single environment blocker, not a contract violation
- Verdict: **SKIP** -- the resolved executable cannot locate its app bundle in this shell, and that exact error is the recorded blocker, so the versioned preflight could not complete. This scenario is critical-path, so the skip is not passing evidence.

### ORCA-005 -- Ambiguous send resolved by terminal read back (SKIP)

- Feature file: `runtime/ambiguous-send-recovery.md`
- Exact prompt: `Send this instruction to the paired Orca terminal and make sure it actually landed.`
- Commands and transcripts:
  1. `command -v orca` -- exit `0`, printing `/usr/local/bin/orca`
  2. `orca terminal list --json` -- exit `1`, `Unable to determine Orca.app path from symlink: /usr/local/bin/orca`
- Expected signals: a path resolves, exactly one target terminal is identified, one send precedes the read back, and the read back shows the echoed output
- Observed signals: only the resolution step succeeded; the terminal listing never produced a target, so no send and no read back were attempted
- Contradictions: none. The scenario's own discipline was preserved: no second send was issued, and no send result was reported as delivered.
- Verdict: **SKIP** -- with no terminal listing there is no target terminal to pick, so the send and read-back pair could not be performed.

### ORCA-006 -- Stopped runtime recovered deliberately (SKIP)

- Feature file: `runtime/runtime-stopped-recovery.md`
- Exact prompt: `My Orca terminal went quiet. Work out whether the runtime is stopped and bring it back safely.`
- Commands and transcripts:
  1. `command -v orca` -- exit `0`, printing `/usr/local/bin/orca`
  2. `orca --version` -- exit `1`, `Unable to determine Orca.app path from symlink: /usr/local/bin/orca`
  3. `orca terminal list --json` -- exit `1`, the same error
  4. `orca open --json` -- exit `1`, the same error
- Expected signals: steps 1 to 4 establish the observed state, a stopped runtime shows a non-zero exit with an ordinary error object or an empty terminal list, and step 5's start is followed by a read of the second terminal list before any work continues
- Observed signals: the executable answers only with the app-bundle resolution error, so the pre-stop state cannot be separated from a broken executable, and the start action could not run at all
- Contradictions: none. No pre-stop identifier was reused after recovery and no recoverability claim was made without a read back.
- Verdict: **SKIP** -- a broken-or-executable failure cannot be told apart from a stopped runtime here, and starting a runtime is an operator action in any case. This scenario is critical-path, so the skip is not passing evidence.

### ORCA-007 -- Embedded browser stays inside the Orca runtime (SKIP)

- Feature file: `ownership/embedded-browser-boundary.md`
- Exact prompt: `Open the page inside Orca and check the widget, then explain which browser I should use for an external site.`
- Commands and transcripts:
  1. `rg -n "embedded" .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md` -- exit `0`, printing the ownership rule (`:78`, the browser is an embedded tab surface scoped to an Orca worktree and is not Chrome, Safari or Orca's own app UI) and the owner-table row (`:82`, Orca-managed pages, worktree tabs, snapshots, refs, page cookies and Orca browser recovery errors belong to this skill through the Orca embedded browser)
  2. `command -v orca` -- exit `0`, printing `/usr/local/bin/orca`
  3. `orca open --json` -- exit `1`, `Unable to determine Orca.app path from symlink: /usr/local/bin/orca`
- Expected signals: the ownership rule prints, the hosted page is exercised inside the runtime, and the external site is routed out to a page-automation tool
- Observed signals: the ownership rule prints (first half satisfied), and the live half could not run. The external-site answer is available and consistent with the routing contract, which routes external pages to a page-automation tool such as Playwright or CDP rather than the embedded browser, but the hosted-page half could not be exercised.
- Contradictions: none. No external page was driven through the embedded browser and no cached reference was reused.
- Verdict: **SKIP** -- the live half needs a running Orca runtime, which the recorded blocker prevents. This scenario is critical-path, so the skip is not passing evidence.

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

One blocker accounts for all four skips.

- **Blocker:** the executable that the documented resolution order selects, `/usr/local/bin/orca`, exits non-zero for every command with `Unable to determine Orca.app path from symlink: /usr/local/bin/orca`. The entry is a root-owned symlink in mode `0700` created on 2026-09-20, and the shim resolves the app bundle from that link, so no Orca subcommand reaches the runtime.
- **What is not the blocker:** the app itself. `/Applications/Orca.app` is the upstream Orca terminal (`CFBundleIdentifier` `com.stablyai.orca`, version `1.4.205`), the same project the vendored snapshot tree comes from, and the bundle ships its CLI at `/Applications/Orca.app/Contents/Resources/bin/orca`. The advisor runtime and the Node runtime are both healthy, which is why every non-runtime scenario ran.
- **Smallest resolution, at the operator's choice:** repair the executable resolution so the resolved path reaches the bundle CLI. The documented order makes `ORCA_CLI_COMMAND` the first candidate, so exporting it to the bundled CLI is a supported resolution rather than a fall-through to a different executable; repairing the installed symlink's ownership and mode so the shim can resolve it is the equivalent permanent fix.
- **Why the run stopped rather than worked around it:** starting or driving the Orca runtime is an operator-gated action, and this scenario's own contract forbids falling through to a different Orca executable after an execution error. Recording the blocker is the faithful outcome; substituting an unapproved executable would have produced a verdict the contract does not support.
- **What a re-run would change:** `ORCA-004` is a read-only preflight and could complete as soon as the resolution works. `ORCA-005`, `ORCA-006` and `ORCA-007` additionally need a live Orca session and the operator's go-ahead to drive it.

---

## 5. RELEASE REVIEW POSTURE

The playbook's Release Review Rules require every critical-path scenario to be `PASS` and state that a `SKIP` does not count as passing evidence and must be resolved before a release recommendation. Three critical-path scenarios are `SKIP` here, so this run supports no release recommendation and is not offered as one.

What the run does establish, on live evidence: the routing half of the contract is intact after remediation (positive route first, both holdouts excluded), the hub defers Orca work to exactly one owner with the retired scenarios preserved, and the official skill layer is byte-identical to its sources while deferring flag detail to the binary guide. The remaining gap is environmental, not contractual, and section 4 names the one action that closes it.
