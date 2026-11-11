---
title: "F2C-001 -- Figma node read becomes token markup"
description: "This scenario validates Figma-to-code translation for `F2C-001`. It focuses on turning one Figma node into semantic markup whose every value is a token the app installs."
version: 1.0.1.0
---

# F2C-001 -- Figma node read becomes token markup

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `F2C-001`.

---

## 1. OVERVIEW

This scenario validates Figma-to-code translation for `F2C-001`. It focuses on confirming that a read of one Figma node becomes semantic markup whose every value is a token the app installs, never a raw frame value.

### Why This Matters

Figma components carry wrapper frames, hidden layers and variant properties so designers can cover many cases with one component. Transcribing that layer tree produces nested containers and pixel literals. The failure this guards against is code that mirrors Figma instead of the meaning, or that pastes a frame value where the app installs a token.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `F2C-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a node read produces the simplest semantic structure and maps every value to a token the app installs.
- Real user request: `Build the summary card from this Figma frame using the tokens our app installs.`
- Prompt: `Build the summary card from this Figma frame using the tokens our app installs.`
- Expected execution process: read the selected node without changing it, record the authored frame width W, load `figma-to-code.md` and the stack markup reference, check the installed token package, then propose semantic markup and complete the five-pass check.
- Expected signals: the evidence records W, a state matrix, render and source token checks, a variable-to-token table and range and access results. Every value in the markup is an installed token name, and no hex, pixel or font literal appears where a token exists. A pass that cannot run is marked `NOT RUN` with a reason and the Figma check verdict is `INCOMPLETE`.
- Desired user-visible outcome: the agent shows semantic markup with installed token names and the five-pass evidence, and names any value that has no token instead of writing it.
- Pass/fail: PASS if the markup is semantic, every value maps to an installed token or is reported as a gap, and every pass has evidence. Available passes must pass. An unavailable pass is `NOT RUN` with a reason and the overall verdict is `INCOMPLETE`. FAIL if a pass fails or is omitted, a raw value replaces an installed token, or a mutating Figma verb runs.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. A read-only Figma pull stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires INSPECT-001 PASS (or MCP-001 PASS for the Framelink path), Figma Desktop open with a design file, and an application repository checked out read-only. Run the shell steps from the application repository root. The scenario reads Figma and writes nothing to it.

1. `figma-ds-cli get` / `node tree` on the selected frame (read-only)  # -> node structure, properties and authored width W
2. `bash: rg -n '"design-tokens"' package.json`  # -> installed token package and version named
3. agent loads `figma-to-code.md` and the stack markup reference  # -> translation table and five-pass check cited
4. agent proposes semantic markup and records the five-pass evidence  # -> every value is a token name or a reported gap
5. `bash: rg -n "#[0-9a-fA-F]{3,8}|\b[0-9]+(px|rem)\b" <changed-files>`  # -> no literal appears where a token exists

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| F2C-001 | Figma node to token markup | Confirm a node read produces semantic markup whose every value is an installed token | `Build the summary card from this Figma frame using the tokens our app installs.` | 1. Read the selected frame and record W -> 2. `bash: rg -n '"design-tokens"' package.json` -> 3. load `figma-to-code.md` and the stack markup reference -> 4. propose semantic markup and record the five-pass evidence -> 5. search changed files for literals | W and the state matrix are recorded. Pass 3a records resolved values and Pass 3b records the source search. Pass 4 has one row per variable. Pass 5 records range and access verdicts. Every markup value is an installed token name or a reported gap. Any `NOT RUN` pass gives an `INCOMPLETE` verdict. | Read-only transcript, W and captures, state matrix, render and source checks, variable-to-token table and range and access results | PASS if the markup is semantic, every value maps to an installed token or a reported gap, and all available passes pass. Mark unavailable passes `NOT RUN` with a reason and set the verdict to `INCOMPLETE`. FAIL if a pass fails or is omitted, a raw value replaces an installed token, or a Figma write runs. | Confirm W came from the authored frame. Read each token name against the installed package exports. Treat an unreported pass as a failure, and require `INCOMPLETE` when any pass is `NOT RUN`. |

### Optional Supplemental Checks

Compare each token name in the markup against the installed package's exports; a name that does not resolve is a FAIL even if it exists in a newer package version.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [node-to-token-markup.md](node-to-token-markup.md) | Canonical per-feature execution contract |
| `figma-to-code.md` | Repo path `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`; the construct table, workflow and five-pass check this scenario follows |
| [inspect.md](../../feature-catalog/inspect/inspect.md) | Feature-catalog source for the read-only node surface the scenario starts from |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/figma-cli-reference.md` | Read verbs and the READ-ONLY classification |
| `../../references/tool-surface.md` | READ-ONLY gating taxonomy |

---

## 5. SOURCE METADATA

- Group: Figma To Code
- Playbook ID: F2C-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `figma-to-code/node-to-token-markup.md`
