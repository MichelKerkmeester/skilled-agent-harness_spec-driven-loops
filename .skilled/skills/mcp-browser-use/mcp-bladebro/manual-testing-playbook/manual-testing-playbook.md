---
title: "mcp-bladebro: Manual Testing Playbook"
description: "Operator playbook for the mcp-bladebro mode: install and pin checks, the MCP and Code Mode lane, the agent-browser probe, the real-browser probe and teardown, following the 14-step macOS plan."
version: 1.1.0.0
---

# mcp-bladebro: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario runs for real, never mocked or stubbed. Operators run the actual commands, read the real output and record it. The only verdicts are `PASS`, `FAIL` or `SKIP`, and every `SKIP` names its blocker.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **COMPLETION**: A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/<dated-run-label>/`. A run never edits this corpus.

This playbook holds the manual validation contract for the `mcp-bladebro` mode of the `mcp-browser-use` hub. The root file is the operator directory and review guide. Each scenario file carries its own execution truth. The scenarios follow the 14-step macOS plan for Bladebro v4.8.2, from preflight to teardown.

---

## 1. OVERVIEW

The playbook holds 15 scenarios across 5 categories. Plan steps 1 to 5 cover preflight, install, the digest pin and the health check. Step 6 covers the MCP and Code Mode lane. Steps 7 to 10 are the agent-browser probe and steps 11 to 13 the real-browser probe, with BB-015 as the attach-mode alternative to step 13. Step 14 is teardown, split into the lane reset and the uninstall that waits for operator approval.

### Realistic Test Model

1. An operator asks for a Bladebro task in plain words, such as reading a page in the stealth browser.
2. The orchestrator runs the Bladebro CLI or its MCP tools against `https://example.com` only.
3. The operator records each command, its output and its exit status.
4. The scenario passes only when the output matches the expected signals and would satisfy a real user.

---

## 2. GLOBAL PRECONDITIONS

- macOS on arm64 or x64, with the working directory at the repository root.
- The operator has said yes to the install and its rollback before scenario BB-002 runs.
- Node 14 or later and a Chromium-family browser are present.
- Every page action targets `https://example.com`. No sign-in, no form submit and no other site.
- The real-browser scenarios BB-010 to BB-012 and BB-015 run only after the operator picks the browser and profile and confirms the target site. `profile` mode is never used on a live branded Chrome 136 or later.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact command, its full output and its exit status for every step.
- The SHA-256 of the native binary and the release sidecar value, captured before the binary first runs.
- Captures stay outside the repository. Cookie names, cookie values and saved passwords are never quoted.
- The final verdict per scenario: `PASS`, `FAIL` or `SKIP` with its blocker.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI steps are shown as `bladebro <command> [args]`.
- Code Mode calls are shown as the `call_tool_chain` code string, for example `return bladebro.bladebro_see({...})`.
- Shell steps are shown as plain commands.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario passes only when the prompt, commands, expected signals and evidence agree.
- Critical path: BB-003 (digest pin) and BB-004 (version and doctor). A digest mismatch stops the run and triggers the uninstall.
- A failed run is recorded as a finding and rolled back. It is never retried into a pass and never rerouted to another mode.
- A version other than 4.8.2 sends every quoted flag back for a re-check against the installed binary.

### Result persistence

