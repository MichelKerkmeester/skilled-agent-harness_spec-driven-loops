---
title: "CHT-007 -- It opens with no build step"
description: "This scenario validates the delivery property for `CHT-007`. It confirms a delivered chart opens from a file:// URL with no install, no package manager and no network, carrying no remote resource and no runtime fetch."
stage: delivery
version: 1.0.0.0
---

# CHT-007 -- It opens with no build step

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-007`.

---

## 1. OVERVIEW

This scenario validates the delivery property for `CHT-007`. It confirms a delivered chart opens from a `file://` URL with no install, no package manager and no network, carrying no remote resource and no runtime fetch.

### Why This Matters

The recipient is a writer or an operations analyst rather than a developer. The file gets emailed, opened on a laptop and edited by hand when a number changes. Every one of those depends on the file needing nothing.

One convenient import takes it away, and the loss is invisible on the machine that introduced it. A remote font, an icon set or a charting library keeps working while the developer's network is up and the host still exists, which turns a file that opens on a double click into a file that opened on a double click in the office. The check enforces the rule by failing any remote `src` or `href`, any `@import` and any `fetch`, `XMLHttpRequest` or dynamic `import`.

The rule is stricter than the no-build-step property alone requires, and the cost is real: every form is hand-drawn, and forms that genuinely need a layout engine are out of the corpus rather than in it with a library attached. That trade is the reason the property is worth a scenario rather than a line in a contract.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-007` and confirm the expected signals without contradictory evidence.

- Objective: confirm a delivery opens and draws with no install and no network, and that the check catches a remote dependency
- Real user request: `Send me the chart so I can open it on my laptop on the train.`
- Prompt: `Build the chart, then prove it opens on a machine with no network and no packages installed.`
- Expected execution process: the form is copied whole, the data block is swapped, the result stays one file and the file is then copied outside the repository and opened from a `file://` URL with the network off.
- Expected signals: the `no-external` check reports several assertions per scanned file with zero failures. The copied file opens outside the repository and draws the same chart. No request leaves the machine.
- Desired user-visible outcome: the recipient double-clicks the file and sees the chart, with no network.
- Pass/fail: PASS when the file draws outside the repository with the network off and the deliberate break below fails the `no-external` check. FAIL when the file needs anything not inside it, or when the break passes.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Build the chart, then prove it opens on a machine with no network and no packages installed.`

### Commands

1. `bash: node .opencode/skills/sk-design/sk-create-chart/scripts/check-corpus.cjs > before.txt 2>&1`
2. `bash: cp .opencode/skills/sk-design/sk-create-chart/assets/examples/where-the-budget-went.html ~/chart-delivery-check.html`
3. `agent: Turn the network off, open ~/chart-delivery-check.html from a file:// URL and read the rendered card`
4. `agent: Add a remote stylesheet link to a scratch copy of one form under the corpus tree`
5. `bash: node .opencode/skills/sk-design/sk-create-chart/scripts/check-corpus.cjs > external.txt 2>&1`
6. `bash: git checkout -- .opencode/skills/sk-design/sk-create-chart`
7. `bash: rm ~/chart-delivery-check.html`
8. `bash: git status --porcelain .opencode/skills/sk-design/sk-create-chart`

### Expected

Step 1 gives the baseline with `no-external` reporting its assertion count and zero failures. Step 2 moves one delivery outside the repository, which is the state the recipient receives. Step 3 shows the whole card: headline, subtitle, the drawing and the source line, with the network off and nothing installed. Step 4 introduces the one thing the rule forbids. Step 5 reports `RESULT: FAILED` on `no-external` naming the file and the remote reference. Steps 6 and 7 restore the tree and remove the copy. Step 8 returns empty output.

Opening the copy outside the repository matters more than it looks. A file that resolves a sibling path works inside the tree and fails the moment it is sent to somebody.

### Evidence

Capture the prompt as typed, both output files, the exit status of each run read separately, the `no-external` assertion count, a description of the rendered card from the copy outside the repository with the network off, the failure line from the deliberate break and the clean `git status --porcelain` at the end. Record where the copy was opened from, because a copy opened from inside the repository has not tested the property.

### Pass / Fail

- **Pass**: the copy outside the repository draws the full card with the network off, `no-external` reports zero failures from the shipped state and the deliberate break produces `RESULT: FAILED` naming the remote reference.
- **Fail**: the copy renders incompletely or needs the network, the break passes or the packet path is left modified.

### Failure Triage

1. When the copy draws nothing outside the repository, look for a relative path in the markup before suspecting the drawing code. A path that resolves inside the tree is the most common cause and the check does not fail it, because it is not remote.
2. When a web font is missing, the text still renders in a fallback and the card looks slightly different rather than broken. Compare the two openings rather than reading the copy alone.
3. When the break passes, check where the reference was added. The check reads the file as text, so a reference built at runtime from string pieces is not caught, and that is a real gap worth recording rather than working around.
4. When the network cannot be turned off on the machine, use a browser profile with requests blocked and say which method was used. Reporting a network-off result from a machine that was online is the failure this scenario is guarding against.

### Optional Supplemental Checks

Open the same copy in a second browser. The corpus draws its own marks as inline vector output rather than through a library, so two engines should produce the same card. A difference between them points at a drawing assumption rather than at a dependency, which is a different finding and worth separating.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/template-contract.md`](../../references/template-contract.md) | Primary anchor, section 5 on what a template may depend on |
| [`assets/examples/where-the-budget-went.html`](../../assets/examples/where-the-budget-went.html) | The delivery this scenario sends outside the repository |
| [`scripts/check-corpus.cjs`](../../scripts/check-corpus.cjs) | The `no-external` check |
| [`SKILL.md`](../../SKILL.md) | Section 3 step 6 and the first success criterion |

---

## 5. SOURCE METADATA

- Group: DELIVERY AND ROUTING
- Playbook ID: CHT-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `delivery-and-routing/opens-with-no-build-step.md`