A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/<dated-run-label>/`. The latest recorded run is `2026-11-22--manual-testing-playbook--clickup-real-browser`, the real-browser scenarios and BB-015 against a signed-in site. The latest full run is `2026-11-21--manual-testing-playbook--macos-live`.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Wave 1, in order: BB-001 to BB-004. Each step gates the next.
- Wave 2: BB-005, the MCP and Code Mode lane.
- Wave 3, one browser at a time: BB-006 to BB-009 on the isolated agent browser.
- Wave 4, after the operator gates: BB-010 to BB-012 on the real-browser lane, then BB-015 by attaching to the running browser.
- Wave 5: BB-013, then BB-014 once the operator approves the uninstall.

---

## 7. PREFLIGHT AND INSTALL

Plan steps 1 to 5. These scenarios gate every later one.

### BB-001 | Host preflight before install

#### Description
Confirm `bladebro` is absent, Node is 14 or later and a Chrome or Chromium binary exists.

#### Scenario Contract
Prompt summary: Check this Mac is ready for a Bladebro install: Bladebro absent, Node present, a Chromium browser present.

Expected signals: step 1 prints `absent`, step 2 prints a Node version of 14 or later, step 3 lists the browser binary

#### Test Execution
> **Feature File:** [BB-001](preflight-and-install/host-preflight.md)

### BB-002 | Pinned npm install

#### Description
Install `bladebro@4.8.2` globally with optional dependencies enabled.

#### Scenario Contract
Prompt summary: Install Bladebro 4.8.2 globally from npm, pinned, without running it yet.

Expected signals: npm reports the packages added and exits 0

#### Test Execution
> **Feature File:** [BB-002](preflight-and-install/npm-install.md)

### BB-003 | Native binary digest against the release sidecar

#### Description
Match the installed native binary against the v4.8.2 release sidecar.

#### Scenario Contract
Prompt summary: Before Bladebro runs, check the installed native binary SHA-256 against the v4.8.2 release sidecar.

Expected signals: both digests equal `7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8` on arm64 (x64: `d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3`)

#### Test Execution
> **Feature File:** [BB-003](preflight-and-install/native-binary-digest.md)

### BB-004 | Version and doctor health check

#### Description
Confirm `bladebro --version` reports 4.8.2 and `bladebro doctor` finds the data root and the browser.

#### Scenario Contract
Prompt summary: Show the Bladebro version and run its doctor health check.

Expected signals: the version line reads `v4.8.2`, the doctor finds the data root and a Chrome or Chromium binary and calls Bladebro operational

#### Test Execution
> **Feature File:** [BB-004](preflight-and-install/version-and-doctor.md)

---

## 8. MCP LANE

Plan step 6, through the stdio server and through Code Mode.

### BB-005 | MCP tools and a Code Mode call

#### Description
List the five tools over stdio, discover them in Code Mode and make one live `bladebro_see` call.

#### Scenario Contract
Prompt summary: Check the Bladebro MCP server lists its tools and that Code Mode can call one on example.com.

Expected signals: tools/list names act, see, state, run and vision, Code Mode discovers 5 tools as `bladebro.bladebro_{act,see,state,run,vision}` and the call returns the example.com text

#### Test Execution
> **Feature File:** [BB-005](mcp-lane/mcp-tools-and-code-mode.md)

---

## 9. AGENT BROWSER

Plan steps 7 to 10 on the isolated agent browser.

### BB-006 | Read page content

#### Description
Read example.com as text.

#### Scenario Contract
Prompt summary: Use Bladebro to read the text of example.com.

Expected signals: JSON with `ok: true`, `is_error: false` and the example.com text, exit 0

#### Test Execution
> **Feature File:** [BB-006](agent-browser/see-content.md)

### BB-007 | Page model and a click by text

#### Description
Read the page model and click the "Learn more" link once.

#### Scenario Contract
Prompt summary: Use Bladebro to list the controls on example.com and click the Learn more link.

Expected signals: the model lists a ref for the "Learn more" link, the click navigates to the IANA example-domains page, both exit 0

#### Test Execution
> **Feature File:** [BB-007](agent-browser/see-model-and-click.md)

### BB-008 | Marked screenshot

#### Description
Capture a marked screenshot.

#### Scenario Contract
Prompt summary: Take a Bladebro screenshot of the current page with the clickable elements marked.

Expected signals: JSON with an `image_path` to a PNG and a count of marked elements, exit 0

#### Test Execution
> **Feature File:** [BB-008](agent-browser/vision-marks.md)

### BB-009 | Tab list and a step plan

#### Description
List tabs and run the two-step plan.

#### Scenario Contract
Prompt summary: List the Bladebro tabs, then run a two-step plan that opens example.com and reads it.

Expected signals: the tab list marks the current tab, the plan returns `"status":"completed"` with each step `ok`

#### Test Execution
> **Feature File:** [BB-009](agent-browser/tabs-and-run-plan.md)

---

## 10. REAL BROWSER

Plan steps 11 to 13. They run only after the operator picks the browser and profile and confirms the target site.

### BB-010 | Real-browser lane status and selection

#### Description
Select the browser binary, profile and clone mode, and confirm them in the status.

#### Scenario Contract
Prompt summary: Point the Bladebro real-browser lane at the browser and profile I picked, in clone mode, and show its status.

Expected signals: each command exits 0 and the final status shows the chosen binary, the chosen profile and `clone`

#### Test Execution
> **Feature File:** [BB-010](real-browser/lane-status-and-selection.md)

### BB-011 | Real-browser lane on in clone mode

#### Description
Turn the lane on and confirm the import.

#### Scenario Contract
Prompt summary: Turn the Bladebro real-browser lane on in clone mode.

Expected signals: `rb on` exits 0 with an import line and `Real-Browser Lane: ON`, the status reads `ACTIVE` with the clone up to date

#### Test Execution
> **Feature File:** [BB-011](real-browser/lane-on-clone.md)

### BB-012 | Reads and actions in the real-browser lane

#### Description
Read example.com, read its model and evaluate one expression in the real lane.

#### Scenario Contract
Prompt summary: In the real-browser lane, read example.com, list its controls and evaluate the page title.

Expected signals: each call returns `ok: true` and exits 0

#### Test Execution
> **Feature File:** [BB-012](real-browser/real-mode-reads.md)

### BB-015 | Reads by attaching to a running browser

#### Description
Attach to the running browser on a fixed debug port, read the confirmed target site and evaluate its title, read-only.

#### Scenario Contract
Prompt summary: Attach Bladebro to my running browser and read the site I confirmed, without clicking or typing anything.

Expected signals: the debug port answers with a browser version, each read returns `ok: true` and exits 0, and the eval reports a signed-in page rather than a sign-in page

#### Test Execution
> **Feature File:** [BB-015](real-browser/attach-mode-reads.md)

---

## 11. TEARDOWN

Plan step 14.

### BB-013 | Lane off, clone wiped and daemon stopped

#### Description
Turn the lane off, wipe the clone, reset the overrides and stop the daemon.

#### Scenario Contract
Prompt summary: Turn the Bladebro real-browser lane off, wipe the clone, reset its settings and stop Bladebro.

Expected signals: each command exits 0, the clone is wiped and the status reads `STANDBY` with no override

#### Test Execution
> **Feature File:** [BB-013](teardown/lane-off-and-stop.md)

### BB-014 | Uninstall and data root removal

#### Description
Remove the global package and the data root.

#### Scenario Contract
Prompt summary: Uninstall Bladebro and remove its data folder.

Expected signals: the doctor prints the data root, the operator confirms no needed named session remains in it, npm exits 0, step 5 prints `absent` and step 6 prints `root absent`

#### Test Execution
> **Feature File:** [BB-014](teardown/uninstall-and-data-root.md)

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

Each scenario maps to the feature-catalog entry that describes the behavior it validates. The catalog root is [feature-catalog.md](../feature-catalog/feature-catalog.md), and each scenario file names its catalog entry in its implementation anchors.

| Feature ID | Feature Name | Category | Feature File | Catalog Entry |
|---|---|---|---|---|
| BB-001 | Host preflight before install | Preflight and Install | [BB-001](preflight-and-install/host-preflight.md) | [Pinned install and digest check](../feature-catalog/install-and-health/pinned-install-and-digest-check.md) |
| BB-002 | Pinned npm install | Preflight and Install | [BB-002](preflight-and-install/npm-install.md) | [Pinned install and digest check](../feature-catalog/install-and-health/pinned-install-and-digest-check.md) |
| BB-003 | Native binary digest against the release sidecar | Preflight and Install | [BB-003](preflight-and-install/native-binary-digest.md) | [Pinned install and digest check](../feature-catalog/install-and-health/pinned-install-and-digest-check.md) |
| BB-004 | Version and doctor health check | Preflight and Install | [BB-004](preflight-and-install/version-and-doctor.md) | [Health diagnostics](../feature-catalog/install-and-health/health-diagnostics.md) |
| BB-005 | MCP tools and a Code Mode call | MCP Lane | [BB-005](mcp-lane/mcp-tools-and-code-mode.md) | [MCP lane through Code Mode](../feature-catalog/transport/mcp-code-mode-lane.md) |
| BB-006 | Read page content | Agent Browser | [BB-006](agent-browser/see-content.md) | [Page reads](../feature-catalog/agent-browser/page-reads.md) |
| BB-007 | Page model and a click by text | Agent Browser | [BB-007](agent-browser/see-model-and-click.md) | [Page actions](../feature-catalog/agent-browser/page-actions.md) |
| BB-008 | Marked screenshot | Agent Browser | [BB-008](agent-browser/vision-marks.md) | [Marked screenshots](../feature-catalog/agent-browser/marked-screenshots.md) |
| BB-009 | Tab list and a step plan | Agent Browser | [BB-009](agent-browser/tabs-and-run-plan.md) | [Step plans](../feature-catalog/agent-browser/step-plans.md) |
| BB-010 | Real-browser lane status and selection | Real Browser | [BB-010](real-browser/lane-status-and-selection.md) | [Lane selection and status](../feature-catalog/real-browser/lane-selection-and-status.md) |
| BB-011 | Real-browser lane on in clone mode | Real Browser | [BB-011](real-browser/lane-on-clone.md) | [Clone mode](../feature-catalog/real-browser/clone-mode.md) |
| BB-012 | Reads and actions in the real-browser lane | Real Browser | [BB-012](real-browser/real-mode-reads.md) | [Clone mode](../feature-catalog/real-browser/clone-mode.md) |
| BB-015 | Reads by attaching to a running browser | Real Browser | [BB-015](real-browser/attach-mode-reads.md) | [Attach mode](../feature-catalog/real-browser/attach-mode.md) |
| BB-013 | Lane off, clone wiped and daemon stopped | Teardown | [BB-013](teardown/lane-off-and-stop.md) | [Teardown and rollback](../feature-catalog/install-and-health/teardown-and-rollback.md) |
| BB-014 | Uninstall and data root removal | Teardown | [BB-014](teardown/uninstall-and-data-root.md) | [Teardown and rollback](../feature-catalog/install-and-health/teardown-and-rollback.md) |

Catalog entries with no scenario yet: [CLI lane and output envelope](../feature-catalog/transport/cli-lane-and-output-envelope.md), [Agent-browser isolation](../feature-catalog/agent-browser/agent-browser-isolation.md), [Tabs, cookies and sessions](../feature-catalog/agent-browser/tabs-cookies-and-sessions.md), [Pause, resume and switch back](../feature-catalog/real-browser/pause-resume-and-switch-back.md), [Capability gaps and handoffs](../feature-catalog/limits-and-safety/capability-gaps-and-handoffs.md) and [Consent gates and blocked verdicts](../feature-catalog/limits-and-safety/consent-gates-and-blocked-verdicts.md). The first three are exercised along the way by BB-006 and BB-009. The pause and resume pair has no live run.
